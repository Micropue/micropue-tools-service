<script setup lang="ts">
const password = ref('')
const common = ['password', '123456', 'qwerty', 'letmein', 'admin', 'welcome', 'iloveyou', 'monkey', 'dragon', 'abc123', '111111', '123123']

const analysis = computed(() => {
  const value = password.value
  if (!value) return null
  let pool = 0
  if (/[a-z]/.test(value)) pool += 26
  if (/[A-Z]/.test(value)) pool += 26
  if (/\d/.test(value)) pool += 10
  if (/[^a-z0-9]/i.test(value)) pool += 33
  let entropy = value.length * Math.log2(Math.max(1, pool))
  if (common.some(word => value.toLowerCase().includes(word))) entropy = Math.min(entropy, 20)
  if (/(.)\1{2,}/.test(value) || /^(?:0123|1234|abcd|qwer)/i.test(value)) entropy *= 0.7

  const score = entropy >= 100 ? 4 : entropy >= 70 ? 3 : entropy >= 45 ? 2 : entropy >= 28 ? 1 : 0
  const labels = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong']
  const guesses = 2 ** Math.min(entropy, 200)
  const seconds = guesses / 1e10
  const time = seconds < 1 ? 'less than a second' : seconds < 3600 ? `${Math.round(seconds)} seconds` : seconds < 86400 ? `${Math.round(seconds / 3600)} hours` : seconds < 31536000 ? `${Math.round(seconds / 86400)} days` : `${Math.round(seconds / 31536000).toLocaleString()} years`

  return { entropy: Math.round(entropy), score, label: labels[score], time, pool, length: value.length }
})
</script>

<template>
  <div class="tool-ui">
    <InputText v-model="password" type="password" size="large" placeholder="Type a password to test…" style="width: 100%" autocomplete="off" />
    <template v-if="analysis">
      <div class="tool-stat-grid">
        <div class="tool-stat"><b>{{ analysis.label }}</b><span>Estimated strength</span></div>
        <div class="tool-stat"><b>{{ analysis.entropy }} bits</b><span>Approximate entropy</span></div>
        <div class="tool-stat"><b>{{ analysis.time }}</b><span>Offline guessing at 10¹⁰/s</span></div>
        <div class="tool-stat"><b>{{ analysis.length }}</b><span>Characters</span></div>
      </div>
      <div class="bar"><span :style="{ width: `${(analysis.score + 1) * 20}%` }" /></div>
    </template>
    <p v-if="!password" class="tool-hint">The password never leaves this page. Strength is an estimate, not a guarantee.</p>
    <p class="tool-hint">This estimate assumes random generation and a fast offline attacker. It cannot tell whether a password has appeared in a breach, and it does not replace a password manager.</p>
  </div>
</template>

<style scoped>
.bar {
  height: 8px;
  border-radius: 99px;
  background: color-mix(in srgb, var(--p-text-color) 10%, transparent);
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #f59e0b, #22c55e);
}
</style>
