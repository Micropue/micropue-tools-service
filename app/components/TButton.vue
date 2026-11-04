<script setup lang="ts">
import PrimeButton from 'primevue/button'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ label?: string }>()
const attrs = useAttrs()
const { t, te } = useI18n()

const keys: Record<string, string> = {
  'Download': 'ui.download',
  'Download PNG': 'ui.downloadPng',
  'Download transparent PNG': 'ui.downloadTransparentPng',
  'Download ZIP': 'ui.downloadZip',
  'Download rename map (CSV)': 'ui.downloadRenameMap',
  'Start': 'ui.start',
  'Pause': 'ui.pause',
  'Reset': 'ui.reset',
  'Clear': 'ui.clear',
  'Convert': 'ui.convert',
  'Encode': 'ui.encode',
  'Decode': 'ui.decode',
  'Beautify': 'ui.beautify',
  'Minify': 'ui.minify',
  'Validate': 'ui.validate',
  'Preview': 'ui.preview',
  'Add': 'ui.add',
  'Remove': 'ui.remove',
  'Save': 'ui.save',
  'Replay': 'ui.replay',
  'Open link': 'ui.openLink',
  'Enable notifications': 'ui.enableNotifications',
  'Toggle fullscreen': 'ui.toggleFullscreen',
  'Remove logo': 'ui.removeLogo',
  'Remove timezone': 'ui.removeTimezone',
  'Move up': 'ui.moveUp',
  'Move down': 'ui.moveDown',
  'Merge': 'ui.merge',
  'Optimize': 'ui.optimize',
  'Extract ZIP': 'ui.extractZip',
  'Swap result into input': 'ui.swapInput',
  'Lap': 'ui.lap',
  'Rotate 90°': 'ui.rotate90',
  'Rotate 180°': 'ui.rotate180',
  'Rotate 270°': 'ui.rotate270',
  'Degrees': 'ui.degrees',
  'Radians': 'ui.radians',
  'Linear': 'ui.linear',
  'Radial': 'ui.radial',
  'Tree': 'ui.tree',
  'Text': 'ui.text',
  'File': 'ui.file',
  'Free': 'ui.free',
  'Blur': 'ui.blur',
  'Pixelate': 'ui.pixelate',
  'Focus': 'ui.focus',
  'Break': 'ui.rest',
  'Add layer': 'ui.addLayer',
  'Add color stop': 'ui.addColorStop',
  'Add timer': 'ui.addTimer',
  'Text → codes': 'ui.textToCodes',
  'Codes → text': 'ui.codesToText',
  'X% of Y': 'ui.percentOf',
  'X is what % of Y': 'ui.percentShare',
  'Percent change': 'ui.percentChange',
  'UPPERCASE': 'ui.uppercase',
  'lowercase': 'ui.lowercase',
  'Title Case': 'ui.titleCase',
  'Sentence case': 'ui.sentenceCase',
  'Create ZIP': 'ui.createZip',
  'JSON → CSV': 'ui.jsonToCsv',
  'CSV → JSON': 'ui.csvToJson',
  'JSON → YAML': 'ui.jsonToYaml',
  'YAML → JSON': 'ui.yamlToJson',
  'JSON → TypeScript': 'ui.jsonToTs',
  'Image → Data URI': 'ui.imageToDataUri',
  'Data URI → Image': 'ui.dataUriToImage',
  'Character → code point': 'ui.charToCodePoint',
  'Code point → character': 'ui.codePointToChar'
}

function translate(value?: string) {
  if (!value) return value
  const key = keys[value]
  return key && te(key) ? t(key) : value
}

const labelText = computed(() => translate(props.label))
const ariaLabel = computed(() => translate(attrs['aria-label'] as string | undefined))
</script>

<template>
  <PrimeButton v-bind="$attrs" :label="labelText" :aria-label="ariaLabel" />
</template>
