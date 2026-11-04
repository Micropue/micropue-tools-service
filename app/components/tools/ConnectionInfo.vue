<script setup lang="ts">
const { t } = useI18n()
const rows = ref<{ label: string; value: string }[]>([])

function update() {
  const connection = (navigator as any).connection ?? (navigator as any).mozConnection ?? (navigator as any).webkitConnection
  rows.value = [
    { label: 'Online', value: navigator.onLine ? 'Yes' : 'No' },
    { label: 'Effective type', value: connection?.effectiveType ?? 'Not exposed' },
    { label: 'Downlink', value: connection?.downlink ? `${connection.downlink} Mbit/s${t('ui.estimate')}` : 'Not exposed' },
    { label: 'Round-trip time', value: connection?.rtt ? `${connection.rtt} ms${t('ui.estimate')}` : 'Not exposed' },
    { label: 'Save data', value: connection?.saveData ? 'Enabled' : 'Off or not exposed' },
    { label: 'Connection type', value: connection?.type ?? 'Not exposed' }
  ]
}

onMounted(() => {
  update()
  window.addEventListener('online', update)
  window.addEventListener('offline', update)
  ;(navigator as any).connection?.addEventListener?.('change', update)
})
onBeforeUnmount(() => {
  window.removeEventListener('online', update)
  window.removeEventListener('offline', update)
  ;(navigator as any).connection?.removeEventListener?.('change', update)
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-stat-grid">
      <div v-for="item in rows" :key="item.label" class="tool-stat">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </div>
    </div>
    <p class="tool-hint">These values are coarse browser hints, not a speed test. Many browsers do not expose them at all.</p>
  </div>
</template>
