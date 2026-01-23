<template>
 <div class="not-found">
  <!-- <img src="./svgs/404.svg" alt="404" /> -->
   <Icon icon="svg-icon:404" size="780" />
 </div>
</template>
<script setup lang="ts">
  import Icon from "@cjc/vue3-svg-icon";

</script>
<style lang="less" scoped>
.not-found {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>