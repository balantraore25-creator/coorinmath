export default function SymmetryCenter() {
  const z = { re: 3, im: 2 };
  const a = { re: 1, im: 1 };

  const fz = { re: 2 * a.re - z.re, im: 2 * a.im - z.im };

  return (
    <div>
      <p>f(z) = 2a - z</p>
      <p>z = {z.re} + {z.im}i</p>
      <p>a = {a.re} + {a.im}i</p>
      <p>f(z) = {fz.re} + {fz.im}i</p>
    </div>
  );
}
