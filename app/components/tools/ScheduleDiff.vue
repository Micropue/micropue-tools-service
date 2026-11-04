<script setup lang="ts">
function localValue(offsetMinutes = 0) {
  const date = new Date(Date.now() + offsetMinutes * 60000)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}

const start = ref('')
const end = ref('')

onMounted(() => {
  start.value = localValue()
  end.value = localValue(90)
})

const diff = computed(() => {
  const a = new Date(start.value)
  const b = new Date(end.value)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null
  const milliseconds = Math.abs(b.getTime() - a.getTime())
  const minutes = Math.floor(milliseconds / 60000)
  return {
    days: Math.floor(minutes / 1440),
    hours: Math.floor((minutes % 1440) / 60),
    minutes: minutes % 60,
    totalMinutes: minutes,
    direction: b >= a ? 'End is after start' : 'End is before start'
  }
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label><span>Start</span><input v-model="start" type="datetime-local" /></label>
      <label><span>End</span><input v-model="end" type="datetime-local" /></label>
    </div>
    <div v-if="diff" class="tool-stat-grid">
      <div class="tool-stat"><b>{{ diff.days }}d {{ diff.hours }}h {{ diff.minutes }}m</b><span>Duration</span></div>
      <div class="tool-stat"><b>{{ diff.totalMinutes }}</b><span>Total minutes</span></div>
    </div>
    <p v-if="diff" class="tool-hint">{{ diff.direction }}.</p>
    <p class="tool-hint">Both values use this device's local timezone. The absolute difference is shown.</p>
  </div>
</template>
