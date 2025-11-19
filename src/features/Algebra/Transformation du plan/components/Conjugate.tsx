export default function Conjugate() {
  const z = { re: 1, im: 4 };
  const fz = { re: z.re, im: -z.im };

  return (
    <div>
      <p>f(z) = conj(z)</p>
      <p>z = {z.re} + {z.im}i</p>
      <p>f(z) = {fz.re} + {fz.im}i</p>
    </div>
  );
}
