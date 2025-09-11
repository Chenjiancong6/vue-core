<template>
  <div class="cjc-ec--resize" :style="ecStyle">
    <div class="cjc-ec--resize__echarts" ref="ecResizeRef"></div>
    <!-- 预留插槽，用于自定义内容 -->
    <slot />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, useTemplateRef, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';
import makeOption from './font-seize-option.js';
import config from '@/components/scaleConfig';
import ResizeObserver from '@/components/dom-resize-observer';

const props = defineProps({
  option: {
    type: Object,
    default: () => ({})
  },
  width: {
    type: [String, Number],
    default: ''
  },
  height: {
    type: [String, Number],
    default: ''
  },
  theme: { // 主题
    type: String,
    default: ''
  },
  needDispose: { // 是否销毁并新建 echarts 对象
    type: Boolean,
    default: true
  },
  fontSizeScale: { // 字体缩放比例
    type: Number,
    default: 1
  },
});

const emits = defineEmits(['instanceReady', 'optionReady']);

// echarts 容器的dom 节点
const ecResizeRefInstance = useTemplateRef('ecResizeRef');
// 保存echarts实例
const echartInstance = ref<any>(null);

// echarts配置项改变时
const optionChange = (options = null) => {
  let option = options || props.option;

  // 如何没有配置项，则销毁 echarts 实例， 否则会存留上一个图表的内容
  destroyEcharts(!option);

  if (!option) return;

  // 初始化 echarts 实例
  createEcharts();

  // 拿到字体缩放比例， '@/components/scaleConfig' 公共组件中的换算后的比例
  let fontSizeScale = config.echarts?.sizeScale || config?.fontSizeScale || config.echarts?.sizeScale || config.echarts?.fontSizeScale || 1;

  // 最后呈现的字体放大倍数，就是在全局的配置基础上，再叠加本次要缩放的倍数
  fontSizeScale = fontSizeScale * props.fontSizeScale;

  // 调用字体大小配置函数，返回新的配置项
  option = makeOption({ sourceOption: option, fontSizeScale });

  // 给echarts实例设置新的配置项
  echartInstance.value.setOption(option);

  // 图表配置项 传递出去
  emits('optionReady', option);
}

// 创建 echarts 实例
const createEcharts = () => {
  if (echartInstance.value) return;
  // echarts 主题

  let theme = props.theme || config.echarts?.theme || 'default';
  // 初始化 echarts 实例
  echartInstance.value = echarts.init(ecResizeRefInstance.value, theme);
  // echarts 实例 传递出去
  emits('instanceReady', echartInstance.value);
}

// 销毁 echarts 实例
const destroyEcharts = (forceDispose = false) => {
  if (!echartInstance.value) return;

  // 如果需要强制销毁，或者本身就需要销毁的，则销毁echart实例
  if (forceDispose || props.needDispose) {
    echartInstance.value && echartInstance.value?.dispose();
    echartInstance.value = null;
  }
}

// 图表容器大小改变时自适应容器大小
const resizeEcharts = () => {
  echartInstance.value && echartInstance.value?.resize();
}

// 导出图表图片
const getDataURL = (option: any) => {
  return new Promise((resolve, reject) => {
    const checkEchartsReady = () => {
      if (echartInstance.value) {
        resolve(echartInstance.value.getDataURL({
          type: 'png',
          ...option,
        }));
      };
      requestAnimationFrame(checkEchartsReady);
    };
    checkEchartsReady();
  })
}

// 计算图表样式
const ecStyle = computed(() => {
  let ecStyle: any = {};
  if (props.width !== '') {
    ecStyle.width = typeof props.width === 'number' ? props.width + 'px' : props.width;
  }
  if (props.height !== '') {
    ecStyle.height = typeof props.height === 'number' ? props.height + 'px' : props.height;
  }
  return ecStyle;
})

onMounted(() => {
  // 监听尺寸变化
  ResizeObserver.resizeObserver(ecResizeRefInstance.value, () => {
    // 初始化 echarts 实例 和配置项
    optionChange();
    // 图表容器大小改变时自适应容器大小
    resizeEcharts();
  });
})

onBeforeUnmount(() => {
  // 销毁实例
  destroyEcharts(true);
  // 销毁dom元素监听
  ResizeObserver.unobserve(ecResizeRefInstance.value);
})

watch(() => [props.option, props.fontSizeScale,props.width, props.height], () => {
  optionChange();
},{
  deep: true
})

defineExpose({
  // 给父组件暴露导出图表图片的方法
  getDataURL
})

</script>
<style lang="less" scoped>
.cjc-ec--resize {
  width: 100%;
  height: 100%;
  position: relative;
}

.cjc-ec--resize__echarts {
  width: 100%;
  height: 100%;
}
</style>