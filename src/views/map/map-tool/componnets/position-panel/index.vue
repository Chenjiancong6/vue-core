<template>
 <div class="position-panel--container">
    <el-input v-model="position" placeholder="输入经纬度,逗号隔开，如113.22，22.22" />
    <el-select v-model="coordinates" placeholder="Select" class="coordinates-select">
    <el-option
      v-for="item in coordinatesOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <el-button type="primary" @click="handlePositionChange">定位</el-button>
  </div>
</template>
<script setup lang="ts">
import { ref, inject } from 'vue';
import { ElMessage } from 'element-plus';
import { coordinates } from '../../store';

const emit = defineEmits(['position-change']);

const position = ref('');

// CGCS2000（中国2000国家大地坐标系）和WGS 84（世界大地测量系统）不是完全相同的坐标系，但在绝大多数日常应用中可以视为等同。
const coordinatesOptions = [{
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

const handlePositionChange = () => {
 // 如果没有内容或者不是类似113.22，22.22这种的经纬度格式，提示用户
 if (!position.value || !/^-?\d{1,3}\.\d+,-?\d{1,2}\.\d+$/.test(position.value)) {
  ElMessage.error('请输入正确的经纬度格式');
  return;
 }
 // 触发定位事件
 emit('position-change', {
  lng: Number(position.value.split(',')[0]),
  lat: Number(position.value.split(',')[1])
 });
}


</script>
<style lang="less" scoped>
.position-panel--container {
  display: flex;
  background: #fff;
  padding: 5px;
  border: 1px solid #ebeaea;
}
.coordinates-select {
  margin: 0 10px;
  width: 200px;
}
</style>