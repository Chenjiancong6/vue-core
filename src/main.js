import { createApp } from 'vue';
import './style.css';
import '@/global/style/main.less';
import App from './App.vue';
// 引入ai库, 初始化llm大语音模型函数
import '@/ai-lib/llm.ts';
import { setupRouter } from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import zhLocale from 'element-plus/es/locale/lang/zh-cn';
import dayjs from 'dayjs';
import { dayjs as elDayjs } from 'element-plus';
import zhcn from 'dayjs/locale/zh-cn';
// v3-drag-zoom 组件
import V3DragZoom from "v3-drag-zoom";
// v3-drag-zoom 全局样式（必须导入，否则无法正常使用）
import "v3-drag-zoom/dist/style.css";

import Vue3DraggableResizable from '@v3e/vue3-draggable-resizable'
//需引入默认样式
import '@v3e/vue3-draggable-resizable/dist/Vue3DraggableResizable.css';
// 在入口文件注册vite-plugin-svg-icons插件虚拟模块，用于引入svg图标
import 'virtual:svg-icons-register'; 


dayjs.locale(zhcn);
// 构建后，element-plus是script引入，它里面也有打包一个dayjs
// 需要给这个dayjs也设置中文，否则可能出现日期格式化显示英文的情况
elDayjs.locale(zhcn);

const createRootApp = () => {
  const app = createApp(App);
  setupRouter(app);

  app.use(ElementPlus, {
    locale: zhLocale
  });
  app.use(Vue3DraggableResizable);
  app.use(V3DragZoom);
  app.mount('#app');
  return app;
}

const app = createRootApp();
