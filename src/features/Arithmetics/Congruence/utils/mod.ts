export function mod(a: number, n: number): number {
  const r = a % n
  return r < 0 ? r + n : r
}

export function modMul(a: number, b: number, n: number): number {
  return mod(a * b, n)
}

export function nextPower(prev: number, a: number, n: number): number {
  return modMul(prev, a, n)
}

export function reduceExponent(p: number, k0: number, lambda: number): number {
  return p < k0 ? p : k0 + ((p - k0) % lambda)
}
