# MICROPUE Tools

[micropue 工具箱](https://tools.micropue.com.cn) 的站点源码：Nuxt 4 + PrimeVue 4，黑白（Noir）主题、多语言、右侧纵向导航。

> 部署相关的服务器地址、进程与 Nginx 配置放在本地 `DEPLOY.md`（已在 `.gitignore` 中，不随仓库推送）。

## 技术栈

- **Nuxt 4.6** / Vue 3.5 / vue-router 5
- **PrimeVue 4.5** + `@primevue/nuxt-module`，主题基于 `@primeuix/themes`（Aura → Noir）
- **@nuxtjs/i18n 10**：英语 / 中文 / 日语 / 俄语
- **ogl**（WebGL）：FlexCarousel、RippleDistortion
- **GSAP 3.15 + SplitText**：首页标题逐词遮罩动画
- **SCSS**（sass-embedded）

## 功能

- **右侧纵向导航**：旋转 90° 的 `MICROPUE Tools` 字标、语言弹出菜单、GitHub 星数、性能模式开关；≤700px 收起为右上角抽屉按钮。
- **首页**：FlexCarousel 照片背景（自动轮播、随机图、鼠标跟随透镜）+ 左下角 TOOLS 文案（SplitText `mask: "words"` 逐词升起）+ 字体就绪前的全屏加载蒙层。
- **性能模式**：开关写入 cookie `micropue-perf`，关闭后卸载照片墙（释放 WebGL），刷新保持。
- **多语言**：`/` 默认英文，`/zh`、`/ja`、`/ru`；语言选择写入 cookie `micropue-locale`，再次访问 `/` 会回到上次语言。
- **错误页**：`app/error.vue` 统一处理所有 HTTP 错误码。
- **黑白主题**：`app/assets/themes/noir.ts`，跟随系统深浅色。

## 目录结构

```
app/
  app.vue                     # NuxtLayout + NuxtPage + html lang
  error.vue                   # 全站错误页
  layouts/default.vue         # 右侧纵向导航、加载蒙层
  pages/index.vue             # 首页（照片墙背景 + TOOLS 文案）
  components/
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
  data/tools.ts               # 工具假数据
i18n/locales/{en,zh,ja,ru}.json
server/api/github/star.get.ts # GitHub 星数（1 小时缓存）
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
- PrimeVue 在开发模式下偶发 hydration mismatch 警告（组件生成 ID 导致），不影响生产显示。
- 仓库未包含部署脚本与服务器信息，部署说明见本地 `DEPLOY.md`。
