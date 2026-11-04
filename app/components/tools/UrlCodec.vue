<script setup lang="ts">
const { t } = useI18n()

const input = ref('')
const output = ref('')
const error = ref('')
const params = ref<{ key: string; value: string }[]>([])

function encode() {
  error.value = ''
  try {
    output.value = encodeURIComponent(input.value)
    parseParams()
  } catch {
    error.value = 'Cannot encode this input.'
  }
}

function decode() {
  error.value = ''
  try {
    output.value = decodeURIComponent(input.value)
    parseParams()
  } catch {
    error.value = 'Cannot decode: the input contains invalid escape sequences.'
  }
}

function parseParams() {
  params.value = []
  const source = input.value
  if (!source) return

  try {
    const url = new URL(source, 'https://example.invalid')
    url.searchParams.forEach((value, key) => {
      params.value.push({ key, value })
    })
  } catch {
    params.value = []
  }
}
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="input" class="tool-textarea" rows="6" placeholder="Text or URL…" />

    <div class="tool-actions">
      <TButton size="small" label="Encode" @click="encode" />
      <TButton size="small" severity="secondary" label="Decode" @click="decode" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''; output = ''; params = []; error = ''" />
    </div>

    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>

    <template v-if="output">
      <p class="tool-label">{{ t('ui.result') }}</p>
      <pre class="tool-output">{{ output }}</pre>
      <div class="tool-actions">
        <ToolsCopyButton :text="output" />
      </div>
    </template>

    <template v-if="params.length">
      <p class="tool-label">Query parameters</p>
      <div class="params">
        <div v-for="param in params" :key="param.key" class="param">
          <span class="param-key">{{ param.key }}</span>
          <span class="param-value">{{ param.value }}</span>
        </div>
      </div>
    </template>

    <p class="tool-hint">Uses encodeURIComponent / decodeURIComponent.</p>
  </div>
</template>

<style scoped>
.params {
  border: 1px solid color-mix(in srgb, var(--p-text-color) 12%, transparent);
  border-radius: 10px;
  overflow: hidden;
  font-family: var(--font-code, ui-monospace, monospace);
  font-size: 0.8rem;
}

.param {
  display: flex;
  gap: 1rem;
  padding: 0.45rem 0.7rem;
}

.param + .param {
  border-top: 1px solid color-mix(in srgb, var(--p-text-color) 8%, transparent);
}

.param-key {
  flex: 0 0 32%;
  color: var(--p-text-muted-color);
  overflow-wrap: anywhere;
}

.param-value {
  overflow-wrap: anywhere;
  color: var(--p-text-color);
}
</style>
