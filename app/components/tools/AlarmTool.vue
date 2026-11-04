<script setup lang="ts">
import { beep } from '~/utils/beep'

const { t } = useI18n()
const time = ref('07:30')
const enabled = ref(false)
const fired = ref(false)
const now = ref<Date | null>(null)
const notification = ref(typeof Notification !== 'undefined' ? Notification.permission : 'denied')
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => {
    now.value = new Date()
    if (!enabled.value) return
    const current = `${String(now.value.getHours()).padStart(2, '0')}:${String(now.value.getMinutes()).padStart(2, '0')}`
    if (current === time.value && !fired.value) {
      fired.value = true
      beep(6)
      if (notification.value === 'granted') new Notification('Alarm', { body: `It is ${time.value}.` })
    }
    if (current !== time.value) fired.value = false
  }, 1000)
})
onBeforeUnmount(() => clearInterval(timer))

async function ask() {
  if (typeof Notification === 'undefined') return
  notification.value = await Notification.requestPermission()
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <input v-model="time" type="time" />
      <label><Checkbox v-model="enabled" binary /> Alarm enabled</label>
      <TButton v-if="notification !== 'granted'" size="small" severity="secondary" label="Enable notifications" @click="ask" />
    </div>
    <div class="clock">{{ now ? now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '--:--:--' }}</div>
    <p v-if="enabled" class="tool-hint">{{ t('ui.alarmArmed', { time }) }}</p>
    <p class="tool-hint" style="color: #f59e0b">A browser page cannot guarantee an alarm after it is closed, suspended or heavily throttled. Use your device's clock app for critical alarms.</p>
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
