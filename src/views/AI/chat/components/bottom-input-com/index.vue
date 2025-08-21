<template>
  <div class="bottom-input-com--wrap">
    <div class="bottom-input-com--container">
      <div class="bottom-input-com--input">
        <div class="ask-ai-input-container" contenteditable="true" @input="inputText = $event.target.textContent"
          @keydown.enter="handleKeyDown">
          {{ inputText }}
        </div>
      </div>
      <div class="bottom-input-com--btn-group">
        <div class="left-btn-group">
          <AIModelList />
        </div>
        <div class="right-btn">
          <div class="ai-send" @click="handleSendMsg">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M7 16c-.595 0-1.077-.462-1.077-1.032V1.032C5.923.462 6.405 0 7 0s1.077.462 1.077 1.032v13.936C8.077 15.538 7.595 16 7 16z"
                fill="currentColor"></path>
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M.315 7.44a1.002 1.002 0 0 1 0-1.46L6.238.302a1.11 1.11 0 0 1 1.523 0c.421.403.421 1.057 0 1.46L1.838 7.44a1.11 1.11 0 0 1-1.523 0z"
                fill="currentColor"></path>
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M13.685 7.44a1.11 1.11 0 0 1-1.523 0L6.238 1.762a1.002 1.002 0 0 1 0-1.46 1.11 1.11 0 0 1 1.523 0l5.924 5.678c.42.403.42 1.056 0 1.46z"
                fill="currentColor"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { sendMessage } from '@/views/AI/chat/ai-msg-store';
import AIModelList from './ai-model-list.vue';

const inputText = ref('');

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // 阻止默认的回车换行行为
    handleSendMsg();    // 调用发送消息函数
  }
}

const handleSendMsg = () => {
  if (inputText.value.trim() === '') return;
  // 发送消息
  sendMessage(inputText.value);
  // 清空输入框
  inputText.value = '';
}


</script>
<style lang="less" scoped>
.bottom-input-com--wrap {
  position: fixed;
  bottom: 20px;
  left: 60%;
  transform: translateX(-60%);
}

.bottom-input-com--container {
  display: flex;
  flex-direction: column;
  width: 1060px;
  min-height: 110px;
  border: 1px solid #c1c1c1;
  border-radius: 10px;
}

.bottom-input-com--input {
  flex: 1;
  // background: #06db11;
  padding: 10px;

  .bottom-input-com--input-text {
    height: 100%;
    width: 100%;
  }

  .ask-ai-input-container {
    width: 100%;
    min-height: 60px;
    outline: none;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
    position: relative;
  }

  .ask-ai-input-container:empty::before {
    content: '哈克AI,想你所想，有问题，尽管问';
    color: #999;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
}

.bottom-input-com--btn-group {
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100%;
  // background: #db0606;
}

.left-btn-group {
  cursor: pointer;
  display: flex;
  margin-left: 15px;
}

.right-btn {
  margin-right: 15px;

  .ai-send {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35px;
    height: 35px;
    background: #FFF;
    color: #c1c1c1;
    border-radius: 50%;
  }
}
</style>