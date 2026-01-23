<template>
 <div class="el-icon chen-iconify-local-svg-icon" :style="getIconStyle">
  <svg class="chen-local-svg-icon__svg" v-if="isLocalIcon" aria-hidden="true">
    <!-- 这里的 xlink:href 值必须与 symbolId 匹配 -->
    <use :xlink:href="symbolId"></use>
  </svg>
  <span class="chen-svg-icon__iconify iconify" v-else>
    <Icon :icon="symbolId" />
  </span>
 </div>
</template>
<script setup lang="ts">
import { computed, unref } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
  // 图标名称
  icon: {
    type: String,
    default: ''
  },
  // 图标大小
  size: {
    type: Number || String,
    default: null
  },
  // 图标颜色
  color: {
    type: String,
    default: ''
  }
})

// 约定：如果图标名称以 svg-icon: 开头，则认为是本地图标
const isLocalIcon = computed(() => props.icon.startsWith('svg-icon:'));

// 图标名称
const symbolId = computed(()=> {
  return unref(isLocalIcon) ? `#icon-${props.icon.replace('svg-icon:', '')}` : props.icon;
});

/**
 * 设置style样式
 */
const getIconStyle = computed(() => {
  const style:any = {};
  if (props.size) {
    if(typeof props.size === 'number'){
      style.fontSize = `${props.size}px`;
    } else if(typeof props.size === 'string'){
      if(props.size.endsWith('px')){
        style.fontSize = props.size;
      } else {
        style.fontSize = `${props.size}px`;
      }
    }
  }
  if (props.color) {
    if(typeof props.color !== 'string'){
      throw new Error('color must be a string');
    };
    // 处理颜色值，例如 #fff, rgb(255,255,255), rgba(255,255,255,0.5)
    style.color = props.color;
  }
  return style;
});


</script>
<style lang="less" scoped>
.chen-iconify-local-svg-icon {
  height: 1em;
  width: 1em;
  line-height: 1em;
  position: relative;
  fill: currentColor;
  color: inherit;
  font-size: inherit;
}
.chen-local-svg-icon__svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>