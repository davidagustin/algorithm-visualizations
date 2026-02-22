import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const candies: AlgorithmDefinition = {
  id: 'candies',
  title: 'Candies (Candy Distribution)',
  leetcodeNumber: 135,
  difficulty: 'Hard',
  category: 'Greedy',
  description:
    'Distribute minimum candies to children in a line so that: (1) each child gets at least 1, (2) children with a higher rating than a neighbor get more candies. Use two passes: left-to-right ensures right-neighbor constraint, right-to-left ensures left-neighbor constraint. Take the max at each position. O(n) time.',
  tags: ['Greedy', 'Array'],
  code: {
    pseudocode: `function candy(ratings):
  n = length(ratings)
  candies = array of size n, all 1s
  for i from 1 to n-1:
    if ratings[i] > ratings[i-1]:
      candies[i] = candies[i-1] + 1
  for i from n-2 down to 0:
    if ratings[i] > ratings[i+1]:
      candies[i] = max(candies[i], candies[i+1] + 1)
  return sum(candies)`,
    python: `def candy(ratings):
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
  defaultInput: { ratings: [1, 0, 2] },
  inputFields: [
    {
      name: 'ratings',
      label: 'Ratings',
      type: 'array',
      defaultValue: [1, 0, 2],
      placeholder: '1,0,2',
      helperText: 'Comma-separated child ratings',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const ratings = input.ratings as number[];
    const steps: AlgorithmStep[] = [];
    const n = ratings.length;
    const candyArr = new Array(n).fill(1);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...candyArr],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'State', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Distribute minimum candies for ratings [${ratings.join(', ')}]. Start: everyone gets 1 candy.`,
      variables: { ratings, candies: [...candyArr] },
      visualization: makeViz(
        {},
        Object.fromEntries(ratings.map((r, i) => [i, `r=${r}`])),
        [{ key: 'Pass', value: 'Initialize all to 1' }],
      ),
    });

    // Left-to-right pass
    steps.push({
      line: 3,
      explanation: `Pass 1 (left-to-right): if ratings[i] > ratings[i-1], give more candies than left neighbor.`,
      variables: { pass: 'left-to-right' },
      visualization: makeViz(
        {},
        Object.fromEntries(candyArr.map((c: number, i: number) => [i, `${c} candy`])),
        [{ key: 'Pass', value: 'Left-to-right' }],
      ),
    });

    for (let i = 1; i < n; i++) {
      if (ratings[i] > ratings[i - 1]) {
        candyArr[i] = candyArr[i - 1] + 1;

        steps.push({
          line: 5,
          explanation: `ratings[${i}]=${ratings[i]} > ratings[${i - 1}]=${ratings[i - 1]}. candies[${i}] = candies[${i - 1}](${candyArr[i - 1]}) + 1 = ${candyArr[i]}.`,
          variables: { i, 'ratings[i]': ratings[i], 'ratings[i-1]': ratings[i - 1], 'candies[i]': candyArr[i] },
          visualization: makeViz(
            { [i - 1]: 'comparing', [i]: 'active' },
            Object.fromEntries(candyArr.map((c: number, j: number) => [j, `${c}`])),
            [{ key: 'Pass', value: 'Left-to-right' }],
          ),
        });
      } else {
        steps.push({
          line: 4,
          explanation: `ratings[${i}]=${ratings[i]} <= ratings[${i - 1}]=${ratings[i - 1]}. No change needed. candies[${i}] stays ${candyArr[i]}.`,
          variables: { i, 'ratings[i]': ratings[i], 'ratings[i-1]': ratings[i - 1] },
          visualization: makeViz(
            { [i - 1]: 'comparing', [i]: 'pointer' },
            Object.fromEntries(candyArr.map((c: number, j: number) => [j, `${c}`])),
            [{ key: 'Pass', value: 'Left-to-right' }],
          ),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `Left-to-right complete. candies = [${candyArr.join(', ')}].`,
      variables: { candies: [...candyArr] },
      visualization: makeViz(
        Object.fromEntries(candyArr.map((_: number, i: number) => [i, 'sorted'])),
        Object.fromEntries(candyArr.map((c: number, i: number) => [i, `${c}`])),
        [{ key: 'Pass', value: 'Left complete' }],
      ),
    });

    // Right-to-left pass
    steps.push({
      line: 7,
      explanation: `Pass 2 (right-to-left): if ratings[i] > ratings[i+1], ensure more candies than right neighbor.`,
      variables: { pass: 'right-to-left' },
      visualization: makeViz(
        {},
        Object.fromEntries(candyArr.map((c: number, i: number) => [i, `${c}`])),
        [{ key: 'Pass', value: 'Right-to-left' }],
      ),
    });

    for (let i = n - 2; i >= 0; i--) {
      if (ratings[i] > ratings[i + 1]) {
        const oldVal = candyArr[i];
        candyArr[i] = Math.max(candyArr[i], candyArr[i + 1] + 1);

        steps.push({
          line: 9,
          explanation: `ratings[${i}]=${ratings[i]} > ratings[${i + 1}]=${ratings[i + 1]}. candies[${i}] = max(${oldVal}, ${candyArr[i + 1]}+1) = ${candyArr[i]}.${candyArr[i] > oldVal ? ' Updated!' : ' No change (already sufficient).'}`,
          variables: { i, old: oldVal, new: candyArr[i], 'candies[i+1]': candyArr[i + 1] },
          visualization: makeViz(
            { [i]: 'active', [i + 1]: 'comparing' },
            Object.fromEntries(candyArr.map((c: number, j: number) => [j, `${c}`])),
            [{ key: 'Pass', value: 'Right-to-left' }],
          ),
        });
      } else {
        steps.push({
          line: 8,
          explanation: `ratings[${i}]=${ratings[i]} <= ratings[${i + 1}]=${ratings[i + 1]}. No change. candies[${i}] stays ${candyArr[i]}.`,
          variables: { i },
          visualization: makeViz(
            { [i]: 'pointer', [i + 1]: 'comparing' },
            Object.fromEntries(candyArr.map((c: number, j: number) => [j, `${c}`])),
            [{ key: 'Pass', value: 'Right-to-left' }],
          ),
        });
      }
    }

    const total = candyArr.reduce((a: number, b: number) => a + b, 0);

    steps.push({
      line: 10,
      explanation: `Done! candies = [${candyArr.join(', ')}]. Total = ${total}. Each child's constraint is satisfied.`,
      variables: { candies: [...candyArr], total },
      visualization: makeViz(
        Object.fromEntries(candyArr.map((_: number, i: number) => [i, 'found'])),
        Object.fromEntries(candyArr.map((c: number, i: number) => [i, `${c} (r=${ratings[i]})`])),
        [{ key: 'Total Candies', value: String(total) }],
      ),
    });

    return steps;
  },
};

export default candies;
