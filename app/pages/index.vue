<script setup lang="ts">
const appReady = useState('app-ready', () => false)
const perf = usePerformanceMode()
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl).replace(/\/+$/, '')

useHead(() => ({
  title: 'MICROPUE Tools',
  meta: [
    { name: 'description', content: `${t('home.tagline1')} ${t('home.tagline2')}` },
    { property: 'og:title', content: 'MICROPUE Tools' },
    { property: 'og:description', content: `${t('home.tagline1')} ${t('home.tagline2')}` },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${siteUrl}${localePath('/')}` }
  ],
  link: [
    { rel: 'canonical', href: `${siteUrl}${localePath('/')}` },
    ...['', '/zh', '/ja', '/ru'].map(prefix => ({
      rel: 'alternate',
      hreflang: prefix === '' ? 'en' : prefix.slice(1),
      href: prefix === '' ? `${siteUrl}/` : `${siteUrl}${prefix}`
    })),
    { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/` }
  ]
}))

const seed = () => Math.random().toString(36).slice(2, 10)
const items = useState('home-photos', () =>
  Array.from({ length: 12 }, (_, index) => ({
    src: `https://picsum.photos/seed/${seed()}/1200/900`,
    alt: `Placeholder image ${index + 1}`
  }))
)

const copyRef = ref<HTMLElement | null>(null)
let split: { words: Element[]; revert: () => void } | null = null
let started = false

async function play() {
  if (started) return
  started = true

  const el = copyRef.value
  if (!el) return

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    el.style.opacity = '1'
    return
  }

  const [{ default: gsap }, { SplitText }] = await Promise.all([import('gsap'), import('gsap/SplitText')])
  gsap.registerPlugin(SplitText)

  split = SplitText.create(el, { type: 'words', mask: 'words' })
  gsap.set(el, { opacity: 1 })
  gsap.set(split.words, { yPercent: 120 })
  gsap.to(split.words, {
    yPercent: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.06
  })
}

onMounted(() => {
  if (appReady.value) play()
})

watch(appReady, value => {
  if (value) play()
})

onBeforeUnmount(() => {
  split?.revert()
  split = null
})
</script>

<template>
  <section class="home">
    <div v-if="perf" class="bg">
      <FlexCarousel
        :items="items"
        preset="ribbon"
        intro="rise"
        fit="natural"
        :card-height="0.8"
        :gap="0"
        :radius="0"
        :lens-width="0.85"
        :lens-height="0.8"
        :tilt="0"
        :roundness="1"
        :bend="0.34"
        :reach="0.34"
        curl="twist"
        :dispersion="2"
        :liquid="0"
        follow-cursor
        :squeeze="0.4"
        :focus-on-click="false"
        :autoplay="true"
        :interval="5"
        :captions="false"
        :capture-wheel="true"
        :draggable="false"
      />
    </div>

    <div class="scrim" aria-hidden="true" />

    <div class="topbar">
      <NuxtLink :to="localePath('/tools')" class="home-button" :aria-label="t('tools.title')">
        <i class="pi pi-home" aria-hidden="true" />
      </NuxtLink>
      <ToolSearch />
    </div>

    <div ref="copyRef" class="hero-copy">
      <h1 class="title">TOOLS</h1>
      <p class="tagline">{{ t('home.tagline1') }}</p>
      <p class="tagline">{{ t('home.tagline2') }}</p>
    </div>
  </section>
</template>

<style scoped>
.home {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
}

.bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.topbar {
  position: absolute;
  top: clamp(14px, 3vh, 28px);
  left: clamp(20px, 4vw, 56px);
  right: 96px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 10px;
}

.home-button {
  display: grid;
  flex: none;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--p-content-background) 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--p-text-color);
  text-decoration: none;
  transition: border-color 0.15s, background-color 0.15s;
}

.home-button:hover,
.home-button:focus-visible {
  border-color: color-mix(in srgb, var(--p-text-color) 38%, transparent);
  background: color-mix(in srgb, var(--p-content-background) 94%, transparent);
}

.home-button .pi {
  font-size: 0.95rem;
}

@media screen and (max-width: 700px) {
  .topbar {
    right: 70px;
  }
}

/* 文字可读性渐变 */
.scrim {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  height: 46vh;
  background: linear-gradient(
    to top,
    var(--p-content-background) 0%,
    color-mix(in srgb, var(--p-content-background) 70%, transparent) 38%,
    transparent 100%
  );
  pointer-events: none;
}

.hero-copy {
  position: absolute;
  left: clamp(20px, 4vw, 56px);
  bottom: clamp(24px, 5vh, 64px);
  z-index: 2;
  text-align: left;
  opacity: 0;
}

.title {
  margin: 0 0 0.7rem;
  font-size: clamp(64px, 13vw, 220px);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: 0.02em;
  color: var(--p-text-color);
}

.tagline {
  margin: 0;
  font-size: clamp(14px, 1.1vw, 20px);
  line-height: 1.55;
  color: var(--p-text-muted-color);
}

/* SplitText 的单词遮罩会按字宽裁切，负字距会让 S 的右缘被切掉，补一点右侧空间 */
.title :deep(div[style*='overflow: clip']) {
  padding-right: 0.08em;
  margin-right: -0.08em;
}

@media (max-width: 700px) {
  .scrim {
    height: 52vh;
  }

  /* 窄屏把背景横条整体旋转 90°，避免卡片被压扁 */
  .bg {
    inset: auto;
    top: 50%;
    left: 50%;
    width: 100svh;
    height: 100vw;
    transform: translate(-50%, -50%) rotate(90deg);
  }
}
</style>
