import { toolPhrasesZh } from '~/utils/toolPhrases.zh'

const SELECTORS = [
  '.tool-hint',
  '.tool-label',
  '.tool-stat span',
  '.tool-stat b',
  '.tool-row label',
  '.units .unit span',
  '.exif-row span',
  '.p-select-option',
  '.p-select-label'
].join(', ')

export function useToolPhrases() {
  const { locale } = useI18n()
  const originals = new WeakMap<Text, string>()
  const originalAttrs = new WeakMap<Element, string>()
  let observer: MutationObserver | null = null

  function allowed(parent: Element) {
    return parent.closest(SELECTORS)
  }

  function translate(node: Text) {
    const parent = node.parentElement
    if (!parent || !allowed(parent)) return

    const current = node.nodeValue ?? ''
    if (locale.value !== 'zh') {
      const original = originals.get(node)
      if (original !== undefined && current !== original) node.nodeValue = original
      return
    }

    const match = current.match(/^(\s*)(.*?)(\s*)$/s)
    if (!match) return
    const [, lead, text, tail] = match
    const translated = toolPhrasesZh[text]
    if (!translated) return
    if (!originals.has(node)) originals.set(node, current)
    const next = `${lead}${translated}${tail}`
    if (next !== current) node.nodeValue = next
  }

  function translateAttrs(root: Element) {
    const elements = root.matches('[placeholder]') ? [root] : []
    elements.push(...root.querySelectorAll('[placeholder]'))
    for (const element of elements) {
      if (!element.closest('.tool-body')) continue
      const current = element.getAttribute('placeholder') ?? ''
      if (locale.value !== 'zh') {
        const original = originalAttrs.get(element)
        if (original !== undefined) element.setAttribute('placeholder', original)
        continue
      }
      const translated = toolPhrasesZh[current]
      if (!translated) continue
      if (!originalAttrs.has(element)) originalAttrs.set(element, current)
      if (current !== translated) element.setAttribute('placeholder', translated)
    }
  }

  function scan(root: Node) {
    if (root.nodeType === Node.TEXT_NODE) {
      translate(root as Text)
      return
    }
    if (root.nodeType === Node.ELEMENT_NODE) translateAttrs(root as Element)
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) translate(walker.currentNode as Text)
  }

  function start() {
    scan(document.body)
    observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') translate(mutation.target as Text)
        else if (mutation.type === 'attributes') translateAttrs(mutation.target as Element)
        else mutation.addedNodes.forEach(scan)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder'] })
  }

  onMounted(start)
  watch(locale, () => scan(document.body))
  onBeforeUnmount(() => observer?.disconnect())
}
