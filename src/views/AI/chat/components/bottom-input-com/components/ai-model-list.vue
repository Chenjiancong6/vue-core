<template>
  <div class="ai-model-list--wrap">
    <el-select v-model="aiModel" @change="handleAIModelChange" class="ai-model-list--select">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item?.disabled"
    />
  </el-select>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const aiModel = ref('deepseek');
const options = ref([
  {
    value: 'deepseek',
    label: 'deepseek',
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'gpt-3.5-turbo',
    disabled: true,
  },
]);

const handleAIModelChange = (item) => {
  console.log('aiModel', item);
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