import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ApiConfig, ApiSettings } from '../types';

export const useSettingsStore = defineStore('settings', () => {
  const configs = ref<ApiConfig[]>([]);
  const activeConfigId = ref<string>('mock_profile');

  // Helper template for mock mode
  const mockConfig: ApiConfig = {
    id: 'mock_profile',
    name: '本地演示模式 (无需API Key)',
    apiKey: '',
    baseUrl: '',
    model: 'Mock-Engine'
  };

  // Getters
  const activeConfig = computed(() => {
    return configs.value.find(c => c.id === activeConfigId.value) || configs.value[0] || mockConfig;
  });

  // Load configuration from local storage or environment variables
  const loadSettings = () => {
    const saved = localStorage.getItem('side_hustle_api_settings_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ApiSettings;
        if (parsed && Array.isArray(parsed.configs) && parsed.activeConfigId) {
          configs.value = parsed.configs;
          activeConfigId.value = parsed.activeConfigId;
          
          // Double-check mock profile exists
          if (!configs.value.some(c => c.id === 'mock_profile')) {
            configs.value.unshift({ ...mockConfig });
          }
          return;
        }
      } catch (e) {
        console.error('Failed to parse localStorage settings', e);
      }
    }

    // First time setup - Initialize config list
    const initialConfigs: ApiConfig[] = [{ ...mockConfig }];
    let defaultActiveId = 'mock_profile';

    // Read Vite environment variables
    const envKey = import.meta.env.VITE_TEXT_GENERATION_API_KEY || import.meta.env.VITE_API_KEY || '';
    const envBaseUrl = import.meta.env.VITE_TEXT_GENERATION_BASE_URL || import.meta.env.VITE_BASE_URL || '';
    const envModel = import.meta.env.VITE_TEXT_GENERATION_MODEL || import.meta.env.VITE_API_MODEL || '';

    // If API Key exists in environment variables, initialize a profile
    if (envKey) {
      const isGemini = envBaseUrl.toLowerCase().includes('generativelanguage.googleapis.com') || 
                       envModel.toLowerCase().includes('gemini');
      const envProfile: ApiConfig = {
        id: 'env_profile',
        name: '环境变量默认配置',
        apiKey: envKey,
        baseUrl: envBaseUrl || (isGemini ? 'https://generativelanguage.googleapis.com' : 'https://api.openai.com/v1'),
        model: envModel || (isGemini ? 'gemini-1.5-flash' : 'gpt-4o-mini')
      };
      initialConfigs.push(envProfile);
      defaultActiveId = 'env_profile';
    }

    configs.value = initialConfigs;
    activeConfigId.value = defaultActiveId;
    saveSettings();
  };

  const saveSettings = () => {
    const data: ApiSettings = {
      configs: configs.value,
      activeConfigId: activeConfigId.value
    };
    localStorage.setItem('side_hustle_api_settings_v3', JSON.stringify(data));
  };

  // Actions
  const setActiveConfig = (id: string) => {
    activeConfigId.value = id;
    saveSettings();
  };

  const addConfig = (config: ApiConfig) => {
    configs.value.push(config);
    activeConfigId.value = config.id;
    saveSettings();
  };

  const updateConfig = (config: ApiConfig) => {
    const index = configs.value.findIndex(c => c.id === config.id);
    if (index > -1) {
      configs.value[index] = { ...config };
      saveSettings();
    }
  };

  const deleteConfig = (id: string) => {
    if (id === 'mock_profile') return; // Cannot delete system mock profile

    configs.value = configs.value.filter(c => c.id !== id);
    if (activeConfigId.value === id) {
      activeConfigId.value = 'mock_profile';
    }
    saveSettings();
  };

  return {
    configs,
    activeConfigId,
    activeConfig,
    loadSettings,
    setActiveConfig,
    addConfig,
    updateConfig,
    deleteConfig
  };
});
