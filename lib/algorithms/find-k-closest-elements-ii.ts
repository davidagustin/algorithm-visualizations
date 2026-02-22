import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findKClosestElementsII: AlgorithmDefinition = {
  id: 'find-k-closest-elements-ii',
  title: 'Find K Closest Elements II',
  leetcodeNumber: 658,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 658: Find k closest elements to x in a sorted array. Binary search for the left boundary of the k-element window. Compare arr[mid] vs arr[mid+k] to shift window.',
  tags: ['Binary Search', 'Array', 'Sorting', 'Two Pointers', 'Sliding Window'],
  code: {
    pseudocode: `function findClosestElements(arr, k, x):
  lo = 0, hi = n - k
  while lo < hi:
    mid = (lo + hi) / 2
    # Compare distance from x to left vs right end of window
    if x - arr[mid] > arr[mid+k] - x:
      lo = mid + 1  # window should shift right
    else:
      hi = mid  # window is at or left of mid
  return arr[lo..lo+k-1]`,
    python: `def findClosestElements(arr, k, x):
    lo, hi = 0, len(arr) - k
    while lo < hi:
        mid = (lo + hi) // 2
        if x - arr[mid] > arr[mid + k] - x:
            lo = mid + 1
        else:
            hi = mid
    return arr[lo:lo + k]`,
    javascript: `function findClosestElements(arr, k, x) {
  let lo = 0, hi = arr.length - k;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
    else hi = mid;
  }
  return arr.slice(lo, lo + k);
}`,
    java: `public List<Integer> findClosestElements(int[] arr, int k, int x) {
    int lo = 0, hi = arr.length - k;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;
        else hi = mid;
    }
    List<Integer> result = new ArrayList<>();
    for (int i = lo; i < lo + k; i++) result.add(arr[i]);
    return result;
}`,
  },
  defaultInput: { arr: [1, 2, 3, 4, 5], k: 4, x: 3 },
  inputFields: [
    {
      name: 'arr',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Sorted array of integers',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Number of closest elements',
    },
    {
      name: 'x',
      label: 'x',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Target value',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = (input.arr as number[]).slice();
    const k = input.k as number;
    const x = input.x as number;
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'K Closest Elements', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Find ${k} closest elements to x=${x} in [${arr.join(', ')}].`,
      variables: { arr: [...arr], k, x },
      visualization: makeViz({}, {},
        [{ key: 'k', value: String(k) }, { key: 'x', value: String(x) }]),
    });

    let lo = 0, hi = n - k;

    steps.push({
      line: 2,
      explanation: `Binary search for left boundary. lo=${lo}, hi=${hi} (= n-k = ${n}-${k}).`,
      variables: { lo, hi },
      visualization: makeViz(
        { [lo]: 'pointer', [hi]: 'comparing' },
        { [lo]: 'lo', [hi]: 'hi' },
        [{ key: 'Range', value: `lo=${lo}, hi=${hi}` }],
      ),
    });

    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      const distLeft = x - arr[mid];
      const distRight = arr[mid + k] - x;

      const hl: Record<number, string> = {};
      hl[lo] = 'pointer';
      hl[mid] = 'active';
      hl[Math.min(mid + k, n - 1)] = 'comparing';
      hl[hi] = 'pointer';

      steps.push({
        line: 4,
        explanation: `mid=${mid}. dist(x, arr[${mid}])=|${x}-${arr[mid]}|=${distLeft}, dist(x, arr[${mid + k}])=|${arr[mid + k]}-${x}|=${distRight}.`,
        variables: { mid, distLeft, distRight, arr_mid: arr[mid], arr_mid_k: arr[mid + k] },
        visualization: makeViz(hl,
          { [mid]: `arr[${mid}]`, [mid + k < n ? mid + k : n - 1]: `arr[${mid + k}]` },
          [{ key: `|x-arr[${mid}]|`, value: String(distLeft) }, { key: `|arr[${mid + k}]-x|`, value: String(distRight) }],
        ),
      });

      if (distLeft > distRight) {
        steps.push({
          line: 6,
          explanation: `${distLeft} > ${distRight}: arr[${mid}] is farther from x. Shift window right. lo=${mid + 1}.`,
          variables: { lo: mid + 1 },
          visualization: makeViz({ ...hl, [mid]: 'visited' }, {},
            [{ key: 'Direction', value: 'Shift right →' }]),
        });
        lo = mid + 1;
      } else {
        steps.push({
          line: 8,
          explanation: `${distLeft} <= ${distRight}: arr[${mid + k}] is farther or equal. Keep window. hi=${mid}.`,
          variables: { hi: mid },
          visualization: makeViz({ ...hl, [mid + k < n ? mid + k : n - 1]: 'visited' }, {},
            [{ key: 'Direction', value: '← Stay or left' }]),
        });
        hi = mid;
      }
    }

    const result = arr.slice(lo, lo + k);
    const hl: Record<number, string> = {};
    for (let i = lo; i < lo + k; i++) hl[i] = 'found';

    steps.push({
      line: 1,
      explanation: `K closest elements start at index ${lo}: [${result.join(', ')}].`,
      variables: { result: [...result], lo, k },
      visualization: makeViz(hl,
        Object.fromEntries(result.map((v, i) => [lo + i, String(v)])),
        [{ key: 'Result', value: result.join(', ') }, { key: 'x', value: String(x) }],
      ),
    });

    return steps;
  },
};

export default findKClosestElementsII;
