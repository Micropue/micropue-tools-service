<script setup lang="ts">
const { t } = useI18n()
const type = ref<'linear' | 'radial'>('linear')
const angle = ref(135)
const shape = ref<'circle' | 'ellipse'>('circle')
const stops = ref([
  { color: '#18181b', position: 0 },
  { color: '#71717a', position: 100 }
])

const css = computed(() => {
  const list = [...stops.value]
    .sort((a, b) => a.position - b.position)
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ')
  return type.value === 'linear' ? `linear-gradient(${angle.value}deg, ${list})` : `radial-gradient(${shape.value} at center, ${list})`
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <TButton size="small" :severity="type === 'linear' ? undefined : 'secondary'" label="Linear" @click="type = 'linear'" />
      <TButton size="small" :severity="type === 'radial' ? undefined : 'secondary'" label="Radial" @click="type = 'radial'" />
      <label v-if="type === 'linear'">
        <span>Angle</span>
        <InputNumber v-model="angle" :min="0" :max="360" size="small" />
      </label>
      <Select
        v-else
        v-model="shape"
        :options="[{ label: 'Circle', value: 'circle' }, { label: 'Ellipse', value: 'ellipse' }]"
        option-label="label"
        option-value="value"
        size="small"
      />
    </div>

    <div class="preview" :style="{ background: css }" />

    <div v-for="(stop, index) in stops" :key="index" class="tool-row">
      <input v-model="stop.color" type="color" class="color-input" />
      <InputText v-model="stop.color" size="small" style="width: 110px" />
      <label>
        <span>Position</span>
        <InputNumber v-model="stop.position" :min="0" :max="100" size="small" />
      </label>
      <TButton v-if="stops.length > 2" size="small" severity="secondary" label="Remove" @click="stops.splice(index, 1)" />
    </div>
    <div class="tool-actions">
      <TButton size="small" severity="secondary" label="Add color stop" @click="stops.push({ color: '#ffffff', position: 50 })" />
    </div>

    <p class="tool-label">CSS</p>
    <pre class="tool-output">background: {{ css }};</pre>
    <div class="tool-actions">
      <ToolsCopyButton :text="`background: ${css};`" />
    </div>
  </div>
</template>

<style scoped>
.preview {
  min-height: 200px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
}

.color-input {
  width: 42px;
  height: 34px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
  border-radius: 7px;
  background: transparent;
}
</style>
