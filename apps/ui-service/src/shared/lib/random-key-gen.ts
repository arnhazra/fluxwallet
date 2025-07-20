export function generaterandomKey(): string {
  const length = 36
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let randomKey = ""

  for (let i = 0; i < length; i++) {
    randomKey = chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return randomKey
}
