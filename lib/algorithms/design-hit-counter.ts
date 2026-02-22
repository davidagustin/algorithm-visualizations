import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designHitCounter: AlgorithmDefinition = {
  id: 'design-hit-counter',
  title: 'Design Hit Counter',
  leetcodeNumber: 362,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Design a hit counter that counts hits in the past 5 minutes (300 seconds). Use a queue to store hit timestamps. When getHits(t) is called, evict timestamps older than t-300 from the front of the queue, then return the queue size.',
  tags: ['Stack', 'Queue', 'Design', 'Hash Map'],
  code: {
    pseudocode: `class HitCounter:
  queue = deque()
  function hit(timestamp):
    queue.push_back(timestamp)
  function getHits(timestamp):
    while queue.front <= timestamp - 300:
      queue.pop_front()
    return len(queue)`,
    python: `from collections import deque

class HitCounter:
    def __init__(self):
        self.queue = deque()

    def hit(self, timestamp: int) -> None:
        self.queue.append(timestamp)

    def getHits(self, timestamp: int) -> int:
        while self.queue and self.queue[0] <= timestamp - 300:
            self.queue.popleft()
        return len(self.queue)`,
    javascript: `class HitCounter {
  constructor() {
    this.queue = [];
  }
  hit(timestamp) {
    this.queue.push(timestamp);
  }
  getHits(timestamp) {
    while (this.queue.length && this.queue[0] <= timestamp - 300) {
      this.queue.shift();
    }
    return this.queue.length;
  }
}`,
    java: `class HitCounter {
    Deque<Integer> queue = new ArrayDeque<>();

    public void hit(int timestamp) {
        queue.offer(timestamp);
    }

    public int getHits(int timestamp) {
        while (!queue.isEmpty() && queue.peek() <= timestamp - 300) {
            queue.poll();
        }
        return queue.size();
    }
}`,
  },
  defaultInput: {
    operations: 'hit 1, hit 2, hit 3, getHits 4, hit 300, getHits 300, getHits 301',
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'hit 1, hit 2, hit 3, getHits 4, hit 300, getHits 300, getHits 301',
      placeholder: 'hit 1, getHits 5',
      helperText: 'Comma-separated: hit T or getHits T',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const opsStr = input.operations as string;
    const operations = opsStr.split(',').map(o => o.trim());
    const steps: AlgorithmStep[] = [];
    const queue: number[] = [];

    function makeViz(action: string, ts: number, result?: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < queue.length; i++) {
        highlights[i] = queue[i] > ts - 300 ? 'active' : 'mismatch';
      }
      return {
        type: 'array',
        array: [...queue],
        highlights,
        labels: {},
        auxData: {
          label: 'Hit Counter State',
          entries: [
            { key: 'Operation', value: action },
            { key: 'Timestamp', value: String(ts) },
            { key: 'Window', value: `[${ts - 300}, ${ts}]` },
            { key: 'Queue', value: queue.length > 0 ? `[${queue.join(', ')}]` : '[]' },
            ...(result !== undefined ? [{ key: 'Result', value: result }] : []),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize empty queue. hit() adds timestamps; getHits() evicts old timestamps (> 300s ago) and returns queue size.',
      variables: { queue: [] },
      visualization: makeViz('init', 0),
    });

    for (const op of operations) {
      const parts = op.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const ts = Number(parts[1]);

      if (cmd === 'hit') {
        queue.push(ts);
        steps.push({
          line: 3,
          explanation: `hit(${ts}): Record a hit at timestamp ${ts}. Add to queue.`,
          variables: { timestamp: ts, queue: [...queue] },
          visualization: makeViz(`hit(${ts})`, ts),
        });
      } else if (cmd === 'gethits') {
        const cutoff = ts - 300;
        let evicted = 0;
        while (queue.length > 0 && queue[0] <= cutoff) {
          queue.shift();
          evicted++;
        }

        if (evicted > 0) {
          steps.push({
            line: 5,
            explanation: `getHits(${ts}): Evict ${evicted} hit(s) with timestamp <= ${cutoff}. Queue: [${queue.join(', ')}].`,
            variables: { timestamp: ts, cutoff, evicted, queue: [...queue] },
            visualization: makeViz(`getHits(${ts}) evict`, ts),
          });
        }

        steps.push({
          line: 6,
          explanation: `getHits(${ts}): ${queue.length} hit(s) in window [${cutoff + 1}, ${ts}]. Return ${queue.length}.`,
          variables: { timestamp: ts, result: queue.length, queue: [...queue] },
          visualization: makeViz(`getHits(${ts})`, ts, String(queue.length)),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: 'All operations complete. The queue-based approach keeps only relevant timestamps at O(1) amortized.',
      variables: { queue: [...queue] },
      visualization: makeViz('done', 0),
    });

    return steps;
  },
};

export default designHitCounter;
