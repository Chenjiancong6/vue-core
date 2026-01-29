<template>
 <div class="project-console">
  <h1>项目启动后，以及热更新，每次都在控制台上打印项目的应用名称、环境标题和服务URL信息</h1>
  <h1>如何使用：</h1>
  <div class="text">安装插件：pnpm install @cjc/vite-plugin-console -D</div>
  <h1>插件解决了什么问题？</h1>
  <ul class="text">
    <li>1. 当工程运行比较久后，可能会因为控制台打印了太多vite调试输出的正常、异常信息，
    导致无法看到该工程的启动服务端口和其他信息。该插件让工程的启动服务端口和网络信息始终显示在控制台中</li>
    <li>2. 在日常开发中，可能会在编辑器中运行多个前端项目，项目运行很久后，控制台输入的信息会把项目的端口信息顶上去，导致有时候切换到某个项目开发，还需要去控制台找这个项目的启动服务端口，很不方便</li>
  </ul>
  <div>
    <div class="text">下面两个图片展示了插件前后的效果：</div>
    <div class="img-info">
    <img src="./svgs/info.png" alt="" />
    <img src="./svgs/console.png" alt="" style="width: 700px; height: 200px; margin-left: 20px;" />
  </div>
  </div>
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';


</script>
<style lang="less" scoped>
h1{
  margin-bottom: 20px;
}
.text{
  margin-bottom: 20px;
}
.img-info {
  display: flex;
  img {
    width: 500px;
    height: 500px;
  }
}
</style>