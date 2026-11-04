<script setup lang="ts">
const { image, error, load } = useImageFile()
const canvas = ref<HTMLCanvasElement | null>(null)
const radius = ref(15)

function render() {
  const img = image.value
  const el = canvas.value
  if (!img || !el) return
  el.width = img.naturalWidth
  el.height = img.naturalHeight
  const ctx = el.getContext('2d')!
  const r = (Math.min(el.width, el.height) * Math.min(50, Math.max(0, radius.value))) / 100
  ctx.clearRect(0, 0, el.width, el.height)
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(el.width - r, 0)
  ctx.quadraticCurveTo(el.width, 0, el.width, r)
  ctx.lineTo(el.width, el.height - r)
  ctx.quadraticCurveTo(el.width, el.height, el.width - r, el.height)
  ctx.lineTo(r, el.height)
  ctx.quadraticCurveTo(0, el.height, 0, el.height - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(img, 0, 0)
}

watch([image, radius], render)

async function onFile(event: Event) {
  await load((event.target as HTMLInputElement).files?.[0])
  render()
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" accept="image/*" @change="onFile" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <label class="tool-row">
      <span>Radius</span>
      <InputNumber v-model="radius" :min="0" :max="50" size="small" />
      <span class="tool-hint">% of the shorter side</span>
    </label>
    <div class="checker">
      <canvas ref="canvas" class="preview" />
    </div>
    <div v-if="image" class="tool-actions">
      <TButton size="small" label="Download transparent PNG" @click="canvas && downloadCanvas(canvas, 'rounded.png')" />
    </div>
  </div>
</template>

<style scoped>
.checker {
  padding: 12px;
  border-radius: 12px;
  background-image: linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
}

.preview {
  display: block;
  max-width: 100%;
  max-height: 400px;
}
</style>
