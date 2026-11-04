<script setup lang="ts">
const { t } = useI18n()

const raw = ref('')
const unit = ref<'auto' | 's' | 'ms'>('auto')
const dateInput = ref('')

onMounted(() => {
  raw.value = String(Math.floor(Date.now() / 1000))
  const now = new Date()
  dateInput.value = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
})

const parsed = computed(() => {
  const value = Number(raw.value)
  if (!Number.isFinite(value) || raw.value.trim() === '') return null
  const milliseconds = unit.value === 'ms' || (unit.value === 'auto' && raw.value.replace(/\D/g, '').length >= 13) ? value : value * 1000
  const date = new Date(milliseconds)
  if (Number.isNaN(date.getTime())) return null
  return {
    local: date.toLocaleString(),
    utc: date.toUTCString(),
    iso: date.toISOString(),
    seconds: Math.floor(milliseconds / 1000),
    milliseconds,
    zone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
})

const dateResult = computed(() => {
  if (!dateInput.value) return null
  const date = new Date(dateInput.value)
  if (Number.isNaN(date.getTime())) return null
  return {
    seconds: Math.floor(date.getTime() / 1000),
    milliseconds: date.getTime()
  }
})
</script>

<template>
  <div class="tool-ui">
    <p class="tool-label">Timestamp → date</p>
    <div class="tool-row">
      <InputText v-model="raw" size="small" placeholder="1700000000" />
      <Select
        v-model="unit"
        :options="[{ label: 'Auto', value: 'auto' }, { label: 'Seconds', value: 's' }, { label: 'Milliseconds', value: 'ms' }]"
        option-label="label"
        option-value="value"
        size="small"
      />
    </div>

    <div v-if="parsed" class="tool-stat-grid">
      <div class="tool-stat"><b>{{ parsed.local }}</b><span>Local ({{ parsed.zone }})</span></div>
      <div class="tool-stat"><b>{{ parsed.utc }}</b><span>UTC</span></div>
      <div class="tool-stat"><b>{{ parsed.iso }}</b><span>ISO 8601</span></div>
      <div class="tool-stat"><b>{{ parsed.seconds }}</b><span>Unix seconds</span></div>
    </div>

    <div class="tool-divider" />

    <p class="tool-label">Date → timestamp</p>
    <div class="tool-row">
      <input v-model="dateInput" type="datetime-local" />
      <template v-if="dateResult">
        <span class="tool-hint">{{ t('ui.timestampParts', { seconds: dateResult.seconds, ms: dateResult.milliseconds }) }}</span>
        <ToolsCopyButton :text="String(dateResult.seconds)" />
      </template>
    </div>

    <p class="tool-hint">{{ t('ui.timezoneLabel', { zone: Intl.DateTimeFormat().resolvedOptions().timeZone }) }}</p>
  </div>
</template>
