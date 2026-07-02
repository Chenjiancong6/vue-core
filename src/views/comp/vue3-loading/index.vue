<template>
 <div class="vue3-loading-body">
  <PCReadme></PCReadme>
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import PCReadme from "@/components/vue3-loading/vue3-pc-loading/README.md";

</script>
<style lang="less" scoped>
.vue3-loading-body {
  width: 70%;
  margin: 0 auto;
}
</style>