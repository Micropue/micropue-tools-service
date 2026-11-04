<script setup lang="ts">
const file = ref<File | null>(null)
const result = ref<{ encoding: string; bom: string; confidence: string } | null>(null)
const preview = ref('')
const error = ref('')

async function onFile(event: Event) {
  const next = (event.target as HTMLInputElement).files?.[0]
  if (!next) return
  error.value = ''
  file.value = next
  try {
    const buffer = new Uint8Array(await next.arrayBuffer())
    const head = buffer.slice(0, 4)
    let bom = 'none'
    let encoding = ''
    if (head[0] === 0xef && head[1] === 0xbb && head[2] === 0xbf) {
      bom = 'UTF-8'
      encoding = 'UTF-8 (BOM)'
    } else if (head[0] === 0xff && head[1] === 0xfe && head[2] === 0 && head[3] === 0) {
      bom = 'UTF-32 LE'
      encoding = 'UTF-32 LE'
    } else if (head[0] === 0xfe && head[1] === 0xff) {
      bom = 'UTF-16 BE'
      encoding = 'UTF-16 BE'
    } else if (head[0] === 0xff && head[1] === 0xfe) {
      bom = 'UTF-16 LE'
      encoding = 'UTF-16 LE'
    }

    let confidence = 'BOM or strict UTF-8 validation'
    if (!encoding) {
      try {
        new TextDecoder('utf-8', { fatal: true }).decode(buffer)
        encoding = 'UTF-8'
      } catch {
        encoding = 'Windows-1252 (guess)'
        confidence = 'No BOM and invalid UTF-8; the exact legacy encoding is unknown'
      }
    }

    result.value = { encoding, bom, confidence }
    const decoder = new TextDecoder(encoding.startsWith('UTF-32') ? 'utf-8' : encoding.replace(' (BOM)', '').replace(' (guess)', ''), { fatal: false })
    preview.value = decoder.decode(buffer.slice(0, 4000)).replace(/^\uFEFF/, '')
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}
</script>

<template>
  <div class="tool-ui">
    <input type="file" @change="onFile" />
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <div v-if="result" class="tool-stat-grid">
      <div class="tool-stat"><b>{{ result.encoding }}</b><span>Best guess</span></div>
      <div class="tool-stat"><b>{{ result.bom }}</b><span>Byte order mark</span></div>
      <div class="tool-stat"><b>{{ file ? formatBytes(file.size) : '' }}</b><span>File size</span></div>
    </div>
    <p v-if="result" class="tool-hint">{{ result.confidence }}</p>
    <pre v-if="preview" class="tool-output">{{ preview }}</pre>
    <p class="tool-hint">Detection is a guess, not a guarantee. UTF-8, UTF-16 and BOM signatures are checked; other legacy encodings are not fully identified.</p>
  </div>
</template>
