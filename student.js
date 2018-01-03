const w = 640;  const h = 480;
const realRange = [-2, 2];  const imagRange = [-2, 2];

function FancyComplexMath(complex) {
  let a = complex.real;
  let b = complex.imaginary;

  return {
    real: a*a-b*b, // a*a-b*b,
    imaginary: 2*a*b // 2*a*b;
  }
}
