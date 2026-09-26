export function javaDouble(value: number): string {
  if (Number.isNaN(value)) return 'NaN'
  if (!Number.isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity'
  if (value === 0) return Object.is(value, -0) ? '-0.0' : '0.0'
  const magnitude = Math.abs(value)
  if (magnitude >= 1e-3 && magnitude < 1e7) {
    const text = String(value)
    return text.includes('.') ? text : `${text}.0`
  }
  const [mantissa, exponent] = value.toExponential().split('e')
  const digits = mantissa.includes('.') ? mantissa : `${mantissa}.0`
  return `${digits}E${Number(exponent)}`
}

export function javaFixed(value: number, decimals: number): string {
  return value.toFixed(decimals).replace('.', ',')
}

export function twoDigits(value: number): string {
  return String(value).padStart(2, '0')
}

export function clock(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`
}

export function minutes(totalSeconds: number): string {
  return `${twoDigits(Math.floor(totalSeconds / 60))}:${twoDigits(totalSeconds % 60)}`
}

export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
