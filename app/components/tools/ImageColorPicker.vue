<script setup lang="ts">
const { image, error, load } = useImageFile()
const canvas = ref<HTMLCanvasElement | null>(null)
const picked = ref<string | null>(null)
const pixel = ref<{ x: number; y: number } | null>(null)

function drawBase() {
  const img = image.value
  const el = canvas.value
  if (!img || !el) return
  el.width = Math.min(img.naturalWidth, 1600)
  el.height = Math.round((img.naturalHeight * el.width) / img.naturalWidth)
  el.getContext('2d')!.drawImage(img, 0, 0, el.width, el.height)
}

function refresh() {
  drawBase()
  if (!pixel.value || !canvas.value) return
  const ctx = canvas.value.getContext('2d')!
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(pixel.value.x, pixel.value.y, 6, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(pixel.value.x, pixel.value.y, 8, 0, Math.PI * 2)
  ctx.stroke()
}

async function onFile(event: Event) {
  pixel.value = null
  picked.value = null
  await load((event.target as HTMLInputElement).files?.[0])
  refresh()
}

function pick(event: MouseEvent | TouchEvent) {
  const el = canvas.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const point = 'touches' in event ? event.touches[0]! : event
  const x = Math.round(((point.clientX - rect.left) * el.width) / rect.width)
  const y = Math.round(((point.clientY - rect.top) * el.height) / rect.height)
  if (x < 0 || y < 0 || x >= el.width || y >= el.height) return
  const data = el.getContext('2d')!.getImageData(x, y, 1, 1).data
  picked.value = `#${[data[0], data[1], data[2]].map(value => value!.toString(16).padStart(2, '0')).join('')}`
  pixel.value = { x, y }
  refresh()
}

const rgb = computed(() => {
  if (!picked.value) return ''
  const value = picked.value.slice(1)
  return `rgb(${Number.parseInt(value.slice(0, 2), 16)}, ${Number.parseInt(value.slice(2, 4), 16)}, ${Number.parseInt(value.slice(4, 6), 16)})`
})

const hsl = computed(() => {
  if (!picked.value) return ''
  const value = picked.value.slice(1)
  const r = Number.parseInt(value.slice(0, 2), 16) / 255
  const g = Number.parseInt(value.slice(2, 4), 16) / 255
  const b = Number.parseInt(value.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
    h /= 6
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
})
</script>

<template>
  <div class="tool-ui">
    <input type="file" accept="image/*" @change="onFile" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <canvas ref="canvas" class="preview" @click="pick" @touchstart.prevent="pick" />
    <template v-if="picked">
      <div class="tool-row">
        <span class="swatch" :style="{ background: picked }" />
        <span class="tool-hint">{{ pixel?.x }}, {{ pixel?.y }}</span>
      </div>
      <div class="tool-stat-grid">
        <div class="tool-stat"><b>{{ picked }}</b><span>HEX</span></div>
        <div class="tool-stat"><b>{{ rgb }}</b><span>RGB</span></div>
        <div class="tool-stat"><b>{{ hsl }}</b><span>HSL</span></div>
      </div>
      <div class="tool-actions">
        <ToolsCopyButton :text="picked" />
        <ToolsCopyButton :text="rgb" />
        <ToolsCopyButton :text="hsl" />
      </div>
    </template>
    <p class="tool-hint">Click or tap the image to sample a pixel. Sampling is done on a local canvas.</p>
  </div>
</template>

<style scoped>
.preview {
  max-width: 100%;
  max-height: 420px;
  cursor: crosshair;
  touch-action: none;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
}

.swatch {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
}
</style>
