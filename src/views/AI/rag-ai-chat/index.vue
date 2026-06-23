<template>
  <div class="rag-ai-chat-wrap">
    <div class="text">RAG知识库AI助手</div>
    <div class="ai-chat-container" ref="chatContainerRef">
      <div class="ai-chat-list">
        <div class="ai-chat-msglist__item" v-for="item in aiChatMsgList" :key="item.id">
          <template v-if="item.type === 'ask'">
            <div class="user-msg">
              <div class="user-msg-content">{{ item.content }}</div>
            </div>
          </template>
          <template v-if="item.type === 'reply'">
            <div class="ai-msg">
              <div class="ai-msg-reasoning-content" v-if="item.reasoning_content">
                <div class="ai-msg-reasoning-content--title" @click="handleClickExpand(item.id)">
                  <div>推理过程</div>
                  <div class="ai-msg-reasoning-content__arrow" :class="{ 'has-expand': expandMap[item.id] }">
                    <Icon icon="svg-icon:arrow_down" />
                  </div>
                </div>
                <template v-if="expandMap[item.id]">
                  <VueMarkdown :source="item.reasoning_content" />
                </template>
              </div>
              <div class="ai-msg-content">
                <VueMarkdown :source="item.content" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <MessageInputBox />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import MessageInputBox from './components/message-input-box/index.vue';
import VueMarkdown from 'vue-markdown-render';
import Icon from '@cjc/vue3-svg-icon';
import { aiChatMsgList } from './store.ts';

const chatContainerRef = ref<HTMLDivElement>(null);
const expandMap = ref<Record<number | string, boolean>>({});

const handleClickExpand = (id: number | string) => {
  expandMap.value[id] = !expandMap.value[id];
}

// 平滑滚动到底部
function smoothScrollToBottom() {
  if (!chatContainerRef.value) return;
  let chatContainerHeight = chatContainerRef.value?.clientHeight; // 获取元素的可见区域高度
  let chatContainerRefScrollHeight = chatContainerRef.value?.scrollHeight; // 获取元素的滚动高度
  if (chatContainerRefScrollHeight > chatContainerHeight + 20) {
    chatContainerRef.value.scrollTo({
      top: chatContainerRefScrollHeight,
      behavior: 'smooth' // 平滑滚动
    });
  }
}

watch(() => aiChatMsgList.value, (newList) => {
  newList.forEach(item => {
    if (!(item.id in expandMap.value)) {
      expandMap.value[item.id] = item.content === null;
    }
  });
  smoothScrollToBottom();
}, {
  deep: true
})

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

.ai-chat-container {
  margin-top: 20px;
  width: 80%;
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
  margin-bottom: 5px;
  cursor: pointer;
}

.ai-msg-reasoning-content--title {
  display: flex;
  align-items: center;

  :hover {
    color: #333;
  }

  .ai-msg-reasoning-content__arrow {
    font-size: 16px;
    transition: all 0.3s ease-in-out;

    &.has-expand {
      transform: rotate(180deg);
      transition: all 0.3s ease-in-out;
    }
  }

}
</style>