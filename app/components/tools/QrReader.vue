<script setup lang="ts">
import jsQR from 'jsqr'

const { t } = useI18n()
const canvas = ref<HTMLCanvasElement | null>(null)
const result = ref('')
const error = ref('')
const busy = ref(false)

async function openLink(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

async function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !canvas.value) return
  error.value = ''
  result.value = ''
  busy.value = true
  try {
    const image = await loadImage(file)
    const scale = Math.min(1, 2000 / Math.max(image.naturalWidth, image.naturalHeight))
    const el = canvas.value
    el.width = Math.round(image.naturalWidth * scale)
    el.height = Math.round(image.naturalHeight * scale)
    const ctx = el.getContext('2d', { willReadFrequently: true })!
    ctx.drawImage(image, 0, 0, el.width, el.height)
    const pixels = ctx.getImageData(0, 0, el.width, el.height)
    const code = jsQR(pixels.data, pixels.width, pixels.height)
    if (!code) error.value = 'No QR code found. Try a sharper, more square image with good contrast.'
    else result.value = code.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" accept="image/*" @change="onFile" />
    <p v-if="busy" class="tool-hint">Scanning locally…</p>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <template v-if="result">
      <p class="tool-label">{{ t('ui.result') }}</p>
      <pre class="tool-output">{{ result }}</pre>
      <div class="tool-actions">
        <ToolsCopyButton :text="result" />
        <TButton v-if="/^https?:\/\//i.test(result)" size="small" severity="secondary" label="Open link" @click="openLink(result)" />
      </div>
    </template>
    <canvas ref="canvas" class="preview" />
    <p class="tool-hint">Decoding happens in the browser with jsQR. Nothing is uploaded.</p>
  </div>
</template>

<style scoped>
.preview {
  display: none;
}
</style>
