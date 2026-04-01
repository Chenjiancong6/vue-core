<template>
  <div class="chen-iconify-local-svg-icon--wrap">
    <h1 class="title">本地/在线 svg图标（具体使用查阅@cjc/vue3-svg-icon组件说明）</h1>
    <div class="icon-container">
      <div class="item">
        <div>渲染本地svg图标,支持修改颜色（要求图标是矢量图标，且内部修改为 fill="currentColor"）</div>
        <Icon icon="svg-icon:top-text-search"  :color="'#db1818'" />
      </div>
      <div class="item">
        <div>渲染本地svg图标,支持图标修改大小</div>
        <Icon icon="svg-icon:ai-text" :size="'66px'" />
      </div>
      <div class="item">
        <div>渲染线上 iconify图标库的svg图标 （按需从线上网络请求获取图标，图标缓存到本地，后续再用则直接从缓存中获取）</div>
          <Icon icon="ic:baseline-10k" />
          <Icon icon="ic:baseline-3p" />
      </div>
    </div>
    <!-- 下面是组件的一些说明 -->
    <div class="note">
      <h1>组件的优势说明：</h1>
      <div>
        1. 当渲染本地组件时， <strong>@cjc/vite-plugin-cjc-svg-icons</strong> 插件会收集项目中所有svgs文件夹下的图标，将所有 SVG 文件打包成一个大的 SVG Sprite，每个图标成为一个 'symbol' 元素，通过 'use' 元素引用。
      </div>
      <div>
        2. 当使用线上的 iconify图标库的svg图标时，<strong>vite-plugin-purge-icons</strong> 插件在构建时，扫描你的源码，找到所有在使用的在线图标，然后从 Iconify 的库中只提取这些图标的代码，生成一个极小的图标包。
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
// import Icon from './compoents/iconify-local-svg-icon/index.vue';
import Icon from '@cjc/vue3-svg-icon';

</script>
<style lang="less" scoped>
.chen-iconify-local-svg-icon--wrap {
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    margin-bottom: 30px;
  }
}

.icon-container {
  // color: #db1818;
  color: rgba(29, 107, 255, 1);
  font-size: 24px;
  .item {
    margin-bottom: 30px;
  }
}
.note {
  >div {
    margin-bottom: 20px;
  }
}
</style>