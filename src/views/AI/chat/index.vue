<template>
 <div>chat 聊天</div>
 <div class="chat-wrap">
  <div v-for="item in chatList" :key="item.index">{{item.message.content}}</div>
  <!-- <el-input type="text" v-model="inputText" placeholder="请输入" /> -->
  <el-button @click="sendMessage">发送</el-button>
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { chatV3Api } from '@/views/AI/chat/chatApi';

const inputText = ref('')
const chatList = ref([]);

const sendMessage = async () => {
  let data:any = await chatV3Api();
  console.log('ai 接口数据',data);
  chatList.value = data?.choices;
}

</script>
<style lang="less" scoped>
.chat-wrap {
  margin-top: 20px;
  width: 40%;
}
</style>