import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const peakIndexInMountainArrayII: AlgorithmDefinition = {
  id: 'peak-index-in-mountain-array-ii',
  title: 'Peak Index in Mountain Array II',
  leetcodeNumber: 852,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 852: Find the peak index in a mountain array. Binary search: if arr[mid] < arr[mid+1] then peak is to the right, else peak is at or to the left. O(log n).',
  tags: ['Binary Search', 'Array', 'Sorting', 'Mountain Array'],
  code: {
    pseudocode: `function peakIndexInMountainArray(arr):
  lo = 0, hi = n - 1
  while lo < hi:
    mid = (lo + hi) / 2
    if arr[mid] < arr[mid+1]:
      lo = mid + 1  # peak is to the right
    else:
      hi = mid  # peak is at mid or left
  return lo`,
    python: `def peakIndexInMountainArray(arr):
    lo, hi = 0, len(arr) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < arr[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo`,
    javascript: `function peakIndexInMountainArray(arr) {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
    java: `public int peakIndexInMountainArray(int[] arr) {
    int lo = 0, hi = arr.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < arr[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
  },
  defaultInput: { arr: [0, 2, 1, 0] },
  inputFields: [
    {
      name: 'arr',
      label: 'Mountain Array',
      type: 'array',
      defaultValue: [0, 2, 1, 0],
      placeholder: '0,2,1,0',
      helperText: 'Mountain array (strictly increases then decreases)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = (input.arr as number[]).slice();
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Peak Index', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Find peak index in mountain array [${arr.join(', ')}].`,
      variables: { arr: [...arr] },
      visualization: makeViz({}, {}),
    });

    let lo = 0, hi = arr.length - 1;

    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      const hl: Record<number, string> = {};
      hl[lo] = 'pointer';
      hl[mid] = 'active';
      hl[hi] = 'comparing';

      steps.push({
        line: 3,
        explanation: `lo=${lo}, hi=${hi}, mid=${mid}. arr[${mid}]=${arr[mid]}, arr[${mid + 1}]=${arr[mid + 1]}.`,
        variables: { lo, hi, mid, midVal: arr[mid], nextVal: arr[mid + 1] },
        visualization: makeViz(hl, { [lo]: 'lo', [mid]: 'mid', [hi]: 'hi' },
          [{ key: 'arr[mid]', value: String(arr[mid]) }, { key: 'arr[mid+1]', value: String(arr[mid + 1]) }]),
      });

      if (arr[mid] < arr[mid + 1]) {
        steps.push({
          line: 5,
          explanation: `arr[${mid}]=${arr[mid]} < arr[${mid + 1}]=${arr[mid + 1]}. Peak is to the right. lo=${mid + 1}.`,
          variables: { lo: mid + 1 },
          visualization: makeViz({ ...hl, [mid]: 'visited' }, {},
            [{ key: 'Peak direction', value: 'Right →' }]),
        });
        lo = mid + 1;
      } else {
        steps.push({
          line: 7,
          explanation: `arr[${mid}]=${arr[mid]} >= arr[${mid + 1}]=${arr[mid + 1]}. Peak is at or left. hi=${mid}.`,
          variables: { hi: mid },
          visualization: makeViz({ ...hl, [mid]: 'active' }, {},
            [{ key: 'Peak direction', value: '← Left or here' }]),
        });
        hi = mid;
      }
    }

    steps.push({
      line: 1,
      explanation: `Peak index is ${lo}. arr[${lo}]=${arr[lo]} is the mountain peak.`,
      variables: { peakIndex: lo, peakValue: arr[lo] },
      visualization: makeViz(
        { ...Object.fromEntries(arr.map((_, i) => [i, 'visited'])), [lo]: 'found' },
        { [lo]: 'peak' },
        [{ key: 'Peak at', value: `index ${lo}, val=${arr[lo]}` }],
      ),
    });

    return steps;
  },
};

export default peakIndexInMountainArrayII;
