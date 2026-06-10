# 🚀 AI 兼职规划助手 (Side Hustle Smart Planner)

> **大模型赋能的智能副业路径规划与避坑实操指南**  
> 💡 纯前端自适应实现 | 数据本地持久化保护 | 多供应商模型支持 | 精美毛玻璃双色主题

AI 兼职规划助手是一款专为寻求“第二曲线”的用户设计的智能化副业规划平台。用户只需输入自身的**性格特点、业余时间、技能特长、期望收益及特定限制条件**，系统即可通过先进的大语言模型，量身定制出 3 个**合规、可落地的副业行动方案**，并匹配实操平台与避坑预警。

---

## 🌟 核心功能亮点

1. **多 API 账号及模型配置文件管理 (Multi-profile API Manager)**
   - 支持在运行态中添加、修改、删除并随意切换多个不同的 API 配置。
   - 内置一键“**测试接口连接**”工具，提供网络加载动画及详尽的 HTTP 错误返回码调试盒，免去配置失误的烦恼。
2. **协议智能隐式路由 (Implicit Protocol Routing)**
   - 移除繁琐的“接口提供商”选择。系统自动判断您填写的基地址（Base URL）或模型名称：
     - 若包含 `generativelanguage` 或 `gemini`，则底层智能适配 **Google Gemini** 原生请求格式。
     - 其他情况（如 DeepSeek、通义千问、智谱等）自动适配标准的 **OpenAI Chat Completions** 协议。
3. **免 Key 极速体验 (High-fidelity Mock Mode)**
   - 默认启用系统内置的模拟引擎。无需配置 API 密钥，即可根据您的表单输入动态生成高度拟真的 3 个兼职方案（文科生特长推荐自媒体运营、工科生推荐网页开发外包等）。
4. **数据隐私与绝对安全 (100% Client-side Data Privacy)**
   - 纯前端离线运行，所有的 API 密钥、保存的历史规划、已收藏的副业卡片均**仅且直接**存储在您浏览器本地的 `localStorage` 中，不经过任何第三方服务器。
5. **精心重构的明暗毛玻璃主题 (Dual Glassmorphic Themes)**
   - **暗黑极客风**：炫酷的渐变边框、发光核心动画、雾面卡片，充满科技感。
   - **明亮轻氧风**：深度修复文字对比度，重新绘制输入控件与 Timeline 时间轴，确保在亮色下依然具备清晰的边界和高级质感。

---

## 🛠️ 技术栈清单

- **核心框架**：Vue 3.5+ (Composition API)
- **状态管理**：Pinia 3.0+
- **构建工具**：Vite 8.0+
- **类型安全**：TypeScript 6.0+ (启用 `verbatimModuleSyntax` 严谨模块规范)
- **样式设计**：Vanilla CSS 3.0+ (自适应弹性盒布局、毛玻璃特效、CSS 变量覆盖)
- **图标系统**：Lucide Vue Next
- **包管理器**：pnpm 10.14+

---

## 🚀 快速开始

在本地进行开发或部署，您需要确保机器上安装了 [Node.js (18+)](https://nodejs.org/) 以及 [pnpm](https://pnpm.io/) 包管理器。

### 1. 安装项目依赖
```bash
pnpm install
```

### 2. 启动本地开发服务器
```bash
pnpm dev
```
启动后，在浏览器中打开控制台输出的本地端口（通常是 [http://localhost:5173](http://localhost:5173)）即可开始体验。

### 3. 项目构建打包
```bash
pnpm build
```
这将在根目录下生成 `dist/` 静态文件夹。您可以将该文件夹部署到 Vercel、Netlify、GitHub Pages 或您自己的 Nginx 服务器，完全无需购买后端数据库云服务器。

### 4. 预览打包结果
```bash
pnpm preview
```

---

## ⚙️ 环境变量配置 (.env)

为了方便开发或一键部署，本助手支持通过根目录下的 `.env` 文件预设默认模型。您可以参考项目中的 [.env.example](file:///.env.example) 文件创建 `.env`：

```env
# 大模型接口基地址 (例如 OpenAI 使用 https://api.openai.com/v1)
VITE_TEXT_GENERATION_BASE_URL=https://api.deepseek.com

# 您的大模型 API Key 密钥
VITE_TEXT_GENERATION_API_KEY=your_api_key_here

# 默认使用的模型名称 (例如 deepseek-chat)
VITE_TEXT_GENERATION_MODEL=deepseek-chat

```

> **💡 环境变量加载逻辑**：
> 当用户首次打开页面（本地浏览器缓存为空）时，Pinia 状态库会自动读取并检测 `.env` 配置。若发现有填写的 `VITE_TEXT_GENERATION_API_KEY`，会自动创建名为 **“环境变量默认配置”** 的卡片并设为激活态，实现无缝登录与调用。

---

## 📁 目录结构树

```text
├── src/
│   ├── assets/         # 静态资源
│   ├── components/     # 公共组件
│   │   ├── HistoryPanel.vue         # 历史规划边栏/卡片
│   │   ├── PlannerForm.vue          # 三步表单填写向导
│   │   ├── RecommendationCards.vue  # 3 个推荐卡片（含实操与避坑）
│   │   └── SettingsModal.vue        # 多配置 API 密钥/测试连接弹窗
│   ├── services/       # 业务服务类
│   │   └── gemini.ts                # 封装 Gemini 与 OpenAI 双通道 Fetch 通信及 Mock 数据
│   ├── stores/         # 状态管理
│   │   └── settings.ts              # Pinia API 配置共享状态与加载逻辑
│   ├── views/          # 视图页面
│   │   └── HomeView.vue             # 兼职规划助手主视图
│   ├── types/          # TS 类型定义
│   │   └── index.ts                 # 接口与配置数据格式
│   ├── App.vue         # App 壳组件（仅负责头部/尾部/弹窗外框挂载）
│   ├── main.ts         # 入口引导文件
│   └── style.css       # 统一设计系统与主题样式表
├── .env                # 激活的本地环境配置
├── .env.example        # 环境变量模板
├── package.json        # 依赖与脚本
└── tsconfig.json       # TS 配置
```

---

## 🛡️ 隐私与安全承诺
我们深知 API Key 的机密性。AI 兼职规划助手承诺：
- 🚫 **无后端收集**：没有配备任何第三方中转服务器，您的 Key 绝不会被上传。
- 🔒 **本地加密安全**：数据仅在浏览器本地运行及加密存储。如果您清空浏览器缓存或卸载网页，所有的密钥数据将会立即全部抹除。
