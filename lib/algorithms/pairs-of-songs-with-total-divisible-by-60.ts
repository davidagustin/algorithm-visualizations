import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pairsOfSongsWithTotalDivisibleBy60: AlgorithmDefinition = {
  id: 'pairs-of-songs-with-total-divisible-by-60',
  title: 'Pairs of Songs With Total Durations Divisible by 60',
  leetcodeNumber: 1010,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given a list of song durations, count pairs (i, j) where i < j and (time[i] + time[j]) % 60 == 0. This is analogous to Two Sum: for each song with remainder r = time[i] % 60, look for previously seen songs with remainder (60 - r) % 60.',
  tags: ['hash map', 'array', 'counting', 'two sum variant'],

  code: {
    pseudocode: `function numPairsDivisibleBy60(time):
  remainders = [0] * 60
  count = 0
  for t in time:
    r = t % 60
    complement = (60 - r) % 60
    count += remainders[complement]
    remainders[r] += 1
  return count`,
    python: `def numPairsDivisibleBy60(time):
    remainders = [0] * 60
    count = 0
    for t in time:
        r = t % 60
        complement = (60 - r) % 60
        count += remainders[complement]
        remainders[r] += 1
    return count`,
    javascript: `function numPairsDivisibleBy60(time) {
  const rem = new Array(60).fill(0);
  let count = 0;
  for (const t of time) {
    const r = t % 60;
    count += rem[(60 - r) % 60];
    rem[r]++;
  }
  return count;
}`,
    java: `public int numPairsDivisibleBy60(int[] time) {
    int[] rem = new int[60];
    int count = 0;
    for (int t : time) {
        int r = t % 60;
        count += rem[(60 - r) % 60];
        rem[r]++;
    }
    return count;
}`,
  },

  defaultInput: {
    time: [30, 20, 150, 100, 40],
  },

  inputFields: [
    {
      name: 'time',
      label: 'Song Durations',
      type: 'array',
      defaultValue: [30, 20, 150, 100, 40],
      placeholder: '30,20,150,100,40',
      helperText: 'Comma-separated song durations in seconds',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const time = input.time as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...time],
      highlights,
      labels,
    });

    const remainders = new Array(60).fill(0);
    let count = 0;

    steps.push({
      line: 1,
      explanation: 'Initialize remainder frequency array of size 60 and count = 0.',
      variables: { count, remainders: 'all zeros' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < time.length; i++) {
      const t = time[i];
      const r = t % 60;
      const complement = (60 - r) % 60;
      const pairsFound = remainders[complement];

      steps.push({
        line: 4,
        explanation: `Song ${i}: duration=${t}, remainder r=${r}, complement=(60-${r})%60=${complement}. Found ${pairsFound} previous songs with remainder ${complement}.`,
        variables: { i, duration: t, r, complement, pairsFound, count: count + pairsFound },
        visualization: makeViz({ [i]: pairsFound > 0 ? 'found' : 'active' }, { [i]: `r=${r}` }),
      });

      count += pairsFound;
      remainders[r]++;

      steps.push({
        line: 7,
        explanation: `Added ${pairsFound} to count. Total count = ${count}. Increment remainders[${r}] to ${remainders[r]}.`,
        variables: { count, [`remainders[${r}]`]: remainders[r] },
        visualization: makeViz({ [i]: 'sorted' }, { [i]: `cnt=${count}` }),
      });
    }

    steps.push({
      line: 8,
      explanation: `All songs processed. Total pairs whose sum is divisible by 60: ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(time.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(time.map((_, i) => [i, `${time[i]}`]))
      ),
    });

    return steps;
  },
};

export default pairsOfSongsWithTotalDivisibleBy60;
