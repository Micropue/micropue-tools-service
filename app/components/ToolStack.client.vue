<script setup lang="ts">
import { categories, tools, type Tool, type ToolCategory } from '~/data/tools'

interface CardItem {
  tool: Tool
  category: ToolCategory
}

const props = defineProps<{ start?: boolean }>()

const DECK_SIZE = 30
const SNAP_DELAY = 150

function pickCards(count: number): CardItem[] {
  const pool = [...tools]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
  }
  return pool.slice(0, count).map(tool => ({
    tool,
    category: categories.find(c => c.code === tool.category) ?? { code: '00', name: 'Misc' }
  }))
}

const cards = pickCards(Math.min(DECK_SIZE, tools.length))
const total = cards.length

const progress = ref(0)
const entered = ref(false)

let target = 0
let raf = 0
let lastFrame = 0
let lastInput = 0
let pointerId = -1
let dragStartY = 0
let dragStartTarget = 0

const visible = computed(() => {
  const at = progress.value
  const list: { card: CardItem; d: number; focus: number }[] = []
  for (let i = 0; i < total; i++) {
    let d = i - at
    d = ((d % total) + total) % total
    if (d > total / 2) d -= total
    list.push({
      card: cards[i]!,
      d,
      focus: Math.max(0, 1 - Math.abs(d) / 0.42)
    })
  }
  return list
})

// 与 CSS 里的 --card-h / --step 保持一致
const stepPx = () => {
  const card = Math.min(window.innerHeight * 0.56, window.innerWidth * 0.78, 560)
  return card * 0.1
}

function frame(now: number) {
  raf = 0
  if (!lastFrame) lastFrame = now
  const dt = Math.min(64, now - lastFrame)
  lastFrame = now

  // 停手后滑向最近的整数卡位（惯性收尾）
  if (now - lastInput > SNAP_DELAY) {
    const snap = Math.round(target)
    target += (snap - target) * Math.min(1, dt / 110)
  }
  progress.value += (target - progress.value) * Math.min(1, dt / 80)

  if (Math.abs(target - progress.value) < 0.0004) {
    progress.value = target = Math.round(target)
    lastFrame = 0
    return
  }
  raf = requestAnimationFrame(frame)
}

function kick() {
  if (!entered.value || raf) return
  lastFrame = 0
  raf = requestAnimationFrame(frame)
}

function onWheel(e: WheelEvent) {
  if (!entered.value) return
  e.preventDefault()
  const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
  const delta = Math.max(-220, Math.min(220, e.deltaY * unit))
  target += delta / 220
  lastInput = performance.now()
  kick()
}

function onPointerDown(e: PointerEvent) {
  if (!entered.value || e.button > 0) return
  pointerId = e.pointerId
  dragStartY = e.clientY
  dragStartTarget = target
  lastInput = performance.now()
  ;(e.target as HTMLElement | null)?.setPointerCapture?.(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerId !== pointerId) return
  const dy = e.clientY - dragStartY
  if (Math.abs(dy) > 3) e.preventDefault()
  target = dragStartTarget - dy / stepPx()
  progress.value = target
  lastInput = performance.now()
  kick()
}

function onPointerUp(e: PointerEvent) {
  if (e.pointerId !== pointerId) return
  pointerId = -1
  lastInput = performance.now()
  kick()
}

function onKeydown(e: KeyboardEvent) {
  if (!entered.value) return
  const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown'
  const prev = e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp'
  if (!next && !prev) return
  e.preventDefault()
  target = Math.round(target) + (next ? 1 : -1)
  lastInput = performance.now()
  kick()
}

let startTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.start,
  value => {
    if (!value || entered.value) return
    startTimer = setTimeout(() => {
      entered.value = true
      kick()
    }, 60)
  },
  { immediate: true }
)

onMounted(() => {
  // 滚轮挂到 window：卡片之间大面积是背景图，滚轮也应切换卡片
  window.addEventListener('wheel', onWheel, { passive: false })
})

