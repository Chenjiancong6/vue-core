<template>
  <div>
    <!-- <ScreenshotComponent
      ref="screenshotRef"
      watermark-text="陈健聪"
      :watermark-style="{
        fontSize: '32px',
        color: 'rgba(0, 0, 255, 0.2)',
        rotate: 45,
        repeat: false
      }"
      @on-capture="handleCapture"
    >
      <div class="content-box">
        <h1>重要文档</h1>
        <p>这是需要添加水印的敏感内容...</p>
      </div>
    </ScreenshotComponent> -->
    <div>gdgdgdg</div>
    <el-button @click="takeScreenshot">截图</el-button>
    <img v-if="resultImage" :src="resultImage" alt="截图结果">
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import ScreenshotComponent from './ScreenshotComponent.vue'

const screenshotRef = ref(null)
const resultImage = ref(null)

const takeScreenshot = async () => {
  if (screenshotRef.value) {
    // const data = await screenshotRef.value.captureScreen()
    console.log('截图数据', data)
    resultImage.value = data
  }
}

const handleCapture = (data) => {
  // 处理截图数据
  // console.log('截图完成', data)
}
</script>

<style scoped>
.content-box {
  cursor: pointer;
}
img {
  z-index: 9999999;
  cursor: pointer;
}
</style>