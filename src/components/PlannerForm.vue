<template>
  <div class="glass-card planner-form-container">
    <!-- Progress Header -->
    <div class="form-progress">
      <div 
        v-for="stepNum in 3" 
        :key="stepNum"
        class="progress-step"
        :class="{ 
          'active': currentStep === stepNum, 
          'completed': currentStep > stepNum 
        }"
      >
        <div class="step-badge">
          <CheckIcon v-if="currentStep > stepNum" :size="14" />
          <span v-else>{{ stepNum }}</span>
        </div>
        <span class="step-text">{{ stepTitles[stepNum - 1] }}</span>
      </div>
    </div>

    <!-- Step Content -->
    <div class="form-content">
      <!-- Step 1: Base Info & Time -->
      <div v-if="currentStep === 1" class="step-pane fade-in">
        <h4 class="section-title">第一步：基础情况与可用时间</h4>
        
        <div class="form-group">
          <label class="form-label">您的身份角色</label>
          <div class="option-cards-grid">
            <div 
              v-for="role in roleOptions" 
              :key="role.value"
              class="option-card"
              :class="{ 'active': formData.role === role.value }"
              @click="formData.role = role.value"
            >
              <span class="option-icon">{{ role.icon }}</span>
              <div class="option-details">
                <span class="option-title">{{ role.label }}</span>
                <span class="option-desc">{{ role.desc }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">年龄段</label>
          <div class="tag-grid">
            <button 
              v-for="age in ageOptions" 
              :key="age.value"
              type="button"
              class="tag-btn"
              :class="{ 'active': formData.ageGroup === age.value }"
              @click="formData.ageGroup = age.value"
            >
              {{ age.label }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <div class="slider-header">
            <label class="form-label">每周可用于兼职的时间</label>
            <span class="slider-value"><strong>{{ formData.weeklyHours }}</strong> 小时</span>
          </div>
          <input 
            type="range" 
            min="2" 
            max="40" 
            step="1" 
            v-model.number="formData.weeklyHours"
            class="range-slider"
          />
          <div class="slider-limits">
            <span>2小时</span>
            <span>20小时</span>
            <span>40小时+</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">适合兼职的时段（多选）</label>
          <div class="tag-grid">
            <button 
              v-for="slot in timeSlotOptions" 
              :key="slot.value"
              type="button"
              class="tag-btn"
              :class="{ 'active': formData.timeSlots.includes(slot.value) }"
              @click="toggleTimeSlot(slot.value)"
            >
              <CalendarIcon :size="12" />
              {{ slot.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: Personality & Talents -->
      <div v-if="currentStep === 2" class="step-pane fade-in">
        <h4 class="section-title">第二步：性格特质与个人特长</h4>

        <div class="form-group">
          <label class="form-label">您的性格特质（多选）</label>
          <div class="tag-grid">
            <button 
              v-for="pers in personalityOptions" 
              :key="pers.value"
              type="button"
              class="tag-btn"
              :class="{ 'active': formData.personalities.includes(pers.value) }"
              @click="togglePersonality(pers.value)"
            >
              <SmileIcon :size="12" />
              {{ pers.label }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">您拥有的技能或兴趣（多选）</label>
          <div class="tag-grid">
            <button 
              v-for="skill in skillOptions" 
              :key="skill.value"
              type="button"
              class="tag-btn"
              :class="{ 'active': formData.skills.includes(skill.value) }"
              @click="toggleSkill(skill.value)"
            >
              <SparklesIcon :size="12" />
              {{ skill.label }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="customDesc">补充说明（如所学专业、其他具体特长或期许）</label>
          <textarea 
            id="customDesc" 
            v-model="formData.customDescription" 
            class="form-textarea" 
            rows="4"
            placeholder="例如：我是一名英语专业的学生，平时喜欢看英美剧，希望能找一些翻译或文字类工作，但不想做任何打电话的兼职..."
          ></textarea>
        </div>
      </div>

      <!-- Step 3: Constraints & Earnings -->
      <div v-if="currentStep === 3" class="step-pane fade-in">
        <h4 class="section-title">第三步：收益预期与限制条件</h4>

        <div class="form-group">
          <label class="form-label">期望的兼职收益</label>
          <div class="earnings-grid">
            <div 
              v-for="earn in earningOptions" 
              :key="earn.value"
              class="option-card"
              :class="{ 'active': formData.targetEarnings === earn.value }"
              @click="formData.targetEarnings = earn.value"
            >
              <span class="option-icon">{{ earn.icon }}</span>
              <div class="option-details">
                <span class="option-title">{{ earn.label }}</span>
                <span class="option-desc">{{ earn.desc }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">规避与限制条件（不想做/多选）</label>
          <div class="tag-grid">
            <button 
              v-for="c in constraintOptions" 
              :key="c.value"
              type="button"
              class="tag-btn"
              :class="{ 'active': formData.constraints.includes(c.value) }"
              @click="toggleConstraint(c.value)"
            >
              <AlertOctagonIcon :size="12" />
              {{ c.label }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">生成推荐数量</label>
          <div class="tag-grid">
            <button 
              v-for="count in [2, 3, 4, 5, 6, 7, 8, 9, 10]" 
              :key="count"
              type="button"
              class="tag-btn"
              :class="{ 'active': formData.recommendCount === count }"
              @click="formData.recommendCount = count"
            >
              {{ count }}条{{ count === 3 ? ' (推荐)' : '' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="validationError" class="validation-error">
      <AlertCircleIcon :size="16" />
      <span>{{ validationError }}</span>
    </div>

    <!-- Navigation Footer -->
    <div class="form-actions">
      <button 
        type="button" 
        class="btn btn-secondary" 
        :disabled="currentStep === 1"
        @click="prevStep"
      >
        <ArrowLeftIcon :size="16" /> 上一步
      </button>

      <button 
        v-if="currentStep < 3"
        type="button" 
        class="btn btn-primary" 
        @click="nextStep"
      >
        下一步 <ArrowRightIcon :size="16" />
      </button>

      <button 
        v-else
        type="button" 
        class="btn btn-primary generate-btn" 
        :disabled="isLoading"
        @click="submitForm"
      >
        <SparklesIcon :size="16" /> {{ isLoading ? 'AI 规划中...' : '生成副业规划方案' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { UserInput } from '../types';
import { 
  Check as CheckIcon, 
  ArrowLeft as ArrowLeftIcon, 
  ArrowRight as ArrowRightIcon,
  Calendar as CalendarIcon, 
  Smile as SmileIcon, 
  Sparkles as SparklesIcon,
  AlertOctagon as AlertOctagonIcon,
  AlertCircle as AlertCircleIcon 
} from 'lucide-vue-next';

defineProps<{
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: UserInput): void;
}>();

const currentStep = ref(1);
const validationError = ref('');

const stepTitles = ['基本情况 & 时间', '特质与技能', '预期与限制'];

// Initial Form State
const formData = ref<UserInput>({
  ageGroup: '25-34',
  role: 'employee',
  weeklyHours: 10,
  timeSlots: ['weekdays_evening', 'weekends_day'],
  personalities: ['introvert', 'detail'],
  skills: [],
  customDescription: '',
  targetEarnings: '300-800',
  constraints: ['no_initial_capital'],
  recommendCount: 3
});

// Options Definitions
const roleOptions = [
  { value: 'student', label: '在校学生', desc: '时间较充裕，寻求无门槛或技能成长型', icon: '🎓' },
  { value: 'employee', label: '在职白领', desc: '利用工作之余变现，偏好高效率线上兼职', icon: '💼' },
  { value: 'freelancer', label: '自由职业', desc: '可承接大块项目，注重客单价与技能交付', icon: '🎨' },
  { value: 'parent', label: '宝妈/宝爸', desc: '空闲碎片且不规律，侧重居家、手机随时可做', icon: '🏡' },
  { value: 'unemployed', label: '待业/其他', desc: '时间充沛，期望能转化为全职方向的过渡兼职', icon: '⚡' }
];

const ageOptions = [
  { value: '18-24', label: '18-24 岁' },
  { value: '25-34', label: '25-34 岁' },
  { value: '35-49', label: '35-49 岁' },
  { value: '50+', label: '50 岁以上' }
];

const timeSlotOptions = [
  { value: 'weekdays_evening', label: '工作日晚间' },
  { value: 'weekends_day', label: '周末白天' },
  { value: 'weekends_night', label: '周末晚间' },
  { value: 'weekdays_day', label: '工作日白天' },
  { value: 'flexible', label: '碎片化灵活时间' }
];

const personalityOptions = [
  { value: 'introvert', label: '内向专注' },
  { value: 'extrovert', label: '外向社交' },
  { value: 'analytical', label: '理性分析' },
  { value: 'creative', label: '创意活跃' },
  { value: 'detail', label: '细心耐心' },
  { value: 'practical', label: '踏实执行' }
];

const skillOptions = [
  { value: 'writing', label: '文字写作' },
  { value: 'design', label: '设计排版' },
  { value: 'coding', label: '编程开发' },
  { value: 'teaching', label: '辅导讲授' },
  { value: 'video', label: '视频剪辑' },
  { value: 'translation', label: '语言翻译' },
  { value: 'driving', label: '驾驶出行' },
  { value: 'sales', label: '销售推广' },
  { value: 'none', label: '新手摸索(暂无专业特长)' }
];

const earningOptions = [
  { value: '50-200', label: '赚点零花钱', desc: '50-200元/周，极简门槛，空闲随时可做', icon: '🥤' },
  { value: '300-800', label: '小有所获', desc: '300-800元/周，有一定门槛，需要技能或稳定时间', icon: '💰' },
  { value: '1000+', label: '主业级创收', desc: '1000元+/周，硬核技术/自媒体运营等高价值兼职', icon: '💎' }
];

const constraintOptions = [
  { value: 'no_face_to_face', label: '非面对面/不露脸' },
  { value: 'no_initial_capital', label: '零启动资金(不买设备)' },
  { value: 'must_use_pc', label: '必须使用电脑完成' },
  { value: 'no_coding', label: '技术要求低/不要写代码' },
  { value: 'fast_payout', label: '返账结账快(日结/周结)' }
];

// Helper Functions
const toggleTimeSlot = (val: string) => {
  const idx = formData.value.timeSlots.indexOf(val);
  if (idx > -1) formData.value.timeSlots.splice(idx, 1);
  else formData.value.timeSlots.push(val);
};

const togglePersonality = (val: string) => {
  const idx = formData.value.personalities.indexOf(val);
  if (idx > -1) formData.value.personalities.splice(idx, 1);
  else formData.value.personalities.push(val);
};

const toggleSkill = (val: string) => {
  const idx = formData.value.skills.indexOf(val);
  if (idx > -1) formData.value.skills.splice(idx, 1);
  else {
    // If 'none' is selected, clear others, and vice versa
    if (val === 'none') {
      formData.value.skills = ['none'];
    } else {
      const noneIdx = formData.value.skills.indexOf('none');
      if (noneIdx > -1) formData.value.skills.splice(noneIdx, 1);
      formData.value.skills.push(val);
    }
  }
};

const toggleConstraint = (val: string) => {
  const idx = formData.value.constraints.indexOf(val);
  if (idx > -1) formData.value.constraints.splice(idx, 1);
  else formData.value.constraints.push(val);
};

// Form Wizard Navigation
const validateStep = (step: number): boolean => {
  validationError.value = '';
  if (step === 1) {
    if (!formData.value.role) {
      validationError.value = '请选择您的身份角色';
      return false;
    }
    if (!formData.value.ageGroup) {
      validationError.value = '请选择您的年龄段';
      return false;
    }
    if (formData.value.timeSlots.length === 0) {
      validationError.value = '请至少选择一个适合兼职的时段';
      return false;
    }
  } else if (step === 2) {
    if (formData.value.personalities.length === 0) {
      validationError.value = '请至少选择一个您的性格特质';
      return false;
    }
    if (formData.value.skills.length === 0) {
      validationError.value = '请至少选择一个您的技能特长或选择暂无特长';
      return false;
    }
  }
  return true;
};

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++;
  }
};

const prevStep = () => {
  validationError.value = '';
  currentStep.value--;
};

const submitForm = () => {
  if (validateStep(3)) {
    emit('submit', { ...formData.value });
  }
};
</script>

<style scoped>
.planner-form-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-title {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: HSL(var(--secondary) / 0.95);
  font-weight: 600;
}

/* Wizard Stepper Header */
.form-progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;
  position: relative;
}

.form-progress::before {
  content: "";
  position: absolute;
  top: 16px;
  left: 30px;
  right: 30px;
  height: 2px;
  background-color: var(--border-color);
  z-index: 1;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
  flex: 1;
}

.step-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  transition: var(--transition-smooth);
}

.step-text {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
  transition: var(--transition-smooth);
}

.progress-step.active .step-badge {
  border-color: HSL(var(--primary));
  color: HSL(var(--primary));
  background-color: HSL(var(--primary) / 0.1);
  box-shadow: 0 0 10px HSL(var(--primary) / 0.3);
}

.progress-step.active .step-text {
  color: var(--text-main);
  font-weight: 600;
}

.progress-step.completed .step-badge {
  border-color: HSL(var(--secondary));
  background: linear-gradient(135deg, HSL(var(--primary)), HSL(var(--secondary)));
  color: white;
}

.progress-step.completed .step-text {
  color: HSL(var(--secondary-rgb));
}

/* Option Cards for Role and Earnings */
.option-cards-grid, .earnings-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-color);
  border-radius: var(--button-radius);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.light-theme .option-card {
  background-color: rgba(0, 0, 0, 0.01);
}

.option-card:hover {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: var(--border-color-hover);
}

.option-card.active {
  border-color: HSL(var(--primary));
  background: linear-gradient(135deg, HSL(var(--primary) / 0.08), HSL(var(--secondary) / 0.08));
  box-shadow: 0 0 14px HSL(var(--primary) / 0.1);
}

.option-icon {
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.04);
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
}

.option-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Slider Style */
.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.slider-value {
  font-size: 0.95rem;
  color: HSL(var(--secondary-rgb));
}

.range-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  margin: 12px 0 6px 0;
}

.light-theme .range-slider {
  background: rgba(0, 0, 0, 0.1);
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, HSL(var(--primary)), HSL(var(--secondary)));
  cursor: pointer;
  box-shadow: 0 0 10px HSL(var(--primary) / 0.5);
  transition: transform 0.1s;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slider-limits {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Actions Footer */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-top: 24px;
}

.form-actions .btn {
  flex: 1;
}

.generate-btn {
  box-shadow: 0 4px 18px HSL(var(--primary) / 0.4);
  animation: pulse-glow 3s infinite;
}

/* Error Banner */
.validation-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: HSL(var(--danger) / 0.1);
  border: 1px solid HSL(var(--danger) / 0.25);
  color: HSL(var(--danger) / 0.95);
  padding: 10px 14px;
  border-radius: var(--button-radius);
  font-size: 0.8rem;
  margin-top: 16px;
  animation: slideUp 0.2s ease-out;
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
