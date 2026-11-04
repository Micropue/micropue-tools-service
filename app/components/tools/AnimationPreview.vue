<script setup lang="ts">
const name = ref<'fade' | 'slide' | 'scale' | 'rotate' | 'bounce'>('fade')
const duration = ref(1)
const delay = ref(0)
const easing = ref('ease')
const iteration = ref<'1' | 'infinite'>('infinite')
const replay = ref(0)

const keyframes: Record<string, string> = {
  fade: 'from { opacity: 0; } to { opacity: 1; }',
  slide: 'from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; }',
  scale: 'from { transform: scale(0.6); } to { transform: scale(1); }',
  rotate: 'from { transform: rotate(-8deg); } to { transform: rotate(0); }',
  bounce: '0%, 100% { transform: translateY(0); } 50% { transform: translateY(-22px); }'
}

const shorthand = computed(() => `${name.value} ${duration.value}s ${easing.value} ${delay.value}s ${iteration.value} both`)
const previewStyle = computed(() => ({
  animationDuration: `${duration.value}s`,
  animationDelay: `${delay.value}s`,
  animationTimingFunction: easing.value,
  animationIterationCount: iteration.value,
  animationFillMode: 'both'
}))
const css = computed(() => `.box {\n  animation: ${shorthand.value};\n}\n\n@keyframes ${name.value} {\n  ${keyframes[name.value]!.replace(/; /g, ';\n  ')}\n}`)
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <Select v-model="name" :options="['fade', 'slide', 'scale', 'rotate', 'bounce']" size="small" />
      <label><span>Duration (s)</span><InputNumber v-model="duration" :min="0.1" :max="10" :step="0.1" size="small" /></label>
      <label><span>Delay (s)</span><InputNumber v-model="delay" :min="0" :max="10" :step="0.1" size="small" /></label>
      <Select v-model="easing" :options="['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']" size="small" />
      <Select v-model="iteration" :options="[{ label: 'Once', value: '1' }, { label: 'Infinite', value: 'infinite' }]" option-label="label" option-value="value" size="small" />
      <TButton size="small" severity="secondary" label="Replay" @click="replay++" />
    </div>
    <div class="anim-preview-stage">
      <div
        :key="`${name}-${replay}`"
        class="anim-preview-box"
        :class="`anim-${name}`"
        :style="previewStyle"
      />
    </div>
    <p class="tool-label">CSS</p>
    <pre class="tool-output">{{ css }}</pre>
    <div class="tool-actions"><ToolsCopyButton :text="css" /></div>
    <p class="tool-hint">The animation runs in this page only. Respect reduced-motion preferences when using it in production.</p>
  </div>
</template>

<style>
.anim-preview-stage {
  display: grid;
  place-items: center;
  min-height: 220px;
  border: 1px dashed color-mix(in srgb, var(--p-text-color) 20%, transparent);
  border-radius: 12px;
}

.anim-preview-box {
  width: 110px;
  height: 110px;
  border-radius: 14px;
  background: var(--p-text-color);
}

.anim-preview-box.anim-fade {
  animation-name: ap-fade;
}

.anim-preview-box.anim-slide {
  animation-name: ap-slide;
}

.anim-preview-box.anim-scale {
  animation-name: ap-scale;
}

.anim-preview-box.anim-rotate {
  animation-name: ap-rotate;
}

.anim-preview-box.anim-bounce {
  animation-name: ap-bounce;
}

@keyframes ap-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes ap-slide {
  from { transform: translateY(24px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes ap-scale {
  from { transform: scale(0.6); }
  to { transform: scale(1); }
}

@keyframes ap-rotate {
  from { transform: rotate(-8deg); }
  to { transform: rotate(0); }
}

@keyframes ap-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-22px); }
}
</style>
