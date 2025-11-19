//import React from 'react';

type Complex = { re: number; im: number };

export default function RotationOrigin() {
  const z: Complex = { re: 1, im: 1 };
  const theta: number = Math.PI / 2;

  const eitheta: Complex = { re: Math.cos(theta), im: Math.sin(theta) };

  const fz: Complex = {
    re: eitheta.re * z.re - eitheta.im * z.im,
    im: eitheta.re * z.im + eitheta.im * z.re,
  };

  return (
    <div>
      <p>f(z) = e^(iθ) · z</p>
      <p>θ = 90°</p>
      <p>z = {z.re} + {z.im}i</p>
      <p>f(z) = {fz.re.toFixed(2)} + {fz.im.toFixed(2)}i</p>
    </div>
  );
}
