<template>
  <div class="page">
    <div class="card">
      <h1 class="page__title">手写签名</h1>
      <p class="page__desc" id="target-zone">请在下方空白区域手写您的签名</p>
      <!-- 手写签名组件 -->
      <SignatureBoard
        ref="signRef"
        pen-color="#1a1a1a"
        :pen-width="1"
        :transparent="false"
        image-type="image/png"
        @confirm="onConfirm"
      />

      <!-- 签名结果预览 -->
      <div v-if="signatureImage" class="preview">
        <div class="preview__label">签名预览</div>
        <img class="preview__img" :src="signatureImage" alt="签名预览" />
        <button type="button" class="preview__reset" @click="reset">
          重新签名
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SignatureBoard from '@/components/signature-board/index.vue'

const signRef = ref(null)
const signatureImage = ref('')

function onConfirm(dataUrl) {
  signatureImage.value = dataUrl
  // 这里拿到 base64 签名图，可在此上传到后端或做后续业务处理
  console.log(dataUrl, '签名确认，图片 dataURL 长度：', dataUrl.length)
}

function reset() {
  signatureImage.value = ''
  signRef.value.clear()
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.card {
  width: 100%;
  max-width: 520px;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.page__title {
  font-size: 20px;
  font-weight: 600;
}

.page__desc {
  margin-top: 6px;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--text-secondary);
}

.preview {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #e5e5e5;
}

.preview__label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.preview__img {
  display: block;
  width: 100%;
  max-height: 180px;
  object-fit: contain;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
}

.preview__reset {
  margin-top: 12px;
  width: 100%;
  height: 44px;
  border: 1px solid #1677ff;
  border-radius: 8px;
  background: #fff;
  color: #1677ff;
  font-size: 16px;
  cursor: pointer;
}
</style>
