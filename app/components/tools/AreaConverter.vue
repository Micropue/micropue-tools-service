<script setup lang="ts">
const units = [
  { label: 'mm²', factor: 0.000001 },
  { label: 'cm²', factor: 0.0001 },
  { label: 'm²', factor: 1 },
  { label: 'km²', factor: 1_000_000 },
  { label: 'in²', factor: 0.00064516 },
  { label: 'ft²', factor: 0.09290304 },
  { label: 'yd²', factor: 0.83612736 },
  { label: 'acre', factor: 4046.8564224 },
  { label: 'ha', factor: 10000 }
]
</script>

<template>
  <ToolsUnitConverter :units="units" default-unit="m²" />
</template>
