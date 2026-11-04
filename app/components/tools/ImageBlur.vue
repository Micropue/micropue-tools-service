<script setup lang="ts">
const { image, error, load } = useImageFile()
const canvas = ref<HTMLCanvasElement | null>(null)
const mode = ref<'blur' | 'pixelate'>('blur')
const strength = ref(8)

function render() {
  const img = image.value
  const el = canvas.value
  if (!img || !el) return
  el.width = img.naturalWidth
  el.height = img.naturalHeight
  const ctx = el.getContext('2d')!

  if (mode.value === 'blur') {
    ctx.filter = `blur(${Math.max(0, strength.value)}px)`
    ctx.drawImage(img, 0, 0)
    ctx.filter = 'none'
    return
  }

  const factor = Math.max(2, strength.value)
  const small = document.createElement('canvas')
  small.width = Math.max(1, Math.round(el.width / factor))
  small.height = Math.max(1, Math.round(el.height / factor))
  small.getContext('2d')!.drawImage(img, 0, 0, small.width, small.height)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(small, 0, 0, el.width, el.height)
}

watch([image, mode, strength], render)

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
      <TButton size="small" :severity="mode === 'blur' ? undefined : 'secondary'" label="Blur" @click="mode = 'blur'" />
      <TButton size="small" :severity="mode === 'pixelate' ? undefined : 'secondary'" label="Pixelate" @click="mode = 'pixelate'" />
      <label><span>Strength</span><InputNumber v-model="strength" :min="1" :max="50" size="small" /></label>
    </div>
    <canvas ref="canvas" class="preview" />
    <div v-if="image" class="tool-actions">
      <TButton size="small" label="Download PNG" @click="canvas && downloadCanvas(canvas, 'blurred.png')" />
    </div>
    <p class="tool-hint">Applies to the whole image. Blur rendering depends on Canvas filter support in your browser.</p>
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
