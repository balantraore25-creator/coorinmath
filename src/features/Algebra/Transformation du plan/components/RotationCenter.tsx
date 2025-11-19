//import React from 'react';

type Complex = { re: number; im: number };

export default function RotationCenter() {
  const a: Complex = { re: 1, im: 1 };
  const z: Complex = { re: 2, im: 0 };
  const theta: number = Math.PI / 2; // 90°

  function rotate(z: Complex, a: Complex, theta: number): Complex {
    // vecteur décentré
    const dz: Complex = { re: z.re - a.re, im: z.im - a.im };

    // e^{iθ} = cosθ + i sinθ
    const eitheta: Complex = { re: Math.cos(theta), im: Math.sin(theta) };

    // rotation
    const rotated: Complex = {
      re: eitheta.re * dz.re - eitheta.im * dz.im,
      im: eitheta.re * dz.im + eitheta.im * dz.re,
    };

    // recentrage
    return { re: a.re + rotated.re, im: a.im + rotated.im };
  }

  const fz = rotate(z, a, theta);

  return (
    <div>
      <p>f(z) = a + e^(iθ)(z - a)</p>
      <p>z = {z.re} + {z.im}i</p>
      <p>a = {a.re} + {a.im}i</p>
      <p>θ = {theta} rad</p>
      <p>f(z) = {fz.re.toFixed(2)} + {fz.im.toFixed(2)}i</p>
    </div>
  );
}
