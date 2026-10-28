/**
 * 截图工具-hooks函数
 * @param options 截图配置项
 * @returns 截图结果
 */
import html2canvas from 'html2canvas'

/**
 * Vue 组件实例（ref="xxx" 拿到的组件代理对象）。
 * 通过其 $el 拿到组件根 DOM 元素。
 */
export interface ComponentInstanceLike {
  $el?: Element | null
  [key: string]: unknown
}

/**
 * 截图目标：DOM 元素、元素 id、CSS 选择器，或 Vue 组件实例（ref）。
 * 若省略则默认截取整个页面（document.documentElement）。
 */
export type ScreenshotTarget = Element | string | ComponentInstanceLike

/**
 * use-screenshot 配置项
 */
export interface UseScreenshotOptions {
  /** 截图范围：DOM 元素 / id / 选择器 / Vue 组件 ref，省略则截取整个页面 */
  target?: ScreenshotTarget
  /** 需要排除在截图之外的元素（或其 id / 组件 ref），可传入单个或多个 */
  exclude?: ScreenshotTarget | ScreenshotTarget[]
  /** 是否启用 CORS 跨域图片加载，默认 true */
  useCORS?: boolean
  /** 是否允许跨域图片污染画布，默认 true */
  allowTaint?: boolean
  /** 背景色，默认 null（保留元素自身背景；传 '#ffffff' 可强制白底） */
  backgroundColor?: string | null
  /** 输出图片格式，默认 'image/png' */
  imageType?: string
  /** 输出质量 0~1，仅对 jpeg/webp 生效 */
  quality?: number
  /** 截图缩放倍率，默认取设备 DPR（最大 3），用于提高清晰度 */
  scale?: number
  /** 是否在截图期间隐藏目标元素本身（用于「截图不含自己」场景），默认 false */
  ignoreSelf?: boolean
}

export interface ScreenshotResult {
  /** 成功时为 base64 图片（data:image/...;base64,...），失败为空字符串 */
  dataUrl: string
  /** 生成的画布，供需要进一步裁剪/上传时复用 */
  canvas: HTMLCanvasElement | null
  /** 是否成功 */
  success: boolean
  /** 失败原因（成功时为空字符串） */
  error: string
}

/**
 * 解析截图目标为真实 DOM 元素。
 * - 传入 Element：直接返回
 * - 传入 string：优先按 id 查找（getElementById），查不到再按 CSS 选择器查找（querySelector）
 * - 传入 Vue 组件实例（含 $el）：取其根元素
 * - 找不到返回 null
 */
function resolveTarget(target: ScreenshotTarget | undefined | null): Element | null {
  if (!target) return null
  if (typeof target === 'string') {
    const byId = document.getElementById(target)
    if (byId) return byId
    return document.querySelector(target)
  }
  // DOM 元素
  if (target instanceof Element) return target
  // Vue 组件实例：ref="xxx" 拿到的组件代理，取其 $el 根元素
  const el = (target as ComponentInstanceLike).$el
  if (el instanceof Element) return el
  return null
}

/**
 * 解析排除列表，归一化为元素数组。
 * 支持单个元素/id，也支持数组（同时排除多个节点）。
 */
function resolveExcludes(
  exclude: ScreenshotTarget | ScreenshotTarget[] | undefined
): Element[] {
  if (!exclude) return []
  const list = Array.isArray(exclude) ? exclude : [exclude]
  const result: Element[] = []
  for (const item of list) {
    const el = resolveTarget(item)
    if (el) result.push(el)
  }
  return result
}

/**
 * 页面 / DOM 截图 Hook。
 *
 * 用法：
 * ```ts
 * const { capture } = useScreenshot()
 * const { dataUrl } = await capture()                         // 截取整页
 * await capture({ target: '#app' })                            // 只截 #app 节点
 * await capture({ exclude: '.navbar' })                        // 排除单个节点
 * await capture({ exclude: ['.navbar', '#footer'] })           // 同时排除多个节点
 * await capture({ exclude: signRef.value })                    // 排除组件 ref 对应的根元素
 * await capture({ target: signRef.value })                     // 只截组件 ref 对应的根元素
 * ```
 */
export function useScreenshot() {
  /**
   * 执行截图，返回 base64 图片。
   * @param options 截图配置（target / exclude / 输出格式等）
   */
  async function capture(
    options: UseScreenshotOptions = {}
  ): Promise<ScreenshotResult> {
    const {
      target,
      exclude,
      useCORS = true,
      allowTaint = true,
      backgroundColor = null,
      imageType = 'image/png',
      quality,
      scale,
      ignoreSelf = false,
    } = options

    // 1. 确定截图根节点：默认整页，否则用指定节点
    const root = resolveTarget(target) ?? document.documentElement

    // 2. 归一化排除列表
    const excludeEls = resolveExcludes(exclude)

    try {
      const opts: Parameters<typeof html2canvas>[1] = {
        useCORS,
        allowTaint,
        backgroundColor,
        logging: false,
      }
      // 仅在「整页截图」（未指定 target）时，才显式覆盖为整个可滚动区域的尺寸；
      // 指定 target 时交给 html2canvas 按元素自身 bounds 裁剪，避免误扩为整页。
      if (!target) {
        opts.width = document.documentElement.scrollWidth
        opts.height = document.documentElement.scrollHeight
        opts.windowWidth = document.documentElement.scrollWidth
        opts.windowHeight = document.documentElement.scrollHeight
        opts.scrollX = 0
        opts.scrollY = 0
      }
      if (scale != null) opts.scale = scale
      // 排除指定节点
      if (excludeEls.length > 0) {
        opts.ignoreElements = (el: Element) => excludeEls.includes(el)
      }
      // 截取「不含自己」：把根节点临时隐藏，画完再恢复
      if (ignoreSelf) {
        const originalVisibility = (root as HTMLElement).style.visibility;
        (root as HTMLElement).style.visibility = 'hidden';
        try {
          const canvas = await html2canvas(root as HTMLElement, opts)
          return buildResult(canvas, imageType, quality)
        } finally {
          (root as HTMLElement).style.visibility = originalVisibility;
        }
      }

      const canvas = await html2canvas(root as HTMLElement, opts)
      return buildResult(canvas, imageType, quality)
    } catch (err) {
      return {
        dataUrl: '',
        canvas: null,
        success: false,
        error: err instanceof Error ? err.message : String(err),
      }
    }
  }

  /**
   * 把画布转为 base64 输出。
   */
  function buildResult(
    canvas: HTMLCanvasElement,
    imageType: string,
    quality?: number
  ): ScreenshotResult {
    // 画布尺寸为 0（例如目标不可见）时返回空
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      return {
        dataUrl: '',
        canvas: null,
        success: false,
        error: '截图区域尺寸为 0，目标可能不可见或未渲染完成',
      }
    }
    let dataUrl = ''
    try {
      dataUrl = canvas.toDataURL(imageType, quality)
    } catch (e) {
      return {
        dataUrl: '',
        canvas,
        success: false,
        error: e instanceof Error ? e.message : String(e),
      }
    }
    return { dataUrl, canvas, success: true, error: '' }
  }

  return { capture }
}
