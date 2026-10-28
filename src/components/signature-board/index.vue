<template>
  <div class="signature-board">
    <!-- 画布容器 -->
    <div
      class="signature-board__canvas-wrap"
      :class="{ 'signature-board__canvas-wrap--empty': isEmpty }"
    >
      <canvas ref="canvasRef" class="signature-board__canvas"></canvas>

      <!-- 空态提示水印 -->
      <div v-if="isEmpty" class="signature-board__placeholder">
        请在此处签名
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="signature-board__actions">
      <button
        type="button"
        class="signature-board__btn signature-board__btn--clear"
        :disabled="isEmpty"
        @click="clear"
      >
        清除
      </button>
      <button
        type="button"
        class="signature-board__btn signature-board__btn--confirm"
        :disabled="isEmpty"
        @click="confirm"
      >
        确认签名
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  penColor: { type: String, default: '#000000' },
  penWidth: { type: Number, default: 1 },
  transparent: { type: Boolean, default: false },
  imageType: { type: String, default: 'image/png' },
})

const emit = defineEmits(['confirm'])

const canvasRef = ref(null)

const isEmpty = ref(true)
const drawing = ref(false)
const dpr = ref(1)
const canvasWidth = ref(0)
const canvasHeight = ref(0)
const lastX = ref(0)
const lastY = ref(0)
let resizeTimer = null
let resizeObserver = null
let usePointer = false

// ---------- 画笔样式更新 ----------
watch(
  () => props.penColor,
  (v) => {
    const ctx = canvasRef.value?.getContext('2d')
    if (ctx) ctx.strokeStyle = v
  }
)
watch(
  () => props.penWidth,
  (v) => {
    const ctx = canvasRef.value?.getContext('2d')
    if (ctx) ctx.lineWidth = v * dpr.value
  }
)

// ---------- 画布初始化 ----------
function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const wrap = canvas.parentElement
  if (!wrap) return

  const rect = wrap.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return

  // 已有笔迹时先缓存，供 resize 后重绘
  const prevImage = canvasWidth.value > 0 ? canvas.toDataURL() : null

  dpr.value = Math.min(Math.max(window.devicePixelRatio || 1, 1), 3)
  canvasWidth.value = rect.width
  canvasHeight.value = rect.height

  canvas.width = Math.round(rect.width * dpr.value)
  canvas.height = Math.round(rect.height * dpr.value)

  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr.value, 0, 0, dpr.value, 0, 0)
  ctx.lineWidth = props.penWidth * dpr.value
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = props.penColor

  if (prevImage) {
    const img = new Image()
    img.onload = () => ctx.drawImage(img, 0, 0, canvasWidth.value, canvasHeight.value)
    img.src = prevImage
  }
}

function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => initCanvas(), 200)
}

// ---------- 坐标换算 ----------
function getPos(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  let clientX = e.clientX
  let clientY = e.clientY
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else if (e.changedTouches && e.changedTouches.length > 0) {
    clientX = e.changedTouches[0].clientX
    clientY = e.changedTouches[0].clientY
  }
  return { x: clientX - rect.left, y: clientY - rect.top }
}

