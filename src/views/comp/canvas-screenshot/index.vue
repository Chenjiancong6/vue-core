<template>
  <div class="screenshot-demo">
    <el-row :gutter="20">
      <!-- 左侧：截图目标区域 -->
      <el-col :span="14">
        <el-card shadow="hover" class="target-card">
          <template #header>
            <div class="card-header">
              <span>📷 截图目标区域</span>
              <el-tag v-if="loading" type="warning" effect="dark">截图中...</el-tag>
            </div>
          </template>

          <!-- 演示内容区：作为截图 target -->
          <div id="capture-area" ref="captureRef" class="capture-area">
            <h2 class="title">useScreenshot-hooks函数功能 截图演示</h2>
            <p class="subtitle">此区域将作为截图目标，id="capture-area"</p>

            <div class="grid-boxes">
              <div class="box box-red">Red Box</div>
              <div class="box box-blue">Blue Box</div>
              <div class="box box-green">Green Box</div>
              <div class="box box-yellow">Yellow Box</div>
            </div>

            <!-- 这行会被排除（exclude 示例） -->
            <p id="will-exclude" class="exclude-line">
              这行会被排除在截图之外 (id="will-exclude")
            </p>

            <table class="demo-table">
              <thead>
                <tr>
                  <th>编号</th>
                  <th>姓名</th>
                  <th>部门</th>
                  <th>入职日期</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>001</td>
                  <td>张三</td>
                  <td>研发部</td>
                  <td>2021-03-15</td>
                </tr>
                <tr>
                  <td>002</td>
                  <td>李四</td>
                  <td>产品部</td>
                  <td>2020-08-20</td>
                </tr>
                <tr>
                  <td>003</td>
                  <td>王五</td>
                  <td>设计部</td>
                  <td>2022-01-10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：配置面板 + 预览 -->
      <el-col :span="10">
        <!-- 配置面板 -->
        <el-card shadow="hover" class="config-card">
          <template #header>
            <span>⚙️ 配置项</span>
          </template>

          <el-form label-position="top" size="small">
            <!-- target 选择 -->
            <el-form-item label="target 截图范围">
              <el-radio-group v-model="config.targetType" @change="onTargetChange">
                <el-radio value="area">指定区域 id</el-radio>
                <el-radio value="component">组件 ref</el-radio>
                <el-radio value="selector">CSS 选择器</el-radio>
                <el-radio value="page">整个页面</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- exclude 排除元素 -->
            <el-form-item label="exclude 排除元素">
              <el-checkbox v-model="config.enableExclude">启用排除</el-checkbox>
              <div v-if="config.enableExclude" class="sub-option">
                <el-tag type="info">将排除 id="will-exclude" 的行</el-tag>
              </div>
            </el-form-item>

            <!-- backgroundColor -->
            <el-form-item label="backgroundColor 背景色">
              <el-radio-group v-model="config.bgType">
                <el-radio value="none">不设置 (保留原背景)</el-radio>
                <el-radio value="white">强制白底 #ffffff</el-radio>
                <el-radio value="black">强制黑底 #000000</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- imageType + quality -->
            <el-form-item label="imageType 输出格式">
              <el-select v-model="config.imageType" style="width: 100%">
                <el-option label="PNG (image/png)" value="image/png" />
                <el-option label="JPEG (image/jpeg)" value="image/jpeg" />
                <el-option label="WebP (image/webp)" value="image/webp" />
              </el-select>
            </el-form-item>

            <el-form-item label="quality 输出质量 (仅 jpeg/webp 生效)">
              <el-slider
                v-model="config.quality"
                :disabled="config.imageType === 'image/png'"
                :min="0.1"
                :max="1"
                :step="0.1"
                show-input
              />
            </el-form-item>

            <!-- scale -->
            <el-form-item label="scale 缩放倍率 (影响清晰度)">
              <el-slider
                v-model="config.scale"
                :min="1"
                :max="3"
                :step="0.5"
                show-input
              />
            </el-form-item>

            <!-- useCORS / allowTaint -->
            <el-form-item label="跨域图片处理">
              <div class="inline-options">
                <el-checkbox v-model="config.useCORS">useCORS</el-checkbox>
                <el-checkbox v-model="config.allowTaint">allowTaint</el-checkbox>
              </div>
            </el-form-item>

            <!-- ignoreSelf -->
            <el-form-item label="ignoreSelf 截图不含自身">
              <el-checkbox v-model="config.ignoreSelf">
                截取后临时隐藏目标元素（演示：截 capture-area 时隐藏自身）
              </el-checkbox>
            </el-form-item>

            <!-- 操作按钮 -->
            <div class="btn-group">
              <el-button type="primary" @click="doCapture" :loading="loading">
                🔍 开始截图
              </el-button>
              <el-button @click="downloadImage" :disabled="!result.dataUrl">
                💾 下载图片
              </el-button>
              <el-button @click="resetConfig">🔄 重置配置</el-button>
            </div>
          </el-form>
        </el-card>

        <!-- 截图结果 -->
        <el-card shadow="hover" class="result-card">
          <template #header>
            <span>🖼️ 截图结果</span>
            <el-tag v-if="result.success" type="success">
              {{ result.canvas?.width }} × {{ result.canvas?.height }}
            </el-tag>
          </template>

          <div v-if="loading" class="result-loading">截图生成中...</div>
          <div v-else-if="result.dataUrl" class="result-img-wrap">
            <img :src="result.dataUrl" alt="截图结果" class="result-img">
          </div>
          <div v-else class="result-empty">
            {{ result.error || '点击"开始截图"查看效果' }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
/**
 * useScreenshot hooks 功能演示页面
 * 展示 target / exclude / backgroundColor / imageType / quality / scale / useCORS / allowTaint / ignoreSelf 等配置项用法
 */
import { reactive, ref } from 'vue'
import { useScreenshot } from '@/hooks/use-screenshot'

// 调用 hooks 拿到 capture 方法
const { capture } = useScreenshot()

// 演示 Vue 组件 ref 传参的 ref，指向截图区域 DOM 元素
const captureRef = ref(null)
// 截图过程中按钮 loading 状态
const loading = ref(false)

/**
 * 默认配置工厂函数，重置时会用到，避免 reactive 引用同一对象
 */
const defaultConfig = () => ({
  // target 类型：area 指定 id / component 组件 ref / selector CSS 选择器 / page 整个页面
  targetType: 'area',
  // 是否启用 exclude 排除功能
  enableExclude: false,
  // 背景色策略：none 不设置 / white 白底 / black 黑底
  bgType: 'none',
  // 输出图片格式
  imageType: 'image/png',
  // 输出质量（仅 jpeg/webp 生效）
  quality: 0.9,
  // 截图缩放倍率，影响清晰度
  scale: 2,
  // 是否启用跨域图片加载
  useCORS: true,
  // 是否允许跨域图片污染画布
  allowTaint: true,
  // 截图期间是否临时隐藏目标元素本身
  ignoreSelf: false,
})

// 响应式配置对象，与右侧表单双向绑定
const config = reactive(defaultConfig())

// 截图结果，用于预览和下载
const result = reactive({
  dataUrl: '',    // base64 图片数据
  canvas: null,   // 原始画布，可用于进一步处理
  success: false,  // 截图是否成功
  error: '',      // 失败时的错误信息
})

/**
 * target 切换时清空上一次截图结果，避免误导
 */
function onTargetChange() {
  result.dataUrl = ''
  result.canvas = null
  result.success = false
  result.error = ''
}

/**
 * 根据 bgType 字符串解析为 hooks 需要的 backgroundColor 值
 * @returns {string | null} 颜色字符串或 null（保留原背景）
 */
function resolveBgColor() {
  if (config.bgType === 'white') return '#ffffff'
  if (config.bgType === 'black') return '#000000'
  return null
}

/**
 * 根据 targetType 解析出 hooks 需要的 target 参数
 * 演示 hooks 支持的三种传参方式：id 字符串 / 组件 ref / CSS 选择器 / 不传（整页）
 * @returns {string | ComponentInstanceLike | undefined}
 */
function resolveTarget() {
  switch (config.targetType) {
    case 'area': return '#capture-area'          // 按 id 查找
    case 'component': return captureRef.value    // 组件 ref（内部会取 $el）
    case 'selector': return '.capture-area'      // CSS 选择器
    case 'page': return undefined                // 不传 => 整页截图
    default: return '#capture-area'
  }
}

/**
 * 解析 exclude 排除列表，当前演示排除 id="will-exclude" 的那一行
 * @returns {string | undefined}
 */
function resolveExclude() {
  if (!config.enableExclude) return undefined
  return '#will-exclude'
}

/**
 * 组装配置并调用 hooks 执行截图，将结果写入 result
 */
async function doCapture() {
  loading.value = true
  try {
    const opts = {
      target: resolveTarget(),
      exclude: resolveExclude(),
      useCORS: config.useCORS,
      allowTaint: config.allowTaint,
      backgroundColor: resolveBgColor(),
      imageType: config.imageType,
      // PNG 不支持 quality，不传可避免警告
      quality: config.imageType !== 'image/png' ? config.quality : undefined,
      scale: config.scale,
      ignoreSelf: config.ignoreSelf,
    }
    const res = await capture(opts)
    result.dataUrl = res.dataUrl
    result.canvas = res.canvas
    result.success = res.success
    result.error = res.error
  } finally {
    loading.value = false
  }
}

/**
 * 通过创建临时 a 标签下载 base64 图片到本地
 */
function downloadImage() {
  if (!result.dataUrl) return
  const a = document.createElement('a')
  a.href = result.dataUrl
  // 根据 MIME 类型推断文件扩展名，如 image/jpeg -> jpeg
  const ext = config.imageType.split('/')[1] || 'png'
  a.download = `screenshot-${Date.now()}.${ext}`
  a.click()
}

/**
 * 恢复配置为默认值，并清空截图结果
 */
function resetConfig() {
  Object.assign(config, defaultConfig())
  result.dataUrl = ''
  result.canvas = null
  result.success = false
  result.error = ''
}
</script>

<style lang="less" scoped>
.screenshot-demo {
  padding: 16px;
  height: 100%;
  overflow: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.capture-area {
  padding: 20px;
  border: 2px dashed var(--el-color-primary);
  border-radius: 8px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
  min-height: 400px;

  .title {
    margin: 0 0 8px;
    color: var(--el-color-primary);
    font-size: 22px;
  }
  .subtitle {
    margin: 0 0 20px;
    color: #666;
    font-size: 13px;
  }

  .grid-boxes {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 16px;

    .box {
      height: 80px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 600;
    }
    .box-red { background: #f56c6c; }
    .box-blue { background: #409eff; }
    .box-green { background: #67c23a; }
    .box-yellow { background: #e6a23c; }
  }

  .exclude-line {
    padding: 10px;
    background: rgba(245, 108, 108, 0.1);
    border-left: 3px solid #f56c6c;
    color: #f56c6c;
    margin-bottom: 16px;
  }

  .demo-table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;

    th, td {
      border: 1px solid #dcdfe6;
      padding: 8px 12px;
      text-align: left;
      font-size: 13px;
    }
    th {
      background: #ecf5ff;
      color: var(--el-color-primary);
    }
    tbody tr:nth-child(even) {
      background: #fafafa;
    }
  }
}

.sub-option {
  margin-top: 8px;
}

.inline-options {
  display: flex;
  gap: 24px;
}

.btn-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.config-card {
  margin-bottom: 16px;
}

.result-card {
  :deep(.el-card__body) {
    max-height: 360px;
    overflow: auto;
  }
}

.result-img-wrap {
  text-align: center;
  .result-img {
    max-width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}

.result-loading, .result-empty {
  text-align: center;
  padding: 40px 0;
  color: #909399;
  font-size: 13px;
}
</style>
