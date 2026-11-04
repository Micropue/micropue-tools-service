<script setup lang="ts">
import { formatStopwatch } from '~/utils/beep'

const running = ref(false)
const elapsed = ref(0)
const laps = ref<string[]>([])
let startedAt = 0
let base = 0
let timer: ReturnType<typeof setInterval> | undefined

function tick() {
  elapsed.value = base + performance.now() - startedAt
}

function start() {
  if (running.value) return
  startedAt = performance.now()
  running.value = true
  timer = setInterval(tick, 30)
}

function pause() {
  if (!running.value) return
  base = elapsed.value
  running.value = false
  clearInterval(timer)
}

function reset() {
  pause()
  elapsed.value = 0
  base = 0
  laps.value = []
}

function lap() {
  if (elapsed.value > 0) laps.value = [formatStopwatch(elapsed.value), ...laps.value]
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="tool-ui">
    <div class="clock">{{ formatStopwatch(elapsed) }}</div>
    <div class="tool-actions">
      <TButton size="small" :label="running ? 'Pause' : 'Start'" @click="running ? pause() : start()" />
      <TButton size="small" severity="secondary" label="Lap" :disabled="!running" @click="lap" />
      <TButton size="small" severity="secondary" label="Reset" @click="reset" />
    </div>
    <template v-if="laps.length">
      <p class="tool-label">Laps</p>
      <pre class="tool-output">{{ laps.map((value, index) => `#${laps.length - index}  ${value}`).join('\n') }}</pre>
    </template>
    <p class="tool-hint">Uses performance.now() with an interval-based display; the elapsed time is not capped by frame rate.</p>
  </div>
</template>

<style scoped>
.clock {
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: clamp(42px, 9vw, 80px);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
</style>
