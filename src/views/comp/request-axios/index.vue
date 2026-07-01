<template>
 <div class="request-axios-body">
  <MyMarkdown></MyMarkdown>
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
// 直接导入 .md 文件作为 Vue 组件
import MyMarkdown from '@/axios-request/README.md';

</script>
<style lang="less" scoped>
.request-axios-body {
  width: 70%;
  margin: 0 auto;
}
</style>