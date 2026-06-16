<template>
 <div class="rag-ai-chat-wrap"> 
  <div class="text">RAG知识库AI助手</div>
  <MessageInputBox />
 </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import MessageInputBox from './components/message-input-box/index.vue';

</script>
<style lang="less" scoped>
.rag-ai-chat-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
 .text {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
</style>