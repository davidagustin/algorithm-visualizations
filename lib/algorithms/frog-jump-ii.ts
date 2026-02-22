import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const frogJumpII: AlgorithmDefinition = {
  id: 'frog-jump-ii',
  title: 'Frog Jump II',
  leetcodeNumber: 2498,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given sorted stone positions, a frog must jump forward and back exactly once touching each stone. Minimize the maximum jump length. Greedy insight: skip every other stone on the way forward (take stones 0, 2, 4, ...) and pick up the rest on the way back. The answer is max gap between every other stone.',
  tags: ['Dynamic Programming', 'Greedy', 'Binary Search'],
  code: {
    pseudocode: `function maxJump(stones):
  // Greedy: skip alternate stones
  // Answer = max(stones[i] - stones[i-2]) for i >= 2
  // Also check stones[1] - stones[0] (first jump)
  ans = stones[1] - stones[0]
  for i from 2 to n-1:
    ans = max(ans, stones[i] - stones[i-2])
  return ans`,
    python: `def maxJump(stones):
    ans = stones[1] - stones[0]
    for i in range(2, len(stones)):
        ans = max(ans, stones[i] - stones[i-2])
    return ans`,
    javascript: `function maxJump(stones) {
  let ans = stones[1] - stones[0];
  for (let i = 2; i < stones.length; i++) {
    ans = Math.max(ans, stones[i] - stones[i-2]);
  }
  return ans;
}`,
    java: `public int maxJump(int[] stones) {
    int ans = stones[1] - stones[0];
    for (int i = 2; i < stones.length; i++)
        ans = Math.max(ans, stones[i] - stones[i-2]);
    return ans;
}`,
  },
  defaultInput: { stones: [0, 2, 5, 6, 7] },
  inputFields: [
    {
      name: 'stones',
      label: 'Stone Positions',
      type: 'array',
      defaultValue: [0, 2, 5, 6, 7],
      placeholder: '0,2,5,6,7',
      helperText: 'Sorted positions of stones in the river',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stones = input.stones as number[];
    const n = stones.length;
    const steps: AlgorithmStep[] = [];

    // dp[i] = max jump needed if we consider stones up to i, skipping alternately
    const dp: (number | null)[] = new Array(n).fill(null);
    dp[0] = 0;
    dp[1] = stones[1] - stones[0];
    let ans = stones[1] - stones[0];
    const labels: string[] = stones.map(s => `s=${s}`);

    function makeViz(activeIdx: number): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        if (i === activeIdx) highlights[i] = 'active';
        else if (dp[i] !== null) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Stones: [${stones.join(',')}]. Greedy: alternate stones on the go-trip (0,2,4,...) and return-trip (1,3,5,...). Max gap between alternate stones = answer.`,
      variables: { stones, n },
      visualization: makeViz(-1),
    });

    steps.push({
      line: 4,
      explanation: `Initial ans = stones[1]-stones[0] = ${stones[1]}-${stones[0]} = ${ans}. First jump from 0 to 1.`,
      variables: { ans, 'stones[1]-stones[0]': ans },
      visualization: makeViz(1),
    });

    for (let i = 2; i < n; i++) {
      const gap = stones[i] - stones[i - 2];
      dp[i] = gap;
      if (gap > ans) ans = gap;

      steps.push({
        line: 5,
        explanation: `i=${i}: gap = stones[${i}]-stones[${i-2}] = ${stones[i]}-${stones[i-2]} = ${gap}. ans = max(${ans}, ${gap}) = ${ans}.`,
        variables: { i, gap, ans },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 7,
      explanation: `Answer = ${ans}. Minimum possible maximum jump in a round trip touching all stones.`,
      variables: { result: ans },
      visualization: makeViz(n - 1),
    });

    return steps;
  },
};

export default frogJumpII;
