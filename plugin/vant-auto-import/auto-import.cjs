/** @type {import('vite').UserConfig} */

/**
 * 将van相关前缀的字符串转换为规范的大驼峰命名
 * @param {string} str - 输入的字符串（可以是驼峰、连字符或首字母大写等形式）
 * @returns {string} - 转换后的字符串（大驼峰格式）
 */
function convertVanString(str) {
  if (!str || typeof str !== 'string') {
    return str;
  }
  // 统一转为小写并移除所有van前缀（不区分大小写）
  let result = str
    .replace(/^van[-\s_]?/i, '')  // 移除开头的van前缀（可能带分隔符）
    .replace(/^Van(?=[A-Z])/, ''); // 单独处理Van开头的情况
  
  // 如果移除前缀后字符串为空，返回空字符串
  if (!result) return '';
  
  // 处理连字符或下划线命名：van-button -> button, van_cell_group -> cellGroup
  result = result.replace(/[-_\s]+(.)/g, (_, char) => char.toUpperCase());
  
  // 确保首字母大写（大驼峰格式）
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// export default function VitePluginChenVantAutoImport(options)
module.exports = async function (options) {
  // 动态导入 ES 模块
  const { parse, compileTemplate } = await import('vue/compiler-sfc');
  const { kebabCase } = await import('lodash-es');
  const { default: MagicString } = await import('magic-string');

  // 自动处理vant组件的导入逻辑
  function autoImportVantComponents(code){
    // 保存转换后的代码字符串
    let transformCodeStr = code;
    // 保存通过ast 抽象语法树解析后得到的vant组件名称数组
    let vantComponentNames = [];
    
    // 使用Vue编译器解析Vue单文件组件
    let res = parse(code);
    // 检查Vue组件是否有模板部分
    if(res.descriptor.template.content){
      // 编译模板，获取AST（抽象语法树）
      let templateRes = compileTemplate({
        source: res.descriptor.template.content,
        id: Date.now() + '' // 生成唯一的组件ID
      });
      // 如果AST中存在组件信息，提取Vant组件 (这里的作用是：为了拿到vant组件的名称 比如：[ 'van-button', 'van-cell-group' ])
      if(templateRes.ast.components) {
        // vantComponentNames 从 [ 'van-button', 'van-cell-group' ] 转换成 [ 'Button', 'CellGroup' ]
        vantComponentNames = templateRes.ast.components.filter(item => {
          // 过滤出以van- | Van | van开头的组件名称
          return item.startsWith("van-") || item.startsWith("van") || item.startsWith("Van");
        }).map(item => {
          // [ 'van-button', 'van-cell-group' ] 转换成 [ 'Button', 'CellGroup' ]
          // 下面convertVanString函数的作用：考虑VanButton、 vanButton, van-button,这三种写法都要转换成： Button
          return convertVanString(item);
        }).filter(Boolean);
      }
    };

    // 如果没有检测到Vant组件，直接返回原代码
    if(vantComponentNames.length <= 0){
      return transformCodeStr;
    };

    // vantComponentNames 数组去重
    vantComponentNames = [...new Set(vantComponentNames)];

    //  添加vant 组件的 js 和 css 导入语句
    let vantImportCssJsStr = vantComponentNames.map(item => {
      let importJsStr = `import Van${item} from 'vant/es/${kebabCase(item)}/index.mjs';`;
      let importCssStr = `import 'vant/es/${kebabCase(item)}/style';`;
      return '\n' + importJsStr + '\n' + importCssStr;
    }).join("\n");

    // 获取script setup部分的原始内容
  let setupOriginContent = res.descriptor.scriptSetup?.content;
   // 如果文件中没有写<script setup lang="ts"> 语法，则需要加上
   if(!setupOriginContent) {
    // 如果不存在script setup，创建一个新的script setup标签并插入导入语句(script 标签加到头部)
    transformCodeStr = `<script setup lang="ts">${vantImportCssJsStr}</script>` + transformCodeStr;
   }else {
     // 如果存在script setup，将导入语句t替换插入到script setup标签中
     transformCodeStr = transformCodeStr.replace(setupOriginContent, `${vantImportCssJsStr}\n${setupOriginContent}`);
   }  
    return transformCodeStr;
  };

  const filterReg = /\.vue/;
  let viteConfig = null;
  
  return {
    name:'vite-plugin-chen-vant-auto-import', // 插件名称

    // 配置解析完成后调用，用于存储最终解析的整个项目的配置，返回的参数是一个对象格式
    configResolved(_config) {
      // 存储最终解析的配置
      viteConfig = _config;
    },
    
    /**
     * 转换钩子函数，在每个传入模块请求时被调用, 处理Vue文件
     * @param {string} code - 源代码
     * @param {string} id - 文件ID（包含完整路径）
     * @param {Object} opt - 转换选项
     * @returns {Object} - 转换结果，包含code和source map
     */
    transform(code, id, opt) {
      if(!filterReg.test(id)){
        return {
          code,
          map: null
        }
      };
      // 检查代码中是否包含Vant组件，只支持大驼峰、小驼峰、短横线命名法
      if(!/van-[a-zA-Z0-9-]+/.test(code)){
        return {
          code,
          map: null
        };
      };

      // 下面逻辑处理vant组件的自动导入逻辑
      const newCode = autoImportVantComponents(code);

      let resultCode = {
        code: newCode,
        map: null
      };
      // 如果启用了source map，生成source map
      if (viteConfig.build.sourcemap) {
        let ms = new MagicString(newCode);
        resultCode.map = ms.generateMap({ hires: true })
      }
      return resultCode;
    },
    // 确保在其他插件之前执行,这样才能拿到还没转换前的vant代码
    enforce: 'pre'
  }
}