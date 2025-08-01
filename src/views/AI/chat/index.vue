<template>
 <div>chat 聊天</div>
 <div class="chat-wrap">
  <div v-for="item in msgList" :key="item.id">{{item.content}}</div>
  <el-input type="text" v-model="inputText" placeholder="请输入" />
  <el-button @click="hasndleSendMessage">发送</el-button>
 </div>
</template>
<script setup lang="ts">
import { ref,onMounted, onUnmounted } from 'vue';
import { emitter, useEmitt } from '@/hooks/use-emitt';
import { Event } from '@/events/event'
import { sendMessage, msgList, initStore, resetStore } from './ai-msg-store'

const inputText = ref('')
const chatList = ref([]);

const hasndleSendMessage = async () => {
  sendMessage(inputText.value)
  inputText.value = '';
}

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