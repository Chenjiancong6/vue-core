<template>
  <div class="ai-model-list--wrap">
    <el-select v-model="aiModel" @change="handleAIModelChange" class="ai-model-list--select">
    <el-option
      v-for="item in options"
      :key="item.model"
      :label="item.name"
      :value="item.model"
      :disabled="item?.disabled"
    />
  </el-select>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getApiKeys, type ApiKeyConfig } from '@/ai-lib/ai-api-keys/api-keys';
import { saveSelectedModel, getSelectedModel } from '@/ai-lib/ai-api-keys/persistence';

const aiModel = ref('');
const options = ref<ApiKeyConfig[]>([]);

onMounted(() => {
  const apiKeys = getApiKeys();
  options.value = apiKeys;
  
  // 尝试从持久化存储中读取之前保存的模型
  const savedModel = getSelectedModel();
  if (savedModel && apiKeys.some(item => item.model === savedModel.model)) {
    aiModel.value = savedModel.model;
    // 初始化时保存默认选中的模型
    saveSelectedModel(savedModel);
  } else {
    aiModel.value = apiKeys[0].model;
    // 初始化时保存默认选中的模型
    saveSelectedModel(apiKeys[0]);
  }
})

const handleAIModelChange = (modelValue: string) => {
  const selectedModel = options.value.find(item => item.model === modelValue);
  if (selectedModel) {
    saveSelectedModel(selectedModel);
  }
 setTimeout(() => {
  // 刷新页面
  // TODO: 这是的作用是更新整个工程，使ai模型和api url 能切换生效
  window.location.reload();
 }, 100);
}

</script>
<style lang="less" scoped>
.ai-model-list--wrap {
  width: 120px;
}

.ai-model-list--select {
  /deep/ .el-select__wrapper {
    // background-color: #c1c1c1 !important;
    border-radius: 20px !important;
  }
}

</style>