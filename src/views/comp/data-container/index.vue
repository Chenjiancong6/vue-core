<template>
 <DataContainer :data="dataList">
  <div>加载完成</div>
 </DataContainer>
</template>
<script setup lang="ts">
import { ref } from 'vue';
// import DataContainer from './src/index.vue';
import DataContainer from '@cjc/vue3-data-container';

  // 加载中···
  let dataList = ref(null);
    // 暂无数据
  setTimeout(() => {
    dataList.value = [];
  }, 2000);

  // 有数据
  setTimeout(() => {
    dataList.value = [1, 2, 3];
  }, 4000);

</script>
<style lang="less" scoped>

</style>