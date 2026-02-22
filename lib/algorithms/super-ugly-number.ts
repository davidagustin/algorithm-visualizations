import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const superUglyNumber: AlgorithmDefinition = {
  id: 'super-ugly-number',
  title: 'Super Ugly Number',
  leetcodeNumber: 313,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'A super ugly number has prime factors only from a given list of primes. Find the n-th super ugly number. Use a min-heap starting with 1. For each step, pop the minimum, then for each prime in the list multiply the popped value by that prime and push to the heap if not seen. Repeat n times.',
  tags: ['heap', 'dynamic programming', 'math', 'prime factorization'],

  code: {
    pseudocode: `function nthSuperUglyNumber(n, primes):
  minHeap = [1]
  seen = {1}
  result = 0

  for i in range(n):
    result = minHeap.pop()
    for prime in primes:
      candidate = result * prime
      if candidate not in seen:
        seen.add(candidate)
        minHeap.push(candidate)

  return result`,

    python: `import heapq

def nthSuperUglyNumber(n: int, primes: list[int]) -> int:
    heap = [1]
    seen = {1}
    val = 0
    for _ in range(n):
        val = heapq.heappop(heap)
        for p in primes:
            nxt = val * p
            if nxt not in seen:
                seen.add(nxt)
                heapq.heappush(heap, nxt)
    return val`,

    javascript: `function nthSuperUglyNumber(n, primes) {
  const heap = [1];
  const seen = new Set([1]);
  let val = 0;
  for (let i = 0; i < n; i++) {
    heap.sort((a, b) => a - b);
    val = heap.shift();
    for (const p of primes) {
      const nxt = val * p;
      if (!seen.has(nxt)) {
        seen.add(nxt);
        heap.push(nxt);
      }
    }
  }
  return val;
}`,

    java: `public int nthSuperUglyNumber(int n, int[] primes) {
    PriorityQueue<Long> pq = new PriorityQueue<>();
    Set<Long> seen = new HashSet<>();
    pq.offer(1L);
    seen.add(1L);
    long val = 1;
    for (int i = 0; i < n; i++) {
        val = pq.poll();
        for (int p : primes) {
            long nxt = val * p;
            if (seen.add(nxt)) pq.offer(nxt);
        }
    }
    return (int) val;
}`,
  },

  defaultInput: {
    nums: [2, 7, 13, 19],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Primes List',
      type: 'array',
      defaultValue: [2, 7, 13, 19],
      placeholder: '2,7,13,19',
      helperText: 'List of primes. Will find the 12th super ugly number for this prime set.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const primes = input.nums as number[];
    const n = 12;
    const steps: AlgorithmStep[] = [];
    let heap: number[] = [1];
    const seen: Set<number> = new Set([1]);
    const superUglies: number[] = [];

    steps.push({
      line: 1,
      explanation: `Find the ${n}-th super ugly number with primes [${primes.join(', ')}]. Init min-heap with [1].`,
      variables: { n, primes: primes.join(', '), heap: '[1]' },
      visualization: {
        type: 'array',
        array: [...primes],
        highlights: primes.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'active'; return acc; }, {}),
        labels: primes.reduce((acc: Record<number, string>, p, i) => { acc[i] = `p${i + 1}:${p}`; return acc; }, {}),
      },
    });

    for (let i = 0; i < n; i++) {
      heap.sort((a, b) => a - b);
      const val = heap.shift()!;
      superUglies.push(val);

      steps.push({
        line: 5,
        explanation: `Step ${i + 1}: Pop min -> ${val} (super ugly #${i + 1}). Heap size: ${heap.length}.`,
        variables: { step: i + 1, value: val, heapMin: heap[0] ?? 'empty', uglyCount: superUglies.length },
        visualization: {
          type: 'array',
          array: [...superUglies],
          highlights: { [superUglies.length - 1]: 'found' },
          labels: { [superUglies.length - 1]: `#${i + 1}` },
        },
      });

      const newCandidates: number[] = [];
      for (const p of primes) {
        const next = val * p;
        if (next <= 2147483647 && !seen.has(next)) {
          seen.add(next);
          heap.push(next);
          newCandidates.push(next);
        }
      }

      if (newCandidates.length > 0 && i < n - 1) {
        heap.sort((a, b) => a - b);
        steps.push({
          line: 8,
          explanation: `Multiply ${val} by primes [${primes.join(', ')}] -> new candidates: [${newCandidates.join(', ')}]. Heap min: ${heap[0]}.`,
          variables: { from: val, newCandidates: newCandidates.join(', '), heapMin: heap[0] },
          visualization: {
            type: 'array',
            array: heap.slice(0, 8),
            highlights: newCandidates.slice(0, 8).reduce((acc: Record<number, string>, v) => {
              const idx = heap.indexOf(v);
              if (idx >= 0 && idx < 8) acc[idx] = 'active';
              return acc;
            }, { 0: 'pointer' }),
            labels: { 0: `min:${heap[0]}` },
          },
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `The ${n}-th super ugly number is ${superUglies[n - 1]}. Sequence: [${superUglies.join(', ')}].`,
      variables: { n, answer: superUglies[n - 1], sequence: superUglies.join(', ') },
      visualization: {
        type: 'array',
        array: superUglies,
        highlights: { [n - 1]: 'found' },
        labels: { 0: 'start:1', [n - 1]: `${n}-th:${superUglies[n - 1]}` },
      },
    });

    return steps;
  },
};

export default superUglyNumber;
