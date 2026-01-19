// 列表容器-滚动懒加载数据-组件-intersectionObserver API 实现方式
<template>
 <div class="chen__list-scroll-intersectionObserver" ref="containerRef">
    <div v-for="item in data" :key="item[keyProp]" class="scroll-item" :data-key="item[keyProp]" :class="{'not-rendered': !shouldRender(item)}">
      <slot :row="item" v-if="shouldRender(item)" />
    </div>
  <div class="no-more-data" v-if="data && noMoreText">{{ noMoreText }}</div>
 </div>
</template>
<script setup lang="ts">
import { shallowReactive, PropType, onMounted, onBeforeUnmount, useTemplateRef, nextTick } from 'vue';

const props = defineProps({
  // 列表数据, 默认为空数组,必传
  data: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  // 列表项的唯一标识属性名(data数据中每个对象都有这个属性，且还必须是唯一的), 默认为id,必传
  keyProp: {
    type: String as PropType<string>,
    default: 'id'
  },
  // 没有更多数据时显示的文本
  noMoreText: {
    type: String as PropType<string>,
    default: '没有更多数据了'
  },
  // 触发回调的阈值（0~1，表示可见比例）
  threshold: {
    type: Number as PropType<number>,
    default: 0
  },
  // 观察范围的外边距，可提前触发
  rootMargin: {
    type: String as PropType<string>,
    default: '0px'
  }
});

// 列表容器实例
const containerInstall = useTemplateRef<HTMLElement | null>('containerRef');

// 记录哪些元素已经渲染出来了
const renderObj = shallowReactive({});

// 检查是否需要渲染列表项 （在renderObj中存在该列表项的key值时返回true）
const shouldRender = (item:any) => {
  return renderObj[item[props.keyProp]];
};

/**
 * 获取需要渲染的列表项, 保存在renderObj中
 */
const getToRenderItemsRenderObj = (target: HTMLElement) => {
  // 拿到当前元素的属性值, 这个属性值要求是唯一的， 比如：data-key="1" 中 拿到 1
  const attr = target?.getAttribute('data-key') || '';
  if(!attr) return false; // 如果没有属性值，就不处理
  if(renderObj[attr]) return false; // 如果已经渲染过了，就不重复渲染
  // 标记为已渲染
  renderObj[attr] = true;
  return true;
}

/**
 * 把出现在容器可视范围内的列表项，标记为已渲染
 * @param entries 出现在容器可视范围内的列表项
 */
const renderLoadItems = (entries:Array<any>) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let isRendered = getToRenderItemsRenderObj(entry.target);
      if(!isRendered) return;
    }else {
      // 退出循环，因为后面的元素都还不需要显示
      return;
    }
  });
}

let observer = new IntersectionObserver((entries) => {
  renderLoadItems(entries);
},{
  rootMargin: props.rootMargin, // 观察范围的外边距，可提前触发
  root: containerInstall.value, // 监听的可视区域（默认是 null，即视口）
  threshold: props.threshold, // 每个被监听的元素，触发回调的阈值（0~1，表示可见比例）
});

/**
 * 滚动到指定的列表项
 * @param id 列表项的唯一标识值,可以是唯一的id,也可以是其他属性值
 */
const scrollToItem = async (id: string | number) => {
    // 如果要滚动时，还未有数据，则等下下一帧，如果还没数据则取消滚动
  if (!props.data) {
    // 这个nextTick不能去掉
    await nextTick();
    if (!props.data) {
      return;
    }
  }
    // 确保面板渲染后再滚动，就可以保证目标元素一定完整出现在界面中
  nextTick(() => {
    const targetDom = containerInstall.value.querySelector(`[data-key="${id}"]`)
    targetDom && targetDom.scrollIntoView({ block: 'start' });
  });
};

/**
 * 滚动到顶部
 */
const scrollToTop = () => {
  containerInstall.value.scrollTop = 0;
};

onMounted(() => {
  const scrollItems = document.querySelectorAll('.scroll-item');
  scrollItems.forEach((item) => {
    observer.observe(item);
  });
});

onBeforeUnmount(() => {
  observer.disconnect();
  observer = null;
});

defineExpose({
  scrollToItem,
  scrollToTop
});


</script>
<style lang="less" scoped>
.chen__list-scroll-intersectionObserver {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.scroll-item {
  width: 100%;
  &.not-rendered {
    min-height: 200px;
  }
}
.no-more-data {
  margin-top: 30px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
  color: #667085;
}
</style>