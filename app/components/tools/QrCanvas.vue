<script setup lang="ts">
import qrcode from 'qrcode-generator'

const QR = qrcode as any
QR.stringToBytes = (value: string) => Array.from(new TextEncoder().encode(value))

const props = withDefaults(
  defineProps<{
    text: string
    size?: number
    ecc?: 'L' | 'M' | 'Q' | 'H'
    fg?: string
    bg?: string
    filename?: string
    logo?: string
  }>(),
  { size: 280, ecc: 'M', fg: '#000000', bg: '#ffffff', filename: 'qr-code.png', logo: '' }
)

const canvas = ref<HTMLCanvasElement | null>(null)
const error = ref('')

function draw() {
  const el = canvas.value
  if (!el) return
  error.value = ''
  if (!props.text) {
    el.width = props.size
    el.height = props.size
    return
  }

  try {
    const qr = QR(0, props.ecc)
    qr.addData(props.text)
    qr.make()
    const count = qr.getModuleCount()
    const quiet = 4
    const scale = Math.max(2, Math.floor((props.size * 2) / (count + quiet * 2)))
    const pixels = (count + quiet * 2) * scale
    el.width = pixels
    el.height = pixels
    const ctx = el.getContext('2d')!
    ctx.fillStyle = props.bg
    ctx.fillRect(0, 0, pixels, pixels)
    ctx.fillStyle = props.fg
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) ctx.fillRect((col + quiet) * scale, (row + quiet) * scale, scale, scale)
      }
    }
    if (props.logo) {
      const logoSize = Math.round(pixels * 0.2)
      const offset = Math.round((pixels - logoSize) / 2)
      const padding = Math.max(4, Math.round(logoSize * 0.08))
      ctx.fillStyle = props.bg
      ctx.fillRect(offset - padding, offset - padding, logoSize + padding * 2, logoSize + padding * 2)
      const image = new Image()
      image.onload = () => ctx.drawImage(image, offset, offset, logoSize, logoSize)
      image.src = props.logo
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Cannot encode this text.'
  }
}

onMounted(draw)
watch(() => [props.text, props.size, props.ecc, props.fg, props.bg, props.logo], draw)

function download() {
  if (!canvas.value || !props.text) return
  canvas.value.toBlob(blob => {
    if (blob) downloadBlob(blob, props.filename)
  }, 'image/png')
}
</script>

<template>
  <div class="qr">
    <canvas ref="canvas" class="qr-canvas" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div class="tool-actions">
      <TButton size="small" :label="$t('ui.download')" :disabled="!text || !!error" @click="download" />
    </div>
  </div>
</template>

<style scoped>
.qr {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
}

.qr-canvas {
  width: min(100%, 280px);
  height: auto;
  image-rendering: pixelated;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 14%, transparent);
}
</style>
