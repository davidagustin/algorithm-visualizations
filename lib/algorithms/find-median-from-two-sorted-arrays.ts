import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findMedianFromTwoSortedArrays: AlgorithmDefinition = {
  id: 'find-median-from-two-sorted-arrays',
  title: 'Find Median From Two Sorted Arrays',
  leetcodeNumber: 4,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Find the median of two sorted arrays in O(log(min(m,n))) time. Binary search on the partition point of the shorter array. At each partition, the left halves of both arrays should contain elements smaller than the right halves.',
  tags: ['Binary Search', 'Array', 'Divide and Conquer'],
  code: {
    pseudocode: `function findMedianSortedArrays(nums1, nums2):
  if len(nums1) > len(nums2):
    swap nums1, nums2
  m = len(nums1), n = len(nums2)
  left = 0, right = m
  while left <= right:
    i = (left + right) / 2
    j = (m + n + 1) / 2 - i
    maxLeft1 = nums1[i-1] if i > 0 else -INF
    minRight1 = nums1[i] if i < m else INF
    maxLeft2 = nums2[j-1] if j > 0 else -INF
    minRight2 = nums2[j] if j < n else INF
    if maxLeft1 <= minRight2 and maxLeft2 <= minRight1:
      if (m + n) is odd:
        return max(maxLeft1, maxLeft2)
      return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2
    else if maxLeft1 > minRight2:
      right = i - 1
    else:
      left = i + 1`,
    python: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    left, right = 0, m
    while left <= right:
        i = (left + right) // 2
        j = (m + n + 1) // 2 - i
        maxLeft1 = nums1[i-1] if i > 0 else float('-inf')
        minRight1 = nums1[i] if i < m else float('inf')
        maxLeft2 = nums2[j-1] if j > 0 else float('-inf')
        minRight2 = nums2[j] if j < n else float('inf')
        if maxLeft1 <= minRight2 and maxLeft2 <= minRight1:
            if (m + n) % 2 == 1:
                return max(maxLeft1, maxLeft2)
            return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2
        elif maxLeft1 > minRight2:
            right = i - 1
        else:
            left = i + 1`,
    javascript: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];
  const m = nums1.length, n = nums2.length;
  let left = 0, right = m;
  while (left <= right) {
    const i = Math.floor((left + right) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;
    const maxLeft1 = i > 0 ? nums1[i - 1] : -Infinity;
    const minRight1 = i < m ? nums1[i] : Infinity;
    const maxLeft2 = j > 0 ? nums2[j - 1] : -Infinity;
    const minRight2 = j < n ? nums2[j] : Infinity;
    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      if ((m + n) % 2 === 1) return Math.max(maxLeft1, maxLeft2);
      return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
    } else if (maxLeft1 > minRight2) {
      right = i - 1;
    } else {
      left = i + 1;
    }
  }
}`,
    java: `public double findMedianSortedArrays(int[] nums1, int[] nums2) {
    if (nums1.length > nums2.length) {
        int[] tmp = nums1; nums1 = nums2; nums2 = tmp;
    }
    int m = nums1.length, n = nums2.length;
    int left = 0, right = m;
    while (left <= right) {
        int i = (left + right) / 2;
        int j = (m + n + 1) / 2 - i;
        int maxLeft1 = i > 0 ? nums1[i - 1] : Integer.MIN_VALUE;
        int minRight1 = i < m ? nums1[i] : Integer.MAX_VALUE;
        int maxLeft2 = j > 0 ? nums2[j - 1] : Integer.MIN_VALUE;
        int minRight2 = j < n ? nums2[j] : Integer.MAX_VALUE;
        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            if ((m + n) % 2 == 1) return Math.max(maxLeft1, maxLeft2);
            return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2.0;
        } else if (maxLeft1 > minRight2) {
            right = i - 1;
        } else {
            left = i + 1;
        }
    }
    return 0;
}`,
  },
  defaultInput: { nums1: [1, 3], nums2: [2] },
  inputFields: [
    {
      name: 'nums1',
      label: 'Array 1 (sorted)',
      type: 'array',
      defaultValue: [1, 3],
      placeholder: '1,3',
      helperText: 'First sorted array',
    },
    {
      name: 'nums2',
      label: 'Array 2 (sorted)',
      type: 'array',
      defaultValue: [2],
      placeholder: '2',
      helperText: 'Second sorted array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let nums1 = input.nums1 as number[];
    let nums2 = input.nums2 as number[];
    const steps: AlgorithmStep[] = [];

    // Ensure nums1 is the shorter array
    let swapped = false;
    if (nums1.length > nums2.length) {
      [nums1, nums2] = [nums2, nums1];
      swapped = true;
    }

    const m = nums1.length;
    const n = nums2.length;
    const combined = [...nums1, ...nums2];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: combined,
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Partition', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: swapped
        ? `Swapped arrays so nums1 is shorter. nums1=[${nums1.join(',')}] (len ${m}), nums2=[${nums2.join(',')}] (len ${n}). Combined view: [${combined.join(', ')}].`
        : `nums1=[${nums1.join(',')}] (len ${m}), nums2=[${nums2.join(',')}] (len ${n}). Binary search on shorter array. Combined view: [${combined.join(', ')}].`,
      variables: { m, n, totalLen: m + n },
      visualization: makeViz({}, {}),
    });

    let left = 0;
    let right = m;

    steps.push({
      line: 5,
      explanation: `Binary search partition of nums1: left=0, right=${m}. Half length = floor((${m}+${n}+1)/2) = ${Math.floor((m + n + 1) / 2)}.`,
      variables: { left, right },
      visualization: makeViz({}, {}, [
        { key: 'Search on nums1', value: `[0, ${m}]` },
        { key: 'Half length', value: String(Math.floor((m + n + 1) / 2)) },
      ]),
    });

    while (left <= right) {
      const i = Math.floor((left + right) / 2);
      const j = Math.floor((m + n + 1) / 2) - i;

      const maxLeft1 = i > 0 ? nums1[i - 1] : -Infinity;
      const minRight1 = i < m ? nums1[i] : Infinity;
      const maxLeft2 = j > 0 ? nums2[j - 1] : -Infinity;
      const minRight2 = j < n ? nums2[j] : Infinity;

      // Highlight left partition elements
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (let x = 0; x < i; x++) { hl[x] = 'sorted'; }
      for (let x = i; x < m; x++) { hl[x] = 'default'; }
      for (let x = 0; x < j; x++) { hl[m + x] = 'sorted'; }
      for (let x = j; x < n; x++) { hl[m + x] = 'default'; }

      if (i > 0) { hl[i - 1] = 'pointer'; lb[i - 1] = 'maxL1'; }
      if (i < m) { hl[i] = 'comparing'; lb[i] = 'minR1'; }
      if (j > 0) { hl[m + j - 1] = 'pointer'; lb[m + j - 1] = 'maxL2'; }
      if (j < n) { hl[m + j] = 'comparing'; lb[m + j] = 'minR2'; }

      steps.push({
        line: 7,
        explanation: `Partition: i=${i}, j=${j}. maxLeft1=${maxLeft1 === -Infinity ? '-INF' : maxLeft1}, minRight1=${minRight1 === Infinity ? 'INF' : minRight1}, maxLeft2=${maxLeft2 === -Infinity ? '-INF' : maxLeft2}, minRight2=${minRight2 === Infinity ? 'INF' : minRight2}.`,
        variables: { i, j, maxLeft1, minRight1, maxLeft2, minRight2 },
        visualization: makeViz(hl, lb, [
          { key: 'i (nums1 cut)', value: String(i) },
          { key: 'j (nums2 cut)', value: String(j) },
          { key: 'maxLeft1', value: maxLeft1 === -Infinity ? '-INF' : String(maxLeft1) },
          { key: 'minRight1', value: minRight1 === Infinity ? 'INF' : String(minRight1) },
          { key: 'maxLeft2', value: maxLeft2 === -Infinity ? '-INF' : String(maxLeft2) },
          { key: 'minRight2', value: minRight2 === Infinity ? 'INF' : String(minRight2) },
        ]),
      });

      if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
        let median: number;
        if ((m + n) % 2 === 1) {
          median = Math.max(maxLeft1, maxLeft2);
        } else {
          median = (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
        }

        const finalHl: Record<number, string> = {};
        for (let x = 0; x < i; x++) finalHl[x] = 'found';
        for (let x = 0; x < j; x++) finalHl[m + x] = 'found';

        steps.push({
          line: 13,
          explanation: `Valid partition found! maxLeft1(${maxLeft1 === -Infinity ? '-INF' : maxLeft1}) <= minRight2(${minRight2 === Infinity ? 'INF' : minRight2}) and maxLeft2(${maxLeft2 === -Infinity ? '-INF' : maxLeft2}) <= minRight1(${minRight1 === Infinity ? 'INF' : minRight1}). Median = ${median}.`,
          variables: { median, result: median },
          visualization: makeViz(finalHl, {}, [
            { key: 'Median', value: String(median) },
            { key: 'Total elements', value: String(m + n) },
            { key: 'Odd/Even', value: (m + n) % 2 === 1 ? 'Odd' : 'Even' },
          ]),
        });
        return steps;
      } else if (maxLeft1 > minRight2) {
        steps.push({
          line: 16,
          explanation: `maxLeft1(${maxLeft1}) > minRight2(${minRight2}): i is too big. Move right = ${i - 1}.`,
          variables: { left, right: i - 1 },
          visualization: makeViz(hl, lb, [{ key: 'Action', value: 'Decrease i' }]),
        });
        right = i - 1;
      } else {
        steps.push({
          line: 18,
          explanation: `maxLeft2(${maxLeft2}) > minRight1(${minRight1}): i is too small. Move left = ${i + 1}.`,
          variables: { left: i + 1, right },
          visualization: makeViz(hl, lb, [{ key: 'Action', value: 'Increase i' }]),
        });
        left = i + 1;
      }
    }

    return steps;
  },
};

export default findMedianFromTwoSortedArrays;
