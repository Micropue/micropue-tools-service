<script setup lang="ts">
const { t, locale } = useI18n()

const samples: Record<string, string> = {
  zh: '一等奖\n二等奖\n三等奖\n谢谢参与',
  ja: '1等\n2等\n3等\n参加賞',
  ru: 'Приз A\nПриз B\nПриз C\nПопробуйте ещё'
}

const STORAGE_KEY = 'micropue-wheel-entries-v1'
const entriesText = ref(samples[locale.value] ?? 'Prize A\nPrize B\nPrize C\nTry again')
const canvas = ref<HTMLCanvasElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const rotation = ref(0)
const spinning = ref(false)
const expanded = ref(false)
const isFullscreen = ref(false)
const result = ref('')
const error = ref('')
let frame = 0

const entries = computed(() =>
  entriesText.value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
)

const COLORS = ['#dc2626', '#ea580c', '#ca8a04', '#65a30d', '#16a34a', '#0d9488', '#0891b2', '#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#db2777']
const MAX_ENTRIES = 500
const SIZE = 820
let wheelCache: HTMLCanvasElement | null = null

function labelColor(hex: string) {
  const value = hex.replace('#', '')
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#18181b' : '#ffffff'
}

function fitLabel(ctx: CanvasRenderingContext2D, label: string, maxWidth: number) {
  if (ctx.measureText(label).width <= maxWidth) return label
  const chars = [...label]
  while (chars.length > 1 && ctx.measureText(`${chars.join('')}…`).width > maxWidth) chars.pop()
  return `${chars.join('')}…`
}

function buildWheelCache() {
  const items = entries.value
  if (!items.length) {
    wheelCache = null
    return
  }

  const cache = document.createElement('canvas')
  cache.width = SIZE
  cache.height = SIZE
  const ctx = cache.getContext('2d')
  if (!ctx) return

  const cx = SIZE / 2
  const cy = SIZE / 2
  const radius = SIZE * 0.43
  const segment = (Math.PI * 2) / items.length
  const fontSize = items.length <= 40
    ? Math.min(52, Math.max(30, 64 - items.length * 1.4))
    : 28
  const maxLabelWidth = radius - 100
  const labelStep = items.length <= 40 ? 1 : Math.ceil(items.length / 24)
  const lineWidth = items.length > 160 ? 0.6 : items.length > 80 ? 1.2 : 3

  items.forEach((label, index) => {
    const start = -Math.PI / 2 + index * segment
    const end = start + segment
    const color = COLORS[index % COLORS.length]!

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, radius, start, end)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.82)'
    ctx.lineWidth = lineWidth
    ctx.stroke()

    if (index % labelStep !== 0) return

    const mid = start + segment / 2
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(mid)
    ctx.font = `800 ${fontSize}px system-ui, sans-serif`
    ctx.fillStyle = labelColor(color)
    ctx.textBaseline = 'middle'
    const text = fitLabel(ctx, label, maxLabelWidth)
    if (Math.cos(mid) < 0) {
      ctx.rotate(Math.PI)
      ctx.textAlign = 'left'
      ctx.fillText(text, -(radius - 30), 0)
    } else {
      ctx.textAlign = 'right'
      ctx.fillText(text, radius - 30, 0)
    }
    ctx.restore()
  })

  wheelCache = cache
}

function draw() {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  if (!ctx) return

  const cx = SIZE / 2
  const cy = SIZE / 2
  const radius = SIZE * 0.43
  ctx.clearRect(0, 0, SIZE, SIZE)

  // Dark rim and carnival lights
  ctx.beginPath()
  ctx.arc(cx, cy, radius + 26, 0, Math.PI * 2)
  ctx.fillStyle = '#18181b'
  ctx.fill()

  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2 - Math.PI / 2
    ctx.beginPath()
    ctx.arc(cx + Math.cos(angle) * (radius + 13), cy + Math.sin(angle) * (radius + 13), 6, 0, Math.PI * 2)
    ctx.fillStyle = i % 2 ? '#fbbf24' : '#f87171'
    ctx.fill()
  }

  if (!entries.value.length) {
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fillStyle = '#e4e4e7'
    ctx.fill()
  } else if (wheelCache) {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rotation.value)
    ctx.drawImage(wheelCache, -cx, -cy)
    ctx.restore()
  }

  // Centre hub
  ctx.beginPath()
  ctx.arc(cx, cy, 64, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.lineWidth = 8
  ctx.strokeStyle = '#18181b'
  ctx.stroke()

  // Pointer
  ctx.beginPath()
  ctx.moveTo(cx, cy - radius + 4)
  ctx.lineTo(cx - 26, cy - radius - 44)
  ctx.lineTo(cx + 26, cy - radius - 44)
  ctx.closePath()
  ctx.fillStyle = '#18181b'
  ctx.fill()
  ctx.lineWidth = 4
  ctx.strokeStyle = '#ffffff'
  ctx.stroke()
}

