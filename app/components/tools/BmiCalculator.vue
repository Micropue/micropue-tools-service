<script setup lang="ts">
const height = ref(170)
const weight = ref(65)

const bmi = computed(() => {
  const meters = Number(height.value) / 100
  if (!meters || meters <= 0) return null
  return Number(weight.value) / (meters * meters)
})

const category = computed(() => {
  if (bmi.value === null) return ''
  if (bmi.value < 18.5) return 'Underweight'
  if (bmi.value < 25) return 'Normal range'
  if (bmi.value < 30) return 'Overweight'
  return 'Obese'
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label><span>Height (cm)</span><InputNumber v-model="height" :min="50" :max="260" size="small" /></label>
      <label><span>Weight (kg)</span><InputNumber v-model="weight" :min="2" :max="500" size="small" /></label>
    </div>
    <div v-if="bmi" class="tool-stat-grid">
      <div class="tool-stat"><b>{{ bmi.toFixed(1) }}</b><span>BMI</span></div>
      <div class="tool-stat"><b>{{ category }}</b><span>WHO category</span></div>
    </div>
    <p class="tool-hint">BMI is a rough population measure. It does not distinguish muscle from fat and is not a medical diagnosis. Children, pregnant people and athletes need different assessments.</p>
  </div>
</template>
