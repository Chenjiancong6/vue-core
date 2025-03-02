<template>
  <div class="iat-wrap">
    <div>
      <el-button type="primary" @click="hansleIat">语音识别</el-button>
    </div>
    <div v-if="isRecordReady" class="record-close-btn">
      <el-button type="primary" @click="closeIat">关闭识别</el-button>
    </div>
    <div>{{ iatText }}</div>
  </div>
</template>

<script setup>
import { useIat } from '@/hooks/use-iat';

const { startConnectReady, closeConnect, iatText, isRecordReady } = useIat();

const hansleIat = () => {
  startConnectReady()
}

const closeIat = () => {
  closeConnect()
}
</script>

<style lang="less" scoped>
.iat-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.record-close-btn {
  margin-top: 20px;
}
</style>
