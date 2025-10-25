<template>
  <div class="package-btn-loading">
    <!-- <component :is="hCom" @click="onClick" :aaa="111">
      {{ state }}
    </component> -->
    <!-- 函数式组件写法 -->
    <ComButton @click="onClick" :aaa="111">
      {{ state }}
    </ComButton>

    <!-- h函数写法,下面两种是一样的 -->
    <!-- <component :is="hFn" @click="onClick">
      {{ state }}
    </component> -->
    <!-- <hFn @click="onClick" :aaa="111">
      {{ state }}
    </hFn> -->
  </div>
</template>

<script setup>
import { ref, h } from "vue";
import myButton from "./my-button.vue";

/**
 * 函数式组件写法，使用h函数
 * @param com 
 */
const hCom = (com) => {
  return (props, { slots, emits }) => {
    console.log('函数式组件写法----props:', props)
    return h(com, props, slots)
  }
}
let ComButton = hCom(myButton)


/**
 * h函数写法，函数式组件写法 简洁写法
 */
const hFn = (props, { slots, emits }) => {
  console.log('h函数----props:', props);
  return h(myButton, props, slots)
}

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
