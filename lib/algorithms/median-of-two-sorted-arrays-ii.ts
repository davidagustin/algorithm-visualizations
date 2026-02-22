import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const medianOfTwoSortedArraysII: AlgorithmDefinition = {
  id: 'median-of-two-sorted-arrays-ii',
  title: 'Median of Two Sorted Arrays II',
  leetcodeNumber: 4,
  difficulty: 'Hard',
  category: 'Sorting',
  description:
    'LC 4: Find the median of two sorted arrays in O(log(min(m,n))). Binary search on the smaller array to find the correct partition where max_left <= min_right.',
  tags: ['Binary Search', 'Array', 'Divide and Conquer', 'Sorting'],
  code: {
    pseudocode: `function findMedianSortedArrays(nums1, nums2):
  if len(nums1) > len(nums2): swap them
  m, n = len(nums1), len(nums2)
  lo, hi = 0, m
  while lo <= hi:
    i = (lo + hi) / 2    # partition nums1
    j = (m + n + 1) / 2 - i  # partition nums2
    if i < m and nums2[j-1] > nums1[i]: lo = i+1
    elif i > 0 and nums1[i-1] > nums2[j]: hi = i-1
    else:
      maxLeft = max(nums1[i-1] if i>0, nums2[j-1] if j>0)
      if (m+n) odd: return maxLeft
      minRight = min(nums1[i] if i<m, nums2[j] if j<n)
      return (maxLeft + minRight) / 2`,
    python: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = (m + n + 1) // 2 - i
        if i < m and nums2[j-1] > nums1[i]: lo = i + 1
        elif i > 0 and nums1[i-1] > nums2[j]: hi = i - 1
        else:
            max_left = max(nums1[i-1] if i > 0 else -inf, nums2[j-1] if j > 0 else -inf)
            if (m + n) % 2 == 1: return max_left
            min_right = min(nums1[i] if i < m else inf, nums2[j] if j < n else inf)
            return (max_left + min_right) / 2`,
    javascript: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];
  const m = nums1.length, n = nums2.length;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = Math.floor((lo + hi) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;
    if (i < m && nums2[j-1] > nums1[i]) lo = i + 1;
    else if (i > 0 && nums1[i-1] > nums2[j]) hi = i - 1;
    else {
      const maxLeft = Math.max(i > 0 ? nums1[i-1] : -Infinity, j > 0 ? nums2[j-1] : -Infinity);
      if ((m + n) % 2 === 1) return maxLeft;
      const minRight = Math.min(i < m ? nums1[i] : Infinity, j < n ? nums2[j] : Infinity);
      return (maxLeft + minRight) / 2;
    }
  }
}`,
    java: `public double findMedianSortedArrays(int[] nums1, int[] nums2) {
    if (nums1.length > nums2.length) { int[] t = nums1; nums1 = nums2; nums2 = t; }
    int m = nums1.length, n = nums2.length, lo = 0, hi = m;
    while (lo <= hi) {
        int i = (lo + hi) / 2, j = (m + n + 1) / 2 - i;
        if (i < m && nums2[j-1] > nums1[i]) lo = i + 1;
        else if (i > 0 && nums1[i-1] > nums2[j]) hi = i - 1;
        else {
            int maxLeft = Math.max(i > 0 ? nums1[i-1] : Integer.MIN_VALUE, j > 0 ? nums2[j-1] : Integer.MIN_VALUE);
            if ((m + n) % 2 == 1) return maxLeft;
            int minRight = Math.min(i < m ? nums1[i] : Integer.MAX_VALUE, j < n ? nums2[j] : Integer.MAX_VALUE);
            return (maxLeft + minRight) / 2.0;
        }
    }
    return 0;
}`,
  },
  defaultInput: { nums1: [1, 3], nums2: [2] },
  inputFields: [
    {
      name: 'nums1',
      label: 'Array 1',
      type: 'array',
      defaultValue: [1, 3],
      placeholder: '1,3',
      helperText: 'First sorted array',
    },
    {
      name: 'nums2',
      label: 'Array 2',
      type: 'array',
      defaultValue: [2],
      placeholder: '2',
      helperText: 'Second sorted array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let nums1 = (input.nums1 as number[]).slice();
    let nums2 = (input.nums2 as number[]).slice();
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Median 2 Arrays', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Find median of [${nums1.join(',')}] and [${nums2.join(',')}].`,
      variables: { nums1: [...nums1], nums2: [...nums2] },
      visualization: makeViz([...nums1, ...nums2],
        Object.fromEntries([...nums1, ...nums2].map((_, i) => [i, i < nums1.length ? 'pointer' : 'comparing'])),
        Object.fromEntries([...nums1, ...nums2].map((_, i) => [i, i < nums1.length ? 'A' : 'B'])),
        [{ key: 'A', value: nums1.join(',') }, { key: 'B', value: nums2.join(',') }],
      ),
    });

    if (nums1.length > nums2.length) {
      [nums1, nums2] = [nums2, nums1];
      steps.push({
        line: 2,
        explanation: `Swap arrays so nums1 is shorter. nums1=[${nums1.join(',')}], nums2=[${nums2.join(',')}].`,
        variables: { nums1: [...nums1], nums2: [...nums2] },
        visualization: makeViz([...nums1, ...nums2],
          Object.fromEntries([...nums1, ...nums2].map((_, i) => [i, i < nums1.length ? 'pointer' : 'comparing'])),
          Object.fromEntries([...nums1, ...nums2].map((_, i) => [i, i < nums1.length ? 'A' : 'B'])),
          [{ key: 'Swapped', value: 'A is shorter' }],
        ),
      });
    }

    const m = nums1.length, n = nums2.length;
    let lo = 0, hi = m;
    let median = 0;

    while (lo <= hi) {
      const i = Math.floor((lo + hi) / 2);
      const j = Math.floor((m + n + 1) / 2) - i;

      const maxLeft1 = i > 0 ? nums1[i - 1] : -Infinity;
      const minRight1 = i < m ? nums1[i] : Infinity;
      const maxLeft2 = j > 0 ? nums2[j - 1] : -Infinity;
      const minRight2 = j < n ? nums2[j] : Infinity;

      steps.push({
        line: 5,
        explanation: `Partition: i=${i} in A, j=${j} in B. maxLeft1=${maxLeft1 === -Infinity ? '-∞' : maxLeft1}, maxLeft2=${maxLeft2 === -Infinity ? '-∞' : maxLeft2}, minRight1=${minRight1 === Infinity ? '∞' : minRight1}, minRight2=${minRight2 === Infinity ? '∞' : minRight2}.`,
        variables: { i, j, maxLeft1, maxLeft2, minRight1, minRight2 },
        visualization: makeViz([...nums1, ...nums2],
          {
            ...(i > 0 ? { [i - 1]: 'pointer' } : {}),
            ...(i < m ? { [i]: 'comparing' } : {}),
            ...(j > 0 ? { [m + j - 1]: 'pointer' } : {}),
            ...(j < n ? { [m + j]: 'comparing' } : {}),
          },
          {},
          [{ key: 'i', value: String(i) }, { key: 'j', value: String(j) },
           { key: 'maxL1', value: maxLeft1 === -Infinity ? '-∞' : String(maxLeft1) },
           { key: 'maxL2', value: maxLeft2 === -Infinity ? '-∞' : String(maxLeft2) }],
        ),
      });

      if (i < m && maxLeft2 > minRight1) {
        lo = i + 1;
        steps.push({
          line: 8,
          explanation: `maxLeft2=${maxLeft2} > minRight1=${minRight1}. Move partition right in A. lo=${lo}.`,
          variables: { lo },
          visualization: makeViz([...nums1, ...nums2], {}, {},
            [{ key: 'Adjust', value: 'Move right in A' }]),
        });
      } else if (i > 0 && maxLeft1 > minRight2) {
        hi = i - 1;
        steps.push({
          line: 9,
          explanation: `maxLeft1=${maxLeft1} > minRight2=${minRight2}. Move partition left in A. hi=${hi}.`,
          variables: { hi },
          visualization: makeViz([...nums1, ...nums2], {}, {},
            [{ key: 'Adjust', value: 'Move left in A' }]),
        });
      } else {
        const maxLeft = Math.max(maxLeft1, maxLeft2);
        if ((m + n) % 2 === 1) {
          median = maxLeft;
        } else {
          const minRight = Math.min(minRight1, minRight2);
          median = (maxLeft + minRight) / 2;
        }
        steps.push({
          line: 11,
          explanation: `Valid partition found! maxLeft=${maxLeft === -Infinity ? '-∞' : maxLeft}. Median=${median}.`,
          variables: { median, maxLeft, minRight: Math.min(minRight1, minRight2) },
          visualization: makeViz([...nums1, ...nums2],
            Object.fromEntries([...nums1, ...nums2].map((_, k) => [k, 'found'])),
            {},
            [{ key: 'Median', value: String(median) }],
          ),
        });
        break;
      }
    }

    steps.push({
      line: 1,
      explanation: `Median of the two sorted arrays is ${median}.`,
      variables: { median },
      visualization: makeViz([...nums1, ...nums2],
        Object.fromEntries([...nums1, ...nums2].map((_, i) => [i, 'found'])),
        {},
        [{ key: 'Median', value: String(median) }],
      ),
    });

    return steps;
  },
};

export default medianOfTwoSortedArraysII;
