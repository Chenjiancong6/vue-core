## 组件说明

基于axios的二次封装，用于在项目中发起http请求。

## 组件安装

```
pnpm i @cjc/axios
```

## 方法说明

### config

用于全局配置请求的参数，比如：请求前缀、默认的header、默认的数据类型等

| 参数名称    | 类型   | 默认值 | 说明                                                                                                                              |
| ----------- | ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| requestPre  | String | ''     | 请求的前缀。使用Request的全部请求都会带上requestPre，然后在vite.config.ts 转发到真实的baseURL上。除非请求参数中包含needPre: false |
| headers     | Object | {}     | 给axios.default.headers设置新的属性或者值，具体参考axios文档                                                                      |
| contentType | String | form   | 可选值有：form、json。对应的请求数据格式分别为：application/x-www-form-urlencoded、application/json。                             |
| globalData  | Object | {}     | 全局请求数据。该对象会被拼到所有的接口的请求参数中                                                                                |

globalData参数示例

```
// src/global/js/request.js中 执行，然后在main.ts 进行全局注册
import request from '@cjc/axios'; 
request.config({ 
  requestPre: import.meta.env.VITE_API_BASEPATH, 
  globalData: { moduleId: 'transpaas' },
})

// 然后接口中就会携带globalData的参数，比如 https:// www.xxx.com?moduleId=transpaas
```

### getConfig

无参数。获取使用config方法设置的配置。可用于使用非request场景时，但是也需要一些头部或者globalData的场景。

### cancel

| 参数名称 | 类型   | 默认值 | 说明                                                                                                                     |
| -------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| cancelId | String | Symbol | 要取消的请求的cancelId，不传则取消全部的请求。cancelId在get、post、delete、put等请求中作为参数带上，该值开发者自己定义。 |

TIP

建议使用Symbol定义cancelId

```javascript
const cancelId = Symbol(); 
request.post({ url: '/xxx', cancelId: cancelId });
request.cancel(cancelId);
```

### post | get | delete | put | patch

| 参数名称           | 类型           | 默认值 | 说明                                                                                                                                              |
| ------------------ | -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| url                | String         | ''     | 请求地址                                                                                                                                          |
| needPre            | Boolean        | true   | 当前请求是否带上前缀                                                                                                                              |
| loading            | Boolean        | true   | 是否显示loading                                                                                                                                   |
| context            | dom节点        | null   | 如果有loading时，loading的作用范围。默认是作用在全局，如果需要作用在局部，可以传入例如：btnRef的dom节点                                           |
| data               | Object         | null   | 请求的数据，一般是json格式（如果是get请求，数组参数会做扁平化处理，sort:['time#desc','name#asc'] 的格式会被转换成sort:time#desc,sort:name#asc）   |
| params             | Object         | null   | 拼接在url后面的参数。例如：params:{name:1}，url会变成:/xxx?name=1                                                                                 |
| contentType        | String         | form   | 可选值有：form、json。对应的请求数据格式分别为：application/x-www-form-urlencoded、application/json。一般项目全局定义即可，除非接口需要特别定义。 |
| cancel             | Boolean        | true   | 是否允许取消该请求                                                                                                                                |
| cancelId           | String, Symbol | ''     | 该请求用于取消请求的id，例如：cancelId=123;调用request.cancel('123')就会取消该请求                                                                |
| globalDataDisabled | Boolean        | flase  | 当前接口是否禁用全局参数                                                                                                                          |

上面几个方法返回的都是promise对象。

### upload

使用multipart方式上传文件，详情使用方式查看下方示例代码

### getStaticFile

| 参数名称 | 类型   | 默认值 | 说明                                                                                                                                                                                                                                          |
| -------- | ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url      | string | ''     | 需要在工程配置中添加打包路径： VITE_BASE_PATH ，比如VITE_BASE_PATH  = / 。加载工程public目录下的文件，支持路由为history模式。url是public目录下的文件相对public的路径，例如：某文件路径是public/static/test.json，则这里要传：static/test.json |

方法使用示例：

```
import { getStaticFile } from '@cjc/axios'; 
getStaticFile('test.json').then( res => { // res就是静态文件的内容 });
```

### createAxios

用于创建不被工程的请求配置影响的干净的请求实例。

| 参数名称 | 类型   | 默认值 | 说明                                                   |
| -------- | ------ | ------ | ------------------------------------------------------ |
| option   | Object | {}     | 参数的属性参考axios.create(opens new window)方法的参数 |

方法使用示例：

```
import { createAxios } from '@cjc/axios';
 const axios = createAxios(); 
```

### configLoading

