<script setup lang="ts">
const clockRef = ref<HTMLElement | null>(null)
const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => (now.value = new Date()), 1000)
})
onBeforeUnmount(() => clearInterval(timer))

const time = computed(() => (now.value ? now.value.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '--:--:--'))
const date = computed(() => (now.value ? now.value.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''))

async function toggleFullscreen() {
  if (document.fullscreenElement) await document.exitFullscreen()
  else await clockRef.value?.requestFullscreen()
}
</script>

<template>
  <div ref="clockRef" class="fullscreen-clock">
    <div class="clock">{{ time }}</div>
    <p class="date">{{ date }}</p>
    <TButton size="small" severity="secondary" label="Toggle fullscreen" @click="toggleFullscreen" />
  </div>
</template>

<style scoped>
.fullscreen-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-height: 300px;
  padding: 2rem;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--p-text-color) 3%, transparent);
}

.fullscreen-clock:fullscreen {
  min-height: 100vh;
  background: #000;
  color: #fff;
}

.clock {
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: clamp(48px, 14vw, 160px);
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.date {
  margin: 0 0 0.8rem;
  font-size: clamp(14px, 2vw, 20px);
  color: var(--p-text-muted-color);
}
</style>
