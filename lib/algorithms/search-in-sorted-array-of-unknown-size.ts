import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const searchInSortedArrayOfUnknownSize: AlgorithmDefinition = {
  id: 'search-in-sorted-array-of-unknown-size',
  title: 'Search in Sorted Array of Unknown Size',
  leetcodeNumber: 702,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 702: Search in a sorted array of unknown size (access via reader.get(i)). Exponentially expand window [lo, hi] until target in range, then binary search.',
  tags: ['Binary Search', 'Array', 'Two Pointers', 'Sorting'],
  code: {
    pseudocode: `function search(reader, target):
  lo = 0, hi = 1
  # Expand window until target in range
  while reader.get(hi) < target:
    lo = hi
    hi *= 2
  # Binary search in [lo, hi]
  while lo <= hi:
    mid = (lo + hi) / 2
    val = reader.get(mid)
    if val == target: return mid
    if val < target: lo = mid + 1
    else: hi = mid - 1
  return -1`,
    python: `def search(reader, target):
    lo, hi = 0, 1
    while reader.get(hi) < target:
        lo = hi
        hi *= 2
    while lo <= hi:
        mid = (lo + hi) // 2
        val = reader.get(mid)
        if val == target: return mid
        elif val < target: lo = mid + 1
        else: hi = mid - 1
    return -1`,
    javascript: `function search(reader, target) {
  let lo = 0, hi = 1;
  while (reader.get(hi) < target) { lo = hi; hi *= 2; }
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const val = reader.get(mid);
    if (val === target) return mid;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    java: `public int search(ArrayReader reader, int target) {
    int lo = 0, hi = 1;
    while (reader.get(hi) < target) { lo = hi; hi *= 2; }
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int val = reader.get(mid);
        if (val == target) return mid;
        if (val < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
  },
  defaultInput: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [-1, 0, 3, 5, 9, 12],
      placeholder: '-1,0,3,5,9,12',
      helperText: 'Sorted integers (simulates unknown-size reader)',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 9,
      placeholder: '9',
      helperText: 'Value to search for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const get = (i: number) => (i < n ? nums[i] : Infinity);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Search Unknown Size', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Search for target=${target} in sorted array of unknown size [${nums.join(', ')}].`,
      variables: { target },
      visualization: makeViz({}, {},
        [{ key: 'Target', value: String(target) }]),
    });

    let lo = 0, hi = 1;

    while (get(hi) < target) {
      steps.push({
        line: 4,
        explanation: `reader.get(${hi})=${get(hi)} < target=${target}. Expand: lo=${hi}, hi=${hi * 2}.`,
        variables: { lo, hi, value: get(hi) },
        visualization: makeViz(
          { [lo]: 'pointer', [Math.min(hi, n - 1)]: 'comparing' },
          { [lo]: 'lo', [Math.min(hi, n - 1)]: 'hi' },
          [{ key: 'Expand', value: `hi: ${hi}→${hi * 2}` }],
        ),
      });
      lo = hi;
      hi *= 2;
    }

    steps.push({
      line: 6,
      explanation: `Window found: [${lo}, ${hi}]. reader.get(${hi})=${get(hi)} >= target=${target}. Binary search.`,
      variables: { lo, hi },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: Math.min(hi + 1, n) }, (_, i) => [i, i >= lo && i <= hi ? 'active' : 'visited'])),
        { [lo]: 'lo', [Math.min(hi, n - 1)]: 'hi' },
        [{ key: 'Window', value: `[${lo}, ${hi}]` }],
      ),
    });

    let result = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const val = get(mid);

      const hl: Record<number, string> = {};
      if (lo < n) hl[lo] = 'pointer';
      if (mid < n) hl[mid] = 'active';
      if (hi < n) hl[hi] = 'comparing';

      steps.push({
        line: 8,
        explanation: `lo=${lo}, hi=${hi}, mid=${mid}, reader.get(${mid})=${val === Infinity ? '∞' : val}.`,
        variables: { lo, hi, mid, val },
        visualization: makeViz(hl, { [lo]: 'lo', [Math.min(mid, n - 1)]: 'mid', [Math.min(hi, n - 1)]: 'hi' },
          [{ key: 'mid val', value: val === Infinity ? '∞' : String(val) }, { key: 'target', value: String(target) }]),
      });

      if (val === target) {
        result = mid;
        if (mid < n) {
          steps.push({
            line: 9,
            explanation: `Found target=${target} at index ${mid}!`,
            variables: { found: mid },
            visualization: makeViz({ [mid]: 'found' }, { [mid]: 'found' },
              [{ key: 'Found at', value: String(mid) }]),
          });
        }
        break;
      } else if (val < target) {
        lo = mid + 1;
        steps.push({
          line: 10,
          explanation: `val=${val} < target=${target}. Search right: lo=${lo}.`,
          variables: { lo },
          visualization: makeViz({ [Math.min(mid, n - 1)]: 'visited' }, {},
            [{ key: 'Direction', value: 'Right' }]),
        });
      } else {
        hi = mid - 1;
        steps.push({
          line: 11,
          explanation: `val=${val} > target=${target}. Search left: hi=${hi}.`,
          variables: { hi },
          visualization: makeViz({ [Math.min(mid, n - 1)]: 'visited' }, {},
            [{ key: 'Direction', value: 'Left' }]),
        });
      }
    }

    steps.push({
      line: 1,
      explanation: result === -1 ? `Target ${target} not found. Return -1.` : `Target ${target} found at index ${result}.`,
      variables: { result },
      visualization: makeViz(
        result !== -1 && result < n ? { [result]: 'found' } : {},
        result !== -1 && result < n ? { [result]: String(target) } : {},
        [{ key: 'Result', value: String(result) }],
      ),
    });

    return steps;
  },
};

export default searchInSortedArrayOfUnknownSize;
