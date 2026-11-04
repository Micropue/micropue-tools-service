<script setup lang="ts">
const { image, file, error, load } = useImageFile()
const canvas = ref<HTMLCanvasElement | null>(null)
const format = ref<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg')
const quality = ref(0.7)
const compressed = ref<Blob | null>(null)

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
  el.toBlob(blob => (compressed.value = blob), format.value, quality.value)
}

watch([image, format, quality], render)

function onFile(event: Event) {
  load((event.target as HTMLInputElement).files?.[0]).then(render)
}

const ratio = computed(() => {
  if (!file.value || !compressed.value) return ''
  const change = ((compressed.value.size - file.value.size) / file.value.size) * 100
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
})
</script>

<template>
  <div class="tool-ui">
    <input type="file" accept="image/*" @change="onFile" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div class="tool-row">
      <Select
        v-model="format"
        :options="[
          { label: 'JPEG', value: 'image/jpeg' },
          { label: 'WebP', value: 'image/webp' },
          { label: 'PNG (lossless)', value: 'image/png' }
        ]"
        option-label="label"
        option-value="value"
        size="small"
      />
      <label v-if="format !== 'image/png'">
        <span>Quality</span>
        <InputNumber v-model="quality" :min="0.1" :max="1" :step="0.05" size="small" />
      </label>
    </div>
    <div v-if="file" class="tool-stat-grid">
      <div class="tool-stat"><b>{{ formatBytes(file.size) }}</b><span>Original</span></div>
      <div class="tool-stat"><b>{{ compressed ? formatBytes(compressed.size) : '…' }}</b><span>Compressed</span></div>
      <div class="tool-stat"><b>{{ ratio || '…' }}</b><span>Change</span></div>
    </div>
    <canvas ref="canvas" class="preview" />
    <div v-if="compressed" class="tool-actions">
      <TButton size="small" label="Download" @click="compressed && downloadBlob(compressed, `compressed.${format.split('/')[1]}`)" />
    </div>
    <p class="tool-hint">Output size depends on the browser encoder. A negative change means the file got smaller.</p>
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
