<template>
 <div class="rag-flow-wrap">
   <iframe
     src="http://192.168.7.129/datasets"
     frameborder="0"
     class="rag-flow-iframe"
   />
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
</script>
<style lang="less" scoped>
.rag-flow-wrap {
  width: 100%;
  height: 100%;
  display: flex;
}
.rag-flow-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
<style lang="less">
.el-main:has(.rag-flow-wrap) {
  padding: 0 !important;
}
</style>
