# vue-core 项目开发指南

> 本文档用于帮助AI理解项目结构，进行代码开发和维护

## 项目概述

**vue-core** 是一个基于 Vue3 + Vite 的个人组件库和演示项目，包含了大量的自定义组件、AI功能集成、地图组件、图表组件等。

- **项目类型**: Vue3 组件库演示项目
- **包管理器**: pnpm
- **UI框架**: Element Plus (PC端) + Vant (移动端)
- **构建工具**: Vite 6.x

## 快速开始

\\ash

# 安装依赖

pnpm install

# 启动开发服务器 (端口: 8088)

pnpm dev

# 生产构建

pnpm build

# 构建体积分析

pnpm build:analyze

## 项目目录结构

\vue-core/
├── src/
│   ├── ai-lib/                    # AI大语言模型相关库
│   │   ├── ai-api-keys/          # API密钥管理
│   │   ├── ai-llm/               # LLM实现
│   │   │   ├── llm-no-stream/    # 非流式请求
│   │   │   └── llm-stream/       # 流式请求
│   │   └── llm.ts                # LLM初始化入口
│   ├── assets/                    # 静态资源
│   ├── axios-request/             # axios二次封装 (已发布到npm @cjc/axios)
│   ├── components/                # 自定义组件库
│   │   ├── dom-resize-observer/   # DOM尺寸监听
│   │   ├── gaode-map/            # 高德地图组件
│   │   ├── image-skeleton/       # 图片骨架屏
│   │   ├── list-scroll-intersectionObserver/  # 列表滚动交叉观察
│   │   ├── list-scroll-lazy-loading/  # 列表滚动懒加载
│   │   ├── scaleConfig/          # 缩放配置
│   │   ├── vue3-basemap-mapboxgl/ # MapboxGL底图组件
│   │   ├── vue3-echarts/         # PC端ECharts组件
│   │   ├── vue3-echarts-mobile/  # 移动端ECharts组件
│   │   ├── vue3-loading/         # Loading组件 (PC+Mobile)
│   │   └── watermark/            # 水印组件
│   ├── events/                    # 事件总线
│   ├── global/                    # 全局配置
│   │   ├── js/
│   │   │   ├── echarts.ts        # ECharts按需引入
│   │   │   └── request.ts        # 请求全局配置
│   │   └── style/                # 全局样式
│   ├── hooks/                     # 自定义Hooks
│   ├── layout/                    # 布局组件
│   ├── network/                   # 网络请求
│   ├── router/                    # 路由配置
│   ├── types/                     # TypeScript类型定义
│   ├── utils/                     # 工具函数
│   ├── views/                     # 页面视图
│   ├── zebra/                     # 工具函数库
│   ├── App.vue
│   ├── main.js                    # 应用入口
│   └── style.css
├── config/                        # 环境配置文件
│   ├── .env.base                  # 开发环境
│   └── .env.pro                   # 生产环境
├── directives/                    # 自定义指令
├── plugin/                        # Vite插件源码
├── public/                        # 公共静态资源
├── vite.config.ts                 # Vite配置
├── tsconfig.json                  # TypeScript配置
└── package.json
\

## 核心依赖说明

### UI框架

- **element-plus**: PC端UI组件库
- **vant**: 移动端UI组件库
- **@icon-park/vue-next**: IconPark图标库
- **@iconify/vue**: Iconify在线图标

### 数据可视化

- **echarts**: 数据可视化图表库
- **@cjc/vue3-echarts**: PC端ECharts封装
- **@cjc/vue3-echarts-mobile**: 移动端ECharts封装

### 地图相关

- **@cjc/gaode-map**: 高德地图组件
- **@cjc/vue3-basemap-mapboxgl**: MapboxGL底图组件
- **mapbox-gl**: MapboxGL地图库

### 网络请求

- **axios**: HTTP客户端
- **@cjc/axios**: 二次封装的axios（带loading、取消请求等）
- **qs**: URL查询字符串解析

### AI相关

- 支持流式和非流式LLM请求
- 集成讯飞语音识别
- 集成RAGFlow知识库

### 工具库

- **lodash-es**: 工具函数库
- **dayjs**: 日期处理库
- **mitt**: 事件总线
- **uuid**: UUID生成
- **crypto-js**: 加密库

### 其他功能

- **v3-drag-zoom**: 拖拽缩放组件
- **@v3e/vue3-draggable-resizable**: 可拖拽可调整大小组件
- **vue-defer**: Vue组件懒渲染
- **vue-markdown-render**: Markdown渲染

## Vite插件配置

项目使用了大量自定义Vite插件（已发布到 @cjc 命名空间下）：
// vite.config.ts 中使用的插件

