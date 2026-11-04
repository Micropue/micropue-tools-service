<script setup lang="ts">
import JsBarcode from 'jsbarcode'

const format = ref<'CODE128' | 'EAN13'>('CODE128')
const value = ref('MICROPUE-TOOLS')
const canvas = ref<HTMLCanvasElement | null>(null)
const error = ref('')

function ean13Valid(input: string) {
  if (!/^\d{12,13}$/.test(input)) return false
  if (input.length === 12) return true
  const digits = [...input].map(Number)
  const sum = digits.slice(0, 12).reduce((total, digit, index) => total + digit * (index % 2 ? 3 : 1), 0)
  return (10 - (sum % 10)) % 10 === digits[12]
}

function render() {
  error.value = ''
  const el = canvas.value
  if (!el) return
  try {
    if (format.value === 'EAN13' && !ean13Valid(value.value.trim())) {
      throw new Error('EAN-13 needs 12 or 13 digits and a valid check digit.')
    }
    JsBarcode(el, value.value.trim() || ' ', { format: format.value, width: 2, height: 110, displayValue: true, margin: 12 })
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}

onMounted(render)
watch([value, format], render)

function download() {
  if (!canvas.value) return
  canvas.value.toBlob(blob => blob && downloadBlob(blob, `barcode-${format.value.toLowerCase()}.png`), 'image/png')
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <Select v-model="format" :options="['CODE128', 'EAN13']" size="small" />
      <InputText v-model="value" size="small" placeholder="Value" style="flex: 1; min-width: 200px" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div class="barcode-wrap"><canvas ref="canvas" /></div>
    <div class="tool-actions">
      <TButton size="small" label="Download PNG" @click="download" />
    </div>
    <p class="tool-hint">Code 128 accepts printable ASCII. EAN-13 requires 12 or 13 digits; a 13th digit is checked as the check digit.</p>
  </div>
</template>

<style scoped>
.barcode-wrap {
  overflow-x: auto;
  padding: 0.7rem;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 10px;
  background: #fff;
}
</style>
