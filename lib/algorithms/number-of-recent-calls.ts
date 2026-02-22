import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfRecentCalls: AlgorithmDefinition = {
  id: 'number-of-recent-calls',
  title: 'Number of Recent Calls',
  leetcodeNumber: 933,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Count the number of requests in the last 3000 milliseconds (inclusive). Use a queue: add each new timestamp to the back, then remove timestamps from the front that fall outside the [t-3000, t] window. The queue size is the answer.',
  tags: ['Stack', 'Queue', 'Design', 'Sliding Window'],
  code: {
    pseudocode: `class RecentCounter:
  queue = deque()
  function ping(t):
    queue.push_back(t)
    while queue.front < t - 3000:
      queue.pop_front()
    return len(queue)`,
    python: `from collections import deque

class RecentCounter:
    def __init__(self):
        self.queue = deque()

    def ping(self, t: int) -> int:
        self.queue.append(t)
        while self.queue[0] < t - 3000:
            self.queue.popleft()
        return len(self.queue)`,
    javascript: `class RecentCounter {
  constructor() {
    this.queue = [];
    this.head = 0;
  }
  ping(t) {
    this.queue.push(t);
    while (this.queue[this.head] < t - 3000) {
      this.head++;
    }
    return this.queue.length - this.head;
  }
}`,
    java: `class RecentCounter {
    Deque<Integer> queue = new ArrayDeque<>();

    public int ping(int t) {
        queue.offer(t);
        while (queue.peek() < t - 3000) {
            queue.poll();
        }
        return queue.size();
    }
}`,
  },
  defaultInput: { pings: [1, 100, 3001, 3002] },
  inputFields: [
    {
      name: 'pings',
      label: 'Ping Timestamps',
      type: 'array',
      defaultValue: [1, 100, 3001, 3002],
      placeholder: 'e.g. 1,100,3001,3002',
      helperText: 'Increasing timestamps for ping calls',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const pings = (input.pings as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const queue: number[] = [];
    const results: number[] = [];

    function makeViz(activeIdx: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < pings.length; i++) {
        if (i < (activeIdx ?? 0)) {
          highlights[i] = 'sorted';
          labels[i] = `=${results[i] ?? '?'}`;
        } else if (i === activeIdx) {
          highlights[i] = 'current';
          labels[i] = 'ping';
        } else {
          highlights[i] = 'default';
        }
      }

      return {
        type: 'array',
        array: pings,
        highlights,
        labels,
        auxData: {
          label: 'Queue (active window)',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? `[${queue.join(', ')}]` : '[]' },
            { key: 'Window', value: queue.length > 0 ? `[${queue[0]}, ${queue[queue.length - 1]}]` : 'empty' },
            { key: 'Count', value: String(queue.length) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize empty queue. For each ping, add timestamp and remove those outside [t-3000, t] window.',
      variables: { queue: [] },
      visualization: makeViz(null),
    });

    for (let i = 0; i < pings.length; i++) {
      const t = pings[i];
      queue.push(t);

      steps.push({
        line: 3,
        explanation: `ping(${t}): Add ${t} to queue. Now evict timestamps older than ${t} - 3000 = ${t - 3000}.`,
        variables: { t, window: `[${t - 3000}, ${t}]`, queue: [...queue] },
        visualization: makeViz(i),
      });

      let evicted = 0;
      while (queue.length > 0 && queue[0] < t - 3000) {
        const removed = queue.shift()!;
        evicted++;
        steps.push({
          line: 4,
          explanation: `Evict ${removed} (< ${t - 3000}). Queue: [${queue.join(', ')}].`,
          variables: { evicted: removed, queue: [...queue] },
          visualization: makeViz(i),
        });
      }

      results.push(queue.length);
      steps.push({
        line: 5,
        explanation: `ping(${t}) returns ${queue.length}: ${queue.length} request(s) in window [${t - 3000}, ${t}].`,
        variables: { t, result: queue.length, queue: [...queue] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 6,
      explanation: `All pings processed. Results: [${results.join(', ')}].`,
      variables: { results: [...results] },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < pings.length; i++) {
          h[i] = 'found';
          l[i] = `=${results[i]}`;
        }
        return {
          type: 'array' as const,
          array: pings,
          highlights: h,
          labels: l,
          auxData: {
            label: 'All Results',
            entries: [{ key: 'Results', value: `[${results.join(', ')}]` }],
          },
        };
      })(),
    });

    return steps;
  },
};

export default numberOfRecentCalls;
