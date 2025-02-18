import { loadEnv } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import type { UserConfig, ConfigEnv } from 'vite';

const root = process.cwd();
const pathResolve = (dir: string) => resolve(root, '.', dir);
// https://vite.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig =>{
  console.log('pathResolve',pathResolve);
  return {
    plugins: [vue()],
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
