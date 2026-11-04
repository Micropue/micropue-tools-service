<script setup lang="ts">
import beautify from 'js-beautify'

const { t } = useI18n()
const language = ref<'html' | 'css' | 'js'>('html')
const input = ref('<div><p>Hello</p><span>world</span></div>')
const output = ref('')
const error = ref('')
const busy = ref(false)

function minifyHtml(value: string) {
  return value.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').trim()
}

function minifyCss(value: string) {
  return value
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .trim()
}

async function run(action: 'beautify' | 'minify') {
  error.value = ''
  output.value = ''
  if (!input.value.trim()) return
  busy.value = true
  try {
    if (language.value === 'js') {
      if (action === 'beautify') {
        output.value = beautify.js(input.value, { indent_size: 2 })
      } else {
        const { minify } = await import('terser')
        const result = await minify(input.value, { compress: true, mangle: true })
        output.value = result.code ?? ''
      }
    } else if (language.value === 'css') {
      output.value = action === 'beautify' ? beautify.css(input.value, { indent_size: 2 }) : minifyCss(input.value)
    } else {
      output.value = action === 'beautify' ? beautify.html(input.value, { indent_size: 2 }) : minifyHtml(input.value)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="tool-ui">
    <div class="tool-actions">
      <TButton
        v-for="item in [['html', 'HTML'], ['css', 'CSS'], ['js', 'JavaScript']] as const"
        :key="item[0]"
        size="small"
        :severity="language === item[0] ? undefined : 'secondary'"
        :label="item[1]"
        @click="language = item[0]"
      />
    </div>
    <Textarea v-model="input" class="tool-textarea" rows="10" placeholder="Paste code…" />
    <div class="tool-actions">
      <TButton size="small" label="Beautify" :loading="busy" @click="run('beautify')" />
      <TButton size="small" severity="secondary" label="Minify" :loading="busy" @click="run('minify')" />
      <TButton size="small" severity="secondary" :label="t('ui.clear')" @click="input = ''; output = ''; error = ''" />
    </div>
    <p v-if="error" class="tool-hint" style="color: #ef4444">{{ error }}</p>
    <template v-if="output">
      <p class="tool-label">{{ t('ui.result') }}</p>
      <pre class="tool-output">{{ output }}</pre>
      <div class="tool-actions">
        <ToolsCopyButton :text="output" />
        <ToolsDownloadTextButton :text="output" :filename="`formatted.${language === 'js' ? 'js' : language}`" />
      </div>
    </template>
    <p class="tool-hint">JavaScript minification uses Terser. HTML/CSS minification is conservative; check the output before shipping.</p>
  </div>
</template>
