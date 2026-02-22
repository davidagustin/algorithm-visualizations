import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const slidingWindowMedian: AlgorithmDefinition = {
  id: 'sliding-window-median',
  title: 'Sliding Window Median',
  leetcodeNumber: 480,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an array nums and integer k, find the median of each window of size k as it slides from left to right. Use two heaps (max-heap for lower half, min-heap for upper half) or a sorted structure. For each window of size k, compute median as middle element if k is odd, or average of two middle elements if k is even. Simulate by sorting each window for visualization.',
  tags: ['sliding window', 'heap', 'sorting', 'median'],

  code: {
    pseudocode: `function medianSlidingWindow(nums, k):
  result = []
  window = sorted(nums[0:k])
  result.append(median(window))
  for i in range(k, len(nums)):
    remove nums[i-k] from window
    insert nums[i] into window (maintain sorted)
    result.append(median(window))
  return result

function median(window):
  n = len(window)
  if n % 2 == 1: return window[n // 2]
  else: return (window[n//2 - 1] + window[n//2]) / 2`,

    python: `def medianSlidingWindow(nums: list[int], k: int) -> list[float]:
    import sortedcontainers
    window = sortedcontainers.SortedList(nums[:k])
    result = []
    def get_median():
        if k % 2 == 1: return float(window[k//2])
        return (window[k//2 - 1] + window[k//2]) / 2.0
    result.append(get_median())
    for i in range(k, len(nums)):
        window.remove(nums[i-k])
        window.add(nums[i])
        result.append(get_median())
    return result`,

    javascript: `function medianSlidingWindow(nums, k) {
  const result = [];
  let window = nums.slice(0, k).sort((a, b) => a - b);
  const median = (w) => k % 2 === 1 ? w[Math.floor(k/2)] : (w[k/2-1] + w[k/2]) / 2;
  result.push(median(window));
  for (let i = k; i < nums.length; i++) {
    const removeIdx = window.indexOf(nums[i-k]);
    window.splice(removeIdx, 1);
    let insertIdx = 0;
    while (insertIdx < window.length && window[insertIdx] < nums[i]) insertIdx++;
    window.splice(insertIdx, 0, nums[i]);
    result.push(median(window));
  }
  return result;
}`,

    java: `public double[] medianSlidingWindow(int[] nums, int k) {
    double[] result = new double[nums.length - k + 1];
    TreeMap<Integer,Integer> lo = new TreeMap<>(Collections.reverseOrder());
    TreeMap<Integer,Integer> hi = new TreeMap<>();
    // ... (complex balanced BST solution)
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 3, -1, -3, 5, 3, 6, 7],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, -1, -3, 5, 3, 6, 7],
      placeholder: '1,3,-1,-3,5,3,6,7',
      helperText: 'Array of integers',
    },
    {
      name: 'k',
      label: 'Window Size (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Size of sliding window',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    const computeMedian = (sorted: number[]): number => {
      if (k % 2 === 1) return sorted[Math.floor(k / 2)];
      return (sorted[k / 2 - 1] + sorted[k / 2]) / 2;
    };

    steps.push({
      line: 1,
      explanation: `Compute median of each window of size k=${k} over array of length ${n}. Number of windows = ${n - k + 1}.`,
      variables: { n, k, numWindows: n - k + 1 },
      visualization: makeViz({}, {}),
    });

    let window = [...nums.slice(0, k)].sort((a, b) => a - b);
    const results: number[] = [];

    const initHighlights: Record<number, string> = {};
    const initLabels: Record<number, string> = {};
    for (let i = 0; i < k; i++) initHighlights[i] = 'active';
    initLabels[0] = 'L';
    initLabels[k - 1] = 'R';

    steps.push({
      line: 2,
      explanation: `First window [0..${k - 1}]: [${nums.slice(0, k).join(', ')}]. Sorted: [${window.join(', ')}]. Median=${computeMedian(window)}.`,
      variables: { window: window.join(', '), median: computeMedian(window) },
      visualization: makeViz(initHighlights, initLabels),
    });

    results.push(computeMedian(window));

    for (let i = k; i < n; i++) {
      const outgoing = nums[i - k];
      const incoming = nums[i];

      const removeIdx = window.indexOf(outgoing);
      window.splice(removeIdx, 1);
      let insertIdx = 0;
      while (insertIdx < window.length && window[insertIdx] < incoming) insertIdx++;
      window.splice(insertIdx, 0, incoming);

      const med = computeMedian(window);
      results.push(med);

      const left = i - k + 1;
      const right = i;
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let j = left; j <= right; j++) highlights[j] = 'active';
      highlights[i - k] = 'mismatch';
      highlights[i] = 'found';
      labels[left] = 'L';
      labels[right] = 'R';
      labels[i - k] = 'out';
      labels[i] = 'in';

      steps.push({
        line: 5,
        explanation: `Slide window to [${left}..${right}]. Remove ${outgoing}, add ${incoming}. Sorted window: [${window.join(', ')}]. Median=${med}.`,
        variables: { left, right, outgoing, incoming, sortedWindow: window.join(', '), median: med },
        visualization: makeViz(highlights, labels),
      });
    }

    steps.push({
      line: 8,
      explanation: `Done. All medians: [${results.join(', ')}].`,
      variables: { medians: results.join(', '), count: results.length },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default slidingWindowMedian;
