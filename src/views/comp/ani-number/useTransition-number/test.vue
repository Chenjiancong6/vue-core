<script setup lang="ts">
import CountTo from './index.vue'
</script>

<template>
  <!-- 基础：整数 + 千分位 -->
  <CountTo :end="128400" />

  <!-- 带小数、前缀、时长 -->
  <CountTo :end="98.6" :decimals="1" suffix="%" :duration="1500" />

  <!-- 金额 -->
  <CountTo :end="3650000" prefix="¥" separator="," />

  <!-- 监听动画结束 -->
  <CountTo :end="100" @finished="console.log('done')" />

  <!-- 带小数、前缀、时长 -->
  <CountTo :end="3650000.2354" prefix="¥" separator="," :decimals="2" :decimal="'-'"/>
</template>