import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumNumberOfEatenApples: AlgorithmDefinition = {
  id: 'maximum-number-of-eaten-apples',
  title: 'Maximum Number of Eaten Apples',
  leetcodeNumber: 1705,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Each day i, an apple tree produces apples[i] apples that expire after days[i] days. Each day you can eat one apple. Use a min heap ordered by expiry date to always eat the apple expiring soonest (greedy to avoid waste).',
  tags: ['heap', 'greedy', 'simulation'],

  code: {
    pseudocode: `function eatenApples(apples, days):
  minHeap = min heap of (expiryDay, count)
  eaten = 0
  i = 0
  while i < n or heap not empty:
    if i < n and apples[i] > 0:
      push (i + days[i], apples[i]) to heap
    remove expired entries (expiryDay <= i)
    if heap not empty:
      expiryDay, count = pop heap
      eaten++
      if count > 1: push back (expiryDay, count-1)
    i++
  return eaten`,

    python: `import heapq

def eatenApples(apples: list[int], days: list[int]) -> int:
    n = len(apples)
    heap = []
    eaten = 0
    i = 0
    while i < n or heap:
        if i < n and apples[i] > 0:
            heapq.heappush(heap, (i + days[i], apples[i]))
        while heap and heap[0][0] <= i:
            heapq.heappop(heap)
        if heap:
            exp, cnt = heapq.heappop(heap)
            eaten += 1
            if cnt > 1:
                heapq.heappush(heap, (exp, cnt - 1))
        i += 1
    return eaten`,

    javascript: `function eatenApples(apples, days) {
  const n = apples.length;
  let heap = [], eaten = 0, i = 0;
  while (i < n || heap.length) {
    if (i < n && apples[i] > 0)
      heap.push([i + days[i], apples[i]]);
    heap.sort((a,b)=>a[0]-b[0]);
    while (heap.length && heap[0][0] <= i) heap.shift();
    if (heap.length) {
      const [exp, cnt] = heap.shift();
      eaten++;
      if (cnt > 1) { heap.push([exp, cnt-1]); heap.sort((a,b)=>a[0]-b[0]); }
    }
    i++;
  }
  return eaten;
}`,

    java: `public int eatenApples(int[] apples, int[] days) {
    int n = apples.length;
    PriorityQueue<int[]> heap = new PriorityQueue<>((a,b)->a[0]-b[0]);
    int eaten = 0, i = 0;
    while (i < n || !heap.isEmpty()) {
        if (i < n && apples[i] > 0)
            heap.offer(new int[]{i + days[i], apples[i]});
        while (!heap.isEmpty() && heap.peek()[0] <= i) heap.poll();
        if (!heap.isEmpty()) {
            int[] top = heap.poll();
            eaten++;
            if (top[1] > 1) heap.offer(new int[]{top[0], top[1]-1});
        }
        i++;
    }
    return eaten;
}`,
  },

  defaultInput: {
    apples: [1, 2, 3, 5, 2],
    days: [3, 2, 1, 4, 2],
  },

  inputFields: [
    {
      name: 'apples',
      label: 'Apples per day',
      type: 'array',
      defaultValue: [1, 2, 3, 5, 2],
      placeholder: '1,2,3,5,2',
      helperText: 'Number of apples produced each day',
    },
    {
      name: 'days',
      label: 'Days until expiry',
      type: 'array',
      defaultValue: [3, 2, 1, 4, 2],
      placeholder: '3,2,1,4,2',
      helperText: 'Days before apples expire',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const apples = input.apples as number[];
    const days = input.days as number[];
    const n = apples.length;
    const steps: AlgorithmStep[] = [];

    let heap: [number, number][] = []; // [expiryDay, count]
    let eaten = 0;
    let day = 0;

    steps.push({
      line: 1,
      explanation: `Start with ${n} days of apple production. Use min heap by expiry date to eat soonest-expiring apples.`,
      variables: { n, apples: apples.join(','), days: days.join(',') },
      visualization: {
        type: 'array',
        array: apples,
        highlights: {},
        labels: Object.fromEntries(apples.map((a, i) => [i, `exp=${i + days[i]}`])),
      } as ArrayVisualization,
    });

    while (day < n || heap.length > 0) {
      // Add new apples
      if (day < n && apples[day] > 0) {
        heap.push([day + days[day], apples[day]]);
        heap.sort((a, b) => a[0] - b[0]);
      }

      // Remove expired
      const beforeLen = heap.length;
      heap = heap.filter(([exp]) => exp > day);
      const expired = beforeLen - heap.length;

      if (expired > 0) {
        steps.push({
          line: 6,
          explanation: `Day ${day}: Removed ${expired} expired batch(es). Heap size: ${heap.length}.`,
          variables: { day, expired, heapSize: heap.length },
          visualization: {
            type: 'array',
            array: heap.map(([exp]) => exp),
            highlights: {},
            labels: Object.fromEntries(heap.map(([exp, cnt], i) => [i, `exp${exp}:${cnt}`])),
          } as ArrayVisualization,
        });
      }

      if (heap.length > 0) {
        const [exp, cnt] = heap.shift()!;
        eaten++;
        if (cnt > 1) {
          heap.push([exp, cnt - 1]);
          heap.sort((a, b) => a[0] - b[0]);
        }

        steps.push({
          line: 9,
          explanation: `Day ${day}: Eat apple from batch expiring day ${exp} (${cnt} left). Eaten total: ${eaten}.`,
          variables: { day, expiry: exp, remaining: cnt - 1, eaten },
          visualization: {
            type: 'array',
            array: heap.length > 0 ? heap.map(([exp]) => exp) : [0],
            highlights: { 0: 'found' },
            labels: heap.length > 0
              ? Object.fromEntries(heap.map(([exp, cnt], i) => [i, `exp${exp}:${cnt}`]))
              : { 0: 'empty' },
          } as ArrayVisualization,
        });
      } else if (day < n) {
        steps.push({
          line: 8,
          explanation: `Day ${day}: No available apples to eat. Skip.`,
          variables: { day, eaten },
          visualization: {
            type: 'array',
            array: apples,
            highlights: { [day]: 'mismatch' },
            labels: { [day]: `skip` },
          } as ArrayVisualization,
        });
      }

      day++;
      if (day > n + 20) break; // safety
    }

    steps.push({
      line: 12,
      explanation: `Maximum apples eaten: ${eaten}`,
      variables: { result: eaten },
      visualization: {
        type: 'array',
        array: [eaten],
        highlights: { 0: 'found' },
        labels: { 0: `eaten=${eaten}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maximumNumberOfEatenApples;
