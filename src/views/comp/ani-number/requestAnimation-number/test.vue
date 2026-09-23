<template>
  <AniNumber
    :start="0"
    :end="num" 
    :autoPlay="true"
    :duration="3000" 
    prefix="￥"
    suffix="rmb"
 >
 <!-- <template #scope="scope">
  <div  style="color:red">{{scope.row}}</div>
 </template> -->
 </AniNumber>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AniNumber from './index.vue'

const num = ref(2576);

</script>