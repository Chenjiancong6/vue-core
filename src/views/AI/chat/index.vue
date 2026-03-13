<template>
  <div class="ai-chat--wrap">
    <div>chat 聊天</div>
    <div class="ai-chat-container" ref="chatContainerRef">
      <div class="ai-chat-list">
        <div class="ai-chat-msglist__item" v-for="item in msgList" :key="item.id">
          <template v-if="item.type === 'ask'">
            <div class="user-msg">
              <div class="user-msg-content">{{ item.content }}</div>
            </div>
          </template>
          <template v-if="item.type === 'reply'">
            <div class="ai-msg">
              <div class="ai-msg-reasoning-content" v-if="item.reasoning_content">
                <div>推理过程：</div>
                <VueMarkdown :source="item.reasoning_content" />
              </div>
              <div class="ai-msg-content">
                <VueMarkdown :source="item.content" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <BottomInputCom />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { emitter, useEmitt } from '@/hooks/use-emitt';
import { Event } from '@/events/event'
import { sendMessage, initStoreNoStream, resetStoreNoStream } from './no-stream/ai-msg-store';
import { msgList } from './ai-message-list-store';
import BottomInputCom from './components/bottom-input-com/index.vue';
import VueMarkdown from 'vue-markdown-render';
import { useLLMLocalStorage } from "@/ai-lib/ai-llm/use-llm-localStorage";

const inputText = ref('');
const chatContainerRef = ref<HTMLDivElement>(null);

// 平滑滚动到底部
function smoothScrollToBottom() {
  if(!chatContainerRef.value) return;
  let chatContainerHeight = chatContainerRef.value?.clientHeight; // 获取元素的可见区域高度
  let chatContainerRefScrollHeight = chatContainerRef.value?.scrollHeight; // 获取元素的滚动高度
  if(chatContainerRefScrollHeight > chatContainerHeight + 20) {
    chatContainerRef.value.scrollTo({
      top: chatContainerRefScrollHeight,
      behavior: 'smooth' // 平滑滚动
    });
  }
}

const { isllmStream } = useLLMLocalStorage();

watch(() => msgList.value, () => {
  smoothScrollToBottom();
}, {
  deep: true
})

watch(isllmStream, (newVal) => {
  // 为true时，流式传输
  if (newVal) {
    resetStoreNoStream();
  }else{
    // 非流式传输
    initStoreNoStream();
  }
},{
  immediate: true
})

// onMounted(() => {
//   initStoreNoStream();
// })

onUnmounted(() => {
  msgList.value = [];
  resetStoreNoStream();
})

</script>
<style lang="less" scoped>
.ai-chat--wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.ai-chat-container {
  margin-top: 20px;
  width: 60%;
  max-height: 75%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.ai-chat-list {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.user-msg {
  display: flex;
  justify-content: flex-end;

  flex: 1;
  margin-top: 20px;

  .user-msg-content {
    max-width: 90%;
    padding: 10px 15px;
    border-radius: 14px;
    background-color: #fff;
  }
}

.ai-msg {
  max-width: 95%;
  margin-top: 30px;
}

.ai-msg-reasoning-content {
  color: #999;
  margin-bottom: 20px;
}

</style>