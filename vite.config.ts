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
import ViteClearConsoleAlertDebug from '@cjc/vite-plugin-chen-clear-console-alert-debug';
import VitePluginChenVantAutoImport from '@cjc/vite-plugin-chen-vant-auto-import';
import ViteConsole from "@cjc/vite-plugin-console";
import VitePluginChenIconParkAutoImport from '@cjc/vite-plugin-chen-icon-park-auto-import';
import ViteLibStaticImport from "@cjc/vite-plugin-lib-static-import";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import vitePluginPurgeIcons from 'vite-plugin-purge-icons';
import Markdown from 'vite-plugin-md';

const root = process.cwd();
const pathResolve = (dir: string) => resolve(root, '.', dir);
// https://vite.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig =>{

  const isBuild = command === 'build';
  const argMode = process.argv[3] === '--mode' ? process.argv[4] : process.argv[3];
  const configDir = pathResolve('config');
  const env = loadEnv(isBuild ? mode : argMode, configDir);

  // 动态扫描项目中所有包含 svgs文件夹的目录
  function findAllSvgsDirectoriesWithFilter(rootPath) {
    const svgsDirs = []
    // 排除一些目录，避免性能问题
    const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.vscode']
    
    function shouldExclude(dirName) {
      return excludeDirs.includes(dirName) || dirName.startsWith('.')
    }
    
    function scanDirectory(currentPath, depth = 0) {
      // 限制扫描深度，避免性能问题
      // if (depth > 10) return
      try {
        const items = fs.readdirSync(currentPath)
        for (const item of items) {
          if (shouldExclude(item)) continue
          const fullPath = path.join(currentPath, item)
          const stat = fs.statSync(fullPath)
          if (stat.isDirectory()) {
            if (item === 'svgs') {
              // 验证该目录确实包含 SVG 文件
              const svgFiles = fs.readdirSync(fullPath).filter(file => 
                file.toLowerCase().endsWith('.svg')
              )
              if (svgFiles.length > 0) {
                svgsDirs.push(fullPath)
                // console.log(`✅ Found SVG directory: ${fullPath} (${svgFiles.length} files)`)
              }
            } else {
              scanDirectory(fullPath, depth + 1)
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ Cannot access directory: ${currentPath}`)
      }
    }
    
    scanDirectory(rootPath)
    // 拿到的是一个包含所有svgs文件夹路径的数组
    return svgsDirs
  }
  
  return {
    envDir: pathResolve('config'),
    base: env.VITE_BASE_PATH,
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/], // <-- 让 Vue 也处理 md 文件
      }),
      Markdown(),
      ViteClearConsoleAlertDebug(['alert', 'debugger']),
      VitePluginChenVantAutoImport(),
      VitePluginChenIconParkAutoImport(),
      // ViteLibStaticImport(),
      svgLoader(), // 动态加载 SVG 文件
      ViteConsole(),
      //工作原理: 在构建时，扫描你的源码，找到所有 svg-icons组件使用的在线图标，然后从 Iconify 的库中只提取这些图标的代码，生成一个极小的图标包
      vitePluginPurgeIcons(),
      createSvgIconsPlugin({
        // 动态扫描项目中所有包含 svgs文件夹的目录
        iconDirs: findAllSvgsDirectoriesWithFilter(root),
        symbolId: 'icon-[name]', // 指定symbolId格式
        // inject: "body-last",
      }),
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
