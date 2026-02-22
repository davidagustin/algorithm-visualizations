import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const generatingFunctionsBasics: AlgorithmDefinition = {
  id: 'generating-functions-basics',
  title: 'Generating Functions Basics',
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Use ordinary generating functions (OGF) to count integer compositions. The OGF for each part is 1/(1-x) and multiplying polynomials gives the number of ways to form each sum.',
  tags: ['Math', 'Combinatorics', 'Generating Functions', 'Polynomial'],
  code: {
    pseudocode: `# Count ways to write n as ordered sum of parts from {1..maxPart}
function gf_compositions(n, k_parts, max_part):
  # Polynomial for one part: [1, 1, ..., 1] (max_part+1 terms)
  poly = [1] * (max_part + 1)
  result = [1]  # identity for multiplication
  for part from 1 to k_parts:
    result = polymul(result, poly, n)
  return result[n]`,
    python: `def gf_compositions(n, k_parts, max_part):
    # One part OGF: 1 + x + x^2 + ... + x^max_part
    poly = [1] * (max_part + 1)
    result = [1] + [0] * n
    for _ in range(k_parts):
        new_result = [0] * (n + 1)
        for i in range(n + 1):
            for j in range(min(max_part + 1, n + 1 - i)):
                new_result[i + j] += result[i] * poly[j]
        result = new_result
    return result[n]`,
    javascript: `function gfCompositions(n, kParts, maxPart) {
  const poly = new Array(maxPart + 1).fill(1);
  let result = new Array(n + 1).fill(0);
  result[0] = 1;
  for (let p = 0; p < kParts; p++) {
    const newR = new Array(n + 1).fill(0);
    for (let i = 0; i <= n; i++) {
      if (!result[i]) continue;
      for (let j = 0; j < poly.length && i + j <= n; j++)
        newR[i + j] += result[i] * poly[j];
    }
    result = newR;
  }
  return result[n];
}`,
    java: `public int gfCompositions(int n, int kParts, int maxPart) {
    int[] poly = new int[maxPart + 1];
    Arrays.fill(poly, 1);
    int[] result = new int[n + 1];
    result[0] = 1;
    for (int p = 0; p < kParts; p++) {
        int[] newR = new int[n + 1];
        for (int i = 0; i <= n; i++)
            for (int j = 0; j < poly.length && i+j <= n; j++)
                newR[i+j] += result[i] * poly[j];
        result = newR;
    }
    return result[n];
}`,
  },
  defaultInput: { n: 6, kParts: 3, maxPart: 3 },
  inputFields: [
    { name: 'n', label: 'Target sum (n)', type: 'number', defaultValue: 6, placeholder: 'e.g. 6' },
    { name: 'kParts', label: 'Number of parts (k)', type: 'number', defaultValue: 3, placeholder: 'e.g. 3' },
    { name: 'maxPart', label: 'Max part size', type: 'number', defaultValue: 3, placeholder: 'e.g. 3' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 10);
    const kParts = Math.min(input.kParts as number, 5);
    const maxPart = Math.min(input.maxPart as number, n);
    const steps: AlgorithmStep[] = [];

    const poly: number[] = new Array(maxPart + 1).fill(1);
    let result: number[] = new Array(n + 1).fill(0);
    result[0] = 1;

    const makeViz = (arr: number[], activeIdx: number): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        labels[i] = `[${i}]`;
        if (i === activeIdx) highlights[i] = 'active';
        else if (arr[i] > 0) highlights[i] = 'found';
        else highlights[i] = 'visited';
      }
      return { type: 'array', array: arr.slice(), highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Generating functions: count ordered ${kParts}-part compositions of ${n} with each part in 1..${maxPart}. OGF poly = [${poly.join(',')}].`,
      variables: { n, kParts, maxPart, poly },
      visualization: {
        type: 'array',
        array: poly,
        highlights: Object.fromEntries(poly.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(poly.map((_, i) => [i, `x^${i}`])),
      },
    });

    for (let p = 0; p < kParts; p++) {
      const newR: number[] = new Array(n + 1).fill(0);
      steps.push({
        line: 5,
        explanation: `Multiply by poly for part ${p + 1}. Current result = [${result.join(', ')}].`,
        variables: { part: p + 1, before: [...result] },
        visualization: makeViz(result, -1),
      });
      for (let i = 0; i <= n; i++) {
        if (!result[i]) continue;
        for (let j = 0; j < poly.length && i + j <= n; j++) {
          newR[i + j] += result[i] * poly[j];
        }
      }
      result = newR;
      steps.push({
        line: 6,
        explanation: `After part ${p + 1}: result = [${result.join(', ')}]. result[${n}] = ${result[n]}.`,
        variables: { part: p + 1, result: [...result], answer: result[n] },
        visualization: makeViz(result, n),
      });
    }

    steps.push({
      line: 8,
      explanation: `Number of ordered ${kParts}-part compositions of ${n} (parts 1..${maxPart}) = ${result[n]}.`,
      variables: { answer: result[n], n, kParts, maxPart },
      visualization: {
        type: 'array',
        array: [result[n]],
        highlights: { 0: 'sorted' },
        labels: { 0: `ways(${n})` },
      },
    });

    return steps;
  },
};

export default generatingFunctionsBasics;
