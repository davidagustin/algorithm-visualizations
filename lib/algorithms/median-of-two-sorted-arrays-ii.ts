import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const medianOfTwoSortedArraysIi: AlgorithmDefinition = {
  id: 'median-of-two-sorted-arrays-ii',
  title: 'Median of Two Sorted Arrays (Merge Approach)',
  leetcodeNumber: 4,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Find the median of two sorted arrays using a merge-based approach. Merge the two arrays step by step until reaching the median position. For odd total length return the middle element; for even total length return the average of the two middle elements. O((m+n)) time.',
  tags: ['binary search', 'merge', 'sorting', 'median'],

  code: {
    pseudocode: `function findMedianSortedArrays(nums1, nums2):
  merged = merge(nums1, nums2)
  n = len(merged)
  if n is odd:
    return merged[n / 2]
  else:
    return (merged[n/2 - 1] + merged[n/2]) / 2

function merge(a, b):
  result = [], i = 0, j = 0
  while i < len(a) and j < len(b):
    if a[i] <= b[j]: append a[i++]
    else: append b[j++]
  append remaining elements
  return result`,

    python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    merged = []
    i, j = 0, 0
    while i < len(nums1) and j < len(nums2):
        if nums1[i] <= nums2[j]:
            merged.append(nums1[i]); i += 1
        else:
            merged.append(nums2[j]); j += 1
    merged.extend(nums1[i:])
    merged.extend(nums2[j:])
    n = len(merged)
    return merged[n // 2] if n % 2 else (merged[n // 2 - 1] + merged[n // 2]) / 2`,

    javascript: `function findMedianSortedArrays(nums1, nums2) {
  const merged = [];
  let i = 0, j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) merged.push(nums1[i++]);
    else merged.push(nums2[j++]);
  }
  while (i < nums1.length) merged.push(nums1[i++]);
  while (j < nums2.length) merged.push(nums2[j++]);
  const n = merged.length;
  return n % 2 ? merged[n >> 1] : (merged[n / 2 - 1] + merged[n / 2]) / 2;
}`,

    java: `public double findMedianSortedArrays(int[] nums1, int[] nums2) {
    int[] merged = new int[nums1.length + nums2.length];
    int i = 0, j = 0, k = 0;
    while (i < nums1.length && j < nums2.length)
        merged[k++] = nums1[i] <= nums2[j] ? nums1[i++] : nums2[j++];
    while (i < nums1.length) merged[k++] = nums1[i++];
    while (j < nums2.length) merged[k++] = nums2[j++];
    int n = merged.length;
    return n % 2 == 1 ? merged[n / 2] : (merged[n / 2 - 1] + merged[n / 2]) / 2.0;
}`,
  },

  defaultInput: {
    nums1: [1, 3, 8],
    nums2: [2, 5, 6, 10],
  },

  inputFields: [
    {
      name: 'nums1',
      label: 'Array 1',
      type: 'array',
      defaultValue: [1, 3, 8],
      placeholder: '1,3,8',
      helperText: 'First sorted array',
    },
    {
      name: 'nums2',
      label: 'Array 2',
      type: 'array',
      defaultValue: [2, 5, 6, 10],
      placeholder: '2,5,6,10',
      helperText: 'Second sorted array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = input.nums1 as number[];
    const nums2 = input.nums2 as number[];
    const steps: AlgorithmStep[] = [];

    const merged: number[] = [];
    let i = 0, j = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...merged],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Merge nums1=[${nums1.join(', ')}] and nums2=[${nums2.join(', ')}] step by step.`,
      variables: { nums1: `[${nums1.join(', ')}]`, nums2: `[${nums2.join(', ')}]` },
      visualization: {
        type: 'array',
        array: [...nums1, ...nums2],
        highlights: {
          ...nums1.reduce((acc: Record<number, string>, _, idx) => ({ ...acc, [idx]: 'active' }), {}),
          ...nums2.reduce((acc: Record<number, string>, _, idx) => ({ ...acc, [nums1.length + idx]: 'pointer' }), {}),
        },
        labels: {
          0: 'A[0]',
          [nums1.length]: 'B[0]',
        },
      },
    });

    while (i < nums1.length && j < nums2.length) {
      steps.push({
        line: 7,
        explanation: `Compare nums1[${i}]=${nums1[i]} and nums2[${j}]=${nums2[j]}. Pick ${nums1[i] <= nums2[j] ? nums1[i] : nums2[j]}.`,
        variables: { 'i (in nums1)': i, 'j (in nums2)': j, 'nums1[i]': nums1[i], 'nums2[j]': nums2[j] },
        visualization: {
          type: 'array',
          array: [...nums1, ...nums2],
          highlights: {
            [i]: 'comparing',
            [nums1.length + j]: 'comparing',
          },
          labels: {
            [i]: `A[${i}]`,
            [nums1.length + j]: `B[${j}]`,
          },
        },
      });

      if (nums1[i] <= nums2[j]) {
        merged.push(nums1[i]);
        steps.push({
          line: 8,
          explanation: `nums1[${i}]=${nums1[i]} <= nums2[${j}]=${nums2[j]}. Append ${nums1[i]} to merged. i=${i + 1}.`,
          variables: { merged: `[${merged.join(', ')}]` },
          visualization: makeViz(
            { [merged.length - 1]: 'found' },
            { [merged.length - 1]: `${merged[merged.length - 1]}` }
          ),
        });
        i++;
      } else {
        merged.push(nums2[j]);
        steps.push({
          line: 10,
          explanation: `nums2[${j}]=${nums2[j]} < nums1[${i}]=${nums1[i]}. Append ${nums2[j]} to merged. j=${j + 1}.`,
          variables: { merged: `[${merged.join(', ')}]` },
          visualization: makeViz(
            { [merged.length - 1]: 'found' },
            { [merged.length - 1]: `${merged[merged.length - 1]}` }
          ),
        });
        j++;
      }
    }

    while (i < nums1.length) {
      merged.push(nums1[i]);
      steps.push({
        line: 12,
        explanation: `Append remaining nums1[${i}]=${nums1[i]}.`,
        variables: { merged: `[${merged.join(', ')}]` },
        visualization: makeViz(
          { [merged.length - 1]: 'active' },
          { [merged.length - 1]: `${merged[merged.length - 1]}` }
        ),
      });
      i++;
    }

    while (j < nums2.length) {
      merged.push(nums2[j]);
      steps.push({
        line: 13,
        explanation: `Append remaining nums2[${j}]=${nums2[j]}.`,
        variables: { merged: `[${merged.join(', ')}]` },
        visualization: makeViz(
          { [merged.length - 1]: 'active' },
          { [merged.length - 1]: `${merged[merged.length - 1]}` }
        ),
      });
      j++;
    }

    const n = merged.length;
    let median: number;
    if (n % 2 === 1) {
      median = merged[Math.floor(n / 2)];
      steps.push({
        line: 15,
        explanation: `Merged: [${merged.join(', ')}]. Odd length ${n}. Median = merged[${Math.floor(n / 2)}] = ${median}.`,
        variables: { merged: `[${merged.join(', ')}]`, medianIndex: Math.floor(n / 2), result: median },
        visualization: makeViz(
          { [Math.floor(n / 2)]: 'found' },
          { [Math.floor(n / 2)]: `median=${median}` }
        ),
      });
    } else {
      const left = merged[n / 2 - 1];
      const right = merged[n / 2];
      median = (left + right) / 2;
      steps.push({
        line: 17,
        explanation: `Merged: [${merged.join(', ')}]. Even length ${n}. Median = (${left}+${right})/2 = ${median}.`,
        variables: { merged: `[${merged.join(', ')}]`, leftMid: left, rightMid: right, result: median },
        visualization: makeViz(
          { [n / 2 - 1]: 'found', [n / 2]: 'found' },
          { [n / 2 - 1]: `${left}`, [n / 2]: `${right}` }
        ),
      });
    }

    return steps;
  },
};

export default medianOfTwoSortedArraysIi;
