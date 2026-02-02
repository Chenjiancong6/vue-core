<template>
 <div class="chen-clear-console">
  <h1>一个用于清除代码中 `console`、`alert`、`debugger`语句的 Vite 插件</h1>
   <h1>如何使用：</h1>
  <div class="text">安装插件：pnpm add @cjc/vite-plugin-chen-vant-auto-import</div>
  <h1>功能特性:</h1>
  <div class="text">1. 支持清除 `console.log`、`console.warn`、`console.error`等所有 console 方法</div>
  <div class="text">2. 支持清除 `alert`弹窗语句</div>
  <div class="text">3. 支持清除 `debugger`断点语句</div>
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

console.log('项目启动后，以及热更新，每次都在控制台上打印项目的应用名称、环境标题和服务URL信息');
console.warn('项目启动后，以及热更新，每次都在控制台上打印项目的应用名称、环境标题和服务URL信息');
debugger;
alert('项目启动后，以及热更新，每次都在控制台上打印项目的应用名称、环境标题和服务URL信息');

</script>
<style lang="less" scoped>
h1{
  margin-bottom: 20px;
}
.text{
  margin-bottom: 20px;
}
</style>