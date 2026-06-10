<template>
  <div class="app-container" :class="{ 'light-theme': isLightTheme }">
    <!-- Header -->
    <header>
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">AI</div>
          <div class="logo-text">
            <h1>AI 兼职规划助手</h1>
            <p>Side Hustle Smart Planner</p>
          </div>
        </div>

        <div class="header-actions">
          <!-- API Status Badge -->
          <span 
            class="badge status-badge"
            :class="activeConfig.id === 'mock_profile' ? 'badge-warning' : 'badge-success'"
          >
            <span class="status-dot"></span>
            {{ activeConfig.id === 'mock_profile' ? '演示模式 (Mock)' : activeConfig.name }}
          </span>

          <!-- Light/Dark Toggle -->
          <button 
            class="btn-icon" 
            @click="toggleTheme" 
            :aria-label="isLightTheme ? '切换至暗黑模式' : '切换至明亮模式'"
          >
            <SunIcon v-if="isLightTheme" :size="18" />
            <MoonIcon v-else :size="18" />
          </button>

          <!-- Settings Trigger -->
          <button 
            class="btn-icon" 
            @click="isSettingsOpen = true" 
            aria-label="打开设置"
          >
            <SettingsIcon :size="18" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Workspace Content -->
    <main class="content-wrapper">
      <div class="dashboard-grid">
        <!-- Left Side: Config Form & History -->
        <div class="sidebar-column">
          <PlannerForm 
            :is-loading="isLoading" 
            @submit="handleFormSubmit" 
            class="form-card-container"
          />
          
          <HistoryPanel 
            :records="historyRecords" 
            :active-record-id="activeRecordId"
            @select="handleSelectHistory"
            @delete="handleDeleteHistory"
            @clear="handleClearHistory"
            class="history-card-container"
          />
        </div>

        <!-- Right Side: Recommendation Outputs / Welcome -->
        <div class="main-display-column">
          <!-- 1. Loading State -->
          <div v-if="isLoading" class="glass-card loading-container fade-in">
            <div class="cyber-spinner">
              <div class="spinner-circle"></div>
              <div class="spinner-core">AI</div>
            </div>
            <div class="loading-steps">
              <transition name="loading-step-fade" mode="out-in">
                <span :key="loadingStepIndex" class="loading-step-text">
                  {{ loadingSteps[loadingStepIndex] }}
                </span>
              </transition>
              <div class="loading-progress-bar">
                <div class="progress-bar-fill" :style="{ width: loadingPercent + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- 2. Results State -->
          <div v-else-if="recommendations.length > 0" class="fade-in">
            <RecommendationCards 
              :recommendations="recommendations" 
              :saved-hustle-ids="savedHustleIds"
              @save="saveHustle"
              @unsave="unsaveHustle"
            />
          </div>

          <!-- 3. Welcome State (Initial screen) -->
          <div v-else class="glass-card welcome-container fade-in">
            <div class="welcome-hero">
              <div class="hero-graphic">🚀</div>
              <h2>规划您的“第二曲线”</h2>
              <p class="subtitle">输入您的性格、可用时间和条件，AI 将为您智能匹配并生成专属的副业落地实操指南。</p>
            </div>

            <div class="intro-grid">
              <div class="intro-card glass-card">
                <div class="intro-icon">🎯</div>
                <h5>精准度匹配</h5>
                <p>根据您的性格优势和避坑要求进行多维度筛选，推荐最容易起步的方案。</p>
              </div>

              <div class="intro-card glass-card">
                <div class="intro-icon">🛠️</div>
                <h5>落地实操图</h5>
                <p>不仅有推荐，更有 step-by-step 实施路径和真实靠谱的入驻平台推荐。</p>
              </div>

              <div class="intro-card glass-card">
                <div class="intro-icon">🛡️</div>
                <h5>安全防割</h5>
                <p>自动匹配该兼职行业所存在的各类新型虚假兼职与押金骗局，安全第一。</p>
              </div>
            </div>

            <div class="settings-reminder glass-card" v-if="activeConfig.id === 'mock_profile'">
              <InfoIcon :size="16" class="reminder-icon" />
              <div class="reminder-text">
                <strong>提示：</strong>目前处于“演示模式”，生成的方案为模拟方案。如需获取更个性化的 AI 规划，请点击右上角 <SettingsIcon :size="12" /> 配置或选择您自己的大模型 API Key（支持 DeepSeek / Gemini / OpenAI 等）。
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer>
      <p>© 2026 AI兼职规划助手. 纯前端离线运行，保障您的数据隐私安全。</p>
    </footer>

    <!-- Settings Modal -->
    <SettingsModal 
      :is-open="isSettingsOpen"
      @close="isSettingsOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { UserInput, SideHustle, HistoryRecord } from '../types';
