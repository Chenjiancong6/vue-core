<template>
  <div class="com-data-container--wrapper">
    <!-- 数据加载中组件 -->
    <div class="data-container">
      <DataContainer :data="dataList">
       <div>加载完成</div>
      </DataContainer>
    </div>
    <!-- 图片加载中组件 -->
    <div class="image-loading-container">
      <ImageSkeleton />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
// import DataContainer from './src/index.vue';
import DataContainer from '@cjc/vue3-data-container';
import ImageSkeleton from '@/components/image-skeleton/index.vue';

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
.com-data-container--wrapper {
  width: 100%;
  height: 100%;
  display: flex;
}
.data-container {
  width: 300px;
  height: 300px;
}
.image-loading-container {
  width: 300px;
  height: 300px;
}
</style>