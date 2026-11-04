<script setup lang="ts">
const { image, error, load } = useImageFile()
const canvas = ref<HTMLCanvasElement | null>(null)
const text = ref('MICROPUE')
const fontSize = ref(48)
const color = ref('#ffffff')
const opacity = ref(0.5)
const rotation = ref(-20)
const position = ref('bottom-right')

const positions = [
  ['top-left', 'Top left'],
  ['top-center', 'Top center'],
  ['top-right', 'Top right'],
  ['middle-left', 'Middle left'],
  ['center', 'Center'],
  ['middle-right', 'Middle right'],
  ['bottom-left', 'Bottom left'],
  ['bottom-center', 'Bottom center'],
  ['bottom-right', 'Bottom right']
] as const

function render() {
  const img = image.value
  const el = canvas.value
  if (!img || !el) return
  el.width = img.naturalWidth
  el.height = img.naturalHeight
  const ctx = el.getContext('2d')!
  ctx.drawImage(img, 0, 0)

  const margin = Math.round(Math.min(el.width, el.height) * 0.04)
  const [vertical, horizontal] = position.value.split('-')
  let x = horizontal === 'left' ? margin : horizontal === 'right' ? el.width - margin : el.width / 2
  let y = vertical === 'top' ? margin : vertical === 'bottom' ? el.height - margin : el.height / 2
  ctx.textAlign = horizontal === 'left' ? 'left' : horizontal === 'right' ? 'right' : 'center'
  ctx.textBaseline = vertical === 'top' ? 'top' : vertical === 'bottom' ? 'bottom' : 'middle'
  if (vertical === 'middle' && !horizontal) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    x = el.width / 2
    y = el.height / 2
  }

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.globalAlpha = Math.min(1, Math.max(0, opacity.value))
  ctx.fillStyle = color.value
  ctx.font = `600 ${Math.max(8, fontSize.value)}px system-ui, sans-serif`
  ctx.fillText(text.value, 0, 0)
  ctx.restore()
}

watch([image, text, fontSize, color, opacity, rotation, position], render)

async function onFile(event: Event) {
  await load((event.target as HTMLInputElement).files?.[0])
  render()
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" accept="image/*" @change="onFile" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div class="tool-row">
      <InputText v-model="text" size="small" placeholder="Watermark text" style="flex: 1; min-width: 180px" />
      <label><span>Size</span><InputNumber v-model="fontSize" :min="8" :max="400" size="small" /></label>
      <input v-model="color" type="color" class="color-input" />
      <label><span>Opacity</span><InputNumber v-model="opacity" :min="0" :max="1" :step="0.05" size="small" /></label>
      <label><span>Angle</span><InputNumber v-model="rotation" :min="-180" :max="180" size="small" /></label>
    </div>
    <div class="tool-row">
      <label>
        <span>Position</span>
        <Select v-model="position" :options="positions.map(item => ({ label: item[1], value: item[0] }))" option-label="label" option-value="value" size="small" />
      </label>
    </div>
    <canvas ref="canvas" class="preview" />
    <div v-if="image" class="tool-actions">
      <TButton size="small" label="Download PNG" @click="canvas && downloadCanvas(canvas, 'watermarked.png')" />
    </div>
    <p class="tool-hint">The watermark is rendered into the image locally. This is a visible watermark, not DRM.</p>
  </div>
</template>

<style scoped>
.preview {
  max-width: 100%;
  max-height: 420px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
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
