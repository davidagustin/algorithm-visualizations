import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const totalCostToHireKWorkers: AlgorithmDefinition = {
  id: 'total-cost-to-hire-k-workers',
  title: 'Total Cost to Hire K Workers',
  leetcodeNumber: 2462,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given a costs array, hire k workers with the lowest cost. In each hiring round, choose the cheapest among the first "candidates" and last "candidates" workers (excluding already hired). Use two min heaps: one for the left candidates and one for the right candidates.',
  tags: ['heap', 'greedy', 'two pointers', 'simulation'],

  code: {
    pseudocode: `function totalCost(costs, k, candidates):
  leftHeap = min heap of costs[0..candidates-1]
  rightHeap = min heap of costs[n-candidates..n-1]
  left = candidates - 1
  right = n - candidates
  total = 0
  for _ in k:
    if leftHeap.min <= rightHeap.min:
      total += leftHeap.pop
      left += 1; push costs[left] if left < right
    else:
      total += rightHeap.pop
      right -= 1; push costs[right] if right > left
  return total`,

    python: `import heapq

def totalCost(costs: list[int], k: int, candidates: int) -> int:
    n = len(costs)
    left_heap = costs[:candidates][:]
    right_heap = costs[max(candidates, n - candidates):][::-1]
    heapq.heapify(left_heap)
    heapq.heapify(right_heap)
    lo, hi = candidates, n - candidates - 1
    total = 0
    for _ in range(k):
        lv = left_heap[0] if left_heap else float("inf")
        rv = right_heap[0] if right_heap else float("inf")
        if lv <= rv:
            total += heapq.heappop(left_heap)
            if lo <= hi:
                heapq.heappush(left_heap, costs[lo])
                lo += 1
        else:
            total += heapq.heappop(right_heap)
            if hi >= lo:
                heapq.heappush(right_heap, costs[hi])
                hi -= 1
    return total`,

    javascript: `function totalCost(costs, k, candidates) {
  const n = costs.length;
  let lo = candidates, hi = n - candidates - 1;
  let lh = costs.slice(0, candidates).sort((a,b)=>a-b);
  let rh = costs.slice(Math.max(candidates, n-candidates)).sort((a,b)=>a-b);
  let total = 0;
  for (let i = 0; i < k; i++) {
    const lv = lh.length ? lh[0] : Infinity;
    const rv = rh.length ? rh[0] : Infinity;
    if (lv <= rv) {
      total += lh.shift();
      if (lo <= hi) { lh.push(costs[lo++]); lh.sort((a,b)=>a-b); }
    } else {
      total += rh.shift();
      if (hi >= lo) { rh.push(costs[hi--]); rh.sort((a,b)=>a-b); }
    }
  }
  return total;
}`,

    java: `public long totalCost(int[] costs, int k, int candidates) {
    int n = costs.length;
    PriorityQueue<Integer> lh = new PriorityQueue<>(), rh = new PriorityQueue<>();
    int lo = 0, hi = n - 1;
    for (int i = 0; i < candidates; i++) { lh.offer(costs[lo++]); }
    for (int i = 0; i < candidates && lo <= hi; i++) { rh.offer(costs[hi--]); }
    long total = 0;
    for (int i = 0; i < k; i++) {
        int lv = lh.isEmpty() ? Integer.MAX_VALUE : lh.peek();
        int rv = rh.isEmpty() ? Integer.MAX_VALUE : rh.peek();
        if (lv <= rv) {
            total += lh.poll();
            if (lo <= hi) lh.offer(costs[lo++]);
        } else {
            total += rh.poll();
            if (lo <= hi) rh.offer(costs[hi--]);
        }
    }
    return total;
}`,
  },

  defaultInput: {
    costs: [17, 12, 10, 2, 7, 2, 11, 20, 8],
    k: 3,
    candidates: 4,
  },

  inputFields: [
    {
      name: 'costs',
      label: 'Costs',
      type: 'array',
      defaultValue: [17, 12, 10, 2, 7, 2, 11, 20, 8],
      placeholder: '17,12,10,2,7,2,11,20,8',
      helperText: 'Cost of each worker',
    },
    {
      name: 'k',
      label: 'K (workers to hire)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of workers to hire',
    },
    {
      name: 'candidates',
      label: 'Candidates',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Number of candidates from each side',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const costs = input.costs as number[];
    const k = input.k as number;
    const candidates = input.candidates as number;
    const n = costs.length;
    const steps: AlgorithmStep[] = [];

    let lo = candidates;
    let hi = n - candidates - 1;
    let lh = costs.slice(0, candidates).sort((a, b) => a - b);
    const rightStart = Math.max(candidates, n - candidates);
    let rh = costs.slice(rightStart).sort((a, b) => a - b);

    steps.push({
      line: 1,
      explanation: `Init left heap with first ${candidates} workers: [${lh.join(',')}]. Right heap with last ${n - rightStart} workers: [${rh.join(',')}]. lo=${lo}, hi=${hi}`,
      variables: { k, candidates, lo, hi, leftHeap: lh.join(','), rightHeap: rh.join(',') },
      visualization: {
        type: 'array',
        array: costs,
        highlights: {
          ...Object.fromEntries(Array.from({ length: candidates }, (_, i) => [i, 'active'])),
          ...Object.fromEntries(Array.from({ length: n - rightStart }, (_, i) => [rightStart + i, 'comparing'])),
        },
        labels: { 0: 'left', [n - 1]: 'right' },
      } as ArrayVisualization,
    });

    let total = 0;

    for (let round = 0; round < k; round++) {
      const lv = lh.length ? lh[0] : Infinity;
      const rv = rh.length ? rh[0] : Infinity;

      if (lv <= rv) {
        total += lh.shift()!;
        steps.push({
          line: 7,
          explanation: `Round ${round + 1}: Left min=${lv} <= Right min=${rv === Infinity ? 'inf' : rv}. Hire from left for cost ${lv}. Total=${total}`,
          variables: { round: round + 1, hired: lv, side: 'left', total },
          visualization: {
            type: 'array',
            array: costs,
            highlights: { [costs.indexOf(lv)]: 'found' },
            labels: { 0: `total=${total}` },
          } as ArrayVisualization,
        });
        if (lo <= hi) {
          lh.push(costs[lo++]);
          lh.sort((a, b) => a - b);
        }
      } else {
        total += rh.shift()!;
        steps.push({
          line: 11,
          explanation: `Round ${round + 1}: Right min=${rv} < Left min=${lv === Infinity ? 'inf' : lv}. Hire from right for cost ${rv}. Total=${total}`,
          variables: { round: round + 1, hired: rv, side: 'right', total },
          visualization: {
            type: 'array',
            array: costs,
            highlights: {},
            labels: { 0: `total=${total}` },
          } as ArrayVisualization,
        });
        if (hi >= lo) {
          rh.push(costs[hi--]);
          rh.sort((a, b) => a - b);
        }
      }
    }

    steps.push({
      line: 14,
      explanation: `Hired ${k} workers. Total cost: ${total}`,
      variables: { result: total, k },
      visualization: {
        type: 'array',
        array: [total],
        highlights: { 0: 'found' },
        labels: { 0: `total=${total}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default totalCostToHireKWorkers;
