import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const smallestRangeCoveringElements: AlgorithmDefinition = {
  id: 'smallest-range-covering-elements',
  title: 'Smallest Range Covering Elements from K Lists',
  leetcodeNumber: 632,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Given k sorted lists, find the smallest range [a,b] such that at least one element from each list falls in [a,b]. Use a min-heap seeded with the first element from each list, tracking the current maximum. At each step, the range is [heap.min, currentMax]. Pop the minimum, advance its list pointer, update max, and record the best range.',
  tags: ['heap', 'priority queue', 'sliding window', 'greedy'],

  code: {
    pseudocode: `function smallestRange(nums):
  // seed heap with first element from each list
  minHeap = [(nums[i][0], i, 0) for i in range(k)]
  currentMax = max(nums[i][0] for i in range(k))
  bestRange = [-inf, inf]

  while heap not empty:
    (val, listIdx, elemIdx) = heap.pop()
    range = [val, currentMax]
    if rangeSize(range) < rangeSize(bestRange):
      bestRange = range
    if elemIdx + 1 >= len(nums[listIdx]):
      break  // one list exhausted
    nextVal = nums[listIdx][elemIdx + 1]
    heap.push((nextVal, listIdx, elemIdx + 1))
    currentMax = max(currentMax, nextVal)

  return bestRange`,

    python: `import heapq

def smallestRange(nums: list[list[int]]) -> list[int]:
    heap = [(lst[0], i, 0) for i, lst in enumerate(nums)]
    heapq.heapify(heap)
    cur_max = max(lst[0] for lst in nums)
    best = [heap[0][0], cur_max]

    while heap:
        val, li, ei = heapq.heappop(heap)
        if cur_max - val < best[1] - best[0]:
            best = [val, cur_max]
        if ei + 1 == len(nums[li]):
            break
        nxt = nums[li][ei + 1]
        heapq.heappush(heap, (nxt, li, ei + 1))
        cur_max = max(cur_max, nxt)
    return best`,

    javascript: `function smallestRange(nums) {
  // Simplified: merge all with list info, sort
  const all = [];
  for (let i = 0; i < nums.length; i++)
    for (const v of nums[i]) all.push([v, i]);
  all.sort((a, b) => a[0] - b[0]);

  const k = nums.length;
  const count = new Array(k).fill(0);
  let have = 0, best = [-Infinity, Infinity];
  let l = 0;
  for (let r = 0; r < all.length; r++) {
    if (count[all[r][1]]++ === 0) have++;
    while (have === k) {
      const [lo] = all[l], hi = all[r][0];
      if (hi - lo < best[1] - best[0]) best = [lo, hi];
      if (--count[all[l][1]] === 0) have--;
      l++;
    }
  }
  return best;
}`,

    java: `public int[] smallestRange(List<List<Integer>> nums) {
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    int curMax = Integer.MIN_VALUE;
    for (int i = 0; i < nums.size(); i++) {
        pq.offer(new int[]{nums.get(i).get(0), i, 0});
        curMax = Math.max(curMax, nums.get(i).get(0));
    }
    int[] best = {pq.peek()[0], curMax};
    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        if (curMax - top[0] < best[1] - best[0]) best = new int[]{top[0], curMax};
        int ni = top[2] + 1;
        if (ni >= nums.get(top[1]).size()) break;
        int nv = nums.get(top[1]).get(ni);
        pq.offer(new int[]{nv, top[1], ni});
        curMax = Math.max(curMax, nv);
    }
    return best;
}`,
  },

  defaultInput: {
    nums: [4, 10, 15, 24],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'First Elements of Lists',
      type: 'array',
      defaultValue: [4, 10, 15, 24],
      placeholder: '4,10,15,24',
      helperText: 'Fixed lists used: [4,10,15,24], [0,9,12,20], [5,18,22,30]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    // Fixed k lists for demonstration
    const lists = [
      [4, 10, 15, 24, 26],
      [0, 9, 12, 20],
      [5, 18, 22, 30],
    ];
    const k = lists.length;

    // Seed the heap
    type HeapEntry = [number, number, number]; // [val, listIdx, elemIdx]
    let heap: HeapEntry[] = lists.map((lst, i): HeapEntry => [lst[0], i, 0]);
    heap.sort((a, b) => a[0] - b[0]);
    let curMax = Math.max(...lists.map(lst => lst[0]));
    let best: [number, number] = [heap[0][0], curMax];

    steps.push({
      line: 1,
      explanation: `Initialize: ${k} lists. Heap seeded with first element from each list: [${heap.map(h => h[0]).join(', ')}]. CurrentMax = ${curMax}. Initial range: [${best[0]}, ${best[1]}].`,
      variables: { k, heapMin: heap[0][0], currentMax: curMax, initialRange: `[${best[0]}, ${best[1]}]` },
      visualization: {
        type: 'array',
        array: heap.map(h => h[0]),
        highlights: { 0: 'active', [heap.length - 1]: 'active' },
        labels: { 0: `min:${heap[0][0]}`, [heap.length - 1]: `max:${curMax}` },
      },
    });

    let iteration = 0;
    const maxIterations = 12;

    while (heap.length > 0 && iteration < maxIterations) {
      const [val, li, ei] = heap.shift()!;

      const rangeSize = curMax - val;
      const bestSize = best[1] - best[0];

      steps.push({
        line: 7,
        explanation: `Pop min from heap: val=${val} (list ${li}, elem ${ei}). Range [${val}, ${curMax}], size=${rangeSize}. Best so far: [${best[0]}, ${best[1]}], size=${bestSize}.`,
        variables: { popped: val, listIdx: li, elemIdx: ei, currentRange: `[${val}, ${curMax}]`, currentMax: curMax },
        visualization: {
          type: 'array',
          array: heap.map(h => h[0]).concat([curMax]),
          highlights: { 0: 'pointer', [heap.length]: 'pointer' },
          labels: { 0: heap.length > 0 ? `heapMin:${heap[0]?.[0]}` : 'empty', [heap.length]: `max:${curMax}` },
        },
      });

      if (rangeSize < bestSize) {
        best = [val, curMax];
        steps.push({
          line: 9,
          explanation: `New best range: [${val}, ${curMax}] with size ${rangeSize} < ${bestSize}. Updated best range!`,
          variables: { bestRange: `[${best[0]}, ${best[1]}]`, size: rangeSize },
          visualization: {
            type: 'array',
            array: [val, curMax],
            highlights: { 0: 'found', 1: 'found' },
            labels: { 0: `lo:${val}`, 1: `hi:${curMax}` },
          },
        });
      }

      if (ei + 1 >= lists[li].length) {
        steps.push({
          line: 11,
          explanation: `List ${li} is exhausted (no more elements). Cannot cover all lists. Stop.`,
          variables: { exhaustedList: li, bestRange: `[${best[0]}, ${best[1]}]` },
          visualization: {
            type: 'array',
            array: [best[0], best[1]],
            highlights: { 0: 'found', 1: 'found' },
            labels: { 0: `ans lo:${best[0]}`, 1: `ans hi:${best[1]}` },
          },
        });
        break;
      }

      const nextVal = lists[li][ei + 1];
      heap.push([nextVal, li, ei + 1]);
      heap.sort((a, b) => a[0] - b[0]);
      curMax = Math.max(curMax, nextVal);

      steps.push({
        line: 14,
        explanation: `Advance list ${li}: next element = ${nextVal}. Push to heap. CurrentMax = ${curMax}. Heap: [${heap.map(h => h[0]).join(', ')}].`,
        variables: { nextVal, listIdx: li, newCurrentMax: curMax },
        visualization: {
          type: 'array',
          array: heap.map(h => h[0]),
          highlights: heap.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'active'; return acc; }, {}),
          labels: { 0: `min:${heap[0][0]}` },
        },
      });

      iteration++;
    }

    steps.push({
      line: 17,
      explanation: `Final answer: smallest range = [${best[0]}, ${best[1]}]. This range covers at least one element from every list.`,
      variables: { answer: `[${best[0]}, ${best[1]}]`, size: best[1] - best[0] },
      visualization: {
        type: 'array',
        array: [best[0], best[1]],
        highlights: { 0: 'found', 1: 'found' },
        labels: { 0: `lo:${best[0]}`, 1: `hi:${best[1]}` },
      },
    });

    return steps;
  },
};

export default smallestRangeCoveringElements;
