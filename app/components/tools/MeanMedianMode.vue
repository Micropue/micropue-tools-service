<script setup lang="ts">
const input = ref('12, 15, 15, 18, 21, 25')

const numbers = computed(() =>
  input.value
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number)
    .filter(Number.isFinite)
)

const stats = computed(() => {
  const values = [...numbers.value].sort((a, b) => a - b)
  if (!values.length) return null
  const sum = values.reduce((total, value) => total + value, 0)
  const mean = sum / values.length
  const middle = Math.floor(values.length / 2)
  const median = values.length % 2 ? values[middle]! : (values[middle - 1]! + values[middle]!) / 2
  const counts = new Map<number, number>()
  values.forEach(value => counts.set(value, (counts.get(value) ?? 0) + 1))
  const max = Math.max(...counts.values())
  const modes = max > 1 ? [...counts.entries()].filter(([, count]) => count === max).map(([value]) => value) : []
  return { count: values.length, sum, mean, median, modes, min: values[0]!, max: values[values.length - 1]! }
})
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="input" class="tool-textarea" rows="5" placeholder="Numbers separated by commas, spaces or new lines…" />
    <div v-if="stats" class="tool-stat-grid">
      <div class="tool-stat"><b>{{ stats.count }}</b><span>Count</span></div>
      <div class="tool-stat"><b>{{ Number(stats.mean.toFixed(6)) }}</b><span>Mean</span></div>
      <div class="tool-stat"><b>{{ Number(stats.median.toFixed(6)) }}</b><span>Median</span></div>
      <div class="tool-stat"><b>{{ stats.modes.length ? stats.modes.join(', ') : 'None' }}</b><span>Mode</span></div>
      <div class="tool-stat"><b>{{ stats.min }}</b><span>Minimum</span></div>
      <div class="tool-stat"><b>{{ stats.max }}</b><span>Maximum</span></div>
      <div class="tool-stat"><b>{{ Number(stats.sum.toFixed(6)) }}</b><span>Sum</span></div>
    </div>
    <p class="tool-hint">A mode is only reported when a value repeats. If several values tie, all are shown.</p>
  </div>
</template>
