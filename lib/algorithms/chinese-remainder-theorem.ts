import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const chineseRemainderTheorem: AlgorithmDefinition = {
  id: 'chinese-remainder-theorem',
  title: 'Chinese Remainder Theorem',
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Solve a system of simultaneous congruences x ≡ r_i (mod m_i) where the moduli are pairwise coprime, using the CRT construction.',
  tags: ['Math', 'Number Theory', 'CRT', 'Modular Arithmetic'],
  code: {
    pseudocode: `function crt(remainders, moduli):
  M = product of all moduli
  x = 0
  for each (r_i, m_i):
    Mi = M / m_i
    yi = modular_inverse(Mi, m_i)
    x = x + r_i * Mi * yi
  return x mod M`,
    python: `def crt(remainders, moduli):
    M = 1
    for m in moduli:
        M *= m
    x = 0
    for r, m in zip(remainders, moduli):
        Mi = M // m
        yi = pow(Mi, -1, m)  # modular inverse
        x += r * Mi * yi
    return x % M`,
    javascript: `function crt(remainders, moduli) {
  const M = moduli.reduce((a, b) => a * b, 1);
  let x = 0;
  for (let i = 0; i < moduli.length; i++) {
    const Mi = M / moduli[i];
    const yi = modInverse(Mi, moduli[i]);
    x += remainders[i] * Mi * yi;
  }
  return x % M;
}`,
    java: `public long crt(int[] r, int[] m) {
    long M = 1;
    for (int mi : m) M *= mi;
    long x = 0;
    for (int i = 0; i < m.length; i++) {
        long Mi = M / m[i];
        long yi = modInverse(Mi, m[i]);
        x += r[i] * Mi * yi;
    }
    return x % M;
}`,
  },
  defaultInput: { remainders: [2, 3, 2], moduli: [3, 5, 7] },
  inputFields: [
    {
      name: 'remainders',
      label: 'Remainders',
      type: 'array',
      defaultValue: [2, 3, 2],
      placeholder: 'e.g. 2,3,2',
      helperText: 'Remainders r_i for each congruence',
    },
    {
      name: 'moduli',
      label: 'Moduli',
      type: 'array',
      defaultValue: [3, 5, 7],
      placeholder: 'e.g. 3,5,7',
      helperText: 'Pairwise coprime moduli m_i',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const remainders = input.remainders as number[];
    const moduli = input.moduli as number[];
    const steps: AlgorithmStep[] = [];
    const n = Math.min(remainders.length, moduli.length);

    function extGcd(a: number, b: number): [number, number, number] {
      if (b === 0) return [a, 1, 0];
      const [g, x, y] = extGcd(b, a % b);
      return [g, y, x - Math.floor(a / b) * y];
    }
    function modInv(a: number, m: number): number {
      const [, x] = extGcd(((a % m) + m) % m, m);
      return ((x % m) + m) % m;
    }

    const M = moduli.slice(0, n).reduce((acc, m) => acc * m, 1);

    steps.push({
      line: 1,
      explanation: `CRT: solve x ≡ ${remainders.slice(0,n).join(', ')} (mod ${moduli.slice(0,n).join(', ')}). M = ${M}.`,
      variables: { M, n },
      visualization: {
        type: 'array',
        array: [M, ...moduli.slice(0, n)],
        highlights: { 0: 'active', ...Object.fromEntries(moduli.slice(0,n).map((_,i) => [i+1,'comparing'])) },
        labels: { 0: 'M', ...Object.fromEntries(moduli.slice(0,n).map((_,i) => [i+1,`m${i}`])) },
      },
    });

    let x = 0;
    const contributions: number[] = [];

    for (let i = 0; i < n; i++) {
      const Mi = M / moduli[i];
      const yi = modInv(Mi, moduli[i]);
      const contrib = remainders[i] * Mi * yi;
      contributions.push(contrib);
      x += contrib;

      steps.push({
        line: 5,
        explanation: `i=${i}: M${i}=${Mi}, y${i}=modInv(${Mi},${moduli[i]})=${yi}. Contribution=${remainders[i]}*${Mi}*${yi}=${contrib}.`,
        variables: { i, Mi, yi, contribution: contrib, xSoFar: x },
        visualization: {
          type: 'array',
          array: contributions.slice(),
          highlights: { [i]: 'active', ...Object.fromEntries(contributions.slice(0,i).map((_,j) => [j,'found'])) },
          labels: { [i]: `r${i}*M${i}*y${i}` },
        },
      });
    }

    const answer = ((x % M) + M) % M;
    steps.push({
      line: 7,
      explanation: `x = ${x} mod ${M} = ${answer}. Verify: ${moduli.slice(0,n).map((m,i) => `${answer}%${m}=${answer%m}`).join(', ')}.`,
      variables: { x, M, answer },
      visualization: {
        type: 'array',
        array: [answer, ...moduli.slice(0,n).map(m => answer % m)],
        highlights: { 0: 'sorted', ...Object.fromEntries(moduli.slice(0,n).map((_,i) => [i+1,'found'])) },
        labels: { 0: 'x', ...Object.fromEntries(moduli.slice(0,n).map((m,i) => [i+1,`%${m}`])) },
      },
    });

    return steps;
  },
};

export default chineseRemainderTheorem;
