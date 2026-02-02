type ClearConsoleOptions = 'alert' | 'debugger' | 'console';

export default function (options?: ClearConsoleOptions[]) {
  // 过滤.vue文件,.js文件，.ts文件,.jsx文件, .tsx文件
  const filterReg = /\.(vue|js|ts|jsx|tsx)$/;

  // 安全地移除 console 语句
  function removeConsoleStatements(code: string): string {
    const lines = code.split('\n');
    const filteredLines: string[] = [];
    let consoleRegex = /console\.(log|warn|error|info|debug|trace|table|group|groupEnd|time|timeEnd|assert|count|dir|dirxml|groupCollapsed)\s*\([^)]*\)\s*;?/

    for (const line of lines) {
      // 检查是否是注释行或包含注释的 console 调用
      if (line.trim().startsWith('//') || line.includes('// console.')) {
        // 如果是注释行，保留整行（不处理其中的 console）
        filteredLines.push(line);
        continue;
      }

      // 检查是否包含多行注释的开始/结束
      if (line.includes('/*') || line.includes('*/')) {
        // 简单处理：如果行内有 console 调用且在注释外，才移除
        if (line.includes('console.') && !line.includes('//')) {
          // 移除这一行中的 console 调用部分（保守处理）
          const cleanedLine = line.replace(consoleRegex, '');
          filteredLines.push(cleanedLine);
        } else {
          filteredLines.push(line);
        }
      } else {
        // 普通行：移除 console 调用
        if (line.includes('console.') && !line.includes('//')) {
          const cleanedLine = line.replace(consoleRegex, '');
          filteredLines.push(cleanedLine);
        } else {
          filteredLines.push(line);
        }
      }
    }

    return filteredLines.join('\n');
  }

  // 安全地移除 alert 语句
  function removeAlertStatements(code: string): string {
    // 匹配完整的 alert 语句，考虑字符串中的内容
    const simpleAlertRegex = /alert\s*\(\s*(['"`])(.*?)\1\s*\)\s*;?/g
    return code.replace(simpleAlertRegex, '')
  }

  return {
    name: 'vite-plugin-clear-console',

    transform(code, id) {
      // 排除 node_modules、dist、构建相关目录
      if (
        id.includes('node_modules') ||
        id.includes('dist') ||
        id.includes('.vite') ||
        id.includes('element-plus') || // 特别排除 element-plus
        !filterReg.test(id)
      ) {
        return {
          code,
          map: null
        }
      };
      let transformedCode = code;
      try {
        if (options?.includes('debugger')) {
          // 更精确的 debugger 移除，处理多行情况
          transformedCode = transformedCode.replace(/^\s*debugger\s*;?\s*$/gm, '')
        };
        if (options?.includes('console')) {
          // 清除console.*
          transformedCode = removeConsoleStatements(transformedCode)
        }
        if (options?.includes('alert')) {
          // 清除 alert
          transformedCode = removeAlertStatements(transformedCode)
        }
        // 清理多余的空行
        transformedCode = transformedCode.replace(/\n{4,}/g, '\n\n\n')
      } catch (error) {
        return {
          code: transformedCode,
          map: null
        }
      }
      return {
        code: transformedCode,
        map: null
      }
    },
    // 确保在其他插件之前执行
    enforce: 'pre'
  }
}
