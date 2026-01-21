<template>
 <div class="chen__mapboxgl-map">
  <BaseMap>
    <TestLayer />
  </BaseMap>
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import BaseMap from '@/components/vue3-basemap-mapboxgl/src/index';
import TestLayer from './components/test-layer.vue';

</script>
<style lang="less" scoped>
.chen__mapboxgl-map {
  width: 100%;
  height: 100%;
}
</style>