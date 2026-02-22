import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const freedomTrail: AlgorithmDefinition = {
  id: 'freedom-trail',
  title: 'Freedom Trail',
  leetcodeNumber: 514,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a circular ring of characters and a key string, find the minimum number of steps (rotations + button presses) to spell the key. At each step, rotate the ring clockwise or counterclockwise to align a character with 12 o clock, then press the button. Uses DP where dp[i][j] = min steps to spell key[i..] when ring[j] is currently aligned.',
  tags: ['dynamic programming', 'depth-first search', 'string'],

  code: {
    pseudocode: `function findRotateSteps(ring, key):
  pos = map char -> list of indices in ring
  n, m = len(ring), len(key)
  dp = 2D array (m+1) x n, initialized to INF
  dp[m][0] = 0  // base case
  for i from m-1 down to 0:
    for j in 0..n-1:
      for each idx where ring[idx] == key[i]:
        dist = min(|j-idx|, n-|j-idx|)  // clockwise or counter
        dp[i][j] = min(dp[i][j], dist + 1 + dp[i+1][idx])
  return dp[0][0]`,

    python: `def findRotateSteps(ring, key):
    from collections import defaultdict
    pos = defaultdict(list)
    for i, c in enumerate(ring):
        pos[c].append(i)
    n, m = len(ring), len(key)
    dp = [[float('inf')]*(n) for _ in range(m+1)]
    dp[m][0] = 0
    for i in range(m-1, -1, -1):
        for j in range(n):
            for idx in pos[key[i]]:
                diff = abs(j - idx)
                dist = min(diff, n - diff)
                dp[i][j] = min(dp[i][j], dist + 1 + dp[i+1][idx])
    return dp[0][0]`,

    javascript: `function findRotateSteps(ring, key) {
  const n = ring.length, m = key.length;
  const pos = {};
  for (let i = 0; i < n; i++) {
    (pos[ring[i]] = pos[ring[i]] || []).push(i);
  }
  const INF = Infinity;
  const dp = Array.from({length: m+1}, () => new Array(n).fill(INF));
  dp[m][0] = 0;
  for (let i = m-1; i >= 0; i--) {
    for (let j = 0; j < n; j++) {
      for (const idx of (pos[key[i]] || [])) {
        const diff = Math.abs(j - idx);
        const dist = Math.min(diff, n - diff);
        dp[i][j] = Math.min(dp[i][j], dist + 1 + dp[i+1][idx]);
      }
    }
  }
  return dp[0][0];
}`,

    java: `public int findRotateSteps(String ring, String key) {
    int n = ring.length(), m = key.length();
    Map<Character, List<Integer>> pos = new HashMap<>();
    for (int i = 0; i < n; i++) pos.computeIfAbsent(ring.charAt(i), x -> new ArrayList<>()).add(i);
    int[][] dp = new int[m+1][n];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE/2);
    dp[m][0] = 0;
    for (int i = m-1; i >= 0; i--) for (int j = 0; j < n; j++) {
        for (int idx : pos.get(key.charAt(i))) {
            int diff = Math.abs(j - idx);
            dp[i][j] = Math.min(dp[i][j], Math.min(diff, n-diff) + 1 + dp[i+1][idx]);
        }
    }
    return dp[0][0];
}`,
  },

  defaultInput: {
    ring: 'godding',
    key: 'gd',
  },

  inputFields: [
    {
      name: 'ring',
      label: 'Ring String',
      type: 'string',
      defaultValue: 'godding',
      placeholder: 'godding',
      helperText: 'Characters on the circular ring',
    },
    {
      name: 'key',
      label: 'Key to Spell',
      type: 'string',
      defaultValue: 'gd',
      placeholder: 'gd',
      helperText: 'String to spell using the ring',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const ring = input.ring as string;
    const key = input.key as string;
    const steps: AlgorithmStep[] = [];
    const n = ring.length;
    const m = key.length;

    const pos: Record<string, number[]> = {};
    for (let i = 0; i < n; i++) {
      if (!pos[ring[i]]) pos[ring[i]] = [];
      pos[ring[i]].push(i);
    }

    const INF = 1e9;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n).fill(INF));
    dp[m][0] = 0;

    steps.push({
      line: 1,
      explanation: `Ring: "${ring}", Key: "${key}". DP state dp[i][j] = min steps to spell key[i..] when ring[j] is at 12 o clock. Base: dp[${m}][0]=0.`,
      variables: { ring, key, ringLen: n, keyLen: m },
      visualization: {
        type: 'array',
        array: ring.split('').map((c, i) => i),
        highlights: Object.fromEntries(ring.split('').map((_, i) => [i, 'default'])),
        labels: Object.fromEntries(ring.split('').map((c, i) => [i, c])),
      },
    });

    for (let i = m - 1; i >= 0; i--) {
      for (let j = 0; j < n; j++) {
        for (const idx of pos[key[i]] || []) {
          const diff = Math.abs(j - idx);
          const dist = Math.min(diff, n - diff);
          dp[i][j] = Math.min(dp[i][j], dist + 1 + dp[i + 1][idx]);
        }
      }

      if (i >= m - 3) {
        const rowVals = dp[i].map(v => v === INF ? 'INF' : v);
        steps.push({
          line: 8,
          explanation: `Computed dp[${i}][*] for key char "${key[i]}". Positions of "${key[i]}" in ring: [${(pos[key[i]] || []).join(', ')}]. dp[${i}] = [${rowVals.join(', ')}].`,
          variables: { keyIndex: i, keyChar: key[i], dpRow: rowVals },
          visualization: {
            type: 'array',
            array: ring.split('').map((_, idx) => dp[i][idx] === INF ? -1 : dp[i][idx]),
            highlights: Object.fromEntries(
              ring.split('').map((c, idx) => [idx, c === key[i] ? 'found' : 'default'])
            ),
            labels: Object.fromEntries(ring.split('').map((c, idx) => [idx, c])),
          },
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Minimum steps to spell "${key}" using ring "${ring}" is ${dp[0][0]} (starting at ring position 0, character "${ring[0]}").`,
      variables: { answer: dp[0][0] },
      visualization: {
        type: 'array',
        array: ring.split('').map((_, i) => i === 0 ? dp[0][0] : dp[0][i] === INF ? -1 : dp[0][i]),
        highlights: { 0: 'found' },
        labels: Object.fromEntries(ring.split('').map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default freedomTrail;
