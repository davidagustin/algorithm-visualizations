import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumPointsFromCardsIi: AlgorithmDefinition = {
  id: 'maximum-points-from-cards-ii',
  title: 'Maximum Points from Cards II',
  leetcodeNumber: 1423,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array cardPoints and integer k, pick exactly k cards from either the left or right end to maximize total points. Insight: instead of choosing k cards from ends, find the minimum sum subarray of size n-k in the middle. The answer is totalSum minus that minimum subarray sum.',
  tags: ['Sliding Window', 'Prefix Sum', 'Array', 'Greedy'],
  code: {
    pseudocode: `function maxScore(cardPoints, k):
  n = len(cardPoints)
  total = sum(cardPoints)
  windowSize = n - k
  if windowSize == 0: return total
  curSum = sum(cardPoints[:windowSize])
  minSum = curSum
  for i in windowSize..n-1:
    curSum += cardPoints[i] - cardPoints[i - windowSize]
    minSum = min(minSum, curSum)
  return total - minSum`,
    python: `def maxScore(cardPoints, k):
    n = len(cardPoints)
    total = sum(cardPoints)
    window = n - k
    if window == 0: return total
    cur = sum(cardPoints[:window])
    min_sum = cur
    for i in range(window, n):
        cur += cardPoints[i] - cardPoints[i-window]
        min_sum = min(min_sum, cur)
    return total - min_sum`,
    javascript: `function maxScore(cardPoints, k) {
  const n=cardPoints.length, total=cardPoints.reduce((a,b)=>a+b,0);
  const w=n-k; if(w===0) return total;
  let cur=cardPoints.slice(0,w).reduce((a,b)=>a+b,0), minSum=cur;
  for(let i=w;i<n;i++){cur+=cardPoints[i]-cardPoints[i-w];minSum=Math.min(minSum,cur);}
  return total-minSum;
}`,
    java: `public int maxScore(int[] cardPoints, int k) {
    int n=cardPoints.length,total=0; for(int c:cardPoints)total+=c;
    int w=n-k; if(w==0)return total;
    int cur=0; for(int i=0;i<w;i++)cur+=cardPoints[i];
    int minSum=cur;
    for(int i=w;i<n;i++){cur+=cardPoints[i]-cardPoints[i-w];minSum=Math.min(minSum,cur);}
    return total-minSum;
}`,
  },
  defaultInput: { cardPoints: [1, 2, 3, 4, 5, 6, 1], k: 3 },
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
      label: 'k (cards to pick)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of cards to pick from ends',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const cardPoints = input.cardPoints as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = cardPoints.length;
    const total = cardPoints.reduce((a, b) => a + b, 0);
    const w = n - k;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, minSum: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...cardPoints],
        highlights,
        labels,
        auxData: {
          label: `Max Points from ${k} Cards`,
          entries: [
            { key: 'Total Sum', value: String(total) },
            { key: 'Window Size (skip)', value: String(w) },
            { key: 'Min Middle Sum', value: String(minSum) },
            { key: 'Max Score', value: String(total - minSum) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Pick k=${k} cards from ends. Total=${total}. Find min-sum middle window of size ${w}=${n}-${k}. Answer = ${total} - minMiddleSum.`,
      variables: { n, k, total, windowSize: w },
      visualization: makeViz({}, {}, 0),
    });

    if (w === 0) {
      steps.push({ line: 4, explanation: `k=n, take all cards. Score = total = ${total}.`, variables: { result: total }, visualization: makeViz({}, {}, 0) });
      return steps;
    }

    let cur = 0;
    for (let i = 0; i < w; i++) cur += cardPoints[i];
    let minSum = cur;

    const h0: Record<number, string> = {};
    const l0: Record<number, string> = {};
    for (let i = 0; i < w; i++) { h0[i] = 'active'; l0[i] = 'mid'; }
    steps.push({
      line: 5,
      explanation: `Initial window [0..${w - 1}] sum = ${cur}. This is our first candidate for minimum middle.`,
      variables: { windowSum: cur, minSum },
      visualization: makeViz(h0, l0, minSum),
    });

    for (let i = w; i < n; i++) {
      cur += cardPoints[i] - cardPoints[i - w];
      if (cur < minSum) minSum = cur;

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let j = i - w + 1; j <= i; j++) { h[j] = cur === minSum ? 'found' : 'pointer'; l[j] = 'mid'; }
      for (let j = 0; j < i - w + 1; j++) h[j] = 'visited';
      for (let j = i + 1; j < n; j++) h[j] = 'visited';

      steps.push({
        line: 8,
        explanation: `Slide window to [${i - w + 1}..${i}]. Sum = ${cur}. minSum = ${minSum}. Best score = ${total - minSum}.`,
        variables: { windowStart: i - w + 1, windowEnd: i, windowSum: cur, minSum, bestScore: total - minSum },
        visualization: makeViz(h, l, minSum),
      });
    }

    // Highlight the cards we pick (not in the min window)
    // Find min window position
    let minStart = 0;
    cur = 0;
    for (let i = 0; i < w; i++) cur += cardPoints[i];
    let minCur = cur;
    for (let i = w; i < n; i++) {
      cur += cardPoints[i] - cardPoints[i - w];
      if (cur < minCur) { minCur = cur; minStart = i - w + 1; }
    }
    const minEnd = minStart + w - 1;

    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      if (i >= minStart && i <= minEnd) { finalH[i] = 'mismatch'; finalL[i] = 'skip'; }
      else { finalH[i] = 'match'; finalL[i] = 'take'; }
    }
    steps.push({
      line: 10,
      explanation: `Min middle window [${minStart}..${minEnd}] sum=${minSum}. Pick all other cards. Max score = ${total} - ${minSum} = ${total - minSum}.`,
      variables: { result: total - minSum, minSum, minWindowStart: minStart, minWindowEnd: minEnd },
      visualization: makeViz(finalH, finalL, minSum),
    });

    return steps;
  },
};

export default maximumPointsFromCardsIi;
