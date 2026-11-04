<script setup lang="ts">
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const source = ref('# Hello Markdown\n\nWrite **Markdown** on the left and see the preview on the right.\n\n- Lists\n- Tables\n- Code blocks\n\n```js\nconsole.log("local preview")\n```')
marked.setOptions({ gfm: true, breaks: true })

const html = computed(() => {
  if (typeof window === 'undefined') return ''
  return DOMPurify.sanitize(marked.parse(source.value) as string, { USE_PROFILES: { html: true } })
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-grid-2">
      <div>
        <p class="tool-label">Markdown</p>
        <Textarea v-model="source" class="tool-textarea" rows="16" />
      </div>
      <div>
        <p class="tool-label">Preview</p>
        <div class="markdown-preview" v-html="html" />
      </div>
    </div>
    <div class="tool-actions">
      <ToolsCopyButton :text="source" />
      <ToolsDownloadTextButton :text="source" filename="document.md" />
      <TButton size="small" severity="secondary" label="Clear" @click="source = ''" />
    </div>
    <p class="tool-hint">Raw HTML is sanitized before display. Nothing is uploaded.</p>
  </div>
</template>

<style scoped>
.markdown-preview {
  min-height: 320px;
  max-height: 520px;
  overflow: auto;
  padding: 0.9rem 1rem;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 10px;
  font-size: 0.9rem;
  line-height: 1.65;
}

.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3) {
  line-height: 1.25;
  margin: 1rem 0 0.5rem;
}

.markdown-preview :deep(pre) {
  overflow: auto;
  padding: 0.7rem;
  border-radius: 8px;
  background: color-mix(in srgb, var(--p-text-color) 7%, transparent);
}

.markdown-preview :deep(code) {
  font-family: var(--font-code, ui-monospace, monospace);
}

.markdown-preview :deep(table) {
  border-collapse: collapse;
}

.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
  padding: 0.3rem 0.5rem;
}

.markdown-preview :deep(blockquote) {
  margin: 0.6rem 0;
  padding-left: 0.9rem;
  border-left: 3px solid color-mix(in srgb, var(--p-text-color) 24%, transparent);
  color: var(--p-text-muted-color);
}
</style>
