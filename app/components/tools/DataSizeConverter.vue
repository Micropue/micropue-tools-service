<script setup lang="ts">
const units = [
  { label: 'bit', factor: 1 },
  { label: 'Byte', factor: 8 },
  { label: 'KB (1000)', factor: 8000 },
  { label: 'MB (1000²)', factor: 8_000_000 },
  { label: 'GB (1000³)', factor: 8_000_000_000 },
  { label: 'TB (1000⁴)', factor: 8_000_000_000_000 },
  { label: 'KiB (1024)', factor: 8192 },
  { label: 'MiB (1024²)', factor: 8_388_608 },
  { label: 'GiB (1024³)', factor: 8_589_934_592 },
  { label: 'TiB (1024⁴)', factor: 8_796_093_022_208 }
]
</script>

<template>
  <ToolsUnitConverter :units="units" default-unit="MB (1000²)" note="KB/MB/GB use 1000-based units; KiB/MiB/GiB use 1024-based units. Drive makers and operating systems often disagree on which one to show." />
</template>
