import fg from 'fast-glob';
import getEtag from 'etag';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'pathe';
import SVGCompiler from 'svg-baker';
import { optimize } from 'svgo';
import { normalizePath } from 'vite';
import nodePath from 'path';
import nodeFs from 'fs';
const root = process.cwd();

const SVG_ICONS_REGISTER_NAME = "virtual:svg-icons-register";
const SVG_ICONS_CLIENT = "virtual:svg-icons-names";
const SVG_DOM_ID = "__svg__icons__dom__";
const XMLNS = "http://www.w3.org/2000/svg";
const XMLNS_LINK = "http://www.w3.org/1999/xlink";

// 动态扫描项目中所有包含 svgs文件夹的目录,这是我自己添加的功能
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
      const items = nodeFs.readdirSync(currentPath)
      for (const item of items) {
        if (shouldExclude(item)) continue
        const fullPath = nodePath.join(currentPath, item)
        const stat = nodeFs.statSync(fullPath)
        if (stat.isDirectory()) {
          if (item === 'svgs') {
            // 验证该目录确实包含 SVG 文件
            const svgFiles = nodeFs.readdirSync(fullPath).filter(file => 
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
};

function createSvgIconsPlugin(opt) {
  const cache = /* @__PURE__ */ new Map();
  let isBuild = false;
  const options = {
    svgoOptions: true,
    symbolId: 'icon-[name]', // 指定symbolId格式
    inject: "body-last",
    customDomId: SVG_DOM_ID,
    iconDirs: findAllSvgsDirectoriesWithFilter(root), // 动态扫描项目中所有包含 svgs文件夹的目录
    ...opt
  };
  let { svgoOptions } = options;
  const { symbolId } = options;
  if (!symbolId.includes("[name]")) {
    throw new Error("SymbolId must contain [name] string!");
  }
  if (svgoOptions) {
    svgoOptions = typeof svgoOptions === "boolean" ? {} : svgoOptions;
  }
  return {
    name: "vite:svg-icons",
    configResolved(resolvedConfig) {
      isBuild = resolvedConfig.command === "build";
    },
    resolveId(id) {
      if ([SVG_ICONS_REGISTER_NAME, SVG_ICONS_CLIENT].includes(id)) {
        return id;
      }
      return null;
    },
    async load(id, ssr) {
      if (!isBuild && !ssr)
        return null;
      const isRegister = id.endsWith(SVG_ICONS_REGISTER_NAME);
      const isClient = id.endsWith(SVG_ICONS_CLIENT);
      if (ssr && !isBuild && (isRegister || isClient)) {
        return `export default {}`;
      }
      const { code, idSet } = await createModuleCode(cache, svgoOptions, options);
      if (isRegister) {
        return code;
      }
      if (isClient) {
        return idSet;
      }
    },
    configureServer: ({ middlewares }) => {
      middlewares.use(cors({ origin: "*" }));
      middlewares.use(async (req, res, next) => {
        const url = normalizePath(req.url);
        const registerId = `/@id/${SVG_ICONS_REGISTER_NAME}`;
        const clientId = `/@id/${SVG_ICONS_CLIENT}`;
        if ([clientId, registerId].some((item) => url.endsWith(item))) {
          res.setHeader("Content-Type", "application/javascript");
          res.setHeader("Cache-Control", "no-cache");
          const { code, idSet } = await createModuleCode(cache, svgoOptions, options);
          const content = url.endsWith(registerId) ? code : idSet;
          res.setHeader("Etag", getEtag(content, { weak: true }));
          res.statusCode = 200;
          res.end(content);
        } else {
          next();
        }
      });
    },
    // 处理入口文件，添加虚拟模块导入,这是我自己添加的功能!
    transform(code, id) {
      // 只处理main.ts / main.js文件
      if (!id.endsWith('main.ts') && !id.endsWith('main.js')) {
        return code;
      }
      // 在入口文件注册vite-plugin-svg-icons插件虚拟模块，用于引入svg图标
      // import 'virtual:svg-icons-register'; 
      let virtualStr = `import 'virtual:svg-icons-register'; \n`;
      code = virtualStr + code;
      return code;
      
    }
  };
}
async function createModuleCode(cache, svgoOptions, options) {
  const { insertHtml, idSet } = await compilerIcons(cache, svgoOptions, options);
  const xmlns = `xmlns="${XMLNS}"`;
  const xmlnsLink = `xmlns:xlink="${XMLNS_LINK}"`;
  const html = insertHtml.replace(new RegExp(xmlns, "g"), "").replace(new RegExp(xmlnsLink, "g"), "");
  const code = `
       if (typeof window !== 'undefined') {
         function loadSvg() {
           var body = document.body;
           var svgDom = document.getElementById('${options.customDomId}');
           if(!svgDom) {
             svgDom = document.createElementNS('${XMLNS}', 'svg');
             svgDom.style.position = 'absolute';
             svgDom.style.width = '0';
             svgDom.style.height = '0';
             svgDom.id = '${options.customDomId}';
             svgDom.setAttribute('xmlns','${XMLNS}');
             svgDom.setAttribute('xmlns:link','${XMLNS_LINK}');
           }
           svgDom.innerHTML = ${JSON.stringify(html)};
           ${domInject(options.inject)}
         }
         if(document.readyState === 'loading') {
           document.addEventListener('DOMContentLoaded', loadSvg);
         } else {
           loadSvg()
         }
      }
        `;
  return {
    code: `${code}
export default {}`,
    idSet: `export default ${JSON.stringify(Array.from(idSet))}`
  };
}
function domInject(inject = "body-last") {
  switch (inject) {
    case "body-first":
      return "body.insertBefore(svgDom, body.firstChild);";
    default:
      return "body.insertBefore(svgDom, body.lastChild);";
  }
}
async function compilerIcons(cache, svgOptions, options) {
  const { iconDirs } = options;
  let insertHtml = "";
  const idSet = /* @__PURE__ */ new Set();
  for (const dir of iconDirs) {
    const svgFilsStats = fg.sync("**/*.svg", {
      cwd: dir,
      stats: true,
      absolute: true
    });
    for (const entry of svgFilsStats) {
      const { path: path2, stats: { mtimeMs } = {} } = entry;
      const cacheStat = cache.get(path2);
      let svgSymbol;
      let symbolId;
      let relativeName = "";
      const getSymbol = async () => {
        relativeName = normalizePath(path2).replace(normalizePath(dir + "/"), "");
        symbolId = createSymbolId(relativeName, options);
        svgSymbol = await compilerIcon(path2, symbolId, svgOptions);
        idSet.add(symbolId);
      };
      if (cacheStat) {
        if (cacheStat.mtimeMs !== mtimeMs) {
          await getSymbol();
        } else {
          svgSymbol = cacheStat.code;
          symbolId = cacheStat.symbolId;
          symbolId && idSet.add(symbolId);
        }
      } else {
        await getSymbol();
      }
      svgSymbol && cache.set(path2, {
        mtimeMs,
        relativeName,
        code: svgSymbol,
        symbolId
      });
      insertHtml += `${svgSymbol || ""}`;
    }
  }
  return { insertHtml, idSet };
}
async function compilerIcon(file, symbolId, svgOptions) {
  if (!file) {
    return null;
  }
  let content = fs.readFileSync(file, "utf-8");
  if (svgOptions) {
    const { data } = await optimize(content, svgOptions);
    content = data || content;
  }
  content = content.replace(/stroke="[a-zA-Z#0-9]*"/, 'stroke="currentColor"');
  const svgSymbol = await new SVGCompiler().addSymbol({
    id: symbolId,
    content,
    path: file
  });
  return svgSymbol.render();
}
function createSymbolId(name, options) {
  const { symbolId } = options;
  if (!symbolId) {
    return name;
  }
  let id = symbolId;
  let fName = name;
  const { fileName = "", dirName } = discreteDir(name);
  if (symbolId.includes("[dir]")) {
    id = id.replace(/\[dir\]/g, dirName);
    if (!dirName) {
      id = id.replace("--", "-");
    }
    fName = fileName;
  }
  id = id.replace(/\[name\]/g, fName);
  return id.replace(path.extname(id), "");
}
function discreteDir(name) {
  if (!normalizePath(name).includes("/")) {
    return {
      fileName: name,
      dirName: ""
    };
  }
  const strList = name.split("/");
  const fileName = strList.pop();
  const dirName = strList.join("-");
  return { fileName, dirName };
}

export { compilerIcon, compilerIcons, createModuleCode, createSvgIconsPlugin, createSymbolId, discreteDir };
