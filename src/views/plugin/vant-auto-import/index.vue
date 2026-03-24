<template>
  <div class="vant-auto-import">
    <div class="intro-info">
      <h1>为什么要自己写Vant 按需导入插件的原因：</h1>
      <div>
        <div>1.官方提供的按需引入组件样式，需要安装导入三个包，使用起来会变得繁琐，不方便管理</div>
        <div>2.自己写插件，可以自动引入对应的vant组件的依赖代码，使用起来更加方便</div>
        <div>3.插件的代码量比较小，不会影响性能</div>
      </div>
      <h1>官方推荐插件导入和使用方式：</h1>
      <div>
        <div>1.安装插件</div>
        <div>pnpm add @vant/auto-import-resolver unplugin-vue-components unplugin-auto-import -D</div>
        <div>2. 配置插件</div>
        <div>plugins: [
            AutoImport({
              resolvers: [VantResolver()],
            }),
            Components({
              resolvers: [VantResolver()],
            }),
          ]
        </div>
      </div>
      <h1>vite-plugin-chen-vant-auto-import 插件介绍：</h1>
      <div class="item">根据template标签自动引入对应的vant组件的插件</div>
      <div class="item">比如使用van-button组件，在template标签中使用van-button组件，插件会自动引入van-button组件的依赖代码</div>
      <div class="item">经过插件编译后，会添加如下代码：</div>
      <div class="item">
        <div>import VanButton from 'vant/es/button/index.mjs';</div>
        <div>import 'vant/es/button/style';</div>
      </div>
    </div>

    <van-button type="primary" @click="handleClick" style="margin-bottom: 20px;">
      自动引入vant组件
    </van-button>
    <van-cell title="选择单个日期" :value="date" @click="show = true" style="margin-bottom: 20px;" />
    <van-calendar v-model:show="show" @confirm="onConfirm" />

    <van-switch v-model="checked" style="margin-bottom: 20px;" />

    <van-barrage v-model="list" :auto-play="true">
      <div class="video" style="width: 100%; height: 150px"></div>
    </van-barrage>
    <van-space style="margin-bottom: 20px;">
      <van-button @click="add" type="primary" size="small"> 弹幕 </van-button>
    </van-space>
    <Com />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { showDialog } from 'vant';
import Com from './com.vue';
import { handleClickImagePreview } from './index.js';

const date = ref('');
const show = ref(false);
const checked = ref(true);

const formatDate = (date) => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};
const onConfirm = (value) => {
  show.value = false;
  date.value = formatDate(value);
};

const defaultList = [
  { id: 100, text: '轻量' },
  { id: 101, text: '可定制的' },
  { id: 102, text: '移动端' },
  { id: 103, text: 'Vue' },
  { id: 104, text: '组件库' },
  { id: 105, text: 'VantUI' },
  { id: 106, text: '666' },
];

const list = ref([...defaultList]);
const add = () => {
  list.value.push({ id: Math.random(), text: 'Barrage' });
};

const handleClick = () => {
  showDialog({ message: '提示' });
  handleClickImagePreview();
}

</script>
<style lang="less" scoped>
.intro-info {
  margin-bottom: 30px;

  .item {
    margin: 10px 0;
  }
}
h1{
 margin-top: 50px; 
}
</style>