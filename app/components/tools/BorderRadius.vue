<script setup lang="ts">
const { t } = useI18n()
const linked = ref(true)
const corners = ref({ tl: 24, tr: 24, br: 24, bl: 24 })

watch(linked, value => {
  if (value) corners.value = { tl: corners.value.tl, tr: corners.value.tl, br: corners.value.tl, bl: corners.value.tl }
})

watch(
  corners,
  value => {
    if (linked.value && new Set([value.tl, value.tr, value.br, value.bl]).size > 1) {
      corners.value = { tl: value.tl, tr: value.tl, br: value.tl, bl: value.tl }
    }
  },
  { deep: true }
)

const radius = computed(() => {
  const { tl, tr, br, bl } = corners.value
  return tl === tr && tr === br && br === bl ? `${tl}px` : `${tl}px ${tr}px ${br}px ${bl}px`
})
</script>

<template>
  <div class="tool-ui">
    <div class="preview-wrap">
      <div class="preview" :style="{ borderRadius: radius }" />
    </div>

    <div class="tool-row">
      <label><Checkbox v-model="linked" binary /> Link all corners</label>
    </div>
    <div class="tool-row">
      <label>
        <span>Top left</span>
        <InputNumber v-model="corners.tl" :min="0" :max="200" size="small" />
      </label>
      <label>
        <span>Top right</span>
        <InputNumber v-model="corners.tr" :min="0" :max="200" :disabled="linked" size="small" />
      </label>
      <label>
        <span>Bottom right</span>
        <InputNumber v-model="corners.br" :min="0" :max="200" :disabled="linked" size="small" />
      </label>
      <label>
        <span>Bottom left</span>
        <InputNumber v-model="corners.bl" :min="0" :max="200" :disabled="linked" size="small" />
      </label>
    </div>

    <p class="tool-label">CSS</p>
    <pre class="tool-output">border-radius: {{ radius }};</pre>
    <div class="tool-actions"><ToolsCopyButton :text="`border-radius: ${radius};`" /></div>
  </div>
</template>

<style scoped>
.preview-wrap {
  display: grid;
  place-items: center;
  min-height: 220px;
  border: 1px dashed color-mix(in srgb, var(--p-text-color) 20%, transparent);
  border-radius: 12px;
}

.preview {
  width: 180px;
  height: 180px;
  background: color-mix(in srgb, var(--p-text-color) 82%, transparent);
}
</style>
