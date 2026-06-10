<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content glass-card settings-modal">
      
      <!-- Modal Header -->
      <div class="modal-header">
        <h3>
          <button 
            v-if="isEditing || isAdding" 
            class="back-btn btn-icon-small" 
            @click="cancelEdit" 
            title="返回列表"
          >
            <ChevronLeftIcon :size="16" />
          </button>
          <SlidersIcon class="icon-inline" /> 
          {{ isEditing ? '编辑 API 配置' : (isAdding ? '添加 API 配置' : 'API 配置管理') }}
        </h3>
        <button class="btn-icon close-btn" @click="close" aria-label="关闭">
          <XIcon :size="18" />
        </button>
      </div>

      <!-- VIEW 1: Profile List Manager -->
      <div v-if="!isEditing && !isAdding" class="modal-body">
        <p class="section-desc-top">选择当前激活的 AI 服务配置，或添加不同的供应商账号：</p>
        
        <div class="config-list">
          <!-- Active Config Items -->
          <div 
            v-for="cfg in store.configs" 
            :key="cfg.id"
            class="config-list-item glass-card"
            :class="{ 'active': store.activeConfigId === cfg.id }"
            @click="store.setActiveConfig(cfg.id)"
          >
            <div class="config-radio">
              <span class="radio-dot"></span>
            </div>
            
            <div class="config-meta">
              <span class="config-name-text">{{ cfg.name }}</span>
              <div class="config-badges">
                <span class="badge badge-sm badge-primary">{{ getDomainLabel(cfg) }}</span>
                <span class="badge badge-sm badge-secondary truncate-model">{{ cfg.model }}</span>
              </div>
            </div>

            <!-- Action buttons (Not allowed to edit/delete mock mode) -->
            <div class="config-item-actions" @click.stop v-if="cfg.id !== 'mock_profile'">
              <button class="action-icon-btn" @click="startEdit(cfg)" title="编辑">
                <EditIcon :size="14" />
              </button>
              <button class="action-icon-btn delete" @click="deleteConfig(cfg.id)" title="删除">
                <TrashIcon :size="14" />
              </button>
            </div>
            <div class="config-item-actions" v-else>
              <span class="sys-badge">系统</span>
            </div>
          </div>
        </div>

        <button class="btn btn-secondary add-new-btn" @click="startAdd">
          <PlusIcon :size="16" /> 添加新配置
        </button>
      </div>

      <!-- VIEW 2: Add / Edit Form -->
      <div v-else class="modal-body edit-form-body">
        <!-- Form fields -->
        <div class="form-group">
          <label class="form-label" for="cfgName">配置名称</label>
          <input 
            type="text" 
            id="cfgName" 
            v-model="editConfig.name" 
            class="form-input" 
            placeholder="例如：我的 DeepSeek Key"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="cfgBaseUrl">接口基地址 (Base URL)</label>
          <input 
            type="text" 
            id="cfgBaseUrl" 
            v-model="editConfig.baseUrl" 
            class="form-input" 
            placeholder="https://api.openai.com/v1 或 https://api.deepseek.com"
          />
          <p class="field-help-text">
            如果是原生 Gemini，可填 `https://generativelanguage.googleapis.com`。
          </p>
        </div>

        <div class="form-group">
          <label class="form-label" for="cfgApiKey">API Key</label>
          <div class="input-with-icon">
            <input 
              :type="showKey ? 'text' : 'password'" 
              id="cfgApiKey" 
              v-model="editConfig.apiKey" 
              class="form-input" 
              placeholder="sk-... 或 AIzaSy..."
            />
            <button type="button" class="icon-btn-inside" @click="showKey = !showKey">
              <EyeIcon v-if="!showKey" :size="16" />
              <EyeOffIcon v-else :size="16" />
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="cfgModel">模型名称 (Model)</label>
          <input 
            type="text" 
            id="cfgModel" 
            v-model="editConfig.model" 
            class="form-input" 
            placeholder="例如: gpt-4o-mini 或 deepseek-chat 或 gemini-1.5-flash"
          />
        </div>

        <!-- Connection Test Area -->
        <div class="connection-test-area">
          <button 
            type="button" 
            class="btn btn-secondary test-btn" 
            :disabled="isTesting"
            @click="runConnectionTest"
          >
            <LoaderIcon v-if="isTesting" :size="14" class="spin icon-inline" />
            <PlayIcon v-else :size="14" class="icon-inline" />
            测试接口连接
          </button>
          
          <div v-if="testResult !== null" class="test-result-status">
            <span v-if="testResult === true" class="text-success-status">
              <CheckCircleIcon :size="16" /> 连接成功！配置可用。
            </span>
            <span v-else class="text-danger-status" :title="testErrorMessage">
              <AlertCircleIcon :size="16" /> 连接失败，请检查参数
            </span>
          </div>
        </div>

        <!-- Test Error Display Box -->
        <div v-if="testErrorMessage" class="test-error-box">
          <code>{{ testErrorMessage }}</code>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <div v-if="isEditing || isAdding" class="edit-footer-buttons">
          <button class="btn btn-secondary" @click="cancelEdit">取消</button>
          <button class="btn btn-primary" @click="saveConfig">保存配置</button>
        </div>
        <button v-else class="btn btn-primary w-full" @click="close">
          关闭设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ApiConfig } from '../types';
