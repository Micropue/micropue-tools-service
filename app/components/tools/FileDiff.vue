<script setup lang="ts">
const { t } = useI18n()
const leftName = ref('')
const rightName = ref('')
const left = ref('')
const right = ref('')
const error = ref('')

async function readFile(event: Event, side: 'left' | 'right') {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  error.value = ''
  if (file.size > 2_000_000) {
    error.value = 'Each file must be under 2 MB.'
    return
  }
  if (side === 'left') {
    leftName.value = file.name
    left.value = await file.text()
  } else {
    rightName.value = file.name
    right.value = await file.text()
  }
}

const rows = computed(() => diffLines(left.value.split('\n'), right.value.split('\n')))
const added = computed(() => rows.value.filter(row => row.type === 'add').length)
const removed = computed(() => rows.value.filter(row => row.type === 'del').length)
</script>

<template>
  <div class="tool-ui">
    <div class="tool-grid-2">
      <div>
        <p class="tool-label">Original {{ leftName ? `· ${leftName}` : '' }}</p>
        <input type="file" accept="text/*,.txt,.csv,.md,.json,.js,.css,.html" @change="readFile($event, 'left')" />
      </div>
      <div>
        <p class="tool-label">Changed {{ rightName ? `· ${rightName}` : '' }}</p>
        <input type="file" accept="text/*,.txt,.csv,.md,.json,.js,.css,.html" @change="readFile($event, 'right')" />
      </div>
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <p class="tool-hint">{{ t('ui.diffStats', { added, removed }) }}</p>
    <div class="diff">
      <div v-for="(row, index) in rows" :key="index" class="diff-row" :class="`is-${row.type}`">
        <span class="diff-sign">{{ row.type === 'add' ? '+' : row.type === 'del' ? '-' : ' ' }}</span>
        <span class="diff-text">{{ row.text || ' ' }}</span>
      </div>
    </div>
    <p class="tool-hint">Both files are read locally. Line endings are normalised by the text reader.</p>
  </div>
</template>

<style scoped>
.diff {
  max-height: 420px;
  overflow: auto;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 10px;
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: 0.8rem;
  line-height: 1.5;
}

.diff-row {
  display: flex;
  gap: 0.6rem;
  padding: 0.1rem 0.7rem;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.diff-sign {
  flex: none;
  width: 0.8rem;
  color: var(--p-text-muted-color);
}

.is-add {
  background: color-mix(in srgb, #22c55e 14%, transparent);
}

.is-del {
  background: color-mix(in srgb, #ef4444 13%, transparent);
}
</style>