import { useSettingsStore } from '../stores/settings';
import { getSideHustleRecommendations } from '../services/gemini';
import PlannerForm from '../components/PlannerForm.vue';
import RecommendationCards from '../components/RecommendationCards.vue';
import HistoryPanel from '../components/HistoryPanel.vue';
import SettingsModal from '../components/SettingsModal.vue';
import { 
  Sun as SunIcon, 
  Moon as MoonIcon, 
  Settings as SettingsIcon,
  Info as InfoIcon
} from 'lucide-vue-next';

// Global Themes
const isLightTheme = ref(false);
const isSettingsOpen = ref(false);
const isLoading = ref(false);

const store = useSettingsStore();

// Recommendations Data
const recommendations = ref<SideHustle[]>([]);
const activeRecordId = ref<string | null>(null);

// History Records
const historyRecords = ref<HistoryRecord[]>([]);

// Saved Individual Hustle IDs for toggle saves
const savedHustles = ref<SideHustle[]>([]);
const savedHustleIds = computed(() => savedHustles.value.map(h => h.id));

// Computed active configuration profile
const activeConfig = computed(() => store.activeConfig);

// Loading Steps Animation State
const loadingStepIndex = ref(0);
const loadingPercent = ref(0);
let loadingInterval: any = null;

const loadingSteps = [
  '🧠 正在解析您的性格、优势特长与偏好限制...',
  '📊 正在从数据库匹配最适合您的副业方向...',
  '🛡️ 正在针对推荐行业匹配防骗避坑安全准则...',
  '🔧 正在生成 step-by-step 的零门槛落地行动路径...',
  '✨ 正在为您生成专属对接平台与实操工具集...'
];

// Start custom loading step animations
const startLoadingAnimation = () => {
  loadingStepIndex.value = 0;
  loadingPercent.value = 0;
  
  const isMock = activeConfig.value.id === 'mock_profile';
  const totalDuration = isMock ? 1500 : 8000; // API usually takes 5-8s
  const stepTime = totalDuration / loadingSteps.length;
  
  // Update step names based on progress
  loadingInterval = setInterval(() => {
    if (loadingStepIndex.value < loadingSteps.length - 1) {
      loadingStepIndex.value++;
    }
    // Boost percentage
    loadingPercent.value = Math.min(
      loadingPercent.value + (100 / loadingSteps.length), 
      95
    );
  }, stepTime);
};

const stopLoadingAnimation = () => {
  if (loadingInterval) {
    clearInterval(loadingInterval);
  }
  loadingPercent.value = 100;
};

// Submit user planner configuration
const handleFormSubmit = async (input: UserInput) => {
  isLoading.value = true;
  recommendations.value = [];
  activeRecordId.value = null;
  startLoadingAnimation();

  try {
    const results = await getSideHustleRecommendations(input, store.activeConfig);
    
    stopLoadingAnimation();
    recommendations.value = results;
    
    // Create new history record
    const newRecord: HistoryRecord = {
      id: 'record_' + Date.now(),
      timestamp: Date.now(),
      input,
      recommendations: results
    };
    
    historyRecords.value.push(newRecord);
    activeRecordId.value = newRecord.id;
    saveHistoryToStorage();
  } catch (error: any) {
    console.error(error);
    alert(`智能规划失败！\n原因：${error?.message || '未知错误，请检查网络或配置。'}`);
  } finally {
    isLoading.value = false;
  }
};

// Select a past history record
const handleSelectHistory = (record: HistoryRecord) => {
  recommendations.value = record.recommendations;
  activeRecordId.value = record.id;
};

