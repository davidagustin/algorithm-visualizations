import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const freedomTrailDp: AlgorithmDefinition = {
  id: 'freedom-trail-dp',
  title: 'Freedom Trail (DP)',
  leetcodeNumber: 514,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'A ring displays characters and you rotate it to align with a key pointer, then press to spell a keyword character by character. Find the minimum steps (rotations + button presses). Uses DP: dp[i][j] = min steps to spell key[i..] when ring is currently at position j. Precompute positions of each character.',
  tags: ['dynamic programming', 'string', 'bfs', 'greedy'],

  code: {
    pseudocode: `function findRotateSteps(ring, key):
  n = len(ring), m = len(key)
  positions = {char -> [list of indices in ring]}
  dp[i][j] = min steps to finish key[i:] starting at ring pos j
  // Fill backwards from m-1 to 0
  for i from m-1 downto 0:
    for j from 0 to n-1:
      dp[i][j] = infinity
      for pos in positions[key[i]]:
        dist = min(|j-pos|, n-|j-pos|)
        steps = dist + 1 + (dp[i+1][pos] if i+1 < m else 0)
        dp[i][j] = min(dp[i][j], steps)
  return dp[0][0]`,
    python: `def findRotateSteps(ring: str, key: str) -> int:
    from collections import defaultdict
    n, m = len(ring), len(key)
    pos = defaultdict(list)
    for i, c in enumerate(ring):
        pos[c].append(i)
    dp = [[0]*n for _ in range(m+1)]
    for i in range(m-1, -1, -1):
        for j in range(n):
            dp[i][j] = float('inf')
            for k in pos[key[i]]:
                dist = min(abs(j-k), n-abs(j-k))
                dp[i][j] = min(dp[i][j], dist+1+dp[i+1][k])
    return dp[0][0]`,
    javascript: `function findRotateSteps(ring, key) {
  const n = ring.length, m = key.length;
  const pos = {};
  for (let i=0;i<n;i++) {
    if (!pos[ring[i]]) pos[ring[i]]=[];
    pos[ring[i]].push(i);
  }
  const dp = Array.from({length:m+1},()=>new Array(n).fill(0));
  for (let i=m-1;i>=0;i--)
    for (let j=0;j<n;j++) {
      dp[i][j]=Infinity;
      for (const k of pos[key[i]]) {
        const dist=Math.min(Math.abs(j-k),n-Math.abs(j-k));
        dp[i][j]=Math.min(dp[i][j],dist+1+dp[i+1][k]);
      }
    }
  return dp[0][0];
}`,
    java: `public int findRotateSteps(String ring, String key) {
    int n=ring.length(), m=key.length();
    Map<Character,List<Integer>> pos=new HashMap<>();
    for (int i=0;i<n;i++) pos.computeIfAbsent(ring.charAt(i),x->new ArrayList<>()).add(i);
    int[][] dp=new int[m+1][n];
    for (int i=m-1;i>=0;i--)
        for (int j=0;j<n;j++) {
            dp[i][j]=Integer.MAX_VALUE/2;
            for (int k: pos.get(key.charAt(i))) {
                int dist=Math.min(Math.abs(j-k),n-Math.abs(j-k));
                dp[i][j]=Math.min(dp[i][j],dist+1+dp[i+1][k]);
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
      label: 'Ring',
      type: 'string',
      defaultValue: 'godding',
      placeholder: 'godding',
      helperText: 'Characters on the ring',
    },
    {
      name: 'key',
      label: 'Key (word to spell)',
      type: 'string',
      defaultValue: 'gd',
      placeholder: 'gd',
      helperText: 'Word to spell by rotating the ring',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const ring = input.ring as string;
    const key = input.key as string;
    const steps: AlgorithmStep[] = [];
    const n = ring.length;
    const m = key.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: ring.split('').map((c: string) => c.charCodeAt(0) - 96),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Freedom Trail: ring="${ring}", key="${key}". Find min rotations + presses to spell "${key}".`,
      variables: { ringLen: n, keyLen: m },
      visualization: makeViz({ 0: 'active' }, { 0: 'start' }),
    });

    // Build positions map
    const pos: Record<string, number[]> = {};
    for (let i = 0; i < n; i++) {
      if (!pos[ring[i]]) pos[ring[i]] = [];
      pos[ring[i]].push(i);
    }

    steps.push({
      line: 3,
      explanation: `Position map: ${Object.entries(pos).map(([c, ps]) => `'${c}'->[${ps.join(',')}]`).join(', ')}. Multiple occurrences give options.`,
      variables: Object.fromEntries(Object.entries(pos).map(([c, ps]) => [c, ps.join(',')])),
      visualization: makeViz(
        Object.fromEntries(ring.split('').map((_, i) => [i, 'comparing'])),
        Object.fromEntries(ring.split('').map((c, i) => [i, c]))
      ),
    });

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n).fill(0));

    for (let i = m - 1; i >= 0; i--) {
      for (let j = 0; j < n; j++) {
        dp[i][j] = Infinity;
        for (const k of pos[key[i]] || []) {
          const dist = Math.min(Math.abs(j - k), n - Math.abs(j - k));
          const val = dist + 1 + dp[i + 1][k];
          if (val < dp[i][j]) dp[i][j] = val;
        }
      }

      const charPositions = pos[key[i]] || [];
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      charPositions.forEach((p: number) => {
        highlights[p] = 'found';
        labels[p] = `'${key[i]}'`;
      });

      steps.push({
        line: 7,
        explanation: `Spelling key[${i}]="${key[i]}": found at ring positions [${charPositions.join(',')}]. dp[${i}][0]=${dp[i][0]} steps starting from pos 0.`,
        variables: { keyChar: key[i], positions: charPositions.join(','), 'dp[i][0]': dp[i][0] },
        visualization: makeViz(highlights, labels),
      });
    }

    steps.push({
      line: 9,
      explanation: `dp[0][0]=${dp[0][0]}. Minimum total steps (rotations + presses) to spell "${key}" starting at ring position 0.`,
      variables: { result: dp[0][0], key, ring },
      visualization: makeViz(
        { 0: 'found', ...(pos[key[0]] || []).reduce((acc: Record<number, string>, p: number) => ({ ...acc, [p]: 'active' }), {}) },
        { 0: `ans:${dp[0][0]}` }
      ),
    });

    return steps;
  },
};

export default freedomTrailDp;
