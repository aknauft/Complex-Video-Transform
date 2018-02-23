const w = 640;  const h = 480;
let realRange = [-0.1, 0.9];  let imagRange = [-0.1, 0.9];

function FancyComplexMath(complex) {
  let a = complex.real;
  let b = complex.imaginary;

  return {
    real: (a*a-b*b), //a*a-b*b,
    imaginary: 2*a*b, //2*a*b
  }
}
