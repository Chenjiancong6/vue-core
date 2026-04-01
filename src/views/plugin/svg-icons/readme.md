# 介绍

1.自动收集工程 `src`目录下的svgs目录的图标文件。修改自开源插件 `vite-plugin-svg-icons`

2.插件添加功能，动态扫描项目中所有包含 `svgs文件夹`的目录，把目录中所有的svg打包成一个 `SVG Sprite`

3.插件添加功能，在工程中的`main.ts`自动导入文件注册虚拟模块，用于引入svg图标；`import 'virtual:svg-icons-register'`;

4.这个插件是配合 `@cjc/vue3-svg-icon` svg图标组件一起使用的，`@cjc/vue3-svg-icon`渲染获取图标的逻辑依赖 `@cjc/vite-plugin-cjc-svg-icons`插件功能实现；


## 安装

```
pnpm add @cjc/vite-plugin-cjc-svg-icons
```