配置请求的loading实例，允许在请求发生时，触发一个loading动画,一般在 src/global/js/request.js 中配置

```
import { configLoading } from '@cjc/axios'; 
import Loading from '@cjc/vue3-loading';
 configLoading(Loading)
```

TIP

移动端和pc端的loading动画效果不一样。移动端是基于vant的toast，组件是：@cjc/vue3-loading-mobile。pc端是基于element-plus的loading，组件是：@cjc/vue3-loading。如果要自行实现一个loading，则定义一个对象，并实现几个接口方法即可：add remove clear setGlobalContext

## 使用示例

### 项目全局定义请求参数

一般放在src/global/js/request.js中,然后在main.ts 中 全局注册使用

```
// 初始化配置全局请求，全局的数据格式和全局的头部
 // 一般放在src/global/js/request.js中 
request.config({
 requestPre: import.meta.env.VITE_API_BASEPATH,
 contentType: 'json' 
});
```

### 组件的请求定义在同级目录的api.js

api.js内容示例

```javascript
import request from '@cjc/axios'; 
loadData(options) { 
  return request.get({ url: '/xxx', ...options })
 }
saveData(options) { 
  return request.post({ url: '/xxx', ...options })
}, 
getData(options) { 
  return request.post({ 
    url: '/xxx', 
  // 不显示loading
   loading: false,
   ...options 
}) 
}
```

### 组件调用api.js代码示例

```
<template>
<div ref="loadingRef">
    <el-button>点击按钮</el-button>
  </div>
</template>
<script setup>
import { ref } from 'vue';
// 在业务代码中调用同级目录的api.js
import api from './api.js';
const loadingRef = ref();
const loadData = async () => {
 // loadRes就是接口请求结果
  const loadRes = await api.loadData({
    data: {
      xxx: 'xxx'
    },
    // 让loading作用在局部，不传context则loading作用在全局
    context: loadingRef.value,
    // 当路由切换时，是否允许该请求被取消，默认是true，允许取消
    cancel: false
  });
}
</script>
```

### 文件上传示例

```
<template>
<input ref="fileRef" @change="uploadData"/>
</template>

<script setup>
import { ref } from 'vue';
// 上传文件示例
// 获取选择的文件
const fileRef = ref();
const uploadData = async () => {
  let file = fileRef.files[0];
  let formData = new FormData();
  formData.append("myFiles", file);
  /**
   * 上传多个文件的代码示例如下：
   * for(let file of fileRes.files) {
   *   formData.append('myFiles', file);
   * }
   **/ 
  let uploadRes = await request.upload({
    // 上传url
    url: `/music/uploadAttachments`,
    data: formData,
    loading: false,
    timeout: 1000000,
    onUploadProgress: progressEvent => {
      // this.fileUploadProgress = progressEvent.loaded / progressEvent.total * 100 | 0;
    }
  });
}
</script>
```

## Q & A

### 获取axios对象

```
import { axios } from '@cjc/axios';
```

### 添加自定义拦截器

```javascript
import request, {
  axios
} from '@cjc/axios';

// 这段是根据项目的实际配置写
// 参考以下示例修改src/global/js/request.js的内容：
request.config({
  requestPre: import.meta.env.VITE_API_BASEPATH,
  contentType: 'json',
});

// --------- 业务添加自定义拦截器开始 ----------
// 允许业务自定义返回的拦截器
axios.interceptors.request.use(function(config) {
  // 添加请求自定义拦截逻辑
  return config;
}, function(error) {
  return Promise.reject(error);
});
axios.interceptors.response.use(function(response) {
  // 添加返回值自定义拦截逻辑
  return response;
}, function(error) {
  return Promise.reject(error);
})
// --------- 业务添加自定义拦截器结束 ----------



------------ 接口内的自定义拦截器 ----------------
    const response = await request.get({
      url: 'xxxx',
      responseType: 'blob',
      cancelId,
      // 接口内 请求拦截器
      requestInterceptor: {
        callback: (config) => {
          return config;
        },
        errorCallback: (error) => {
          return Promise.reject(error);
        }
      },
      // 接口内响应拦截器
      responseInterceptor:{
        callback: (response) => {
          return response;
        },
        errorCallback: (error) => {
          return Promise.reject(error);
        }
      }
    });


```

### 打开全局loading

```javascript
// 在 src/global/request.ts中编写如下代码 
import request from '@cjc/axios'; 
request.config({ loading: true })
```

### 单个接口设置加载loading

接口内的loading 优先级最高，只要接口内设置了loading为 true 或者 false, 就会优先触发

```javascript
const response = await request.get({
  url: 'xxxx',
  loading: true
});
```
