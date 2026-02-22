import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const dietPlanPerformance: AlgorithmDefinition = {
  id: 'diet-plan-performance',
  title: 'Diet Plan Performance',
  leetcodeNumber: 1176,
  difficulty: 'Easy',
  category: 'Sliding Window',
  description:
    'A dieter consumes calories[i] for the i-th day. For each k consecutive days, they earn +1 point if total > upper, -1 point if total < lower, and 0 otherwise. Return the total performance points. Use a fixed sliding window of size k to compute each segment sum.',
  tags: ['sliding window', 'array'],

  code: {
    pseudocode: `function dietPlanPerformance(calories, k, lower, upper):
  windowSum = sum(calories[0..k-1])
  points = score(windowSum, lower, upper)
  for i in range(k, len(calories)):
    windowSum += calories[i]
    windowSum -= calories[i-k]
    points += score(windowSum, lower, upper)
  return points

function score(s, lower, upper):
  if s < lower: return -1
  if s > upper: return +1
  return 0`,

    python: `def dietPlanPerformance(calories, k, lower, upper):
    def score(s):
        if s < lower: return -1
        if s > upper: return 1
        return 0
    window = sum(calories[:k])
    points = score(window)
    for i in range(k, len(calories)):
        window += calories[i] - calories[i-k]
        points += score(window)
    return points`,

    javascript: `function dietPlanPerformance(calories, k, lower, upper) {
  const score = s => s < lower ? -1 : s > upper ? 1 : 0;
  let window = calories.slice(0, k).reduce((a, b) => a + b, 0);
  let points = score(window);
  for (let i = k; i < calories.length; i++) {
    window += calories[i] - calories[i - k];
    points += score(window);
  }
  return points;
}`,

    java: `public int dietPlanPerformance(int[] calories, int k, int lower, int upper) {
    int window = 0;
    for (int i = 0; i < k; i++) window += calories[i];
    int points = window < lower ? -1 : window > upper ? 1 : 0;
    for (int i = k; i < calories.length; i++) {
        window += calories[i] - calories[i-k];
        points += window < lower ? -1 : window > upper ? 1 : 0;
    }
    return points;
}`,
  },

  defaultInput: {
    calories: [1, 2, 3, 4, 5],
    k: 1,
    lower: 3,
    upper: 3,
  },

  inputFields: [
    {
      name: 'calories',
      label: 'Calories Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Daily calorie counts',
    },
    {
      name: 'k',
      label: 'Window Size k',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Consecutive days window',
    },
    {
      name: 'lower',
      label: 'Lower Threshold',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Sum below this gives -1 point',
    },
    {
      name: 'upper',
      label: 'Upper Threshold',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Sum above this gives +1 point',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const calories = input.calories as number[];
    const k = input.k as number;
    const lower = input.lower as number;
    const upper = input.upper as number;
    const steps: AlgorithmStep[] = [];
    const n = calories.length;

    const score = (s: number) => s < lower ? -1 : s > upper ? 1 : 0;

    let windowSum = 0;
    for (let i = 0; i < k; i++) windowSum += calories[i];
    const firstScore = score(windowSum);
    let points = firstScore;

    steps.push({
      line: 1,
      explanation: `Initial window [0..${k - 1}]: sum=${windowSum}. lower=${lower}, upper=${upper}. Score=${firstScore}. Total points=${points}.`,
      variables: { windowSum, score: firstScore, points, lower, upper },
      visualization: {
        type: 'array',
        array: [...calories],
        highlights: Object.fromEntries(Array.from({ length: k }, (_, i) => [i, firstScore > 0 ? 'found' : firstScore < 0 ? 'mismatch' : 'active'])),
        labels: { 0: 'L', [k - 1]: 'R' },
      } as ArrayVisualization,
    });

    for (let i = k; i < n; i++) {
      windowSum += calories[i];
      windowSum -= calories[i - k];
      const s = score(windowSum);
      points += s;
      const winStart = i - k + 1;

      steps.push({
        line: 5,
        explanation: `Window [${winStart}..${i}]: sum=${windowSum}. ${windowSum < lower ? `${windowSum} < ${lower}: -1 point.` : windowSum > upper ? `${windowSum} > ${upper}: +1 point.` : `${lower} <= ${windowSum} <= ${upper}: 0 points.`} Total = ${points}.`,
        variables: { windowStart: winStart, windowEnd: i, windowSum, score: s, points },
        visualization: {
          type: 'array',
          array: [...calories],
          highlights: {
            ...Object.fromEntries(Array.from({ length: k }, (_, idx) => [winStart + idx, s > 0 ? 'found' : s < 0 ? 'mismatch' : 'active'])),
            [i - k]: 'sorted',
          },
          labels: { [winStart]: 'L', [i]: 'R' },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 8,
      explanation: `Total diet plan performance = ${points} points.`,
      variables: { points },
      visualization: {
        type: 'array',
        array: [...calories],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default dietPlanPerformance;
