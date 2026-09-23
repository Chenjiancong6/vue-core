<template>
  <div v-if="$slots.scope"><slot name="scope" :row="state.displayValue"></slot></div>
  <div v-else>{{ state.displayValue }}</div>
</template>

/** 
* 提供使用插槽显示和自定义方式
* 插槽和默认显示二选一
*/
<!--
 <template #scope="scope">
  <div>{{scope.row}}</div>
 </template>
 -->

<script setup>  // vue3.2新的语法糖, 编写代码更加简洁高效
import { onMounted, onUnmounted, reactive  } from "vue";
import { watch, computed } from 'vue';
import { requestAnimationFrame, cancelAnimationFrame } from './requestAnimationFrame.js'
// 定义父组件传递的参数
const props = defineProps({
  // 开始的数字
  start: {
    type: Number,
    required: false,
    default: 0
  },
  // 结束的数字
  end: {
    type: Number,
    required: false,
    default: 0
  },
  //滚动时间
  duration: {
    type: Number,
    required: false,
    default: 5000
  },
  // 是否自动播放 
  autoPlay: {
    type: Boolean,
    required: false,
    default: true
  },
  // 要显示的小数位数,四舍五入
  decimals: {
    type: Number,
    required: false,
    default: 0,
    validator (value) {
      return value >= 0
    }
  },
  // 小数点,十进制分割
  decimal: {
    type: String,
    required: false,
    default: '.'
  },
  // 数字分隔符，可自定义
  separator: {
    type: String,
    required: false,
    default: ','
  },
  // 前缀
  prefix: {
    type: String,
    required: false,
    default: ''
  },
  // 后缀
  suffix: {
    type: String,
    required: false,
    default: ''
  },
  // 是否使用速度变化曲线,使用缓和功能
  useEasing: {
    type: Boolean,
    required: false,
    default: true
  },
  // 速度变化曲线,缓和回调
  easingFn: {
    type: Function,
    default(t, b, c, d) {
      return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    }
  }
})

const isNumber = (val) => {
  return !isNaN(parseFloat(val))
}

// 格式化数据，返回想要展示的数据格式
const formatNumber = (val) => {
  val = val.toFixed(props.decimals)
  val += ''
  // 0.000 以小数点作为分隔，变成数组里面两个值 ['0', '000']
  const x = val.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? props.decimal + x[1] : ''
  const rgx = /(\d+)(\d{3})/
  if (props.separator && !isNumber(props.separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + props.separator + '$2')
    }
  }
  // 加上前缀后缀
  return props.prefix + x1 + x2 + props.suffix
}

// 相当于vue2中的data中所定义的变量部分
const state = reactive({
  localStart: props.start,
  displayValue: formatNumber(props.start),
  printVal: null,
  paused: false,
  localDuration: props.duration,
  startTime: null,
  timestamp: null,
  remaining: null,
  rAF: null
})

// 定义一个计算属性，当开始数字大于结束数字时返回true
const stopCount = computed(() => {
  return props.start > props.end
})
// 定义父组件的自定义事件，子组件以触发父组件的自定义事件
const emits = defineEmits(['onMountedcallback', 'callback'])

const startCount = () => {
  state.localStart = props.start
  state.startTime = null
  state.localDuration = props.duration
  state.paused = false
  state.rAF = requestAnimationFrame(count)
}

watch(() => props.start, () => {
  if (props.autoPlay) {
    startCount()
  }
})

watch(() => props.end, () => {
  if (props.autoPlay) {
    startCount()
  }
})
// dom挂在完成后执行一些操作
onMounted(() => {
  if (props.autoPlay) {
    startCount()
  }
  emits('onMountedcallback')
})
// 暂停计数
const pause = () => {
  cancelAnimationFrame(state.rAF)
}
// 恢复计数
const resume = () => {
  state.startTime = null
  state.localDuration = +state.remaining
  state.localStart = +state.printVal
  requestAnimationFrame(count)
}

const pauseResume = () => {
  if (state.paused) {
    resume()
    state.paused = false
  } else {
    pause()
    state.paused = true
  }
}

const reset = () => {
  state.startTime = null
  cancelAnimationFrame(state.rAF)
  state.displayValue = formatNumber(props.start)
}

const count = (timestamp) => {
  if (!state.startTime) state.startTime = timestamp
  state.timestamp = timestamp
  const progress = timestamp - state.startTime
  state.remaining = state.localDuration - progress
  // 是否使用速度变化曲线
  if (props.useEasing) {
    if (stopCount.value) {
      state.printVal = state.localStart - props.easingFn(progress, 0, state.localStart - props.end, state.localDuration)
    } else {
      state.printVal = props.easingFn(progress, state.localStart, props.end - state.localStart, state.localDuration)
    }
  } else {
    if (stopCount.value) {
      state.printVal = state.localStart - ((state.localStart - props.end) * (progress / state.localDuration))
    } else {
      state.printVal = state.localStart + (props.end - state.localStart) * (progress / state.localDuration)
    }
  }
  if (stopCount.value) {
    state.printVal = state.printVal < props.end ? props.end : state.printVal
  } else {
    state.printVal = state.printVal > props.end ? props.end : state.printVal
  }

  state.displayValue = formatNumber(state.printVal)
  if (progress < state.localDuration) {
    state.rAF = requestAnimationFrame(count)
  } else {
    emits('callback')
  }
}
// 组件销毁时取消动画
onUnmounted(() => {
  cancelAnimationFrame(state.rAF)
})
</script>