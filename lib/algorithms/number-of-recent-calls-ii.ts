import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfRecentCallsII: AlgorithmDefinition = {
  id: 'number-of-recent-calls-ii',
  title: 'Number of Recent Calls II',
  leetcodeNumber: 933,
  difficulty: 'Easy',
  category: 'Design',
  description:
    'Design a RecentCounter that counts recent requests in the past 3000ms. Each ping(t) adds a request at time t and returns the count of requests in [t-3000, t]. Use a queue: add t, then remove all timestamps older than t-3000. O(1) amortized per call.',
  tags: ['Design', 'Queue', 'Sliding Window'],
  code: {
    pseudocode: `class RecentCounter:
  def __init__():
    self.queue = deque()
  def ping(t):
    queue.append(t)
    while queue[0] < t - 3000:
      queue.popleft()
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
  constructor() { this.queue = []; }
  ping(t) {
    this.queue.push(t);
    while (this.queue[0] < t - 3000) this.queue.shift();
    return this.queue.length;
  }
}`,
    java: `class RecentCounter {
    private Deque<Integer> queue = new ArrayDeque<>();
    public int ping(int t) {
        queue.addLast(t);
        while (queue.peekFirst() < t - 3000) queue.pollFirst();
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
      placeholder: '1,100,3001,3002',
      helperText: 'Strictly increasing timestamps for ping calls',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const pings = input.pings as number[];
    const steps: AlgorithmStep[] = [];

    const queue: number[] = [];
    const results: number[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: pings.map((_, i) => results[i] ?? 0),
      highlights,
      labels,
      auxData: { label: 'RecentCounter', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `RecentCounter initialized. Will track requests in [t-3000, t] window for each ping.`,
      variables: { pings },
      visualization: makeViz(
        {},
        Object.fromEntries(pings.map((p, i) => [i, `t=${p}`])),
        [{ key: 'Window', value: '3000ms' }, { key: 'Queue', value: '[]' }],
      ),
    });

    for (let i = 0; i < pings.length; i++) {
      const t = pings[i];
      queue.push(t);

      const removed: number[] = [];
      while (queue[0] < t - 3000) {
        removed.push(queue.shift()!);
      }

      const count = queue.length;
      results.push(count);

      steps.push({
        line: 4,
        explanation: `ping(${t}): Added t=${t}. Removed ${removed.length > 0 ? removed.join(',') : 'none'} (< ${t - 3000}). Window=[${queue.join(',')}]. Count=${count}.`,
        variables: { t, window: `[${t - 3000}, ${t}]`, removed, queue: [...queue], count },
        visualization: makeViz(
          { [i]: 'active' },
          Object.fromEntries(pings.map((p, j) => [j, j <= i ? `${p}→${results[j] ?? '?'}` : `t=${p}`])),
          [{ key: `ping(${t})`, value: String(count) }, { key: 'Queue', value: `[${queue.join(',')}]` }, { key: 'Window', value: `[${t-3000}, ${t}]` }],
        ),
      });
    }

    steps.push({
      line: 7,
      explanation: `All pings processed. Results: [${results.join(',')}].`,
      variables: { results },
      visualization: makeViz(
        Object.fromEntries(results.map((_, i) => [i, 'found'])),
        Object.fromEntries(pings.map((p, i) => [i, `${p}→${results[i]}`])),
        [{ key: 'Results', value: results.join(',') }],
      ),
    });

    return steps;
  },
};

export default numberOfRecentCallsII;
