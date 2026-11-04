<script setup lang="ts">
const start = ref('09:00')
const end = ref('18:00')
const breakMinutes = ref(60)

const result = computed(() => {
  const [sh, sm] = start.value.split(':').map(Number)
  const [eh, em] = end.value.split(':').map(Number)
  if ([sh, sm, eh, em].some(value => value === undefined || Number.isNaN(value))) return null
  let minutes = eh! * 60 + em! - (sh! * 60 + sm!)
  const overnight = minutes < 0
  if (overnight) minutes += 1440
  const worked = Math.max(0, minutes - Math.max(0, Number(breakMinutes.value) || 0))
  return { overnight, hours: Math.floor(worked / 60), minutes: worked % 60, total: worked }
})

const display = computed(() => (result.value ? `${result.value.hours}h ${result.value.minutes}m` : '—'))
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label><span>Start</span><input v-model="start" type="time" /></label>
      <label><span>End</span><input v-model="end" type="time" /></label>
      <label><span>Break (minutes)</span><InputNumber v-model="breakMinutes" :min="0" :max="1440" size="small" /></label>
    </div>
    <div class="tool-stat-grid">
      <div class="tool-stat"><b>{{ display }}</b><span>Worked time</span></div>
      <div class="tool-stat"><b>{{ result?.total ?? '—' }}</b><span>Total minutes</span></div>
    </div>
    <p v-if="result?.overnight" class="tool-hint">The end time is before the start, so the shift is treated as overnight.</p>
    <p class="tool-hint">Break time is subtracted. This is a simple duration calculator, not a payroll or overtime record.</p>
  </div>
</template>
