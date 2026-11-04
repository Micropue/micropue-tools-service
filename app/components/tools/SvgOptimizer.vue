<script setup lang="ts">
const { t } = useI18n()
const source = ref('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <!-- generated -->\n  <metadata>editor data</metadata>\n  <rect x="10.000" y="10.000" width="80.000" height="80.000" fill="#18181b"/>\n</svg>')
const output = ref('')
const error = ref('')

const sizes = computed(() => ({
  before: new TextEncoder().encode(source.value).length,
  after: new TextEncoder().encode(output.value).length
}))

function optimize() {
  error.value = ''
  output.value = ''
  try {
    const doc = new DOMParser().parseFromString(source.value, 'image/svg+xml')
    if (doc.querySelector('parsererror')) throw new Error('The input is not valid XML/SVG.')
    const walker = doc.createTreeWalker(doc.documentElement, NodeFilter.SHOW_COMMENT)
    const comments: Comment[] = []
    while (walker.nextNode()) comments.push(walker.currentNode as Comment)
    comments.forEach(node => node.remove())
    doc.querySelectorAll('metadata').forEach(node => node.remove())
    doc.querySelectorAll('*').forEach(node => {
      for (const attribute of [...node.attributes]) {
        if (/^(id|xmlns:xlink)$/.test(attribute.name)) continue
        if (attribute.name.startsWith('data-')) node.removeAttribute(attribute.name)
      }
    })
    let text = new XMLSerializer().serializeToString(doc.documentElement)
    text = text
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .replace(/(\d+\.\d{3,})/g, match => String(Number(Number(match).toFixed(2))))
      .trim()
    output.value = text
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="source" class="tool-textarea" rows="10" />
    <div class="tool-actions">
      <TButton size="small" label="Optimize" @click="optimize" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="source = ''; output = ''; error = ''" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <template v-if="output">
      <div class="tool-actions">
        <span class="tool-hint">{{ sizes.before }} B → {{ sizes.after }} B</span>
      </div>
      <p class="tool-label">{{ t('ui.result') }}</p>
      <pre class="tool-output">{{ output }}</pre>
      <div class="tool-actions">
        <ToolsCopyButton :text="output" />
        <ToolsDownloadTextButton :text="output" filename="optimized.svg" mime="image/svg+xml" />
      </div>
    </template>
    <p class="tool-hint">Uses the browser XML parser rather than regex-only editing. It removes comments and metadata and rounds decimals; it does not perform path rewriting, so savings are modest.</p>
  </div>
</template>
