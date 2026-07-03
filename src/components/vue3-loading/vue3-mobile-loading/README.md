## 组件说明

统一处理界面loading的组件, 基于Vant4 的 toast轻提示 组件二次封装

### 组件安装

```javascript
pnpm i @cjc/vue3-loading-mobile
```

### 在组件内使用

```javascript
import request from '@cjc/axios';

const response = await request.get({
    url: 'XXXXXX',
    loading: true, // 开启loading
    context: {
      message: '自定义loading提示',
    },
});
```

### 方法说明

#### add

```####

增加一个loading

```javascript
import Loading from '@cjc/vue3-loading-mobile';

// loading作用在全局
Loading.add()

// loading的ToastOptions配置项修改
Loading.add({message: 'loading提示文字'})
```

#### remove

移除一个loading

```javascript
// 关闭加载中的loading
Loading.remove()


```
