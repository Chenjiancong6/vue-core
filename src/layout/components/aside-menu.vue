<template>
 <div class="aside-wrap">
  <div class="aside-menu-list">
    <el-menu
      ellipsis
      router
      :default-active="defaultActive"
      :default-openeds="redirectRouter['path']"
      :text-color="'#fff'"
    >
    <!-- :default-openeds="['/common']"   :default-active="'/common/home'"-->
      <template v-for="item in menuList" :key="item?.path">
        <el-sub-menu v-if="item?.children && item?.children.length > 0" :index="getFullRoutePath(item)">
          <template #title>
            <span>{{ item?.meta?.name  }}</span>
          </template>
            <!-- 递归渲染子菜单 -->
            <AsideMenu :menuList="item.children" :parentPath="getFullRoutePath(item)" />
        </el-sub-menu>
        <!-- 如果没有子菜单 -->
        <el-menu-item v-else :index="getFullRoutePath(item)">
          <span>{{ item?.meta?.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
 </div>
</template>
<script setup lang="ts">
import { watch, onMounted , ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenu } from '@/layout/components/useMenu.ts';

const { redirectRouter } = useMenu();

const defaultActive = ref();

/**
 * 获取url链接的最后一个/后面的内容
 */
const getUrlLastPath = (url: string) => {
  const urlArr = url.split('/');
  return urlArr[urlArr.length - 1];
}

interface MenuItem {
  meta: {
    name?: string
  };
  path: string;
  children?: MenuItem[];
};

const props = defineProps<{
  menuList: MenuItem[];
  parentPath?: string; // 新增父路径属性
}>();

const router = useRouter();

// 计算完整的路径（包括父路径）
function getFullRoutePath(item: MenuItem): string {
  if (props.parentPath) {
    return `${props.parentPath}/${item.path}`; // 拼接父路径和当前路径
  }
  return item.path; // 没有父路径时直接返回当前路径
};

onMounted(() => {
  // 拿到url最后一个/后面的内容
  const lastPath = "/" + getUrlLastPath(window.location.href);
  defaultActive.value = lastPath;
});

</script>
<style lang="less" scoped>
.aside-wrap {
  height: calc(100% - 50px);
  width: 100%;
}
.aside-menu-list {
  width: 100%;
  .el-menu {
    border-right: none !important;
    background-color: var(--aside-menu-bg-color);
  }
  /* 使用深度选择器覆盖默认样式 */
  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    background-color: #00B0FF !important;
    color: #fff !important;
  }
}
</style>