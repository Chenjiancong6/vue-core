<template>
 <div class="layout-wrap">
  <el-container>
    <el-aside>
      <div class="logo">logo</div>
      <AsideMenu :menuList="asideMenuList" :basePath="asideMenuList[0].path"/>
    </el-aside>
    <el-container>
      <el-header>
        <HeaderMenu />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
 </div>
</template>
<script setup>
import { ref, onMounted,watch } from 'vue';
import HeaderMenu from './components/header-menu.vue';
import AsideMenu from './components/aside-menu.vue';
import { useMenu } from './components/useMenu';

const { asideMenuList,activeMenu } = useMenu();

onMounted(()=> {
})
</script>
<style lang="less" scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  height: 50px;
  color: var(--body-color-default);
}
.layout-wrap {
  height: 100%;
  width: 100%;
  .el-container {
    height: 100%;
  }
  .el-aside {
    width: 200px;
    height: 100%;
    background-color: var(--aside-menu-bg-color);
  }
  .el-header {
    height:50px;
    background-color: var(--header-menu-bg-color);
  }
}
</style>