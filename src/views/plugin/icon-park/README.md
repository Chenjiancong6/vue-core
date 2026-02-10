# 封装icon-park图标按需引入插件的原因：

1. 自己封装插件，可以规定icon-park组件命名方式（以 `<i-`   开头的我们规定是icon-park的图标),不符合规定的组件命名不给渲染组件，统一代码风格，同时，省去在main.ts 手动导入图标组件包中提供的预设样式文件

# 介绍

1.根据template标签自动按需引入对应的`icon-park`组件样式文件

2.icon-park 图标参考官网：[https://iconpark.oceanengine.com/home](https://)

3.插件处理的文件默认是`vue3`的文件，都会在`script`标签上加上`setup` 属性，如果不希望加上或者想在`vue3`中写`vue2`的写法，这里支持加入一个属性 `nosetup`, 加了这个属性后，插件就不会自动导入`setup`，示例如下：

```
<script nosetup>

</script>
```

4.使用这个插件的前提是要安装` icon-park` 这个图标库，然后才能按需引入，安装命令如下：

```
pnpm add @icon-park/vue-next --save
```

以下代码：

```
<template>
  <i-delete />
</template>
```

经过插件编译后，会变为如下代码：

```
<template>
  <i-delete />
</template>
<script setup>
import IDelete from '@icon-park/vue-next/es/icons/Delete';
import '@icon-park/vue-next/styles/index.css';
</script>
```

# 依赖安装

使用 `-D `开发依赖，插件代码最终不会在生产包中存在和构建

```
pnpm i @cjc/vite-plugin-chen-icon-park-auto-import -D
```

# 使用方式

```
import VitePluginChenIconParkAutoImport from '@cjc/vite-plugin-chen-icon-park-auto-import';
export default ({ command, mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [VitePluginChenIconParkAutoImport()],
  };
};
```
