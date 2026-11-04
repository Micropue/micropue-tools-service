<script setup lang="ts">
const to = ref('')
const subject = ref('')
const body = ref('')

const payload = computed(() => {
  if (!to.value) return ''
  const params = new URLSearchParams()
  if (subject.value) params.set('subject', subject.value)
  if (body.value) params.set('body', body.value)
  const query = params.toString()
  return `mailto:${to.value}${query ? `?${query}` : ''}`
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-grid-2">
      <InputText v-model="to" size="small" placeholder="recipient@example.com" />
      <InputText v-model="subject" size="small" placeholder="Subject" />
    </div>
    <Textarea v-model="body" class="tool-textarea" rows="4" placeholder="Message body…" />
    <ToolsQrCanvas v-if="payload" :text="payload" filename="email-qr.png" />
    <pre v-if="payload" class="tool-output">{{ payload }}</pre>
    <p class="tool-hint">The scanner's mail app decides whether to prefill the subject and body. This tool does not send email.</p>
  </div>
</template>
