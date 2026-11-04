<script setup lang="ts">
const units = [
  { label: 'mm', factor: 0.001 },
  { label: 'cm', factor: 0.01 },
  { label: 'm', factor: 1 },
  { label: 'km', factor: 1000 },
  { label: 'in', factor: 0.0254 },
  { label: 'ft', factor: 0.3048 },
  { label: 'yd', factor: 0.9144 },
  { label: 'mi', factor: 1609.344 },
  { label: 'px (96 DPI)', factor: 0.0254 / 96 }
]
</script>

<template>
  <ToolsUnitConverter :units="units" default-unit="cm" note="px is converted at 96 CSS pixels per inch. A physical pixel depends on the display and DPI, so px is not a reliable print unit." />
</template>
