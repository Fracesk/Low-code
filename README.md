# Low Code Page Builder (低代码页面编辑器)

一个基于 Vue 3 的拖拽式低代码页面编辑器。支持组件拖拽、容器嵌套、属性编辑、撤销重做和 HTML 导出。

## 功能特性

- **拖拽式组件搭建** — 从侧边栏拖拽组件到画布，自由组合页面布局
- **5 种基础组件** — 文本、按钮、图片、容器（支持嵌套）、表单
- **组件属性编辑** — 选中后右侧面板实时编辑组件属性
- **容器嵌套** — 容器内支持拖入子组件，flex 布局排列
- **撤销/重做** — Ctrl+Z / Ctrl+Shift+Z，支持 50 步历史记录
- **HTML 导出** — 一键导出为独立 HTML 文件，零外部依赖
- **Web Worker 布局** — 网格布局在 Worker 线程计算，主线程不阻塞
- **虚拟滚动** — 组件面板 1000+ 列表项流畅滚动

## 技术栈

| 技术 | 用途 |
|---|---|
| **Vue 3** (Composition API + `<script setup>`) | 前端框架 |
| **TypeScript** (strict mode) | 类型安全 |
| **Pinia** | 状态管理 |
| **Vite** | 构建工具 |
| **Web Worker** | 布局计算 |
| 零外部 UI 库依赖 | — |

## 快速开始

```bash
# 克隆仓库
git clone <repo-url>
cd low-code

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查 + 生产构建
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
low-code/
├── index.html                    # HTML 入口
├── vite.config.ts                # Vite 配置
├── tsconfig*.json                # TypeScript 配置
├── src/
│   ├── main.ts                   # 应用入口
│   ├── App.vue                   # 根布局（三栏）
│   ├── style.css                 # 全局样式重置
│   ├── stores/
│   │   └── canvas.ts             # Pinia store（组件状态 + 撤销/重做）
│   ├── types/
│   │   └── schema.ts             # TypeScript 类型定义
│   ├── components/
│   │   ├── ComponentPanel.vue    # 组件面板（虚拟滚动 + 拖拽源）
│   │   ├── Canvas.vue            # 画布（拖放目标 + 布局 + 工具栏）
│   │   ├── ComponentRenderer.vue # 递归组件渲染器（5 种组件交互）
│   │   └── PropertyPanel.vue     # 属性编辑面板
│   ├── utils/
│   │   └── exportHtml.ts         # HTML 导出模块
│   └── workers/
│       └── layout.worker.ts      # 网格布局 Web Worker
└── README.md
```

## 技术架构

```
┌──────────────┬──────────────┬──────────────┐
│ 左侧面板      │   画布区域    │  属性面板     │
│ ComponentPanel│   Canvas     │ PropertyPanel│
│ (固定 280px)  │ (flex: 1)    │ (条件显示)   │
└──────────────┴──────────────┴──────────────┘
```

**数据流：**

1. **拖拽** → ComponentPanel `dragstart` 设置 `component-type`
2. **放置** → Canvas `drop` 读取类型 → `store.addComponent(type)`
3. **布局** → 监听 `components.length` → `postMessage` 到 Worker → 接收绝对定位坐标
4. **渲染** → ComponentRenderer 根据坐标和类型递归渲染组件
5. **编辑** → 选中组件 → PropertyPanel 编辑属性 → `updateComponent` 实时更新
6. **撤销** → 每次 mutation 前深克隆快照 → Ctrl+Z 恢复历史状态

## 技术亮点

### 撤销/重做

- 在 Pinia store 中维护 `history` / `future` 两个栈
- 每次 mutation（添加/删除/更新/容器操作）前自动深克隆快照
- 最多 50 步历史记录，新操作清空重做栈
- Ctrl+Z 撤销，Ctrl+Shift+Z 重做，输入框中不拦截
- 撤销/重做后自动清除选中和编辑状态，避免悬空引用

### HTML 导出

- 递归遍历组件树，每个组件生成内联样式 HTML
- 支持全部 5 种组件类型和容器嵌套
- 导出完整 HTML 文档（DOCTYPE + meta + 全局样式）
- 零外部依赖，导出的文件可独立在浏览器打开
- 使用 Blob + URL.createObjectURL 触发下载

### Web Worker 布局

- 3 列网格布局在 Worker 线程计算
- Worker 加载失败时自动降级到主线程计算
- 布局输入数据使用 `JSON.parse(JSON.stringify(...))` 深克隆，避免 Proxy 序列化问题

### 虚拟滚动

- 纯手写虚拟滚动（无第三方库）
- 根据 `scrollTop` 和 `containerHeight` 计算可见范围
- 前后各 5 项 overscan，保证快速滚动时无空白
- 组件列表扩展到 1000+ 项以演示效果

## 后续规划

- 页面模板与预设布局
- 组件复制/粘贴
- 响应式设计预览
- 更多组件类型（视频、表格、图表）
- 多页面管理
- 拖拽对齐辅助线
