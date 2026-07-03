<template>
 <div class="vue3-loading-body">
  <MobileReadme></MobileReadme>
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import MobileReadme from "@/components/vue3-loading/vue3-mobile-loading/README.md";

</script>
<style lang="less" scoped>
.vue3-loading-body {
  width: 70%;
  margin: 0 auto;
}
</style>