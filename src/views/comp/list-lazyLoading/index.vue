
<template>
 <div class="list-lazyLoading">
  <div class="list-container">
    <ListScrollLazyLoading
      ref="listScrollLazyLoadingRef"
      :data="listData"
      :keyProp="'id'"
    >
      <template #default="{ row }">
        <div class="scroll-item">
          <img :src="setImgUrl(row.id)" alt="" @load="row.isLoaded = true" v-show="row.isLoaded" />
          <ImageSkeleton v-if="!row.isLoaded" />
        </div>
      </template>
    </ListScrollLazyLoading>
  </div>
  <div class="btn-container">
    <el-button @click="handleScrollToItem">滚动到指定项</el-button>
    <el-button @click="handleScrollToTop">滚动到顶部</el-button>
  </div>
  </div>
</template>
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import ListScrollLazyLoading from '@/components/list-scroll-lazy-loading/index.vue';
import ImageSkeleton from '@/components/image-skeleton/index.vue';

const listScrollLazyLoadingInstall = useTemplateRef('listScrollLazyLoadingRef');

const setImgUrl = (id) => {
  return `https://images.unsplash.com/photo-${id}?w=560&auto=format&fit=crop&q=60&ixlib=rb-4.1.0`;
};
const listData = ref([
  { id: '1767895655116-5eaa98e3a05f', name: '张三', isLoaded: false },
  { id: '1768190691654-09c492f220f4', name: '李四', isLoaded: false },
  { id: '1765873360301-a1ffdfa75818', name: '王五', isLoaded: false },
  { id: '1765673801268-3be01e61d383', name: '赵六', isLoaded: false },
  { id: '1768335700470-cfa0a1caffe6', name: '钱七', isLoaded: false },
  { id: '1768127502130-bca3e208eba6', name: '孙八', isLoaded: false },
  { id: '1768137533320-8ebcf67456cc', name: '周九', isLoaded: false },
  { id: '1766548730089-e446483315b1', name: '吴十', isLoaded: false },
  { id: '1767875762123-ef62592784f6', name: '郑十一', isLoaded: false },
  { id: '1766946429232-ee5ad7f266be', name: '王十二', isLoaded: false },
  { id: '1767041573027-f77c33df6b7c', name: '李十三', isLoaded: false },
  { id: '1766921466771-29bd27bf2d4e', name: '王十四', isLoaded: false },
]);

/**
 * 滚动到指定的列表项
 */
const handleScrollToItem = () => {
  listScrollLazyLoadingInstall.value?.scrollToItem('1768137533320-8ebcf67456cc');
}
/**
 * 滚动到顶部
 */
const handleScrollToTop = () => {
  listScrollLazyLoadingInstall.value?.scrollToTop();
}



</script>
<style lang="less" scoped>
.list-lazyLoading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.list-container {
  width: 400px;
  height: 700px;
  border: 1px solid #000;
  overflow-y: auto;
}
.scroll-item {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e46d6d;
  margin-bottom: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
.btn-container {
  margin-left: 20px;
}
</style>