export default function SymmetryOrigin() {
  const z = { re: 2, im: -3 };
  const fz = { re: -z.re, im: -z.im };

  return (
    <div>
      <p>f(z) = -z</p>
      <p>z = {z.re} + {z.im}i</p>
      <p>f(z) = {fz.re} + {fz.im}i</p>
    </div>
  );
}
