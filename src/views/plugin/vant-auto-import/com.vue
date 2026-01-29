<template>
 <div>
  <div>子组件</div>
  <van-search v-model="value" placeholder="请输入搜索关键词" style="margin-bottom: 20px;" />

  <van-button @click="handleShowNotify" type="primary" size="small">消息通知弹窗 </van-button>
 </div>
</template>
<script setup lang="ts">
import { showNotify } from 'vant';
import { ref } from 'vue';
 const value = ref('');

 const handleShowNotify = () => {
  showNotify({ message: '消息通知' });
 }

</script>
<style lang="less" scoped>

</style>