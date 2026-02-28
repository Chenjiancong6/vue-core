<template>
  <div class="plate-number--warp">
    <div class="left-com">
      <PlateNumber v-model="plateNumber" @query="handleQuery" />
    </div>
    <div class="right-com">
      <readme />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import PlateNumber from '@cjc/vue3-plate-number';
import readme from './README.md';

const plateNumber = ref('');
// 处理查询事件
const handleQuery = (query) => {
  console.log('查询车牌号码:', query);
}
const provinces = ref([
  ['f粤', '京', '津', '沪', '渝', '川', '新', '藏', '宁', '桂'],
  ['贵', '云', '黑', '吉', '辽', '晋', '冀', '青', '鲁', '豫'],
  ['苏', '皖', '浙', '闽', '赣', '湘', '鄂', '琼', '甘'],
  ['陕', '蒙', '港', '澳', '台', '使', '领', '警', '学']
]);

const numbers = ref([
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
]);
</script>
<style lang="less" scoped>
.plate-number--warp {
  display: flex;

}
.left-com {
  border: 1px solid #ccc;
  width: 300px;
  height: 800px;
}
.right-com {
  margin-left: 30px;
  flex: 1;
}
</style>