// ---------- 绘制核心 ----------
function drawSegment(x1, y1, x2, y2) {
  const ctx = canvasRef.value.getContext('2d')
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function startStroke(pos) {
  lastX.value = pos.x
  lastY.value = pos.y
  drawing.value = true
  drawSegment(pos.x, pos.y, pos.x + 0.01, pos.y + 0.01)
  isEmpty.value = false
}

function moveStroke(pos) {
  drawSegment(lastX.value, lastY.value, pos.x, pos.y)
  lastX.value = pos.x
  lastY.value = pos.y
}

function endStroke() {
  drawing.value = false
}

// ---------- Pointer 事件（现代浏览器统一入口） ----------
function onPointerDown(e) {
  e.preventDefault()
  if (drawing.value) return
  if (canvasRef.value.setPointerCapture) {
    try {
      canvasRef.value.setPointerCapture(e.pointerId)
    } catch (err) {
      /* ignore */
    }
  }
  startStroke(getPos(e))
}

function onPointerMove(e) {
  if (!drawing.value) return
  e.preventDefault()
  moveStroke(getPos(e))
}

function onPointerUp(e) {
  e.preventDefault()
  endStroke()
  if (canvasRef.value.releasePointerCapture) {
    try {
      canvasRef.value.releasePointerCapture(e.pointerId)
    } catch (err) {
      /* ignore */
    }
  }
}

// ---------- Touch 兜底（极老环境） ----------
function onTouchStart(e) {
  e.preventDefault()
  if (drawing.value) return
  startStroke(getPos(e))
}
function onTouchMove(e) {
  if (!drawing.value) return
  e.preventDefault()
  moveStroke(getPos(e))
}
function onTouchEnd() {
  endStroke()
}

// ---------- Mouse 兜底（极老环境） ----------
function onMouseDown(e) {
  startStroke(getPos(e))
}
function onMouseMove(e) {
  if (!drawing.value) return
  moveStroke(getPos(e))
}
function onMouseUp() {
  endStroke()
}

// ---------- 对外能力 ----------
function clear() {
  const ctx = canvasRef.value.getContext('2d')
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
  isEmpty.value = true
}

function confirm() {
  emit('confirm', toDataURL())
}

function toDataURL() {
  const canvas = canvasRef.value
  if (!canvas) return ''
  if (props.transparent && props.imageType === 'image/png') {
    return canvas.toDataURL(props.imageType)
  }
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = canvas.width
  exportCanvas.height = canvas.height
  const ctx = exportCanvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
  ctx.drawImage(canvas, 0, 0)
  return exportCanvas.toDataURL(props.imageType)
}

function isEmptyStatus() {
  return isEmpty.value
}

// 暴露给父组件使用
defineExpose({ clear, toDataURL, isEmptyStatus })

// ---------- 生命周期 ----------
onMounted(() => {
  // 等 DOM 完成首次布局后再初始化画布尺寸
  nextTick(() => initCanvas())

  // ResizeObserver 监听容器真实尺寸
  if (typeof ResizeObserver !== 'undefined' && canvasRef.value) {
    resizeObserver = new ResizeObserver(() => onResize())
    resizeObserver.observe(canvasRef.value.parentElement)
  }

  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)

  const canvas = canvasRef.value
  if (!canvas) return

  // 单一事件源：Pointer Events 优先，touch + mouse 兜底
  usePointer = typeof window.PointerEvent === 'function'
  if (usePointer) {
    canvas.addEventListener('pointerdown', onPointerDown, { passive: false })
    canvas.addEventListener('pointermove', onPointerMove, { passive: false })
    canvas.addEventListener('pointerup', onPointerUp, { passive: false })
    canvas.addEventListener('pointercancel', onPointerUp, { passive: false })
  } else {
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false })
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('mouseleave', onMouseUp)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  window.removeEventListener('resize', onResize)
  window.removeEventListener('orientationchange', onResize)
  if (resizeTimer) clearTimeout(resizeTimer)

  const canvas = canvasRef.value
  if (!canvas) return
  if (usePointer) {
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointercancel', onPointerUp)
  } else {
    canvas.removeEventListener('touchstart', onTouchStart)
    canvas.removeEventListener('touchmove', onTouchMove)
    canvas.removeEventListener('touchend', onTouchEnd)
    canvas.removeEventListener('touchcancel', onTouchEnd)
    canvas.removeEventListener('mousedown', onMouseDown)
    canvas.removeEventListener('mousemove', onMouseMove)
    canvas.removeEventListener('mouseup', onMouseUp)
    canvas.removeEventListener('mouseleave', onMouseUp)
  }
})
</script>

<style scoped>
.signature-board {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.signature-board__canvas-wrap {
  position: relative;
  width: 100%;
  height: 280px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #fff;
  overflow: hidden;
  touch-action: none;
  -ms-touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.signature-board__canvas-wrap--empty {
  background-image: linear-gradient(#f5f5f5 1px, transparent 1px);
  background-size: 100% 40px;
}

.signature-board__canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  cursor: crosshair;
  touch-action: none;
  -ms-touch-action: none;
  -webkit-touch-callout: none;
}

.signature-board__placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #bfbfbf;
  font-size: 16px;
  pointer-events: none;
  user-select: none;
}

.signature-board__actions {
  display: flex;
  gap: 12px;
}

.signature-board__btn {
  flex: 1;
  height: 44px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.signature-board__btn:active {
  opacity: 0.7;
}

.signature-board__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.signature-board__btn--clear {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.signature-board__btn--confirm {
  background-color: #1677ff;
  color: #fff;
}
</style>
