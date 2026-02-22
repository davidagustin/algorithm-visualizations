import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const candyDistribution: AlgorithmDefinition = {
  id: 'candy-distribution',
  title: 'Candy Distribution',
  leetcodeNumber: 135,
  difficulty: 'Hard',
  category: 'Greedy',
  description:
    'There are n children standing in a line. Each child is assigned a rating value. Distribute candies such that each child has at least one candy, and children with a higher rating than their neighbors get more candies. Find the minimum total candies needed. The greedy approach uses two passes: left-to-right to satisfy left neighbors, then right-to-left to satisfy right neighbors.',
  tags: ['greedy', 'array', 'two passes'],

  code: {
    pseudocode: `function candy(ratings):
  n = length(ratings)
  candies = array of 1s, length n
  // Left pass: fix left neighbor constraint
  for i from 1 to n-1:
    if ratings[i] > ratings[i-1]:
      candies[i] = candies[i-1] + 1
  // Right pass: fix right neighbor constraint
  for i from n-2 down to 0:
    if ratings[i] > ratings[i+1]:
      candies[i] = max(candies[i], candies[i+1] + 1)
  return sum(candies)`,

    python: `def candy(ratings: list[int]) -> int:
    n = len(ratings)
    candies = [1] * n
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            candies[i] = candies[i - 1] + 1
    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]:
            candies[i] = max(candies[i], candies[i + 1] + 1)
    return sum(candies)`,

    javascript: `function candy(ratings) {
  const n = ratings.length;
  const candies = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) {
      candies[i] = candies[i - 1] + 1;
    }
  }
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i] > ratings[i + 1]) {
      candies[i] = Math.max(candies[i], candies[i + 1] + 1);
    }
  }
  return candies.reduce((a, b) => a + b, 0);
}`,

    java: `public int candy(int[] ratings) {
    int n = ratings.length;
    int[] candies = new int[n];
    Arrays.fill(candies, 1);
    for (int i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1;
        }
    }
    for (int i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
            candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
    }
    int total = 0;
    for (int c : candies) total += c;
    return total;
}`,
  },

  defaultInput: {
    ratings: [1, 0, 2],
  },

  inputFields: [
    {
      name: 'ratings',
      label: 'Ratings',
      type: 'array',
      defaultValue: [1, 0, 2],
      placeholder: '1,0,2',
      helperText: 'Comma-separated rating values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const ratings = input.ratings as number[];
    const steps: AlgorithmStep[] = [];
    const n = ratings.length;
    const candies = new Array(n).fill(1);

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 2,
      explanation: 'Initialize all children with 1 candy each.',
      variables: { candies: [...candies] },
      visualization: makeViz(candies, {}, {}),
    });

    // Left pass
    steps.push({
      line: 4,
      explanation: 'Left pass: for each child, if rating is higher than left neighbor, give one more candy than that neighbor.',
      variables: { pass: 'left' },
      visualization: makeViz(candies, {}, {}),
    });

    for (let i = 1; i < n; i++) {
      if (ratings[i] > ratings[i - 1]) {
        candies[i] = candies[i - 1] + 1;
        steps.push({
          line: 6,
          explanation: `Child ${i} rating (${ratings[i]}) > child ${i - 1} rating (${ratings[i - 1]}). Set candies[${i}] = ${candies[i]}.`,
          variables: { i, 'ratings[i]': ratings[i], 'ratings[i-1]': ratings[i - 1], 'candies[i]': candies[i] },
          visualization: makeViz(candies, { [i]: 'active', [i - 1]: 'comparing' }, { [i]: `${candies[i]}` }),
        });
      } else {
        steps.push({
          line: 5,
          explanation: `Child ${i} rating (${ratings[i]}) not greater than child ${i - 1} rating (${ratings[i - 1]}). Keep candies[${i}] = 1.`,
          variables: { i, 'ratings[i]': ratings[i], 'ratings[i-1]': ratings[i - 1] },
          visualization: makeViz(candies, { [i]: 'visited', [i - 1]: 'comparing' }, {}),
        });
      }
    }

    // Right pass
    steps.push({
      line: 8,
      explanation: 'Right pass: for each child from right to left, if rating is higher than right neighbor, give at least one more candy than that neighbor.',
      variables: { pass: 'right', candiesAfterLeftPass: [...candies] },
      visualization: makeViz(candies, {}, {}),
    });

    for (let i = n - 2; i >= 0; i--) {
      if (ratings[i] > ratings[i + 1]) {
        const prev = candies[i];
        candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        steps.push({
          line: 10,
          explanation: `Child ${i} rating (${ratings[i]}) > child ${i + 1} rating (${ratings[i + 1]}). Update candies[${i}] = max(${prev}, ${candies[i + 1] + 1}) = ${candies[i]}.`,
          variables: { i, 'ratings[i]': ratings[i], 'ratings[i+1]': ratings[i + 1], 'candies[i]': candies[i] },
          visualization: makeViz(candies, { [i]: 'active', [i + 1]: 'comparing' }, { [i]: `${candies[i]}` }),
        });
      } else {
        steps.push({
          line: 9,
          explanation: `Child ${i} rating (${ratings[i]}) not greater than child ${i + 1}. Keep candies[${i}] = ${candies[i]}.`,
          variables: { i, 'ratings[i]': ratings[i] },
          visualization: makeViz(candies, { [i]: 'visited', [i + 1]: 'comparing' }, {}),
        });
      }
    }

    const total = candies.reduce((a, b) => a + b, 0);
    steps.push({
      line: 11,
      explanation: `Total candies needed: ${total}.`,
      variables: { total, candies: [...candies] },
      visualization: makeViz(candies, Object.fromEntries(candies.map((_, idx) => [idx, 'found'])), Object.fromEntries(candies.map((c, idx) => [idx, `${c}`]))),
    });

    return steps;
  },
};

export default candyDistribution;
