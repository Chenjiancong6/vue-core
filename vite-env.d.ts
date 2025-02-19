/// <reference types="vite/client" />
// 添加Vue类型声明文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
