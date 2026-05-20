<template>
 <div class="chen__mapboxgl-map">
  <BaseMap :option="mapOption">
    <TestLayer />
    <!-- 矢量瓦片图层-天地图 wgs84坐标系 -->
    <TileLayer />
  </BaseMap>
 </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
// import BaseMap from '@/components/vue3-basemap-mapboxgl/src/index';
import BaseMap from '@cjc/vue3-basemap-mapboxgl';
import TestLayer from './components/test-layer.vue';
import TileLayer from './components/tile-layer.vue';

const mapOption = reactive({
  loadTile: false,
  pitchWithRotate: false,
  dragRotate: false,
  attributionControl: false,
  touchZoomRotate: {
    rotate: false, // 禁用触摸旋转
    pitchWithRotate: false
  },
  fitBoundsOptions: {
    padding: {
      right: 700
    }
  },
  style: {
    // 矢量瓦片: 服务器把地图数据按瓦片网格切成 矢量数据（点/线/面 + 属性），通常是 PBF（Protocolbuffer Binary Format）​ 格式
    glyphs: 'https://transpaas.sutpc.com/smart-map/vectile/font/{fontstack}/{range}.pbf'
  }
});

</script>
<style lang="less" scoped>
.chen__mapboxgl-map {
  width: 100%;
  height: 100%;
}
</style>