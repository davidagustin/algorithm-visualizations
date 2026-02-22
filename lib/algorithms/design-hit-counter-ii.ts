import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designHitCounterIi: AlgorithmDefinition = {
  id: 'design-hit-counter-ii',
  title: 'Design Hit Counter',
  leetcodeNumber: 362,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a hit counter which counts the number of hits received in the past 5 minutes (300 seconds). Implement hit(timestamp) and getHits(timestamp). Each timestamp is in seconds granularity.',
  tags: ['Hash Map', 'Design', 'Queue'],
  code: {
    pseudocode: `class HitCounter:
  function init():
    this.hits = []  // list of timestamps
  function hit(timestamp):
    hits.append(timestamp)
  function getHits(timestamp):
    // Count hits in window [timestamp-299, timestamp]
    count = 0
    for t in hits:
      if t > timestamp - 300:
        count++
    return count`,
    python: `class HitCounter:
    def __init__(self):
        self.hits = []

    def hit(self, timestamp: int) -> None:
        self.hits.append(timestamp)

    def getHits(self, timestamp: int) -> int:
        return sum(1 for t in self.hits if t > timestamp - 300)`,
    javascript: `class HitCounter {
  constructor() { this.hits = []; }
  hit(timestamp) { this.hits.push(timestamp); }
  getHits(timestamp) {
    return this.hits.filter(t => t > timestamp - 300).length;
  }
}`,
    java: `class HitCounter {
    private Queue<Integer> hits = new LinkedList<>();
    public void hit(int timestamp) { hits.offer(timestamp); }
    public int getHits(int timestamp) {
        while (!hits.isEmpty() && hits.peek() <= timestamp - 300)
            hits.poll();
        return hits.size();
    }
}`,
  },
  defaultInput: {
    operations: [['hit', 1], ['hit', 2], ['hit', 3], ['getHits', 4], ['hit', 300], ['getHits', 300], ['getHits', 301]],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'hit 1, hit 2, hit 3, getHits 4, hit 300, getHits 300, getHits 301',
      placeholder: 'hit 1, hit 2, getHits 5',
      helperText: 'Comma-separated: "hit timestamp" or "getHits timestamp"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        return [parts[0], Number(parts[1])];
      });
    }

    const steps: AlgorithmStep[] = [];
    const hits: number[] = [];

    function makeViz(currentTs: number, label: string): ArrayVisualization {
      const windowStart = currentTs - 299;
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      hits.forEach((t, i) => {
        highlights[i] = t >= windowStart ? 'active' : 'visited';
        lbls[i] = `t=${t}`;
      });
      return {
        type: 'array',
        array: hits.map(t => t),
        highlights,
        labels: lbls,
        auxData: {
          label: 'Hit Counter',
          entries: [
            { key: 'Action', value: label },
            { key: 'Total hits', value: `${hits.length}` },
            { key: 'Window', value: `[${windowStart}, ${currentTs}]` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize HitCounter.',
      variables: { hits: [] },
      visualization: { type: 'array', array: [], highlights: {}, labels: {}, auxData: { label: 'Hit Counter', entries: [{ key: 'Total hits', value: '0' }] } },
    });

    for (const op of operations) {
      const opType = String(op[0]);
      const timestamp = Number(op[1]);

      if (opType === 'hit') {
        hits.push(timestamp);
        steps.push({
          line: 4,
          explanation: `hit(${timestamp}): Record hit at timestamp ${timestamp}. Total hits: ${hits.length}.`,
          variables: { timestamp, totalHits: hits.length },
          visualization: makeViz(timestamp, `hit(${timestamp})`),
        });
      } else if (opType === 'getHits') {
        const count = hits.filter(t => t > timestamp - 300).length;
        steps.push({
          line: 7,
          explanation: `getHits(${timestamp}): Count hits in window [${timestamp - 299}, ${timestamp}]. Found ${count} hits.`,
          variables: { timestamp, count, window: [timestamp - 299, timestamp] },
          visualization: makeViz(timestamp, `getHits(${timestamp}) -> ${count}`),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `All operations complete. Total recorded hits: ${hits.length}.`,
      variables: { totalHits: hits.length },
      visualization: makeViz(hits.length > 0 ? hits[hits.length - 1] : 0, 'Complete'),
    });

    return steps;
  },
};

export default designHitCounterIi;
