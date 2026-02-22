import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kthSmallestNumberMultiplicationTable: AlgorithmDefinition = {
  id: 'kth-smallest-number-multiplication-table',
  title: 'Kth Smallest Number in Multiplication Table',
  leetcodeNumber: 668,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Given an m x n multiplication table and k, find the kth smallest number. Binary search on the value from 1 to m*n: for each candidate x, count how many entries in the table are <= x by summing min(x/i, n) for each row i from 1 to m.',
  tags: ['binary search', 'math', 'matrix'],

  code: {
    pseudocode: `function findKthNumber(m, n, k):
  left = 1, right = m * n
  while left < right:
    mid = (left + right) / 2
    count = sum(min(mid / i, n) for i in 1..m)
    if count >= k:
      right = mid
    else:
      left = mid + 1
  return left`,

    python: `def findKthNumber(m: int, n: int, k: int) -> int:
    left, right = 1, m * n
    while left < right:
        mid = (left + right) // 2
        count = sum(min(mid // i, n) for i in range(1, m + 1))
        if count >= k:
            right = mid
        else:
            left = mid + 1
    return left`,

    javascript: `function findKthNumber(m, n, k) {
  let left = 1, right = m * n;
  while (left < right) {
    const mid = (left + right) >> 1;
    let count = 0;
    for (let i = 1; i <= m; i++) count += Math.min(Math.floor(mid / i), n);
    if (count >= k) right = mid;
    else left = mid + 1;
  }
  return left;
}`,

    java: `public int findKthNumber(int m, int n, int k) {
    int left = 1, right = m * n;
    while (left < right) {
        int mid = (left + right) / 2;
        int count = 0;
        for (int i = 1; i <= m; i++) count += Math.min(mid / i, n);
        if (count >= k) right = mid;
        else left = mid + 1;
    }
    return left;
}`,
  },

  defaultInput: {
    m: 3,
    n: 3,
    k: 5,
  },

  inputFields: [
    {
      name: 'm',
      label: 'Rows (m)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of rows in multiplication table',
    },
    {
      name: 'n',
      label: 'Columns (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of columns in multiplication table',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Find the kth smallest number',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = input.m as number;
    const n = input.n as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const table = Array.from({ length: m * n }, (_, idx) => {
      const row = Math.floor(idx / n) + 1;
      const col = (idx % n) + 1;
      return row * col;
    });

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: table,
      highlights,
      labels,
    });

    const countLE = (x: number): number => {
      let count = 0;
      for (let i = 1; i <= m; i++) count += Math.min(Math.floor(x / i), n);
      return count;
    };

    let left = 1;
    let right = m * n;

    steps.push({
      line: 1,
      explanation: `${m}x${n} multiplication table. Find ${k}th smallest. Binary search from 1 to ${right}.`,
      variables: { m, n, k, searchRange: `[1, ${right}]` },
      visualization: makeViz(
        table.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        table.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {})
      ),
    });

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const count = countLE(mid);

      const breakdown = Array.from({ length: m }, (_, i) => Math.min(Math.floor(mid / (i + 1)), n));

      steps.push({
        line: 3,
        explanation: `mid=${mid}. Count of entries <= ${mid}: ${breakdown.join('+')} = ${count}. Need k=${k}.`,
        variables: { left, right, mid, count, k, rowCounts: `[${breakdown.join(', ')}]` },
        visualization: makeViz(
          table.reduce((acc, v, i) => ({ ...acc, [i]: v <= mid ? 'comparing' : 'sorted' }), {}),
          { 0: `<=mid: ${count}` }
        ),
      });

      if (count >= k) {
        steps.push({
          line: 6,
          explanation: `${count} >= ${k}. ${mid} could be the answer or larger. right=${mid}.`,
          variables: { left, right, mid, count },
          visualization: makeViz(
            table.reduce((acc, v, i) => ({ ...acc, [i]: v <= mid ? 'active' : 'sorted' }), {}),
            { 0: `mid=${mid} ok` }
          ),
        });
        right = mid;
      } else {
        steps.push({
          line: 8,
          explanation: `${count} < ${k}. Too few entries <= ${mid}. left=${mid + 1}.`,
          variables: { left, right, mid, count },
          visualization: makeViz(
            table.reduce((acc, v, i) => ({ ...acc, [i]: v <= mid ? 'mismatch' : 'sorted' }), {}),
            { 0: `mid=${mid} low` }
          ),
        });
        left = mid + 1;
      }
    }

    steps.push({
      line: 9,
      explanation: `The ${k}th smallest number in the ${m}x${n} multiplication table is ${left}.`,
      variables: { result: left },
      visualization: makeViz(
        table.reduce((acc, v, i) => ({ ...acc, [i]: v === left ? 'found' : v < left ? 'sorted' : 'mismatch' }), {}),
        table.reduce((acc, v, i) => ({ ...acc, [i]: v === left ? `${k}th` : `${v}` }), {})
      ),
    });

    return steps;
  },
};

export default kthSmallestNumberMultiplicationTable;
