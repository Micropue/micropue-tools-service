<script setup lang="ts">
const ssid = ref('')
const password = ref('')
const security = ref<'WPA' | 'WEP' | 'nopass'>('WPA')
const hidden = ref(false)
const ecc = ref<'L' | 'M' | 'Q' | 'H'>('M')

function escapeWifi(value: string) {
  return value.replace(/([\\;,:"])/g, '\\$1')
}

const payload = computed(() => {
  if (!ssid.value) return ''
  return `WIFI:T:${security.value};S:${escapeWifi(ssid.value)};${security.value === 'nopass' ? '' : `P:${escapeWifi(password.value)};`}${hidden.value ? 'H:true;' : ''};`
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <InputText v-model="ssid" size="small" placeholder="Network name (SSID)" style="flex: 1; min-width: 200px" />
    </div>
    <div class="tool-row">
      <InputText v-model="password" size="small" placeholder="Password" style="flex: 1; min-width: 200px" />
      <Select
        v-model="security"
        :options="[{ label: 'WPA/WPA2', value: 'WPA' }, { label: 'WEP', value: 'WEP' }, { label: 'Open', value: 'nopass' }]"
        option-label="label"
        option-value="value"
        size="small"
      />
      <label><Checkbox v-model="hidden" binary /> Hidden network</label>
      <Select v-model="ecc" :options="['L', 'M', 'Q', 'H']" size="small" />
    </div>
    <ToolsQrCanvas v-if="payload" :text="payload" :ecc="ecc" filename="wifi-qr.png" />
    <pre v-if="payload" class="tool-output">{{ payload }}</pre>
    <p v-else class="tool-hint">Enter a network name to create the code.</p>
    <p class="tool-hint">The password is encoded into the QR image. Anyone who scans it can join the network, so share it carefully.</p>
  </div>
</template>
