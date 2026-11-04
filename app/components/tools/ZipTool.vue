<script setup lang="ts">
import { strToU8, unzipSync, zipSync } from 'fflate'

const mode = ref<'create' | 'extract'>('create')
const files = ref<File[]>([])
const error = ref('')
const entries = ref<{ name: string; size: number; data: Uint8Array }[]>([])
const busy = ref(false)

const totalSize = computed(() => files.value.reduce((sum, file) => sum + file.size, 0))

function onFiles(event: Event) {
  files.value = Array.from((event.target as HTMLInputElement).files ?? [])
}

async function createZip() {
  if (!files.value.length) return
  error.value = ''
  busy.value = true
  try {
    const payload: Record<string, Uint8Array> = {}
    for (const file of files.value) payload[file.name] = new Uint8Array(await file.arrayBuffer())
    const zip = zipSync(payload, { level: 6 })
    downloadBlob(new Blob([zip], { type: 'application/zip' }), 'archive.zip')
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    busy.value = false
  }
}

async function extract(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  error.value = ''
  entries.value = []
  busy.value = true
  try {
    const zip = unzipSync(new Uint8Array(await file.arrayBuffer()))
    entries.value = Object.entries(zip).map(([name, data]) => ({ name, size: data.length, data }))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Cannot read this ZIP file.'
  } finally {
    busy.value = false
  }
}

function save(entry: { name: string; data: Uint8Array }) {
  const name = entry.name.split('/').pop() || 'file'
  downloadBlob(new Blob([entry.data]), name)
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-actions">
      <TButton size="small" :severity="mode === 'create' ? undefined : 'secondary'" label="Create ZIP" @click="mode = 'create'" />
      <TButton size="small" :severity="mode === 'extract' ? undefined : 'secondary'" label="Extract ZIP" @click="mode = 'extract'" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>

    <template v-if="mode === 'create'">
      <input type="file" multiple @change="onFiles" />
      <p v-if="files.length" class="tool-hint">{{ files.length }} file(s) · {{ formatBytes(totalSize) }} uncompressed</p>
      <div class="tool-actions">
        <TButton size="small" label="Download ZIP" :loading="busy" :disabled="!files.length" @click="createZip" />
      </div>
    </template>

    <template v-else>
      <input type="file" accept=".zip,application/zip" @change="extract" />
      <p v-if="busy" class="tool-hint">Reading archive…</p>
      <div v-if="entries.length" class="entries">
        <div v-for="entry in entries" :key="entry.name" class="entry">
          <span>{{ entry.name }}</span>
          <span class="tool-hint">{{ formatBytes(entry.size) }}</span>
          <TButton size="small" severity="secondary" label="Save" @click="save(entry)" />
        </div>
      </div>
      <p class="tool-hint">Files are listed after decompression. Save each file you need; directories are not recreated.</p>
    </template>

    <p class="tool-hint">ZIP work happens in memory with fflate. Very large archives can exhaust browser memory.</p>
  </div>
</template>

<style scoped>
.entries {
  max-height: 380px;
  overflow: auto;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 10px;
}

.entry {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 0.8rem;
  padding: 0.35rem 0.6rem;
  font-size: 0.82rem;
}

.entry + .entry {
  border-top: 1px solid color-mix(in srgb, var(--p-text-color) 8%, transparent);
}
</style>
