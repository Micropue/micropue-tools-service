<script setup lang="ts">
const data = ref<{ label: string; value: string }[]>([])
const ua = ref('')

onMounted(async () => {
  ua.value = navigator.userAgent
  const browser = [
    ['Edge', /Edg\/([\d.]+)/],
    ['Opera', /OPR\/([\d.]+)/],
    ['Samsung Internet', /SamsungBrowser\/([\d.]+)/],
    ['Firefox', /Firefox\/([\d.]+)/],
    ['Chrome', /Chrome\/([\d.]+)/],
    ['Safari', /Version\/([\d.]+).*Safari/]
  ].find(([, pattern]) => (pattern as RegExp).test(ua.value)) as [string, RegExp] | undefined
  const version = browser ? ua.value.match(browser[1])?.[1] ?? '' : ''
  const os = /Windows NT 10/.test(ua.value) ? 'Windows 10/11' : /Windows NT/.test(ua.value) ? 'Windows' : /Android/.test(ua.value) ? 'Android' : /iPhone|iPad|iPod/.test(ua.value) ? 'iOS' : /Mac OS X/.test(ua.value) ? 'macOS' : /Linux/.test(ua.value) ? 'Linux' : 'Unknown'
  const device = /iPad|Tablet/.test(ua.value) ? 'Tablet' : /Mobi|Android|iPhone/.test(ua.value) ? 'Mobile' : 'Desktop'

  data.value = [
    { label: 'Browser', value: browser ? `${browser[0]} ${version}` : 'Unknown' },
    { label: 'Operating system', value: os },
    { label: 'Device class', value: device },
    { label: 'Language', value: navigator.language },
    { label: 'Platform', value: (navigator as any).userAgentData?.platform ?? navigator.platform ?? 'Unknown' }
  ]
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-stat-grid">
      <div v-for="item in data" :key="item.label" class="tool-stat">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </div>
    </div>
    <p class="tool-label">Raw user agent</p>
    <pre class="tool-output">{{ ua }}</pre>
    <div class="tool-actions"><ToolsCopyButton :text="ua" /></div>
    <p class="tool-hint">User-agent strings are self-reported, shortened by some browsers and spoofable. This is a hint, not a reliable identification.</p>
  </div>
</template>
