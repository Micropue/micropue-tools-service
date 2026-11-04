<script setup lang="ts">
const { t } = useI18n()
const file = ref<File | null>(null)
const content = ref('')
const truncated = ref(false)
const error = ref('')
const limit = 1_000_000

async function onFile(event: Event) {
  const next = (event.target as HTMLInputElement).files?.[0]
  if (!next) return
  error.value = ''
  try {
    file.value = next
    truncated.value = next.size > limit
    content.value = await next.slice(0, limit).text()
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" accept=".txt,.json,.csv,.xml,.html,.css,.js,.md,.log,.yaml,.yml,text/*" @change="onFile" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <template v-if="file">
      <div class="tool-actions">
        <span class="tool-hint">{{ file.name }} · {{ formatBytes(file.size) }} · {{ content.length.toLocaleString() }} characters read</span>
      </div>
      <p v-if="truncated" class="tool-hint" style="color: #f59e0b">Preview is limited to the first 1 MB. The full file is not loaded into the page.</p>
      <pre class="tool-output" style="max-height: 60vh">{{ content }}</pre>
      <div class="tool-actions">
        <ToolsCopyButton :text="content" />
        <ToolsDownloadTextButton :text="content" :filename="file.name" />
      </div>
    </template>
    <p class="tool-hint">Decoded as UTF-8. Other encodings may show replacement characters; use the encoding detector first.</p>
  </div>
</template>
