<script setup lang="ts">
const files = ref<File[]>([])
const images = ref<HTMLImageElement[]>([])
const canvas = ref<HTMLCanvasElement | null>(null)
const direction = ref<'horizontal' | 'vertical'>('horizontal')
const gap = ref(8)
const background = ref('#ffffff')
const error = ref('')

async function refresh() {
  error.value = ''
  try {
    images.value = await Promise.all(files.value.map(loadImage))
    render()
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}

function render() {
  const el = canvas.value
  if (!el || !images.value.length) return
  const horizontal = direction.value === 'horizontal'
  const spacing = Math.max(0, gap.value)
  const width = horizontal
    ? images.value.reduce((sum, img) => sum + img.naturalWidth, 0) + spacing * (images.value.length - 1)
    : Math.max(...images.value.map(img => img.naturalWidth))
  const height = horizontal
    ? Math.max(...images.value.map(img => img.naturalHeight))
    : images.value.reduce((sum, img) => sum + img.naturalHeight, 0) + spacing * (images.value.length - 1)

  if (width * height > 80_000_000) {
    error.value = 'The combined canvas would be too large. Use fewer or smaller images.'
    return
  }

  el.width = width
  el.height = height
  const ctx = el.getContext('2d')!
  ctx.fillStyle = background.value
  ctx.fillRect(0, 0, width, height)
  let offset = 0
  for (const img of images.value) {
    if (horizontal) {
      ctx.drawImage(img, offset, Math.round((height - img.naturalHeight) / 2))
      offset += img.naturalWidth + spacing
    } else {
      ctx.drawImage(img, Math.round((width - img.naturalWidth) / 2), offset)
      offset += img.naturalHeight + spacing
    }
  }
}

watch([direction, gap, background], render)

async function onFiles(event: Event) {
  files.value = Array.from((event.target as HTMLInputElement).files ?? [])
  await refresh()
}

function move(index: number, delta: number) {
  const target = index + delta
  if (target < 0 || target >= files.value.length) return
  const copy = [...files.value]
  ;[copy[index], copy[target]] = [copy[target]!, copy[index]!]
  files.value = copy
  refresh()
}

function remove(index: number) {
  files.value = files.value.filter((_, position) => position !== index)
  refresh()
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" accept="image/*" multiple @change="onFiles" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div class="tool-row">
      <Select v-model="direction" :options="[{ label: 'Horizontal', value: 'horizontal' }, { label: 'Vertical', value: 'vertical' }]" option-label="label" option-value="value" size="small" />
      <label><span>Gap</span><InputNumber v-model="gap" :min="0" :max="100" size="small" /></label>
      <label><span>Background</span><input v-model="background" type="color" class="color-input" /></label>
    </div>
    <div v-if="files.length" class="file-list">
      <div v-for="(file, index) in files" :key="`${file.name}-${index}`" class="file-row">
        <span>{{ index + 1 }}. {{ file.name }}</span>
        <span class="tool-actions">
          <TButton size="small" text severity="secondary" icon="pi pi-arrow-up" aria-label="Move up" @click="move(index, -1)" />
          <TButton size="small" text severity="secondary" icon="pi pi-arrow-down" aria-label="Move down" @click="move(index, 1)" />
          <TButton size="small" text severity="secondary" icon="pi pi-times" aria-label="Remove" @click="remove(index)" />
        </span>
      </div>
    </div>
    <canvas ref="canvas" class="preview" />
    <div v-if="images.length" class="tool-actions">
      <TButton size="small" label="Download PNG" @click="canvas && downloadCanvas(canvas, 'stitched.png')" />
      <span class="tool-hint">{{ canvas?.width }} × {{ canvas?.height }}</span>
    </div>
    <p class="tool-hint">All images are decoded locally. Large canvases can use a lot of memory.</p>
  </div>
</template>

<style scoped>
.preview {
  max-width: 100%;
  max-height: 420px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
}

.file-list {
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 9px;
  overflow: hidden;
}

.file-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.35rem 0.6rem;
  font-size: 0.82rem;
}

.file-row + .file-row {
  border-top: 1px solid color-mix(in srgb, var(--p-text-color) 8%, transparent);
}

.color-input {
  width: 42px;
  height: 34px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
  border-radius: 7px;
  background: transparent;
}
</style>
