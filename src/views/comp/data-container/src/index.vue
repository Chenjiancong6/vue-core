<template>
 <div class="cjc-data--container" :class="{'is--fix': state !== 'data'}">
  <div v-if="state === 'loading'">
    <div class="cjc-data-container__icon" v-html="DataLoadingSvg"></div>
    <span>数据加载中...</span>
  </div>
  <div v-else-if="state === 'nodata'">
    <div class="cjc-data-container__icon" v-html="DataNodataSvg"></div>
    <span>暂无数据</span>
  </div>
  <div v-else>
    <slot></slot>
  </div>
 </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
// 使用raw方式导入SVG
import DataLoadingSvg from './svgs/data-loading-icon-light.svg?raw';
import DataNodataSvg from './svgs/data-nodata-icon-light.svg?raw';

  interface Props {
    data: any;
  }
  const props = withDefaults(defineProps<Props>(), {
    data: ''
  });

  const state = computed(() => {
    // data值为null、undefined 对应显示 数据加载中
    if (props.data === null || props.data === undefined) {
      return 'loading';
    }
    // data值为''、[]、{} 对应显示 暂无数据
    if(props.data === '' || ['{}','[]'].includes(JSON.stringify(props.data))) {
      return 'nodata';
    }
    return 'data';
  });

</script>
<style lang="less" scoped>
.cjc-data--container {
  width: 100%;
  height: 100%;
  &.is--fix {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.cjc-data-container__icon {
  margin-bottom: 10px;
  font-size: 64px;
  display: block;
}
</style>