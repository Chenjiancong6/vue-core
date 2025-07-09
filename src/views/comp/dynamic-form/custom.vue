<template>
 <div>这是一个自定义组件。</div>
 <div class="">{{ attrs.customAttrs.label }}</div>
</template>
<script setup lang="ts">
import { ref, useAttrs, onMounted } from 'vue';

const attrs = useAttrs();

onMounted(()=> {
  console.log('attrs',attrs);
})

</script>
<style lang="less" scoped>

</style>