<template>
  <div class="gaode-map-wrap">
    <GaodeMap ref="amapRef" mapKey="0ed446c7b6aa2d2ae89d24022fcbf581" encrypt="cafddb0ed09139d23e2ea144feaf72f0"
      :option="mapOption" @map-ready="handleMapReady">
    </GaodeMap>
    <div class="slot-map" v-if="mapObj.map">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, provide } from 'vue';
// import GaodeMap from './components/GaodeMap.vue';
import GaodeMap from '@cjc/gaode-map';



const amapRef = ref(null);
const mapOption = reactive({
  mapStyle: 'amap://styles/a673d8d9ec88e83c3e7509281bd9495e',
})

const mapObj = reactive({
  map: null
});
// 全局暴露
provide('mapObj', mapObj);

const handleMapReady = () => {
  mapObj.map = amapRef.value.map;
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