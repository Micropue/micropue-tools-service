<script setup lang="ts">
import { beep, formatClock } from '~/utils/beep'

const focusMinutes = ref(25)
const breakMinutes = ref(5)
const mode = ref<'focus' | 'break'>('focus')
const remaining = ref(25 * 60_000)
const running = ref(false)
const completed = ref(0)
let endAt = 0
let timer: ReturnType<typeof setInterval> | undefined

function duration() {
  return Math.max(1, mode.value === 'focus' ? focusMinutes.value : breakMinutes.value) * 60_000
}

function start() {
  if (running.value) return
  if (remaining.value <= 0) remaining.value = duration()
  endAt = Date.now() + remaining.value
  running.value = true
  timer = setInterval(tick, 250)
}

function tick() {
  remaining.value = Math.max(0, endAt - Date.now())
  if (remaining.value > 0) return
  clearInterval(timer)
  running.value = false
  beep(3)
  if (mode.value === 'focus') {
    completed.value++
    mode.value = 'break'
  } else {
    mode.value = 'focus'
  }
  remaining.value = duration()
}

function pause() {
  clearInterval(timer)
  running.value = false
}

function reset() {
  pause()
  mode.value = 'focus'
  remaining.value = duration()
}

function switchMode(next: 'focus' | 'break') {
  pause()
  mode.value = next
  remaining.value = duration()
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="tool-ui">
    <div class="tool-actions">
      <TButton size="small" :severity="mode === 'focus' ? undefined : 'secondary'" label="Focus" @click="switchMode('focus')" />
      <TButton size="small" :severity="mode === 'break' ? undefined : 'secondary'" label="Break" @click="switchMode('break')" />
    </div>
    <div class="tool-row">
      <label><span>Focus minutes</span><InputNumber v-model="focusMinutes" :min="1" :max="180" size="small" /></label>
      <label><span>Break minutes</span><InputNumber v-model="breakMinutes" :min="1" :max="60" size="small" /></label>
    </div>
    <div class="clock">{{ formatClock(remaining) }}</div>
    <div class="tool-actions">
      <TButton size="small" :label="running ? 'Pause' : 'Start'" @click="running ? pause() : start()" />
      <TButton size="small" severity="secondary" label="Reset" @click="reset" />
    </div>
    <div class="tool-stat-grid">
      <div class="tool-stat"><b>{{ completed }}</b><span>Focus sessions completed</span></div>
      <div class="tool-stat"><b>{{ mode === 'focus' ? 'Focus' : 'Break' }}</b><span>Current phase</span></div>
    </div>
    <p class="tool-hint">A chime marks the end of each phase. The next phase does not start until you press Start. Keep the tab open.</p>
  </div>
</template>

<style scoped>
.clock {
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: clamp(42px, 9vw, 80px);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>
