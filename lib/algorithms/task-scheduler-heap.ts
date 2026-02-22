import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const taskSchedulerHeap: AlgorithmDefinition = {
  id: 'task-scheduler-heap',
  title: 'Task Scheduler (Heap)',
  leetcodeNumber: 621,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given tasks and a cooldown n, schedule tasks such that the same task must be separated by at least n intervals. Use a max heap for task counts and a queue to hold tasks in cooldown. Return the minimum total time.',
  tags: ['heap', 'greedy', 'array', 'queue'],

  code: {
    pseudocode: `function leastInterval(tasks, n):
  count = frequency of each task
  maxHeap = max heap of counts
  queue = deque of (count, availableTime)
  time = 0
  while heap or queue not empty:
    time++
    if heap not empty:
      c = pop maxHeap - 1
      if c > 0: push (c, time + n) to queue
    if queue front availableTime == time:
      push front count back to heap
  return time`,

    python: `import heapq
from collections import Counter, deque

def leastInterval(tasks: list[str], n: int) -> int:
    count = Counter(tasks)
    heap = [-c for c in count.values()]
    heapq.heapify(heap)
    q = deque()
    time = 0
    while heap or q:
        time += 1
        if heap:
            c = 1 + heapq.heappop(heap)
            if c < 0:
                q.append((c, time + n))
        if q and q[0][1] == time:
            heapq.heappush(heap, q.popleft()[0])
    return time`,

    javascript: `function leastInterval(tasks, n) {
  const count = {};
  for (const t of tasks) count[t] = (count[t]||0)+1;
  let heap = Object.values(count).sort((a,b)=>b-a);
  const queue = []; // [count, availTime]
  let time = 0;
  while (heap.length || queue.length) {
    time++;
    heap.sort((a,b)=>b-a);
    if (heap.length) {
      const c = heap.shift() - 1;
      if (c > 0) queue.push([c, time + n]);
    }
    if (queue.length && queue[0][1] === time) {
      heap.push(queue.shift()[0]);
    }
  }
  return time;
}`,

    java: `public int leastInterval(char[] tasks, int n) {
    int[] count = new int[26];
    for (char t : tasks) count[t-'A']++;
    PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
    for (int c : count) if (c > 0) heap.offer(c);
    Queue<int[]> q = new LinkedList<>();
    int time = 0;
    while (!heap.isEmpty() || !q.isEmpty()) {
        time++;
        if (!heap.isEmpty()) {
            int c = heap.poll() - 1;
            if (c > 0) q.offer(new int[]{c, time + n});
        }
        if (!q.isEmpty() && q.peek()[1] == time)
            heap.offer(q.poll()[0]);
    }
    return time;
}`,
  },

  defaultInput: {
    tasks: [0, 0, 1, 1, 1, 2],
    n: 2,
  },

  inputFields: [
    {
      name: 'tasks',
      label: 'Tasks (encoded as integers)',
      type: 'array',
      defaultValue: [0, 0, 1, 1, 1, 2],
      placeholder: '0,0,1,1,1,2',
      helperText: 'Task types as integers (0=A, 1=B, 2=C, ...)',
    },
    {
      name: 'n',
      label: 'Cooldown (n)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Minimum intervals between same task',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tasks = input.tasks as number[];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const count: Record<number, number> = {};
    for (const t of tasks) count[t] = (count[t] || 0) + 1;

    let heap = Object.values(count).sort((a, b) => b - a);
    const queue: [number, number][] = []; // [count, availTime]
    let time = 0;

    steps.push({
      line: 1,
      explanation: `Task counts: ${JSON.stringify(count)}. Max heap: [${heap.join(',')}]. Cooldown n=${n}.`,
      variables: { taskCounts: JSON.stringify(count), n, heapTop: heap[0] },
      visualization: {
        type: 'array',
        array: [...heap],
        highlights: { 0: 'active' },
        labels: Object.fromEntries(heap.map((v, i) => [i, `cnt=${v}`])),
      } as ArrayVisualization,
    });

    while (heap.length > 0 || queue.length > 0) {
      time++;
      heap.sort((a, b) => b - a);

      let executed = false;
      if (heap.length > 0) {
        const c = heap.shift()! - 1;
        executed = true;
        if (c > 0) queue.push([c, time + n]);

        steps.push({
          line: 7,
          explanation: `Time=${time}: Execute task (count left=${c}). ${c > 0 ? `Goes into cooldown until t=${time + n}.` : 'Task type exhausted.'} Queue size=${queue.length}.`,
          variables: { time, executed: true, remaining: c, cooldownUntil: c > 0 ? time + n : 'done', queueSize: queue.length },
          visualization: {
            type: 'array',
            array: heap.length > 0 ? [...heap] : [0],
            highlights: { 0: 'active' },
            labels: heap.length > 0
              ? Object.fromEntries(heap.map((v, i) => [i, `cnt=${v}`]))
              : { 0: 'heap empty' },
          } as ArrayVisualization,
        });
      } else {
        steps.push({
          line: 7,
          explanation: `Time=${time}: CPU idle (no task available, waiting for cooldown). Queue: ${queue.map(([c, t]) => `cnt${c}@t${t}`).join(',')}`,
          variables: { time, executed: false, queueSize: queue.length },
          visualization: {
            type: 'array',
            array: queue.map(([c]) => c),
            highlights: {},
            labels: Object.fromEntries(queue.map(([c, t], i) => [i, `avail@t${t}`])),
          } as ArrayVisualization,
        });
      }

      if (queue.length > 0 && queue[0][1] === time) {
        const [c] = queue.shift()!;
        heap.push(c);
        heap.sort((a, b) => b - a);
        steps.push({
          line: 10,
          explanation: `Time=${time}: Task with count ${c} cooled down. Re-added to heap. Heap: [${heap.join(',')}]`,
          variables: { time, reAdded: c, heapSize: heap.length },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: { 0: 'found' },
            labels: Object.fromEntries(heap.map((v, i) => [i, `cnt=${v}`])),
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `All tasks scheduled. Total time: ${time}`,
      variables: { result: time },
      visualization: {
        type: 'array',
        array: [time],
        highlights: { 0: 'found' },
        labels: { 0: `time=${time}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default taskSchedulerHeap;
