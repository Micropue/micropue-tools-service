<script setup lang="ts">
const props = withDefaults(defineProps<{ text: string; filename?: string; mime?: string }>(), {
  filename: 'result.txt',
  mime: 'text/plain;charset=utf-8'
})
const { t } = useI18n()

function run() {
  if (!props.text) return
  downloadText(props.text, props.filename, props.mime)
}
</script>

<template>
  <TButton size="small" severity="secondary" :label="t('ui.download')" :disabled="!text" @click="run" />
</template>
