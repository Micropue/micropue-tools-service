<script setup lang="ts">
const mode = ref<'of' | 'share' | 'change'>('of')
const a = ref(25)
const b = ref(200)

const result = computed(() => {
  if (mode.value === 'of') return (Number(a.value) / 100) * Number(b.value)
  if (mode.value === 'share') return Number(b.value) === 0 ? Number.NaN : (Number(a.value) / Number(b.value)) * 100
  return Number(a.value) === 0 ? Number.NaN : ((Number(b.value) - Number(a.value)) / Number(a.value)) * 100
})

const label = computed(() => {
  if (mode.value === 'of') return `${a.value}% of ${b.value}`
  if (mode.value === 'share') return `${a.value} is what percent of ${b.value}`
  return `Change from ${a.value} to ${b.value}`
})

const display = computed(() => (Number.isFinite(result.value) ? String(Number(result.value.toFixed(6))) : '—'))
</script>

<template>
  <div class="tool-ui">
    <div class="tool-actions">
      <TButton size="small" :severity="mode === 'of' ? undefined : 'secondary'" label="X% of Y" @click="mode = 'of'" />
      <TButton size="small" :severity="mode === 'share' ? undefined : 'secondary'" label="X is what % of Y" @click="mode = 'share'" />
      <TButton size="small" :severity="mode === 'change' ? undefined : 'secondary'" label="Percent change" @click="mode = 'change'" />
    </div>
    <div class="tool-row">
      <label><span>{{ mode === 'of' ? 'Percent (X)' : mode === 'share' ? 'Part (X)' : 'From (X)' }}</span><InputNumber v-model="a" size="small" /></label>
      <label><span>{{ mode === 'of' ? 'Value (Y)' : mode === 'share' ? 'Whole (Y)' : 'To (Y)' }}</span><InputNumber v-model="b" size="small" /></label>
    </div>
    <div class="tool-stat-grid">
      <div class="tool-stat"><b>{{ display }}{{ mode === 'of' ? '' : '%' }}</b><span>{{ label }}</span></div>
    </div>
    <p v-if="mode === 'change'" class="tool-hint">{{ result >= 0 ? 'Increase' : 'Decrease' }} of {{ Math.abs(result).toFixed(2) }}%.</p>
    <div class="tool-actions"><ToolsCopyButton :text="display" /></div>
  </div>
</template>
