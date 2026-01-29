# 个人 vue-core 组件私库

vue-core 组件私库[访问地址](http://www.chenjiancong.com)

1. 修改本地.npmrc文件

windows下的.npmrc一般在C:\\Users\\xxx下面，mac下的.npmrc一般在/Users/xxx下面，用文本打开.npmrc，拷贝以下内容进去

```javascript
home=https://npmmirror.com
registry=https://packages.aliyun.com/68cba88215dfc6c8604f7adc/npm/repo-pncpo/ always-auth=true
//serverless-100023627449-npm.pkg.coding.net/badg-zhipin/npm/:username=npm-1734319997691 
//serverless-100023627449-npm.pkg.coding.net/badg-zhipin/npm/:_password="MTU3MGYxY2Q0YjExODgxNjNkOTljZjI5MjJhNDZiNmJjY2JkNWM3Nw=="
//serverless-100023627449-npm.pkg.coding.net/badg-zhipin/npm/:email=1293707549@qq.com
//packages.aliyun.com/68cba88215dfc6c8604f7adc/npm/repo-pncpo/:_authToken=656a8da6-7a56-4329-9ab8-06d69dc0ec89
```

2. 连接 cjc npm私服

```javascript
安装nrm 工具： npm i nrm@1.0.0 -g

切换源： nrm add cjc https://packages.aliyun.com/68cba88215dfc6c8604f7adc/npm/repo-pncpo/

执行切换到新的源： nrm use cjc
```

3. 下载私库组件示例：

```javascript
pnpm install @cjc/vue3-echarts
```
