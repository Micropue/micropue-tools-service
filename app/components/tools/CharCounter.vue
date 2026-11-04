<script setup lang="ts">
const text = ref('')

const stats = computed(() => {
  const value = text.value
  const chars = [...value]
  const noSpaces = chars.filter(char => !/\s/.test(char))
  const letters = value.match(/\p{L}/gu)?.length ?? 0
  const digits = value.match(/\p{N}/gu)?.length ?? 0
  const cjk = value.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g)?.length ?? 0
  const words = value.trim() ? (value.trim().match(/[\p{L}\p{N}]+/gu)?.length ?? 0) : 0
  const lines = value === '' ? 0 : value.split('\n').length
  const paragraphs = value.trim() ? value.split(/\n\s*\n/).filter(block => block.trim() !== '').length : 0

  return [
    { label: 'Characters', value: chars.length },
    { label: 'Characters (no spaces)', value: noSpaces.length },
    { label: 'Letters', value: letters },
    { label: 'Digits', value: digits },
    { label: 'CJK characters', value: cjk },
    { label: 'Words', value: words },
    { label: 'Lines', value: lines },
    { label: 'Paragraphs', value: paragraphs }
  ]
})
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="text" class="tool-textarea" rows="10" placeholder="Type or paste text…" />

    <div class="tool-stat-grid">
      <div v-for="stat in stats" :key="stat.label" class="tool-stat">
        <b>{{ stat.value }}</b>
        <span>{{ stat.label }}</span>
      </div>
    </div>
  </div>
</template>