import { useSettingsStore } from '../stores/settings';
import { testApiConnection } from '../services/gemini';
import { 
  Sliders as SlidersIcon, 
  X as XIcon, 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon, 
  Plus as PlusIcon,
  Trash2 as TrashIcon,
  Edit2 as EditIcon,
  ChevronLeft as ChevronLeftIcon,
  Play as PlayIcon,
  Loader as LoaderIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon
} from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const store = useSettingsStore();

// Flags
const isEditing = ref(false);
const isAdding = ref(false);
const showKey = ref(false);
const isTesting = ref(false);
const testResult = ref<boolean | null>(null);
const testErrorMessage = ref('');

// Edit buffer config
const editConfig = ref<ApiConfig>({
  id: '',
  name: '',
  apiKey: '',
  baseUrl: '',
  model: ''
});

const getDomainLabel = (cfg: ApiConfig) => {
  if (cfg.id === 'mock_profile') return '本地演示';
  try {
    const urlObj = new URL(cfg.baseUrl.trim());
    return urlObj.hostname;
  } catch {
    return '自定义基地址';
  }
};

// Start adding new configuration
const startAdd = () => {
  isAdding.value = true;
  testResult.value = null;
  testErrorMessage.value = '';
  editConfig.value = {
    id: 'cfg_' + Date.now(),
    name: '新建 API 配置',
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini'
  };
};

// Start editing configuration
const startEdit = (cfg: ApiConfig) => {
  isEditing.value = true;
  testResult.value = null;
  testErrorMessage.value = '';
  editConfig.value = { ...cfg };
};

// Cancel edit and return to manager list
const cancelEdit = () => {
  isEditing.value = false;
  isAdding.value = false;
  testResult.value = null;
  testErrorMessage.value = '';
};

// Save edited or added config to Pinia
const saveConfig = () => {
  if (!editConfig.value.name.trim()) {
    alert('请输入配置名称！');
    return;
  }
  if (!editConfig.value.baseUrl.trim()) {
    alert('请输入基地址 Base URL！');
    return;
  }
  if (!editConfig.value.apiKey.trim()) {
    alert('请输入 API Key 密钥！');
    return;
  }
  if (!editConfig.value.model.trim()) {
    alert('请输入模型名称 Model！');
    return;
  }

  const isExisting = store.configs.some(c => c.id === editConfig.value.id);
  if (isExisting) {
    store.updateConfig(editConfig.value);
  } else {
    store.addConfig(editConfig.value);
  }

  isEditing.value = false;
  isAdding.value = false;
};

// Delete configuration from Pinia
const deleteConfig = (id: string) => {
  if (confirm('确认删除此 API 配置吗？')) {
    store.deleteConfig(id);
  }
};

