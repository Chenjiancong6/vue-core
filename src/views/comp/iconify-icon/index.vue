<template>
 <div class="chen-iconify-local-svg-icon--wrap">
  <h1>本地/在线 svg图标</h1>
  <Icon icon="svg-icon:top-text-search" :size="'52px'"  :color="'#db1818'" />
  <Icon icon="svg-icon:ai-text"  />
  <Icon icon="svg-icon:fire" :color="'rgba(29, 107, 255, 1)'"/>
  <Icon icon="ic:baseline-10k" />
  <Icon icon="ic:baseline-3p" />
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Icon from './compoents/iconify-local-svg-icon/index.vue';

</script>
<style lang="less" scoped>
  .chen-iconify-local-svg-icon--wrap {
    color: #db1818;
    // color: rgba(29, 107, 255, 1);
    font-size: 24px;
  }
</style>