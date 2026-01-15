
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
          {{ row.name }}
        </div>
      </template>
    </ListScrollLazyLoading>
  </div>
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ListScrollLazyLoading from '@/components/list-scroll-lazy-loading/index.vue';

const listData = ref([
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' },
  { id: 5, name: '钱七' },
]);

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
}
</style>