import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumIntervalToIncludeEachQuery: AlgorithmDefinition = {
  id: 'minimum-interval-to-include-each-query',
  title: 'Minimum Interval to Include Each Query',
  leetcodeNumber: 1851,
  difficulty: 'Hard',
  category: 'Interval',
  description:
    'Given intervals and queries, for each query find the smallest interval that contains the query point. Sort both intervals and queries, then use a min-heap keyed by interval size. Sweep through sorted queries, adding all intervals whose start is within range, then extract the minimum-size interval still containing the query.',
  tags: ['interval', 'sorting', 'heap', 'sweep line'],

  code: {
    pseudocode: `function minInterval(intervals, queries):
  sort intervals by start
  sort queries with original indices
  minHeap = [] (by interval size)
  i = 0, results = []
  for each (q, idx) in sorted queries:
    add all intervals[i] where start <= q to heap
    remove from heap where end < q
    results[idx] = heap.top().size or -1
  return results`,

    python: `import heapq
def minInterval(intervals, queries):
    intervals.sort()
    indexed_q = sorted(enumerate(queries), key=lambda x: x[1])
    heap = []
    i = 0
    result = [-1] * len(queries)
    for idx, q in indexed_q:
        while i < len(intervals) and intervals[i][0] <= q:
            size = intervals[i][1] - intervals[i][0] + 1
            heapq.heappush(heap, (size, intervals[i][1]))
            i += 1
        while heap and heap[0][1] < q:
            heapq.heappop(heap)
        if heap:
            result[idx] = heap[0][0]
    return result`,

    javascript: `function minInterval(intervals, queries) {
  intervals.sort((a, b) => a[0] - b[0]);
  const indexed = queries.map((q, i) => [q, i]).sort((a, b) => a[0] - b[0]);
  const heap = new MinHeap(); // by size
  let i = 0;
  const result = new Array(queries.length).fill(-1);
  for (const [q, idx] of indexed) {
    while (i < intervals.length && intervals[i][0] <= q) {
      heap.push([intervals[i][1]-intervals[i][0]+1, intervals[i][1]]);
      i++;
    }
    while (!heap.empty() && heap.top()[1] < q) heap.pop();
    if (!heap.empty()) result[idx] = heap.top()[0];
  }
  return result;
}`,

    java: `public int[] minInterval(int[][] intervals, int[] queries) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    int n = queries.length;
    Integer[] idx = IntStream.range(0, n).boxed().toArray(Integer[]::new);
    Arrays.sort(idx, (a, b) -> queries[a] - queries[b]);
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    int i = 0;
    int[] res = new int[n];
    for (int j : idx) {
        while (i < intervals.length && intervals[i][0] <= queries[j])
            pq.offer(new int[]{intervals[i][1]-intervals[i][0]+1, intervals[i++][1]});
        while (!pq.isEmpty() && pq.peek()[1] < queries[j]) pq.poll();
        res[j] = pq.isEmpty() ? -1 : pq.peek()[0];
    }
    return res;
}`,
  },

  defaultInput: {
    intervals: [[1, 4], [2, 4], [3, 6], [4, 4]],
    queries: [2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals (JSON)',
      type: 'string',
      defaultValue: '[[1,4],[2,4],[3,6],[4,4]]',
      placeholder: '[[1,4],[2,4],[3,6]]',
      helperText: 'JSON array of [left, right] intervals',
    },
    {
      name: 'queries',
      label: 'Queries',
      type: 'array',
      defaultValue: [2, 3, 4, 5],
      placeholder: '2,3,4,5',
      helperText: 'Comma-separated query points',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const intervals = (typeof input.intervals === 'string'
      ? JSON.parse(input.intervals)
      : input.intervals) as number[][];
    const queries = input.queries as number[];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Sort intervals by start. Intervals: ${JSON.stringify(intervals)}. Queries: [${queries.join(', ')}].`,
      variables: { intervals: JSON.stringify(intervals), queries: `[${queries.join(', ')}]` },
      visualization: {
        type: 'array',
        array: queries,
        highlights: {},
        labels: Object.fromEntries(queries.map((q, i) => [i, `q=${q}`])),
      },
    });

    const sortedIntervals = [...intervals].sort((a, b) => a[0] - b[0]);
    const indexedQ = queries.map((q, i) => [q, i] as [number, number]).sort((a, b) => a[0] - b[0]);

    steps.push({
      line: 2,
      explanation: `Sorted intervals: ${JSON.stringify(sortedIntervals)}. Sorted queries (with original idx): ${JSON.stringify(indexedQ)}.`,
      variables: { sortedIntervals: JSON.stringify(sortedIntervals) },
      visualization: {
        type: 'array',
        array: sortedIntervals.map(iv => iv[0]),
        highlights: {},
        labels: Object.fromEntries(sortedIntervals.map((iv, i) => [i, `[${iv[0]},${iv[1]}]`])),
      },
    });

    // Simple simulation with min-heap (array-based for visualization)
    const heap: [number, number][] = []; // [size, end]
    let iPtr = 0;
    const result: number[] = new Array(queries.length).fill(-1);

    for (const [q, origIdx] of indexedQ) {
      steps.push({
        line: 5,
        explanation: `Processing query q=${q} (original index ${origIdx}). Add intervals starting <= ${q}.`,
        variables: { q, origIdx, heapSize: heap.length },
        visualization: {
          type: 'array',
          array: queries,
          highlights: { [origIdx]: 'active' },
          labels: Object.fromEntries(queries.map((v, i) => [i, i === origIdx ? `q=${v}` : `${v}`])),
        },
      });

      while (iPtr < sortedIntervals.length && sortedIntervals[iPtr][0] <= q) {
        const iv = sortedIntervals[iPtr];
        const size = iv[1] - iv[0] + 1;
        heap.push([size, iv[1]]);
        heap.sort((a, b) => a[0] - b[0]);
        steps.push({
          line: 6,
          explanation: `Add interval [${iv[0]},${iv[1]}] (size=${size}) to heap.`,
          variables: { interval: `[${iv[0]},${iv[1]}]`, size, heapTop: heap[0] ? `size=${heap[0][0]},end=${heap[0][1]}` : 'empty' },
          visualization: {
            type: 'array',
            array: heap.map(h => h[0]),
            highlights: { 0: 'found' },
            labels: Object.fromEntries(heap.map((h, i) => [i, `sz=${h[0]},e=${h[1]}`])),
          },
        });
        iPtr++;
      }

      // Remove expired intervals
      while (heap.length > 0 && heap[0][1] < q) {
        const removed = heap.shift()!;
        steps.push({
          line: 7,
          explanation: `Remove expired interval (end=${removed[1]} < q=${q}) from heap.`,
          variables: { removed: JSON.stringify(removed), q },
          visualization: {
            type: 'array',
            array: heap.map(h => h[0]),
            highlights: {},
            labels: Object.fromEntries(heap.map((h, i) => [i, `sz=${h[0]},e=${h[1]}`])),
          },
        });
      }

      if (heap.length > 0) {
        result[origIdx] = heap[0][0];
        steps.push({
          line: 8,
          explanation: `Query q=${q}: smallest interval size = ${heap[0][0]} (end=${heap[0][1]}).`,
          variables: { q, answer: heap[0][0] },
          visualization: {
            type: 'array',
            array: queries,
            highlights: { [origIdx]: 'found' },
            labels: Object.fromEntries(queries.map((v, i) => [i, i === origIdx ? `ans=${result[origIdx]}` : `${v}`])),
          },
        });
      } else {
        steps.push({
          line: 8,
          explanation: `Query q=${q}: no interval contains this point. Answer = -1.`,
          variables: { q, answer: -1 },
          visualization: {
            type: 'array',
            array: queries,
            highlights: { [origIdx]: 'mismatch' },
            labels: Object.fromEntries(queries.map((v, i) => [i, i === origIdx ? 'ans=-1' : `${v}`])),
          },
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Final results: [${result.join(', ')}].`,
      variables: { result: `[${result.join(', ')}]` },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(result.map((v, i) => [i, `q${i}:${v}`])),
      },
    });

    return steps;
  },
};

export default minimumIntervalToIncludeEachQuery;
