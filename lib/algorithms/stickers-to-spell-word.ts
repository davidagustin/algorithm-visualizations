import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const stickersToSpellWord: AlgorithmDefinition = {
  id: 'stickers-to-spell-word',
  title: 'Stickers to Spell Word',
  leetcodeNumber: 691,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given sticker strings and a target word, find the minimum number of stickers to spell the target. Uses bitmask DP where each bit represents whether a character in target has been covered. dp[mask] = min stickers to cover characters indicated by mask.',
  tags: ['Dynamic Programming', 'Bitmask', 'BFS', 'Bit Manipulation'],
  code: {
    pseudocode: `function minStickers(stickers, target):
  n = length(target)
  dp = array of size 2^n, fill INF
  dp[0] = 0
  for mask from 0 to 2^n - 1:
    if dp[mask] == INF: continue
    for each sticker:
      cur = mask
      for each char c in sticker:
        for each uncovered bit i in cur:
          if target[i] == c:
            cur |= (1 << i)
            break
      dp[cur] = min(dp[cur], dp[mask] + 1)
  return dp[(1<<n)-1] == INF ? -1 : dp[(1<<n)-1]`,
    python: `def minStickers(stickers, target):
    n = len(target)
    dp = [float('inf')] * (1 << n)
    dp[0] = 0
    for mask in range(1 << n):
        if dp[mask] == float('inf'):
            continue
        for sticker in stickers:
            cur = mask
            for c in sticker:
                for i in range(n):
                    if not (cur >> i & 1) and target[i] == c:
                        cur |= 1 << i
                        break
            dp[cur] = min(dp[cur], dp[mask] + 1)
    ans = dp[(1 << n) - 1]
    return ans if ans < float('inf') else -1`,
    javascript: `function minStickers(stickers, target) {
  const n = target.length;
  const dp = new Array(1 << n).fill(Infinity);
  dp[0] = 0;
  for (let mask = 0; mask < (1 << n); mask++) {
    if (dp[mask] === Infinity) continue;
    for (const sticker of stickers) {
      let cur = mask;
      for (const c of sticker) {
        for (let i = 0; i < n; i++) {
          if (!(cur >> i & 1) && target[i] === c) {
            cur |= 1 << i;
            break;
          }
        }
      }
      dp[cur] = Math.min(dp[cur], dp[mask] + 1);
    }
  }
  return dp[(1 << n) - 1] === Infinity ? -1 : dp[(1 << n) - 1];
}`,
    java: `public int minStickers(String[] stickers, String target) {
    int n = target.length();
    int[] dp = new int[1 << n];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        if (dp[mask] == Integer.MAX_VALUE) continue;
        for (String sticker : stickers) {
            int cur = mask;
            for (char c : sticker.toCharArray()) {
                for (int i = 0; i < n; i++) {
                    if ((cur >> i & 1) == 0 && target.charAt(i) == c) {
                        cur |= 1 << i; break;
                    }
                }
            }
            if (dp[mask] + 1 < dp[cur]) dp[cur] = dp[mask] + 1;
        }
    }
    return dp[(1 << n) - 1] == Integer.MAX_VALUE ? -1 : dp[(1 << n) - 1];
}`,
  },
  defaultInput: { stickers: ['with', 'example', 'science'], target: 'thehat' },
  inputFields: [
    {
      name: 'stickers',
      label: 'Stickers',
      type: 'array',
      defaultValue: ['with', 'example', 'science'],
      placeholder: 'with,example,science',
      helperText: 'Array of sticker strings',
    },
    {
      name: 'target',
      label: 'Target Word',
      type: 'string',
      defaultValue: 'thehat',
      placeholder: 'thehat',
      helperText: 'Word to spell (keep short, max 5 chars)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stickers = input.stickers as string[];
    const target = ((input.target as string) || 'the').slice(0, 5);
    const n = target.length;
    const size = 1 << n;
    const INF = 99999;
    const dp: (number | null)[] = new Array(size).fill(INF);
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(n, '0')
    );
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null, prevIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let m = 0; m < size; m++) {
        if ((dp[m] as number) < INF) highlights[m] = 'found';
      }
      if (prevIdx !== null) highlights[prevIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.map(v => (v as number) >= INF ? null : v), highlights, labels };
    }

    dp[0] = 0;
    steps.push({
      line: 1,
      explanation: `target="${target}" (n=${n}). dp[mask]=min stickers to cover letters at set bits. dp[0]=0.`,
      variables: { target, n, stickers },
      visualization: makeViz(0, null),
    });

    for (let mask = 0; mask < size; mask++) {
      if ((dp[mask] as number) >= INF) continue;
      for (const sticker of stickers.slice(0, 3)) {
        let cur = mask;
        for (const c of sticker) {
          for (let i = 0; i < n; i++) {
            if (!(cur >> i & 1) && target[i] === c) {
              cur |= 1 << i;
              break;
            }
          }
        }
        if ((dp[mask] as number) + 1 < (dp[cur] as number)) {
          dp[cur] = (dp[mask] as number) + 1;
          steps.push({
            line: 10,
            explanation: `mask=${mask.toString(2).padStart(n,'0')}, sticker="${sticker}": covers->cur=${cur.toString(2).padStart(n,'0')}. dp[cur]=${dp[cur]}.`,
            variables: { mask, sticker, cur, 'dp[cur]': dp[cur] },
            visualization: makeViz(cur, mask),
          });
        }
      }
    }

    const fullMask = size - 1;
    const ans = (dp[fullMask] as number) >= INF ? -1 : dp[fullMask];
    steps.push({
      line: 13,
      explanation: `dp[${fullMask.toString(2).padStart(n,'0')}]=${dp[fullMask]}. Minimum stickers needed: ${ans}.`,
      variables: { result: ans },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default stickersToSpellWord;
