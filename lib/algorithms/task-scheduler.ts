import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const taskScheduler: AlgorithmDefinition = {
  id: 'task-scheduler',
  title: 'Task Scheduler',
  leetcodeNumber: 621,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Find the minimum number of CPU intervals needed to execute all tasks with a cooldown n between same-task executions. The optimal formula: find the most frequent task count (maxFreq), compute intervals = max(tasks.length, (maxFreq-1)*(n+1) + maxFreqCount).',
  tags: ['Stack', 'Array', 'Greedy', 'Hash Map'],
  code: {
    pseudocode: `function leastInterval(tasks, n):
  freq = count frequency of each task
  maxFreq = max(freq.values)
  maxFreqCount = count tasks with freq == maxFreq
  slots = (maxFreq - 1) * (n + 1) + maxFreqCount
  return max(len(tasks), slots)`,
    python: `from collections import Counter

def leastInterval(tasks, n):
    freq = Counter(tasks)
    max_freq = max(freq.values())
    max_freq_count = sum(1 for f in freq.values() if f == max_freq)
    slots = (max_freq - 1) * (n + 1) + max_freq_count
    return max(len(tasks), slots)`,
    javascript: `function leastInterval(tasks, n) {
  const freq = {};
  for (const t of tasks) freq[t] = (freq[t] || 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  const maxFreqCount = Object.values(freq).filter(f => f === maxFreq).length;
  const slots = (maxFreq - 1) * (n + 1) + maxFreqCount;
  return Math.max(tasks.length, slots);
}`,
    java: `public int leastInterval(char[] tasks, int n) {
    int[] freq = new int[26];
    for (char t : tasks) freq[t - 'A']++;
    int maxFreq = 0;
    for (int f : freq) maxFreq = Math.max(maxFreq, f);
    int maxFreqCount = 0;
    for (int f : freq) if (f == maxFreq) maxFreqCount++;
    int slots = (maxFreq - 1) * (n + 1) + maxFreqCount;
    return Math.max(tasks.length, slots);
}`,
  },
  defaultInput: { tasks: ['A', 'A', 'A', 'B', 'B', 'B'], n: 2 },
  inputFields: [
    {
      name: 'tasks',
      label: 'Tasks',
      type: 'string',
      defaultValue: 'A,A,A,B,B,B',
      placeholder: 'e.g. A,A,A,B,B,B',
      helperText: 'Comma-separated task labels',
    },
    {
      name: 'n',
      label: 'Cooldown (n)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Cooldown intervals between same tasks',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawTasks = input.tasks as string[] | string;
    const tasks: string[] = Array.isArray(rawTasks)
      ? rawTasks
      : String(rawTasks).split(',').map(t => t.trim());
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    // Build frequency map
    const freq: Record<string, number> = {};
    for (const t of tasks) freq[t] = (freq[t] || 0) + 1;
    const freqValues = Object.values(freq);
    const freqDisplay = Object.entries(freq).map(([k, v]) => `${k}:${v}`);

    steps.push({
      line: 1,
      explanation: `Count task frequencies: ${freqDisplay.join(', ')}. Total tasks = ${tasks.length}, cooldown n=${n}.`,
      variables: { freq, totalTasks: tasks.length, n },
      visualization: {
        type: 'array',
        array: freqValues,
        highlights: freqValues.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'active'; return acc; }, {}),
        labels: freqValues.reduce((acc: Record<number, string>, _, i) => { acc[i] = Object.keys(freq)[i]; return acc; }, {}),
        auxData: {
          label: 'Frequency Map',
          entries: freqDisplay.map(e => ({ key: e.split(':')[0], value: e.split(':')[1] })),
        },
      },
    });

    const maxFreq = Math.max(...freqValues);
    steps.push({
      line: 2,
      explanation: `Maximum frequency = ${maxFreq}. The task(s) with this frequency create the "frame" of the schedule.`,
      variables: { maxFreq },
      visualization: {
        type: 'array',
        array: freqValues,
        highlights: freqValues.reduce((acc: Record<number, string>, v, i) => { acc[i] = v === maxFreq ? 'found' : 'default'; return acc; }, {}),
        labels: freqValues.reduce((acc: Record<number, string>, _, i) => { acc[i] = Object.keys(freq)[i]; return acc; }, {}),
        auxData: {
          label: 'Max Frequency',
          entries: [{ key: 'Max Freq', value: String(maxFreq) }],
        },
      },
    });

    const maxFreqCount = freqValues.filter(f => f === maxFreq).length;
    steps.push({
      line: 3,
      explanation: `${maxFreqCount} task(s) have the maximum frequency ${maxFreq}: ${Object.keys(freq).filter(k => freq[k] === maxFreq).join(', ')}.`,
      variables: { maxFreqCount },
      visualization: {
        type: 'array',
        array: freqValues,
        highlights: freqValues.reduce((acc: Record<number, string>, v, i) => { acc[i] = v === maxFreq ? 'found' : 'visited'; return acc; }, {}),
        labels: freqValues.reduce((acc: Record<number, string>, _, i) => { acc[i] = Object.keys(freq)[i]; return acc; }, {}),
        auxData: {
          label: 'Max Freq Count',
          entries: [
            { key: 'Max Freq', value: String(maxFreq) },
            { key: 'Count with max freq', value: String(maxFreqCount) },
          ],
        },
      },
    });

    const slots = (maxFreq - 1) * (n + 1) + maxFreqCount;
    steps.push({
      line: 4,
      explanation: `slots = (maxFreq-1)*(n+1) + maxFreqCount = (${maxFreq}-1)*(${n}+1) + ${maxFreqCount} = ${maxFreq - 1}*${n + 1} + ${maxFreqCount} = ${slots}.`,
      variables: { formula: `(${maxFreq}-1)*(${n}+1)+${maxFreqCount}`, slots },
      visualization: {
        type: 'array',
        array: freqValues,
        highlights: freqValues.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'comparing'; return acc; }, {}),
        labels: freqValues.reduce((acc: Record<number, string>, _, i) => { acc[i] = Object.keys(freq)[i]; return acc; }, {}),
        auxData: {
          label: 'Slot Calculation',
          entries: [
            { key: 'Formula', value: `(${maxFreq}-1)*(${n}+1)+${maxFreqCount}` },
            { key: 'Slots', value: String(slots) },
            { key: 'Total tasks', value: String(tasks.length) },
          ],
        },
      },
    });

    const result = Math.max(tasks.length, slots);
    steps.push({
      line: 5,
      explanation: `Result = max(total tasks, slots) = max(${tasks.length}, ${slots}) = ${result}. ${result === tasks.length ? 'Tasks fill all slots without idle time.' : `${result - tasks.length} idle interval(s) needed.`}`,
      variables: { result },
      visualization: {
        type: 'array',
        array: freqValues,
        highlights: freqValues.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'sorted'; return acc; }, {}),
        labels: freqValues.reduce((acc: Record<number, string>, _, i) => { acc[i] = Object.keys(freq)[i]; return acc; }, {}),
        auxData: {
          label: 'Final Answer',
          entries: [
            { key: 'Min Intervals', value: String(result) },
            { key: 'Idle time', value: String(result - tasks.length) },
          ],
        },
      },
    });

    return steps;
  },
};

export default taskScheduler;
