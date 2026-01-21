<template>
</template>

<script setup>
import { inject } from 'vue';

// 这个map就是mapbox-gl实例
const map = inject('map');

// 这个baseMap是base-map实例
const baseMap = inject('baseMap');

// 地图聚焦
map.flyTo({
    center: [113.9542664, 22.5318036],
    zoom: 16
});

</script>
