import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumNumberOfEvents: AlgorithmDefinition = {
  id: 'maximum-number-of-events',
  title: 'Maximum Number of Events That Can Be Attended',
  leetcodeNumber: 1353,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given events [startDay, endDay], attend at most one event per day to maximize the number attended. Greedy: on each day, among all events that have started and not yet ended, attend the one ending soonest (min-heap by end day). This prevents missing events with tight deadlines.',
  tags: ['greedy', 'heap', 'sorting', 'array'],

  code: {
    pseudocode: `function maxEvents(events):
  sort events by start day
  minHeap = empty (stores end days)
  day = 0, attended = 0, i = 0
  while i < n or heap not empty:
    if heap empty: day = events[i].start
    add all events starting on day to heap
    remove expired events from heap
    if heap not empty:
      attend event with smallest end day
      attended++
    day++
  return attended`,

    python: `def maxEvents(events: list[list[int]]) -> int:
    import heapq
    events.sort()
    heap = []
    day = 0
    attended = 0
    i = 0
    n = len(events)
    while i < n or heap:
        if not heap:
            day = events[i][0]
        while i < n and events[i][0] <= day:
            heapq.heappush(heap, events[i][1])
            i += 1
        heapq.heappop(heap)
        attended += 1
        day += 1
        while heap and heap[0] < day:
            heapq.heappop(heap)
    return attended`,

    javascript: `function maxEvents(events) {
  events.sort((a, b) => a[0] - b[0]);
  // Using sorted array as mock min-heap for simplicity
  let day = 0, attended = 0, i = 0;
  const heap = [];
  while (i < events.length || heap.length) {
    if (!heap.length) day = events[i][0];
    while (i < events.length && events[i][0] <= day) {
      heap.push(events[i][1]);
      heap.sort((a, b) => a - b);
      i++;
    }
    heap.shift();
    attended++;
    day++;
    while (heap.length && heap[0] < day) heap.shift();
  }
  return attended;
}`,

    java: `public int maxEvents(int[][] events) {
    Arrays.sort(events, (a, b) -> a[0] - b[0]);
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    int day = 0, attended = 0, i = 0, n = events.length;
    while (i < n || !pq.isEmpty()) {
        if (pq.isEmpty()) day = events[i][0];
        while (i < n && events[i][0] <= day) pq.offer(events[i++][1]);
        pq.poll();
        attended++;
        day++;
        while (!pq.isEmpty() && pq.peek() < day) pq.poll();
    }
    return attended;
}`,
  },

  defaultInput: {
    events: [1, 2, 1, 2, 1, 6, 1, 4, 2, 3],
  },

  inputFields: [
    {
      name: 'events',
      label: 'Events (interleaved start,end pairs)',
      type: 'array',
      defaultValue: [1, 2, 1, 2, 1, 6, 1, 4, 2, 3],
      placeholder: '1,2,1,2,1,6',
      helperText: 'Pairs: startDay,endDay for each event',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.events as number[];
    const steps: AlgorithmStep[] = [];

    const events: [number, number][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) {
      events.push([flat[i], flat[i + 1]]);
    }

    const sorted = [...events].sort((a, b) => a[0] - b[0]);

    steps.push({
      line: 1,
      explanation: `${events.length} events. Sorted by start day: ${sorted.map(e => '[' + e[0] + ',' + e[1] + ']').join(', ')}`,
      variables: { totalEvents: events.length },
      visualization: {
        type: 'array',
        array: sorted.map(e => e[0]),
        highlights: Object.fromEntries(sorted.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(sorted.map((e, i) => [i, 'end:' + e[1]])),
      },
    });

    let day = 0;
    let attended = 0;
    let i = 0;
    const n = sorted.length;
    const heap: number[] = [];
    const attendedDays: number[] = [];

    while (i < n || heap.length > 0) {
      if (heap.length === 0) {
        day = sorted[i][0];
        steps.push({
          line: 4,
          explanation: `Heap empty. Jump to next event start day=${day}.`,
          variables: { day, attended, heapSize: heap.length },
          visualization: {
            type: 'array',
            array: sorted.map(e => e[0]),
            highlights: { [i]: 'active' },
            labels: { [i]: 'day=' + day },
          },
        });
      }

      while (i < n && sorted[i][0] <= day) {
        heap.push(sorted[i][1]);
        heap.sort((a, b) => a - b);
        steps.push({
          line: 5,
          explanation: `Add event [${sorted[i][0]},${sorted[i][1]}] to heap (starts on or before day ${day}). Heap: [${heap.join(', ')}]`,
          variables: { day, 'event[i]': '[' + sorted[i][0] + ',' + sorted[i][1] + ']', heapTop: heap[0] },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: { 0: 'found' },
            labels: { 0: 'attend next' },
          },
        });
        i++;
      }

      while (heap.length > 0 && heap[0] < day) heap.shift();

      if (heap.length > 0) {
        const endDay = heap.shift()!;
        attended++;
        attendedDays.push(day);

        steps.push({
          line: 7,
          explanation: `Day ${day}: attend event ending on day ${endDay} (earliest deadline). attended=${attended}.`,
          variables: { day, endDay, attended },
          visualization: {
            type: 'array',
            array: [...attendedDays],
            highlights: { [attendedDays.length - 1]: 'found' },
            labels: { [attendedDays.length - 1]: 'day ' + day },
          },
        });
      }

      day++;
    }

    steps.push({
      line: 10,
      explanation: `All events processed. Maximum events attended = ${attended}.`,
      variables: { result: attended, attendedDays: attendedDays.join(',') },
      visualization: {
        type: 'array',
        array: [...attendedDays],
        highlights: Object.fromEntries(attendedDays.map((_, k) => [k, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default maximumNumberOfEvents;
