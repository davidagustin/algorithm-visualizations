import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumDeletionsToMakeCharacterFrequenciesUnique: AlgorithmDefinition = {
  id: 'minimum-deletions-to-make-character-frequencies-unique',
  title: 'Minimum Deletions to Make Character Frequencies Unique',
  leetcodeNumber: 1647,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given a string, find the minimum number of character deletions so that no two distinct characters have the same frequency. Sort frequencies descending; if a frequency is already taken, reduce it by 1 (and repeat until it finds a free slot or reaches 0).',
  tags: ['greedy', 'hash map', 'sorting', 'string'],

  code: {
    pseudocode: `function minDeletions(s):
  freq = count character frequencies
  sort freq descending
  used = empty set
  deletions = 0
  for each f in freq:
    while f > 0 and f in used:
      f -= 1
      deletions += 1
    if f > 0: used.add(f)
  return deletions`,

    python: `def minDeletions(s: str) -> int:
    from collections import Counter
    freq = sorted(Counter(s).values(), reverse=True)
    used = set()
    deletions = 0
    for f in freq:
        while f > 0 and f in used:
            f -= 1
            deletions += 1
        if f > 0:
            used.add(f)
    return deletions`,

    javascript: `function minDeletions(s) {
  const freq = {};
  for (const c of s) freq[c] = (freq[c] || 0) + 1;
  const counts = Object.values(freq).sort((a, b) => b - a);
  const used = new Set();
  let deletions = 0;
  for (let f of counts) {
    while (f > 0 && used.has(f)) { f--; deletions++; }
    if (f > 0) used.add(f);
  }
  return deletions;
}`,

    java: `public int minDeletions(String s) {
    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c - 'a']++;
    Arrays.sort(freq);
    Set<Integer> used = new HashSet<>();
    int deletions = 0;
    for (int i = 25; i >= 0; i--) {
        int f = freq[i];
        while (f > 0 && used.contains(f)) { f--; deletions++; }
        if (f > 0) used.add(f);
    }
    return deletions;
}`,
  },

  defaultInput: {
    s: 'aab',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'aab',
      placeholder: 'aab',
      helperText: 'Input string of lowercase letters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    const freq: Record<string, number> = {};
    for (const c of s) freq[c] = (freq[c] || 0) + 1;

    const freqStr = Object.entries(freq).map(([k, v]) => k + ':' + v).join(', ');
    const counts = Object.values(freq).sort((a, b) => b - a);

    steps.push({
      line: 1,
      explanation: `Count frequencies: {${freqStr}}. Sorted descending: [${counts.join(', ')}].`,
      variables: { freq: freqStr, sortedFreq: counts.join(',') },
      visualization: {
        type: 'array',
        array: counts,
        highlights: Object.fromEntries(counts.map((_, i) => [i, 'active'])),
        labels: {},
      },
    });

    const used = new Set<number>();
    let deletions = 0;
    const resultCounts: number[] = [];

    for (let ci = 0; ci < counts.length; ci++) {
      let f = counts[ci];
      const orig = f;

      steps.push({
        line: 5,
        explanation: `Process frequency ${f}. Check if ${f} is already used: ${used.has(f) ? 'YES, must reduce.' : 'NO, claim it.'}`,
        variables: { frequency: f, used: Array.from(used).join(','), deletions },
        visualization: {
          type: 'array',
          array: counts,
          highlights: { [ci]: 'active' },
          labels: { [ci]: 'f=' + f },
        },
      });

      while (f > 0 && used.has(f)) {
        f--;
        deletions++;

        steps.push({
          line: 7,
          explanation: `Frequency ${f + 1} already taken. Reduce to ${f} (1 deletion). Total deletions=${deletions}.`,
          variables: { frequency: f, deletions },
          visualization: {
            type: 'array',
            array: counts,
            highlights: { [ci]: 'mismatch' },
            labels: { [ci]: 'reduce->' + f },
          },
        });
      }

      if (f > 0) {
        used.add(f);
        resultCounts.push(f);

        steps.push({
          line: 9,
          explanation: `Claim frequency ${f} (was ${orig}, deleted ${orig - f} chars). used={${Array.from(used).join(',')}}.`,
          variables: { claimed: f, deletedForThis: orig - f, totalDeletions: deletions },
          visualization: {
            type: 'array',
            array: [...resultCounts],
            highlights: { [resultCounts.length - 1]: 'found' },
            labels: { [resultCounts.length - 1]: 'freq:' + f },
          },
        });
      } else {
        resultCounts.push(0);
        steps.push({
          line: 9,
          explanation: `Frequency reduced to 0 (deleted all ${orig} chars). No frequency claimed.`,
          variables: { deletedForThis: orig, totalDeletions: deletions },
          visualization: {
            type: 'array',
            array: counts,
            highlights: { [ci]: 'mismatch' },
            labels: { [ci]: 'zeroed' },
          },
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `All frequencies processed. Minimum deletions required = ${deletions}.`,
      variables: { result: deletions },
      visualization: {
        type: 'array',
        array: [...resultCounts],
        highlights: Object.fromEntries(resultCounts.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default minimumDeletionsToMakeCharacterFrequenciesUnique;
