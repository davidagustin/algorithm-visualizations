import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rangeAdditionIi: AlgorithmDefinition = {
  id: 'range-addition-ii',
  title: 'Range Addition II',
  leetcodeNumber: 598,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an m x n matrix initialized to zeros and a list of operations [a, b] that increment every cell in the top-left a x b sub-matrix, count the number of cells with the maximum value. The maximum value cells are always in the top-left corner defined by the minimum a and minimum b across all operations.',
  tags: ['array', 'math', 'matrix'],

  code: {
    pseudocode: `function maxCount(m, n, ops):
  if ops is empty: return m * n
  minA = min of all ops[i][0]
  minB = min of all ops[i][1]
  return minA * minB`,
    python: `def maxCount(m, n, ops):
    if not ops:
        return m * n
    min_a = min(op[0] for op in ops)
    min_b = min(op[1] for op in ops)
    return min_a * min_b`,
    javascript: `function maxCount(m, n, ops) {
  if (!ops.length) return m * n;
  const minA = Math.min(...ops.map(op => op[0]));
  const minB = Math.min(...ops.map(op => op[1]));
  return minA * minB;
}`,
    java: `public int maxCount(int m, int n, int[][] ops) {
    if (ops.length == 0) return m * n;
    int minA = m, minB = n;
    for (int[] op : ops) {
        minA = Math.min(minA, op[0]);
        minB = Math.min(minB, op[1]);
    }
    return minA * minB;
}`,
  },

  defaultInput: {
    m: 3,
    n: 3,
    ops: [[2, 2], [3, 3]],
  },

  inputFields: [
    {
      name: 'm',
      label: 'Rows (m)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of rows in the matrix',
    },
    {
      name: 'n',
      label: 'Columns (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of columns in the matrix',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = (input.m as number) || 3;
    const n = (input.n as number) || 3;
    const ops = [[2, 2], [3, 3]];
    const steps: AlgorithmStep[] = [];

    // Build matrix to visualize incrementally
    const matrix: number[][] = Array.from({ length: m }, () => Array(n).fill(0));
    const flat = (): number[] => matrix.flat();

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: flat(),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize ${m}x${n} matrix to zeros. Will apply ${ops.length} operations.`,
      variables: { m, n, numOps: ops.length },
      visualization: makeViz({}, {}),
    });

    if (ops.length === 0) {
      steps.push({
        line: 2,
        explanation: `No operations. All cells have value 0 (max). Count = ${m * n}.`,
        variables: { result: m * n },
        visualization: makeViz(Object.fromEntries(flat().map((_, i) => [i, 'found'])), {}),
      });
      return steps;
    }

    let minA = m, minB = n;
    for (const [a, b] of ops) {
      // Apply to matrix for visualization
      for (let r = 0; r < a; r++) for (let c = 0; c < b; c++) matrix[r][c]++;
      minA = Math.min(minA, a);
      minB = Math.min(minB, b);

      steps.push({
        line: 3,
        explanation: `Operation [${a}, ${b}]: increment top-left ${a}x${b} sub-matrix. minA=${minA}, minB=${minB}.`,
        variables: { a, b, minA, minB },
        visualization: makeViz(
          Object.fromEntries(
            flat().map((_, i) => {
              const r = Math.floor(i / n), c = i % n;
              return [i, r < a && c < b ? 'active' : 'default'];
            })
          ),
          {}
        ),
      });
    }

    const result = minA * minB;
    const maxVal = matrix[0][0];
    steps.push({
      line: 4,
      explanation: `Intersection of all operations is top-left ${minA}x${minB} corner. Max value = ${maxVal}. Count = ${minA} x ${minB} = ${result}.`,
      variables: { minA, minB, maxValue: maxVal, result },
      visualization: makeViz(
        Object.fromEntries(
          flat().map((_, i) => {
            const r = Math.floor(i / n), c = i % n;
            return [i, r < minA && c < minB ? 'found' : 'sorted'];
          })
        ),
        {}
      ),
    });

    return steps;
  },
};

export default rangeAdditionIi;
