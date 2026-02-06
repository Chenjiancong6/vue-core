<template>
 <div class="cjc-mobile-ec--resize" :style="ecStyle">
  <div class="cjc-mobile-ec--resize__echarts" ref="echartsRef"></div>
  <slot />
 </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, useTemplateRef } from 'vue';
import * as echarts from 'echarts/core'; // 引入 echarts 核心模块(按需引入)
import ResizeObserver from '@cjc/dom-resize-observer';

const props = defineProps({
  option: {
    type: Object,
    default: () => null,
  },
  width: {
    type: [Number, String],
    default: '',
  },
  height: {
    type: [Number, String],
    default: '',
  },
  needDispose: { // 是否销毁并新建 echarts 对象
    type: Boolean,
    default: true
  },
  theme: { // 主题
    type: String,
    default: ''
  },
})

const emits = defineEmits(['instanceReady', 'optionReady']);

// echarts 容器的dom 节点
const ecResizeRefInstance = useTemplateRef('echartsRef');
// 保存echarts实例
const echartInstance = ref<any>(null);

// 计算图表宽高样式
const ecStyle = computed(() => {
  let style:any = {};
  if (props.width != '') {
    style.width = typeof props.width === 'number' ? props.width + 'px' : props.width;
  }
  if (props.height != '') {
    style.height = typeof props.height === 'number' ? props.height + 'px' : props.height;
  }
  return style;
});

// 创建图表实例
const createEchartInstance = () => {
  // 如果 echarts实例不存在，则创建
  if (!echartInstance.value) {
    echartInstance.value = echarts?.init(ecResizeRefInstance.value, props.theme);
    emits('instanceReady', echartInstance);
  }
};

// 销毁图表实例
const destroyEcharts = (dispose: boolean = false) => {
  if(!echartInstance.value) {
    return;
  };
  // 如果需要强制销毁，或者本身就需要销毁的，则销毁echart实例
  if (dispose || props.needDispose) {
    echartInstance.value?.dispose();
    echartInstance.value = null;
  }
};

// 更新配置项
const updateOption = () => {
  const option = props.option;

  // 如果props.option 传入 null 或者 undefined ，则销毁图表实例
  destroyEcharts(!option);

  if(!option) {
    return;
  };

  // 如果 echarts实例不存在，则创建
  createEchartInstance();

  if (echartInstance.value) {
    echartInstance.value.setOption(option); // 配置项更新
  }
  emits('optionReady', echartInstance);
};

watch(() => props.option, () => {
  updateOption();
}, {
  deep: true
});

watch(() => props.needDispose, () => {
  destroyEcharts();
});

onMounted(() => {
  // 初始化 echarts 实例 和配置项
  updateOption();
  // 监听尺寸变化
  ResizeObserver.resizeObserver(ecResizeRefInstance.value, () => {
    // 图表容器大小改变时自适应容器大小
    echartInstance.value && echartInstance.value?.resize();
  });
});

onBeforeUnmount(() => {
  // 销毁实例
  destroyEcharts(true);
  // 销毁dom元素监听
  ResizeObserver.unobserve(ecResizeRefInstance.value);
});


</script>
<style lang="less" scoped>
.cjc-mobile-ec--resize {
  height: 100%;
}
.cjc-mobile-ec--resize__echarts {
  height: 100%;
}
</style>