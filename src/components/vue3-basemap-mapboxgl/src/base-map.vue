<template>
  <div class="bs-basemap--mapboxgl basemap-mapboxgl map" ref="mapRef">
    <MapLayers v-if="isMapReady" :slots="$slots"></MapLayers>
    <slot name="common" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import MapLayers from "./map-layers.vue";
import useMap from "./_use-map";
import { merge } from "lodash-es";

// 由于mapboxgl使用script引入，且按需加载的，因此，如果使用第三方依赖mapboxgl的库时，会由于mapboxgl未定义而导致脚本异常
if (typeof mapboxgl === "undefined") {
  window.mapboxgl = undefined;
}

const emits = defineEmits(["map-ready"]);

const props = defineProps({
  option: {
    type: Object,
    default: function () {
      return {};
    },
  },
  beforeLoadAction: {
    type: Function,
    default: () => {},
  },
  // 是否外部加载mapboxgl
  externalLib: {
    type: Boolean,
    default: false
  }
});

const mapRef = ref<HTMLDivElement>();

const { map, isMapReady, initMap, fitBounds } = useMap({
  option: props.option,
  beforeLoadAction: props.beforeLoadAction,
  externalLib: props.externalLib
});

watch(isMapReady, () => {
  if (isMapReady.value) {
    emits("map-ready", getMap());
  }
});

onMounted(() => {
  initMap(mapRef.value);
});

const getMap = () => {
  return map.value;
};

const loadWms = (options) => {
  if (!options.id) {
    throw new Error("id is required for wms layer");
    return;
  }

  let wmsOptions = {
    bbox: "{bbox-epsg-3857}",
    format: "image/png",
    service: "WMS",
    version: "1.1.1",
    request: "GetMap",
    srs: "EPSG:3857",
    transparent: "true",
    width: "256",
    height: "256",
    _: Date.now(),
    ...options,
  };
  let wmsParams = [];
  for (let key in wmsOptions) {
    wmsParams.push(`${key}=${wmsOptions[key]}`);
  }
  let wmsParamsStr = wmsParams.join("&");

  let source = {
    type: "raster",
    tiles: [`${options.url}?${wmsParamsStr}`],
    tileSize: 256,
  };
  let layerOption = merge(
    {
      id: options.id,
      type: "raster",
    },
    options
  );
  layerOption.source = source;
  map.value.addLayer(layerOption);
};

defineExpose({
  map,
  fitBounds,
  getMap,
  loadWms
});
</script>

<style lang="less">
.bs-basemap--mapboxgl,
.basemap-mapboxgl {
  height: 100%;
  canvas {
    outline: none;
  }

  .mapboxgl-popup-content {
    padding: 15px;
    background: var(--el-bg-color);
  }

  // 弹窗的三角
  .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
    margin-top: -1px;
    border-top-color: var(--el-bg-color);
  }

  .mapboxgl-popup-close-button {
    font-size: 20px;
    padding: 0;
    margin: 5px;
    &:focus {
      outline: none;
    }
  }
}
</style>
