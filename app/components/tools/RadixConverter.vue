<script setup lang="ts">
const { t } = useI18n()
const raw = ref('255')
const base = ref(10)
const error = ref('')

const parsed = computed(() => {
  error.value = ''
  const clean = raw.value.trim().toLowerCase().replace(/^0[bxo]/, '')
  if (!clean || !/^-?[0-9a-z]+$/.test(clean)) return null
  const negative = clean.startsWith('-')
  const digits = negative ? clean.slice(1) : clean
  try {
    let value = 0n
    for (const char of digits) {
      const digit = Number.parseInt(char, 36)
      if (Number.isNaN(digit) || digit >= base.value) throw new Error(`Digit "${char}" is not valid in base ${base.value}.`)
      value = value * BigInt(base.value) + BigInt(digit)
    }
    return negative ? -value : value
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
    return null
  }
})

const results = computed(() => {
  if (parsed.value === null) return []
  return [
    { label: 'Binary (2)', value: parsed.value.toString(2) },
    { label: 'Octal (8)', value: parsed.value.toString(8) },
    { label: 'Decimal (10)', value: parsed.value.toString(10) },
    { label: 'Hex (16)', value: parsed.value.toString(16).toUpperCase() }
  ]
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <InputText v-model="raw" size="small" placeholder="Value" style="min-width: 200px" />
      <label>
        <span>Input base</span>
        <Select v-model="base" :options="[2, 8, 10, 16]" size="small" />
      </label>
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="raw = ''" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div class="tool-stat-grid">
      <div v-for="item in results" :key="item.label" class="tool-stat">
        <b>{{ item.value }}</b>
        <span>{{ item.label }}</span>
      </div>
    </div>
    <div class="tool-actions">
      <ToolsCopyButton v-for="item in results" :key="item.label" :text="item.value" />
    </div>
    <p class="tool-hint">Supports arbitrary-size negative and positive integers. Fractions are not converted.</p>
  </div>
</template>
