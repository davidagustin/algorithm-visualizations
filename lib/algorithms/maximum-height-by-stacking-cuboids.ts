import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumHeightByStackingCuboids: AlgorithmDefinition = {
  id: 'maximum-height-by-stacking-cuboids',
  title: 'Maximum Height by Stacking Cuboids',
  leetcodeNumber: 1691,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given n cuboids, you can rotate each. Stack cuboids so each next one fits within the one below (all dimensions <=). Maximize total height. Key insight: sort each cuboid dimensions, then sort cuboids, then apply LIS-style DP.',
  tags: ['dynamic programming', 'sorting', 'lis', '3d'],

  code: {
    pseudocode: `function maxHeight(cuboids):
  sort each cuboid dimensions ascending
  sort cuboids lexicographically
  dp[i] = max height ending at cuboid i
  for i in 0..n-1:
    dp[i] = cuboids[i][2]
    for j in 0..i-1:
      if cuboids[j][0]<=cuboids[i][0] and
         cuboids[j][1]<=cuboids[i][1] and
         cuboids[j][2]<=cuboids[i][2]:
        dp[i] = max(dp[i], dp[j]+cuboids[i][2])
  return max(dp)`,
    python: `def maxHeight(cuboids: list[list[int]]) -> int:
    for c in cuboids: c.sort()
    cuboids.sort()
    n = len(cuboids)
    dp = [c[2] for c in cuboids]
    for i in range(n):
        for j in range(i):
            if all(cuboids[j][k]<=cuboids[i][k] for k in range(3)):
                dp[i] = max(dp[i], dp[j]+cuboids[i][2])
    return max(dp)`,
    javascript: `function maxHeight(cuboids) {
  cuboids.forEach(c => c.sort((a,b)=>a-b));
  cuboids.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
  const n = cuboids.length;
  const dp = cuboids.map(c => c[2]);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < i; j++)
      if ([0,1,2].every(k=>cuboids[j][k]<=cuboids[i][k]))
        dp[i] = Math.max(dp[i], dp[j]+cuboids[i][2]);
  return Math.max(...dp);
}`,
    java: `public int maxHeight(int[][] cuboids) {
    for (int[] c : cuboids) Arrays.sort(c);
    Arrays.sort(cuboids, (a,b)->a[0]==b[0]?(a[1]==b[1]?a[2]-b[2]:a[1]-b[1]):a[0]-b[0]);
    int n = cuboids.length;
    int[] dp = new int[n];
    for (int i = 0; i < n; i++) {
        dp[i] = cuboids[i][2];
        for (int j = 0; j < i; j++)
            if (cuboids[j][0]<=cuboids[i][0]&&cuboids[j][1]<=cuboids[i][1]&&cuboids[j][2]<=cuboids[i][2])
                dp[i] = Math.max(dp[i], dp[j]+cuboids[i][2]);
    }
    return Arrays.stream(dp).max().getAsInt();
}`,
  },

  defaultInput: {
    cuboids: [[50, 45, 20], [95, 37, 53], [45, 23, 12]],
  },

  inputFields: [
    {
      name: 'cuboids',
      label: 'Cuboids (flat: w1,h1,d1,w2,h2,d2,...)',
      type: 'array',
      defaultValue: [50, 45, 20, 95, 37, 53, 45, 23, 12],
      placeholder: '50,45,20,95,37,53,45,23,12',
      helperText: 'Cuboid dimensions as flat triplets',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.cuboids as number[];
    const cuboids: number[][] = [];
    for (let i = 0; i + 2 < flat.length; i += 3) cuboids.push([flat[i], flat[i + 1], flat[i + 2]]);

    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: ${cuboids.length} cuboids. Sort each cuboid dimensions ascending.`,
      variables: { cuboids: JSON.stringify(cuboids) },
      visualization: {
        type: 'array',
        array: cuboids.map(c => c[2]),
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (const c of cuboids) c.sort((a, b) => a - b);
    cuboids.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);

    steps.push({
      line: 2,
      explanation: `After sorting each cuboid and then sorting cuboids: ${cuboids.map(c => '[' + c.join(',') + ']').join(', ')}.`,
      variables: { sorted: JSON.stringify(cuboids) },
      visualization: {
        type: 'array',
        array: cuboids.map(c => c[2]),
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    const n = cuboids.length;
    const dp: number[] = cuboids.map(c => c[2]);

    steps.push({
      line: 4,
      explanation: `Initialize dp[i] = height of cuboid i (tallest dimension): [${dp.join(', ')}].`,
      variables: { dp: JSON.stringify(dp) },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (cuboids[j][0] <= cuboids[i][0] && cuboids[j][1] <= cuboids[i][1] && cuboids[j][2] <= cuboids[i][2]) {
          const candidate = dp[j] + cuboids[i][2];
          if (candidate > dp[i]) {
            dp[i] = candidate;
            steps.push({
              line: 8,
              explanation: `Cuboid ${j} fits under cuboid ${i}. dp[${i}] = dp[${j}] + ${cuboids[i][2]} = ${dp[i]}.`,
              variables: { i, j, 'dp[i]': dp[i] },
              visualization: {
                type: 'array',
                array: [...dp],
                highlights: { [i]: 'active', [j]: 'found' },
                labels: { [i]: `dp=${dp[i]}`, [j]: `base` },
              } as ArrayVisualization,
            });
          }
        }
      }
    }

    const result = Math.max(...dp);
    steps.push({
      line: 11,
      explanation: `Result = max(dp) = ${result}. Maximum stacking height = ${result}.`,
      variables: { dp: JSON.stringify(dp), result },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: { [dp.indexOf(result)]: 'found' },
        labels: { [dp.indexOf(result)]: `max=${result}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maximumHeightByStackingCuboids;
