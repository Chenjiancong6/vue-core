<template>
 <div class="latlng-panel--container">
  <div class="coordinate-item" v-for="item in CoordinateSeriesTable" :key="item.value">
    <div class="coordinate-item--label">{{ item.label }}：</div>
    <div class="coordinate-item--data">{{ coordinateResults[item.value] }}</div>
    <div class="coordinate-item--icon" @click="handleClickItemCopy(item)">
      <Icon icon="svg-icon:map-tool-copy" />
    </div>
  </div>
 </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import Icon from '@cjc/vue3-svg-icon';
import { ElMessage } from 'element-plus';
import { corsTransform } from '../../cors-transform.js';

// CGCS2000（中国2000国家大地坐标系）和WGS 84（世界大地测量系统）不是完全相同的坐标系，但在绝大多数日常应用中可以视为等同。
// GCS2000是“静止”的（固定在某一个时刻的地球形态），而WGS 84是“实时动态”更新的。
const CoordinateSeriesTable = [{
  label: '高德坐标',
  value: 'gcj02'
},{
  label: 'CGCS2000',
  value: 'CGCS2000'
},{
  label: 'WGS84',
  value: 'wgs84'
},{
  label: '百度坐标',
  value: 'bd09'
}];

const props = defineProps({
  position: {
    type: Object as () => { lng: number; lat: number } | null,
    default: null
  }
});


const coordinateResults = computed(() => {
  if (!props.position || !props.position.lng || !props.position.lat) {
    return {};
  }
  const results = {};
  CoordinateSeriesTable.forEach(item => {
    results[item.value] = corsTransform(props.position.lng, props.position.lat, item.value)
        .map(coord => String(coord).replace(/(\.\d{7})\d+/g, '$1'))
        .join(','); // 使用正则表达式处理经纬度数据，不足7位小数保留原样，大于7位则截取后面多余的部分。
  });
  return results;
});

const handleClickItemCopy = (item: { value: string }) => {
  if (props.position && coordinateResults.value[item.value]) {
    navigator.clipboard.writeText(coordinateResults.value[item.value]);
    ElMessage.success('复制成功');
  } else {
    ElMessage.error('请先获取坐标');
  }
}

</script>
<style lang="less" scoped>
.latlng-panel--container {
  background: #fff;
  padding: 10px;
  border: 1px solid #ebeaea;
}
.coordinate-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .coordinate-item--label {
    width: 80px;
    text-align: right;
  }
  .coordinate-item--data {
    min-width: 100px;
    margin-right: 10px;
  }
}
.coordinate-item:last-child {
  margin-bottom: 0px;
}
.coordinate-item--icon {
  cursor: pointer;
  margin-left: auto;
}
</style>