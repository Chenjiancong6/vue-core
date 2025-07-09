<template>
 <div class="gaode-map-wrap">
  <GaodeMap 
    ref="amapRef" 
    mapKey="ad223c3fe563f20a827cf8eb79ab2bff"
    encrypt="3d3e89e6f0309534066bfef90aa0238c" 
    :option="mapOption" @map-ready="handleMapReady"
  ></GaodeMap>
 </div>
</template>
<script setup lang="ts">
import { ref,reactive,provide } from 'vue';
import GaodeMap from './components/gaodeMap.vue';

const amapRef = ref(null);
const mapOption = reactive({
  mapStyle: 'amap://styles/a673d8d9ec88e83c3e7509281bd9495e',
  plugin: ['AMap.Subway']
})

const mapObj = reactive({
  map: null
}); 
// 全局暴露
provide('mapObj', mapObj);

const handleMapReady = () => {
  mapObj.map = amapRef.value.map;
  // mapObj.map.plugin(['AMap.Subway'], () => {
  //   if (mapObj.map.Subway) {
  //     new AMap.Subway({
  //       map: mapObj.map,
  //       city: '深圳',
  //       opacity: 0.8
  //     });
  //   } else {
  //     console.error('AMap.Subway 插件未加载！');
  //   }
  // });
};
</script>
<style lang="less" scoped>
.gaode-map-wrap {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>