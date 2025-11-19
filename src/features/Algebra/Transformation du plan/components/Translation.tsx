export default function Translation() {
  const z = { re: 2, im: 1 };
  const a = { re: 1, im: 2 };

  const fz = { re: z.re + a.re, im: z.im + a.im };

  return (
    <div>
      <p>f(z) = z + (a + ib)</p>
      <p>z = {z.re} + {z.im}i</p>
      <p>a = {a.re} + {a.im}i</p>
      <p>f(z) = {fz.re} + {fz.im}i</p>
    </div>
  );
}
