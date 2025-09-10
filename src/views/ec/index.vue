<template>
 <div style="width:400px;height:400px">
    <EcResize :option="ecOption"></EcResize>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import EcResize from '@/components/vue3-echarts';

const ecOption = computed(() => {
  return {
    xAxis: {
      type: "category",
      data: [1, 2, 3, 4, 5],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "line",
        data: [1, 2, 3, 4, 5],
      },
    ],
  };
});
</script>
<style lang="less" scoped>

</style>