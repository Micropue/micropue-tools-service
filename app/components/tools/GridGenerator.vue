<script setup lang="ts">
const columns = ref(3)
const rows = ref(2)
const gap = ref(12)
const rowHeight = ref(70)

const css = computed(
  () => `display: grid;\ngrid-template-columns: repeat(${columns.value}, 1fr);\ngrid-template-rows: repeat(${rows.value}, ${rowHeight.value}px);\ngap: ${gap.value}px;`
)

const cells = computed(() => columns.value * rows.value)
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label>
        <span>Columns</span>
        <InputNumber v-model="columns" :min="1" :max="8" show-buttons size="small" />
      </label>
      <label>
        <span>Rows</span>
        <InputNumber v-model="rows" :min="1" :max="8" show-buttons size="small" />
      </label>
      <label>
        <span>Gap</span>
        <InputNumber v-model="gap" :min="0" :max="60" size="small" />
      </label>
      <label>
        <span>Row height</span>
        <InputNumber v-model="rowHeight" :min="30" :max="200" size="small" />
      </label>
    </div>

    <div class="preview" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`, gap: `${gap}px` }">
      <div v-for="index in cells" :key="index" class="cell">{{ index }}</div>
    </div>

    <p class="tool-label">CSS</p>
    <pre class="tool-output">{{ css }}</pre>
    <div class="tool-actions"><ToolsCopyButton :text="css" /></div>
  </div>
</template>

<style scoped>
.preview {
  display: grid;
  padding: 1rem;
  border: 1px dashed color-mix(in srgb, var(--p-text-color) 20%, transparent);
  border-radius: 12px;
}

.cell {
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: color-mix(in srgb, var(--p-text-color) 82%, transparent);
  color: var(--p-content-background, #fff);
  font-weight: 700;
}
</style>
