<template>
</template>

<script setup>
import { inject, onMounted } from 'vue';

// map-layers.vue 提供的 key 是 'mapObj'，包含 { map, baseMap }
// map 是 mapbox Map 实例（Vue 通过 this.$parent.map 取值时已自动解包 shallowRef）
const { map, baseMap } = inject('mapObj');

onMounted(() => {
    // 地图聚焦
    map.flyTo({
        center: [113.9542664, 22.5318036],
        zoom: 16
    });
});

</script>
