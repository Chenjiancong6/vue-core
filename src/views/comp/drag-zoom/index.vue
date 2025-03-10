<template>
  <!-- <div class="v3-drag-zoom-wrap"> -->
  <Vue3DraggableResizable :parent="true" class="v3-drag-zoom-container">

    <!-- <div>
      {{ msg }} 
    </div> -->
    <!-- <textWaterFall /> -->

    <div class="drap-warp">
      <!-- <div>
        Hello Vue 3 + Vite,Hello World. Hello World. Hello World.
      </div> -->
      <img src="./imgs/图像.jpeg" alt="">
      <!-- <div class="content-wrap">11111111111111111111111111111111111111111111154646462425344444</div> -->
    </div>
  </Vue3DraggableResizable>
  <!-- </div> -->
</template>

<script setup>
import { ref } from "vue";
import { V3DragZoomContainer } from "v3-drag-zoom";
import textWaterFall from '../text-waterfall-flow/index.vue'

const msg = ref("Hello Vue 3 + Vite,Hello World. Hello World. Hello World.");
</script>

<style lang="less" scoped>
.v3-drag-zoom-wrap {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // height: 100%;
  // position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
}

.v3-drag-zoom-container {
  position: relative;
  width: 250px;
  height: 250px;
  // width: 100%;
  // height: 100%;
}

.drap-warp {
  width: 100%;
  height: 100%;
  border: #000 solid 1px;
  // position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  background-color: rgba(223, 6, 6, 0.934);

  img {
    width: 100%;
    height: 100%;
  }
}

.content-wrap {
  width: 250px;
  height: 250px;
  background-color: rgba(6, 223, 107, 0.934);
}
</style>
