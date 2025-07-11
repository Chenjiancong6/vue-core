
import fs from 'node:fs'; // 引入文件系统模块
import path from 'node:path'; // 引入路径模块
// 引入自定义工具模块（用于控制台颜色输出）
import pixelColor from './util.js';

// 获取当前工作目录（项目根目录）
const projectRoot = process.cwd();

// 读取并解析package.json文件内容
const packageJsonPath = path.resolve(projectRoot, 'package.json');
const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
const packageJson = JSON.parse(packageJsonContent);

/**
 * 首次启动标记
 * - Vite首次启动时会自动打印服务信息
 * - 热更新重启时需要手动打印，此标记用于避免重复打印
 */
let isFirstTimeServerListening = true;

export default function ViteConsole() {
  let config;
  // 保存Vite服务器实例
  let server;

  /**
   * 检查服务器就绪状态
   * 通过定时器轮询检测服务器是否已启动
   */
  const checkServerReady = () => {
    let inter = setInterval(() => {
      // 当检测到服务器正在监听时
      if (server?.httpServer.listening) {
        clearInterval(inter);
        // 非首次启动时执行打印
        if (!isFirstTimeServerListening) {
          printAfterClearScreen();
        }
        // 更新首次启动标记
        isFirstTimeServerListening = false;
      }
    }, 500);
  };

  /**
   * 清理控制台后打印服务信息
   * 使用setTimeout确保在Vite原生输出之后执行
   */

  const printAfterClearScreen = () => {
    setTimeout(() => {
      // 使用Vite的logger输出彩色信息
      config.logger.info(`\n  ${
        pixelColor.green('项目应用 ' + packageJson.name)  // 绿色显示应用名称
      } ${
        pixelColor.yellow('[' + (config?.env?.VITE_APP_TITLE || import.meta.env.VITE_APP_TITLE || '') + ']')  // 黄色显示环境标题
      } ${
        pixelColor.green('正在运行于:')  // 绿色显示提示文本
      }\n`);

      // 调用Vite服务器原生的URL打印方法
      server.printUrls();
    })// 不设置延迟时间，利用事件循环机制确保执行顺序
  };
  
  return {
    name: 'my-vite-console', // 插件名称

    /**
     * configureServer钩子 - 服务器配置完成后触发
     * @param {Object} _server - Vite服务器实例
    */
    configureServer(_server) {
      server = _server;  // 保存服务器实例引用
      checkServerReady(); // 开始检测服务器状态
    },

    /**
     * 解析 Vite 配置后调用
     * configResolved钩子 - 配置解析完成后触发
     * @param {Object} resolvedConfig - 最终解析的Vite配置
     */
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    /**
     * handleHotUpdate钩子 - 热更新时触发
     * 执行自定义 HMR 更新处理
     * @param {Object} e - 热更新事件对象
     */
    handleHotUpdate(e) {
      const { modules, file } = e;  // 解构获取更新模块和文件路径
      // 当有模块更新时（通常是代码文件）
      if (modules.length > 0) {
        printAfterClearScreen();
      } else {
        // 当更新的是HTML文件时（需要手动触发页面刷新）
        if (file.endsWith('.html')) {
          printAfterClearScreen();
        }
      }
      return modules;  // 返回需要热更新的模块
    }
  }
}