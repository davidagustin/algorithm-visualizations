import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const searchInSortedArrayOfUnknownSize: AlgorithmDefinition = {
  id: 'search-in-sorted-array-of-unknown-size',
  title: 'Search in a Sorted Array of Unknown Size',
  leetcodeNumber: 702,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given a sorted array accessible only via a get(index) API (returns a large number for out-of-bounds), find the target. First expand the search window exponentially until the right boundary exceeds the target, then apply standard binary search within that window.',
  tags: ['binary search', 'array', 'exponential search'],

  code: {
    pseudocode: `function search(reader, target):
  left = 0, right = 1
  while reader.get(right) < target:
    left = right
    right = right * 2
  while left <= right:
    mid = (left + right) / 2
    val = reader.get(mid)
    if val == target: return mid
    else if val < target: left = mid + 1
    else: right = mid - 1
  return -1`,

    python: `def search(reader, target: int) -> int:
    left, right = 0, 1
    while reader.get(right) < target:
        left = right
        right *= 2
    while left <= right:
        mid = (left + right) // 2
        val = reader.get(mid)
        if val == target:
            return mid
        elif val < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,

    javascript: `function search(reader, target) {
  let left = 0, right = 1;
  while (reader.get(right) < target) {
    left = right;
    right *= 2;
  }
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const val = reader.get(mid);
    if (val === target) return mid;
    else if (val < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,

    java: `public int search(ArrayReader reader, int target) {
    int left = 0, right = 1;
    while (reader.get(right) < target) {
        left = right;
        right *= 2;
    }
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int val = reader.get(mid);
        if (val == target) return mid;
        else if (val < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },

  defaultInput: {
    nums: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    target: 13,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array (simulated reader)',
      type: 'array',
      defaultValue: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
      placeholder: '1,3,5,7,9,11,13,15,17,19',
      helperText: 'Sorted integers (size unknown to algorithm)',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 13,
      placeholder: '13',
      helperText: 'Value to search for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const INF = 2147483647;

    const get = (i: number) => (i < nums.length ? nums[i] : INF);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    let left = 0;
    let right = 1;

    steps.push({
      line: 1,
      explanation: `Start with window [0, 1]. Reader API simulates unknown-size array. Target=${target}.`,
      variables: { left, right, target },
      visualization: makeViz(
        { 0: 'pointer', 1: 'pointer' },
        { 0: 'L', 1: 'R' }
      ),
    });

    while (get(right) < target) {
      steps.push({
        line: 3,
        explanation: `reader.get(${right})=${get(right)} < target=${target}. Expand window: left=${right}, right=${right * 2}.`,
        variables: { left, right, 'reader.get(right)': get(right), target },
        visualization: makeViz(
          { [left]: 'active', [Math.min(right, nums.length - 1)]: 'mismatch' },
          { [left]: 'L', [Math.min(right, nums.length - 1)]: 'R (expand)' }
        ),
      });
      left = right;
      right *= 2;
    }

    steps.push({
      line: 5,
      explanation: `Window found: [${left}, ${Math.min(right, nums.length - 1)}]. Now apply binary search.`,
      variables: { left, right: Math.min(right, nums.length - 1) },
      visualization: makeViz(
        { [left]: 'pointer', [Math.min(right, nums.length - 1)]: 'pointer' },
        { [left]: 'L', [Math.min(right, nums.length - 1)]: 'R' }
      ),
    });

    right = Math.min(right, nums.length - 1);

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const val = get(mid);

      steps.push({
        line: 7,
        explanation: `mid=${mid}, reader.get(${mid})=${val}. Compare with target=${target}.`,
        variables: { left, right, mid, val, target },
        visualization: makeViz(
          { [left]: 'active', [right]: 'active', [mid]: 'comparing' },
          { [left]: 'L', [right]: 'R', [mid]: `val=${val}` }
        ),
      });

      if (val === target) {
        steps.push({
          line: 9,
          explanation: `Found target=${target} at index ${mid}.`,
          variables: { result: mid },
          visualization: makeViz({ [mid]: 'found' }, { [mid]: `ans=${mid}` }),
        });
        return steps;
      } else if (val < target) {
        steps.push({
          line: 10,
          explanation: `${val} < ${target}. Move left to ${mid + 1}.`,
          variables: { left, right, mid },
          visualization: makeViz({ [mid]: 'mismatch' }, { [mid]: 'too small' }),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 11,
          explanation: `${val} > ${target}. Move right to ${mid - 1}.`,
          variables: { left, right, mid },
          visualization: makeViz({ [mid]: 'mismatch' }, { [mid]: 'too big' }),
        });
        right = mid - 1;
      }
    }

    steps.push({
      line: 12,
      explanation: `Target ${target} not found. Return -1.`,
      variables: { result: -1 },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default searchInSortedArrayOfUnknownSize;
