import { createApp } from 'vue';
import './style.css';
import '@/global/style/main.less';
import App from './App.vue';
import { setupRouter } from './router/index';
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import zhLocale from 'element-plus/es/locale/lang/zh-cn';
import dayjs from 'dayjs';
import { dayjs as elDayjs } from 'element-plus';
import zhcn from 'dayjs/locale/zh-cn';

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

  app.mount('#app');
  return app;
}

const app = createRootApp();
