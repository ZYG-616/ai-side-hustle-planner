<template>
  <div class="glass-card history-container">
    <div class="history-header">
      <h4><HistoryIcon :size="16" class="icon-inline" /> 历史规划记录</h4>
      <button 
        v-if="records.length > 0" 
        class="clear-all-btn" 
        @click="clearAllHistory"
      >
        清空全部
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="records.length === 0" class="empty-history">
      <InboxIcon :size="24" class="empty-icon" />
      <p>暂无历史规划记录</p>
      <span class="empty-hint">生成兼职规划方案后将在此自动留存。</span>
    </div>

    <!-- History list -->
    <div v-else class="history-list">
      <div 
        v-for="record in sortedRecords" 
        :key="record.id"
        class="history-item glass-card"
        :class="{ 'active': activeRecordId === record.id }"
        @click="selectRecord(record)"
      >
        <div class="item-meta">
          <span class="item-date">{{ formatDate(record.timestamp) }}</span>
          <span class="badge badge-sm badge-secondary">{{ getRoleLabel(record.input.role) }}</span>
        </div>
        
        <div class="item-hustles">
          <span 
            v-for="hustle in record.recommendations" 
            :key="hustle.id" 
            class="hustle-tag"
          >
            {{ hustle.title }}
          </span>
        </div>

        <div class="item-actions" @click.stop>
          <button class="delete-btn" @click="deleteRecord(record.id)" aria-label="删除记录">
            <TrashIcon :size="14" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { HistoryRecord } from '../types';
import { 
  History as HistoryIcon, 
  Inbox as InboxIcon, 
  Trash2 as TrashIcon 
} from 'lucide-vue-next';

const props = defineProps<{
  records: HistoryRecord[];
  activeRecordId: string | null;
}>();

const emit = defineEmits<{
  (e: 'select', record: HistoryRecord): void;
  (e: 'delete', id: string): void;
  (e: 'clear'): void;
}>();

const sortedRecords = computed(() => {
  return [...props.records].sort((a, b) => b.timestamp - a.timestamp);
});

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
};

const getRoleLabel = (role: string) => {
  const mapping: Record<string, string> = {
    student: '在校学生',
    employee: '在职白领',
    freelancer: '自由职业',
    parent: '宝妈宝爸',
    unemployed: '待业状态'
  };
  return mapping[role] || '兼职规划';
};

const selectRecord = (record: HistoryRecord) => {
  emit('select', record);
};

const deleteRecord = (id: string) => {
  if (confirm('确认删除此条历史规划记录吗？')) {
    emit('delete', id);
  }
};

const clearAllHistory = () => {
  if (confirm('确认清空所有历史规划记录吗？此操作无法撤销。')) {
    emit('clear');
  }
};
</script>

<style scoped>
.history-container {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}

.history-header h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 6px;
}

.clear-all-btn {
  background: transparent;
  border: none;
  color: HSL(var(--danger) / 0.8);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: var(--transition-smooth);
}

.clear-all-btn:hover {
  background-color: HSL(var(--danger) / 0.1);
  color: HSL(var(--danger));
}

.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
  text-align: center;
}

.empty-icon {
  color: var(--text-muted);
  opacity: 0.3;
  margin-bottom: 8px;
}

.empty-history p {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.empty-hint {
  font-size: 0.7rem;
  color: var(--text-muted);
  opacity: 0.7;
  margin-top: 4px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 2px;
}

.history-item {
  padding: 12px 14px;
  cursor: pointer;
  position: relative;
  background-color: rgba(255, 255, 255, 0.01);
  transition: var(--transition-smooth);
}

.light-theme .history-item {
  background-color: rgba(0, 0, 0, 0.01);
}

.history-item:hover {
  background-color: rgba(255, 255, 255, 0.04);
  border-color: var(--border-color-hover);
}

.history-item.active {
  border-color: HSL(var(--primary) / 0.6);
  background: linear-gradient(135deg, HSL(var(--primary) / 0.04), HSL(var(--secondary) / 0.04));
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.item-date {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.item-hustles {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding-right: 20px; /* Make space for delete button */
}

.hustle-tag {
  font-size: 0.7rem;
  background-color: rgba(255, 255, 255, 0.04);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--text-main);
  border: 1px solid var(--border-color);
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.light-theme .hustle-tag {
  background-color: rgba(0, 0, 0, 0.02);
}

.item-actions {
  position: absolute;
  right: 10px;
  bottom: 10px;
  opacity: 0;
  transition: opacity 0.2s;
}

.history-item:hover .item-actions {
  opacity: 1;
}

.delete-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  transition: var(--transition-smooth);
}

.delete-btn:hover {
  color: HSL(var(--danger));
  background-color: HSL(var(--danger) / 0.15);
}

.icon-inline {
  display: inline-block;
  vertical-align: middle;
}
</style>
