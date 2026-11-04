<script setup lang="ts">
const { t } = useI18n()
const language = ref<'en' | 'zh'>('en')
const unit = ref<'paragraphs' | 'sentences' | 'words'>('paragraphs')
const count = ref(3)
const output = ref('')

const english = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')
const chinese = ['这是一个用于排版的占位段落，内容可以被替换。', '设计稿中的文字应当服务于阅读节奏，而不是吸引注意。', '在真实内容就位之前，占位文本帮助团队确认版式。', '段落长度、行距与留白，都需要在上下文中检验。']

function sentence() {
  if (language.value === 'zh') return chinese[secureRandomInt(chinese.length)]!
  const size = 8 + secureRandomInt(10)
  const words = Array.from({ length: size }, () => english[secureRandomInt(english.length)]!)
  words[0] = words[0]!.charAt(0).toUpperCase() + words[0]!.slice(1)
  return `${words.join(' ')}.`
}

function paragraph() {
  const size = 3 + secureRandomInt(3)
  return Array.from({ length: size }, sentence).join(language.value === 'zh' ? '' : ' ')
}

function generate() {
  const total = Math.min(50, Math.max(1, Number(count.value) || 1))
  if (unit.value === 'words') {
    const size = Math.min(500, Math.max(1, total))
    output.value = language.value === 'zh'
      ? Array.from({ length: Math.ceil(size / 2) }, () => chinese[secureRandomInt(chinese.length)]!.slice(0, 6)).join('')
      : Array.from({ length: size }, () => english[secureRandomInt(english.length)]!).join(' ')
    return
  }
  const blocks = Array.from({ length: total }, () => (unit.value === 'paragraphs' ? paragraph() : sentence()))
  output.value = blocks.join(language.value === 'zh' ? '\n\n' : '\n\n')
}

generate()
</script>

<template>
  <div class="tool-ui">
    <div class="tool-row">
      <Select v-model="language" :options="[{ label: 'English', value: 'en' }, { label: '中文', value: 'zh' }]" option-label="label" option-value="value" size="small" />
      <Select
        v-model="unit"
        :options="[{ label: 'Paragraphs', value: 'paragraphs' }, { label: 'Sentences', value: 'sentences' }, { label: 'Words', value: 'words' }]"
        option-label="label"
        option-value="value"
        size="small"
      />
      <InputNumber v-model="count" :min="1" :max="500" show-buttons size="small" />
      <TButton size="small" :label="t('ui.generate')" @click="generate" />
    </div>
    <pre class="tool-output">{{ output }}</pre>
    <div class="tool-actions">
      <ToolsCopyButton :text="output" />
      <ToolsDownloadTextButton :text="output" filename="placeholder.txt" />
    </div>
    <p class="tool-hint">Words mode treats the count as a word count; the cap is 500.</p>
  </div>
</template>
