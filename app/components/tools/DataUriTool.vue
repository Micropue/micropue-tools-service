<script setup lang="ts">
const { t } = useI18n()
const mode = ref<'to-uri' | 'to-image'>('to-uri')
const uri = ref('')
const fileInfo = ref('')
const error = ref('')
const imageUrl = ref('')
const imageName = ref('image')

function readAsDataUri(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Cannot read this file.'))
    reader.readAsDataURL(file)
  })
}

async function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  error.value = ''
  try {
    uri.value = await readAsDataUri(file)
    fileInfo.value = `${file.name} · ${formatBytes(file.size)} · ${file.type || 'unknown type'}`
    imageName.value = file.name.replace(/\.[^.]+$/, '')
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}

function preview() {
  error.value = ''
  if (!uri.value.startsWith('data:image/')) {
    error.value = 'The input is not an image Data URI.'
    imageUrl.value = ''
    return
  }
  imageUrl.value = uri.value
}

async function downloadImage() {
  if (!imageUrl.value) return
  const response = await fetch(imageUrl.value)
  downloadBlob(await response.blob(), `${imageName.value || 'image'}.png`)
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-actions">
      <TButton size="small" :severity="mode === 'to-uri' ? undefined : 'secondary'" label="Image → Data URI" @click="mode = 'to-uri'" />
      <TButton size="small" :severity="mode === 'to-image' ? undefined : 'secondary'" label="Data URI → Image" @click="mode = 'to-image'" />
    </div>

    <template v-if="mode === 'to-uri'">
      <input type="file" accept="image/*" @change="onFile" />
      <p v-if="fileInfo" class="tool-hint">{{ fileInfo }}</p>
      <Textarea v-model="uri" class="tool-textarea" rows="5" readonly placeholder="Data URI appears here…" />
    </template>

    <template v-else>
      <Textarea v-model="uri" class="tool-textarea" rows="7" placeholder="data:image/png;base64,…" />
      <div class="tool-actions">
        <TButton size="small" label="Preview" @click="preview" />
        <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="uri = ''; imageUrl = ''; error = ''" />
      </div>
      <img v-if="imageUrl" :src="imageUrl" alt="Data URI preview" class="preview" />
      <div v-if="imageUrl" class="tool-actions">
        <TButton size="small" :label="t('ui.download')" @click="downloadImage" />
      </div>
    </template>

    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div v-if="uri" class="tool-actions">
      <ToolsCopyButton :text="uri" />
      <span class="tool-hint">{{ uri.length.toLocaleString() }} characters</span>
    </div>
    <p class="tool-hint">Data URIs are about 33% larger than the binary file and live only in this page.</p>
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
