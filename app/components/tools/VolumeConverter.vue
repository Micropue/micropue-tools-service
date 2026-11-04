<script setup lang="ts">
const units = [
  { label: 'mL', factor: 0.001 },
  { label: 'L', factor: 1 },
  { label: 'cm³', factor: 0.001 },
  { label: 'm³', factor: 1000 },
  { label: 'US fl oz', factor: 0.0295735295625 },
  { label: 'US cup', factor: 0.2365882365 },
  { label: 'US gal', factor: 3.785411784 },
  { label: 'imp gal', factor: 4.54609 }
]
</script>

<template>
  <ToolsUnitConverter :units="units" default-unit="L" note="US and imperial gallons differ. The labels state which system is used." />
</template>
