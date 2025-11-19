//import React from 'react';
import { ComplexPlane } from './components';

export default function Transform() {
  const z = { re: 2, im: 1 };
  const fz = { re: -1, im: 2 };
  const a = { re: 1, im: 1 };

  return (
    <div>
      <h2>Visualisation d'une transformation complexe</h2>
      <ComplexPlane z={z} fz={fz} a={a} label="Rotation autour de a" />
    </div>
  );
}
