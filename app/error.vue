<template>
  <NuxtLayout>
    <div class="error-page">
      <p class="error-code">{{ statusCode }}</p>
      <h1 class="error-message">{{ message }}</h1>
      <Button :label="t('error.backHome')" @click="handleBack" />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()

const statusCode = computed(() => props.error?.statusCode ?? 500)
const message = computed(() =>
  statusCode.value === 404
    ? t('error.notFound')
    : props.error?.statusMessage || t('error.generic'))

useHead({
  title: computed(() => `${statusCode.value} | Tools`)
})

function handleBack() {
  clearError({ redirect: localePath('/') })
}
</script>

<style scoped>
.error-page {
  min-height: 65vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 1.5rem;
  text-align: center;
}

.error-code {
  margin: 0;
  font-size: clamp(5rem, 16vw, 9rem);
  font-weight: 700;
  line-height: 1;
}

.error-message {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--p-text-muted-color);
}
</style>
