<script setup lang="ts">
defineOptions({ name: 'JsonTree' })

const props = defineProps<{
  value: unknown
  name?: string
  query?: string
  depth?: number
}>()

const open = ref((props.depth ?? 0) < 2)
const isObject = computed(() => typeof props.value === 'object' && props.value !== null)
const entries = computed(() => (isObject.value ? Object.entries(props.value as Record<string, unknown>) : []))
const query = computed(() => (props.query ?? '').trim().toLowerCase())

const selfMatch = computed(() => {
  if (!query.value) return true
  if ((props.name ?? '').toLowerCase().includes(query.value)) return true
  return !isObject.value && JSON.stringify(props.value).toLowerCase().includes(query.value)
})

const childMatch = computed(() => {
  if (!query.value) return true
  return entries.value.some(([key, value]) => key.toLowerCase().includes(query.value) || JSON.stringify(value).toLowerCase().includes(query.value))
})

const visible = computed(() => selfMatch.value || childMatch.value)
const summary = computed(() => (Array.isArray(props.value) ? `[${entries.value.length}]` : `{${entries.value.length}}`))

watch(query, value => {
  if (value) open.value = true
})
</script>

<template>
  <div v-if="visible" class="json-node">
    <button v-if="isObject" type="button" class="json-toggle" @click="open = !open">
      <span class="arrow">{{ open ? '▾' : '▸' }}</span>
      <span v-if="name" class="key" :class="{ match: query && name.toLowerCase().includes(query) }">{{ name }}</span>
      <span class="bracket">{{ summary }}</span>
    </button>
    <div v-else class="leaf-row">
      <span v-if="name" class="key" :class="{ match: query && name.toLowerCase().includes(query) }">{{ name }}</span>
      <span v-if="name" class="colon">:</span>
      <span class="val">{{ JSON.stringify(value) }}</span>
    </div>
    <div v-if="isObject && open" class="children">
      <JsonTree
        v-for="([key, child]) in entries"
        :key="key"
        :name="key"
        :value="child"
        :query="query"
        :depth="(depth ?? 0) + 1"
      />
    </div>
  </div>
</template>

<style scoped>
.json-node {
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: 0.8rem;
  line-height: 1.6;
}

.json-toggle,
.leaf-row {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
}

.json-toggle {
  cursor: pointer;
}

.arrow {
  width: 0.8rem;
  color: var(--p-text-muted-color);
}

.key {
  color: #7c3aed;
  overflow-wrap: anywhere;
}

.key.match {
  background: color-mix(in srgb, #f59e0b 35%, transparent);
}

.colon {
  color: var(--p-text-muted-color);
}

.bracket {
  color: var(--p-text-muted-color);
}

.val {
  color: #0f766e;
  overflow-wrap: anywhere;
}

.children {
  margin-left: 0.8rem;
  padding-left: 0.7rem;
  border-left: 1px solid color-mix(in srgb, var(--p-text-color) 10%, transparent);
}
</style>
