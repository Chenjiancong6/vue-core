<template>
  <div class="custom-cls">
  <div>这是一个自定义组件。</div>
  <div class="">{{ attrs.customAttrs.label }}。</div>
  <div>{{  model }}</div>
 </div>
</template>
<script setup lang="ts">
import { ref, useAttrs, onMounted } from 'vue';

const attrs = useAttrs();

const model = defineModel()

onMounted(()=> {
  console.log('attrs',model);
})

</script>
<style lang="less" scoped>

</style>