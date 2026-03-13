import cache from '@/utils/cache';
import { reactive, onMounted } from 'vue';
import type { ApiKeyConfig } from './api-keys';

const SELECTED_MODEL_KEY = 'selected-ai-model';

export function saveSelectedModel(modelData: ApiKeyConfig): void {
  cache.setCache(SELECTED_MODEL_KEY, modelData);
}

export function getSelectedModel(): ApiKeyConfig | null {
  let model = cache.getCache(SELECTED_MODEL_KEY) || null;
  return model;
}

export function clearSelectedModel(): void {
  cache.deleteCache(SELECTED_MODEL_KEY);
}