import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const uglyNumberIi: AlgorithmDefinition = {
  id: 'ugly-number-ii',
  title: 'Ugly Number II',
  leetcodeNumber: 264,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'An ugly number has only the prime factors 2, 3, and 5. Find the n-th ugly number. Use a min-heap starting with 1. At each step, pop the minimum, generate candidates by multiplying by 2, 3, and 5, and push unique candidates to the heap. Repeat n times to find the n-th ugly number.',
  tags: ['heap', 'dynamic programming', 'math', 'ugly numbers'],

  code: {
    pseudocode: `function nthUglyNumber(n):
  minHeap = [1]
  seen = {1}
  result = 0

  for i in range(n):
    result = minHeap.pop()
    for factor in [2, 3, 5]:
      next = result * factor
      if next not in seen:
        seen.add(next)
        minHeap.push(next)

  return result`,

    python: `import heapq

def nthUglyNumber(n: int) -> int:
    heap = [1]
    seen = {1}
    val = 0
    for _ in range(n):
        val = heapq.heappop(heap)
        for f in (2, 3, 5):
            nxt = val * f
            if nxt not in seen:
                seen.add(nxt)
                heapq.heappush(heap, nxt)
    return val`,

    javascript: `function nthUglyNumber(n) {
  const heap = [1];
  const seen = new Set([1]);
  let val = 0;
  for (let i = 0; i < n; i++) {
    heap.sort((a, b) => a - b); // min at front
    val = heap.shift();
    for (const f of [2, 3, 5]) {
      const nxt = val * f;
      if (!seen.has(nxt)) {
        seen.add(nxt);
        heap.push(nxt);
      }
    }
  }
  return val;
}`,

    java: `public int nthUglyNumber(int n) {
    PriorityQueue<Long> pq = new PriorityQueue<>();
    Set<Long> seen = new HashSet<>();
    pq.offer(1L);
    seen.add(1L);
    long val = 1;
    for (int i = 0; i < n; i++) {
        val = pq.poll();
        for (long f : new long[]{2, 3, 5}) {
            long nxt = val * f;
            if (seen.add(nxt)) pq.offer(nxt);
        }
    }
    return (int) val;
}`,
  },

  defaultInput: {
    nums: [10],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'N (find n-th ugly number)',
      type: 'array',
      defaultValue: [10],
      placeholder: '10',
      helperText: 'Find the n-th ugly number (single number, max 15 recommended)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = Math.max(1, Math.min(nums[0] ?? 10, 15));
    const steps: AlgorithmStep[] = [];
    let heap: number[] = [1];
    const seen: Set<number> = new Set([1]);
    const uglyNumbers: number[] = [];

    steps.push({
      line: 1,
      explanation: `Find the ${n}-th ugly number. Initialize min-heap with [1]. Seen = {1}. Ugly numbers are products of only 2, 3, and 5.`,
      variables: { n, heap: '[1]', seen: '{1}' },
      visualization: {
        type: 'array',
        array: [1],
        highlights: { 0: 'active' },
        labels: { 0: 'start:1' },
      },
    });

    for (let i = 0; i < n; i++) {
      heap.sort((a, b) => a - b);
      const val = heap.shift()!;
      uglyNumbers.push(val);

      steps.push({
        line: 5,
        explanation: `Step ${i + 1}/${n}: Pop min from heap -> ${val}. This is ugly number #${i + 1}. Heap size: ${heap.length}.`,
        variables: { step: i + 1, uglyNumber: val, heapMin: heap[0] ?? 'empty' },
        visualization: {
          type: 'array',
          array: [...uglyNumbers],
          highlights: { [uglyNumbers.length - 1]: 'found' },
          labels: { [uglyNumbers.length - 1]: `#${i + 1}:${val}` },
        },
      });

      const newEntries: number[] = [];
      for (const f of [2, 3, 5]) {
        const next = val * f;
        if (!seen.has(next)) {
          seen.add(next);
          heap.push(next);
          newEntries.push(next);
        }
      }

      if (newEntries.length > 0) {
        heap.sort((a, b) => a - b);
        steps.push({
          line: 8,
          explanation: `Multiply ${val} by 2, 3, 5 -> candidates ${newEntries.join(', ')} (unseen). Push to heap. Heap now: [${heap.slice(0, 6).join(', ')}${heap.length > 6 ? '...' : ''}].`,
          variables: { from: val, newCandidates: newEntries.join(', '), heapSize: heap.length },
          visualization: {
            type: 'array',
            array: heap.slice(0, 8),
            highlights: newEntries.reduce((acc: Record<number, string>, v) => {
              const idx = heap.indexOf(v);
              if (idx >= 0 && idx < 8) acc[idx] = 'active';
              return acc;
            }, {}),
            labels: { 0: `min:${heap[0]}` },
          },
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `The ${n}-th ugly number is ${uglyNumbers[n - 1]}. Ugly sequence: [${uglyNumbers.join(', ')}].`,
      variables: { n, answer: uglyNumbers[n - 1], sequence: uglyNumbers.join(', ') },
      visualization: {
        type: 'array',
        array: uglyNumbers,
        highlights: { [n - 1]: 'found' },
        labels: { [n - 1]: `${n}-th:${uglyNumbers[n - 1]}` },
      },
    });

    return steps;
  },
};

export default uglyNumberIi;
