<template>
  <div ref="markerRef" class="my-location-marker"></div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';

const { map } = inject('mapObj');
const markerRef = ref(null);

onMounted(() => {
  map.flyTo({
    center: [113.9092883,22.5807411],
    zoom: 16
  });

  const marker = new mapboxgl.Marker({ element: markerRef.value })
    .setLngLat([113.9092883,22.5807411])
    .addTo(map);

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 25
  }).setHTML('<span>我在这里</span>');

  marker.getElement().addEventListener('mouseenter', () => {
    popup.setLngLat([113.9092883,22.5807411]).addTo(map);
  });

  marker.getElement().addEventListener('mouseleave', () => {
    popup.remove();
  });
});
</script>

<style scoped>
.my-location-marker {
  position: relative;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.my-location-marker::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: #3b82f6;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1.5s ease-out infinite;
}

@keyframes pulse {
  0% {
    width: 20px;
    height: 20px;
    opacity: 1;
  }
  100% {
    width: 60px;
    height: 60px;
    opacity: 0;
  }
}
</style>
