/**
 * 自定义Vite插件：日志打印 （功能和vite-console插件一样，这里是为了学习插件原理而实现的，简化了一点代码，少使用了一个vite构造函数）
 * - 功能：在Vite服务器启动后，打印项目应用名称、环境标题和服务URL信息
 * - 原理：通过监听Vite服务器的`listening`事件，在服务器启动和热更新后触发打印操作
 * - 优势：该插件让工程的启动服务端口和网络信息始终显示在控制台中
 */

// const fs = require('fs');
// const path = require('path');
import fs from 'node:fs'; // 引入文件系统模块
import path from 'node:path'; // 引入路径模块
const root = process.cwd(); // 当前工作目录
// 引入自定义工具模块（用于控制台颜色输出）
import pixelColor from './util.js';

// 读取并解析package.json文件内容
const packageJsonPath = path.resolve(root, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

module.exports = function () {
  // 服务器配置
  let serverConfig = null;
  let logger = null;

  function printServerUrlsInfo() {
    setTimeout(() => {
      //1. 先打印 自定义控制台日志信息
      logger.info(`\n  ${
        pixelColor.green('项目应用 ' + packageJson.name)  // 绿色显示应用名称
      } ${
        pixelColor.yellow('[' + (serverConfig.config?.env?.VITE_APP_TITLE) + ']')  // 黄色显示环境标题
      } ${
        pixelColor.green('正在运行于:')  // 绿色显示提示文本
      }\n`);
      //2. 再打印 控制台服务URL信息
      serverConfig.printUrls();
    })
  };

  /**
   * 检查服务器就绪状态
   * 通过定时器轮询检测服务器是否已启动
   */
  function checkServerReady() {
    let inter = setInterval(() => {
      // 当检测到服务器正在监听时
      if (serverConfig?.httpServer.listening) {
        clearInterval(inter);
        // 非首次启动时执行打印
        printServerUrlsInfo();
      }
    }, 500);
  }

  return {
    name: 'vite-plugin-log',

    configureServer(_server) {
      serverConfig = _server;
      logger = _server.config.logger;
      checkServerReady();
    },

    handleHotUpdate(ctx) {
      const { modules, file } = ctx;
      if(modules.length > 0) {
        printServerUrlsInfo();
      }else {
        if(file.includes('.html')) {
          printServerUrlsInfo();
        }
      }
      return modules;
    }
  }
}