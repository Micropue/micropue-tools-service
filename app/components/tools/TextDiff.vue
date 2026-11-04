<script setup lang="ts">
const { t } = useI18n()
const left = ref('')
const right = ref('')

type Row = { type: 'same' | 'add' | 'del'; text: string }

function diffLines(a: string[], b: string[]): Row[] {
  const n = a.length
  const m = b.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i]![j] = a[i] === b[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!)
    }
  }

  const rows: Row[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      rows.push({ type: 'same', text: a[i]! })
      i++
      j++
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      rows.push({ type: 'del', text: a[i]! })
      i++
    } else {
      rows.push({ type: 'add', text: b[j]! })
      j++
    }
  }
  while (i < n) rows.push({ type: 'del', text: a[i++]! })
  while (j < m) rows.push({ type: 'add', text: b[j++]! })

  return rows
}

const rows = computed(() => diffLines(left.value.split('\n'), right.value.split('\n')))
const added = computed(() => rows.value.filter(row => row.type === 'add').length)
const removed = computed(() => rows.value.filter(row => row.type === 'del').length)
</script>

<template>
  <div class="tool-ui">
    <div class="tool-grid-2">
      <div>
        <p class="tool-label">Original</p>
        <Textarea v-model="left" class="tool-textarea" rows="10" placeholder="Original text…" />
      </div>
      <div>
        <p class="tool-label">Changed</p>
        <Textarea v-model="right" class="tool-textarea" rows="10" placeholder="Changed text…" />
      </div>
    </div>

    <p class="tool-hint">{{ t('ui.diffStats', { added, removed }) }}</p>

    <div class="diff">
      <div v-for="(row, index) in rows" :key="index" class="diff-row" :class="`is-${row.type}`">
        <span class="diff-sign">{{ row.type === 'add' ? '+' : row.type === 'del' ? '-' : ' ' }}</span>
        <span class="diff-text">{{ row.text || ' ' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diff {
  max-height: 360px;
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
