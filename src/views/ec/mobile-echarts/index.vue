<template>
  <div class="mobile-echarts--wrapper">
    <div style="width:400px;height:400px">
      <Vue3EchartsMobile :option="ecOption"></Vue3EchartsMobile>
    </div>
    <div style="width:400px;height:400px">
      <Vue3EchartsMobile :option="ecbarOption"></Vue3EchartsMobile>
    </div>
  </div>
  <MyMarkdown></MyMarkdown>
</template>
<script setup lang="ts">
import { computed } from 'vue';
// import Vue3EchartsMobile from '@/components/vue3-echarts-mobile/index.vue';
import Vue3EchartsMobile from '@cjc/vue3-echarts-mobile';
// 直接导入 .md 文件作为 Vue 组件
import MyMarkdown from './README.md';

const ecOption = computed(() => {
  return {
    title: {
      text: "移动端按需引入折线图示例"
    },
    tooltip: {
      trigger: "item"
    },
    xAxis: {
      type: "category",
     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: "value"
    },
      series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }
  ]
  };
})

const ecbarOption = computed(() => {
  return  {
    title: {
      text: "移动端按需引入柱状图图表示例"
    },
    tooltip: {
      trigger: "item"
    },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
};
})

</script>
<style lang="less" scoped>
.mobile-echarts--wrapper {
  display: flex;
  flex-wrap: wrap;
}
</style>