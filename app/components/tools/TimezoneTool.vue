<script setup lang="ts">
const zones = ref(['UTC', 'America/New_York', 'Europe/London', 'Asia/Shanghai', 'Asia/Tokyo'])
const options = [
  'UTC',
  'America/Los_Angeles',
  'America/New_York',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Africa/Cairo',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland'
]
const now = ref<Date | null>(null)
const selected = ref('')
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  const local = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (!zones.value.includes(local)) zones.value.splice(1, 0, local)
  now.value = new Date()
  timer = setInterval(() => (now.value = new Date()), 1000)
})
onBeforeUnmount(() => clearInterval(timer))

function add() {
  if (selected.value && !zones.value.includes(selected.value)) zones.value.push(selected.value)
  selected.value = ''
}

function time(zone: string) {
  if (!now.value) return '--:--:--'
  return new Intl.DateTimeFormat(undefined, { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now.value)
}

function date(zone: string) {
  if (!now.value) return ''
  return new Intl.DateTimeFormat(undefined, { timeZone: zone, month: 'short', day: 'numeric', weekday: 'short' }).format(now.value)
}

function offset(zone: string) {
  if (!now.value) return ''
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' }).formatToParts(now.value)
  return parts.find(part => part.type === 'timeZoneName')?.value ?? ''
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <Select v-model="selected" :options="options" filter size="small" placeholder="Add a timezone" style="min-width: 220px" />
      <TButton size="small" label="Add" :disabled="!selected" @click="add" />
    </div>
    <div class="zones">
      <div v-for="zone in zones" :key="zone" class="zone">
        <div>
          <b>{{ time(zone) }}</b>
          <span>{{ date(zone) }}</span>
        </div>
        <div class="zone-meta">
          <span>{{ zone }}</span>
          <span class="tool-hint">{{ offset(zone) }}</span>
        </div>
        <TButton size="small" text severity="secondary" icon="pi pi-times" aria-label="Remove timezone" @click="zones = zones.filter(item => item !== zone)" />
      </div>
    </div>
    <p class="tool-hint">Uses the browser's IANA timezone database via Intl.DateTimeFormat. Daylight-saving changes are applied automatically.</p>
  </div>
</template>

<style scoped>
.zones {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.zone {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.7rem;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
  border-radius: 9px;
}

.zone b {
  display: block;
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: 1.35rem;
  font-variant-numeric: tabular-nums;
}

.zone span {
  font-size: 0.74rem;
  color: var(--p-text-muted-color);
}

.zone-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.8rem;
}

@media (max-width: 600px) {
  .zone {
    grid-template-columns: 1fr auto;
  }

  .zone-meta {
    display: none;
  }
}
</style>
