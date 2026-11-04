<script setup lang="ts">
const props = defineProps<{ text: string }>()
const { t } = useI18n()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  if (!props.text) return
  try {
    await navigator.clipboard.writeText(props.text)
  } catch {
    const el = document.createElement('textarea')
    el.value = props.text
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    el.remove()
  }
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    copied.value = false
  }, 1200)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <TButton
    size="small"
    severity="secondary"
    :label="copied ? t('ui.copied') : t('ui.copy')"
    :disabled="!text"
    @click="copy"
  />
</template>
