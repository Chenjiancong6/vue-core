<template>
  <div class="gaode-map-wrap">
    <GaodeMap ref="amapRef" mapKey="d04f0992d1bd2b8ac57afccb677eda5e" encrypt="9836f587b94d62c3a0310b1ced86da51"
      :option="mapOption" @map-ready="handleMapReady">
    </GaodeMap>
    <div class="slot-map" v-if="mapObj.map">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, provide } from 'vue';
import GaodeMap from './components/GaodeMap.vue';


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