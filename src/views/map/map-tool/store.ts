import baosheConfig from '@cjc/scaleConfig';
import { ref } from 'vue';

// 默认坐标系是地图图层对应的坐标系
export const coordinates = ref(baosheConfig.map.cors);