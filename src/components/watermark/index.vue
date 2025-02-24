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
    default: 'Watermark'
  },
  watermarkStyle: {
    type: Object,
    default: () => ({
      fontSize: '24px', // 字体大小
      color: 'rgba(255, 0, 0, 0.3)',
      rotate: -30, // 水印的旋转角度, 单位 °
      repeat: true,  // 是否平铺水印
      width: 120,
      height: 64
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
  const { fontSize, color, rotate, repeat, width = 120, height = 64 } = props.watermarkStyle;
  // 设置水印样式
  ctx.font = `${fontSize} Arial`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.globalAlpha = 0.5

  // 计算水印位置
  if (repeat) {
    // 平铺模式
    // 创建了一个新的 <canvas> 元素
    const patternCanvas = document.createElement('canvas')
    // 获取了 2D 渲染上下文
    const patternCtx = patternCanvas.getContext('2d')
    // 设置图案画布的宽度和高度
    patternCanvas.width = width;
    patternCanvas.height = height;

    // 设置图案画布的上下文（patternCtx）的字体和填充样式
    // 使其与主画布（ctx）的字体和填充样式保持一致
    patternCtx.font = ctx.font;
    patternCtx.fillStyle = ctx.fillStyle;

    // 获取文本的宽度和高度
    const textMetrics = patternCtx.measureText(props.watermarkText);
    const textWidth = textMetrics.width;
    const textHeight = parseInt(patternCtx.font, 10); // 假设字体大小为文本高度
    // 计算文本的中心位置
    const centerX = patternCanvas.width / 2;
    const centerY = patternCanvas.height / 2;

    // 平移图案画布的坐标原点到文本的中心位置
    patternCtx.translate(centerX, centerY);

    // 根据旋转角度（rotate）旋转图案画布
    // rotate 是角度值，需要转换为弧度（Math.PI / 180 是角度到弧度的转换系数）
    patternCtx.rotate((rotate * Math.PI) / 180);

    // 在旋转后的图案画布上绘制水印文本
    // 文本绘制在旋转后的坐标系中的 (0, 0) 位置
    patternCtx.fillText(props.watermarkText, -textWidth / 2, textHeight / 2);
    
    // 创建一个重复的图案填充
    const pattern = ctx.createPattern(patternCanvas, 'repeat'); // 使用 patternCanvas 创建一个重复的图案对象
    if (pattern) {
      ctx.fillStyle = pattern; // 将图案设置为填充样式
      ctx.fillRect(0, 0, canvas.width, canvas.height); // 使用图案填充整个画布
    } else {
      console.error('Failed to create pattern');
    };
  } else {
    // 单水印居中模式
    ctx.save();// 保存当前的绘图状态ctx
    // 将坐标原点移动到画布的中心
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // 根据旋转角度（rotate）将画布旋转
    // rotate 是角度值，需要转换为弧（度Math.PI / 180 是角度到弧度的转换系数）
    ctx.rotate((rotate * Math.PI) / 180);

    // 在旋转后的坐标系中，以中心点（0, 0）为基准绘制水印文本
    ctx.fillText(props.watermarkText, 0, 0);

    // 恢复之前保存的绘图状态（撤销 translate 和 rotate 的影响）
    ctx.restore();
  }
}

const captureScreen = async () => {
  try {
    // 获取需要添加水印的区域
    const target = document.querySelector(props.targetSelector)
    if (!target) throw new Error('Target element not found')
    
    const canvas = await html2canvas(target, {
      useCORS: true,
      logging: false,
      backgroundColor: null,
    })

    // 添加水印配置项
    addWatermark(canvas)
    
    // 转换结果为base-64格式
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
  width: 100%;
  height: 100%;
}
</style>