<script setup lang="ts">
const date = ref('')

onMounted(() => {
  date.value = new Date().toISOString().slice(0, 10)
})
const amount = ref(7)
const unit = ref<'days' | 'weeks' | 'months' | 'years'>('days')

const result = computed(() => {
  const base = new Date(`${date.value}T00:00:00`)
  if (Number.isNaN(base.getTime())) return null
  const value = Number(amount.value) || 0
  if (unit.value === 'days') base.setDate(base.getDate() + value)
  else if (unit.value === 'weeks') base.setDate(base.getDate() + value * 7)
  else if (unit.value === 'months') base.setMonth(base.getMonth() + value)
  else base.setFullYear(base.getFullYear() + value)
  return {
    iso: `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-${String(base.getDate()).padStart(2, '0')}`,
    weekday: base.toLocaleDateString(undefined, { weekday: 'long' }),
    local: base.toLocaleDateString()
  }
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label><span>Date</span><input v-model="date" type="date" /></label>
      <label><span>Amount</span><InputNumber v-model="amount" size="small" /></label>
      <Select v-model="unit" :options="[{ label: 'Days', value: 'days' }, { label: 'Weeks', value: 'weeks' }, { label: 'Months', value: 'months' }, { label: 'Years', value: 'years' }]" option-label="label" option-value="value" size="small" />
    </div>
    <div v-if="result" class="tool-stat-grid">
      <div class="tool-stat"><b>{{ result.iso }}</b><span>Result</span></div>
      <div class="tool-stat"><b>{{ result.weekday }}</b><span>Weekday</span></div>
    </div>
    <div v-if="result" class="tool-actions"><ToolsCopyButton :text="result.iso" /></div>
    <p class="tool-hint">Negative amounts subtract. Adding months can overflow a short month; for example 31 January + 1 month lands in March.</p>
  </div>
</template>
