<script setup lang="ts">
import { beep, formatClock } from '~/utils/beep'

const timers = ref([
  { id: 1, name: 'Tea', minutes: 3, remaining: 180_000, running: false, endAt: 0 },
  { id: 2, name: 'Focus', minutes: 10, remaining: 600_000, running: false, endAt: 0 }
])
let nextId = 3
let ticker: ReturnType<typeof setInterval> | undefined

function start(timer: (typeof timers.value)[number]) {
  if (timer.running) return
  if (timer.remaining <= 0) timer.remaining = Math.max(0, timer.minutes * 60000)
  if (timer.remaining <= 0) return
  timer.endAt = Date.now() + timer.remaining
  timer.running = true
  ensureTicker()
}

function pause(timer: (typeof timers.value)[number]) {
  timer.running = false
}

function reset(timer: (typeof timers.value)[number]) {
  timer.running = false
  timer.remaining = Math.max(0, timer.minutes * 60000)
}

function remove(id: number) {
  timers.value = timers.value.filter(timer => timer.id !== id)
}

function add() {
  timers.value.push({ id: nextId++, name: `Timer ${nextId - 1}`, minutes: 5, remaining: 300_000, running: false, endAt: 0 })
}

function ensureTicker() {
  if (ticker) return
  ticker = setInterval(() => {
    let active = false
    for (const timer of timers.value) {
      if (!timer.running) continue
      timer.remaining = Math.max(0, timer.endAt - Date.now())
      if (timer.remaining === 0) {
        timer.running = false
        beep(3)
      } else {
        active = true
      }
    }
    if (!active && timers.value.every(timer => !timer.running)) {
      clearInterval(ticker)
      ticker = undefined
    }
  }, 250)
}

onBeforeUnmount(() => clearInterval(ticker))
</script>

<template>
  <div class="tool-ui">
    <div v-for="timer in timers" :key="timer.id" class="timer">
      <div class="tool-row">
        <InputText v-model="timer.name" size="small" style="width: 140px" />
        <InputNumber v-model="timer.minutes" :min="0" :max="999" size="small" @update:model-value="!timer.running && reset(timer)" />
        <span class="clock">{{ formatClock(timer.remaining) }}</span>
        <TButton size="small" :label="timer.running ? 'Pause' : 'Start'" @click="timer.running ? pause(timer) : start(timer)" />
        <TButton size="small" severity="secondary" label="Reset" @click="reset(timer)" />
        <TButton size="small" text severity="secondary" icon="pi pi-times" aria-label="Remove" @click="remove(timer.id)" />
      </div>
    </div>
    <div class="tool-actions">
      <TButton size="small" severity="secondary" label="Add timer" @click="add" />
    </div>
    <p class="tool-hint">All timers share one local page timer. Background throttling applies, so keep this tab open.</p>
  </div>
</template>

<style scoped>
.timer {
  padding: 0.6rem;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
  border-radius: 9px;
}

.clock {
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: 1.4rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  min-width: 72px;
}
</style>
