import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const diagonalTraverse: AlgorithmDefinition = {
  id: 'diagonal-traverse',
  title: 'Diagonal Traverse',
  leetcodeNumber: 498,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given an m x n matrix, return all elements in diagonal zigzag order. Diagonals alternate direction: first going up-right, then down-left, and so on. The result is a flattened array of all matrix elements in this traversal order.',
  tags: ['matrix', 'simulation', 'diagonal'],

  code: {
    pseudocode: `function findDiagonalOrder(mat):
  result = []
  d = 0 (direction: 0=up-right, 1=down-left)
  r, c = 0, 0
  while len(result) < m*n:
    result.append(mat[r][c])
    if d == 0: r-=1; c+=1
    else: r+=1; c-=1
    // handle boundary and direction flip
  return result`,
    python: `def findDiagonalOrder(mat):
    if not mat: return []
    m, n = len(mat), len(mat[0])
    result = []
    r, c, d = 0, 0, 0
    for _ in range(m * n):
        result.append(mat[r][c])
        if d == 0:
            if c == n-1: r += 1; d = 1
            elif r == 0: c += 1; d = 1
            else: r -= 1; c += 1
        else:
            if r == m-1: c += 1; d = 0
            elif c == 0: r += 1; d = 0
            else: r += 1; c -= 1
    return result`,
    javascript: `function findDiagonalOrder(mat) {
  if (!mat.length) return [];
  const m = mat.length, n = mat[0].length;
  const result = [];
  let r = 0, c = 0, d = 0;
  for (let i = 0; i < m * n; i++) {
    result.push(mat[r][c]);
    if (d === 0) {
      if (c === n-1) { r++; d = 1; }
      else if (r === 0) { c++; d = 1; }
      else { r--; c++; }
    } else {
      if (r === m-1) { c++; d = 0; }
      else if (c === 0) { r++; d = 0; }
      else { r++; c--; }
    }
  }
  return result;
}`,
    java: `public int[] findDiagonalOrder(int[][] mat) {
    int m = mat.length, n = mat[0].length;
    int[] result = new int[m * n];
    int r = 0, c = 0, d = 0, idx = 0;
    while (idx < m * n) {
        result[idx++] = mat[r][c];
        if (d == 0) {
            if (c == n-1) { r++; d = 1; }
            else if (r == 0) { c++; d = 1; }
            else { r--; c++; }
        } else {
            if (r == m-1) { c++; d = 0; }
            else if (c == 0) { r++; d = 0; }
            else { r++; c--; }
        }
    }
    return result;
}`,
  },

  defaultInput: {
    mat: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
  },

  inputFields: [
    {
      name: 'mat',
      label: 'Matrix (flattened rows)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      placeholder: '1,2,3,4,5,6,7,8,9',
      helperText: 'Row-major flattened 3x3 matrix',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const mat = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const steps: AlgorithmStep[] = [];
    const m = mat.length, n = mat[0].length;
    const result: number[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: mat.flat(),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start diagonal traversal of ${m}x${n} matrix. Direction 0 = up-right, direction 1 = down-left.`,
      variables: { r: 0, c: 0, d: 0, total: m * n },
      visualization: makeViz({}, {}),
    });

    let r = 0, c = 0, d = 0;
    for (let i = 0; i < m * n; i++) {
      result.push(mat[r][c]);
      const flatIdx = r * n + c;
      steps.push({
        line: 4,
        explanation: `Visit mat[${r}][${c}] = ${mat[r][c]}. Direction: ${d === 0 ? 'up-right' : 'down-left'}.`,
        variables: { r, c, value: mat[r][c], direction: d === 0 ? 'up-right' : 'down-left', collected: result.length },
        visualization: makeViz(
          { [flatIdx]: 'active' },
          { [flatIdx]: String(mat[r][c]) }
        ),
      });

      if (d === 0) {
        if (c === n - 1) { r++; d = 1; }
        else if (r === 0) { c++; d = 1; }
        else { r--; c++; }
      } else {
        if (r === m - 1) { c++; d = 0; }
        else if (c === 0) { r++; d = 0; }
        else { r++; c--; }
      }
    }

    steps.push({
      line: 8,
      explanation: `Diagonal traversal complete. Result: [${result.join(', ')}].`,
      variables: { result: result.join(', ') },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default diagonalTraverse;
