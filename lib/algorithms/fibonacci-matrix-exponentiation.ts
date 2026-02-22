import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

type Matrix = [number, number, number, number];

function matMul(A: Matrix, B: Matrix): Matrix {
  return [
    A[0] * B[0] + A[1] * B[2],
    A[0] * B[1] + A[1] * B[3],
    A[2] * B[0] + A[3] * B[2],
    A[2] * B[1] + A[3] * B[3],
  ];
}

function matPow(M: Matrix, p: number): Matrix {
  let result: Matrix = [1, 0, 0, 1];
  while (p > 0) {
    if (p % 2 === 1) result = matMul(result, M);
    M = matMul(M, M);
    p = Math.floor(p / 2);
  }
  return result;
}

const fibonacciMatrixExponentiation: AlgorithmDefinition = {
  id: 'fibonacci-matrix-exponentiation',
  title: 'Fibonacci via Matrix Exponentiation',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Compute F(n) in O(log n) using matrix exponentiation: [[1,1],[1,0]]^n gives [[F(n+1), F(n)],[F(n), F(n-1)]].',
  tags: ['Math', 'Matrix', 'Fibonacci', 'Fast Power'],
  code: {
    pseudocode: `function fib(n):
  if n <= 1: return n
  M = [[1,1],[1,0]]
  R = matrix_power(M, n)
  return R[0][1]  # F(n)

function matrix_power(M, p):
  result = identity matrix
  while p > 0:
    if p is odd: result = result * M
    M = M * M
    p >>= 1
  return result`,
    python: `def fib(n):
    if n <= 1:
        return n
    def mat_mul(A, B):
        return [[A[0][0]*B[0][0]+A[0][1]*B[1][0],
                 A[0][0]*B[0][1]+A[0][1]*B[1][1]],
                [A[1][0]*B[0][0]+A[1][1]*B[1][0],
                 A[1][0]*B[0][1]+A[1][1]*B[1][1]]]
    M = [[1,1],[1,0]]
    result = [[1,0],[0,1]]
    p = n
    while p:
        if p % 2: result = mat_mul(result, M)
        M = mat_mul(M, M)
        p >>= 1
    return result[0][1]`,
    javascript: `function fib(n) {
  if (n <= 1) return n;
  const mul = (A, B) => [
    A[0]*B[0]+A[1]*B[2], A[0]*B[1]+A[1]*B[3],
    A[2]*B[0]+A[3]*B[2], A[2]*B[1]+A[3]*B[3]
  ];
  let M = [1,1,1,0], R = [1,0,0,1];
  let p = n;
  while (p > 0) {
    if (p % 2) R = mul(R, M);
    M = mul(M, M);
    p >>= 1;
  }
  return R[1];
}`,
    java: `public long fib(int n) {
    if (n <= 1) return n;
    long[] M = {1,1,1,0}, R = {1,0,0,1};
    int p = n;
    while (p > 0) {
        if ((p & 1) == 1) R = mul(R, M);
        M = mul(M, M);
        p >>= 1;
    }
    return R[1];
}`,
  },
  defaultInput: { n: 10 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 10,
      placeholder: 'e.g. 10',
      helperText: 'Compute F(n) using matrix exponentiation (0-20)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(Math.max(0, input.n as number), 20);
    const steps: AlgorithmStep[] = [];

    if (n <= 1) {
      steps.push({
        line: 2,
        explanation: `F(${n}) = ${n} (base case).`,
        variables: { n, result: n },
        visualization: {
          type: 'array',
          array: [n],
          highlights: { 0: 'found' },
          labels: { 0: `F(${n})` },
        },
      });
      return steps;
    }

    let M: Matrix = [1, 1, 1, 0];
    let R: Matrix = [1, 0, 0, 1];
    let p = n;
    let iteration = 0;

    const makeViz = (mat: Matrix, res: Matrix, power: number): ArrayVisualization => ({
      type: 'array',
      array: [...mat, ...res, power],
      highlights: { 0: 'active', 1: 'active', 2: 'active', 3: 'active', 4: 'comparing', 5: 'comparing', 6: 'comparing', 7: 'comparing', 8: 'found' },
      labels: { 0: 'M[0]', 1: 'M[1]', 2: 'M[2]', 3: 'M[3]', 4: 'R[0]', 5: 'R[1]', 6: 'R[2]', 7: 'R[3]', 8: 'p' },
    });

    steps.push({
      line: 3,
      explanation: `Init: M=[[1,1],[1,0]], R=identity, p=${n}. Will compute M^${n}.`,
      variables: { n, p },
      visualization: makeViz(M, R, p),
    });

    while (p > 0) {
      iteration++;
      const bit = p % 2;
      steps.push({
        line: 8,
        explanation: `Iteration ${iteration}: p=${p}, bit=${bit}. ${bit === 1 ? 'Multiply R by M.' : 'Skip multiply.'}`,
        variables: { p, bit, iteration },
        visualization: makeViz(M, R, p),
      });
      if (bit === 1) {
        R = matMul(R, M);
        steps.push({
          line: 9,
          explanation: `R = R * M. New R = [[${R[0]},${R[1]}],[${R[2]},${R[3]}]].`,
          variables: { R: [...R] },
          visualization: makeViz(M, R, p),
        });
      }
      M = matMul(M, M);
      p = Math.floor(p / 2);
      steps.push({
        line: 11,
        explanation: `Square M. p >>= 1 → p=${p}.`,
        variables: { p, M: [...M] },
        visualization: makeViz(M, R, p),
      });
    }

    const result = R[1];
    steps.push({
      line: 13,
      explanation: `Matrix exponentiation complete. F(${n}) = R[0][1] = ${result}.`,
      variables: { n, result },
      visualization: {
        type: 'array',
        array: [result],
        highlights: { 0: 'sorted' },
        labels: { 0: `F(${n})` },
      },
    });

    return steps;
  },
};

export default fibonacciMatrixExponentiation;
