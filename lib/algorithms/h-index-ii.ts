import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const hIndexIi: AlgorithmDefinition = {
  id: 'h-index-ii',
  title: 'H-Index II',
  leetcodeNumber: 275,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given citations sorted in ascending order, find the researcher h-index: the maximum h such that the researcher has h papers each cited at least h times. Binary search on h in O(log n) time.',
  tags: ['binary search', 'array', 'sorted', 'h-index'],

  code: {
    pseudocode: `function hIndex(citations):
  n = len(citations)
  left = 0, right = n
  while left < right:
    mid = (left + right + 1) / 2
    if citations[n - mid] >= mid:
      left = mid
    else:
      right = mid - 1
  return left`,
    python: `def hIndex(citations: list[int]) -> int:
    n = len(citations)
    left, right = 0, n
    while left < right:
        mid = (left + right + 1) // 2
        if citations[n - mid] >= mid:
            left = mid
        else:
            right = mid - 1
    return left`,
    javascript: `function hIndex(citations) {
  const n = citations.length;
  let left = 0, right = n;
  while (left < right) {
    const mid = Math.ceil((left + right) / 2);
    if (citations[n - mid] >= mid) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  return left;
}`,
    java: `public int hIndex(int[] citations) {
    int n = citations.length;
    int left = 0, right = n;
    while (left < right) {
        int mid = (left + right + 1) / 2;
        if (citations[n - mid] >= mid) {
            left = mid;
        } else {
            right = mid - 1;
        }
    }
    return left;
}`,
  },

  defaultInput: {
    citations: [0, 1, 3, 5, 6],
  },

  inputFields: [
    {
      name: 'citations',
      label: 'Citations (sorted ascending)',
      type: 'array',
      defaultValue: [0, 1, 3, 5, 6],
      placeholder: '0,1,3,5,6',
      helperText: 'Comma-separated sorted citation counts',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const citations = input.citations as number[];
    const steps: AlgorithmStep[] = [];
    const n = citations.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...citations],
      highlights,
      labels,
    });

    let left = 0;
    let right = n;

    steps.push({
      line: 1,
      explanation: `n=${n}. Binary search on h from 0 to ${n}. left=${left}, right=${right}.`,
      variables: { n, left, right },
      visualization: makeViz({}, {}),
    });

    while (left < right) {
      const mid = Math.ceil((left + right) / 2);
      const idx = n - mid;
      const citVal = idx >= 0 && idx < n ? citations[idx] : -1;

      steps.push({
        line: 4,
        explanation: `mid=${mid}, checking if citations[n-mid]=citations[${idx}]=${citVal} >= mid=${mid}.`,
        variables: { left, mid, right, 'citations[n-mid]': citVal },
        visualization: makeViz(
          { [idx]: 'comparing' },
          { [idx]: `c[${idx}]` }
        ),
      });

      if (citVal >= mid) {
        steps.push({
          line: 5,
          explanation: `citations[${idx}]=${citVal} >= ${mid}. At least ${mid} papers have >= ${mid} citations. Increase left to ${mid}.`,
          variables: { left: mid, right, h: mid },
          visualization: makeViz(
            { [idx]: 'found' },
            { [idx]: `>= ${mid}` }
          ),
        });
        left = mid;
      } else {
        steps.push({
          line: 7,
          explanation: `citations[${idx}]=${citVal} < ${mid}. Not enough papers. Set right=${mid - 1}.`,
          variables: { left, right: mid - 1 },
          visualization: makeViz(
            { [idx]: 'mismatch' },
            { [idx]: `< ${mid}` }
          ),
        });
        right = mid - 1;
      }
    }

    steps.push({
      line: 9,
      explanation: `Binary search complete. H-index = ${left}.`,
      variables: { result: left },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default hIndexIi;
