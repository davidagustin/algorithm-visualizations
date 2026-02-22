import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumCostToHireKWorkers: AlgorithmDefinition = {
  id: 'minimum-cost-to-hire-k-workers',
  title: 'Minimum Cost to Hire K Workers',
  leetcodeNumber: 857,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Given workers with quality and wage arrays, hire exactly k workers such that the total cost is minimized. Each worker must be paid at least their minimum wage, and all workers must be paid in proportion to their quality. Sort by wage-to-quality ratio, then use a max heap to maintain k lowest-quality workers.',
  tags: ['heap', 'greedy', 'sorting', 'math'],

  code: {
    pseudocode: `function mincostToHireWorkers(quality, wage, k):
  workers = sorted by wage[i]/quality[i] ratio
  maxHeap = max heap
  qualitySum = 0
  minCost = infinity
  for ratio, q, w in workers:
    push q to maxHeap
    qualitySum += q
    if heap.size > k:
      qualitySum -= pop maxHeap (largest quality)
    if heap.size == k:
      minCost = min(minCost, ratio * qualitySum)
  return minCost`,

    python: `import heapq

def mincostToHireWorkers(quality: list[int], wage: list[int], k: int) -> float:
    workers = sorted(zip(quality, wage), key=lambda x: x[1]/x[0])
    max_heap = []
    quality_sum = 0
    min_cost = float("inf")
    for q, w in workers:
        heapq.heappush(max_heap, -q)
        quality_sum += q
        if len(max_heap) > k:
            quality_sum += heapq.heappop(max_heap)  # pop negated = subtract
        if len(max_heap) == k:
            min_cost = min(min_cost, (w / q) * quality_sum)
    return min_cost`,

    javascript: `function mincostToHireWorkers(quality, wage, k) {
  const workers = quality.map((q, i) => [wage[i]/q, q]).sort((a,b) => a[0]-b[0]);
  let heap = [], qualitySum = 0, minCost = Infinity;
  for (const [ratio, q] of workers) {
    heap.push(q);
    heap.sort((a,b) => b-a); // max heap
    qualitySum += q;
    if (heap.length > k) qualitySum -= heap.shift();
    if (heap.length === k) minCost = Math.min(minCost, ratio * qualitySum);
  }
  return minCost;
}`,

    java: `public double mincostToHireWorkers(int[] quality, int[] wage, int k) {
    int n = quality.length;
    double[][] workers = new double[n][2];
    for (int i = 0; i < n; i++)
        workers[i] = new double[]{(double)wage[i]/quality[i], quality[i]};
    Arrays.sort(workers, (a,b) -> Double.compare(a[0],b[0]));
    PriorityQueue<Double> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    double qualitySum = 0, minCost = Double.MAX_VALUE;
    for (double[] w : workers) {
        maxHeap.offer(w[1]);
        qualitySum += w[1];
        if (maxHeap.size() > k) qualitySum -= maxHeap.poll();
        if (maxHeap.size() == k) minCost = Math.min(minCost, w[0] * qualitySum);
    }
    return minCost;
}`,
  },

  defaultInput: {
    quality: [10, 20, 5],
    wage: [70, 50, 30],
    k: 2,
  },

  inputFields: [
    {
      name: 'quality',
      label: 'Quality',
      type: 'array',
      defaultValue: [10, 20, 5],
      placeholder: '10,20,5',
      helperText: 'Quality of each worker',
    },
    {
      name: 'wage',
      label: 'Minimum Wage',
      type: 'array',
      defaultValue: [70, 50, 30],
      placeholder: '70,50,30',
      helperText: 'Minimum wage expected by each worker',
    },
    {
      name: 'k',
      label: 'K (workers to hire)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of workers to hire',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const quality = input.quality as number[];
    const wage = input.wage as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const workers = quality.map((q, i) => [wage[i] / q, q, wage[i]] as [number, number, number]);
    workers.sort((a, b) => a[0] - b[0]);

    steps.push({
      line: 1,
      explanation: `Sort workers by wage/quality ratio. Ratios: [${workers.map(([r]) => r.toFixed(2)).join(', ')}]. Need to hire ${k} workers.`,
      variables: { k, sortedRatios: workers.map(([r]) => r.toFixed(2)).join(',') },
      visualization: {
        type: 'array',
        array: workers.map(([r]) => Math.round(r * 100) / 100),
        highlights: {},
        labels: Object.fromEntries(workers.map(([r, q, w], i) => [i, `q=${q},w=${w}`])),
      } as ArrayVisualization,
    });

    let heap: number[] = [];
    let qualitySum = 0;
    let minCost = Infinity;

    for (let i = 0; i < workers.length; i++) {
      const [ratio, q, w] = workers[i];
      heap.push(q);
      heap.sort((a, b) => b - a);
      qualitySum += q;

      steps.push({
        line: 7,
        explanation: `Consider worker with ratio ${ratio.toFixed(2)}, quality ${q}, wage ${w}. Add quality to heap. qualitySum=${qualitySum.toFixed(0)}`,
        variables: { ratio: ratio.toFixed(2), quality: q, qualitySum, heapSize: heap.length },
        visualization: {
          type: 'array',
          array: [...heap],
          highlights: { 0: 'current' },
          labels: { 0: `top=${heap[0]}` },
        } as ArrayVisualization,
      });

      if (heap.length > k) {
        const removed = heap.shift()!;
        qualitySum -= removed;
        steps.push({
          line: 9,
          explanation: `Heap exceeds k=${k}. Remove largest quality ${removed}. qualitySum=${qualitySum.toFixed(0)}`,
          variables: { removed, qualitySum, k },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: {},
            labels: Object.fromEntries(heap.map((v, i) => [i, `q=${v}`])),
          } as ArrayVisualization,
        });
      }

      if (heap.length === k) {
        const cost = ratio * qualitySum;
        const improved = cost < minCost;
        if (improved) minCost = cost;
        steps.push({
          line: 11,
          explanation: `Have k=${k} workers. Cost = ratio(${ratio.toFixed(2)}) * qualitySum(${qualitySum.toFixed(0)}) = ${cost.toFixed(2)}. ${improved ? 'New minimum!' : `Best is still ${minCost.toFixed(2)}`}`,
          variables: { cost: cost.toFixed(2), minCost: minCost.toFixed(2), ratio: ratio.toFixed(2), qualitySum },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: Object.fromEntries(heap.map((_, i) => [i, improved ? 'found' : 'active'])),
            labels: Object.fromEntries(heap.map((v, i) => [i, `q=${v}`])),
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Minimum cost to hire ${k} workers: ${minCost.toFixed(5)}`,
      variables: { result: minCost.toFixed(5), k },
      visualization: {
        type: 'array',
        array: [Math.round(minCost * 100) / 100],
        highlights: { 0: 'found' },
        labels: { 0: `min=${minCost.toFixed(2)}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default minimumCostToHireKWorkers;
