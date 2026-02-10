module.exports = async function (options) {
  // 动态导入 ES 模块
  const { parse, compileTemplate } = await import("vue/compiler-sfc");
  const { default: MagicString } = await import("magic-string");

  let configServer = null;
  const filterReg = /\.vue/;

  /**
   * 检测Vue单文件组件字符串中的script标签是否缺少setup属性，并添加
   * @param {string} vueSfcString - Vue单文件组件字符串
   * @returns {string} 修改后的Vue单文件组件字符串
   */
  function addScriptSetup(vueSfcString) {
    // 检查是否存在script标签
    if (!/<script\b/i.test(vueSfcString)) {
      return vueSfcString;
    }

    // 使用正则表达式匹配第一个script标签
    return vueSfcString.replace(
      /<script(\s*)([^>]*)>/i,
      (match, whitespace, attributes) => {
        // 如果已经有setup属性，直接返回
        if (/\bsetup\b/i.test(attributes)) {
          return match;
        }

        // 构建新的script标签
        // 注意：保持script标签的完整性，包括可能的自闭合情况
        if (attributes.trim() === "") {
          return `<script${whitespace}setup>`;
        }

        return `<script${whitespace}setup ${attributes}>`;
      },
    );
  }

  /**
   * 自动引入icon park图标组件
   * @param {*} code vue单文件组件字符串
   * @returns 引入icon park图标组件后的vue单文件组件字符串
   */
  function autoImportIconParkComponents(code) {
    // 代码可能没有写setup标签，需要手动地加上一个setup标签，以便iconpark的包被引入
    let transformedSourceStr = addScriptSetup(code);
    let iconparkComponents = [];

    // 拿到vue解析的文件
    let res = parse(transformedSourceStr);

    // 如果有模版
    if (res.descriptor.template) {
      // 编译模板，获取AST（抽象语法树）
      let templateRes = compileTemplate({
        source: res.descriptor.template.content,
        id: new Date() + "", // 生成唯一的组件ID
      });

      // 从AST中提取所有组件,比如 [i-home]
      let components = templateRes.ast.components;

      iconparkComponents = components.filter((item) => {
          return item.startsWith("i-");
        }).map((item) => {
          let componentName = item.replace("i-", "");
          // 转换为大驼峰命名法
          return componentName.charAt(0).toUpperCase() + componentName.slice(1);
        });
    }

    if (iconparkComponents.length <= 0) {
      return transformedSourceStr;
    };
    // 去重
    iconparkComponents = [...new Set(iconparkComponents)];

    // 生成导入语句
    let importStatements = iconparkComponents.map((item) => {
        let importIconParkComponetStr = `import I${item} from '@icon-park/vue-next/es/icons/${item}';`;
        return importIconParkComponetStr + `\n`;
      }).join("");

    // css 样式只需要生成一次
    let importIconParkCssStr = `import '@icon-park/vue-next/styles/index.css';`;
    importStatements += importIconParkCssStr;

    // 记录原始的script setup内容
    let originContent = res.descriptor.scriptSetup?.content;
    // 如果没有script setup标签，需要创建一个
    if (!res.descriptor.scriptSetup) {
      transformedSourceStr = '<script setup lang="ts">' + importStatements + "\n" + "</script>" + "\n" + transformedSourceStr;
    } else {
      // 如果存在script setup标签，将导入语句替换插入到script setup标签中
      let newScriptSetupContent = importStatements + originContent;
      transformedSourceStr = transformedSourceStr.replace(
        originContent,
        newScriptSetupContent,
      );
    }
    return transformedSourceStr;
  }

  return {
    name: "vite-plugin-chen-icon-park",
    // 插件配置解析完成时调用
    configResolved(_config) {
      configServer = _config;
    },
    // 转换钩子函数，在每个传入模块请求时被调用, 处理Vue文件
    transform(code, id) {
      // 只处理vue文件,其他文件不处理
      if (!filterReg.test(id)) {
        return {
          code,
          map: null,
        };
      };

      let newCode = autoImportIconParkComponents(code);
      let resultCode = {
        code: newCode,
        map: null,
      };

      // 如果启用了source map，生成source map
      if (configServer.build.sourcemap) {
        let ms = new MagicString(newCode);
        resultCode.map = ms.generateMap({ hires: true })
      };
      return resultCode;
    },
    enforce: "pre",
  };
};
