export function modPow(base: number, exp: number, mod: number): number {
  let result = 1
  let b = base % mod
  let e = exp
  while (e > 0) {
    if (e % 2 === 1) result = (result * b) % mod
    e = Math.floor(e / 2)
    b = (b * b) % mod
  }
  return result
}
