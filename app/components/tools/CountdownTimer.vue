<script setup lang="ts">
import { beep, formatClock } from '~/utils/beep'

const minutes = ref(5)
const seconds = ref(0)
const remaining = ref(300_000)
const running = ref(false)
const done = ref(false)
const notification = ref(typeof Notification !== 'undefined' ? Notification.permission : 'denied')
let endAt = 0
let timer: ReturnType<typeof setInterval> | undefined

function resetFromInputs() {
  remaining.value = Math.max(0, (Number(minutes.value) || 0) * 60000 + (Number(seconds.value) || 0) * 1000)
  done.value = false
}

function tick() {
  remaining.value = Math.max(0, endAt - Date.now())
  if (remaining.value === 0) {
    clearInterval(timer)
    running.value = false
    done.value = true
    beep(3)
    if (notification.value === 'granted') new Notification('Countdown finished', { body: 'Your timer has reached zero.' })
  }
}

function start() {
  if (remaining.value <= 0) resetFromInputs()
  if (remaining.value <= 0) return
  done.value = false
  endAt = Date.now() + remaining.value
  running.value = true
  timer = setInterval(tick, 200)
}

function pause() {
  clearInterval(timer)
  running.value = false
}

function reset() {
  pause()
  resetFromInputs()
}

async function askNotification() {
  if (typeof Notification === 'undefined') return
  notification.value = await Notification.requestPermission()
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label><span>Minutes</span><InputNumber v-model="minutes" :min="0" :max="999" size="small" @update:model-value="!running && resetFromInputs()" /></label>
      <label><span>Seconds</span><InputNumber v-model="seconds" :min="0" :max="59" size="small" @update:model-value="!running && resetFromInputs()" /></label>
    </div>
    <div class="clock" :class="{ done }">{{ formatClock(remaining) }}</div>
    <div class="tool-actions">
      <TButton size="small" :label="running ? 'Pause' : 'Start'" @click="running ? pause() : start()" />
      <TButton size="small" severity="secondary" label="Reset" @click="reset" />
      <TButton v-if="notification !== 'granted'" size="small" severity="secondary" label="Enable notifications" @click="askNotification" />
    </div>
    <p v-if="done" class="tool-hint" style="color: #22c55e">Time is up.</p>
    <p class="tool-hint">Browsers throttle timers in background tabs, so the finish can be late or skipped when the tab sleeps. Keep the page visible for a reliable alarm.</p>
  </div>
</template>

<style scoped>
.clock {
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: clamp(42px, 9vw, 80px);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.done {
  color: #22c55e;
}
</style>
