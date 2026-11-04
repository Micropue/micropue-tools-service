<script setup lang="ts">
const { t } = useI18n()
const min = ref(1)
const max = ref(100)
const count = ref(5)
const unique = ref(true)
const secure = ref(true)
const output = ref<number[]>([])

function generate() {
  const low = Math.ceil(Math.min(Number(min.value), Number(max.value)))
  const high = Math.floor(Math.max(Number(min.value), Number(max.value)))
  const total = Math.min(1000, Math.max(1, Number(count.value) || 1))
  const range = high - low + 1
  if (range <= 0) {
    output.value = []
    return
  }
  if (unique.value && total > range) {
    output.value = []
    return
  }

  const random = (size: number) => (secure.value ? secureRandomInt(size) : Math.floor(Math.random() * size))
  const result: number[] = []
  if (unique.value) {
    const pool = Array.from({ length: range }, (_, index) => low + index)
    for (let i = 0; i < total; i++) {
      const index = random(pool.length)
      result.push(pool[index]!)
      pool.splice(index, 1)
    }
  } else {
    for (let i = 0; i < total; i++) result.push(low + random(range))
  }
  output.value = result
}

const error = computed(() => {
  const low = Math.ceil(Math.min(Number(min.value), Number(max.value)))
  const high = Math.floor(Math.max(Number(min.value), Number(max.value)))
  if (unique.value && Number(count.value) > high - low + 1) return 'Not enough unique values in this range.'
  return ''
})

generate()
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label><span>Min</span><InputNumber v-model="min" size="small" /></label>
      <label><span>Max</span><InputNumber v-model="max" size="small" /></label>
      <label><span>Count</span><InputNumber v-model="count" :min="1" :max="1000" size="small" /></label>
    </div>
    <div class="tool-row">
      <label><Checkbox v-model="unique" binary /> No repeats</label>
      <label><Checkbox v-model="secure" binary /> Cryptographically secure</label>
      <TButton size="small" :label="t('ui.generate')" @click="generate" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <pre class="tool-output">{{ output.join(', ') }}</pre>
    <div class="tool-actions"><ToolsCopyButton :text="output.join(', ')" /></div>
    <p class="tool-hint">Secure mode uses crypto.getRandomValues. Standard mode uses Math.random and is fine for games, not for secrets.</p>
  </div>
</template>
