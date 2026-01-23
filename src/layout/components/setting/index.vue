<template>
 <div class="setting-wrap">
  <div class="setting-tool" @click="handleSwitchClick">
    <!-- <img src="./svgs/setting.svg" alt="设置" /> -->
    <Icon icon="svg-icon:setting" size="20" />
  </div>
  <el-drawer
    v-model="drawer"
    :direction="'rtl'"
    size="20%"
  >
    <template #title>
      <span>项目设置</span>
    </template>
    <Theme />
  </el-drawer>
  <slot />
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Theme from './components/theme.vue';
import { useSetting } from './useSetting';
import Icon from "@cjc/vue3-svg-icon";

const { drawer } = useSetting();

const handleSwitchClick = () => {
  drawer.value = true
};

</script>
<style lang="less" scoped>
.setting-wrap {
  cursor: pointer;
  display: flex;
  margin-left: 20px;
}
.setting-tool {
  width: 20px;
  height: 20px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>