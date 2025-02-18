<template>
 <div class="layout-wrap">
  <el-container>
    <el-aside>
      <AsideMenu />
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
import { ref } from 'vue';
import HeaderMenu from './components/header-menu.vue';
import AsideMenu from './components/aside-menu.vue';

</script>
<style lang="less" scoped>
.layout-wrap {
  height: 100%;
  width: 100%;
  .el-container {
    height: 100%;
  }
  .el-aside {
    width: 200px;
    height: 100%;
    background-color: #545c64;
  }
  .el-header {
    background-color: #409EFF;
  }
}
</style>