import { loadEnv } from 'vite';
import { resolve } from 'path';
import path from 'path';
import fs from 'fs';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import type { UserConfig, ConfigEnv } from 'vite';
// import VitePluginChenIconPark from './plugin/vite-plugin-icon-park/index.cjs';
// import ViteConsole from './plugin/vite-console/console.js';
// import VitePluginLog from './plugin/vite-plugin-log/index.cjs';
// import VitePluginChenVantAutoImport from './plugin/vant-auto-import/auto-import.cjs';
// import ViteClearConsole from './plugin/vite-clear-console/clear-console.cts';
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
// import { createSvgIconsPlugin } from './plugin/vite-plugin-cjc-svg-icons/index.js';
import ViteClearConsoleAlertDebug from '@cjc/vite-plugin-chen-clear-console-alert-debug';
import VitePluginChenVantAutoImport from '@cjc/vite-plugin-chen-vant-auto-import';
import ViteConsole from "@cjc/vite-plugin-console";
import VitePluginChenIconParkAutoImport from '@cjc/vite-plugin-chen-icon-park-auto-import';
import ViteLibStaticImport from "@cjc/vite-plugin-lib-static-import";
import { createSvgIconsPlugin } from '@cjc/vite-plugin-cjc-svg-icons';

import vitePluginPurgeIcons from 'vite-plugin-purge-icons';
import Markdown from 'vite-plugin-md';
import bundleAnalyzer from 'vite-bundle-analyzer'; // 引入分析插件

const root = process.cwd();
const pathResolve = (dir: string) => resolve(root, '.', dir);
// https://vite.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig =>{

  const isBuild = command === 'build';
  const argMode = process.argv[3] === '--mode' ? process.argv[4] : process.argv[3];
  const configDir = pathResolve('config');
  const env = loadEnv(isBuild ? mode : argMode, configDir);

  const analyzePlugins = [];
  // 分析打包体积,当运行pnpm run build:analyze时,会生成分析报告
  if (process.env.ANALYZE === 'true') {
    analyzePlugins.push(bundleAnalyzer());
  }
  
  return {
    envDir: pathResolve('config'),
    base: env.VITE_BASE_PATH,
    server: {
      proxy: {
        //  天地图电子地图图层 代理 wgs84坐标系
        [env.VITE_API_BASEPATH]: {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          ws: true
        },
        // import.meta.env.VITE_RAGFOLW_URL+ '/'+import.meta.env.VITE_RAGFOLW_CHAT_ID+'/chat/completions'
        '/ragflow/chat/completions': {
          target: env.VITE_RAGFOLW_URL + `/${env.VITE_RAGFOLW_CHAT_ID}`,
          changeOrigin: true,
          ws: true,
          // 重写路径，将 /ragflow/chat/completions 变成 /chat/completions
          rewrite: (path) => path.replace(/^\/ragflow/, ''),
        }
      },
    },
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/], // <-- 让 Vue 也处理 md 文件
      }),
      Markdown(),
      ViteClearConsoleAlertDebug(['alert', 'debugger']),
      VitePluginChenVantAutoImport(),
      VitePluginChenIconParkAutoImport(),
      ViteLibStaticImport(),
      svgLoader(), // 动态加载 SVG 文件
      ViteConsole(),
      //工作原理: 在构建时，扫描你的源码，找到所有 svg-icons组件使用的在线图标，然后从 Iconify 的库中只提取这些图标的代码，生成一个极小的图标包
      vitePluginPurgeIcons(),
      createSvgIconsPlugin(),
      ...analyzePlugins,
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.css', 'vue', '.cjs'],
      alias: [
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/`
        }
      ]
    },
    build: {
      sourcemap: true
    },
    //  esbuild:{
    //   pure: ['console.log'], // 删除 console.log
    //   drop: ['debugger'], // 删除 debugger
    // }
  }
}
