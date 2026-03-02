<template>
  <div class="ai-chat--wrap">
    <div>chat 聊天</div>
    <div class="ai-chat-container">
      <div class="ai-chat-list">
        <div class="ai-chat-msglist__item" v-for="item in msgList" :key="item.id">
          <template v-if="item.type === 'ask'">
            <div class="user-msg">
              <div class="user-msg-content">{{ item.content }}</div>
            </div>
          </template>
          <template v-if="item.type === 'reply'">
            <div class="ai-msg">
              <!-- <div class="ai-msg-content">{{ item.content }}</div> -->
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
import { sendMessage, msgList, initStore, resetStore } from './ai-msg-store';
import BottomInputCom from './components/bottom-input-com/index.vue';
import VueMarkdown from 'vue-markdown-render';

const inputText = ref('')

watch(() => msgList.value, () => {
  console.log('msgList.value', msgList.value);
}, {
  deep: true
})

onMounted(() => {
  initStore();
})

onUnmounted(() => {
  resetStore();
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


</style>