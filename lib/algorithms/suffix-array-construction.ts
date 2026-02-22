import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const suffixArrayConstruction: AlgorithmDefinition = {
  id: 'suffix-array-construction',
  title: 'Suffix Array Construction',
  difficulty: 'Hard',
  category: 'String',
  description:
    'A suffix array is a sorted array of all suffixes of a string. Naive O(n^2 log n) construction: generate all suffixes, sort them lexicographically, record starting indices. Enables O(m log n) pattern search.',
  tags: ['string', 'suffix array', 'sorting', 'advanced'],
  code: {
    pseudocode: `function buildSuffixArray(s):
  suffixes = [(s[i:], i) for i in 0..len(s)-1]
  suffixes.sort()
  return [i for (_, i) in suffixes]

function search(s, sa, pattern):
  lo, hi = 0, len(sa)-1
  while lo <= hi:
    mid = (lo+hi)//2
    suffix = s[sa[mid]:]
    if suffix starts with pattern: return sa[mid]
    elif pattern < suffix: hi = mid-1
    else: lo = mid+1
  return -1`,
    python: `def buildSuffixArray(s):
    suffixes = sorted(range(len(s)), key=lambda i: s[i:])
    return suffixes

def search(s, sa, pattern):
    lo, hi = 0, len(sa) - 1
    m = len(pattern)
    while lo <= hi:
        mid = (lo + hi) // 2
        suffix = s[sa[mid]:sa[mid] + m]
        if suffix == pattern:
            return sa[mid]
        elif pattern < suffix:
            hi = mid - 1
        else:
            lo = mid + 1
    return -1`,
    javascript: `function buildSuffixArray(s) {
  return [...Array(s.length).keys()].sort((a, b) =>
    s.slice(a) < s.slice(b) ? -1 : s.slice(a) > s.slice(b) ? 1 : 0
  );
}

function search(s, sa, pattern) {
  let lo = 0, hi = sa.length - 1;
  const m = pattern.length;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const suffix = s.slice(sa[mid], sa[mid] + m);
    if (suffix === pattern) return sa[mid];
    else if (pattern < suffix) hi = mid - 1;
    else lo = mid + 1;
  }
  return -1;
}`,
    java: `public int[] buildSuffixArray(String s) {
    Integer[] sa = new Integer[s.length()];
    for (int i = 0; i < s.length(); i++) sa[i] = i;
    Arrays.sort(sa, (a, b) -> s.substring(a).compareTo(s.substring(b)));
    return Arrays.stream(sa).mapToInt(Integer::intValue).toArray();
}`,
  },
  defaultInput: { s: 'banana' },
  inputFields: [
    { name: 's', label: 'String', type: 'string', defaultValue: 'banana', placeholder: 'banana', helperText: 'String to build suffix array for' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const n = s.length;
    const steps: AlgorithmStep[] = [];

    const suffixes = Array.from({ length: n }, (_, i) => ({ suffix: s.slice(i), idx: i }));

    const makeViz = (highlighted: number[], sortedSA: number[]): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      highlighted.forEach(i => { highlights[i] = 'active'; });
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = s[x];
      return {
        type: 'array',
        array: sortedSA.length > 0 ? sortedSA : Array.from({ length: n }, (_, x) => x),
        highlights,
        labels,
        auxData: {
          label: 'Suffix Array',
          entries: sortedSA.map((idx, rank) => ({ key: `SA[${rank}]`, value: `${idx}: "${s.slice(idx)}"` })),
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Building suffix array for "${s}". ${n} suffixes to sort lexicographically.`,
      variables: { s, n },
      visualization: makeViz([], []),
    });

    suffixes.forEach(({ suffix, idx }) => {
      steps.push({
        line: 2,
        explanation: `Suffix at index ${idx}: "${suffix}"`,
        variables: { index: idx, suffix },
        visualization: makeViz([idx], []),
      });
    });

    suffixes.sort((a, b) => a.suffix < b.suffix ? -1 : a.suffix > b.suffix ? 1 : 0);
    const sa = suffixes.map(x => x.idx);

    steps.push({
      line: 3,
      explanation: `Suffixes sorted lexicographically. Suffix array: [${sa.join(', ')}].`,
      variables: { suffixArray: [...sa] },
      visualization: makeViz([], [...sa]),
    });

    suffixes.forEach(({ suffix, idx }, rank) => {
      steps.push({
        line: 4,
        explanation: `Rank ${rank}: SA[${rank}]=${idx}, suffix="${suffix}"`,
        variables: { rank, startIdx: idx, suffix },
        visualization: makeViz([idx], [...sa]),
      });
    });

    steps.push({
      line: 5,
      explanation: `Suffix array complete: [${sa.join(', ')}]. Enables O(m log n) pattern search via binary search.`,
      variables: { suffixArray: [...sa] },
      visualization: makeViz([], [...sa]),
    });

    return steps;
  },
};

export default suffixArrayConstruction;
