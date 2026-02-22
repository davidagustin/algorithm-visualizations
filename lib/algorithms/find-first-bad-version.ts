import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findFirstBadVersion: AlgorithmDefinition = {
  id: 'find-first-bad-version',
  title: 'First Bad Version',
  leetcodeNumber: 278,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'Given n versions [1, 2, ..., n], find the first bad version using a provided isBadVersion API. Once a version is bad all subsequent versions are bad. Binary search halves the search space each iteration, achieving O(log n) API calls.',
  tags: ['binary search', 'interactive', 'divide and conquer'],

  code: {
    pseudocode: `function firstBadVersion(n):
  left = 1, right = n
  while left < right:
    mid = left + (right - left) / 2
    if isBadVersion(mid):
      right = mid
    else:
      left = mid + 1
  return left`,

    python: `def firstBadVersion(n: int) -> int:
    left, right = 1, n
    while left < right:
        mid = left + (right - left) // 2
        if isBadVersion(mid):
            right = mid
        else:
            left = mid + 1
    return left`,

    javascript: `function firstBadVersion(n) {
  let left = 1, right = n;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (isBadVersion(mid)) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}`,

    java: `public int firstBadVersion(int n) {
    int left = 1, right = n;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (isBadVersion(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
  },

  defaultInput: {
    n: 10,
    firstBad: 4,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Total versions (n)',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Total number of versions',
    },
    {
      name: 'firstBad',
      label: 'First bad version',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Which version is the first bad one',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const firstBad = input.firstBad as number;
    const steps: AlgorithmStep[] = [];

    // Represent versions as array [1..n]
    const versions = Array.from({ length: n }, (_, i) => i + 1);
    const isBadVersion = (v: number) => v >= firstBad;

    const eliminated = new Set<number>(); // tracks 0-based indices

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => {
      const merged: Record<number, string> = {};
      // Mark known good and known bad
      for (let i = 0; i < n; i++) {
        if (versions[i] < firstBad) merged[i] = 'sorted'; // good
        else if (eliminated.has(i)) merged[i] = 'visited';
      }
      for (const [k, v] of Object.entries(highlights)) {
        merged[Number(k)] = v;
      }
      return {
        type: 'array',
        array: versions,
        highlights: merged,
        labels,
        auxData: {
          label: 'Version Status',
          entries: [
            { key: 'Total versions', value: String(n) },
            { key: 'First bad (hidden)', value: '?' },
          ],
        },
      };
    };

    let left = 1;
    let right = n;

    steps.push({
      line: 2,
      explanation: `Binary search on versions 1 to ${n}. Call isBadVersion(mid) to narrow down the first bad version.`,
      variables: { left, right, n },
      visualization: makeViz(
        { [left - 1]: 'pointer', [right - 1]: 'pointer' },
        { [left - 1]: 'L', [right - 1]: 'R' }
      ),
    });

    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      const bad = isBadVersion(mid);

      steps.push({
        line: 4,
        explanation: `mid = ${mid}. Call isBadVersion(${mid})...`,
        variables: { left, right, mid },
        visualization: makeViz(
          { [left - 1]: 'pointer', [right - 1]: 'pointer', [mid - 1]: 'active' },
          { [left - 1]: 'L', [right - 1]: 'R', [mid - 1]: 'mid' }
        ),
      });

      steps.push({
        line: 5,
        explanation: `isBadVersion(${mid}) = ${bad}. ${bad ? `Version ${mid} is bad — first bad version is here or earlier. right = ${mid}.` : `Version ${mid} is good — first bad is to the right. left = ${mid + 1}.`}`,
        variables: { mid, isBadVersion: bad, left: bad ? left : mid + 1, right: bad ? mid : right },
        visualization: makeViz(
          { [mid - 1]: bad ? 'mismatch' : 'match' },
          { [mid - 1]: bad ? 'bad' : 'good' }
        ),
      });

      if (bad) {
        for (let i = mid; i < right; i++) eliminated.add(i); // indices
        right = mid;
      } else {
        for (let i = left - 1; i < mid; i++) eliminated.add(i);
        left = mid + 1;
      }

      if (left < right) {
        steps.push({
          line: 2,
          explanation: `Search range narrowed to [${left}, ${right}].`,
          variables: { left, right },
          visualization: makeViz(
            { [left - 1]: 'pointer', [right - 1]: 'pointer' },
            { [left - 1]: 'L', [right - 1]: 'R' }
          ),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `left == right == ${left}. First bad version is ${left}.`,
      variables: { result: left },
      visualization: makeViz({ [left - 1]: 'found' }, { [left - 1]: 'first bad' }),
    });

    return steps;
  },
};

export default findFirstBadVersion;