- @cjc/vite-plugin-chen-clear-console-alert-debug  // 清除console/alert/debugger
- @cjc/vite-plugin-chen-vant-auto-import           // Vant自动导入
- @cjc/vite-plugin-chen-icon-park-auto-import      // IconPark自动导入
- @cjc/vite-plugin-console                         // 控制台输出插件
- @cjc/vite-plugin-lib-static-import               // 库静态导入
- @cjc/vite-plugin-cjc-svg-icons                   // SVG图标处理
- vite-plugin-purge-icons                          // Iconify图标按需加载
- vite-plugin-md                                   // Markdown支持
- vite-svg-loader                                  // SVG加载器
- vite-bundle-analyzer                             // 构建体积分析

## 路由系统

### 路由配置位置

- \src/router/index.js\: 路由入口
- \src/router/config/commonRouter.ts\: 通用组件路由
- \src/router/config/echartsRouter.ts\: 图表路由
- \src/router/config/mapRouter.ts\: 地图路由
- \src/router/config/AIRouter.ts\: AI功能路由
- \src/router/config/plugin.ts\: 插件路由

### 路由模式

- 使用 \createWebHashHistory()\ Hash模式

### 菜单系统

- 顶部菜单分为5个分类：**组件、图表、地图、AI、vite插件**
- 侧边菜单根据顶部选中菜单动态变化
- 菜单逻辑在 \src/layout/components/useMenu.ts

## 核心功能模块详解

### 1. 请求封装 (@cjc/axios)

**配置位置**: \src/global/js/request.ts
**主要功能**:

- 全局请求前缀配置
- 自动loading显示/隐藏
- 请求取消机制
- 支持form/json两种数据格式
- 全局请求数据（globalData）
- 支持上传文件
- 支持静态文件读取

**使用示例**:
\\	typescript
import request from '@cjc/axios';

// GET请求
const res = await request.get({
url: '/api/data',
data: { id: 1 },
loading: true,
context: domRef  // 局部loading
});

// POST请求
const res = await request.post({
url: '/api/save',
data: formData,
contentType: 'json'
});

// 取消请求
const cancelId = Symbol('request');
request.post({ url: '/api', cancelId });
request.cancel(cancelId);
\

### 2. AI大语言模型模块

**入口文件**: \src/ai-lib/llm.ts
**核心类**:

- \LLMNoStream\: 非流式请求
- \LLMStream\: 流式请求（SSE）
- \AIMsgHandler\: AI消息处理器

**API密钥配置**: \src/ai-lib/ai-api-keys/api-keys.ts
**支持模型**:

- DeepSeek系列
- 豆包（Doubao）系列
- GLM系列

### 3. Loading组件

**PC端**: \@cjc/vue3-loading\ (基于Element Plus)
**移动端**: \@cjc/vue3-mobile-loading\ (基于Vant)

**全局配置**:
\\	typescript
import { configLoading } from '@cjc/axios';
import Loading from '@cjc/vue3-loading';
configLoading(Loading);
\

### 4. 水印组件

