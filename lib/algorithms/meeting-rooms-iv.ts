import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const meetingRoomsIV: AlgorithmDefinition = {
  id: 'meeting-rooms-iv',
  title: 'Meeting Rooms IV (Min Rooms)',
  leetcodeNumber: 253,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given an array of meeting time intervals, find the minimum number of conference rooms required. Use a min-heap of end times: sort by start, allocate a new room or reuse the earliest-ending room. The heap size at any point is the current room count. O(n log n) time.',
  tags: ['Intervals', 'Heap', 'Greedy', 'Sorting'],
  code: {
    pseudocode: `function minMeetingRooms(intervals):
  sort by start time
  minHeap = []  // tracks end times of active meetings
  for [start, end] in intervals:
    if minHeap not empty and minHeap.min <= start:
      minHeap.pop()  // reuse the room
    minHeap.push(end)
  return len(minHeap)`,
    python: `import heapq
def minMeetingRooms(intervals):
    if not intervals: return 0
    intervals.sort(key=lambda x: x[0])
    heap = []
    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)
        else:
            heapq.heappush(heap, end)
    return len(heap)`,
    javascript: `function minMeetingRooms(intervals) {
  if (!intervals.length) return 0;
  intervals.sort((a, b) => a[0] - b[0]);
  const heap = [intervals[0][1]];
  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    heap.sort((a, b) => a - b);
    if (heap[0] <= start) heap.shift();
    heap.push(end);
  }
  return heap.length;
}`,
    java: `public int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int[] iv : intervals) {
        if (!pq.isEmpty() && pq.peek() <= iv[0])
            pq.poll();
        pq.offer(iv[1]);
    }
    return pq.size();
}`,
  },
  defaultInput: { intervals: [[0, 30], [5, 10], [15, 20]] },
  inputFields: [
    {
      name: 'intervals',
      label: 'Meeting Intervals',
      type: 'array',
      defaultValue: [[0, 30], [5, 10], [15, 20]],
      placeholder: '[[0,30],[5,10],[15,20]]',
      helperText: 'Array of [start, end] meeting times',
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
      ...(auxEntries ? { auxData: { label: 'Heap (end times)', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 2,
      explanation: `Sort meetings by start: [${raw.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}].`,
      variables: { sorted: raw.map(iv => [...iv]) },
      visualization: makeViz({}, {}),
    });

    const heap: number[] = [];

    for (let i = 0; i < raw.length; i++) {
      const [start, end] = raw[i];
      heap.sort((a, b) => a - b);
      const ci = i * 2;
      const hl: Record<number, string> = {};
      hl[ci] = 'active'; hl[ci + 1] = 'active';
      for (let j = 0; j < i; j++) { hl[j * 2] = 'visited'; hl[j * 2 + 1] = 'visited'; }

      if (heap.length > 0 && heap[0] <= start) {
        steps.push({
          line: 6,
          explanation: `Meeting [${start},${end}]: earliest end ${heap[0]} <= ${start}. Reuse room. Replace end with ${end}.`,
          variables: { start, end, heapMin: heap[0], rooms: heap.length },
          visualization: makeViz(hl, { [ci]: `s=${start}`, [ci + 1]: `e=${end}` },
            heap.map((h, k) => ({ key: `r${k}`, value: String(h) }))),
        });
        heap.shift();
      } else {
        steps.push({
          line: 7,
          explanation: `Meeting [${start},${end}]: no free room (heap min=${heap[0] ?? 'N/A'} > ${start}). Allocate new room.`,
          variables: { start, end, rooms: heap.length + 1 },
          visualization: makeViz(hl, { [ci]: `s=${start}`, [ci + 1]: `e=${end}` },
            heap.map((h, k) => ({ key: `r${k}`, value: String(h) }))),
        });
      }
      heap.push(end);
      heap.sort((a, b) => a - b);
      steps.push({
        line: 8,
        explanation: `Add end time ${end} to heap. Active rooms: ${heap.length}. Heap: [${heap.join(', ')}].`,
        variables: { heap: [...heap], rooms: heap.length },
        visualization: makeViz(hl, {},
          heap.map((h, k) => ({ key: `r${k}`, value: String(h) }))),
      });
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';
    steps.push({
      line: 9,
      explanation: `Done. Minimum rooms required: ${heap.length}.`,
      variables: { minRooms: heap.length },
      visualization: makeViz(finalHl, {}, [{ key: 'Min Rooms', value: String(heap.length) }]),
    });

    return steps;
  },
};

export default meetingRoomsIV;
