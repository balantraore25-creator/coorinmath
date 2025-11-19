import { useState } from 'react';
import { ComplexPlane } from './components';
import Controls from './components/Controls';
import type { Complex } from './components/ComplexPlane';


export default function Transform() {
  const [transformation, setTransformation] = useState<
    "translation" | "symmetryCenter" | "symmetryOrigin" |
    "conjugate" | "rotationOrigin" | "rotationCenter" | "symmetryOblique"
  >("translation");

  const z: Complex = { re: 2, im: 1 };
  const a: Complex = { re: 1, im: 1 };
  const theta: number = Math.PI / 2;
  const k: number = 1;

  const computeFz = (): Complex => {
    switch (transformation) {
      case "translation":
        return { re: z.re + a.re, im: z.im + a.im };

      case "symmetryCenter":
        return { re: 2 * a.re - z.re, im: 2 * a.im - z.im };

      case "symmetryOrigin":
        return { re: -z.re, im: -z.im };

      case "conjugate":
        return { re: z.re, im: -z.im };

      case "rotationOrigin": {
        const eitheta = { re: Math.cos(theta), im: Math.sin(theta) };
        return {
          re: eitheta.re * z.re - eitheta.im * z.im,
          im: eitheta.re * z.im + eitheta.im * z.re,
        };
      }

      case "rotationCenter": {
        const dz = { re: z.re - a.re, im: z.im - a.im };
        const eitheta = { re: Math.cos(theta), im: Math.sin(theta) };
        const rotated = {
          re: eitheta.re * dz.re - eitheta.im * dz.im,
          im: eitheta.re * dz.im + eitheta.im * dz.re,
        };
        return { re: a.re + rotated.re, im: a.im + rotated.im };
      }

      case "symmetryOblique": {
        const dz = { re: z.re - a.re, im: z.im - a.im };
        const conj = { re: dz.re, im: -dz.im };
        const scaled = { re: k * conj.re, im: k * conj.im };
        return { re: a.re + scaled.re, im: a.im + scaled.im };
      }

      default:
        return z;
    }
  };

  const fz = computeFz();

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Transformations complexes</h2>
      <Controls onSelect={setTransformation} />
      <ComplexPlane
        z={z}
        fz={fz}
        a={["rotationCenter", "symmetryCenter", "translation", "symmetryOblique"].includes(transformation) ? a : undefined}
        label={`Transformation : ${transformation}`}
      />
    </div>
  );
}
