<template>
  <div class="vant-auto-import">
    <div class="intro-info">
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
    <van-space style="margin-top: 10px">
      <van-button @click="add" type="primary" size="small"> 弹幕 </van-button>
    </van-space>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { showDialog } from 'vant';

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
}

</script>
<style lang="less" scoped>
.intro-info {
  margin-bottom: 30px;

  .item {
    margin: 10px 0;
  }
}
</style>