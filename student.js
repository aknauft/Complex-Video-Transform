const w = 640;  const h = 480;
let realRange = [-0.5, 0.5];  let imagRange = [-0.5, 0.5];

function FancyComplexMath(complex) {
  let a = complex.real;
  let b = complex.imaginary;

  return {
    real: a+0.25, // a*a-b*b,
    imaginary: b-0.25 // 2*a*b;
  }
}
