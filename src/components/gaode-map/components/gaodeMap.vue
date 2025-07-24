<template>
  <div ref="amapRef" class="bs-amap">
    <MapLayers v-if="isMapReady" :slots="$slots"></MapLayers>
    <slot name="common" />
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, onMounted, onUnmounted } from 'vue';
import MapLayers from './map-layers.vue';
import { useResizeObserver } from "@vueuse/core";
import { merge } from 'lodash-es';
import { loadScript } from './util';

interface IProp {
  mapKey: string;
  encrypt: string;
  option?: any;
}

const props = withDefaults(defineProps<IProp>(), {});

const emits = defineEmits(['map-ready']);

const defaultMapOption = {
  resizeEnable: true,
  center: [114.0608047, 22.5439314],
  zoom: 13,
}

const amapRef = ref();
const map = shallowRef();
const isMapReady = ref(false);

const onResize = () => {
  map.value.resize?.();
}

const init = () => {

  let finalMapOption = merge(defaultMapOption, props.option);

  map.value = new AMap.Map(amapRef.value, finalMapOption);

  isMapReady.value = true;

  emits('map-ready');

  useResizeObserver(amapRef.value, onResize);
};

const loadAMap = async () => {
  window._AMapSecurityConfig = {
    securityJsCode: props.encrypt,
  }
  // https://lbs.amap.com/faq/js-api/map-js-api/create-project/1060847223/
  // ios的isz应用默认无法显示自定义地图，这个属性可以强制只要支持webgl的浏览器都使用自定义底图
  window.forceWebGL = true;

  await loadScript('https://webapi.amap.com/loader.js', window.AMap);

  AMapLoader.load({
    key: props.mapKey,       // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0",
    plugins: ['AMap.GeoJSON'],               // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  }).then((AMap) => {

    window.AMap = AMap;

    init();
  });
}

onMounted(async () => {
  await loadAMap();
});
onUnmounted(() => {
  map.value?.destroy?.() // 销毁map实例,避免内存泄漏
});
defineExpose({
  map
});
</script>

<style lang="less">
.bs-amap {
  width: 100%;
  height: 100%;
}
</style>