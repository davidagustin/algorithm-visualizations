import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const exclusiveTimeOfFunctions: AlgorithmDefinition = {
  id: 'exclusive-time-of-functions',
  title: 'Exclusive Time of Functions',
  leetcodeNumber: 636,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given n functions and a list of call logs (id:start/end:timestamp), calculate the exclusive execution time of each function. Use a stack of active function IDs. When a new event occurs, update the current top function\'s time by the elapsed time since the last timestamp.',
  tags: ['Stack', 'Array', 'String'],
  code: {
    pseudocode: `function exclusiveTime(n, logs):
  result = array of n zeros
  stack = []
  prevTime = 0
  for log in logs:
    id, type, time = parse(log)
    if stack not empty:
      result[stack.top] += time - prevTime
    if type == 'start':
      stack.push(id)
    else:
      stack.pop()
      result[id] += 1  // include the end timestamp itself
    prevTime = time + (1 if end else 0)
  return result`,
    python: `def exclusiveTime(n, logs):
    result = [0] * n
    stack = []
    prev_time = 0
    for log in logs:
        fid, typ, time = log.split(':')
        fid, time = int(fid), int(time)
        if stack:
            result[stack[-1]] += time - prev_time
        if typ == 'start':
            stack.append(fid)
        else:
            stack.pop()
            result[fid] += 1
        prev_time = time + (0 if typ == 'start' else 1)
    return result`,
    javascript: `function exclusiveTime(n, logs) {
  const result = new Array(n).fill(0);
  const stack = [];
  let prevTime = 0;
  for (const log of logs) {
    const [id, type, time] = log.split(':');
    const fid = Number(id), t = Number(time);
    if (stack.length) result[stack[stack.length - 1]] += t - prevTime;
    if (type === 'start') {
      stack.push(fid);
    } else {
      stack.pop();
      result[fid] += 1;
    }
    prevTime = t + (type === 'end' ? 1 : 0);
  }
  return result;
}`,
    java: `public int[] exclusiveTime(int n, List<String> logs) {
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();
    int prevTime = 0;
    for (String log : logs) {
        String[] parts = log.split(":");
        int id = Integer.parseInt(parts[0]);
        String type = parts[1];
        int time = Integer.parseInt(parts[2]);
        if (!stack.isEmpty()) result[stack.peek()] += time - prevTime;
        if (type.equals("start")) {
            stack.push(id);
        } else {
            stack.pop();
            result[id] += 1;
        }
        prevTime = time + (type.equals("end") ? 1 : 0);
    }
    return result;
}`,
  },
  defaultInput: {
    n: 2,
    logs: ['0:start:0', '1:start:2', '1:end:5', '0:end:6'],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Functions',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Number of functions (0 to n-1)',
    },
    {
      name: 'logs',
      label: 'Logs',
      type: 'string',
      defaultValue: '0:start:0, 1:start:2, 1:end:5, 0:end:6',
      placeholder: '0:start:0, 1:start:2, 1:end:5, 0:end:6',
      helperText: 'Comma-separated logs: id:start/end:time',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const rawLogs = input.logs as string[] | string;
    const logStrs: string[] = Array.isArray(rawLogs)
      ? rawLogs
      : String(rawLogs).split(',').map(l => l.trim());

    const steps: AlgorithmStep[] = [];
    const result: number[] = new Array(n).fill(0);
    const stack: number[] = [];
    let prevTime = 0;

    function makeViz(logIdx: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < n; i++) {
        highlights[i] = stack.includes(i) ? 'active' : 'default';
        if (stack[stack.length - 1] === i) labels[i] = 'running';
        else if (stack.includes(i)) labels[i] = 'paused';
      }

      return {
        type: 'array',
        array: [...result],
        highlights,
        labels,
        auxData: {
          label: 'Exclusive Time State',
          entries: [
            { key: 'Log', value: logIdx !== null ? logStrs[logIdx] : 'init' },
            { key: 'Stack', value: stack.length > 0 ? `[${stack.join(', ')}]` : '[]' },
            { key: 'prevTime', value: String(prevTime) },
            { key: 'Result', value: `[${result.join(', ')}]` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize result=[${new Array(n).fill(0).join(', ')}], empty stack, prevTime=0. Process ${logStrs.length} log entries.`,
      variables: { n, result: [...result], stack: [], prevTime },
      visualization: makeViz(null),
    });

    for (let i = 0; i < logStrs.length; i++) {
      const parts = logStrs[i].split(':');
      const fid = Number(parts[0]);
      const type = parts[1];
      const time = Number(parts[2]);

      if (stack.length > 0) {
        const elapsed = time - prevTime;
        result[stack[stack.length - 1]] += elapsed;
        steps.push({
          line: 6,
          explanation: `Log "${logStrs[i]}": time=${time}, prevTime=${prevTime}. Elapsed=${elapsed}. Add to function ${stack[stack.length - 1]}: result[${stack[stack.length - 1]}] += ${elapsed} → ${result[stack[stack.length - 1]]}.`,
          variables: { fid, type, time, elapsed, running: stack[stack.length - 1], result: [...result] },
          visualization: makeViz(i),
        });
      }

      if (type === 'start') {
        stack.push(fid);
        prevTime = time;
        steps.push({
          line: 8,
          explanation: `start: Push function ${fid} onto stack. prevTime=${time}.`,
          variables: { fid, stack: [...stack], prevTime },
          visualization: makeViz(i),
        });
      } else {
        stack.pop();
        result[fid] += 1; // end timestamp is inclusive
        prevTime = time + 1;
        steps.push({
          line: 10,
          explanation: `end: Pop function ${fid} from stack. Add 1 for end timestamp. result[${fid}]=${result[fid]}. prevTime=${prevTime}.`,
          variables: { fid, stack: [...stack], result: [...result], prevTime },
          visualization: makeViz(i),
        });
      }
    }

    steps.push({
      line: 13,
      explanation: `Done! Exclusive times: [${result.join(', ')}]. Each value is the total time a function ran exclusively.`,
      variables: { result: [...result] },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < n; i++) { h[i] = 'found'; l[i] = `f${i}`; }
        return {
          type: 'array' as const,
          array: [...result],
          highlights: h,
          labels: l,
          auxData: {
            label: 'Final Exclusive Times',
            entries: result.map((v, i) => ({ key: `Function ${i}`, value: String(v) })),
          },
        };
      })(),
    });

    return steps;
  },
};

export default exclusiveTimeOfFunctions;
