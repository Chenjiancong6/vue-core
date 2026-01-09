<template>
 <div class="list-lazyLoading">
  <div class="list-container">
    <div class="list-item" v-for="item in 100" :key="item">
      {{ item }}
    </div>
  </div>
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

</script>
<style lang="less" scoped>
.list-lazyLoading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.list-container {
  width: 400px;
  height: 700px;
  border: 1px solid #000;
  overflow-y: auto;
}
</style>