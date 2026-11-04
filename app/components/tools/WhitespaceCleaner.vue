<script setup lang="ts">
const { t } = useI18n()
const input = ref('')
const trim = ref(true)
const collapse = ref(true)
const dropEmpty = ref(false)
const mergeBlank = ref(true)
const invisible = ref(true)

const output = computed(() => {
  let text = input.value
  if (invisible.value) text = text.replace(/[\u200B-\u200D\u2060\uFEFF\u00AD]/g, '')
  const lines = text.split('\n').map(line => {
    let value = line
    if (trim.value) value = value.trim()
    if (collapse.value) value = value.replace(/[ \t]+/g, ' ')
    return value
  })

  let result: string[] = lines
  if (dropEmpty.value) result = result.filter(line => line !== '')
  if (mergeBlank.value) result = result.filter((line, index) => !(line === '' && result[index - 1] === ''))
  return result.join('\n')
})

const modes = [
  ['trim', 'Trim each line', trim],
  ['collapse', 'Collapse spaces', collapse],
  ['dropEmpty', 'Remove blank lines', dropEmpty],
  ['mergeBlank', 'Merge blank lines', mergeBlank],
  ['invisible', 'Remove invisible chars', invisible]
] as const
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="input" class="tool-textarea" rows="8" placeholder="Paste text with extra spaces…" />
    <div class="tool-row">
      <label v-for="[key, label, model] in modes" :key="key">
        <Checkbox v-model="model.value" binary /> {{ label }}
      </label>
    </div>
    <div class="tool-actions">
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''" />
    </div>
    <p class="tool-label">{{ t('ui.result') }}</p>
    <pre class="tool-output">{{ output }}</pre>
    <div class="tool-actions">
      <ToolsCopyButton :text="output" />
    </div>
  </div>
</template>
