import type { Complex } from "../types";

export function multiply(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

export function polarToComplex(r: number, theta: number): Complex {
  return {
    re: r * Math.cos(theta),
    im: r * Math.sin(theta),
  };
}
