<template>
  <div class="amap-container">
    <AMap>
      <!-- <MapLayer /> -->
      <Pointlayer />
    </AMap>
  </div>
</template>

<script setup>
import { } from "vue";
import AMap from '@/components/gaode-map/index.vue';
import MapLayer from './map-layer/index.vue';
import Pointlayer from './point-layer/index.vue';
</script>

<style lang="less" scoped>
.amap-container {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less">
.el-main:has(.amap-container) {
  padding: 0 !important;
}
</style>
