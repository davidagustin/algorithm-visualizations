import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumPerformanceOfTeam: AlgorithmDefinition = {
  id: 'maximum-performance-of-team',
  title: 'Maximum Performance of a Team',
  leetcodeNumber: 1383,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Given n engineers with speed and efficiency arrays, select at most k engineers to maximize performance = sum(speeds) * min(efficiency). Sort by efficiency descending, sweep and use a min heap of size k on speeds to maintain the best team.',
  tags: ['heap', 'greedy', 'sorting', 'array'],

  code: {
    pseudocode: `function maxPerformance(n, speed, efficiency, k):
  engineers = sorted by efficiency descending
  minHeap = min heap of speeds
  speedSum = 0
  maxPerf = 0
  for eff, spd in engineers:
    push spd to minHeap
    speedSum += spd
    if heap.size > k:
      speedSum -= pop minHeap
    maxPerf = max(maxPerf, speedSum * eff)
  return maxPerf % (10^9 + 7)`,

    python: `import heapq

def maxPerformance(n, speed, efficiency, k):
    engineers = sorted(zip(efficiency, speed), reverse=True)
    heap = []
    speed_sum = 0
    max_perf = 0
    for eff, spd in engineers:
        heapq.heappush(heap, spd)
        speed_sum += spd
        if len(heap) > k:
            speed_sum -= heapq.heappop(heap)
        max_perf = max(max_perf, speed_sum * eff)
    return max_perf % (10**9 + 7)`,

    javascript: `function maxPerformance(n, speed, efficiency, k) {
  const engineers = efficiency.map((e,i) => [e, speed[i]]).sort((a,b)=>b[0]-a[0]);
  let heap = [], speedSum = 0, maxPerf = 0;
  for (const [eff, spd] of engineers) {
    heap.push(spd);
    heap.sort((a,b)=>a-b);
    speedSum += spd;
    if (heap.length > k) speedSum -= heap.shift();
    maxPerf = Math.max(maxPerf, speedSum * eff);
  }
  return maxPerf % (1e9 + 7);
}`,

    java: `public int maxPerformance(int n, int[] speed, int[] efficiency, int k) {
    int[][] eng = new int[n][2];
    for (int i = 0; i < n; i++) eng[i] = new int[]{efficiency[i], speed[i]};
    Arrays.sort(eng, (a,b)->b[0]-a[0]);
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    long speedSum = 0, maxPerf = 0;
    for (int[] e : eng) {
        heap.offer(e[1]);
        speedSum += e[1];
        if (heap.size() > k) speedSum -= heap.poll();
        maxPerf = Math.max(maxPerf, speedSum * e[0]);
    }
    return (int)(maxPerf % (1_000_000_007L));
}`,
  },

  defaultInput: {
    speed: [2, 10, 3, 1, 5, 8],
    efficiency: [5, 4, 3, 9, 7, 2],
    k: 2,
  },

  inputFields: [
    {
      name: 'speed',
      label: 'Speed',
      type: 'array',
      defaultValue: [2, 10, 3, 1, 5, 8],
      placeholder: '2,10,3,1,5,8',
      helperText: 'Speed of each engineer',
    },
    {
      name: 'efficiency',
      label: 'Efficiency',
      type: 'array',
      defaultValue: [5, 4, 3, 9, 7, 2],
      placeholder: '5,4,3,9,7,2',
      helperText: 'Efficiency of each engineer',
    },
    {
      name: 'k',
      label: 'K (at most k engineers)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Maximum number of engineers to select',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const speed = input.speed as number[];
    const efficiency = input.efficiency as number[];
    const k = input.k as number;
    const MOD = 1_000_000_007;
    const steps: AlgorithmStep[] = [];

    const engineers = efficiency.map((e, i) => [e, speed[i]] as [number, number]);
    engineers.sort((a, b) => b[0] - a[0]);

    steps.push({
      line: 1,
      explanation: `Sort engineers by efficiency descending. Top 3: ${engineers.slice(0, 3).map(([e, s]) => `eff=${e},spd=${s}`).join('; ')}. k=${k}`,
      variables: { k, n: engineers.length },
      visualization: {
        type: 'array',
        array: engineers.map(([e]) => e),
        highlights: { 0: 'active' },
        labels: Object.fromEntries(engineers.map(([e, s], i) => [i, `s=${s}`])),
      } as ArrayVisualization,
    });

    let heap: number[] = [];
    let speedSum = 0;
    let maxPerf = 0;

    for (let i = 0; i < engineers.length; i++) {
      const [eff, spd] = engineers[i];
      heap.push(spd);
      heap.sort((a, b) => a - b);
      speedSum += spd;

      if (heap.length > k) {
        const removed = heap.shift()!;
        speedSum -= removed;
        steps.push({
          line: 7,
          explanation: `Heap exceeds k=${k}. Remove slowest speed ${removed}. speedSum=${speedSum}. Current eff=${eff}.`,
          variables: { removed, speedSum, eff, k },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: {},
            labels: Object.fromEntries(heap.map((v, i) => [i, `${v}`])),
          } as ArrayVisualization,
        });
      } else {
        steps.push({
          line: 5,
          explanation: `Add engineer spd=${spd},eff=${eff}. speedSum=${speedSum}. Heap: [${heap.join(',')}]`,
          variables: { spd, eff, speedSum, heapSize: heap.length },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: Object.fromEntries([[heap.length - 1, 'current']]),
            labels: Object.fromEntries(heap.map((v, i) => [i, `${v}`])),
          } as ArrayVisualization,
        });
      }

      const perf = speedSum * eff;
      const improved = perf > maxPerf;
      if (improved) maxPerf = perf;

      steps.push({
        line: 9,
        explanation: `Performance = speedSum(${speedSum}) * eff(${eff}) = ${perf}. ${improved ? 'New max!' : `Best is ${maxPerf}`}`,
        variables: { perf, maxPerf, speedSum, eff },
        visualization: {
          type: 'array',
          array: [...heap],
          highlights: Object.fromEntries(heap.map((_, i) => [i, improved ? 'found' : 'active'])),
          labels: Object.fromEntries(heap.map((v, i) => [i, `${v}`])),
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 10,
      explanation: `Maximum performance: ${maxPerf % MOD} (mod 10^9+7)`,
      variables: { result: maxPerf % MOD, rawMax: maxPerf },
      visualization: {
        type: 'array',
        array: [maxPerf % MOD],
        highlights: { 0: 'found' },
        labels: { 0: `perf=${maxPerf % MOD}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maximumPerformanceOfTeam;
