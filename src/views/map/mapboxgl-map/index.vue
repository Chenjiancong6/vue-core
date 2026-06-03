<template>
 <div class="chen__mapboxgl-map">
  <BaseMap :option="mapOption" @map-ready="handleMapReady">
    <TestLayer />
    <!-- 矢量瓦片图层-天地图 wgs84坐标系 -->
    <TileLayer ref="TileLayerRef" :defaultTile="defaultTile" />
  </BaseMap>
  <div class="map-ctrl-container left-bottom disabled-when-drawing-bound" ref="mapLeftBottomRef" v-if="mapObj.map">
      <TileChange :defaultTile="defaultTile" @change-tile="handleChangeTile" />
    </div>
 </div>
</template>
<script setup lang="ts">
import { ref, reactive, PropType, provide } from 'vue';
// import BaseMap from '@/components/vue3-basemap-mapboxgl/src/index';
import BaseMap from '@cjc/vue3-basemap-mapboxgl';
import TestLayer from './components/test-layer.vue';
import TileLayer from './components/tile-layer.vue';
import TileChange from './components/tile-change/index.vue';

type TileType = 'vector' | 'image';

const props = defineProps({
  defaultTile: {
    type: String as PropType<TileType>,
    default: 'vector'
  }
})

const TileLayerRef = ref<any>();

const mapObj = reactive({
  map: null,
  baseMap: null,
  comBaseMap: null
});

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

provide('mapObj', mapObj);
const handleMapReady = (_map) => {
  mapObj.map = _map;
};

const handleChangeTile = (newTile: TileType) => {
  TileLayerRef.value.changeTile(newTile);
}

</script>
<style lang="less" scoped>
.chen__mapboxgl-map {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-ctrl-container {
  pointer-events: none;

  &.left-top {
    position: absolute;
    left: var(--outside-gap);
    top: var(--outside-gap);
    z-index: 1301;
  }
  &.center-top {
    position: absolute;
    // 屏幕宽度的一半
    left: 35%;
    transform: translateX(-35%);
    top: var(--outside-gap);
    z-index: 1301;
  }

  &.left-bottom {
    position: absolute;
    left: var(--outside-gap);
    bottom: var(--outside-gap);
    z-index: 1301;
  }

  &.right {
    position: absolute;
    top: var(--outside-gap);
    right: var(--outside-gap);
    bottom: var(--outside-gap);
    display: flex;
    flex-direction: row;
    pointer-events: none;
    z-index: 1301;
  }
}
</style>

<style lang="less">
.el-main:has(.chen__mapboxgl-map) {
  padding: 0 !important;
}
</style>