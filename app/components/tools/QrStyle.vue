<script setup lang="ts">
const text = ref('https://tools.micropue.com.cn')
const fg = ref('#18181b')
const bg = ref('#ffffff')
const ecc = ref<'L' | 'M' | 'Q' | 'H'>('H')
const logo = ref('')

function onLogo(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => (logo.value = String(reader.result))
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="text" class="tool-textarea" rows="4" />
    <div class="tool-row">
      <label><span>Foreground</span><input v-model="fg" type="color" class="color-input" /></label>
      <label><span>Background</span><input v-model="bg" type="color" class="color-input" /></label>
      <label>
        <span>Error correction</span>
        <Select v-model="ecc" :options="['L', 'M', 'Q', 'H']" size="small" />
      </label>
      <input type="file" accept="image/*" @change="onLogo" />
      <TButton v-if="logo" size="small" severity="secondary" label="Remove logo" @click="logo = ''" />
    </div>
    <ToolsQrCanvas :text="text" :fg="fg" :bg="bg" :ecc="ecc" :logo="logo" filename="styled-qr.png" />
    <p class="tool-hint" style="color: #f59e0b">Low contrast or a large centre logo can make the code unscannable. Test with more than one scanner before printing. Error correction H is recommended with a logo.</p>
  </div>
</template>

<style scoped>
.color-input {
  width: 42px;
  height: 34px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--p-text-color) 18%, transparent);
  border-radius: 7px;
  background: transparent;
}
</style>
