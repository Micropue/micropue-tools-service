<script setup lang="ts">
const start = ref('')
const end = ref('')

onMounted(() => {
  start.value = new Date().toISOString().slice(0, 10)
  end.value = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
})

const stats = computed(() => {
  const a = new Date(`${start.value}T00:00:00`)
  const b = new Date(`${end.value}T00:00:00`)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null
  const earlier = a <= b ? a : b
  const later = a <= b ? b : a
  const days = Math.round((later.getTime() - earlier.getTime()) / 86400000)
  let months = (later.getFullYear() - earlier.getFullYear()) * 12 + (later.getMonth() - earlier.getMonth())
  if (later.getDate() < earlier.getDate()) months--
  const years = Math.floor(months / 12)
  return {
    days,
    weeks: (days / 7).toFixed(1),
    months,
    years,
    direction: a <= b ? '' : 'Earlier date is after the later date; the result is absolute.'
  }
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label><span>Start</span><input v-model="start" type="date" /></label>
      <label><span>End</span><input v-model="end" type="date" /></label>
    </div>
    <div v-if="stats" class="tool-stat-grid">
      <div class="tool-stat"><b>{{ stats.days }}</b><span>Days</span></div>
      <div class="tool-stat"><b>{{ stats.weeks }}</b><span>Weeks</span></div>
      <div class="tool-stat"><b>{{ stats.months }}</b><span>Calendar months</span></div>
      <div class="tool-stat"><b>{{ stats.years }}</b><span>Full years</span></div>
    </div>
    <p class="tool-hint">Dates are local calendar dates at 00:00. Calendar months count whole months, not 30-day blocks. Daylight saving can make a day slightly longer but is ignored by date-only maths.</p>
    <p v-if="stats?.direction" class="tool-hint">{{ stats.direction }}</p>
  </div>
</template>
