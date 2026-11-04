<script setup lang="ts">
const { image, error, load } = useImageFile()
const canvas = ref<HTMLCanvasElement | null>(null)
const format = ref<'image/png' | 'image/jpeg' | 'image/webp'>('image/jpeg')
const quality = ref(0.85)
const outputSize = ref('')

function render() {
  const img = image.value
  const el = canvas.value
  if (!img || !el) return
  el.width = img.naturalWidth
  el.height = img.naturalHeight
  const ctx = el.getContext('2d')!
  if (format.value === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, el.width, el.height)
  }
  ctx.drawImage(img, 0, 0)
  el.toBlob(blob => (outputSize.value = blob ? formatBytes(blob.size) : ''), format.value, quality.value)
}

watch([image, format, quality], render)

async function onFile(event: Event) {
  await load((event.target as HTMLInputElement).files?.[0])
  render()
}

async function download() {
  if (!canvas.value) return
  await downloadCanvas(canvas.value, `converted.${format.value.split('/')[1]}`, format.value, quality.value)
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" accept="image/*" @change="onFile" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div class="tool-row">
      <Select
        v-model="format"
        :options="[
          { label: 'PNG', value: 'image/png' },
          { label: 'JPEG', value: 'image/jpeg' },
          { label: 'WebP', value: 'image/webp' }
        ]"
        option-label="label"
        option-value="value"
        size="small"
      />
      <label v-if="format !== 'image/png'">
        <span>Quality</span>
        <InputNumber v-model="quality" :min="0.1" :max="1" :step="0.05" size="small" />
      </label>
      <span v-if="outputSize" class="tool-hint">Output: {{ outputSize }}</span>
    </div>
    <canvas ref="canvas" class="preview" />
    <div v-if="image" class="tool-actions">
      <TButton size="small" label="Download" @click="download" />
      <span class="tool-hint">{{ image.naturalWidth }} × {{ image.naturalHeight }}</span>
    </div>
    <p class="tool-hint">JPEG does not support transparency and is flattened onto white. Conversion is local via Canvas.</p>
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
