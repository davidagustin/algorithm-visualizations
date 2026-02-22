import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumIntervalToIncludeQuery: AlgorithmDefinition = {
  id: 'minimum-interval-to-include-query',
  title: 'Minimum Interval to Include Each Query',
  leetcodeNumber: 1851,
  difficulty: 'Hard',
  category: 'Interval',
  description:
    'For each query point, find the size (end-start+1) of the smallest interval containing it. Sort queries and intervals by start; use a min-heap of (size, end) for active intervals. Process queries in order, adding intervals whose start <= query, then remove stale intervals, answer is heap top. O(n log n + q log q).',
  tags: ['Intervals', 'Sorting', 'Heap', 'Sweep Line'],
  code: {
    pseudocode: `function minInterval(intervals, queries):
  sort intervals by start
  sort queries with original indices
  heap = min-heap by size
  j = 0
  ans = array of -1s
  for [q, idx] in sorted queries:
    while j < n and intervals[j].start <= q:
      push (size, end) to heap; j++
    while heap and heap.top.end < q:
      pop heap
    ans[idx] = heap empty ? -1 : heap.top.size
  return ans`,
    python: `import heapq
def minInterval(intervals, queries):
    intervals.sort()
    ans = {}
    heap = []  # (size, end)
    j = 0
    for q in sorted(queries):
        while j < len(intervals) and intervals[j][0] <= q:
            s, e = intervals[j]
            heapq.heappush(heap, (e-s+1, e))
            j += 1
        while heap and heap[0][1] < q:
            heapq.heappop(heap)
        ans[q] = heap[0][0] if heap else -1
    return [ans[q] for q in queries]`,
    javascript: `function minInterval(intervals, queries) {
  intervals.sort((a, b) => a[0] - b[0]);
  const indexed = queries.map((q, i) => [q, i]).sort((a, b) => a[0] - b[0]);
  const ans = new Array(queries.length).fill(-1);
  const heap = []; // min-heap by size
  let j = 0;
  for (const [q, idx] of indexed) {
    while (j < intervals.length && intervals[j][0] <= q) {
      const [s, e] = intervals[j++];
      heap.push([e - s + 1, e]);
      heap.sort((a, b) => a[0] - b[0]);
    }
    while (heap.length && heap[0][1] < q) heap.shift();
    ans[idx] = heap.length ? heap[0][0] : -1;
  }
  return ans;
}`,
    java: `public int[] minInterval(int[][] intervals, int[] queries) {
    Arrays.sort(intervals, (a,b)->a[0]-b[0]);
    int n=queries.length;
    Integer[] idx=new Integer[n];
    for(int i=0;i<n;i++) idx[i]=i;
    Arrays.sort(idx,(a,b)->queries[a]-queries[b]);
    PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[0]-b[0]);
    int j=0; int[] ans=new int[n];
    for(int i:idx){
        int q=queries[i];
        while(j<intervals.length&&intervals[j][0]<=q)
            pq.offer(new int[]{intervals[j][1]-intervals[j][0]+1,intervals[j++][1]});
        while(!pq.isEmpty()&&pq.peek()[1]<q) pq.poll();
        ans[i]=pq.isEmpty()?-1:pq.peek()[0];
    }
    return ans;
}`,
  },
  defaultInput: {
    intervals: [[1, 4], [2, 4], [3, 6], [4, 4]],
    queries: [2, 3, 4, 5],
  },
  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals',
      type: 'array',
      defaultValue: [[1, 4], [2, 4], [3, 6], [4, 4]],
      placeholder: '[[1,4],[2,4],[3,6],[4,4]]',
      helperText: 'Array of [start, end] intervals',
    },
    {
      name: 'queries',
      label: 'Query Points',
      type: 'array',
      defaultValue: [2, 3, 4, 5],
      placeholder: '[2,3,4,5]',
      helperText: 'Query points to answer',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const intervals = (input.intervals as number[][]).map(iv => [iv[0], iv[1]]);
    const queries = input.queries as number[];
    const flat = intervals.flat();
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
      ...(auxEntries ? { auxData: { label: 'Answers', entries: auxEntries } } : {}),
    });

    intervals.sort((a, b) => a[0] - b[0]);
    const indexed = queries.map((q, i) => [q, i] as [number, number]).sort((a, b) => a[0] - b[0]);
    const ans = new Array(queries.length).fill(-1);
    const heap: [number, number][] = [];
    let j = 0;

    steps.push({ line: 2, explanation: `Sort intervals by start. Queries: [${queries.join(', ')}] (sorted for processing).`,
      variables: { intervals: intervals.map(iv => [...iv]), queries },
      visualization: makeViz({}, {}) });

    for (const [q, qi] of indexed) {
      while (j < intervals.length && intervals[j][0] <= q) {
        const [s, e] = intervals[j];
        heap.push([e - s + 1, e]);
        heap.sort((a, b) => a[0] - b[0]);
        j++;
      }
      while (heap.length && heap[0][1] < q) heap.shift();
      ans[qi] = heap.length ? heap[0][0] : -1;

      const hl: Record<number, string> = {};
      for (let k = 0; k < intervals.length; k++) {
        if (intervals[k][0] <= q && intervals[k][1] >= q) { hl[k * 2] = 'active'; hl[k * 2 + 1] = 'active'; }
        else { hl[k * 2] = 'visited'; hl[k * 2 + 1] = 'visited'; }
      }

      steps.push({ line: 11,
        explanation: `Query q=${q}: min interval size = ${ans[qi]}. Active intervals: ${heap.length}. Heap top: ${heap[0] ? `size=${heap[0][0]},end=${heap[0][1]}` : 'empty'}.`,
        variables: { query: q, answer: ans[qi], heapSize: heap.length },
        visualization: makeViz(hl, {}, [...ans.map((a, k) => ({ key: `q[${k}]=${queries[k]}`, value: a === -1 ? '-1' : String(a) }))]) });
    }

    const finalHl: Record<number, string> = {};
    for (let j2 = 0; j2 < flat.length; j2++) finalHl[j2] = 'found';
    steps.push({ line: 12, explanation: `Done. Answers: [${ans.join(', ')}].`,
      variables: { answers: ans },
      visualization: makeViz(finalHl, {}, ans.map((a, k) => ({ key: `q=${queries[k]}`, value: String(a) }))) });

    return steps;
  },
};

export default minimumIntervalToIncludeQuery;
