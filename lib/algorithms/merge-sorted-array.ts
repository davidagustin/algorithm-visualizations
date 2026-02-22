import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mergeSortedArray: AlgorithmDefinition = {
  id: 'merge-sorted-array',
  title: 'Merge Sorted Array',
  leetcodeNumber: 88,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Merge two sorted arrays nums1 and nums2 in-place into nums1. nums1 has length m+n with m valid elements. Use two pointers starting from the end of each array to avoid overwriting elements, placing the larger element at the back of nums1.',
  tags: ['two pointers', 'array', 'sorting', 'merge'],

  code: {
    pseudocode: `function merge(nums1, m, nums2, n):
  i = m - 1  // pointer in nums1
  j = n - 1  // pointer in nums2
  k = m + n - 1  // write position
  while i >= 0 and j >= 0:
    if nums1[i] > nums2[j]:
      nums1[k--] = nums1[i--]
    else:
      nums1[k--] = nums2[j--]
  while j >= 0:
    nums1[k--] = nums2[j--]`,

    python: `def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    i, j, k = m - 1, n - 1, m + n - 1
    while i >= 0 and j >= 0:
        if nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1
    while j >= 0:
        nums1[k] = nums2[j]
        j -= 1
        k -= 1`,

    javascript: `function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
  while (j >= 0) nums1[k--] = nums2[j--];
}`,

    java: `public void merge(int[] nums1, int m, int[] nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
    while (j >= 0) nums1[k--] = nums2[j--];
}`,
  },

  defaultInput: {
    nums1: [1, 2, 3, 0, 0, 0],
    m: 3,
    nums2: [2, 5, 6],
    n: 3,
  },

  inputFields: [
    {
      name: 'nums1',
      label: 'nums1 (with trailing zeros)',
      type: 'array',
      defaultValue: [1, 2, 3, 0, 0, 0],
      placeholder: '1,2,3,0,0,0',
      helperText: 'First sorted array with m+n slots',
    },
    {
      name: 'm',
      label: 'm (valid elements in nums1)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of valid elements in nums1',
    },
    {
      name: 'nums2',
      label: 'nums2',
      type: 'array',
      defaultValue: [2, 5, 6],
      placeholder: '2,5,6',
      helperText: 'Second sorted array',
    },
    {
      name: 'n',
      label: 'n (length of nums2)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of elements in nums2',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = [...(input.nums1 as number[])];
    const m = input.m as number;
    const nums2 = [...(input.nums2 as number[])];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    let i = m - 1;
    let j = n - 1;
    let k = m + n - 1;

    steps.push({
      line: 1,
      explanation: `Initialize: i=${i} (end of nums1 valid), j=${j} (end of nums2), k=${k} (write from back). Merge in reverse to avoid overwriting.`,
      variables: { i, j, k, m, n },
      visualization: makeViz(nums1, { [i]: 'pointer', [k]: 'active' }, { [i]: 'i', [k]: 'k' }),
    });

    while (i >= 0 && j >= 0) {
      if (nums1[i] > nums2[j]) {
        steps.push({
          line: 5,
          explanation: `nums1[${i}]=${nums1[i]} > nums2[${j}]=${nums2[j]}. Place ${nums1[i]} at position k=${k}.`,
          variables: { i, j, k, 'nums1[i]': nums1[i], 'nums2[j]': nums2[j] },
          visualization: makeViz(nums1, { [i]: 'active', [k]: 'swapping' }, { [i]: 'i', [k]: 'k' }),
        });
        nums1[k] = nums1[i];
        i--;
        k--;
      } else {
        steps.push({
          line: 7,
          explanation: `nums2[${j}]=${nums2[j]} >= nums1[${i}]=${nums1[i]}. Place ${nums2[j]} at position k=${k}.`,
          variables: { i, j, k, 'nums1[i]': nums1[i], 'nums2[j]': nums2[j] },
          visualization: makeViz(nums1, { [k]: 'swapping' }, { [k]: `n2[${j}]` }),
        });
        nums1[k] = nums2[j];
        j--;
        k--;
      }

      steps.push({
        line: 5,
        explanation: `Updated array: [${nums1.join(', ')}]. i=${i}, j=${j}, k=${k}.`,
        variables: { i, j, k },
        visualization: makeViz(nums1, { [k + 1]: 'found' }, { [k + 1]: 'placed' }),
      });
    }

    while (j >= 0) {
      steps.push({
        line: 9,
        explanation: `Remaining nums2[${j}]=${nums2[j]}. Copy to position ${k}.`,
        variables: { j, k, 'nums2[j]': nums2[j] },
        visualization: makeViz(nums1, { [k]: 'comparing' }, { [k]: `n2[${j}]` }),
      });
      nums1[k] = nums2[j];
      j--;
      k--;
    }

    steps.push({
      line: 10,
      explanation: `Merge complete: [${nums1.join(', ')}].`,
      variables: { result: [...nums1] },
      visualization: makeViz(nums1, Object.fromEntries(nums1.map((_, idx) => [idx, 'found'])), {}),
    });

    return steps;
  },
};

export default mergeSortedArray;