onBeforeUnmount(() => {
  clearTimeout(startTimer)
  window.removeEventListener('wheel', onWheel)
  if (raf) cancelAnimationFrame(raf)
  raf = 0
})
</script>

<template>
  <div
    class="tool-stack"
    :class="{ 'is-in': entered }"
    role="region"
    aria-roledescription="card stack"
    aria-label="Tools"
    tabindex="0"
    @keydown="onKeydown"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div
      v-for="entry in visible"
      :key="entry.card.tool.name"
      class="tool-card"
      :style="{
        '--d': entry.d,
        '--ad': Math.abs(entry.d),
        '--focus': entry.focus,
        '--delay': `${Math.min(Math.abs(entry.d), 6) * 80 + 120}ms`,
        zIndex: Math.round(1000 - Math.abs(entry.d) * 20)
      }"
    >
      <div class="tool-card__inner">
        <span class="tool-card__label tool-card__label--top">{{ entry.card.tool.name }}</span>
        <span class="tool-card__label tool-card__label--bottom">{{ entry.card.tool.name }}</span>

        <div class="tool-card__detail">
          <div class="tool-card__head">
            <span class="tool-card__code">{{ entry.card.category.code }}</span>
            <span class="tool-card__category">{{ entry.card.category.name }}</span>
          </div>
          <div class="tool-card__body">
            <h2 class="tool-card__name">{{ entry.card.tool.name }}</h2>
            <p class="tool-card__desc">{{ entry.card.tool.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.tool-stack {
  --card-h: min(56vh, 78vw, 560px);
  --step: calc(var(--card-h) * 0.1);

  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  outline: none;
  /* 只让卡片本身接事件，背景大屏的 hover / 拖拽保持可用 */
  pointer-events: none;
}

.tool-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--card-h);
  height: var(--card-h);
  transform: translate(-50%, -50%) translateY(calc(var(--d) * var(--step))) scale(calc(1 - var(--ad) * 0.045));
  transform-origin: 50% 50%;
  will-change: transform;
  pointer-events: auto;
  touch-action: none;
}

.tool-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 55%, transparent);
  border-radius: 3px;
  background: color-mix(in srgb, var(--p-content-background) 97%, transparent);
  box-shadow: 0 26px 60px -34px rgba(0, 0, 0, 0.5);
}

/* 入场：从底部居中逐个升起 */
.tool-stack:not(.is-in) .tool-card__inner {
  opacity: 0;
  transform: translateY(64vh) scale(0.72);
}

.tool-stack.is-in .tool-card__inner {
  animation: tool-card-rise 1000ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--delay);
}

@keyframes tool-card-rise {
  from {
    opacity: 0;
    transform: translateY(64vh) scale(0.72);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 叠放时只露出工具名（顶部/底部都可能露） */
.tool-card__label {
  position: absolute;
  left: calc(var(--card-h) * 0.06);
  max-width: 78%;
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--p-text-muted-color);
  opacity: calc(1 - var(--focus));
}

.tool-card__label--top {
  top: calc(var(--card-h) * 0.03);
}

.tool-card__label--bottom {
  bottom: calc(var(--card-h) * 0.028);
}

/* 居中时才展开类别 / 名称 / 介绍 */
.tool-card__detail {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(var(--card-h) * 0.06);
  opacity: var(--focus);
}

.tool-card__head {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.tool-card__code {
  font-size: calc(var(--card-h) * 0.2);
  font-weight: 800;
  line-height: 0.78;
  letter-spacing: -0.035em;
  color: #efa3ae;
}

.tool-card__category {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.tool-card__name {
  margin: 0;
  font-size: calc(var(--card-h) * 0.072);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--p-text-color);
}

.tool-card__desc {
  margin: 0.55rem 0 0;
  max-width: 27ch;
  font-size: 13px;
  line-height: 1.45;
  color: var(--p-text-muted-color);
}

@media (prefers-reduced-motion: reduce) {
  .tool-stack.is-in .tool-card__inner {
    animation: none;
  }

  .tool-stack:not(.is-in) .tool-card__inner {
    opacity: 1;
    transform: none;
  }
}
</style>
