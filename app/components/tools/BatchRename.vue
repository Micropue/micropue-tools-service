<script setup lang="ts">
const files = ref<File[]>([])
const prefix = ref('')
const suffix = ref('')
const find = ref('')
const replace = ref('')
const number = ref(true)
const start = ref(1)
const padding = ref(2)

const preview = computed(() =>
  files.value.map((file, index) => {
    const dot = file.name.lastIndexOf('.')
    const base = dot > 0 ? file.name.slice(0, dot) : file.name
    const extension = dot > 0 ? file.name.slice(dot) : ''
    let name = find.value ? base.split(find.value).join(replace.value) : base
    name = `${prefix.value}${name}${suffix.value}`
    if (number.value) name = `${String(Number(start.value) + index).padStart(Number(padding.value) || 1, '0')}-${name}`
    return { from: file.name, to: `${name}${extension}` }
  })
)

function onFiles(event: Event) {
  files.value = Array.from((event.target as HTMLInputElement).files ?? [])
}

function downloadCsv() {
  const rows = [['original', 'renamed'], ...preview.value.map(item => [item.from, item.to])]
  downloadText(toCsv(rows), 'rename-preview.csv', 'text/csv;charset=utf-8')
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" multiple @change="onFiles" />
    <div class="tool-grid-2">
      <InputText v-model="prefix" size="small" placeholder="Prefix" />
      <InputText v-model="suffix" size="small" placeholder="Suffix (before extension)" />
      <InputText v-model="find" size="small" placeholder="Find" />
      <InputText v-model="replace" size="small" placeholder="Replace with" />
    </div>
    <div class="tool-row">
      <label><Checkbox v-model="number" binary /> Add sequence number</label>
      <label><span>Start</span><InputNumber v-model="start" :min="0" size="small" /></label>
      <label><span>Padding</span><InputNumber v-model="padding" :min="1" :max="8" size="small" /></label>
    </div>
    <div v-if="preview.length" class="rename-list">
      <div v-for="item in preview" :key="item.from" class="rename-row">
        <span class="from">{{ item.from }}</span>
        <span>→</span>
        <span class="to">{{ item.to }}</span>
      </div>
    </div>
    <div v-if="preview.length" class="tool-actions">
      <TButton size="small" label="Download rename map (CSV)" @click="downloadCsv" />
    </div>
    <p class="tool-hint">Browsers cannot rename local files. This tool only previews the new names and exports a mapping you can apply in your file manager.</p>
  </div>
</template>

<style scoped>
.rename-list {
  max-height: 360px;
  overflow: auto;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 10px;
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: 0.8rem;
}

.rename-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.6rem;
  padding: 0.35rem 0.6rem;
}

.rename-row + .rename-row {
  border-top: 1px solid color-mix(in srgb, var(--p-text-color) 8%, transparent);
}

.from {
  color: var(--p-text-muted-color);
  overflow-wrap: anywhere;
}

.to {
  overflow-wrap: anywhere;
}
</style>
