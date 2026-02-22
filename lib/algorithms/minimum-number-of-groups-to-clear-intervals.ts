import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfGroupsToClearIntervals: AlgorithmDefinition = {
  id: 'minimum-number-of-groups-to-clear-intervals',
  title: 'Minimum Number of Groups to Clear Intervals',
  leetcodeNumber: 2406,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Variant of LC 2406: partition intervals into minimum groups where no two intervals in a group overlap. This equals the maximum number of intervals active simultaneously at any point. Use a min-heap of end times: for each interval sorted by start, if earliest-ending active interval ends before this starts, reuse that group; else add new group. O(n log n).',
  tags: ['Intervals', 'Greedy', 'Heap', 'Sweep Line'],
  code: {
    pseudocode: `function minGroups(intervals):
  sort by start
  heap = min-heap of end times
  for [s, e] in intervals:
    if heap not empty and heap.min < s:
      heap.pop()  // reuse group
    heap.push(e)
  return heap.size`,
    python: `import heapq
def minGroups(intervals):
    intervals.sort()
    heap = []
    for s, e in intervals:
        if heap and heap[0] < s:
            heapq.heapreplace(heap, e)
        else:
            heapq.heappush(heap, e)
    return len(heap)`,
    javascript: `function minGroups(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const heap = [];
  for (const [s, e] of intervals) {
    heap.sort((a, b) => a - b);
    if (heap.length && heap[0] < s) heap.shift();
    heap.push(e);
  }
  return heap.length;
}`,
    java: `public int minGroups(int[][] intervals) {
    Arrays.sort(intervals, (a,b)->a[0]-b[0]);
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int[] iv : intervals) {
        if (!pq.isEmpty() && pq.peek() < iv[0])
            pq.poll();
        pq.offer(iv[1]);
    }
    return pq.size();
}`,
  },
  defaultInput: { intervals: [[5, 10], [6, 8], [1, 5], [2, 3], [1, 10]] },
  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals',
      type: 'array',
      defaultValue: [[5, 10], [6, 8], [1, 5], [2, 3], [1, 10]],
      placeholder: '[[5,10],[6,8],[1,5],[2,3],[1,10]]',
      helperText: 'Array of [start, end] intervals to partition',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const raw = (input.intervals as number[][]).map(iv => [iv[0], iv[1]]);
    raw.sort((a, b) => a[0] - b[0]);
    const flat = raw.flat();
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Groups (heap)', entries: auxEntries } } : {}),
    });

    steps.push({ line: 2, explanation: `Sort by start: [${raw.map(iv=>`[${iv[0]},${iv[1]}]`).join(', ')}]. Use heap to track group end times.`,
      variables: { sorted: raw.map(iv=>[...iv]) }, visualization: makeViz({}, {}) });

    const heap: number[] = [];

    for (let i = 0; i < raw.length; i++) {
      const [s, e] = raw[i];
      const ci = i * 2;
      heap.sort((a, b) => a - b);
      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };
      for (let j = 0; j < i; j++) { hl[j * 2] = 'visited'; hl[j * 2 + 1] = 'visited'; }

      if (heap.length && heap[0] < s) {
        steps.push({ line: 6,
          explanation: `[${s},${e}]: group ending at ${heap[0]} is free (${heap[0]} < ${s}). Reuse it.`,
          variables: { start: s, end: e, heapMin: heap[0], groups: heap.length },
          visualization: makeViz(hl, { [ci]: `s=${s}`, [ci+1]: `e=${e}` },
            heap.map((h, k) => ({ key: `g${k}`, value: `ends@${h}` }))) });
        heap.shift();
      } else {
        steps.push({ line: 8,
          explanation: `[${s},${e}]: no free group (min end=${heap[0] ?? 'N/A'} >= ${s}). New group.`,
          variables: { start: s, end: e, groups: heap.length + 1 },
          visualization: makeViz(hl, { [ci]: `s=${s}`, [ci+1]: `e=${e}` },
            heap.map((h, k) => ({ key: `g${k}`, value: `ends@${h}` }))) });
      }
      heap.push(e);
      heap.sort((a, b) => a - b);
      steps.push({ line: 9,
        explanation: `Push end=${e}. Active groups: ${heap.length}. Heap=[${heap.join(', ')}].`,
        variables: { heap: [...heap], groups: heap.length },
        visualization: makeViz(hl, {},
          heap.map((h, k) => ({ key: `g${k}`, value: `ends@${h}` }))) });
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';
    steps.push({ line: 10, explanation: `Done. Minimum groups: ${heap.length}.`,
      variables: { minGroups: heap.length },
      visualization: makeViz(finalHl, {}, [{ key: 'Min Groups', value: String(heap.length) }]) });

    return steps;
  },
};

export default minimumNumberOfGroupsToClearIntervals;
