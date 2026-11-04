<script setup lang="ts">
const direction = ref<'row' | 'column'>('row')
const wrap = ref<'nowrap' | 'wrap'>('wrap')
const justify = ref('flex-start')
const align = ref('stretch')
const gap = ref(12)

const options = {
  justify: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
  align: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline']
}

const css = computed(
  () => `display: flex;\nflex-direction: ${direction.value};\nflex-wrap: ${wrap.value};\njustify-content: ${justify.value};\nalign-items: ${align.value};\ngap: ${gap.value}px;`
)
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <label>
        <span>Direction</span>
        <Select v-model="direction" :options="['row', 'column']" size="small" />
      </label>
      <label>
        <span>Wrap</span>
        <Select v-model="wrap" :options="['nowrap', 'wrap']" size="small" />
      </label>
      <label>
        <span>Gap</span>
        <InputNumber v-model="gap" :min="0" :max="80" size="small" />
      </label>
    </div>
    <div class="tool-row">
      <label>
        <span>justify-content</span>
        <Select v-model="justify" :options="options.justify" size="small" />
      </label>
      <label>
        <span>align-items</span>
        <Select v-model="align" :options="options.align" size="small" />
      </label>
    </div>

    <div class="preview" :style="{ flexDirection: direction, flexWrap: wrap, justifyContent: justify, alignItems: align, gap: `${gap}px` }">
      <div v-for="index in 4" :key="index" class="box" :class="{ tall: index === 2 }">{{ index }}</div>
    </div>

    <p class="tool-label">CSS</p>
    <pre class="tool-output">{{ css }}</pre>
    <div class="tool-actions"><ToolsCopyButton :text="css" /></div>
  </div>
</template>

<style scoped>
.preview {
  display: flex;
  min-height: 240px;
  padding: 1rem;
  border: 1px dashed color-mix(in srgb, var(--p-text-color) 20%, transparent);
  border-radius: 12px;
}

.box {
  display: grid;
  place-items: center;
  width: 90px;
  height: 60px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--p-text-color) 82%, transparent);
  color: var(--p-content-background, #fff);
  font-weight: 700;
}

.box.tall {
  height: 100px;
}
</style>
