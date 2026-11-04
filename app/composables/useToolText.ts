import type { Tool } from '~/data/tools'

export function useToolText() {
  const { t, te } = useI18n()

  const name = (tool: Tool) => (te(`toolNames.${tool.slug}`) ? t(`toolNames.${tool.slug}`) : tool.name)
  const description = (tool: Tool) => (te(`toolDescriptions.${tool.slug}`) ? t(`toolDescriptions.${tool.slug}`) : tool.description)
  const category = (code: string) => t(`categories.${code}`)

  return { name, description, category }
}
