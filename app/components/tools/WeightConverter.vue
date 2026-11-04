<script setup lang="ts">
const units = [
  { label: 'mg', factor: 0.000001 },
  { label: 'g', factor: 0.001 },
  { label: 'kg', factor: 1 },
  { label: 't', factor: 1000 },
  { label: 'oz', factor: 0.028349523125 },
  { label: 'lb', factor: 0.45359237 },
  { label: 'stone', factor: 6.35029318 }
]
</script>

<template>
  <ToolsUnitConverter :units="units" default-unit="kg" />
</template>
