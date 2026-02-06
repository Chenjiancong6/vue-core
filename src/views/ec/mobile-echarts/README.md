**移动端的echarts用法，不同于pc端的echarts用法，主要是echarts是全量还是按需引入的区别，具体如下：**

1. 在pc端，echarts是全量引入，且以静态脚本方式引入，在使用组件 `@cjc/vue3-echarts` 时会自动引入
2. 在移动端，echarts是按需引入，且需要开发者在 `src/global/js/echarts.ts `中根据项目需要引入相关模块

**echarts全量引入和按需引入的优点和缺点**

**全量引入：**优点：开发者无需关心需要引入哪些echarts子模块，只需要写配置即可；缺点：引入的脚本比较大，在网络较差时可能会影响加载和渲染速度

**按需引入**：优点：只引入业务需要的模块，体积较小，有利于网络较差时的加载；缺点：开发者需要根据使用了哪些模块而手动引入模块

TIP

* 在 pc端 我们通常不考虑网络差和流量的情况，因此考虑 全量引入
* 在 移动端 通常时面向终端用户，网络环境复杂，因此考虑 按需引入

## 使用前注意事项

`src/global/js/echarts.ts` 包含了一些基础的必要的引入项，需要引入才能运行echarts。需要根据使用了哪些模块，在` src/global/js/echarts.ts` 中引入。

```javascript
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 引入柱状图图表，图表后缀都为 Chart （不是必须引入，用到才引入！）
import { LineChart } from 'echarts/charts';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);
```

然后在`src/main.ts`中加入如下代码：

```
import '@global/js/echarts'
```

## 组件安装

```javascript
pnpm i @cjc/vue3-echarts-mobile
```

## 组件props


| 名称        | 类型           | 默认值  | 说明                                                                   |
| ----------- | -------------- | ------- | ---------------------------------------------------------------------- |
| theme       | String         | default | 非必传。echarts主题，一般不会设置它，而是在工程设置全部的echarts的主题 |
| needDispose | Boolean        | true    | 非必传。当option改变并设置它时，是否销毁并新建echarts对象              |
| width       | Number｜String | '100%'  | 非必传。图表宽度，默认是100%                                           |
| height      | Number｜String | '100%'  | 非必传。图表高度，默认是100%                                           |

## 组件事件


| 名称          | 参数        | 说明                                                                                                                                                                                                                       |
| ------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| instanceReady | echarts对象 | 当echarts对象创建好后，触发该事件，参数是echarts对象。使用场景：当需要监听点击等事件时。如果needDispose为true，则每次option改变时，都会重新创建echarts实例，而导致触发该事件。如果needDispose为false，则该事件只触发一次。 |
| optionReady   | echarts对象 | 当给echarts实例setOption之后，触发该事件，参数是echarts对象。使用场景：当需要dispatchAction等操作时。该事件在每次option改变之后，都会触发。                                                                                |

# 使用示例

```javascript
<template>
  <div class="mobile-echarts--wrapper">
    <div style="width:400px;height:400px">
      <Vue3EchartsMobile :option="ecOption"></Vue3EchartsMobile>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Vue3EchartsMobile from '@cjc/vue3-echarts-mobile';

const ecOption = computed(() => {
  return {
    title: {
      text: "移动端按需引入折线图示例"
    },
    tooltip: {
      trigger: "item"
    },
    xAxis: {
      type: "category",
     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: "value"
    },
      series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }
  ]
  };
})

</script>

```
