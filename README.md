# MICROPUE Tools

[micropue 工具箱](https://tools.micropue.com.cn) 的站点源码：Nuxt 4 + PrimeVue 4，黑白（Noir）主题、多语言、右侧纵向导航。

> 部署相关的服务器地址、进程与 Nginx 配置放在本地 `DEPLOY.md`（已在 `.gitignore` 中，不随仓库推送）。

## 技术栈

- **Nuxt 4.6** / Vue 3.5 / vue-router 5
- **PrimeVue 4.5** + `@primevue/nuxt-module`，主题基于 `@primeuix/themes`（Aura → Noir）
- **@nuxtjs/i18n 10**：英语 / 中文 / 日语 / 俄语
- **工具依赖**：js-yaml、js-beautify、terser、marked、DOMPurify、qrcode-generator、jsQR、JsBarcode、fflate、exifr
- **ogl**（WebGL）：FlexCarousel、RippleDistortion
- **GSAP 3.15 + SplitText**：首页标题逐词遮罩动画
- **SCSS**（sass-embedded）

## 功能

- **右侧纵向导航**：旋转 90° 的 `MICROPUE Tools` 字标、语言弹出菜单、GitHub 星数、性能模式开关；≤700px 收起为右上角抽屉按钮。
- **首页**：FlexCarousel 照片背景（自动轮播、随机图、鼠标跟随透镜）+ 左下角 TOOLS 文案（SplitText `mask: "words"` 逐词升起）+ 字体就绪前的全屏加载蒙层。
- **性能模式**：开关写入 cookie `micropue-perf`，关闭后卸载照片墙（释放 WebGL），刷新保持。
- **多语言**：`/` 默认英文，`/zh`、`/ja`、`/ru`；语言选择写入 cookie `micropue-locale`，再次访问 `/` 会回到上次语言。工具名称、描述和分类均已翻译。
- **工具索引**：`/tools` 以分类卡片网格展示全部 108 个工具，支持分类筛选；`/tools/<slug>` 为具体工具页，左侧分类列表、右侧工具界面，右上角有搜索框。
- **搜索**：支持按 `/` 或点击搜索框内的斜杠图标聚焦；搜索会同时匹配中、英、日、俄四种语言的工具名称和描述。
- **已实现工具**：文本、开发、图片、单位转换、数学、二维码/条码、文件、浏览器、时间、设计、安全共 108 个，全部在浏览器本地运行。图片/二维码/文件类使用 Canvas、Web Crypto、jsQR、JsBarcode、fflate、exifr 等浏览器端库。
- **国际化的工具文案**：四个语言文件都包含 `categories`、`toolNames`、`toolDescriptions`；工具界面中的通用操作（复制、清空、下载、生成）走 i18n，工具专属参数标签暂为英文。
- **SEO**：每个工具页有独立 title/description/canonical/hreflang（标题与描述按语言本地化）；`/sitemap.xml` 覆盖 4 种语言 × 110 个页面（440 条 URL），`robots.txt` 指向 sitemap。
- **错误页**：`app/error.vue` 统一处理所有 HTTP 错误码。
- **黑白主题**：`app/assets/themes/noir.ts`，跟随系统深浅色。

## 目录结构

```
app/
  app.vue                     # NuxtLayout + NuxtPage + html lang
  error.vue                   # 全站错误页
  layouts/default.vue         # 右侧纵向导航、加载蒙层
  pages/index.vue             # 首页（照片墙背景 + TOOLS 文案）
  pages/tools/[[slug]].vue    # 工具页（左列表 + 右使用区）
  components/
    tools/                    # 108 个工具界面 + 共享控件（QrCanvas、UnitConverter 等）
    FlexCarousel.vue          # 照片墙（Vue Bits 组件，Tailwind 已改为本地 CSS）
    RippleDistortion.vue      # 水波纹（当前未使用，保留）
    ToolStack.client.vue      # 工具卡片栈（当前未使用，保留）
    OptionWheel.vue           # 滚轮选择器（当前未使用，保留）
    GradualBlur.vue           # 顶部/侧边渐变模糊（导航背景）
  assets/
    css/main.scss             # 全局样式（13px 基准字号、字体、工具类）
    fonts/                    # Montserrat / Dancing Script
    themes/noir.ts            # 黑白主题
  composables/
    useLocaleSwitch.ts        # 切换语言 + 写 cookie
    usePerformanceMode.ts     # 性能模式 cookie
  middleware/locale.global.ts # 访问 / 时按 cookie 跳回上次语言
  utils/locale.ts             # 语言 cookie
  data/tools.ts               # 工具目录
  data/reference.ts           # 浏览器类速查表数据
  utils/                      # 文件、图片、随机数、表达式、差分等共享工具
  composables/useToolText.ts  # 工具名称/描述的多语言回退
i18n/locales/{en,zh,ja,ru}.json # 界面文案 + 分类 + 工具名称/描述译文
server/api/github/star.get.ts # GitHub 星数（1 小时缓存）
server/routes/sitemap.xml.ts  # 多语言 + 全工具的 sitemap
public/
  sounds/click-soft.wav       # 点击音效（当前未使用）
```

## 环境要求

- **Node.js**：推荐 24 LTS（Nuxt 4.6 要求 `^22.21 || ^24.11 || >=26`；22.17 会有 unsupported 警告但可运行）
- **pnpm**：10.x（仓库带 `pnpm-lock.yaml`）

## 本地开发

```bash
pnpm install
pnpm dev          # http://localhost:3501（nuxt.config 中 devServer.port=3501，host=0.0.0.0）
```

## 构建

```bash
pnpm build        # 输出到 .output/
pnpm start        # node .output/server/index.mjs
pnpm preview      # 本地预览构建产物
```

## 国际化

- 语言文件在 `i18n/locales/<code>.json`，新增语言时在 `nuxt.config.ts` 的 `i18n.locales` 里添加 `{ code, language, name, file }`（`file` 必填）。
- 默认英文不带前缀；其他语言走 `/<code>`。
- 切换语言用 `useLocaleSwitch()`（自动写 `micropue-locale` cookie 并跳转）。
- 不在首次访问时按浏览器语言跳转，`/` 对未选择过语言的访客固定英文。

## Cookie

| 名称 | 用途 | 有效期 |
| --- | --- | --- |
| `micropue-locale` | 记住语言选择 | 1 年 |
| `micropue-perf` | 性能模式（是否加载照片墙背景） | 1 年 |

## 主题

`app/assets/themes/noir.ts` 基于 Aura，把 `primary` 映射到 `zinc` 灰阶，并改写 ProgressSpinner 的渐变。通过 `nuxt.config.ts` 的 `importTheme` 引入：

```ts
primevue: {
  importTheme: { from: '~/assets/themes/noir', as: 'NoirTheme' }
}
```

注意该模块要求主题文件默认导出 `{ preset }` 形式的 theme 配置（而不是裸 preset），否则样式会渲染成 `undefined`。

## 外部依赖 / 资源

- **图片**：首页照片来自 `picsum.photos`（随机占位图），正式上线建议换成本地 `public/` 资源或自有图床。
- **GitHub 星数**：`/api/github/star` 请求 `api.github.com`，`defineCachedEventHandler` 缓存 1 小时（未认证接口限 60 次/小时）；失败时导航显示 "GitHub"。
- **字体**：Montserrat、Dancing Script 随仓库放在 `app/assets/fonts/`。

## 备注

- 首页当前只展示 TOOLS 文案与照片墙；卡片栈、OptionWheel、RippleDistortion 等组件保留在仓库里，未挂载。
- 时间类工具（倒计时、番茄钟、闹钟）依赖页面保持打开；浏览器休眠或后台节流时无法保证准时触发。
- 仓库未包含部署脚本与服务器信息，部署说明见本地 `DEPLOY.md`。
