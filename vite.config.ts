import { loadEnv } from 'vite';
import { resolve } from 'path';
import path from 'path';
import fs from 'fs';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import type { UserConfig, ConfigEnv } from 'vite';
// import ViteConsole from './plugin/vite-console/console.js';
import ViteConsole from "@cjc/vite-plugin-console";
import ViteLibStaticImport from "@cjc/vite-plugin-lib-static-import";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import vitePluginPurgeIcons from 'vite-plugin-purge-icons';
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
      vue(),
      ViteLibStaticImport(),
      svgLoader(), // 动态加载 SVG 文件
      ViteConsole(),
      vitePluginPurgeIcons(),
      createSvgIconsPlugin({
        // 动态扫描项目中所有包含 svgs文件夹的目录
        iconDirs: findAllSvgsDirectoriesWithFilter(root),
        symbolId: 'icon-[name]', // 指定symbolId格式
        // inject: "body-last",
      })
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
