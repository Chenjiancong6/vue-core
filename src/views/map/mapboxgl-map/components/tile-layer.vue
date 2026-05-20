<template></template>

<script lang="ts" setup>
import { inject, onBeforeUnmount, PropType, watch } from 'vue';
import { layerPrefix } from '@/utils/map';

// 天地图瓦片图层类型 (矢量瓦片 | 栅格瓦片)
type TileType = 'vector' | 'image';

const props = defineProps({
  defaultTile: {
    type: String as PropType<TileType>,
    default: 'vector'
  }
})

const { map }: any = inject('mapObj');

const vecLayerId = layerPrefix.tileLayer + '-vec-layer';
const imageLayerId = layerPrefix.tileLayer + '-image-layer';
const labelLayerId = layerPrefix.tileLayer + '-label-layer';

// 添加天地图电子地图图层 wgs84坐标系
map.addLayer({
  id: vecLayerId,
  type: 'raster',
  source: {
    type: 'raster',
    tiles: [
      import.meta.env.VITE_API_BASEPATH + '/tianditu-tile/vec_w/{z}/{x}/{y}'
    ],
    tileSize: 256,
    maxzoom: 18
  },
  minzoom: 0,
  visibility: 'hidden',
  paint: {"raster-brightness-max":1,"raster-brightness-min":0.4,"raster-contrast":0.1,"raster-hue-rotate":-10,"raster-opacity":1,"raster-resampling":"linear","raster-saturation":0}
});

// 添加天地图栅格瓦片图层
map.addLayer({
  id: imageLayerId,
  type: 'raster',
  source: {
    type: 'raster',
    tiles: [
      import.meta.env.VITE_API_BASEPATH + '/tianditu-tile/img_w/{z}/{x}/{y}'
    ],
    tileSize: 256,
    maxzoom: 18
  },
  minzoom: 0,
  visibility: 'hidden'
});

// 添加天地图文字标注图层
map.addLayer({
  id: labelLayerId,
  type: 'raster',
  source: {
    type: 'raster',
    tiles: [
      import.meta.env.VITE_API_BASEPATH + '/tianditu-tile/cva_w/{z}/{x}/{y}'
      // 'https://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=27e392a26721cf5c30d90c66281593f2',
      // 'https://t1.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=27e392a26721cf5c30d90c66281593f2',
      // 'https://t2.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=27e392a26721cf5c30d90c66281593f2',
      // 'https://t3.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=27e392a26721cf5c30d90c66281593f2'
    ],
    tileSize: 256,
    maxzoom: 18
  },
  minzoom: 0
});

const changeTile = (newTile: TileType) => {
  map.setLayoutProperty(vecLayerId, 'visibility', newTile == 'vector' ? 'visible' : 'none');
  map.setLayoutProperty(imageLayerId, 'visibility', newTile == 'image' ? 'visible' : 'none');
}

changeTile(props.defaultTile);

// 弱化底图
const fadeTile = (opacity = 0.8) => {
  // map.setPaintProperty(vecLayerId, 'raster-opacity', opacity);
  // map.setPaintProperty(labelLayerId, 'raster-opacity', opacity);

  // map.setPaintProperty(vecLayerId, 'raster-saturation', -0.6);
  // map.setPaintProperty(labelLayerId, 'raster-saturation', -0.6);
};

// 去掉弱化底图
const cancelFadeTile = () => {
  // map.setPaintProperty(vecLayerId, 'raster-opacity', 1);
  // map.setPaintProperty(labelLayerId, 'raster-opacity', 1);

  // map.setPaintProperty(vecLayerId, 'raster-saturation', 0);
  // map.setPaintProperty(labelLayerId, 'raster-saturation', 0);
};

onBeforeUnmount(() => {
  if (map.getLayer(vecLayerId)) {
    map.removeLayer(vecLayerId);
    map.removeSource(vecLayerId);
  }
  if (map.getLayer(labelLayerId)) {
    map.removeLayer(labelLayerId);
    map.removeSource(labelLayerId);
  }
});

defineExpose({
  fadeTile,
  cancelFadeTile,
  changeTile
});
</script>
