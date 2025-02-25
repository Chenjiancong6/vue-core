<template>
  <div class="canvas-wrap">
    <canvas></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCanvasTextWaterfallFlow } from '@/hooks/useCanvasTextWaterfallFlow';


const { canvasTextWaterfallFlow } = useCanvasTextWaterfallFlow();

onMounted(() => {
  canvasTextWaterfallFlow('#fff')
})
</script>
<style lang="less" scoped>
.canvas-wrap {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #000;
}

::v-deep .el-main {
  padding: 0 !important;
  /* 覆盖默认的 padding */
}

canvas {
  height: 100%;
  width: 100%;
}
</style>