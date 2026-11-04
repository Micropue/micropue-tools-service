<script setup lang="ts">
const input = ref('10, 12, 13, 15, 18')

const numbers = computed(() =>
  input.value
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number)
    .filter(Number.isFinite)
)

const stats = computed(() => {
  const values = numbers.value
  if (values.length < 2) return null
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const squares = values.reduce((sum, value) => sum + (value - mean) ** 2, 0)
  const population = squares / values.length
  const sample = squares / (values.length - 1)
  return {
    count: values.length,
    mean,
    population,
    sample,
    populationSd: Math.sqrt(population),
    sampleSd: Math.sqrt(sample)
  }
})
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="input" class="tool-textarea" rows="5" placeholder="At least two numbers…" />
    <div v-if="stats" class="tool-stat-grid">
      <div class="tool-stat"><b>{{ Number(stats.mean.toFixed(6)) }}</b><span>Mean</span></div>
      <div class="tool-stat"><b>{{ Number(stats.population.toFixed(6)) }}</b><span>Population variance</span></div>
      <div class="tool-stat"><b>{{ Number(stats.populationSd.toFixed(6)) }}</b><span>Population std dev</span></div>
      <div class="tool-stat"><b>{{ Number(stats.sample.toFixed(6)) }}</b><span>Sample variance</span></div>
      <div class="tool-stat"><b>{{ Number(stats.sampleSd.toFixed(6)) }}</b><span>Sample std dev</span></div>
    </div>
    <p class="tool-hint">Population values divide by n; sample values divide by n − 1. Use the sample version when the data is a sample of a larger group.</p>
  </div>
</template>
