// 图片加载骨架屏
<template>
  <div class="image-skeleton__wrap">
    <img src="./images/image-loading.svg" alt="" class="image-skeleton__img" />
  </div>
</template>
<script setup lang="ts">

</script>
<style lang="less" scoped>
.image-skeleton__wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #f0f2f5 25%, #e6e8eb 37%, #f0f2f5 63%);
  background-size: 400% 100%;
  animation: loading-ani 1.4s ease infinite;
}

.image-skeleton__img {
  width: 40%;
  height: 40%;
}

@keyframes loading-ani {
  0% {
    background-position: 100% 50%
  }

  to {
    background-position: 0 50%
  }
}
</style>