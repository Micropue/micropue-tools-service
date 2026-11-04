<script setup lang="ts">
const value = ref(20)
const from = ref<'C' | 'F' | 'K'>('C')

const celsius = computed(() => {
  if (from.value === 'C') return Number(value.value)
  if (from.value === 'F') return ((Number(value.value) - 32) * 5) / 9
  return Number(value.value) - 273.15
})

const results = computed(() => [
  { label: 'Celsius', value: (Math.round(celsius.value * 1000) / 1000).toString() },
  { label: 'Fahrenheit', value: (Math.round(((celsius.value * 9) / 5 + 32) * 1000) / 1000).toString() },
  { label: 'Kelvin', value: (Math.round((celsius.value + 273.15) * 1000) / 1000).toString() }
])
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <InputNumber v-model="value" size="small" :input-style="{ minWidth: '140px' }" />
      <Select v-model="from" :options="[{ label: 'Celsius', value: 'C' }, { label: 'Fahrenheit', value: 'F' }, { label: 'Kelvin', value: 'K' }]" option-label="label" option-value="value" size="small" />
    </div>
    <div class="tool-stat-grid">
      <div v-for="item in results" :key="item.label" class="tool-stat">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </div>
    </div>
    <p class="tool-hint">Kelvin values below absolute zero are mathematically possible in this converter but are not physical.</p>
  </div>
</template>
