<script setup lang="ts">
const text = ref('https://tools.micropue.com.cn')
const size = ref(320)
const ecc = ref<'L' | 'M' | 'Q' | 'H'>('M')
</script>

<template>
  <div class="tool-ui">
    <Textarea v-model="text" class="tool-textarea" rows="4" placeholder="Text or URL…" />
    <div class="tool-row">
      <label>
        <span>Error correction</span>
        <Select v-model="ecc" :options="['L', 'M', 'Q', 'H']" size="small" />
      </label>
      <label>
        <span>Size</span>
        <InputNumber v-model="size" :min="120" :max="600" :step="20" size="small" />
      </label>
    </div>
    <ToolsQrCanvas :text="text" :size="size" :ecc="ecc" filename="qr-code.png" />
    <p class="tool-hint">Higher error correction survives more damage but holds less data. The code is rendered locally on a canvas.</p>
  </div>
</template>
