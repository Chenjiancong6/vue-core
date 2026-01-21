import { loadEnv } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import type { UserConfig, ConfigEnv } from 'vite';
// import ViteConsole from './plugin/vite-console/console.js';
import ViteConsole from "@cjc/vite-plugin-console";
import ViteLibStaticImport from "@cjc/vite-plugin-lib-static-import";
const root = process.cwd();
const pathResolve = (dir: string) => resolve(root, '.', dir);
// https://vite.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig =>{

  const isBuild = command === 'build';
  const argMode = process.argv[3] === '--mode' ? process.argv[4] : process.argv[3];
  const configDir = pathResolve('config');
  const env = loadEnv(isBuild ? mode : argMode, configDir);
  
  return {
    envDir: pathResolve('config'),
    base: env.VITE_BASE_PATH,
    plugins: [
      vue(),
      ViteLibStaticImport(),
      svgLoader(), // 动态加载 SVG 文件
      ViteConsole(),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.less', '.css', 'vue'],
      alias: [
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/`
        }
      ]
    },
  }
}
