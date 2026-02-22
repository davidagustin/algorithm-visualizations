import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumRoundsToCompleteTasks: AlgorithmDefinition = {
  id: 'minimum-rounds-to-complete-tasks',
  title: 'Minimum Rounds to Complete All Tasks',
  leetcodeNumber: 2244,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Each round you can complete 2 or 3 tasks of the same difficulty. Given task difficulties, find the minimum number of rounds to complete all tasks, or -1 if impossible. Greedy: for each difficulty group of size n, use as many rounds of 3 as possible (n // 3), and handle the remainder with 1 or 2 extra rounds.',
  tags: ['greedy', 'hash map', 'array', 'math'],

  code: {
    pseudocode: `function minimumRounds(tasks):
  freq = count frequency of each task difficulty
  rounds = 0
  for each count in freq.values():
    if count == 1: return -1
    rounds += count // 3
    if count % 3 != 0: rounds += 1
  return rounds`,

    python: `def minimumRounds(tasks: list[int]) -> int:
    from collections import Counter
    freq = Counter(tasks)
    rounds = 0
    for count in freq.values():
        if count == 1:
            return -1
        rounds += count // 3
        if count % 3 != 0:
            rounds += 1
    return rounds`,

    javascript: `function minimumRounds(tasks) {
  const freq = {};
  for (const t of tasks) freq[t] = (freq[t] || 0) + 1;
  let rounds = 0;
  for (const count of Object.values(freq)) {
    if (count === 1) return -1;
    rounds += Math.floor(count / 3);
    if (count % 3 !== 0) rounds += 1;
  }
  return rounds;
}`,

    java: `public int minimumRounds(int[] tasks) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int t : tasks) freq.merge(t, 1, Integer::sum);
    int rounds = 0;
    for (int count : freq.values()) {
        if (count == 1) return -1;
        rounds += count / 3;
        if (count % 3 != 0) rounds += 1;
    }
    return rounds;
}`,
  },

  defaultInput: {
    tasks: [2, 2, 3, 3, 2, 4, 4, 4, 4, 4],
  },

  inputFields: [
    {
      name: 'tasks',
      label: 'Task Difficulties',
      type: 'array',
      defaultValue: [2, 2, 3, 3, 2, 4, 4, 4, 4, 4],
      placeholder: '2,2,3,3,2,4,4,4,4,4',
      helperText: 'Difficulty level of each task',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tasks = input.tasks as number[];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Count frequencies of each difficulty. Each round completes 2 or 3 tasks of the same level.`,
      variables: { tasks: tasks.join(',') },
      visualization: {
        type: 'array',
        array: [...tasks],
        highlights: Object.fromEntries(tasks.map((_, i) => [i, 'active'])),
        labels: {},
      },
    });

    const freq: Record<number, number> = {};
    for (const t of tasks) freq[t] = (freq[t] || 0) + 1;

    const freqStr = Object.entries(freq).map(([k, v]) => k + ':' + v).join(', ');
    const entries = Object.entries(freq).map(([k, v]) => ({ diff: Number(k), count: v }));

    steps.push({
      line: 2,
      explanation: `Frequencies: {${freqStr}}. For each group, compute rounds needed.`,
      variables: { freq: freqStr },
      visualization: {
        type: 'array',
        array: entries.map(e => e.count),
        highlights: Object.fromEntries(entries.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(entries.map((e, i) => [i, 'diff:' + e.diff])),
      },
    });

    let rounds = 0;

    for (let i = 0; i < entries.length; i++) {
      const { diff, count } = entries[i];

      if (count === 1) {
        steps.push({
          line: 4,
          explanation: `Difficulty ${diff} has count=1. Cannot form a group of 2 or 3. Return -1.`,
          variables: { diff, count, result: -1 },
          visualization: {
            type: 'array',
            array: entries.map(e => e.count),
            highlights: { [i]: 'mismatch' },
            labels: { [i]: 'impossible' },
          },
        });
        return steps;
      }

      const threes = Math.floor(count / 3);
      const remainder = count % 3;
      const extraRound = remainder !== 0 ? 1 : 0;
      const roundsForThis = threes + extraRound;
      rounds += roundsForThis;

      steps.push({
        line: 5,
        explanation: `Difficulty ${diff}: count=${count}. Use ${threes} rounds of 3${remainder > 0 ? ' + 1 round of ' + remainder : ''}. Rounds for this group=${roundsForThis}. Total rounds=${rounds}.`,
        variables: { diff, count, threes, remainder, roundsForThis, totalRounds: rounds },
        visualization: {
          type: 'array',
          array: entries.map(e => e.count),
          highlights: {
            [i]: 'found',
            ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'sorted'])),
          },
          labels: { [i]: roundsForThis + ' rounds' },
        },
      });
    }

    steps.push({
      line: 7,
      explanation: `All difficulty groups processed. Minimum rounds = ${rounds}.`,
      variables: { result: rounds },
      visualization: {
        type: 'array',
        array: entries.map(e => e.count),
        highlights: Object.fromEntries(entries.map((_, i) => [i, 'found'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default minimumRoundsToCompleteTasks;
