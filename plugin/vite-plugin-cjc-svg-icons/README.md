# 介绍

1. 自动收集工程 `src`目录下的svgs目录的图标文件。修改自开源组件 `vite-plugin-svg-icons`
2. 插件添加功能，`动态扫描项目中所有包含 svgs文件夹的目录`
3. 插件添加功能，在工程中的main.ts，自动导入 文件注册`vite-plugin-svg-icons`插件虚拟模块，用于引入svg图标；`import 'virtual:svg-icons-register'`;

