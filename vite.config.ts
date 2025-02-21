import { loadEnv } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import type { UserConfig, ConfigEnv } from 'vite';

const root = process.cwd();
const pathResolve = (dir: string) => resolve(root, '.', dir);
// https://vite.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig =>{
  console.log('pathResolve',pathResolve);
  return {
    plugins: [
      vue(), 
      svgLoader(), // 动态加载 SVG 文件
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
