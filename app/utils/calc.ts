/** Small arithmetic parser: + - * / % ^ parentheses, functions and constants. */
export function evaluateExpression(input: string, degrees = false): number {
  const tokens = input
    .replace(/\s+/g, '')
    .replace(/π/g, 'pi')
    .match(/\d*\.?\d+(?:e[+-]?\d+)?|[a-z]+|[+\-*/%^()]/gi)
  if (!tokens) throw new Error('Empty expression')

  let index = 0
  const peek = () => tokens[index]
  const next = () => tokens[index++]!

  function primary(): number {
    if (peek() === '(') {
      next()
      const value = expression()
      if (next() !== ')') throw new Error('Missing )')
      return value
    }
    if (peek() === '-') {
      next()
      return -primary()
    }
    if (peek() === '+') {
      next()
      return primary()
    }
    const token = next()
    if (!token) throw new Error('Unexpected end')
    if (/^\d/.test(token) || token.startsWith('.')) return Number(token)
    if (token === 'pi') return Math.PI
    if (token === 'e') return Math.E
    if (token === '(') {
      const value = expression()
      if (next() !== ')') throw new Error('Missing )')
      return value
    }
    const argument = primary()
    const radians = degrees ? (argument * Math.PI) / 180 : argument
    switch (token) {
      case 'sin': return Math.sin(radians)
      case 'cos': return Math.cos(radians)
      case 'tan': return Math.tan(radians)
      case 'asin': return degrees ? (Math.asin(argument) * 180) / Math.PI : Math.asin(argument)
      case 'acos': return degrees ? (Math.acos(argument) * 180) / Math.PI : Math.acos(argument)
      case 'atan': return degrees ? (Math.atan(argument) * 180) / Math.PI : Math.atan(argument)
      case 'sqrt': return Math.sqrt(argument)
      case 'ln': return Math.log(argument)
      case 'log': return Math.log10(argument)
      case 'abs': return Math.abs(argument)
      case 'round': return Math.round(argument)
      case 'floor': return Math.floor(argument)
      case 'ceil': return Math.ceil(argument)
      default: throw new Error(`Unknown token ${token}`)
    }
  }

  function power(): number {
    const base = primary()
    if (peek() === '^') {
      next()
      return base ** power()
    }
    return base
  }

  function term(): number {
    let value = power()
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = next()
      const right = power()
      value = op === '*' ? value * right : op === '/' ? value / right : value % right
    }
    return value
  }

  function expression(): number {
    let value = term()
    while (peek() === '+' || peek() === '-') {
      const op = next()
      const right = term()
      value = op === '+' ? value + right : value - right
    }
    return value
  }

  const result = expression()
  if (index < tokens.length) throw new Error(`Unexpected ${tokens[index]}`)
  if (!Number.isFinite(result)) throw new Error('Result is not finite')
  return result
}
