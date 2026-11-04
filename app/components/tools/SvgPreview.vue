<script setup lang="ts">
const source = ref('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">\n  <circle cx="60" cy="60" r="44" fill="#18181b" />\n  <path d="M40 62 L55 77 L82 45" fill="none" stroke="#fff" stroke-width="7" />\n</svg>')
const error = ref('')

const sanitized = computed(() => {
  if (typeof window === 'undefined') return ''
  error.value = ''
  const doc = new DOMParser().parseFromString(source.value, 'image/svg+xml')
  if (doc.querySelector('parsererror')) {
    error.value = 'The input is not valid XML/SVG.'
    return ''
  }
  doc.querySelectorAll('script, foreignObject').forEach(node => node.remove())
  doc.querySelectorAll('*').forEach(node => {
    for (const attribute of [...node.attributes]) {
      if (/^on/i.test(attribute.name)) node.removeAttribute(attribute.name)
      if (/href$/i.test(attribute.name) && /^\s*(javascript|data:text\/html)/i.test(attribute.value)) node.removeAttribute(attribute.name)
    }
  })
  return new XMLSerializer().serializeToString(doc.documentElement)
})
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="source" class="tool-textarea" rows="10" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div class="preview" v-html="sanitized" />
    <div class="tool-actions"><ToolsCopyButton :text="source" /></div>
    <p class="tool-hint">Script and foreignObject elements, inline event handlers and javascript: links are stripped before rendering. Prefer this for inspection, not for untrusted production assets.</p>
  </div>
</template>

<style scoped>
.preview {
  display: grid;
  place-items: center;
  min-height: 220px;
  padding: 1rem;
  border: 1px dashed color-mix(in srgb, var(--p-text-color) 20%, transparent);
  border-radius: 12px;
}

.preview :deep(svg) {
  max-width: 100%;
  max-height: 420px;
}
</style>
