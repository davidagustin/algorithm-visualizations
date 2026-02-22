import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxPointsFromCards: AlgorithmDefinition = {
  id: 'max-points-from-cards',
  title: 'Maximum Points You Can Obtain from Cards',
  leetcodeNumber: 1423,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an integer array cardPoints and an integer k, you can take cards from the beginning or end of the array. Return the maximum score from exactly k cards. Equivalently, find the minimum sum subarray of length n-k in the middle, then subtract from total. Use a sliding window of size n-k.',
  tags: ['sliding window', 'array', 'prefix sum', 'greedy'],

  code: {
    pseudocode: `function maxScore(cardPoints, k):
  n = len(cardPoints)
  windowSize = n - k
  total = sum(cardPoints)
  if windowSize == 0: return total
  windowSum = sum(cardPoints[:windowSize])
  minWindow = windowSum
  for i in range(windowSize, n):
    windowSum += cardPoints[i] - cardPoints[i - windowSize]
    minWindow = min(minWindow, windowSum)
  return total - minWindow`,

    python: `def maxScore(cardPoints: list[int], k: int) -> int:
    n = len(cardPoints)
    windowSize = n - k
    total = sum(cardPoints)
    if windowSize == 0:
        return total
    windowSum = sum(cardPoints[:windowSize])
    minWindow = windowSum
    for i in range(windowSize, n):
        windowSum += cardPoints[i] - cardPoints[i - windowSize]
        minWindow = min(minWindow, windowSum)
    return total - minWindow`,

    javascript: `function maxScore(cardPoints, k) {
  const n = cardPoints.length;
  const windowSize = n - k;
  const total = cardPoints.reduce((a, b) => a + b, 0);
  if (windowSize === 0) return total;
  let windowSum = cardPoints.slice(0, windowSize).reduce((a, b) => a + b, 0);
  let minWindow = windowSum;
  for (let i = windowSize; i < n; i++) {
    windowSum += cardPoints[i] - cardPoints[i - windowSize];
    minWindow = Math.min(minWindow, windowSum);
  }
  return total - minWindow;
}`,

    java: `public int maxScore(int[] cardPoints, int k) {
    int n = cardPoints.length;
    int windowSize = n - k;
    int total = Arrays.stream(cardPoints).sum();
    if (windowSize == 0) return total;
    int windowSum = 0;
    for (int i = 0; i < windowSize; i++) windowSum += cardPoints[i];
    int minWindow = windowSum;
    for (int i = windowSize; i < n; i++) {
        windowSum += cardPoints[i] - cardPoints[i - windowSize];
        minWindow = Math.min(minWindow, windowSum);
    }
    return total - minWindow;
}`,
  },

  defaultInput: {
    cardPoints: [1, 2, 3, 4, 5, 6, 1],
    k: 3,
  },

  inputFields: [
    {
      name: 'cardPoints',
      label: 'Card Points',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 1],
      placeholder: '1,2,3,4,5,6,1',
      helperText: 'Array of card point values',
    },
    {
      name: 'k',
      label: 'Cards to Take (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of cards to take from either end',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const cardPoints = input.cardPoints as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = cardPoints.length;
    const windowSize = n - k;
    const total = cardPoints.reduce((a, b) => a + b, 0);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...cardPoints],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Array length=${n}, k=${k}. Total sum=${total}. We want to minimize the middle window of size ${windowSize} (n-k), then answer = total - minWindow.`,
      variables: { n, k, total, windowSize },
      visualization: makeViz({}, {}),
    });

    if (windowSize === 0) {
      steps.push({
        line: 5,
        explanation: `windowSize=0, meaning we take all cards. Result = total = ${total}.`,
        variables: { result: total },
        visualization: makeViz(
          Object.fromEntries(cardPoints.map((_, i) => [i, 'found'])),
          {}
        ),
      });
      return steps;
    }

    let windowSum = 0;
    for (let i = 0; i < windowSize; i++) {
      windowSum += cardPoints[i];
    }

    const initHighlights: Record<number, string> = {};
    const initLabels: Record<number, string> = {};
    for (let i = 0; i < windowSize; i++) {
      initHighlights[i] = 'comparing';
    }
    initLabels[0] = 'L';
    initLabels[windowSize - 1] = 'R';

    steps.push({
      line: 6,
      explanation: `Initial window sum (indices 0 to ${windowSize - 1}) = ${windowSum}. This is our first candidate for minimum middle window.`,
      variables: { windowStart: 0, windowEnd: windowSize - 1, windowSum },
      visualization: makeViz(initHighlights, initLabels),
    });

    let minWindow = windowSum;

    for (let i = windowSize; i < n; i++) {
      windowSum += cardPoints[i] - cardPoints[i - windowSize];
      const prevMin = minWindow;
      minWindow = Math.min(minWindow, windowSum);

      const left = i - windowSize + 1;
      const right = i;
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let j = left; j <= right; j++) {
        highlights[j] = minWindow === windowSum ? 'found' : 'active';
      }
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 8,
        explanation: `Slide window to [${left}, ${right}]. windowSum=${windowSum}. minWindow=${minWindow}. Cards taken would give score=${total - minWindow}.`,
        variables: { left, right, windowSum, minWindow, score: total - minWindow },
        visualization: makeViz(highlights, labels),
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. Minimum middle window sum=${minWindow}. Maximum score from ${k} cards = ${total} - ${minWindow} = ${total - minWindow}.`,
      variables: { total, minWindow, result: total - minWindow },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default maxPointsFromCards;
