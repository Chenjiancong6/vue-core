<template>
 <div class="theme--wrap">
  <el-divider>
    <div class="theme-title">主题</div>
  </el-divider>
  <el-switch
    @change="handleSwitchTheme"
    v-model="themeValue"
    size="large"
    inline-prompt
    style="--el-switch-on-color: #000; --el-switch-off-color: #000"
    :active-icon="activeIcon"
    :inactive-icon="inactiveIcon"
  />
 </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const themeValue = ref(false);
const activeIcon = ref('');
const inactiveIcon = ref('');

// 是否切换暗黑模式
const toggleTheme = (isDarkTheme:boolean) => {
  const root = document.documentElement;
  if (isDarkTheme) {
    document.body.style.setProperty('--header-menu-bg-color', 'rgba(31, 31, 31, 1)');
    document.body.style.setProperty('--main-bg-color', 'rgba(31, 31, 31, 0.95)');
    root.style.setProperty('--el-bg-color', 'rgba(31, 31, 31, 0.95)');
  } else {
    document.body.style.setProperty('--header-menu-bg-color', '#fff');
    document.body.style.setProperty('--main-bg-color', '#E6E8EB');
    root.style.setProperty('--el-bg-color', '#f5f5f5');
  }
}

const handleSwitchTheme = (flag:boolean) => {
  toggleTheme(flag);
};

watch(()=>themeValue.value, (flag) => {
  toggleTheme(flag);
},{
  deep:true
})

onMounted(async () => {
  const activeSvg = await import('../svgs/moon.svg');
  const inactiveSvg = await import('../svgs/sun.svg');
  activeIcon.value = activeSvg.default;
  inactiveIcon.value = inactiveSvg.default;
});

</script>
<style lang="less" scoped>
.theme--wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.theme-title {
  margin-bottom: 10px;
  font-size: 18px;
}
</style>