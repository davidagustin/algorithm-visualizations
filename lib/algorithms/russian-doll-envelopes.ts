import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const russianDollEnvelopes: AlgorithmDefinition = {
  id: 'russian-doll-envelopes',
  title: 'Russian Doll Envelopes',
  leetcodeNumber: 354,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Given envelopes with width and height, find the maximum number you can nest (each must be strictly larger in both dimensions). Sort by width ascending, height descending for same width, then find Longest Increasing Subsequence on heights using binary search (patience sorting).',
  tags: ['binary search', 'dynamic programming', 'LIS', 'sorting'],

  code: {
    pseudocode: `function maxEnvelopes(envelopes):
  sort by width asc, height desc for same width
  tails = []
  for each [w, h] in envelopes:
    pos = bisect_left(tails, h)
    if pos == len(tails):
      tails.append(h)
    else:
      tails[pos] = h
  return len(tails)`,
    python: `import bisect
def maxEnvelopes(envelopes: list[list[int]]) -> int:
    envelopes.sort(key=lambda x: (x[0], -x[1]))
    tails = []
    for _, h in envelopes:
        pos = bisect.bisect_left(tails, h)
        if pos == len(tails):
            tails.append(h)
        else:
            tails[pos] = h
    return len(tails)`,
    javascript: `function maxEnvelopes(envelopes) {
  envelopes.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const tails = [];
  for (const [, h] of envelopes) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < h) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = h;
  }
  return tails.length;
}`,
    java: `public int maxEnvelopes(int[][] envelopes) {
    Arrays.sort(envelopes, (a, b) -> a[0] == b[0] ? b[1] - a[1] : a[0] - b[0]);
    int[] tails = new int[envelopes.length];
    int size = 0;
    for (int[] e : envelopes) {
        int h = e[1], lo = 0, hi = size;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (tails[mid] < h) lo = mid + 1; else hi = mid;
        }
        tails[lo] = h;
        if (lo == size) size++;
    }
    return size;
}`,
  },

  defaultInput: {
    widths: [5, 4, 6, 2, 3],
    heights: [4, 6, 4, 2, 3],
  },

  inputFields: [
    {
      name: 'widths',
      label: 'Widths',
      type: 'array',
      defaultValue: [5, 4, 6, 2, 3],
      placeholder: '5,4,6,2,3',
      helperText: 'Envelope widths',
    },
    {
      name: 'heights',
      label: 'Heights',
      type: 'array',
      defaultValue: [4, 6, 4, 2, 3],
      placeholder: '4,6,4,2,3',
      helperText: 'Envelope heights (paired with widths)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const widths = input.widths as number[];
    const heights = input.heights as number[];
    const steps: AlgorithmStep[] = [];

    const envelopes = widths.map((w, i) => [w, heights[i]]);

    steps.push({
      line: 1,
      explanation: `Sort ${envelopes.length} envelopes by width ascending, height descending for same width.`,
      variables: { count: envelopes.length },
      visualization: {
        type: 'array',
        array: [...widths],
        highlights: {},
        labels: widths.reduce((acc, _, i) => ({ ...acc, [i]: `h${heights[i]}` }), {}),
      },
    });

    envelopes.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    const sortedHeights = envelopes.map(e => e[1]);

    steps.push({
      line: 2,
      explanation: `After sorting, heights sequence for LIS: [${sortedHeights.join(', ')}].`,
      variables: { sortedHeights: sortedHeights.join(',') },
      visualization: {
        type: 'array',
        array: [...sortedHeights],
        highlights: {},
        labels: {},
      },
    });

    const tails: number[] = [];

    for (let k = 0; k < sortedHeights.length; k++) {
      const h = sortedHeights[k];
      let lo = 0;
      let hi = tails.length;

      steps.push({
        line: 4,
        explanation: `Process height h=${h}. Binary search in tails=[${tails.join(', ')}] for insertion point.`,
        variables: { h, tails: tails.join(','), lo, hi },
        visualization: {
          type: 'array',
          array: [...sortedHeights],
          highlights: { [k]: 'active' },
          labels: { [k]: `h=${h}` },
        },
      });

      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tails[mid] < h) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }

      const action = lo === tails.length ? 'append' : 'replace';
      tails[lo] = h;

      steps.push({
        line: 7,
        explanation: `${action === 'append' ? `Append ${h} to tails.` : `Replace tails[${lo}] with ${h}.`} tails=[${tails.join(', ')}].`,
        variables: { h, pos: lo, action, tails: tails.join(',') },
        visualization: {
          type: 'array',
          array: [...sortedHeights],
          highlights: { [k]: 'found' },
          labels: { [k]: action },
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `LIS complete. tails=[${tails.join(', ')}]. Maximum envelopes = ${tails.length}.`,
      variables: { result: tails.length },
      visualization: {
        type: 'array',
        array: [...tails],
        highlights: tails.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        labels: {},
      },
    });

    return steps;
  },
};

export default russianDollEnvelopes;
