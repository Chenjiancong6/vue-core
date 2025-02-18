<template>
 <div class="layout-wrap">
  <div class="router-wrap">
    <router-view />
  </div>
 </div>
</template>
<script setup>
import { ref } from 'vue';

</script>
<style lang="less" scoped>
.layout-wrap {
  height: 100%;
  width: 100%;
}
.router-wrap {
  
  overflow: hidden;
}
</style>