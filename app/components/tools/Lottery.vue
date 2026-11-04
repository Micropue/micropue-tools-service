<script setup lang="ts">
const { t } = useI18n()
const entries = ref('Alice\nBob\nCarol\nDave\nEve')
const count = ref(1)
const winners = ref<string[]>([])

function draw() {
  const pool = entries.value.split('\n').map(line => line.trim()).filter(Boolean)
  const total = Math.min(pool.length, Math.max(1, Number(count.value) || 1))
  winners.value = []
  for (let i = 0; i < total; i++) {
    const index = secureRandomInt(pool.length)
    winners.value.push(pool[index]!)
    pool.splice(index, 1)
  }
}
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="entries" class="tool-textarea" rows="8" placeholder="One entry per line…" />
    <div class="tool-row">
      <label><span>Winners</span><InputNumber v-model="count" :min="1" :max="100" size="small" /></label>
      <TButton size="small" :label="t('ui.generate')" @click="draw" />
    </div>
    <div class="tool-stat-grid">
      <div v-for="(winner, index) in winners" :key="`${winner}-${index}`" class="tool-stat">
        <b>{{ winner }}</b>
        <span>#{{ index + 1 }}</span>
      </div>
    </div>
    <div class="tool-actions"><ToolsCopyButton :text="winners.join('\n')" /></div>
    <p class="tool-hint">Drawing without replacement, with crypto.getRandomValues. No entry is sent anywhere.</p>
  </div>
</template>
