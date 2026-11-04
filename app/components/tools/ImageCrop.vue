<script setup lang="ts">
const { image, error, load } = useImageFile()
const canvas = ref<HTMLCanvasElement | null>(null)
const x = ref(0)
const y = ref(0)
const width = ref(100)
const height = ref(100)

function render() {
  const img = image.value
  const el = canvas.value
  if (!img || !el) return
  const sx = Math.max(0, Math.min(img.naturalWidth - 1, Math.round(Number(x.value) || 0)))
  const sy = Math.max(0, Math.min(img.naturalHeight - 1, Math.round(Number(y.value) || 0)))
  const sw = Math.max(1, Math.min(img.naturalWidth - sx, Math.round(Number(width.value) || 1)))
  const sh = Math.max(1, Math.min(img.naturalHeight - sy, Math.round(Number(height.value) || 1)))
  x.value = sx
  y.value = sy
  width.value = sw
  height.value = sh
  el.width = sw
  el.height = sh
  el.getContext('2d')!.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)
}

watch([x, y, width, height], render)

async function onFile(event: Event) {
  await load((event.target as HTMLInputElement).files?.[0])
  const img = image.value
  if (!img) return
  x.value = 0
  y.value = 0
  width.value = img.naturalWidth
  height.value = img.naturalHeight
  render()
}

function reset() {
  if (!image.value) return
  x.value = 0
  y.value = 0
  width.value = image.value.naturalWidth
  height.value = image.value.naturalHeight
  render()
}

function preset(ratio: number) {
  if (!image.value) return
  const img = image.value
  let w = img.naturalWidth
  let h = Math.round(w / ratio)
  if (h > img.naturalHeight) {
    h = img.naturalHeight
    w = Math.round(h * ratio)
  }
  width.value = w
  height.value = h
  x.value = Math.round((img.naturalWidth - w) / 2)
  y.value = Math.round((img.naturalHeight - h) / 2)
  render()
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" accept="image/*" @change="onFile" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div class="tool-row">
      <TButton v-for="item in [['Free', 0], ['1:1', 1], ['4:3', 4 / 3], ['16:9', 16 / 9], ['3:2', 1.5]] as const" :key="item[0]" size="small" severity="secondary" :label="item[0]" @click="item[1] ? preset(item[1]) : reset()" />
    </div>
    <div class="tool-row">
      <label><span>X</span><InputNumber v-model="x" :min="0" size="small" /></label>
      <label><span>Y</span><InputNumber v-model="y" :min="0" size="small" /></label>
      <label><span>Width</span><InputNumber v-model="width" :min="1" size="small" /></label>
      <label><span>Height</span><InputNumber v-model="height" :min="1" size="small" /></label>
    </div>
    <canvas ref="canvas" class="preview" />
    <div v-if="image" class="tool-actions">
      <TButton size="small" label="Download PNG" @click="canvas && downloadCanvas(canvas, 'cropped.png')" />
      <span class="tool-hint">{{ width }} × {{ height }}</span>
    </div>
    <p class="tool-hint">Crop values are in source pixels. Ratio presets centre the crop; adjust X/Y for another framing.</p>
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
