<script setup lang="ts">
const props = defineProps<{
  units: { label: string; factor: number }[]
  defaultUnit?: string
  note?: string
}>()

const amount = ref(1)
const from = ref(props.defaultUnit ?? props.units[0]!.label)

function format(value: number) {
  const absolute = Math.abs(value)
  if (absolute !== 0 && (absolute < 0.0001 || absolute >= 1e9)) return value.toExponential(4)
  return Number(value.toPrecision(8)).toString()
}

const results = computed(() => {
  const unit = props.units.find(item => item.label === from.value)
  if (!unit || !Number.isFinite(Number(amount.value))) return []
  const base = Number(amount.value) * unit.factor
  return props.units.map(item => ({
    label: item.label,
    value: format(base / item.factor)
  }))
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <InputNumber v-model="amount" :min="-1e15" :max="1e15" size="small" :input-style="{ minWidth: '160px' }" />
      <Select
        v-model="from"
        :options="units.map(unit => unit.label)"
        size="small"
        style="min-width: 100px"
      />
    </div>

    <div class="tool-stat-grid">
      <div v-for="item in results" :key="item.label" class="tool-stat">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </div>
    </div>

    <p v-if="note" class="tool-hint">{{ note }}</p>
  </div>
</template>
