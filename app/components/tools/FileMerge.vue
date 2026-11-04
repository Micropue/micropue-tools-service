<script setup lang="ts">
const { t } = useI18n()
const files = ref<File[]>([])
const separator = ref<'newline' | 'blank' | 'custom'>('newline')
const custom = ref('\n---\n')
const includeNames = ref(false)
const output = ref('')
const error = ref('')
const limit = 2_000_000

async function merge() {
  error.value = ''
  output.value = ''
  const parts: string[] = []
  let total = 0
  for (const file of files.value) {
    if (total + file.size > limit) {
      error.value = 'The combined files exceed the 2 MB text limit.'
      return
    }
    total += file.size
    const content = await file.text()
    parts.push(`${includeNames.value ? `===== ${file.name} =====\n` : ''}${content}`)
  }
  const joiner = separator.value === 'newline' ? '\n' : separator.value === 'blank' ? '\n\n' : custom.value
  output.value = parts.join(joiner)
}

function onFiles(event: Event) {
  files.value = Array.from((event.target as HTMLInputElement).files ?? [])
}

function download() {
  downloadText(output.value, 'merged.txt')
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" multiple accept=".txt,.csv,.md,.json,.log,text/*" @change="onFiles" />
    <div class="tool-row">
      <Select
        v-model="separator"
        :options="[{ label: 'New line', value: 'newline' }, { label: 'Blank line', value: 'blank' }, { label: 'Custom', value: 'custom' }]"
        option-label="label"
        option-value="value"
        size="small"
      />
      <InputText v-if="separator === 'custom'" v-model="custom" size="small" placeholder="Separator" />
      <label><Checkbox v-model="includeNames" binary /> Include file names</label>
      <TButton size="small" label="Merge" :disabled="!files.length" @click="merge" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <p v-if="files.length" class="tool-hint">{{ files.map(file => file.name).join(', ') }}</p>
    <template v-if="output">
      <p class="tool-label">{{ t('ui.result') }}</p>
      <pre class="tool-output">{{ output }}</pre>
      <div class="tool-actions">
        <ToolsCopyButton :text="output" />
        <TButton size="small" severity="secondary" :label="t('ui.download')" @click="download" />
      </div>
    </template>
    <p class="tool-hint">Text is decoded as UTF-8 and merged locally. Binary files are not supported.</p>
  </div>
</template>
