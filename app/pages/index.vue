<script setup lang="ts">
import { tools } from '~/data/tools'

// 每次打开页面随机换一批占位图（picsum seed → 固定图片，随机 seed 保证每次不同）
const seed = () => Math.random().toString(36).slice(2, 10)
const items = Array.from({ length: 12 }, (_, index) => ({
  src: `https://picsum.photos/seed/${seed()}/1200/900`,
  alt: `Placeholder image ${index + 1}`
}))

const perf = usePerformanceMode()

// 背景单独控制挂载与淡出：关闭高性能时先透明淡出，再卸载释放 WebGL
const bgMounted = ref(perf.value)
const bgHidden = ref(!perf.value)
let hideTimer: ReturnType<typeof setTimeout> | undefined

watch(perf, async value => {
  clearTimeout(hideTimer)
  if (value) {
    bgMounted.value = true
    await nextTick()
    requestAnimationFrame(() => {
      bgHidden.value = false
    })
  } else {
    bgHidden.value = true
    hideTimer = setTimeout(() => {
      bgMounted.value = false
    }, 1000)
  }
})

const wheelItems = tools.map(tool => tool.name)
const narrow = ref(false)

onBeforeUnmount(() => clearTimeout(hideTimer))

onMounted(() => {
  const mq = window.matchMedia('(max-width: 700px)')
  const sync = () => {
    narrow.value = mq.matches
  }
  sync()
  mq.addEventListener('change', sync)
  onBeforeUnmount(() => mq.removeEventListener('change', sync))
})
</script>

<template>
  <section class="hero">
    <div v-if="bgMounted" class="bg-layer" :class="{ 'is-hidden': bgHidden }">
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

    <!-- 临时占位面板：卡片暂时隐藏；关闭高性能模式时铺满全屏 -->
    <div class="glass-panel" :class="{ 'glass-panel--full': !perf }">
      <div class="panel-inner">
        <div class="panel-left">
          <OptionWheel
            :items="wheelItems"
            :default-selected="0"
            text-color="var(--p-text-muted-color)"
            active-color="var(--p-text-color)"
            side="left"
            :font-size="narrow ? 1.2 : 2.4"
            :spacing="1.5"
            :curve="0.9"
            :tilt="5"
            :blur="perf ? 1.5 : 0.7"
            :fade="perf ? 0.22 : 0.1"
            :min-opacity="perf ? 0.05 : 0.1"
            :smoothing="220"
            :inset="narrow ? 16 : 26"
            :loop="true"
            :draggable="true"
            sound-url="/sounds/click-soft.wav"
            :sound-volume="0.4"
          />
        </div>
        <!-- 右侧待定 -->
        <div class="panel-right" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-layer {
  position: absolute;
  inset: 0;
  opacity: 1;
  transition: opacity 1000ms linear;
}

.bg-layer.is-hidden {
  opacity: 0;
}

.hero {
  position: relative;
  height: 100svh;
  min-height: 480px;
  overflow: hidden;
}

.glass-panel {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 50%;
  overflow: hidden;
  background-color: color-mix(in srgb, var(--p-content-background) 90%, transparent);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-top: 0.3px solid color-mix(in srgb, var(--p-text-color) 22%, transparent);
  border-bottom: 0.3px solid color-mix(in srgb, var(--p-text-color) 22%, transparent);
  transition:
    height 600ms cubic-bezier(0.22, 1, 0.36, 1) 800ms,
    background-color 600ms ease 800ms;
}

.panel-inner {
  width: 100%;
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(380px, 30%) 1fr;
  transition: grid-template-columns 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

.panel-left {
  position: relative;
  min-width: 0;
  height: 100%;
}

/* 不让滚轮在分栏边缘切出竖直断口：横向溢出交给外层面板裁剪 */
.panel-left :deep(.option-wheel) {
  overflow: visible;
}

.panel-right {
  min-width: 0;
  height: 100%;
}

/* 低性能模式（面板铺满）时，滚轮区域加宽，露出更多内容 */
@media screen and (min-width: 701px) {
  .glass-panel--full .panel-inner {
    grid-template-columns: minmax(400px, 40%) 1fr;
  }
}

@media screen and (max-width: 700px) {
  .panel-inner {
    grid-template-columns: 46% 1fr;
  }
}

/* 高性能关闭（无照片墙）时，从半屏长条长成整屏 */
.glass-panel--full {
  height: 100%;
  /* 没有照片做背景时，用反向色薄涂层和页面底色拉开区分 */
  background-color: color-mix(in srgb, var(--p-text-color) 12%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .glass-panel {
    transition: none;
  }
}
</style>
