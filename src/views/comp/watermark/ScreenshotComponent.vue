<template>
  <div class="screenshot-container">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import html2canvas from 'html2canvas'

const props = defineProps({
  watermarkText: {
    type: String,
    default: 'Confidential'
  },
  watermarkStyle: {
    type: Object,
    default: () => ({
      fontSize: '24px',
      color: 'rgba(255, 0, 0, 0.3)',
      rotate: -30,
      repeat: true  // 是否平铺水印
    })
  },
  targetSelector: {
    type: String,
    default: 'body'
  }
})

const emits = defineEmits(['on-capture'])

const addWatermark = (canvas) => {
  const ctx = canvas.getContext('2d')
  const { fontSize, color, rotate, repeat } = props.watermarkStyle
  
  // 设置水印样式
  ctx.font = `${fontSize} Arial`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.globalAlpha = 0.5

  // 计算水印位置
  if (repeat) {
    // 平铺模式
    const patternCanvas = document.createElement('canvas')
    const patternCtx = patternCanvas.getContext('2d')
    patternCanvas.width = 200
    patternCanvas.height = 200
    
    patternCtx.font = ctx.font
    patternCtx.fillStyle = ctx.fillStyle
    patternCtx.translate(100, 100)
    patternCtx.rotate((rotate * Math.PI) / 180)
    patternCtx.fillText(props.watermarkText, 0, 0)
    
    const pattern = ctx.createPattern(patternCanvas, 'repeat')
    ctx.fillStyle = pattern
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  } else {
    // 单水印居中模式
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotate * Math.PI) / 180)
    ctx.fillText(props.watermarkText, 0, 0)
    ctx.restore()
  }
}

const captureScreen = async () => {
  try {
    const target = document.querySelector(props.targetSelector)
    if (!target) throw new Error('Target element not found')

    const canvas = await html2canvas(target, {
      useCORS: true,
      logging: false,
      backgroundColor: null
    })

    addWatermark(canvas)
    
    // 转换结果
    const imageData = canvas.toDataURL('image/png')
    emits('on-capture', imageData)
    return imageData
  } catch (error) {
    console.error('Screenshot failed:', error)
    return null
  }
}

// 暴露方法给父组件
defineExpose({
  captureScreen
})
</script>

<style scoped>
.screenshot-container {
  position: relative;
}
</style>