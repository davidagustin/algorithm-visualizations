import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const crawlerLogFolder: AlgorithmDefinition = {
  id: 'crawler-log-folder',
  title: 'Crawler Log Folder',
  leetcodeNumber: 1598,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Given a list of file system operations, find the minimum number of steps to return to the main folder. "../" moves up one directory (decrement depth, min 0), "./" stays in current directory, and any other string moves into a child folder (increment depth). Use a counter tracking current folder depth.',
  tags: ['stack', 'simulation', 'file system', 'string'],

  code: {
    pseudocode: `function minOperations(logs):
  depth = 0
  for each log in logs:
    if log == "../":
      depth = max(0, depth - 1)
    elif log == "./":
      // stay in current folder, no change
    else:
      depth += 1
  return depth`,

    python: `def minOperations(logs: list[str]) -> int:
    depth = 0
    for log in logs:
        if log == "../":
            depth = max(0, depth - 1)
        elif log == "./":
            pass
        else:
            depth += 1
    return depth`,

    javascript: `function minOperations(logs) {
  let depth = 0;
  for (const log of logs) {
    if (log === '../') depth = Math.max(0, depth - 1);
    else if (log !== './') depth++;
  }
  return depth;
}`,

    java: `public int minOperations(String[] logs) {
    int depth = 0;
    for (String log : logs) {
        if (log.equals("../")) depth = Math.max(0, depth - 1);
        else if (!log.equals("./")) depth++;
    }
    return depth;
}`,
  },

  defaultInput: {
    logs: '../,d1/,d2/,d3/,../,d31/',
  },

  inputFields: [
    {
      name: 'logs',
      label: 'Log Operations',
      type: 'string',
      defaultValue: '../,d1/,d2/,d3/,../,d31/',
      placeholder: '../,d1/,d2/',
      helperText: 'Comma-separated folder operations: ../, ./, or folder/',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const logsStr = input.logs as string;
    const logs = logsStr.split(',').map(l => l.trim());
    const steps: AlgorithmStep[] = [];
    let depth = 0;
    const path: string[] = ['main'];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...path],
      inputChars: logs,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: 'Start at main folder. Depth = 0.',
      variables: { depth: 0, path: ['main'] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];

      if (log === '../') {
        if (depth > 0) {
          depth--;
          path.pop();
        }
        steps.push({
          line: 4,
          explanation: `"../" : Move up. Depth = ${depth}. Path = [${path.join(' > ')}].`,
          variables: { log, depth, path: [...path] },
          visualization: makeViz(i, depth === 0 ? 'idle' : 'pop'),
        });
      } else if (log === './') {
        steps.push({
          line: 6,
          explanation: `"./" : Stay in current folder. Depth = ${depth}.`,
          variables: { log, depth, path: [...path] },
          visualization: makeViz(i, 'idle'),
        });
      } else {
        depth++;
        path.push(log.replace('/', ''));
        steps.push({
          line: 8,
          explanation: `"${log}": Enter child folder. Depth = ${depth}. Path = [${path.join(' > ')}].`,
          variables: { log, depth, path: [...path] },
          visualization: makeViz(i, 'push'),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Final depth = ${depth}. Need ${depth} operations to return to main.`,
      variables: { result: depth, path: [...path] },
      visualization: makeViz(logs.length, 'match'),
    });

    return steps;
  },
};

export default crawlerLogFolder;
