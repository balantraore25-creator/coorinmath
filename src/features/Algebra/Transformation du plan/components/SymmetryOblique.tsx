export default function SymmetryOblique() {
  const z = { re: 3, im: 2 };
  const a = { re: 1, im: 1 };
  const k = 1;

  const dz = { re: z.re - a.re, im: z.im - a.im };
  const conj = { re: dz.re, im: -dz.im };
  const scaled = { re: k * conj.re, im: k * conj.im };
  const fz = { re: a.re + scaled.re, im: a.im + scaled.im };

  return (
    <div>
      <p>f(z) = a + k · conj(z - a)</p>
      <p>z = {z.re} + {z.im}i</p>
      <p>a = {a.re} + {a.im}i</p>
      <p>f(z) = {fz.re} + {fz.im}i</p>
    </div>
  );
}
