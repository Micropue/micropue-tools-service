export function secureRandomInt(max: number) {
  if (max <= 0) return 0
  const limit = Math.floor(0x100000000 / max) * max
  const value = new Uint32Array(1)
  do {
    crypto.getRandomValues(value)
  } while (value[0]! >= limit)
  return value[0]! % max
}

export function randomString(length: number, charset: string) {
  return Array.from({ length }, () => charset[secureRandomInt(charset.length)]).join('')
}

export function securePick<T>(items: T[]): T {
  return items[secureRandomInt(items.length)]!
}
