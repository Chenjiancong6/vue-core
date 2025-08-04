<template>
  <div class="ai-chat--wrap">
    <div>chat 聊天</div>
    <div class="chat-wrap">
      <div v-for="item in msgList" :key="item.id">{{item.content}}</div>
    </div>
    <BottomInputCom />
 </div>
</template>
<script setup lang="ts">
import { ref,onMounted, onUnmounted, watch } from 'vue';
import { emitter, useEmitt } from '@/hooks/use-emitt';
import { Event } from '@/events/event'
import { sendMessage, msgList, initStore, resetStore } from './ai-msg-store';
import BottomInputCom from './components/bottom-input-com/index.vue';

const inputText = ref('')

// watch(()=> msgList.value, () => {
//   console.log('msgList.value',msgList.value);
// }, {
//   deep: true
// })

onMounted(()=> {
  initStore();
})

onUnmounted(()=> {
  resetStore();
})

</script>
<style lang="less" scoped>
.chat-wrap {
  margin-top: 20px;
  width: 40%;
}
</style>