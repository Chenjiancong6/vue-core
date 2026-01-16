// 列表容器-滚动懒加载数据-组件
<template>
 <div class="chen_list-scroll-lazy-loading-container" ref="containerRef">
  <!-- 需要给 scroll-item元素一个默认的高度（not-rendered），getToRenderItems函数才能拿到几何数据，因为初始化时所有列表项都是未渲染的 -->
  <div class="scroll-item" v-for="item in data" :key="item[keyProp]" :data-key="item[keyProp]" :class="{'not-rendered': !shouldRender(item)}">
    <slot :row="item" v-if="shouldRender(item)" />
  </div>
  <div class="no-more-data" v-if="data && noMoreText">{{ noMoreText }}</div>
 </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, PropType, useTemplateRef, shallowReactive , nextTick, watch } from 'vue';
import { useEventListener } from "@/hooks/use-eventListener";
import { throttle } from "lodash-es";

const props = defineProps({
  data: {
    type: Array as PropType<Array<any>>,
    default: () => []
  },
  // 列表项的唯一标识属性名(data数据中每个对象都有这个属性，且还必须是唯一的)
  keyProp: {
    type: String as PropType<string>,
    default: 'id'
  },
  // 没有更多数据时显示的文本
  noMoreText: {
    type: String as PropType<string>,
    default: '没有更多数据了'
  }
});

// 列表容器实例
const containerInstall = useTemplateRef<HTMLElement | null>('containerRef');
// 渲染对象(用于存储已经渲染完成的列表项)
const renderObj = shallowReactive({});

// 检查是否需要渲染列表项 （在renderObj中存在该列表项的key值时返回true）
const shouldRender = (item: any) => {
  return renderObj[item[props.keyProp]];
};

/**
 * 判断当前列表元素是否出现在容器的可见范围
 * @param container 列表容器实例
 * @param element 当前列表元素实例
 * @returns true/false
 */
const hasElementInViewPort = (container, element) => {
  // 获取容器和元素的精确几何信息
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  // 计算关键边界值（考虑滚动位置）
  // 容器/元素顶部距离视口顶部的距离
  const containerTop = containerRect.top + window.scrollY;
  const elementTop = elementRect.top + window.scrollY;

  // 容器/元素底部距离视口顶部的距离
  const containerBottom = containerRect.bottom + window.scrollY;
  const elementBottom = elementRect.bottom + window.scrollY;

  /**
   * 判断元素是否在容器的可见范围内
   * 1. 元素底部距离视口的距离 大于 容器顶部距离视口的距离
   * 2. 元素顶部距离视口的距离 小于 容器底部距离视口的距离
   * 3. 容器宽度大于0
   * 4. 元素宽度大于0
   */
 return (
  elementBottom > containerTop && 
  elementTop < containerBottom && 
  elementRect.height > 0 && // 排除容器宽度为0的情况
  elementRect.width > 0 // 排除元素宽度为0的情况
 )
};

/**
 * 判断当前列表元素是否出现在容器的可见范围下方
 * @param container 列表容器实例
 * @param element 当前列表元素实例
 * @returns true/false
 */
const hasElementBelowInViewPort = (container, element) => {
  // 获取容器和元素的精确几何信息
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  // 容器底部距离视口的距离
  const containerBottom = containerRect.bottom + window.scrollY;
  // 元素顶部距离视口顶部的距离
  const elementTop = elementRect.top + window.scrollY;

  /**
   * 判断元素是否在容器的可见范围内下方
   * 1. 元素顶部距离视口的距离 大于等于 容器底部距离视口的距离
   */
  return elementTop >= containerBottom;
};

/**
 * 获取需要渲染的列表项, 保存在renderObj中
 */
const getToRenderItems = throttle(() => {
  if(!containerInstall.value) return;
  // 拿到渲染的全部列表项
  const domList = Array.from(containerInstall.value.querySelectorAll('.scroll-item'));

  // 遍历所有列表项，判断是否需要渲染
  for (const dom of domList) {
    // 拿到每个元素的Attribute 属性，比如：data-key="1" 中 拿到 1
    const attr = dom?.getAttribute('data-key') || '';
    if(!attr) continue;
    // 1. 如果在renderObj中存在该列表项的key值时，结束本次循环
    if(renderObj[attr]) {
      continue
    }
    // 2. 如果这个元素在视口范围外，说明后面的元素都还不需要显示，结束本次循环
    if(hasElementBelowInViewPort(containerInstall.value, dom)) {
      return;
    }

    // 3. 如果这个元素在视口范围内，说明该元素需要显示，把唯一的属性值保存到renderObj中
    if(hasElementInViewPort(containerInstall.value, dom)) {
      renderObj[attr] = true;
    }
  }
},200);

 
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
  // 找到要滚动的列表项的下标，然后给它前后2个元素都渲染出来，再滚动到它
  const scrollItemIndex = props.data.findIndex((item: any) => item[props.keyProp] === id);
  if (scrollItemIndex === -1) {
    throw new Error(`列表中不存在唯一标识值为${id}的元素`);
  };

  // 给它前后2个元素都渲染出来
  let beforeItem = props.data[scrollItemIndex - 1],
    curItem = props.data[scrollItemIndex],
    afterItem = props.data[scrollItemIndex + 1];

  // 如果元素存在，保存到renderObj中
  if(beforeItem) renderObj[beforeItem[props.keyProp]] = true;
  if(curItem) renderObj[curItem[props.keyProp]] = true;
  if(afterItem) renderObj[afterItem[props.keyProp]] = true;

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

// 监听变化 ， 容器变化时，数据变化，滚动时都触发getToRenderItems函数
const resizeObserver = new ResizeObserver(() => {
  getToRenderItems();
});

onMounted(() => {
  //1. 监听容器变化
  resizeObserver.observe(containerInstall.value);
  // 2. 监听滚动事件
  useEventListener(containerInstall, 'scroll', getToRenderItems);
});

//3. 监听数据变化，数据变化时，重新获取需要渲染的列表项
watch(() => props.data, () => {
  nextTick(() => {
    if(!containerInstall.value) return;
    getToRenderItems();
  });
});

onBeforeUnmount(() => {
  resizeObserver.disconnect();
});

// 暴露方法
defineExpose({
  scrollToItem,
  scrollToTop
});


</script>
<style lang="less" scoped>
.chen_list-scroll-lazy-loading-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.scroll-item {
  width: 100%;
  &.not-rendered {
    min-height: 214px;
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