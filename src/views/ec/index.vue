<template>
  <div class="ec-container">
    <div style="width:400px;height:400px">
      <EcResize :option="ecOption"></EcResize>
    </div>
    <div class="ec-pie">
      <EcResize :option="ecOptionPie"></EcResize>
    </div>

    <div class="ec-bar" :style="{width: barWidth + 'px', height: barHeight + 'px'}">
      <EcResize :option="ecOptionBar"></EcResize>
      <div style="display: flex;">
        <el-button type="primary" @click="handleClick">点击测试dom变化echarts尺寸是否会自动变化</el-button>
        <el-button type="primary" @click="handleClickOption">点击测试配置项变化echarts配置是否会自动变化</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import EcResize from '@/components/vue3-echarts';

const barWidth = ref(400);
const barHeight = ref(400);

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

const ecOptionPie = computed(() => {
  return {
    series: [
      {
        type: "pie",
        data: [
          { value: 100, name: "A" },
          { value: 200, name: "B" },
          { value: 300, name: "C" },
        ],
      },
    ],
  };
});

const ecOptionBar = ref({
  xAxis: {
    type: "category",
    data: [1, 2, 3, 4, 5],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      type: "bar",
      data: [1, 2, 3, 4, 5],
    },
  ]
});

const handleClick = () => {
  barWidth.value = 600;
  barHeight.value = 600;
}

const handleClickOption = () => {
  ecOptionBar.value.series[0].data = [6, 7, 8, 9, 10];
}

</script>
<style lang="less" scoped>
.ec-container {
  display: flex;
  width: 100%;
  height: 100%;
}
.ec-pie {
  width: 400px;
  height: 400px;
}
.ec-bar {
  width: 400px;
  height: 400px;
}
</style>