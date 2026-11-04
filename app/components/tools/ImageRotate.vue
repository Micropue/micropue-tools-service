<script setup lang="ts">
const { image, error, load } = useImageFile()
const canvas = ref<HTMLCanvasElement | null>(null)
const rotation = ref(0)
const flipX = ref(false)
const flipY = ref(false)

function render() {
  const img = image.value
  const el = canvas.value
  if (!img || !el) return
  const swap = rotation.value % 180 !== 0
  el.width = swap ? img.naturalHeight : img.naturalWidth
  el.height = swap ? img.naturalWidth : img.naturalHeight
  const ctx = el.getContext('2d')!
  ctx.translate(el.width / 2, el.height / 2)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.scale(flipX.value ? -1 : 1, flipY.value ? -1 : 1)
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
}

watch([image, rotation, flipX, flipY], render)

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
      <TButton size="small" severity="secondary" label="Rotate 90°" @click="rotation = (rotation + 90) % 360" />
      <TButton size="small" severity="secondary" label="Rotate 180°" @click="rotation = (rotation + 180) % 360" />
      <TButton size="small" severity="secondary" label="Rotate 270°" @click="rotation = (rotation + 270) % 360" />
      <label><Checkbox v-model="flipX" binary /> Flip horizontal</label>
      <label><Checkbox v-model="flipY" binary /> Flip vertical</label>
    </div>
    <canvas ref="canvas" class="preview" />
    <div v-if="image" class="tool-actions">
      <TButton size="small" label="Download PNG" @click="canvas && downloadCanvas(canvas, 'rotated.png')" />
      <span class="tool-hint">{{ rotation }}° · {{ canvas?.width }} × {{ canvas?.height }}</span>
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
