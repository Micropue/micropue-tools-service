<script setup lang="ts">
const { t } = useI18n()

const length = ref(20)
const useUpper = ref(true)
const useLower = ref(true)
const useDigits = ref(true)
const useSymbols = ref(true)
const password = ref('')

const SETS = {
  upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  lower: 'abcdefghijkmnopqrstuvwxyz',
  digits: '23456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/'
}

function pools() {
  const pools: string[] = []
  if (useUpper.value) pools.push(SETS.upper)
  if (useLower.value) pools.push(SETS.lower)
  if (useDigits.value) pools.push(SETS.digits)
  if (useSymbols.value) pools.push(SETS.symbols)
  return pools
}

function randomInt(max: number) {
  const limit = Math.floor(0xffffffff / max) * max
  const value = new Uint32Array(1)
  do {
    crypto.getRandomValues(value)
  } while (value[0]! >= limit)
  return value[0]! % max
}

function generate() {
  const sets = pools()
  if (!sets.length) {
    password.value = ''
    return
  }

  const size = Math.min(128, Math.max(4, Number(length.value) || 4))
  const chars = sets.map(set => set[randomInt(set.length)]!)
  const all = sets.join('')

  while (chars.length < size) chars.push(all[randomInt(all.length)]!)

  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j]!, chars[i]!]
  }

  password.value = chars.join('')
}

const entropy = computed(() => {
  const sets = pools()
  if (!sets.length) return 0
  const pool = sets.join('').length
  return Math.round((Number(length.value) || 0) * Math.log2(pool))
})

const strength = computed(() => {
  if (entropy.value >= 100) return t('ui.strengthVeryStrong')
  if (entropy.value >= 70) return t('ui.strengthStrong')
  if (entropy.value >= 45) return t('ui.strengthMedium')
  return t('ui.strengthWeak')
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label>
        <span>Length</span>
        <InputNumber v-model="length" :min="4" :max="128" show-buttons size="small" />
      </label>
      <TButton size="small" :label="t('ui.generate')" @click="generate" />
    </div>

    <div class="tool-row">
      <label><Checkbox v-model="useUpper" binary /> A-Z</label>
      <label><Checkbox v-model="useLower" binary /> a-z</label>
      <label><Checkbox v-model="useDigits" binary /> 0-9</label>
      <label><Checkbox v-model="useSymbols" binary /> Symbols</label>
    </div>

    <pre class="tool-output">{{ password }}</pre>

    <div class="tool-actions">
      <ToolsCopyButton :text="password" />
      <span class="tool-hint">{{ t('ui.passwordEntropy', { bits: entropy, strength }) }}</span>
    </div>

    <p class="tool-hint">{{ t('ui.generatedLocally') }}</p>
  </div>
</template>