function spin() {
  if (spinning.value) return
  error.value = ''
  const items = entries.value
  if (items.length < 2) {
    error.value = t('wheel.empty')
    return
  }
  if (items.length > MAX_ENTRIES) {
    error.value = t('wheel.tooMany')
    return
  }

  const winner = secureRandomInt(items.length)
  const segment = (Math.PI * 2) / items.length
  const current = rotation.value
  const currentMod = ((current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
  const targetMod = ((Math.PI * 2) - (((winner + 0.5) * segment) % (Math.PI * 2))) % (Math.PI * 2)
  let delta = targetMod - currentMod
  if (delta < 0) delta += Math.PI * 2

  const turns = 6 + secureRandomInt(3)
  const final = current + turns * Math.PI * 2 + delta
  const started = performance.now()
  const duration = 4200
  result.value = ''
  spinning.value = true

  const animate = (now: number) => {
    const progress = Math.min(1, (now - started) / duration)
    const eased = 1 - (1 - progress) ** 4
    rotation.value = current + (final - current) * eased
    draw()
    if (progress < 1) {
      frame = requestAnimationFrame(animate)
      return
    }
    spinning.value = false
    rotation.value = final % (Math.PI * 2)
    result.value = items[winner]!
    draw()
  }

  frame = requestAnimationFrame(animate)
}

function reset() {
  if (spinning.value) return
  rotation.value = 0
  result.value = ''
  error.value = ''
  draw()
}

const fullscreenActive = computed(() => isFullscreen.value || expanded.value)

async function exitFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen().catch(() => {})
    return
  }
  expanded.value = false
}

async function toggleFullscreen() {
  if (document.fullscreenElement) {
    await exitFullscreen()
    return
  }
  const element = stageRef.value as (HTMLElement & { requestFullscreen?: () => Promise<void> }) | null
  if (element?.requestFullscreen) {
    try {
      await element.requestFullscreen()
      expanded.value = false
      return
    } catch {
      // Fall back to the CSS overlay when native fullscreen is unavailable or blocked.
    }
  }
  expanded.value = !expanded.value
  nextTick(draw)
}

function onFullscreenChange() {
  isFullscreen.value = document.fullscreenElement === stageRef.value
  if (isFullscreen.value) expanded.value = false
  nextTick(draw)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && expanded.value) expanded.value = false
}

watch(entriesText, value => {
  if (import.meta.client) {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // Private browsing or a blocked storage quota should not break the wheel.
    }
  }
  if (spinning.value) return
  result.value = ''
  error.value = ''
  rotation.value = 0
  nextTick(() => {
    buildWheelCache()
    draw()
  })
})

watch(expanded, value => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = value ? 'hidden' : ''
  document.body.style.overflow = value ? 'hidden' : ''
  nextTick(draw)
})

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) entriesText.value = saved
    else localStorage.setItem(STORAGE_KEY, entriesText.value)
  } catch {
    // Storage is optional; keep the localized sample when unavailable.
  }
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('fullscreenchange', onFullscreenChange)
  buildWheelCache()
  draw()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  if (document.fullscreenElement === stageRef.value) document.exitFullscreen().catch(() => {})
})
</script>

<template>
  <div class="tool-ui wheel-tool">
    <div class="wheel-layout">
      <div ref="stageRef" class="wheel-stage" :class="{ 'is-fullscreen': expanded }">
        <div v-if="fullscreenActive" class="wheel-fullscreen-bar">
          <span class="tool-label">{{ t('wheel.entries') }} · {{ entries.length }}</span>
          <button
            class="wheel-fullscreen-close"
            type="button"
            :aria-label="t('wheel.exitFullscreen')"
            @click="exitFullscreen"
          >
            <i class="pi pi-times" aria-hidden="true" />
          </button>
        </div>

        <div class="wheel-wrap">
          <canvas ref="canvas" :width="SIZE" :height="SIZE" aria-hidden="true" />
          <button
            class="wheel-center"
            type="button"
            :disabled="spinning"
            :aria-label="spinning ? t('wheel.spinning') : t('wheel.spin')"
            @click="spin"
          >
            {{ spinning ? t('wheel.spinning') : t('wheel.spin') }}
          </button>
        </div>

        <div class="wheel-actions">
          <TButton size="small" :label="t('wheel.spin')" :disabled="spinning" @click="spin" />
          <TButton size="small" severity="secondary" :label="t('wheel.reset')" :disabled="spinning" @click="reset" />
          <TButton
            size="small"
            severity="secondary"
            :label="fullscreenActive ? t('wheel.exitFullscreen') : t('wheel.fullscreen')"
            :aria-pressed="fullscreenActive"
            @click="toggleFullscreen"
          />
        </div>

        <div v-if="result" class="wheel-winner" aria-live="polite">
          <span class="tool-label">{{ t('wheel.result') }}</span>
          <strong>{{ result }}</strong>
          <ToolsCopyButton :text="result" />
        </div>

        <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
        <p class="tool-hint">{{ t('wheel.pick') }}</p>
      </div>

      <div class="wheel-controls">
        <p class="tool-label">{{ t('wheel.entries') }}</p>
        <Textarea
          v-model="entriesText"
          class="tool-textarea"
          rows="14"
          :disabled="spinning"
          :placeholder="t('wheel.placeholder')"
        />
        <div class="tool-actions">
          <span class="tool-hint">{{ t('wheel.count', { count: entries.length }) }}</span>
        </div>
        <p class="tool-hint">{{ t('wheel.hint') }}</p>
        <p v-if="entries.length > 40" class="tool-hint">{{ t('wheel.dense') }}</p>
        <p class="tool-hint">{{ t('wheel.cached') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wheel-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(250px, 0.75fr);
  gap: clamp(1.5rem, 4vw, 2.5rem);
  align-items: start;
}

.wheel-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  min-width: 0;
}

