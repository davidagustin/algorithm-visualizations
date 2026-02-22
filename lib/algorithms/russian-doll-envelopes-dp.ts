import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const russianDollEnvelopesDp: AlgorithmDefinition = {
  id: 'russian-doll-envelopes-dp',
  title: 'Russian Doll Envelopes (DP)',
  leetcodeNumber: 354,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given envelopes [w, h], find max number that can be nested (each strictly smaller in both dimensions). Sort by width ascending, height descending (to break ties). Then find LIS on heights only. Sorting trick prevents using two same-width envelopes.',
  tags: ['dynamic programming', 'sorting', 'lis', 'binary search'],

  code: {
    pseudocode: `function maxEnvelopes(envelopes):
  sort by width asc, then height desc (tie-break)
  heights = [env[1] for env in sorted_envelopes]
  find LIS of heights using patience sort (O(n log n))
  return len(LIS)`,
    python: `def maxEnvelopes(envelopes: list[list[int]]) -> int:
    envelopes.sort(key=lambda e: (e[0], -e[1]))
    heights = [e[1] for e in envelopes]
    tails = []
    for h in heights:
        lo, hi = 0, len(tails)
        while lo < hi:
            mid = (lo+hi)//2
            if tails[mid] < h: lo = mid+1
            else: hi = mid
        if lo == len(tails): tails.append(h)
        else: tails[lo] = h
    return len(tails)`,
    javascript: `function maxEnvelopes(envelopes) {
  envelopes.sort((a,b)=>a[0]===b[0]?b[1]-a[1]:a[0]-b[0]);
  const heights=envelopes.map(e=>e[1]);
  const tails=[];
  for(const h of heights){
    let lo=0,hi=tails.length;
    while(lo<hi){const mid=(lo+hi)>>1;tails[mid]<h?lo=mid+1:hi=mid;}
    if(lo===tails.length) tails.push(h);
    else tails[lo]=h;
  }
  return tails.length;
}`,
    java: `public int maxEnvelopes(int[][] env) {
    Arrays.sort(env,(a,b)->a[0]==b[0]?b[1]-a[1]:a[0]-b[0]);
    int[] tails=new int[env.length];
    int size=0;
    for(int[]e:env){
        int lo=0,hi=size;
        while(lo<hi){int mid=(lo+hi)/2;if(tails[mid]<e[1])lo=mid+1;else hi=mid;}
        tails[lo]=e[1];
        if(lo==size)size++;
    }
    return size;
}`,
  },

  defaultInput: {
    envelopes: [[5, 4], [6, 4], [6, 7], [2, 3]],
  },

  inputFields: [
    {
      name: 'envelopes',
      label: 'Envelopes (flat: w1,h1,w2,h2,...)',
      type: 'array',
      defaultValue: [5, 4, 6, 4, 6, 7, 2, 3],
      placeholder: '5,4,6,4,6,7,2,3',
      helperText: 'Envelope dimensions as flat pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.envelopes as number[];
    const envelopes: [number, number][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) envelopes.push([flat[i], flat[i + 1]]);

    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input envelopes: ${envelopes.map(e => '[' + e[0] + ',' + e[1] + ']').join(', ')}. Sort width asc, height desc.`,
      variables: { envelopes: JSON.stringify(envelopes) },
      visualization: {
        type: 'array',
        array: envelopes.map(e => e[1]),
        highlights: {},
        labels: envelopes.reduce((a, e, i) => ({ ...a, [i]: `${e[0]}x${e[1]}` }), {}),
      } as ArrayVisualization,
    });

    envelopes.sort((a, b) => a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]);

    steps.push({
      line: 2,
      explanation: `Sorted: ${envelopes.map(e => '[' + e[0] + ',' + e[1] + ']').join(', ')}. Now find LIS on heights.`,
      variables: { sorted: JSON.stringify(envelopes) },
      visualization: {
        type: 'array',
        array: envelopes.map(e => e[1]),
        highlights: {},
        labels: envelopes.reduce((a, e, i) => ({ ...a, [i]: `h=${e[1]}` }), {}),
      } as ArrayVisualization,
    });

    const heights = envelopes.map(e => e[1]);
    const tails: number[] = [];

    for (let idx = 0; idx < heights.length; idx++) {
      const h = heights[idx];
      let lo = 0, hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tails[mid] < h) lo = mid + 1;
        else hi = mid;
      }
      const extended = lo === tails.length;
      if (extended) tails.push(h);
      else tails[lo] = h;

      steps.push({
        line: 7,
        explanation: `h=${h}: ${extended ? 'extend tails to length ' + tails.length : 'replace tails[' + lo + ']=' + h}. tails=[${tails}].`,
        variables: { h, lo, tails: JSON.stringify(tails), lisLen: tails.length },
        visualization: {
          type: 'array',
          array: [...tails, ...new Array(Math.max(0, heights.length - tails.length)).fill(0)],
          highlights: { [lo]: extended ? 'found' : 'comparing' },
          labels: { [lo]: `${h}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 5,
      explanation: `Max envelopes (LIS of heights) = ${tails.length}.`,
      variables: { result: tails.length },
      visualization: {
        type: 'array',
        array: [...tails],
        highlights: {},
        labels: { 0: `LIS=${tails.length}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default russianDollEnvelopesDp;