// Run ping test api key
const runConnectionTest = async () => {
  isTesting.value = true;
  testResult.value = null;
  testErrorMessage.value = '';

  try {
    const success = await testApiConnection(editConfig.value);
    testResult.value = success;
    if (success) {
      testErrorMessage.value = '';
    }
  } catch (err: any) {
    testResult.value = false;
    testErrorMessage.value = err?.message || String(err);
  } finally {
    isTesting.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.settings-modal {
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  color: var(--text-main);
}

.back-btn {
  margin-right: 4px;
}

.btn-icon-small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background-color: rgba(255,255,255,0.02);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.btn-icon-small:hover {
  background-color: rgba(255,255,255,0.08);
}

.close-btn {
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-desc-top {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Config Profile List Manager */
.config-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 260px;
  overflow-y: auto;
  padding-right: 2px;
}

.config-list-item {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.01);
  border: 1px solid var(--border-color);
  position: relative;
  transition: var(--transition-smooth);
}

.light-theme .config-list-item {
  background-color: rgba(0,0,0,0.01);
}

.config-list-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--border-color-hover);
}

.config-list-item.active {
  border-color: HSL(var(--primary) / 0.5);
  background: linear-gradient(135deg, HSL(var(--primary) / 0.04), HSL(var(--secondary) / 0.04));
  box-shadow: 0 0 10px HSL(var(--primary) / 0.05);
}

.config-radio {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  margin-right: 12px;
  flex-shrink: 0;
  transition: var(--transition-smooth);
}

.config-list-item.active .config-radio {
  border-color: HSL(var(--secondary));
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: transparent;
  transition: var(--transition-smooth);
}

.config-list-item.active .radio-dot {
  background-color: HSL(var(--secondary-rgb));
}

.config-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.config-name-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.config-badges {
  display: flex;
  gap: 6px;
  align-items: center;
}

.truncate-model {
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.config-item-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.config-list-item:hover .config-item-actions {
  opacity: 1;
}

.action-icon-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}

.action-icon-btn:hover {
  color: var(--text-main);
  background-color: rgba(255,255,255,0.05);
}

.action-icon-btn.delete:hover {
  color: HSL(var(--danger));
  background-color: HSL(var(--danger) / 0.1);
}

.sys-badge {
  font-size: 0.7rem;
  color: var(--text-muted);
  background-color: var(--border-color);
  padding: 2px 6px;
  border-radius: 4px;
}

.add-new-btn {
  width: 100%;
  padding: 10px;
  font-size: 0.85rem;
}

/* Edit Form Area */
.edit-form-body {
  max-height: 480px;
  overflow-y: auto;
  padding-right: 4px;
}

.field-help-text {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon .form-input {
  padding-right: 46px;
}

.icon-btn-inside {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}

.icon-btn-inside:hover {
  color: var(--text-main);
}

/* Connection Test */
.connection-test-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  flex-wrap: wrap;
  gap: 12px;
}

.test-btn {
  padding: 8px 16px;
  font-size: 0.8rem;
}

.spin {
  animation: spin 1s linear infinite;
}

.test-result-status {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 500;
}

.text-success-status {
  color: HSL(var(--success));
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-danger-status {
  color: HSL(var(--danger));
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: help;
}

.test-error-box {
  background-color: rgba(239, 68, 68, 0.05);
  border: 1px dashed rgba(239, 68, 68, 0.2);
  border-radius: var(--button-radius);
  padding: 10px;
  font-size: 0.75rem;
  color: HSL(var(--danger) / 0.9);
  max-height: 80px;
  overflow-y: auto;
  word-break: break-all;
}

.w-full {
  width: 100%;
}

.edit-footer-buttons {
  display: flex;
  gap: 12px;
  width: 100%;
}

.edit-footer-buttons .btn {
  flex: 1;
}

.modal-footer {
  margin-top: 16px;
}

.icon-inline {
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
}
</style>
