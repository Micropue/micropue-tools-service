<script setup lang="ts">
const pattern = ref('\\b\\w+@\\w+\\.\\w+\\b')
const text = ref('Contact: hello@example.com and team@micropue.com.cn')
const flags = ref({ g: true, i: true, m: false, s: false, u: false })
const error = ref('')

const activeFlags = computed(() => Object.entries(flags.value).filter(([, on]) => on).map(([flag]) => flag).join(''))

const matches = computed(() => {
  error.value = ''
  if (!pattern.value) return []

  let regex: RegExp
  try {
    regex = new RegExp(pattern.value, activeFlags.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
    return []
  }

  const result: { index: number; value: string; groups: string[] }[] = []
  if (!activeFlags.value.includes('g')) {
    const match = regex.exec(text.value)
    if (match) result.push({ index: match.index, value: match[0], groups: match.slice(1) })
    return result
  }

  for (const match of text.value.matchAll(regex)) {
    result.push({ index: match.index ?? 0, value: match[0], groups: match.slice(1) })
    if (result.length >= 200) break
  }
  return result
})

const highlighted = computed(() => {
  if (!matches.value.length) return text.value
  let cursor = 0
  let html = ''
  for (const match of matches.value) {
    html += escapeHtml(text.value.slice(cursor, match.index))
    html += `<mark>${escapeHtml(match.value)}</mark>`
    cursor = match.index + match.value.length
  }
  html += escapeHtml(text.value.slice(cursor))
  return html
})

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]!)
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <span class="tool-hint">/</span>
      <InputText v-model="pattern" size="small" placeholder="pattern" style="flex: 1; min-width: 220px" />
      <span class="tool-hint">/{{ activeFlags }}</span>
    </div>

    <div class="tool-row">
      <label v-for="(_, flag) in flags" :key="flag">
        <Checkbox v-model="flags[flag]" binary /> {{ flag }}
      </label>
    </div>

    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>

    <Textarea v-model="text" class="tool-textarea" rows="6" placeholder="Test text…" />

    <p class="tool-label">Preview</p>
    <pre class="tool-output" v-html="highlighted" />

    <p class="tool-label">Matches ({{ matches.length }})</p>
    <div class="matches">
      <div v-for="(match, index) in matches" :key="index" class="match">
        <span class="match-index">{{ index + 1 }}</span>
        <span class="match-value">{{ match.value }}</span>
        <span v-if="match.groups.length" class="match-groups">{{ match.groups.join(' · ') }}</span>
      </div>
      <p v-if="!matches.length" class="tool-hint">No matches.</p>
    </div>
  </div>
</template>

<style scoped>
:deep(mark) {
  background: color-mix(in srgb, #f59e0b 35%, transparent);
  color: inherit;
}

.matches {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.match {
  display: flex;
  gap: 0.6rem;
  align-items: baseline;
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: 0.8rem;
}

.match-index {
  color: var(--p-text-muted-color);
  min-width: 1.5rem;
}

.match-value {
  color: var(--p-text-color);
  overflow-wrap: anywhere;
}

.match-groups {
  color: var(--p-text-muted-color);
  font-size: 0.74rem;
}
</style>
