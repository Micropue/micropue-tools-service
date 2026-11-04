<script setup lang="ts">
import exifr from 'exifr'

const { image, file, error, load } = useImageFile()
const exif = ref<Record<string, unknown>>({})

const fields = computed(() => {
  if (!file.value || !image.value) return []
  return [
    { label: 'File name', value: file.value.name },
    { label: 'Format', value: file.value.type || 'unknown' },
    { label: 'Size', value: formatBytes(file.value.size) },
    { label: 'Dimensions', value: `${image.value.naturalWidth} × ${image.value.naturalHeight}` },
    { label: 'Last modified', value: new Date(file.value.lastModified).toLocaleString() }
  ]
})

const exifFields = computed(() =>
  Object.entries(exif.value)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .slice(0, 24)
    .map(([label, value]) => ({ label, value: String(value) }))
)

async function onFile(event: Event) {
  const next = (event.target as HTMLInputElement).files?.[0]
  if (!next) return
  exif.value = {}
  await load(next)
  try {
    exif.value = (await exifr.parse(next, ['Make', 'Model', 'LensModel', 'DateTimeOriginal', 'Orientation', 'ExposureTime', 'FNumber', 'ISO', 'FocalLength'])) ?? {}
  } catch {
    exif.value = {}
  }
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" accept="image/*" @change="onFile" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div v-if="fields.length" class="tool-stat-grid">
      <div v-for="field in fields" :key="field.label" class="tool-stat">
        <b>{{ field.value }}</b>
        <span>{{ field.label }}</span>
      </div>
    </div>
    <template v-if="exifFields.length">
      <p class="tool-label">EXIF (best effort)</p>
      <div class="exif">
        <div v-for="field in exifFields" :key="field.label" class="exif-row">
          <span>{{ field.label }}</span>
          <b>{{ field.value }}</b>
        </div>
      </div>
    </template>
    <p v-else-if="image" class="tool-hint">No readable EXIF fields were found. Not every format or browser exposes them.</p>
  </div>
</template>

<style scoped>
.exif {
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 10px;
  overflow: hidden;
}

.exif-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.45rem 0.7rem;
  font-size: 0.82rem;
}

.exif-row + .exif-row {
  border-top: 1px solid color-mix(in srgb, var(--p-text-color) 8%, transparent);
}

.exif-row span {
  color: var(--p-text-muted-color);
}
</style>
