## 组件说明

统一处理界面loading的组件, 基于Element-plus 的loading加载组件二次封装

### 组件安装

```javascript
pnpm i @cjc/vue3-loading
```


### 方法说明

#### setGlobalLoadingStyle

支持修改Element-plus 的loading加载组件的样式

```javascript
import Loading from "@cjc/vue3-loading"

// 设置全局loading 样式
 Loading.setGlobalLoadingStyle({ background: 'rgba(0, 0, 0, 0.5)' });
```


#### setGlobalContext

用于设置全局loading作用域。一般写在`layout/index.vue`中，示例如下：

```javascript
<template>
  <div class="layout-wrap">
    <!-- 这里可能放头部、侧边栏菜单等元素 -->
    <div class="router-wrap" ref="routerWrapRef">
      <router-view v-if="isLoadingGlobalContextReady"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Loading from '@cjc/vue3-loading';

const routerWrapRef = ref(null);

const isLoadingGlobalContextReady = ref(false);

onMounted(() => {
  // 让路由的内容在全局作用域设置后才渲染，确保它生效
  Loading.setGlobalContext(routerWrapRef.value);
  isLoadingGlobalContextReady.value = true;
});

</script>

<style lang="less" scoped>
.layout-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.router-wrap {
  flex: 1;
  height: 0;
}
</style>
```


#### add

增加一个loading

```javascript
import Loading from '@cjc/cjc-loading';

// loading作用在全局
Loading.add()

// loading作用在具体的dom节点
Loading.add(domRef.value)
```

#### remove

移除一个loading

```javascript
// 加载完毕，需要手动移除loading
// 移除一次全局的loading
Loading.remove()

// 移除一次dom节点的loading
Loading.remove(domRef.value)
```

#### clear

清除全部的loading，一般用于路由切换时调用

```javascript
import Loading from '@cjc/vue3-loading';

// 定义路由

// 创建路由


router.beforeEach((to, from, next) => {
    Loading.clear();
    next();
});

```
