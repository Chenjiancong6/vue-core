<template>
  <div class="list-slidein-animation--title">
    列表滑动上升动画指令, 通过 v-slide-in 指令实现
  </div>
  <div class="list-slidein-animation--container">
    <div class="item" v-slide-in v-for="(item,index) in 20" :key="index" :style="{backgroundColor: randomColor()}">
      {{item}}
    </div>
  </div>
</template>

<script setup>
import {} from "vue";

// 随机生成背景颜色
const randomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
</script>

<style lang="less" scoped>
.list-slidein-animation--title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}
.list-slidein-animation--container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.item {
  width: 400px;
  height: 200px;
  font-size: 20px;
  font-weight: 600;
  // 颜色随机生成
  background-color: #dbd3d3;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}
</style>
