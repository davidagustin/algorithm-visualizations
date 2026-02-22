import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const taskSchedulerIi: AlgorithmDefinition = {
  id: 'task-scheduler-ii',
  title: 'Task Scheduler (Greedy Approach)',
  leetcodeNumber: 621,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given a list of CPU tasks and a cooldown period n, find the minimum number of intervals to finish all tasks. The greedy insight is that the answer depends on the most frequent task. Fill idle slots with other tasks or idle time.',
  tags: ['greedy', 'hash map', 'array', 'sorting'],

  code: {
    pseudocode: `function leastInterval(tasks, n):
  freq = count frequency of each task
  maxFreq = max(freq)
  maxCount = number of tasks with maxFreq
  partitions = maxFreq - 1
  idleSlots = partitions * (n - (maxCount - 1))
  idleSlots = max(0, idleSlots)
  return length(tasks) + idleSlots`,

    python: `def leastInterval(tasks: list[str], n: int) -> int:
    from collections import Counter
    freq = Counter(tasks)
    max_freq = max(freq.values())
    max_count = sum(1 for v in freq.values() if v == max_freq)
    partitions = max_freq - 1
    idle_slots = partitions * (n - (max_count - 1))
    idle_slots = max(0, idle_slots)
    return len(tasks) + idle_slots`,

    javascript: `function leastInterval(tasks, n) {
  const freq = {};
  for (const t of tasks) freq[t] = (freq[t] || 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  const maxCount = Object.values(freq).filter(v => v === maxFreq).length;
  const partitions = maxFreq - 1;
  const idleSlots = Math.max(0, partitions * (n - (maxCount - 1)));
  return tasks.length + idleSlots;
}`,

    java: `public int leastInterval(char[] tasks, int n) {
    int[] freq = new int[26];
    for (char t : tasks) freq[t - 'A']++;
    int maxFreq = 0;
    for (int f : freq) maxFreq = Math.max(maxFreq, f);
    int maxCount = 0;
    for (int f : freq) if (f == maxFreq) maxCount++;
    int partitions = maxFreq - 1;
    int idleSlots = Math.max(0, partitions * (n - (maxCount - 1)));
    return tasks.length + idleSlots;
}`,
  },

  defaultInput: {
    tasks: [0, 0, 1, 1, 2, 2],
    n: 2,
  },

  inputFields: [
    {
      name: 'tasks',
      label: 'Tasks (as numbers: 0=A, 1=B, etc.)',
      type: 'array',
      defaultValue: [0, 0, 1, 1, 2, 2],
      placeholder: '0,0,1,1,2,2',
      helperText: 'Task types encoded as numbers',
    },
    {
      name: 'n',
      label: 'Cooldown Period',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Minimum gap between same tasks',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tasks = input.tasks as number[];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...tasks],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Count frequency of each task type.',
      variables: { tasks: tasks.join(','), n },
      visualization: makeViz(
        Object.fromEntries(tasks.map((_, i) => [i, 'active'])),
        {}
      ),
    });

    const freq: Record<number, number> = {};
    for (const t of tasks) freq[t] = (freq[t] || 0) + 1;

    steps.push({
      line: 2,
      explanation: `Frequencies computed: ${JSON.stringify(freq)}`,
      variables: { freq: JSON.stringify(freq) },
      visualization: makeViz(
        Object.fromEntries(tasks.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    const maxFreq = Math.max(...Object.values(freq));

    steps.push({
      line: 3,
      explanation: `Max frequency = ${maxFreq}. This is the most frequent task type.`,
      variables: { maxFreq },
      visualization: makeViz(
        Object.fromEntries(tasks.map((v, i) => [i, freq[v] === maxFreq ? 'found' : 'sorted'])),
        {}
      ),
    });

    const maxCount = Object.values(freq).filter(v => v === maxFreq).length;

    steps.push({
      line: 4,
      explanation: `Number of tasks with maxFreq=${maxFreq}: maxCount=${maxCount}.`,
      variables: { maxFreq, maxCount },
      visualization: makeViz(
        Object.fromEntries(tasks.map((v, i) => [i, freq[v] === maxFreq ? 'found' : 'comparing'])),
        {}
      ),
    });

    const partitions = maxFreq - 1;

    steps.push({
      line: 5,
      explanation: `Partitions (gaps between the max-frequency tasks) = maxFreq - 1 = ${maxFreq} - 1 = ${partitions}.`,
      variables: { partitions, maxFreq },
      visualization: makeViz({}, {}),
    });

    const rawIdle = partitions * (n - (maxCount - 1));
    const idleSlots = Math.max(0, rawIdle);

    steps.push({
      line: 6,
      explanation: `Idle slots = partitions * (n - (maxCount - 1)) = ${partitions} * (${n} - ${maxCount - 1}) = ${rawIdle}. After max(0, ...): ${idleSlots}.`,
      variables: { partitions, n, maxCount, rawIdle, idleSlots },
      visualization: makeViz({}, {}),
    });

    const result = tasks.length + idleSlots;

    steps.push({
      line: 7,
      explanation: `Result = tasks.length + idleSlots = ${tasks.length} + ${idleSlots} = ${result} intervals.`,
      variables: { tasksLength: tasks.length, idleSlots, result },
      visualization: makeViz(
        Object.fromEntries(tasks.map((_, i) => [i, 'found'])),
        {}
      ),
    });

    return steps;
  },
};

export default taskSchedulerIi;
