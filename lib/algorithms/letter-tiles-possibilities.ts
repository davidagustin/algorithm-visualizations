import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const letterTilesPossibilities: AlgorithmDefinition = {
  id: 'letter-tiles-possibilities',
  title: 'Letter Tile Possibilities',
  leetcodeNumber: 1079,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'You have a set of tiles, where each tile has one letter on it. Return the number of possible non-empty sequences of letters you can make using the letters printed on those tiles. Use backtracking with character frequency counts to enumerate all distinct sequences.',
  tags: ['backtracking', 'hash map', 'counting', 'string'],

  code: {
    pseudocode: `function numTilePossibilities(tiles):
  count = frequency map of tiles
  function backtrack():
    total = 0
    for each char c in count:
      if count[c] > 0:
        total += 1  // using c alone as a sequence
        count[c] -= 1
        total += backtrack()  // extend sequence with more chars
        count[c] += 1
    return total
  return backtrack()`,
    python: `def numTilePossibilities(tiles: str) -> int:
    count = Counter(tiles)
    def bt():
        total = 0
        for c in count:
            if count[c] > 0:
                total += 1
                count[c] -= 1
                total += bt()
                count[c] += 1
        return total
    return bt()`,
    javascript: `function numTilePossibilities(tiles) {
  const count = {};
  for (const c of tiles) count[c] = (count[c] || 0) + 1;
  function bt() {
    let total = 0;
    for (const c in count) {
      if (count[c] > 0) {
        total++;
        count[c]--;
        total += bt();
        count[c]++;
      }
    }
    return total;
  }
  return bt();
}`,
    java: `public int numTilePossibilities(String tiles) {
    int[] count = new int[26];
    for (char c : tiles.toCharArray()) count[c - 'A']++;
    return backtrack(count);
}
private int backtrack(int[] count) {
    int total = 0;
    for (int i = 0; i < 26; i++) {
        if (count[i] > 0) {
            total++;
            count[i]--;
            total += backtrack(count);
            count[i]++;
        }
    }
    return total;
}`,
  },

  defaultInput: { tiles: 'AAB' },

  inputFields: [
    {
      name: 'tiles',
      label: 'Tiles String',
      type: 'string',
      defaultValue: 'AAB',
      placeholder: 'AAB',
      helperText: 'Letters on the tiles',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tiles = input.tiles as string;
    const steps: AlgorithmStep[] = [];

    const count: Record<string, number> = {};
    for (const c of tiles) count[c] = (count[c] || 0) + 1;

    const chars = Object.keys(count).sort();
    const countArray = (): number[] => chars.map(c => count[c]);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: countArray(),
      highlights,
      labels,
    });

    const charLabels = (): Record<number, string> => Object.fromEntries(chars.map((c, i) => [i, `${c}:${count[c]}`]));

    steps.push({
      line: 1,
      explanation: `Count tile frequencies for "${tiles}". Array shows count per unique letter. Backtrack to enumerate all non-empty sequences.`,
      variables: { tiles, frequencies: { ...count } },
      visualization: makeViz({}, charLabels()),
    });

    let totalSequences = 0;

    function backtrack(depth: number): number {
      let total = 0;
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        if (count[c] > 0) {
          total++;
          totalSequences++;
          count[c]--;

          if (steps.length < 30) {
            const h: Record<number, string> = {};
            h[i] = 'active';
            steps.push({
              line: 5,
              explanation: `Use letter "${c}" (depth ${depth}): adds 1 sequence. Remaining "${c}": ${count[c]}. Running total: ${totalSequences}.`,
              variables: { letter: c, depth, remaining: count[c], runningTotal: totalSequences },
              visualization: makeViz(h, charLabels()),
            });
          }

          total += backtrack(depth + 1);
          count[c]++;

          if (steps.length < 35) {
            const h: Record<number, string> = {};
            h[i] = 'visited';
            steps.push({
              line: 8,
              explanation: `Restore letter "${c}" count to ${count[c]} after exploring sequences starting with it.`,
              variables: { letter: c, restoredCount: count[c] },
              visualization: makeViz(h, charLabels()),
            });
          }
        }
      }
      return total;
    }

    const result = backtrack(1);

    steps.push({
      line: 10,
      explanation: `All tile sequences explored. Total distinct non-empty sequences: ${result}.`,
      variables: { totalPossibilities: result },
      visualization: makeViz({}, charLabels()),
    });

    return steps;
  },
};

export default letterTilesPossibilities;
