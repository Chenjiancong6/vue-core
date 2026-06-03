<template>
  <div class="chen__map-tool">
    <BaseMap ref="baseMapRef" @mapReady="handleMapReady">
      <PositionLayer @position-change="handleMousePositionChange" :position="panelPosition" />
    </BaseMap>
    <LatLngPanel ref="latLngPanelRef" class="latlng-panel" :position="position" />
    <PositionPanel ref="positionPanelRef" class="position-panel" @position-change="handlePositionPanelChange" />
    <div class="tooltip">底图坐标系是：{{baosheConfig.map.cors}}</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import BaseMap from '@cjc/vue3-basemap-mapboxgl';
import PositionLayer from './componnets/position-layer/index.vue';
import LatLngPanel from './componnets/latlng-panel/index.vue';
import PositionPanel from './componnets/position-panel/index.vue';
import baosheConfig from '@cjc/scaleConfig';

const baseMapRef = ref<InstanceType<typeof BaseMap> | null>(null);
// 面板输入框经纬度数据
const panelPosition = ref<{ lng: number, lat: number } | null>(null);
const position = ref<{ lng: number, lat: number } | null>(null);

let map: any = null;

const handleMapReady = () => {
  map = baseMapRef.value?.map;
  if (map) {
    map.getCanvas().style.cursor = 'crosshair'; // 鼠标样式为十字准星
  }
};

// 处理鼠标点击地图更新定位点位置事件
const handleMousePositionChange = (positionData: { lng: number, lat: number }) => {
  position.value = positionData;
};

// 处理定位面板位置变化事件
const handlePositionPanelChange = (positionData: { lng: number, lat: number }) => {
  panelPosition.value = positionData;
  position.value = positionData;
  if (!map) return;
  map.flyTo({
    center: [positionData.lng, positionData.lat],
    zoom: 15
  });
};
</script>
<style lang="less" scoped>
.chen__map-tool {
  width: 100%;
  height: 100%;
  position: relative;
}
.latlng-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
.position-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}
.tooltip {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
}
</style>
<style lang="less">
.el-main:has(.chen__map-tool) {
  padding: 0 !important;
}
</style>