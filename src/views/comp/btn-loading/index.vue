<template>
  <div class="package-btn-loading">
    <my-button @click="onClick">
      <!-- <template #default>按钮</template> -->
      {{ state }}
    </my-button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import myButton from "./my-button.vue";

const state = ref('获取数据');

// 模拟接口异步请求
const getData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("数据获取成功");
    }, 2000);
  });
};

// 如果子组件不设置defineOptions({inheritAttrs: false,}),
// 则子组件会继承父组件的事件, 导致点击事件触发两次
const onClick = async () => {
  state.value = '加载中...';
  console.log("点击事件执行多少次？");
  state.value = await getData();
  // getData().then((res) => {
  //   state.value = res;
  // });
};
</script>

<style lang="less" scoped>
.package-btn-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
