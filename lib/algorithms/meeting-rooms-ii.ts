import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const meetingRoomsII: AlgorithmDefinition = {
  id: 'meeting-rooms-ii',
  title: 'Meeting Rooms II',
  leetcodeNumber: 253,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Find the minimum number of conference rooms required for all meetings. Sort intervals by start time. Use a min-heap of end times. For each meeting, if it starts after the earliest-ending room is free, reuse that room; otherwise allocate a new room.',
  tags: ['Intervals', 'Heap', 'Greedy', 'Sorting'],
  code: {
    pseudocode: `function minMeetingRooms(intervals):
  sort intervals by start time
  heap = min-heap of end times
  heap.push(intervals[0].end)
  for i from 1 to n-1:
    if intervals[i].start >= heap.top:
      heap.pop()   // reuse room
    heap.push(intervals[i].end)
  return heap.size`,
    python: `import heapq
def minMeetingRooms(intervals):
    intervals.sort(key=lambda x: x[0])
    heap = []
    heapq.heappush(heap, intervals[0][1])
    for i in range(1, len(intervals)):
        if intervals[i][0] >= heap[0]:
            heapq.heappop(heap)
        heapq.heappush(heap, intervals[i][1])
    return len(heap)`,
    javascript: `function minMeetingRooms(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const heap = new MinHeap();
  heap.push(intervals[0][1]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] >= heap.top()) heap.pop();
    heap.push(intervals[i][1]);
  }
  return heap.size();
}`,
    java: `public int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    heap.add(intervals[0][1]);
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= heap.peek()) heap.poll();
        heap.add(intervals[i][1]);
    }
    return heap.size();
}`,
  },
  defaultInput: {
    intervals: [[0, 30], [5, 10], [15, 20]],
  },
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
    const rawIntervals = input.intervals as number[][];
    const steps: AlgorithmStep[] = [];

    const intervals = rawIntervals.map(iv => [iv[0], iv[1]]).sort((a, b) => a[0] - b[0]);
    const flat = intervals.flat();

    // Simple min-heap simulation using sorted array
    let heap: number[] = [];
    const heapPush = (val: number) => { heap.push(val); heap.sort((a, b) => a - b); };
    const heapPop = () => heap.shift();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      auxData: { label: 'Rooms State', entries: auxEntries },
    });

    steps.push({
      line: 2,
      explanation: `Sort by start time: [${intervals.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}]. Min-heap tracks end times of rooms in use.`,
      variables: { intervals },
      visualization: makeViz({}, {}, [{ key: 'rooms (heap)', value: '[]' }, { key: 'rooms needed', value: '0' }]),
    });

    heapPush(intervals[0][1]);
    steps.push({
      line: 4,
      explanation: `Allocate Room 1 for first meeting [${intervals[0][0]}, ${intervals[0][1]}]. Push end=${intervals[0][1]} to heap.`,
      variables: { heap: [...heap] },
      visualization: makeViz({ 0: 'found', 1: 'found' }, { 0: 's', 1: 'e' }, [
        { key: 'rooms (end times)', value: `[${heap.join(', ')}]` },
        { key: 'rooms needed', value: String(heap.length) },
      ]),
    });

    for (let i = 1; i < intervals.length; i++) {
      const ci = i * 2;
      const curr = intervals[i];
      const earliestEnd = heap[0];
      const canReuse = curr[0] >= earliestEnd;

      if (canReuse) {
        heapPop();
        heapPush(curr[1]);
        const hl: Record<number, string> = { [ci]: 'found', [ci + 1]: 'found' };
        for (let j = 0; j < i; j++) { hl[j * 2] = 'visited'; hl[j * 2 + 1] = 'visited'; }
        steps.push({
          line: 6,
          explanation: `Reuse room! Meeting [${curr[0]}, ${curr[1]}] starts at ${curr[0]} >= earliest room free at ${earliestEnd}. Replace end: heap = [${heap.join(', ')}].`,
          variables: { current: curr, earliestEnd, canReuse: true, heap: [...heap] },
          visualization: makeViz(hl, { [ci]: `reuse (${curr[0]}>=${earliestEnd})` }, [
            { key: 'rooms (end times)', value: `[${heap.join(', ')}]` },
            { key: 'rooms needed', value: String(heap.length) },
          ]),
        });
      } else {
        heapPush(curr[1]);
        const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };
        for (let j = 0; j < i; j++) { hl[j * 2] = 'visited'; hl[j * 2 + 1] = 'visited'; }
        steps.push({
          line: 8,
          explanation: `New room needed! Meeting [${curr[0]}, ${curr[1]}] starts at ${curr[0]} < earliest room free at ${earliestEnd}. Allocate new room. Heap = [${heap.join(', ')}].`,
          variables: { current: curr, earliestEnd, canReuse: false, heap: [...heap] },
          visualization: makeViz(hl, { [ci]: `new room (${curr[0]}<${earliestEnd})` }, [
            { key: 'rooms (end times)', value: `[${heap.join(', ')}]` },
            { key: 'rooms needed', value: String(heap.length) },
          ]),
        });
      }
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';

    steps.push({
      line: 9,
      explanation: `Done! Minimum conference rooms needed = ${heap.length}.`,
      variables: { result: heap.length },
      visualization: makeViz(finalHl, {}, [
        { key: 'Min rooms needed', value: String(heap.length) },
        { key: 'Final end times', value: `[${heap.join(', ')}]` },
      ]),
    });

    return steps;
  },
};

export default meetingRoomsII;
