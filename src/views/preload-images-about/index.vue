<template>
  <div class="">
    <div class="pages">
      <div class="item"@click="handleClick(1)">home首页</div>
      <div class="item"@click="handleClick(2)">about首页</div>
    </div>
    <div class="content">
      <div v-if="currentPage === 1">home首页内容</div>
      <div v-if="currentPage === 2">about内容</div>
    </div>
    <div class="waterfall">
      <img class="item" src="http://localhost:8088/images/1.jpg" alt="" />
      <img class="item" src="http://localhost:8088/images/2.jpg" alt="" />
      <img class="item" src="http://localhost:8088/images/3.jpg" alt="" />
      <img class="item" src="http://localhost:8088/images/4.jpg" alt="" />
      <img class="item" src="http://localhost:8088/images/5.jpg" alt="" />
      <img class="item" src="http://localhost:8088/images/6.jpg" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const currentPage = ref();

const handleClick = (page: number) => {
  currentPage.value = page;
  if(page === 1){
    router.push('/preload-images');
  }else{
    router.push('/preload-images-about');
  }
}

onMounted(() => {
  if(router.currentRoute.value.path === '/preload-images-about'){
    currentPage.value = 2;
  }
  if(router.currentRoute.value.path === '/preload-images'){
    currentPage.value = 1;
  }
})
</script>

<style lang="less" scoped>
.pages{
  display: flex;
}
.item{
  padding: 10px;
  cursor: pointer;
  text-decoration: underline;
}
.item:hover{
  background-color: #f5f5f5;
}
.content{
  margin-top: 20px;
}
.waterfall{
  display: flex;
  flex-wrap: wrap;
}
.item{
  width: 33%;
}
</style>
