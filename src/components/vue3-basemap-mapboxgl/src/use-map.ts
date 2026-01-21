import { ref, shallowRef, onBeforeUnmount, watch } from "vue";

export const useMap = (map, baseMap?) => {
  const addMapLayer = (addLayerOption, beforeId?) => {
    map.addLayer(addLayerOption, beforeId);

    onBeforeUnmount(() => {
      const layerId = addLayerOption.id;
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(layerId)) {
        map.removeSource(layerId);
      }
    })
  }
  const addMapSource = (sourceId, addSourceOption) => {
    map.addSource(sourceId, addSourceOption);

    onBeforeUnmount(() => {
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    })
  }

  return {
    addMapLayer,
    addMapSource
  }
}