**位置**: \src/components/watermark/**演示页面**: \src/views/comp/watermark/
**功能**:

- Canvas绘制水印
- 支持自定义文字、颜色、透明度
- 防移除保护

### 5. 列表懒加载

**位置**: \src/components/list-scroll-lazy-loading/**演示页面**: \src/views/comp/list-lazyLoading/
**功能**:

- 滚动到底部自动加载
- IntersectionObserver实现
- 支持自定义加载状态

### 6. 表格滚动优化

**位置**: \src/components/scroll-table/**功能**:

- el-table滚动增强
- 虚拟滚动优化
- 固定表头/列

### 7. ECharts组件

**PC端**: \src/components/vue3-echarts/**移动端**: \src/components/vue3-echarts-mobile/
**功能**:

- 自适应容器大小
- 字体大小响应式
- 按需引入ECharts模块

### 8. 地图组件

#### 高德地图

**位置**: \src/components/gaode-map/**功能**:

- 地图图层管理
- 点标记、线、面绘制
- 地图事件封装

#### MapboxGL

**位置**: \src/components/vue3-basemap-mapboxgl/**功能**:

- 底图切换
- 瓦片图层管理
- 弹窗组件
- 地图控制工具

### 9. 拖拽功能

**相关组件**:

- \vue3-drag-zoom\: 图片/内容拖拽缩放
- \@v3e/vue3-draggable-resizable\: 可拖拽可调整大小组件
- \src/hooks/use-draggable.ts\: 自定义拖拽Hook

## 开发规范

### 组件开发规范

1. **组件文件结构**:
   \   component-name/
   ├── index.vue       # 组件入口
   ├── README.md       # 组件文档（可选）
   └── components/     # 子组件（可选）
   \
2. **页面演示路由**:

   - 在对应router配置文件中添加路由
   - meta.name 为菜单显示名称
   - meta.headerMenu 为顶部菜单分类
3. **使用 @ 别名**:
   \\	ypescript
   import xxx from '@/components/xxx';
   \

### 网络请求规范

1. **API定义位置**: 组件同级目录下的 \pi.js\ / \pi.ts2. **请求方式**: 统一使用 \@cjc/axios3. **Loading控制**: 根据场景选择全局/局部loading
2. **取消请求**: 页面切换时自动取消，重要请求设置 \cancel: false

### 样式规范

1. 使用 Less 预处理器
2. 全局样式在 \src/global/style/\ 中
3. 组件样式使用 scoped
4. 布局样式在 \layout.less\ 中统一管理

## 环境变量配置

**配置文件位置**: \config/.env.*
\\ash

# 基础路径

VITE_BASE_PATH = /

# 接口前缀（用于proxy转发）

VITE_API_BASEPATH=/industry-brain-api/v8/test
VITE_BASE_URL = https://baoshe.sutpc.com

# RAGFlow配置

VITE_API_RAGFOLW_BASEPATH=/ragflow-basepath
VITE_RAGFOLW_URL = http://192.168.7.129/api/v1
VITE_RAGFOLW_API_KEY = ragflow-xxx
VITE_RAGFOLW_CHAT_ID = xxx

# 应用标题

VITE_APP_TITLE = vue3-core核心组件

**Proxy配置**: 在 \vite.config.ts\ 的 \server.proxy\ 中配置

## 构建与部署

### 构建命令

\\ash

# 普通构建

pnpm build

# 带体积分析的构建

pnpm build:analyze
\

### 构建输出

- 输出目录: \dist/- SourceMap: 已开启

## 私有npm包说明

项目大量使用了作者发布的私有npm包（@cjc命名空间）：

\@cjc/axios                              # 请求封装
@cjc/dom-resize-observer                # DOM尺寸监听
@cjc/ellipsis-text                      # 文本省略组件
@cjc/gaode-map                          # 高德地图组件
@cjc/hooks                              # Hooks集合
@cjc/image-skeleton                     # 图片骨架屏
@cjc/list-scroll-lazy-loading           # 列表懒加载
@cjc/scaleConfig                        # 缩放配置
@cjc/scroll-table                       # 滚动表格
@cjc/vite-plugin-chen-clear-console-alert-debug
@cjc/vite-plugin-chen-icon-park-auto-import
@cjc/vite-plugin-cjc-svg-icons
@cjc/vite-plugin-console
@cjc/vite-plugin-lib-static-import
@cjc/vue3-basemap-mapboxgl              # MapboxGL组件
@cjc/vue3-data-container                 # 数据容器组件
@cjc/vue3-echarts                        # PC端ECharts
@cjc/vue3-echarts-mobile                 # 移动端ECharts
@cjc/vue3-loading                        # PC端Loading
@cjc/vue3-mobile-loading                 # 移动端Loading
@cjc/vue3-plate-number                   # 车牌输入组件
@cjc/vue3-svg-icon                       # SVG图标组件
@cjc/zebra                                # 工具函数库
@cjc/vite-plugin-chen-vant-auto-import   # Vant自动导入
\

## 常见问题与解决方案

### 1. 私有npm包安装失败

确保已配置正确的npm源（阿里云私有仓库）。参考 \README.md\ 中的配置说明。

### 2. Loading不显示

检查是否在 \src/global/js/request.ts\ 中调用了 \configLoading(Loading)\。

### 3. 组件样式问题

- 确认全局样式文件已正确引入
- 检查Less变量是否正确配置
- 确认Element Plus主题是否一致

### 4. 地图组件加载失败

- 检查高德地图Key是否配置
- 检查MapboxGL Token是否配置
- 确认网络环境是否能访问地图服务

## 文件修改指引

### 添加新组件

1. 在 \src/components/\ 下创建组件目录
2. 在 \src/views/comp/\ 下创建演示页面
3. 在 \src/router/config/commonRouter.ts\ 中添加路由配置
4. 设置 meta.headerMenu 为 '组件' 或其他分类

### 添加新的AI功能

1. 在 \src/ai-lib/\ 下添加相关实现
2. 在 \src/views/AI/\ 下创建演示页面
3. 在 \src/router/config/AIRouter.ts\ 中添加路由

### 修改全局配置

- 请求配置: \src/global/js/request.ts- 样式配置: \src/global/style/- 环境变量: \config/.env.*- Vite配置: \ite.config.ts
