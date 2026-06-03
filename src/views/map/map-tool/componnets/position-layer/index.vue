// 包含鼠标定位和输入框经纬度定位，显示小红点图层
<template>
  <div></div>
</template>
<script setup lang="ts">
import { inject, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { corsTransform } from '../../cors-transform.js';
import { coordinates } from '../../store.js';

const { map }: any = inject('mapObj');
const emit = defineEmits(['position-change']);

const props = defineProps({
  position: {
    type: Object as () => { lng: number; lat: number } | null,
    default: null
  }
});

const sourceId = 'position-point-source';
const layerId = 'position-point-layer';

const initLayer = () => {
  if (!map) return;

  if (!map.getSource(sourceId)) {
    // 初始化source
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
  }

  if (!map.getLayer(layerId)) {
    // 初始化layer
    map.addLayer({
      id: layerId,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-radius': 6,
        'circle-color': '#ff0000',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    });
  }
};

// 更新定位点位置
const updatePoint = (lng: number, lat: number) => {
  if (!map) return;
  
  const geojson = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    }]
  };
  
  const source = map.getSource(sourceId);
  // 确保source存在且有setData方法,更新source数据
  if (source && 'setData' in source) {
    (source as any).setData(geojson);
  }
};

/**
 * 处理地图点击事件，更新定位点位置
 * @param e 地图点击事件对象
 */
const handleMapClick = (e: any) => {
  if (e.originalEvent.button === 0) {
    const { lng, lat } = e.lngLat;
    updatePoint(lng, lat);
    emit('position-change', { lng, lat });
  }
};

// 监听position属性变化，更新定位点位置
watch(() => props.position, (newPosition) => {
  if (newPosition && newPosition.lng !== undefined && newPosition.lat !== undefined) {
    // 转换为地图坐标系
    const [lng, lat] = corsTransform(newPosition.lng, newPosition.lat, coordinates.value, false);
    updatePoint(lng, lat);
  }
}, { immediate: true });

onMounted(() => {
  initLayer();
  map?.on('click', handleMapClick); // 绑定地图点击事件
  updatePoint(props.position?.lng || 0, props.position?.lat || 0); // 初始化定位点位置
});

onBeforeUnmount(() => {
  map?.off('click', handleMapClick);
  if (map?.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  if (map?.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
});
</script>
<style lang="less" scoped>
</style>