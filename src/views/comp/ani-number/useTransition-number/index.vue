<template>
  <div ref="containerRef">
    <div v-if="$slots.scope"><slot name="scope" :row="displayValue"></slot></div>
    <div v-else>{{ displayValue }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
// useTransition 来自 VueUse，作用是把一个数字（或一组数字）从当前值平滑过渡到目标值，常用于数字滚动、进度条、计数动画这类场景。
import {
  useTransition,
  TransitionPresets,
  useElementVisibility,
} from '@vueuse/core';

interface Props {
  /** 目标数值 */
  end: number
  /** 起始数值 */
  start?: number
  /** 动画时长（毫秒） */
  duration?: number
  /** 小数位数 */
  decimals?: number
  /** 千分位分隔符 */
  separator?: string
  /** 小数点 */
  decimal?: string
  /** 前缀 */
  prefix?: string
  /** 后缀 */
  suffix?: string
  /** 缓动函数 */
  ease?: keyof typeof TransitionPresets
}

const props = withDefaults(defineProps<Props>(), {
  start: 0,
  duration: 2000,
  decimals: 0,
  separator: ',',
  decimal: '.',
  prefix: '',
  suffix: '',
  ease: 'easeOutCubic',
})

const emit = defineEmits<{
  (e: 'finished'): void
}>()

const el = useTemplateRef<HTMLDivElement | null>("containerRef")
const visible = useElementVisibility(el)

// 用 ref 承载当前目标值，控制动画
const target = ref(props.start)
const source = computed(() => props.start)

const output = useTransition(target, {
  duration: props.duration,
  transition: TransitionPresets[props.ease],
  onFinished: () => emit('finished'),
})

// 进入视口才滚动
watch(visible, (v) => {
  if (v) target.value = props.end
}, { immediate: true })

// 支持外部动态改 end（已经显示过则直接过渡）
watch(() => props.end, (val) => {
  // 只有在可见时才更新目标值
  if (visible.value) target.value = val
})

const displayValue = computed(() => {
  const n = output.value
  // toFixed 会先补零再格式化，保证 99.1 显示为 '99.10'
  const fixed = n.toFixed(props.decimals)
  // 分离整数部分和小数部分
  const [int, dec] = fixed.split('.')

  // 千分位分隔符:把 1234567 → 1,234,567，本质是从右往左每 3 位插入一个分隔符。
  const intWithSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, props.separator)

  // 合并前缀、整数部分、小数部分、后缀
  return props.prefix
    + intWithSep
    + (dec ? props.decimal + dec : '')
    + props.suffix;
})
</script>