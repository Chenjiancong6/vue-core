<template>
  <div class="">
    <!-- v-bind="$attrs" 获取父组件的事件和属性 -->
    <!-- omit($attrs, 'onClick') 在$attrs中剔除 onClick 事件，保留其他事件和方法-->
    <el-button type="primary" :loading="loading" v-bind="omit($attrs, 'onClick')" @click="handleClick">
      <slot></slot>
    </el-button>
  </div>
</template>

<script setup>
import { ref, useAttrs } from "vue";
import { omit } from "lodash-es";

// 禁止继承父组件的事件
defineOptions({
  inheritAttrs: false,
})

// 从父组件获取属性和事件
const attrs = useAttrs();

const loading = ref(false);

// 点击事件
const handleClick = async () => {
  loading.value = true;
  try {
    // 父组件传递过来的点击事件
    await attrs?.onClick();
  } finally {
    loading.value = false;
  }

};
</script>

<style lang="less" scoped></style>