// Delete a history record
const handleDeleteHistory = (id: string) => {
  historyRecords.value = historyRecords.value.filter(r => r.id !== id);
  if (activeRecordId.value === id) {
    recommendations.value = [];
    activeRecordId.value = null;
  }
  saveHistoryToStorage();
};

// Clear all history
const handleClearHistory = () => {
  historyRecords.value = [];
  recommendations.value = [];
  activeRecordId.value = null;
  saveHistoryToStorage();
};

const saveHistoryToStorage = () => {
  localStorage.setItem('side_hustle_history', JSON.stringify(historyRecords.value));
};

// Individual Save options
const saveHustle = (hustle: SideHustle) => {
  if (!savedHustles.value.some(h => h.id === hustle.id)) {
    savedHustles.value.push(hustle);
    localStorage.setItem('side_hustle_saved_items', JSON.stringify(savedHustles.value));
  }
};

const unsaveHustle = (id: string) => {
  savedHustles.value = savedHustles.value.filter(h => h.id !== id);
  localStorage.setItem('side_hustle_saved_items', JSON.stringify(savedHustles.value));
};

const toggleTheme = () => {
  isLightTheme.value = !isLightTheme.value;
  localStorage.setItem('side_hustle_light_theme', String(isLightTheme.value));
};

// Initialize settings & history
onMounted(() => {
  // Pinia Store load
  store.loadSettings();

  // Theme load
  const savedTheme = localStorage.getItem('side_hustle_light_theme');
  if (savedTheme) {
    isLightTheme.value = savedTheme === 'true';
  }

  // History load
  const savedHistory = localStorage.getItem('side_hustle_history');
  if (savedHistory) {
    try {
      historyRecords.value = JSON.parse(savedHistory);
    } catch (e) {
      console.error(e);
    }
  }

  // Saved hustles load
  const savedH = localStorage.getItem('side_hustle_saved_items');
  if (savedH) {
    try {
      savedHustles.value = JSON.parse(savedH);
    } catch (e) {
      console.error(e);
    }
  }
});
</script>

<style scoped>
/* Spinner Loader */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 32px;
  height: 100%;
  min-height: 400px;
}

.cyber-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: HSL(var(--primary));
  border-bottom-color: HSL(var(--secondary));
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.spinner-core {
  font-size: 0.95rem;
  font-family: var(--font-heading);
  font-weight: bold;
  background: linear-gradient(135deg, HSL(var(--primary-light)), HSL(var(--secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: pulse-glow-core 2s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse-glow-core {
  0%, 100% { opacity: 0.6; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
}

.loading-steps {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 400px;
}

.loading-step-text {
  font-size: 0.85rem;
  text-align: center;
  min-height: 24px;
  color: var(--text-main);
  font-weight: 500;
}

.loading-progress-bar {
  width: 100%;
  height: 4px;
  background-color: var(--border-color);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, HSL(var(--primary)), HSL(var(--secondary)));
  border-radius: 2px;
  transition: width 0.4s ease-out;
}

/* Loading transitions */
.loading-step-fade-enter-active,
.loading-step-fade-leave-active {
  transition: all 0.25s ease;
}

.loading-step-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.loading-step-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Welcome Container */
.welcome-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 40px;
  text-align: center;
  align-items: center;
  justify-content: center;
  min-height: 450px;
}

.welcome-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.hero-graphic {
  font-size: 3.5rem;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.welcome-hero h2 {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--text-main) 30%, HSL(var(--secondary) / 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-hero .subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  max-width: 480px;
  line-height: 1.5;
}

.intro-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  width: 100%;
}

@media (min-width: 640px) {
  .intro-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.intro-card {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.01);
}

.light-theme .intro-card {
  background-color: rgba(0, 0, 0, 0.01);
}

.intro-icon {
  font-size: 1.5rem;
  background-color: rgba(255,255,255,0.03);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-card h5 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
}

.intro-card p {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.settings-reminder {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  font-size: 0.75rem;
  text-align: left;
  max-width: 600px;
}

.reminder-icon {
  color: HSL(var(--warning));
  flex-shrink: 0;
  margin-top: 2px;
}

.reminder-text {
  color: var(--text-muted);
  line-height: 1.4;
}

.reminder-text strong {
  color: var(--text-main);
}

.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.main-display-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
