import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const exclusiveTimeOfFunctionsIi: AlgorithmDefinition = {
  id: 'exclusive-time-of-functions-ii',
  title: 'Exclusive Time of Functions',
  leetcodeNumber: 636,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given n functions and a list of log entries (function id, start/end, timestamp), compute the exclusive time of each function. Use a stack to track the currently running function. When a new function starts, add elapsed time to the current top function, then push the new one. When a function ends, finalize its time and pop it.',
  tags: ['stack', 'array', 'simulation'],

  code: {
    pseudocode: `function exclusiveTime(n, logs):
  result = [0] * n
  stack = []
  prevTime = 0
  for log in logs:
    id, type, time = parse(log)
    if type == "start":
      if stack not empty:
        result[stack.top()] += time - prevTime
      stack.push(id)
      prevTime = time
    else:  // "end"
      result[stack.pop()] += time - prevTime + 1
      prevTime = time + 1
  return result`,

    python: `def exclusiveTime(n: int, logs: list[str]) -> list[int]:
    result = [0] * n
    stack = []
    prev_time = 0
    for log in logs:
        fid, typ, time = log.split(':')
        fid, time = int(fid), int(time)
        if typ == 'start':
            if stack:
                result[stack[-1]] += time - prev_time
            stack.append(fid)
            prev_time = time
        else:
            result[stack.pop()] += time - prev_time + 1
            prev_time = time + 1
    return result`,

    javascript: `function exclusiveTime(n, logs) {
  const result = new Array(n).fill(0);
  const stack = [];
  let prevTime = 0;
  for (const log of logs) {
    const [id, type, time] = log.split(':');
    const fid = +id, t = +time;
    if (type === 'start') {
      if (stack.length) result[stack[stack.length-1]] += t - prevTime;
      stack.push(fid);
      prevTime = t;
    } else {
      result[stack.pop()] += t - prevTime + 1;
      prevTime = t + 1;
    }
  }
  return result;
}`,

    java: `public int[] exclusiveTime(int n, List<String> logs) {
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();
    int prevTime = 0;
    for (String log : logs) {
        String[] parts = log.split(":");
        int fid = Integer.parseInt(parts[0]);
        int time = Integer.parseInt(parts[2]);
        if (parts[1].equals("start")) {
            if (!stack.isEmpty()) result[stack.peek()] += time - prevTime;
            stack.push(fid);
            prevTime = time;
        } else {
            result[stack.pop()] += time - prevTime + 1;
            prevTime = time + 1;
        }
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
      placeholder: '2',
      helperText: 'Total number of functions (0 to n-1)',
    },
    {
      name: 'logs',
      label: 'Log Entries',
      type: 'array',
      defaultValue: ['0:start:0', '1:start:2', '1:end:5', '0:end:6'],
      placeholder: '0:start:0,1:start:2,1:end:5,0:end:6',
      helperText: 'Log entries in format "id:start/end:timestamp"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const logs = input.logs as string[];
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    const result: number[] = new Array(n).fill(0);
    let prevTime = 0;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(id => `fn${id}`),
      inputChars: logs,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Compute exclusive time for ${n} functions from ${logs.length} log entries. Stack tracks nested function calls.`,
      variables: { n, result: [...result], prevTime },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < logs.length; i++) {
      const parts = logs[i].split(':');
      const fid = parseInt(parts[0]);
      const type = parts[1];
      const time = parseInt(parts[2]);

      steps.push({
        line: 5,
        explanation: `Log: "${logs[i]}". Function ${fid} ${type}s at time ${time}.`,
        variables: { log: logs[i], fid, type, time, prevTime },
        visualization: makeViz(i, 'idle'),
      });

      if (type === 'start') {
        if (stack.length > 0) {
          const elapsed = time - prevTime;
          result[stack[stack.length - 1]] += elapsed;
          steps.push({
            line: 8,
            explanation: `Function ${stack[stack.length-1]} was running for ${elapsed} units (${prevTime} to ${time}). Add to its exclusive time. result[${stack[stack.length-1]}] = ${result[stack[stack.length-1]]}.`,
            variables: { currentFn: stack[stack.length-1], elapsed, result: [...result] },
            visualization: makeViz(i, 'idle'),
          });
        }
        stack.push(fid);
        prevTime = time;
        steps.push({
          line: 9,
          explanation: `Start function ${fid}. Push onto stack. Set prevTime = ${time}.`,
          variables: { fid, prevTime, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      } else {
        const duration = time - prevTime + 1;
        const popped = stack.pop()!;
        result[popped] += duration;
        prevTime = time + 1;
        steps.push({
          line: 11,
          explanation: `End function ${popped}. Duration = ${time} - ${prevTime - 1} + 1 = ${duration}. result[${popped}] = ${result[popped]}. Set prevTime = ${prevTime}.`,
          variables: { popped, duration, result: [...result], prevTime },
          visualization: makeViz(i, 'pop'),
        });
      }
    }

    steps.push({
      line: 13,
      explanation: `All logs processed. Exclusive times: [${result.join(', ')}]. Function 0 ran for ${result[0]} units total.`,
      variables: { result: [...result] },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default exclusiveTimeOfFunctionsIi;
