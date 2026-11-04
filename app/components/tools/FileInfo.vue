<script setup lang="ts">
const file = ref<File | null>(null)
const preview = ref('')

function onFile(event: Event) {
  const next = (event.target as HTMLInputElement).files?.[0]
  if (!next) return
  file.value = next
  preview.value = ''
  if (next.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = () => (preview.value = String(reader.result))
    reader.readAsDataURL(next)
  }
}

const fields = computed(() => {
  if (!file.value) return []
  const name = file.value.name
  return [
    { label: 'File name', value: name },
    { label: 'Extension', value: name.includes('.') ? `.${name.split('.').pop()}` : 'none' },
    { label: 'MIME type', value: file.value.type || 'unknown (browser could not detect)' },
    { label: 'Size', value: formatBytes(file.value.size) },
    { label: 'Size (bytes)', value: file.value.size.toLocaleString() },
    { label: 'Last modified', value: new Date(file.value.lastModified).toLocaleString() }
  ]
})
</script>

<template>
  <div class="tool-ui">
    <input type="file" @change="onFile" />
    <div v-if="fields.length" class="tool-stat-grid">
      <div v-for="field in fields" :key="field.label" class="tool-stat">
        <b>{{ field.value }}</b>
        <span>{{ field.label }}</span>
      </div>
    </div>
    <img v-if="preview" :src="preview" alt="File preview" class="preview" />
    <p class="tool-hint">MIME type comes from the browser and can be wrong or empty for uncommon extensions.</p>
  </div>
</template>

<style scoped>
.preview {
  max-width: 100%;
  max-height: 320px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
}
</style>
