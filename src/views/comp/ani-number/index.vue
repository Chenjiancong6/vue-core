<template>
 <div class="ani-number">
  <div class="useTransition-number">
    <div class="title">基于VueUse 的useTransition实现的数字动画计数</div>
    <CountTo :end="3650000" prefix="¥" separator=",">
      <template #scope="scope">
        <div>{{scope.row}}</div>
      </template>
    </CountTo>
    <AniNumber
      :start="0"
      :end="3650000" 
      :autoPlay="true"
      :duration="3000" 
      prefix="¥"
      suffix="rmb" />
  </div>
  <div class="requestAnimation-number">
    <div class="title">基于requestAnimationFrame实现的数字动画计数</div>
    <RequestAnimationNumber :start="0"
      :end="2576" 
      :autoPlay="true"
      :duration="3000" 
      prefix="￥"
      suffix="rmb" />
    </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import CountTo from './useTransition-number/index.vue';
import RequestAnimationNumber from './requestAnimation-number/index.vue';
import AniNumber from '@cjc/vue3-animation-number';

</script>
<style lang="less" scoped>
.ani-number {
  display: flex;
  justify-content: space-around;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
</style>

