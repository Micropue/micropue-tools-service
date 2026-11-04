<script setup lang="ts">
const firstName = ref('Ada')
const lastName = ref('Lovelace')
const organization = ref('')
const phone = ref('')
const email = ref('')
const website = ref('')
const address = ref('')

function escapeValue(value: string) {
  return value.replace(/([\\;,])/g, '\\$1').replace(/\n/g, '\\n')
}

const payload = computed(() => {
  if (!firstName.value && !lastName.value) return ''
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:${escapeValue(lastName.value)};${escapeValue(firstName.value)};;;`, `FN:${escapeValue(`${firstName.value} ${lastName.value}`.trim())}`]
  if (organization.value) lines.push(`ORG:${escapeValue(organization.value)}`)
  if (phone.value) lines.push(`TEL;TYPE=CELL:${escapeValue(phone.value)}`)
  if (email.value) lines.push(`EMAIL:${escapeValue(email.value)}`)
  if (website.value) lines.push(`URL:${escapeValue(website.value)}`)
  if (address.value) lines.push(`ADR:;;${escapeValue(address.value)};;;;`)
  lines.push('END:VCARD')
  return lines.join('\n')
})
</script>

<template>
  <div class="tool-ui">
    <div class="tool-grid-2">
      <InputText v-model="firstName" size="small" placeholder="First name" />
      <InputText v-model="lastName" size="small" placeholder="Last name" />
      <InputText v-model="organization" size="small" placeholder="Organization" />
      <InputText v-model="phone" size="small" placeholder="Phone" />
      <InputText v-model="email" size="small" placeholder="Email" />
      <InputText v-model="website" size="small" placeholder="Website" />
    </div>
    <InputText v-model="address" size="small" placeholder="Address" />
    <ToolsQrCanvas v-if="payload" :text="payload" ecc="M" filename="contact-qr.png" />
    <pre v-if="payload" class="tool-output">{{ payload }}</pre>
    <p class="tool-hint">Uses vCard 3.0. Some contact apps ignore fields they do not support.</p>
  </div>
</template>
