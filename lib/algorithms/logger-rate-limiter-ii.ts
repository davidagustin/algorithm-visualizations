import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const loggerRateLimiterII: AlgorithmDefinition = {
  id: 'logger-rate-limiter-ii',
  title: 'Logger Rate Limiter II',
  leetcodeNumber: 359,
  difficulty: 'Easy',
  category: 'Design',
  description:
    'Design a logger that limits duplicate messages to once every 10 seconds. shouldPrintMessage(timestamp, message) returns true only if the message has not been printed in the past 10 seconds. Use a hash map to store the last print time for each message. O(1) per call.',
  tags: ['Design', 'Hash Map'],
  code: {
    pseudocode: `class Logger:
  def __init__():
    self.lastPrinted = {}
  def shouldPrintMessage(timestamp, message):
    if message not in lastPrinted:
      lastPrinted[message] = timestamp
      return True
    if timestamp - lastPrinted[message] >= 10:
      lastPrinted[message] = timestamp
      return True
    return False`,
    python: `class Logger:
    def __init__(self):
        self.last = {}
    def shouldPrintMessage(self, timestamp: int, message: str) -> bool:
        if message not in self.last or timestamp - self.last[message] >= 10:
            self.last[message] = timestamp
            return True
        return False`,
    javascript: `class Logger {
  constructor() { this.last = {}; }
  shouldPrintMessage(timestamp, message) {
    if (!(message in this.last) || timestamp - this.last[message] >= 10) {
      this.last[message] = timestamp;
      return true;
    }
    return false;
  }
}`,
    java: `class Logger {
    private Map<String,Integer> last = new HashMap<>();
    public boolean shouldPrintMessage(int timestamp, String message) {
        if (!last.containsKey(message) || timestamp-last.get(message)>=10) {
            last.put(message, timestamp);
            return true;
        }
        return false;
    }
}`,
  },
  defaultInput: { calls: [[1, 'foo'], [2, 'bar'], [3, 'foo'], [8, 'bar'], [10, 'foo'], [11, 'foo']] },
  inputFields: [
    {
      name: 'timestamps',
      label: 'Timestamps',
      type: 'array',
      defaultValue: [1, 2, 3, 8, 10, 11],
      placeholder: '1,2,3,8,10,11',
      helperText: 'Timestamps for each call',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const timestamps = input.timestamps as number[];
    const steps: AlgorithmStep[] = [];

    const messages = ['foo', 'bar', 'foo', 'bar', 'foo', 'foo'];
    const callCount = Math.min(timestamps.length, messages.length);
    const last: Map<string, number> = new Map();
    const results: number[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: timestamps.slice(0, callCount),
      highlights,
      labels,
      auxData: { label: 'Rate Limiter', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `Logger initialized. Rate limit: same message at most once per 10 seconds. Hash map stores last print time.`,
      variables: {},
      visualization: makeViz(
        {},
        Object.fromEntries(timestamps.slice(0, callCount).map((t, i) => [i, `t=${t}`])),
        [{ key: 'Cooldown', value: '10 seconds' }, { key: 'Log', value: '{}' }],
      ),
    });

    for (let i = 0; i < callCount; i++) {
      const ts = timestamps[i];
      const msg = messages[i];

      const lastTime = last.get(msg);
      let print: boolean;

      if (lastTime === undefined || ts - lastTime >= 10) {
        last.set(msg, ts);
        print = true;
      } else {
        print = false;
      }

      results.push(print ? 1 : 0);

      const logState = [...last.entries()].map(([k, v]) => `${k}@${v}`).join(', ');

      steps.push({
        line: 5,
        explanation: `shouldPrintMessage(${ts}, "${msg}"): lastPrinted["${msg}"]=${lastTime ?? 'N/A'}. Diff=${lastTime !== undefined ? ts - lastTime : 'N/A'}. Result: ${print ? 'PRINT' : 'SKIP'}.`,
        variables: { timestamp: ts, message: msg, lastPrinted: lastTime ?? 'N/A', print },
        visualization: makeViz(
          { [i]: print ? 'found' : 'mismatch' },
          Object.fromEntries(timestamps.slice(0, callCount).map((t, j) => [j, j < i ? (results[j] ? '✓' : '✗') : j === i ? `"${msg}"` : `t=${t}`])),
          [{ key: `call ${i+1}`, value: `(${ts},"${msg}") → ${print}` }, { key: 'Log', value: logState }],
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `Done! Results: [${results.map(r => r ? 'true' : 'false').join(', ')}].`,
      variables: { results },
      visualization: makeViz(
        Object.fromEntries(results.map((r, i) => [i, r ? 'found' : 'visited'])),
        Object.fromEntries(results.map((r, i) => [i, r ? 'print' : 'skip'])),
        [{ key: 'Results', value: results.map(r => r ? 'T' : 'F').join(',') }],
      ),
    });

    return steps;
  },
};

export default loggerRateLimiterII;
