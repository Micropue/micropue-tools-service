<script setup lang="ts">
const { t } = useI18n()

const count = ref(5)
const output = ref<string[]>([])

function generate() {
  const total = Math.min(100, Math.max(1, Number(count.value) || 1))
  output.value = Array.from({ length: total }, () => crypto.randomUUID())
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label>
        <span>Count</span>
        <InputNumber v-model="count" :min="1" :max="100" show-buttons size="small" />
      </label>
      <TButton size="small" :label="t('ui.generate')" @click="generate" />
    </div>

    <pre class="tool-output">{{ output.join('\n') }}</pre>

    <div class="tool-actions">
      <ToolsCopyButton :text="output.join('\n')" />
    </div>

    <p class="tool-hint">UUID v4 generated locally with crypto.randomUUID().</p>
  </div>
</template>
