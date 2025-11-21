<template>
 <div class="com-draggable--wrapper">
  <div class="com-draggable--container" ref="containerRef">
    <!-- 触发可拖拽组件的区域 -->
    <div class="com-draggable--header">
      <span>···</span>
    </div>
    <div class="com-draggable--content">
      可拖拽组件
    </div>
  </div>
 </div>
</template>
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { useDraggable } from '@/hooks/use-draggable';

const containerIntance = useTemplateRef<HTMLElement>('containerRef');

const { initDrag } = useDraggable({
  containerRef: containerIntance,
  draggableSelector: '.com-draggable--header',
  dragContainerSelector: '.com-draggable--wrapper',
  // autoInit: false, // 手动初始化拖拽
});

// 手动初始化拖拽
// setTimeout(() => {
//   initDrag();
// }, 3000);

</script>
<style lang="less" scoped>
.com-draggable--wrapper {
  width: 50%;
  height: 50%;
  position: relative;
  user-select: none;
  background-color: rgba(0, 0, 0, 0.5);
}
.com-draggable--container {
  width: 350px;
  height: 350px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.com-draggable--content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.com-draggable--header {
  width: 100%;
  height: 20px;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: white;
  }
}
</style>