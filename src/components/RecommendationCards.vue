<template>
  <div class="results-container">
    <div class="results-header">
      <div class="title-area">
        <h3>✨ 智能规划为您推荐的副业</h3>
        <p>基于您的性格特质与时间限制为您量身定制的兼职路径</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary btn-sm" @click="exportAllToMarkdown">
          <DownloadIcon :size="14" /> 导出全部方案
        </button>
      </div>
    </div>

    <!-- Recommendations List -->
    <div class="cards-list">
      <div 
        v-for="(hustle, idx) in recommendations" 
        :key="hustle.id" 
        class="glass-card hustle-card"
        :class="{ 'expanded': activeCardId === hustle.id }"
        :style="{ '--delay-idx': idx }"
      >
        <!-- Card Brief Header -->
        <div class="card-brief" @click="toggleCard(hustle.id)">
          <!-- Circular Progress Match Score -->
          <div class="match-score-circle">
            <svg class="progress-ring" width="56" height="56">
              <circle class="ring-bg" stroke="rgba(255,255,255,0.05)" stroke-width="4" fill="transparent" r="24" cx="28" cy="28"/>
              <circle 
                class="ring-progress" 
                stroke="url(#gradient-primary)" 
                stroke-width="4" 
                fill="transparent" 
                r="24" 
                cx="28" 
                cy="28"
                :stroke-dasharray="2 * Math.PI * 24"
                :stroke-dashoffset="2 * Math.PI * 24 * (1 - hustle.matchScore / 100)"
              />
              <defs>
                <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="HSL(var(--primary))" />
                  <stop offset="100%" stop-color="HSL(var(--secondary))" />
                </linearGradient>
              </defs>
            </svg>
            <span class="match-percent">{{ hustle.matchScore }}%</span>
          </div>

          <div class="brief-info">
            <div class="title-row">
              <h4>{{ hustle.title }}</h4>
              <span class="badge badge-primary">{{ hustle.category }}</span>
            </div>
            <p class="brief-reason">{{ hustle.reason }}</p>

            <div class="brief-metrics">
              <span class="metric-item">
                <DollarSignIcon :size="12" class="icon-inline" /> 估算收益: <strong class="highlight-text">{{ hustle.estimatedIncome }}</strong>
              </span>
              <span class="metric-divider">|</span>
              <span class="metric-item">
                <ShieldAlertIcon :size="12" class="icon-inline" /> 难度: 
                <span :class="getDifficultyClass(hustle.difficulty)">{{ hustle.difficulty }}</span>
              </span>
              <span class="metric-divider">|</span>
              <span class="metric-item">
                <ClockIcon :size="12" class="icon-inline" /> 准备期: <strong>{{ hustle.prepTime }}</strong>
              </span>
            </div>
          </div>

          <div class="chevron-action">
            <ChevronDownIcon :size="20" class="chevron-icon" />
          </div>
        </div>

        <!-- Expanded Details (Tabs style) -->
        <div v-if="activeCardId === hustle.id" class="card-details-pane">
          <!-- Details Navigation Tabs -->
          <div class="details-tabs">
            <button 
              v-for="tab in tabOptions" 
              :key="tab.value"
              class="tab-nav"
              :class="{ 'active': activeTab === tab.value }"
              @click="activeTab = tab.value"
            >
              <component :is="tab.icon" :size="14" />
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab Content Panes -->
          <div class="tab-content">
            <!-- 1. Overview Tab -->
            <div v-if="activeTab === 'overview'" class="tab-pane fade-in">
              <p class="tab-intro-reason"><strong>为什么适合您：</strong>{{ hustle.reason }}</p>
              
              <div class="pros-cons-grid">
                <div class="pro-column">
                  <h5 class="col-title text-success"><CheckCircleIcon :size="14" /> 优势亮点</h5>
                  <ul>
                    <li v-for="(pro, i) in hustle.pros" :key="i">{{ pro }}</li>
                  </ul>
                </div>
                
                <div class="con-column">
                  <h5 class="col-title text-danger"><AlertCircleIcon :size="14" /> 挑战限制</h5>
                  <ul>
                    <li v-for="(con, i) in hustle.cons" :key="i">{{ con }}</li>
                  </ul>
                </div>
              </div>

              <div class="requirements-box">
                <h5 class="col-title"><ToolIcon :size="14" /> 准备清单</h5>
                <div class="requirements-flex">
                  <div class="req-item">
                    <strong>必备设备：</strong>{{ hustle.requiredEquipment.join('、') }}
                  </div>
                  <div class="req-item">
                    <strong>核心技能：</strong>{{ hustle.requiredSkills.join('、') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Action Plan Tab -->
            <div v-if="activeTab === 'plan'" class="tab-pane fade-in">
              <div class="timeline">
                <div 
                  v-for="(step, i) in hustle.actionPlan" 
                  :key="i"
                  class="timeline-item"
                >
                  <div class="timeline-badge">{{ i + 1 }}</div>
                  <div class="timeline-content">
                    <p>{{ step }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Platforms Tab -->
            <div v-if="activeTab === 'platforms'" class="tab-pane fade-in">
              <div class="platforms-grid">
                <div 
                  v-for="(platform, i) in hustle.platforms" 
                  :key="i"
                  class="platform-card glass-card"
                >
                  <div class="platform-header">
                    <h6>{{ platform.name }}</h6>
                    <a 
                      v-if="isValidUrl(platform.url)" 
                      :href="platform.url" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="platform-link-btn"
                    >
                      访问官网 <ExternalLinkIcon :size="12" />
                    </a>
                    <span v-else class="platform-meta">{{ platform.url }}</span>
                  </div>
                  <p class="platform-desc">{{ platform.desc }}</p>
                </div>
              </div>
            </div>

            <!-- 4. Risk Warn Tab -->
            <div v-if="activeTab === 'warning'" class="tab-pane fade-in">
              <div class="warning-banner-box">
                <div class="warning-header-icon">
                  <ShieldAlertIcon :size="24" />
                  <h5>防骗防割韭菜预警</h5>
                </div>
                <p class="warning-body">{{ hustle.scamWarning }}</p>
                <div class="safety-tips">
                  <h6>💡 黄金安全守则：</h6>
                  <ul>
                    <li>⚠️ **坚决不交任何前置费用**：押金、押机费、软件购买费、培训费统统不交。</li>
                    <li>⚠️ **警惕引流刷单**：以网店客服或打字员面试为名，要求去第三方刷单的均是诈骗。</li>
                    <li>⚠️ **保护个人隐私**：不要提供银行卡密码、验证码或手持身份证件照片。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Individual Card Actions -->
          <div class="card-actions">
            <button class="btn btn-secondary btn-sm" @click="copyToClipboard(hustle)">
              <CopyIcon :size="14" /> 复制文字大纲
            </button>
            <button 
              class="btn btn-sm"
              :class="isSaved(hustle.id) ? 'btn-secondary' : 'btn-primary'"
              @click="toggleSave(hustle)"
            >
              <BookmarkIcon :size="14" :fill="isSaved(hustle.id) ? 'currentColor' : 'none'" /> 
              {{ isSaved(hustle.id) ? '已收藏规划' : '收藏此方案' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { SideHustle } from '../types';
import { 
  Download as DownloadIcon,
  ChevronDown as ChevronDownIcon,
  DollarSign as DollarSignIcon,
  ShieldAlert as ShieldAlertIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Wrench as ToolIcon,
  ExternalLink as ExternalLinkIcon,
  Info as InfoIcon,
  ListOrdered as PlanIcon,
  Link as PlatformIcon,
  Bookmark as BookmarkIcon,
  Copy as CopyIcon
} from 'lucide-vue-next';

const props = defineProps<{
  recommendations: SideHustle[];
  savedHustleIds: string[];
}>();

const emit = defineEmits<{
  (e: 'save', hustle: SideHustle): void;
  (e: 'unsave', id: string): void;
}>();

const activeCardId = ref<string>('');
const activeTab = ref<string>('overview');

const tabOptions = [
  { value: 'overview', label: '方案概览', icon: InfoIcon },
  { value: 'plan', label: '实操步骤', icon: PlanIcon },
  { value: 'platforms', label: '对接渠道', icon: PlatformIcon },
  { value: 'warning', label: '避坑预警', icon: ShieldAlertIcon }
];

const toggleCard = (id: string) => {
  if (activeCardId.value === id) {
    activeCardId.value = '';
  } else {
    activeCardId.value = id;
    activeTab.value = 'overview'; // reset tab when opening a new card
  }
};

const getDifficultyClass = (diff: string) => {
  if (diff === '简单' || diff === 'Easy') return 'badge badge-success';
  if (diff === '中等' || diff === 'Medium') return 'badge badge-warning';
  return 'badge badge-danger';
};

const isValidUrl = (url: string) => {
  return url.startsWith('http://') || url.startsWith('https://');
};

const isSaved = (id: string) => {
  return props.savedHustleIds.includes(id);
};

const toggleSave = (hustle: SideHustle) => {
  if (isSaved(hustle.id)) {
    emit('unsave', hustle.id);
  } else {
    emit('save', hustle);
  }
};

// Copy markdown output of a single plan
const copyToClipboard = (hustle: SideHustle) => {
  const text = generateHustleMarkdown(hustle);
  navigator.clipboard.writeText(text).then(() => {
    alert('方案大纲已成功复制到剪贴板！');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
};

const generateHustleMarkdown = (hustle: SideHustle): string => {
  return `### 兼职名称：${hustle.title} [匹配度: ${hustle.matchScore}%]
- **类别**: ${hustle.category}
- **预计收益**: ${hustle.estimatedIncome}
- **起步难度**: ${hustle.difficulty}
- **准备周期**: ${hustle.prepTime}

#### 1. 为什么推荐该兼职：
${hustle.reason}

#### 2. 优势亮点：
${hustle.pros.map(p => `* ${p}`).join('\n')}

#### 3. 潜在挑战：
${hustle.cons.map(c => `* ${c}`).join('\n')}

#### 4. 实操行动指南：
${hustle.actionPlan.map((step, i) => `${i+1}. ${step}`).join('\n')}

#### 5. 对接平台与工具：
${hustle.platforms.map(p => `* **${p.name}** (${p.url}): ${p.desc}`).join('\n')}

#### ⚠️ 避坑防骗预警：
${hustle.scamWarning}
`;
};

// Export all recommendations as a .md file download
const exportAllToMarkdown = () => {
  let markdown = `# AI 智能兼职规划方案列表\n\n*生成时间: ${new Date().toLocaleString()}*\n\n---\n\n`;
  props.recommendations.forEach((hustle) => {
    markdown += generateHustleMarkdown(hustle) + '\n\n---\n\n';
  });

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `AI副业规划_${new Date().toISOString().slice(0,10)}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
.results-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 16px;
}

.title-area h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  background: linear-gradient(135deg, var(--text-main), HSL(var(--secondary) / 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-area p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Hustle Card Styling */
.hustle-card {
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) calc(var(--delay-idx) * 0.15s) both;
}

.hustle-card:hover {
  transform: translateY(-2px);
}

.hustle-card.expanded {
  border-color: HSL(var(--primary) / 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px HSL(var(--primary) / 0.1);
}

/* Brief View Styling */
.card-brief {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  cursor: pointer;
  user-select: none;
}

.match-score-circle {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  transform: rotate(-90deg);
}

.ring-progress {
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.match-percent {
  position: absolute;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
}

.brief-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0; /* allows text truncation */
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.title-row h4 {
  font-size: 1.1rem;
  color: var(--text-main);
  font-weight: 600;
}

.brief-reason {
  font-size: 0.85rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brief-metrics {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--text-muted);
  flex-wrap: wrap;
  margin-top: 4px;
}

.highlight-text {
  color: HSL(var(--secondary-rgb));
}

.metric-divider {
  opacity: 0.2;
}

.chevron-action {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.expanded .chevron-icon {
  transform: rotate(180deg);
  color: HSL(var(--primary-light));
}

/* Expanded Card Body Tabs */
.card-details-pane {
  border-top: 1px solid var(--border-color);
  background-color: rgba(8, 11, 22, 0.2);
  animation: fadeIn 0.3s ease-out;
}

.details-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background-color: rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.tab-nav {
  flex: 1;
  min-width: 90px;
  padding: 12px 8px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: var(--transition-smooth);
  white-space: nowrap;
}

.tab-nav:hover {
  color: var(--text-main);
  background-color: rgba(255,255,255,0.02);
}

.tab-nav.active {
  color: HSL(var(--secondary-rgb));
  border-bottom-color: HSL(var(--secondary));
  background-color: rgba(255,255,255,0.04);
}

/* Tab Content */
.tab-content {
  padding: 20px;
}

.tab-intro-reason {
  font-size: 0.9rem;
  margin-bottom: 16px;
  line-height: 1.5;
}

.pros-cons-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

@media (min-width: 768px) {
  .pros-cons-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.pro-column, .con-column {
  background-color: rgba(255, 255, 255, 0.01);
  border: 1px solid var(--border-color);
  border-radius: var(--button-radius);
  padding: 14px;
}

.col-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-success { color: HSL(var(--success)); }
.text-danger { color: HSL(var(--danger)); }

.pro-column ul, .con-column ul {
  list-style: none;
}

.pro-column li, .con-column li {
  font-size: 0.8rem;
  position: relative;
  padding-left: 14px;
  margin-bottom: 6px;
  color: var(--text-muted);
}

.pro-column li::before {
  content: "•";
  color: HSL(var(--success));
  position: absolute;
  left: 0;
}

.con-column li::before {
  content: "•";
  color: HSL(var(--danger));
  position: absolute;
  left: 0;
}

.requirements-box {
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px dashed var(--border-color);
  border-radius: var(--button-radius);
  padding: 14px;
}

.requirements-flex {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

@media (min-width: 640px) {
  .requirements-flex {
    flex-direction: row;
    justify-content: space-between;
  }
}

.req-item {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Timeline/Plan Design */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 15px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background-color: var(--border-color);
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 16px;
}

.timeline-badge {
  position: absolute;
  left: -20px;
  top: 2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  border: 2px solid HSL(var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: HSL(var(--primary-light));
  z-index: 2;
}

.timeline-content {
  background-color: rgba(255, 255, 255, 0.015);
  border: 1px solid var(--border-color);
  border-radius: var(--button-radius);
  padding: 10px 14px;
  flex: 1;
}

.timeline-content p {
  font-size: 0.85rem;
  color: var(--text-main);
}

/* Platforms Tab Design */
.platforms-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.platform-card {
  padding: 14px;
  background-color: rgba(255, 255, 255, 0.02);
}

.platform-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.platform-header h6 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
}

.platform-link-btn {
  font-size: 0.75rem;
  color: HSL(var(--secondary-rgb));
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: HSL(var(--secondary) / 0.08);
  border-radius: 4px;
  border: 1px solid HSL(var(--secondary) / 0.2);
  transition: var(--transition-smooth);
}

.platform-link-btn:hover {
  background-color: HSL(var(--secondary) / 0.15);
  transform: translateY(-1px);
}

.platform-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.platform-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Risk Warning View styling */
.warning-banner-box {
  background-color: HSL(var(--danger) / 0.04);
  border: 1px solid HSL(var(--danger) / 0.2);
  border-radius: var(--button-radius);
  padding: 16px;
}

.warning-header-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  color: HSL(var(--danger) / 0.95);
  margin-bottom: 8px;
}

.warning-header-icon h5 {
  font-size: 0.95rem;
  font-weight: 600;
}

.warning-body {
  font-size: 0.85rem;
  color: var(--text-main);
  line-height: 1.6;
}

.safety-tips {
  margin-top: 14px;
  border-top: 1px solid HSL(var(--danger) / 0.15);
  padding-top: 10px;
}

.safety-tips h6 {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.safety-tips ul {
  list-style: none;
}

.safety-tips li {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 4px;
  line-height: 1.4;
}

/* Actions Bar */
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 14px 20px;
  background-color: rgba(0, 0, 0, 0.15);
  border-top: 1px solid var(--border-color);
}

.btn-sm {
  padding: 8px 14px;
  font-size: 0.8rem;
}
</style>
