import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const teemoAttackingII: AlgorithmDefinition = {
  id: 'teemo-attacking-ii',
  title: 'Teemo Attacking II',
  leetcodeNumber: 495,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Teemo attacks at times in timeSeries, each poisoning the enemy for duration seconds. Calculate total seconds of poison. Key insight: for consecutive attacks, the actual poison time is min(timeSeries[i+1] - timeSeries[i], duration). Add duration for the last attack. O(n) time.',
  tags: ['Simulation', 'Array', 'Greedy'],
  code: {
    pseudocode: `function findPoisonedDuration(timeSeries, duration):
  if empty: return 0
  total = 0
  for i from 0 to n-2:
    total += min(timeSeries[i+1] - timeSeries[i], duration)
  total += duration  // last attack always contributes fully
  return total`,
    python: `def findPoisonedDuration(timeSeries, duration):
    if not timeSeries: return 0
    total = 0
    for i in range(len(timeSeries)-1):
        total += min(timeSeries[i+1] - timeSeries[i], duration)
    return total + duration`,
    javascript: `function findPoisonedDuration(timeSeries, duration) {
  if (!timeSeries.length) return 0;
  let total = 0;
  for (let i = 0; i < timeSeries.length-1; i++) {
    total += Math.min(timeSeries[i+1] - timeSeries[i], duration);
  }
  return total + duration;
}`,
    java: `public int findPoisonedDuration(int[] timeSeries, int duration) {
    if (timeSeries.length == 0) return 0;
    int total = 0;
    for (int i = 0; i < timeSeries.length-1; i++)
        total += Math.min(timeSeries[i+1]-timeSeries[i], duration);
    return total + duration;
}`,
  },
  defaultInput: { timeSeries: [1, 4, 8], duration: 3 },
  inputFields: [
    {
      name: 'timeSeries',
      label: 'Attack Times',
      type: 'array',
      defaultValue: [1, 4, 8],
      placeholder: '1,4,8',
      helperText: 'Times when Teemo attacks',
    },
    {
      name: 'duration',
      label: 'Poison Duration',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Seconds each attack poisons',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const timeSeries = input.timeSeries as number[];
    const duration = input.duration as number;
    const steps: AlgorithmStep[] = [];

    let total = 0;
    const contributions: number[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...timeSeries],
      highlights,
      labels,
      auxData: { label: 'Teemo Attacking', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `findPoisonedDuration([${timeSeries.join(',')}], ${duration}). Each attack poisons for ${duration}s. Overlapping poisons don't stack.`,
      variables: { timeSeries, duration },
      visualization: makeViz(
        {},
        Object.fromEntries(timeSeries.map((t, i) => [i, `t=${t}`])),
        [{ key: 'Duration', value: String(duration) }, { key: 'Attacks', value: timeSeries.length.toString() }],
      ),
    });

    for (let i = 0; i < timeSeries.length - 1; i++) {
      const gap = timeSeries[i + 1] - timeSeries[i];
      const contrib = Math.min(gap, duration);
      total += contrib;
      contributions.push(contrib);

      steps.push({
        line: 4,
        explanation: `Attack ${i + 1} at t=${timeSeries[i]}: gap to next=${gap}, min(${gap}, ${duration})=${contrib}. Total=${total}.`,
        variables: { attack: i + 1, time: timeSeries[i], gap, contribution: contrib, total },
        visualization: makeViz(
          { [i]: 'active', [i + 1]: 'comparing' },
          Object.fromEntries(timeSeries.map((t, j) => [j, j <= i ? `t=${t}(+${contributions[j] ?? '?'})` : `t=${t}`])),
          [{ key: `Attack ${i + 1}`, value: `+${contrib}` }, { key: 'Total so far', value: String(total) }, { key: 'Gap', value: String(gap) }],
        ),
      });
    }

    // Last attack
    total += duration;
    contributions.push(duration);

    steps.push({
      line: 5,
      explanation: `Last attack at t=${timeSeries[timeSeries.length - 1]}: always contributes full ${duration}s. Total=${total}.`,
      variables: { lastAttack: timeSeries[timeSeries.length - 1], duration, total },
      visualization: makeViz(
        { [timeSeries.length - 1]: 'found' },
        Object.fromEntries(timeSeries.map((t, i) => [i, `t=${t}(+${contributions[i]})`])),
        [{ key: `Last Attack`, value: `+${duration}` }, { key: 'Total', value: String(total) }],
      ),
    });

    steps.push({
      line: 6,
      explanation: `Done! Total poisoned time = ${total} seconds. Contributions: [${contributions.join(',')}].`,
      variables: { total, contributions },
      visualization: makeViz(
        Object.fromEntries(timeSeries.map((_, i) => [i, 'found'])),
        Object.fromEntries(timeSeries.map((t, i) => [i, `t=${t}(+${contributions[i]})`])),
        [{ key: 'Answer', value: String(total) }, { key: 'Contributions', value: contributions.join(',') }],
      ),
    });

    return steps;
  },
};

export default teemoAttackingII;
