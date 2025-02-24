<template>
  <div class="watermark-wrap">
    <ScreenshotComponent
      ref="screenshotRef"
      watermark-text="陈健聪"
      :watermark-style="{
        fontSize: '14px',
        color: 'rgba(0, 0, 0, 0.2)',
        rotate: -40,
        repeat: true,
      }"
      :targetSelector="'.content-box'"
      @on-capture="handleCapture"
    >
    <div class="watermark-container">
      <el-button @click="takeScreenshot">截图</el-button>
      <div class="content-box">
        <p v-if="!resultImage">这是需要添加水印的敏感内容...</p>
        <img v-if="resultImage" :src="resultImage" alt="截图结果">
      </div>
    </div>
    </ScreenshotComponent>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import ScreenshotComponent from '@/components/watermark/index.vue'

const screenshotRef = ref(null)
const resultImage = ref(null)

const takeScreenshot = async () => {
  if (screenshotRef.value) {
    // 调用子组件暴露的方法
    const data = await screenshotRef.value.captureScreen();
    console.log('截图数据', data)
    resultImage.value = data
  }
}

const handleCapture = (data) => {
  // 处理截图数据
  // console.log('截图完成', data)
}

onMounted(()=> {
  takeScreenshot();
})
</script>

<style scoped>
.watermark-wrap {
  width: 100%;
  height: 100%;
}
.watermark-container {
  width: 100%;
  height: 100%;
}
.content-box {
  width: 100%;
  height: calc(100% - 32px);
}
.content-box {
  cursor: pointer;
}
img {
  z-index: 9999999;
  cursor: pointer;
}
</style>