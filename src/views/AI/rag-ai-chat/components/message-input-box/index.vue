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
          <!-- 是否开启流式处理切换 -->
          <el-switch
            v-model="hasLLMStream"
            size="large"
            class="stream-switch"
            @change="setSwitchStream"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="开启流式处理"
            inactive-text="非流式"
          />
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
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { ragflow_URL_body_config, hasLLMStream, aiChatMsgList, historyChatMsgList } from '@/views/AI/rag-ai-chat/store';
import { useAiChatMsgList } from '@/views/AI/rag-ai-chat/components/hooks/use-ai-chat-msg-list';
import { useHistoryChatMsgList } from '@/views/AI/rag-ai-chat/components/hooks/use-history-chat-msg-list';
import { ragflow_chat_request } from '@/views/AI/rag-ai-chat/components/request/chatRequest';
import { ElLoading, ElMessage } from 'element-plus';

const { addAIMsg } = useAiChatMsgList();
const { addHistoryChatMsg } = useHistoryChatMsgList();

const inputText = ref('');

const setSwitchStream = (flag: boolean) => {
  hasLLMStream.value = flag;
};

// 流式处理模式时，如果AI还没回复完，禁止再次发送消息
const disabledSend = computed(() => {
  if(!hasLLMStream.value) return false;

  // 找到最新的ai聊天消息，判断是否是流式处理
  const lastMsg = aiChatMsgList.value[aiChatMsgList.value.length - 1];
  if(!lastMsg) return false;
  if(lastMsg.status === 'thinking' || lastMsg.status === 'stream') {
    ElMessage({
      message: 'ai模型还在思考中，请稍后再试',
      type: 'error',
    });
    return true;
  }
  return false;
});

const handleKeyDown = (e) => {
  if(disabledSend.value) return;
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // 阻止默认的回车换行行为
    handleSendMsg();    // 调用发送消息函数
  }
}

const handleSendMsg = async () => {
  if(disabledSend.value) return;
  if (inputText.value.trim() === '') return;
  let loading = null;
  // 如果是非流式处理，才显示loading提示、否则不显示loading提示
  if(!hasLLMStream.value) {
    loading = ElLoading.service({
      lock: true,
      text: '正在思考中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
  // 添加ai聊天消息
  addAIMsg({
    id: uuidv4(), // 生成唯一id
    type: 'ask',
    content: inputText.value,
  });
  // 添加历史聊天消息
  addHistoryChatMsg({
    role: 'user',
    content: inputText.value,
  });

  setTimeout(() => {
    // 清空输入框
    inputText.value = '';
  }, 100);

  // 调用接口获取ai模型回复
  const res = await ragflow_chat_request({
    ...ragflow_URL_body_config,
    stream: hasLLMStream.value, // 是否开启流式处理
    messages: [...historyChatMsgList.value]
  });
  // 关闭loading提示
  if(loading) {
    loading.close();
  }
  // console.log("接口响应数据",res);
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
  width: 1260px;
  min-height: 100px;
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
    min-height: 30px;
    outline: none;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
    position: relative;
  }

  .ask-ai-input-container:empty::before {
    content: 'AI-ARG知识库，请输入消息...';
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
    &:hover {
      background: #888585;
    }
 }
}
.stream-switch {
  margin-left: 10px;
  padding-bottom: 5px;
}
</style>