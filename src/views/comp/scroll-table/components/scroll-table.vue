<template>
  <el-table 
    class="chen-scroll-table"
    :data="props.data" 
    ref="scrollTableRef" 
    highlight-current-row
    @row-click="highlightcurrentIndex"
    @mouseover="mouseoverHandler"
    @mouseout="mouseoutHandler" 
    size="small" 
    v-bind="$attrs"
  >
    <slot></slot>
  </el-table>
</template>
<script setup lang="ts">
import { nextTick, useTemplateRef, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => []
  },
  // 自动滚动
  autoScroll: {
    type: Boolean,
    default: true
  },
  // 定时滚动时间间隔
  interval: {
    type: Number,
    default: 3000
  },
})

// 滚动表格实例
const scrollTableInstance = useTemplateRef<HTMLTableElement | any>('scrollTableRef');
// 滚动表格当前索引, 默认0, 外部必须传入一个v-model
const currentIndex = defineModel<number>();
// 滚动表格定时器
let playInterval = null;

/**
 * 自动滚动
 */
const autoScroll = () => {
  if(!props.autoScroll) return;

  // 先清除定时任务
  playInterval && clearInterval(playInterval);

  playInterval = setInterval(async() => {
    // 列表滚动索引+1
    currentIndex.value++;

    // 等待表格行列表滚动索引+1渲染完成,才渲染下面的代码
    await nextTick();
 
    // 滚动到底部，索引重置为0
    if(currentIndex.value >= props.data.length) {
      currentIndex.value = 0;
    };
      
    if(!scrollTableInstance || !scrollTableInstance.value) return;

    // 拿到整个表单元素
    const $elTable = scrollTableInstance.value.$el;
    // 拿到表格行元素
    const $rows = $elTable.querySelector('.el-table__body-wrapper tbody tr');
    if(!$rows) return;
    // 获取表格行高
    const rowHeight = $rows.offsetHeight;

    // 调用表格滚动方法，滚动到一组特定坐标（这是整个组件重要的滚动事件！！）
    scrollTableInstance.value?.scrollTo({
      top: currentIndex.value * rowHeight,
      left: 0,
      behavior: currentIndex.value == 0 ? 'smooth' : 'instant'
    });

  }, props.interval);

};

/**
 * 用于单选表格，设定某一行为选中行
 * @param index 表格当前行的索引
 */
const setCurrentRow = (index) => {
  // element-plus 表格组件 setCurrentRow 方法参数为行数据
  scrollTableInstance.value?.setCurrentRow(props.data[index]);
};

/**
 * 当某一行被点击时会触发该事件
 * @param row 点击的行数据
 * @param column 点击的列数据
 * @param event 点击事件
 */
const highlightcurrentIndex = (row, column, event) => {
  // 获取点击行的索引
  currentIndex.value = props.data?.findIndex(item => item === row);
};

// 当鼠标移入表格行时会触发该事件
const mouseoverHandler = () => {
  // 鼠标移过去面板，停止滚动
  playInterval && clearInterval(playInterval);
};

// 当鼠标移出表格行时会触发该事件
const mouseoutHandler = () => {
  // 鼠标移出面板，开始滚动
  autoScroll();
};

watch(() => currentIndex.value, (newVal, oldVal) => {
  setCurrentRow(newVal);
});

watch(() => props.data, () => {
  autoScroll();
},{
  immediate: true
});

onMounted(() => {
  if((currentIndex.value === undefined || currentIndex.value === null) && props.autoScroll) {
    throw new Error('设置自动滚动时，组件必须传入一个v-model 来绑定当前滚动选中的行索引');
  }
  setCurrentRow(currentIndex.value);
});

onBeforeUnmount(() => {
  playInterval && clearInterval(playInterval);
  playInterval = null;
});

// 暴露方法
defineExpose({
  $ref: scrollTableInstance,
  setCurrentRow
})
</script>
<style lang="less" scoped>
.chen-scroll-table {
  // 修改表格暂无数据
  .el-table__empty-block{
    height: auto !important;
  }
}
</style>