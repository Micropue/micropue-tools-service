<script setup lang="ts">
const { image, error, load } = useImageFile()
const canvas = ref<HTMLCanvasElement | null>(null)
const width = ref(800)
const height = ref(600)
const lock = ref(true)
const percent = ref(100)

function render() {
  const img = image.value
  const el = canvas.value
  if (!img || !el) return
  const w = Math.max(1, Math.round(Number(width.value) || 1))
  const h = lock.value ? Math.max(1, Math.round((w * img.naturalHeight) / img.naturalWidth)) : Math.max(1, Math.round(Number(height.value) || 1))
  width.value = w
  height.value = h
  el.width = w
  el.height = h
  const ctx = el.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, w, h)
}

watch([width, height, lock], render)

async function onFile(event: Event) {
  await load((event.target as HTMLInputElement).files?.[0])
  const img = image.value
  if (!img) return
  width.value = img.naturalWidth
  height.value = img.naturalHeight
  percent.value = 100
  render()
}

function scaleTo(value: number) {
  if (!image.value) return
  percent.value = value
  width.value = Math.max(1, Math.round((image.value.naturalWidth * value) / 100))
  render()
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" accept="image/*" @change="onFile" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div class="tool-row">
      <label><span>Width</span><InputNumber v-model="width" :min="1" :max="20000" size="small" /></label>
      <label><span>Height</span><InputNumber v-model="height" :min="1" :max="20000" :disabled="lock" size="small" /></label>
      <label><Checkbox v-model="lock" binary /> Lock ratio</label>
    </div>
    <div class="tool-row">
      <span class="tool-hint">Scale:</span>
      <TButton v-for="value in [25, 50, 75, 100]" :key="value" size="small" severity="secondary" :label="`${value}%`" @click="scaleTo(value)" />
    </div>
    <canvas ref="canvas" class="preview" />
    <div v-if="image" class="tool-actions">
      <TButton size="small" label="Download PNG" @click="canvas && downloadCanvas(canvas, 'resized.png')" />
      <span class="tool-hint">{{ width }} × {{ height }}</span>
    </div>
  </div>
</template>

<style scoped>
.preview {
  max-width: 100%;
  max-height: 420px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
}
</style>
