<template>
 <div class="header-menu--wrap">
  <div v-for="item in menuList" :key="item" class="header-menu-list--item" @click="handleClickMenu(item)">
    <div class="list-item">
      <div>{{ item }}</div>
      <div class="line" v-if="item === activeMenu"></div>
    </div>
  </div>
 </div>
</template>
<script setup lang="ts">
import { useMenu } from './useMenu';

const { activeMenu, setActiveMenu, headerMenuMap } = useMenu();

const menuList = Object.keys(headerMenuMap);

const handleClickMenu = (item:string) => {
  setActiveMenu(item);
};

</script>
<style lang="less" scoped>
.header-menu--wrap {
  height: 100%;
  display: flex;
  justify-content: flex-end;
 align-items: center;
 color: var(--body-color-default);
}
.header-menu-list--item {
  display: flex;
  cursor: pointer;
  .list-item {
    padding: 0 20px;
    position: relative;
    .line {
      position: absolute;
      width: 50%;
      height: 1px;
      background: var(--body-color-default);
      margin-top: 10px; /* 距离文字的距离 */
    }
  }
}
</style>