.wheel-wrap {
  position: relative;
  width: min(100%, 540px);
  aspect-ratio: 1;
}

.wheel-wrap canvas {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 24px 38px rgba(0, 0, 0, 0.2));
}

.wheel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  padding: 0.45rem;
  border: 3px solid #18181b;
  border-radius: 50%;
  background: #ffffff;
  color: #18181b;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.15;
  text-align: center;
  cursor: pointer;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.wheel-center:hover:not(:disabled) {
  transform: translate(-50%, -50%) scale(1.05);
}

.wheel-center:disabled {
  cursor: wait;
  opacity: 0.72;
}

.wheel-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.wheel-winner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.55rem 0.8rem;
  width: min(100%, 540px);
  padding: 0.8rem 1rem;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 16%, transparent);
  border-radius: 12px;
  background: linear-gradient(135deg, color-mix(in srgb, #fbbf24 14%, transparent), color-mix(in srgb, #ec4899 10%, transparent));
  animation: winner-in 0.35s ease both;
}

.wheel-winner strong {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: clamp(1.05rem, 2.2vw, 1.35rem);
}

.wheel-controls {
  min-width: 0;
}

.wheel-fullscreen-bar,
.wheel-fullscreen-close {
  display: none;
}

@keyframes winner-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.wheel-stage.is-fullscreen,
.wheel-stage:fullscreen {
  position: fixed;
  inset: 0;
  z-index: 100;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  padding: 64px 24px 32px;
  overflow: auto;
  justify-content: center;
  background: var(--p-content-background, #fff);
}

.wheel-stage.is-fullscreen .wheel-wrap,
.wheel-stage:fullscreen .wheel-wrap {
  flex: none;
  width: min(92vw, 70vh, 900px);
}

.wheel-stage.is-fullscreen .wheel-winner,
.wheel-stage:fullscreen .wheel-winner {
  width: min(92vw, 70vh, 900px);
}

.wheel-stage.is-fullscreen .wheel-center,
.wheel-stage:fullscreen .wheel-center {
  width: 92px;
  height: 92px;
  font-size: 0.8rem;
}

.wheel-stage.is-fullscreen .wheel-fullscreen-bar,
.wheel-stage:fullscreen .wheel-fullscreen-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  background: var(--p-content-background, #fff);
}

.wheel-stage.is-fullscreen .wheel-fullscreen-close,
.wheel-stage:fullscreen .wheel-fullscreen-close {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
  border-radius: 9px;
  background: transparent;
  color: var(--p-text-color);
  font: inherit;
  cursor: pointer;
}

.wheel-stage.is-fullscreen .tool-hint,
.wheel-stage:fullscreen .tool-hint {
  max-width: min(92vw, 600px);
  text-align: center;
}

@media screen and (max-width: 700px) {
  .wheel-layout {
    grid-template-columns: 1fr;
  }

  .wheel-wrap {
    width: min(100%, 420px);
  }

  .wheel-center {
    width: 62px;
    height: 62px;
    border-width: 2px;
    font-size: 0.6rem;
  }

  .wheel-controls {
    order: 2;
  }

  .wheel-stage.is-fullscreen,
  .wheel-stage:fullscreen {
    padding: 58px 14px 24px;
  }

  .wheel-stage.is-fullscreen .wheel-wrap,
  .wheel-stage:fullscreen .wheel-wrap {
    width: min(92vw, 66vh);
  }

  .wheel-stage.is-fullscreen .wheel-winner,
  .wheel-stage:fullscreen .wheel-winner {
    width: min(92vw, 66vh);
  }

  .wheel-stage.is-fullscreen .wheel-center,
  .wheel-stage:fullscreen .wheel-center {
    width: 74px;
    height: 74px;
    font-size: 0.66rem;
  }
}
</style>
