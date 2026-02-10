<template>
 <div class="icon-park-demo">
  <h2>自动按需引入icon-park图标插件介绍：</h2>
    <h1>引入icon-park图标</h1>
  <i-home />
  <i-home />
  <i-like />
  <h1>改变图标大小和颜色</h1>
  <i-delete size="24" style="color: red;" />
    <i-like size="20" style="color: red;" />
 </div>
 <MyMarkdown></MyMarkdown>
</template>
<script setup lang="ts" >
import { ref } from 'vue';
// 直接导入 .md 文件作为 Vue 组件
import MyMarkdown from './README.md';

</script>
<style lang="less" scoped>
.icon-park-demo {
  margin-bottom: 20px;
  h1 {
    margin-top: 20px;
  }
}
</style>