# GitHub Issues 博客

一个基于 GitHub Issues 的简洁博客系统，使用 Next.js 构建，支持 SSG（静态站点生成）。

## 功能特性

- 📝 基于 GitHub Issues 的内容管理
- 🚀 SSG（静态站点生成）提供极快的加载速度
- 📱 响应式设计，支持各种设备
- 🎨 使用 Tailwind CSS 的简洁美观界面
- 📄 支持 Markdown 格式的文章内容
- 🔄 构建时自动获取最新文章

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/sedationh/blog.git
cd blog
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置 GitHub

#### 3.1 创建 GitHub Personal Access Token

1. 访问 [GitHub Settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token"
3. 选择权限：
   - 对于公共仓库：选择 `public_repo`
   - 对于私有仓库：选择 `repo`
4. 复制生成的 token

#### 3.2 配置环境变量

复制环境变量示例文件：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，填入你的 GitHub token：

```bash
GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_OWNER=<your-github-username>
GITHUB_REPO=<your-repo-name>
```

#### 3.3 配置仓库信息

编辑 `src/lib/github.ts` 文件，将以下占位符替换为你的实际仓库信息：

```typescript
const GITHUB_CONFIG = {
  owner: process.env.GITHUB_OWNER || 'sedationh',    // 替换为你的 GitHub 用户名
  repo: process.env.GITHUB_REPO || 'blog',          // 替换为你的仓库名
  token: process.env.GITHUB_TOKEN || '<your-github-token>',
}
```

### 4. 运行项目

#### 开发模式

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看博客。

#### 生产构建

```bash
pnpm build
pnpm start
```

## 使用说明

### 发布文章

1. 在你配置的 GitHub 仓库中创建新的 Issue
2. Issue 标题将作为文章标题
3. Issue 内容支持 Markdown 格式
4. 重新构建网站以获取最新文章

### 文章管理

- **编辑文章**：直接编辑对应的 GitHub Issue
- **删除文章**：关闭对应的 GitHub Issue
- **文章排序**：按照 Issue 创建时间倒序排列

### 页面说明

- **首页** (`/`)：显示所有文章列表 - `src/app/page.tsx`
- **文章详情** (`/detail/[id]`)：显示单篇文章内容，其中 `id` 是 GitHub Issue 的编号 - `src/app/detail/[id]/page.tsx`
- **404页面** (`/not-found`)：处理不存在的页面 - `src/app/not-found.tsx`

## 项目结构

```
blog/
├── src/
│   ├── app/                 # App Router 页面目录
│   │   ├── page.tsx         # 首页 - 文章列表
│   │   ├── detail/[id]/     # 文章详情页（动态路由）
│   │   │   └── page.tsx
│   │   ├── layout.tsx       # 根布局
│   │   ├── not-found.tsx    # 404 页面
│   │   └── globals.css      # 全局样式
│   └── lib/
│       └── github.ts        # GitHub API 工具函数
├── public/                  # 静态资源
├── env.example              # 环境变量示例
└── README.md               # 项目说明
```

## 技术栈

- **框架**：Next.js 15 (App Router)
- **样式**：Tailwind CSS 4
- **Markdown 渲染**：react-markdown
- **TypeScript**：完整类型支持
- **渲染模式**：SSG（静态站点生成）
- **数据获取**：直接在组件中使用 async/await

## 自定义配置

### 修改样式

项目使用 Tailwind CSS，你可以：

1. 修改 `src/app/page.tsx` 和 `src/app/detail/[id]/page.tsx` 中的样式类
2. 在 `src/app/globals.css` 中添加自定义 CSS
3. 配置 `tailwind.config.js`（如需要）

### 添加新功能

- **分页**：修改 `getAllIssues` 函数添加分页支持
- **标签系统**：使用 GitHub Issue 标签进行分类
- **搜索功能**：添加客户端搜索或使用 GitHub API 搜索
- **评论系统**：利用 GitHub Issue 评论功能

### 部署建议

#### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 在 Vercel 环境变量中配置 `GITHUB_TOKEN`
4. 部署完成

#### Netlify

1. 构建命令：`pnpm build`
2. 发布目录：`out`
3. 在环境变量中配置 `GITHUB_TOKEN`

#### 其他平台

确保支持 Node.js 和静态文件托管即可。

## 常见问题

### Q: GitHub API 请求频率限制怎么办？

A: 使用 Personal Access Token 可以获得每小时 5000 次的请求限制，对于大多数博客来说足够了。

### Q: 如何支持私有仓库？

A: 在创建 GitHub Token 时选择 `repo` 权限而不是 `public_repo`。

### Q: 文章没有更新怎么办？

A: 由于使用 SSG，需要重新构建网站才能获取最新内容。可以设置 webhook 自动触发构建。

### Q: 如何自定义 Markdown 样式？

A: 修改 `src/app/detail/[id]/page.tsx` 中 ReactMarkdown 的 `components` 配置。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
