<template>
  <header class="site-header" :class="{ 'is-open': menuOpen }">
    <GradualBlur
      position="right"
      width="9rem"
      :strength="3"
      :div-count="7"
      curve="bezier"
      :exponential="true"
      :z-index="0"
    />

    <nav class="navbar" aria-label="主导航">
      <NuxtLink :to="localePath('/')" class="header-brand" :aria-label="t('header.home')">
        <span class="brand-rotor">
          <span class="brand-name">MICROPUE</span>
          <span class="brand-product-clip">
            <span class="brand-product">Tools</span>
          </span>
        </span>
      </NuxtLink>

      <div class="nav-actions">
        <span class="perf-toggle" :title="t('header.performance')">
          <i class="pi pi-bolt" aria-hidden="true" />
          <span class="perf-switch">
            <ToggleSwitch v-model="perf" :aria-label="t('header.performance')" />
          </span>
        </span>

        <Button
          class="lang-trigger"
          icon="pi pi-globe"
          rounded
          text
          severity="secondary"
          :aria-label="t('header.language')"
          @click="toggleLangMenu"
        />
        <Menu ref="langMenu" :model="langItems" popup />

        <a class="github-link" :href="githubUrl" target="_blank" rel="noopener noreferrer">
          <i class="pi pi-github" aria-hidden="true" />
          <span class="github-text">
            <span class="github-stars">{{ starLabel }}</span>
          </span>
        </a>
      </div>
    </nav>
  </header>

  <button
    class="menu-toggle"
    type="button"
    :aria-label="menuOpen ? t('header.closeMenu') : t('header.openMenu')"
    :aria-expanded="menuOpen"
    @click="menuOpen = !menuOpen"
  >
    <i class="pi" :class="menuOpen ? 'pi-angle-right' : 'pi-angle-left'" aria-hidden="true" />
  </button>

  <main>
    <slot />
  </main>
</template>

<script setup lang="ts">
const githubUrl = 'https://github.com/Micropue/micropue-tools-service'

const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocale = useLocaleSwitch()
const perf = usePerformanceMode()
const menuOpen = ref(false)

const langMenu = ref<{ toggle: (event: Event) => void } | null>(null)

const langItems = computed(() =>
  locales.value.map(item => ({
    label: item.name,
    icon: item.code === locale.value ? 'pi pi-check' : undefined,
    command: () => switchLocale(item.code)
  }))
)

function toggleLangMenu(event: Event) {
  langMenu.value?.toggle(event)
}

const { data } = await useFetch<{ stars: number | null }>('/api/github/star')

// 拿不到星数时退回仓库名文案；数量按语言做复数与紧凑格式
const starLabel = computed(() => {
  const count = data.value?.stars
  if (count == null) return 'GitHub'

  const form = new Intl.PluralRules(locale.value).select(count)
  const number = new Intl.NumberFormat(locale.value, { notation: 'compact', maximumFractionDigits: 1 }).format(count)
  return t(`header.stars.${form}`, { count: number })
})
</script>

<style lang="scss" scoped>
.site-header {
  // 右侧纵向工具条：浮在内容之上，模糊层从右向左淡出
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 50;

  width: 76px;
  display: flex;
  justify-content: center;

  a {
    text-decoration: none;
  }

  // 模糊层不改变明暗，垫一层极淡的主题色渐变保证文字对比
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 9rem;
    background: linear-gradient(
      to left,
      color-mix(in srgb, var(--p-content-background) 70%, transparent),
      color-mix(in srgb, var(--p-content-background) 28%, transparent) 45%,
      transparent
    );
    pointer-events: none;
  }

  .navbar {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0 24px;
  }

  .header-brand {
    position: relative;
    flex: none;
    width: 100%;
    height: 260px;
    color: inherit;
    font-size: 2.4em;
  }

  // 以左端（视觉上的顶端）为锚点，名字展开时只把 Tools 往下推
  .brand-rotor {
    position: absolute;
    left: 50%;
    top: 16px;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    transform-origin: 0 0;
    transform: rotate(90deg) translateY(-50%);
  }

  // 默认只露 Tools；hover 时 MICROPUE 横向展开（旋转后即向下生长）
  .brand-name {
    display: inline-block;
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    opacity: 0;
    transition:
      max-width 900ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 420ms ease 260ms;
  }

  .header-brand:hover .brand-name,
  .header-brand:focus-visible .brand-name {
    max-width: 6em;
    opacity: 1;
  }

  .brand-product {
    display: inline-block;
    font-family: 'Dancing Script';
  }

  .brand-product-clip {
    display: inline-block;
    margin-left: 0.5em;
    clip-path: inset(-0.5em -0.5em -0.5em 0);
  }

  .nav-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .perf-toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    width: 100%;
    color: var(--p-text-muted-color);

    .pi {
      font-size: 1.15rem;
    }
  }

  .perf-switch {
    position: relative;
    display: block;
    width: 100%;
    height: 46px;

    :deep(.p-toggleswitch) {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }

  .lang-trigger {
    width: 36px;
    height: 36px;

    :deep(.p-button-icon) {
      font-size: 1.15rem;
    }
  }

  // GitHub 图标保持正向，星数文字旋转 90° 竖排（省横向空间）
  .github-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    border-radius: 999px;
    color: var(--p-text-muted-color);
    transition: color 0.15s, background 0.15s;

    .pi {
      font-size: 1.35rem;
    }

    &:hover,
    &:focus-visible {
      color: var(--p-text-color);
      background: color-mix(in srgb, var(--p-text-color) 8%, transparent);
    }
  }

  .github-text {
    position: relative;
    display: block;
    width: 100%;
    height: 46px;
  }

  .github-stars {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    font-size: 10px;
    line-height: 1;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  @media screen and (max-width: 700px) {
    // 窄屏：默认收起到屏幕外，由右上角按钮唤出
    width: 64px;
    transform: translateX(100%);
    visibility: hidden;
    transition:
      transform 340ms cubic-bezier(0.22, 1, 0.36, 1),
      visibility 0s linear 340ms;

    &.is-open {
      transform: none;
      visibility: visible;
      transition: transform 340ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .navbar {
      padding: 64px 0 18px;
    }

    .header-brand {
      height: 210px;
      font-size: 1.8em;

      .brand-name {
        display: none;
      }
    }

  }
}

.menu-toggle {
  display: none;
}

@media screen and (max-width: 700px) {
  // 贴右上角的正方形按钮，仅左下角圆角
  .menu-toggle {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 60;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 1px solid var(--p-content-border-color);
    border-top: 0;
    border-right: 0;
    border-radius: 0 0 0 14px;
    background: color-mix(in srgb, var(--p-content-background) 88%, transparent);
    backdrop-filter: blur(10px);
    color: var(--p-text-color);
    font: inherit;
    cursor: pointer;
    transition: background-color 0.18s ease;

    .pi {
      font-size: 1.8rem;
      line-height: 1;
      transition: transform 0.18s ease;
    }

    &:hover,
    &:focus-visible {
      background: var(--p-content-background);
    }

    &:hover .pi,
    &:focus-visible .pi {
      transform: scale(1.12);
    }

    &:active .pi {
      transform: scale(0.92);
    }
  }
}
</style>
