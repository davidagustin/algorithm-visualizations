import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pourWater: AlgorithmDefinition = {
  id: 'pour-water',
  title: 'Pour Water',
  leetcodeNumber: 755,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Simulate pouring V units of water at position K on a terrain. Each unit: look left first, find the lowest point (must be strictly lower than starting position) - if found, drop there; else look right; else stay at K. The water fills valleys and stacks on flat surfaces.',
  tags: ['Simulation', 'Array'],
  code: {
    pseudocode: `function pourWater(heights, V, K):
  water = copy of heights
  for each drop:
    pos = K
    // Try left
    while pos > 0 and water[pos-1] <= water[pos]:
      pos--
    while pos < K and water[pos+1] <= water[pos]:
      pos++
    // Try right if pos == K
    if pos == K:
      while pos < len-1 and water[pos+1] <= water[pos]:
        pos++
      while pos > K and water[pos-1] <= water[pos]:
        pos--
    water[pos]++
  return water`,
    python: `def pourWater(heights, V, K):
    water = heights[:]
    for _ in range(V):
        pos = K
        while pos > 0 and water[pos-1] <= water[pos]: pos -= 1
        while pos < K and water[pos+1] <= water[pos]: pos += 1
        if pos == K:
            while pos < len(water)-1 and water[pos+1] <= water[pos]: pos += 1
            while pos > K and water[pos-1] <= water[pos]: pos -= 1
        water[pos] += 1
    return water`,
    javascript: `function pourWater(heights, V, K) {
  const w = [...heights];
  for (let d = 0; d < V; d++) {
    let pos = K;
    while (pos > 0 && w[pos-1] <= w[pos]) pos--;
    while (pos < K && w[pos+1] <= w[pos]) pos++;
    if (pos === K) {
      while (pos < w.length-1 && w[pos+1] <= w[pos]) pos++;
      while (pos > K && w[pos-1] <= w[pos]) pos--;
    }
    w[pos]++;
  }
  return w;
}`,
    java: `public int[] pourWater(int[] heights, int V, int K) {
    int[] w = heights.clone();
    for (int d=0; d<V; d++) {
        int pos=K;
        while(pos>0&&w[pos-1]<=w[pos]) pos--;
        while(pos<K&&w[pos+1]<=w[pos]) pos++;
        if(pos==K){while(pos<w.length-1&&w[pos+1]<=w[pos])pos++;while(pos>K&&w[pos-1]<=w[pos])pos--;}
        w[pos]++;
    }
    return w;
}`,
  },
  defaultInput: { heights: [2, 1, 1, 2, 1, 2, 2], V: 4, K: 3 },
  inputFields: [
    {
      name: 'heights',
      label: 'Heights',
      type: 'array',
      defaultValue: [2, 1, 1, 2, 1, 2, 2],
      placeholder: '2,1,1,2,1,2,2',
      helperText: 'Terrain heights',
    },
    {
      name: 'V',
      label: 'Volume (V)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Units of water to pour',
    },
    {
      name: 'K',
      label: 'Position (K)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Index where water is poured',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const heights = input.heights as number[];
    const V = input.V as number;
    const K = input.K as number;
    const steps: AlgorithmStep[] = [];

    const w = [...heights];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...w],
      highlights,
      labels,
      auxData: { label: 'Pour Water', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `Pour ${V} units of water at K=${K}. Terrain: [${heights.join(',')}].`,
      variables: { heights: [...heights], V, K },
      visualization: makeViz(
        { [K]: 'pointer' },
        Object.fromEntries(heights.map((v, i) => [i, i === K ? `K=${v}` : String(v)])),
        [{ key: 'Pour Position', value: `K=${K}` }, { key: 'Volume', value: String(V) }],
      ),
    });

    for (let drop = 0; drop < V; drop++) {
      let pos = K;

      // Try left
      while (pos > 0 && w[pos - 1] <= w[pos]) pos--;
      while (pos < K && w[pos + 1] <= w[pos]) pos++;

      // Try right if still at K
      if (pos === K) {
        while (pos < w.length - 1 && w[pos + 1] <= w[pos]) pos++;
        while (pos > K && w[pos - 1] <= w[pos]) pos--;
      }

      w[pos]++;

      steps.push({
        line: 15,
        explanation: `Drop ${drop + 1}/${V}: Water flows to position ${pos} (height was ${w[pos] - 1}, now ${w[pos]}). ${pos < K ? 'Settled left' : pos > K ? 'Settled right' : 'Stayed at K'}.`,
        variables: { drop: drop + 1, landedAt: pos, newHeight: w[pos] },
        visualization: makeViz(
          { [K]: 'pointer', [pos]: 'active' },
          Object.fromEntries(w.map((v, i) => [i, i === K ? `K=${v}` : i === pos ? `+1=${v}` : String(v)])),
          [{ key: `Drop ${drop + 1}`, value: `landed at pos ${pos}` }, { key: 'New height', value: String(w[pos]) }, { key: 'Current', value: w.join(',') }],
        ),
      });
    }

    steps.push({
      line: 16,
      explanation: `Done! Final terrain after pouring ${V} units: [${w.join(',')}].`,
      variables: { result: [...w] },
      visualization: makeViz(
        Object.fromEntries(w.map((v, i) => [i, v > heights[i] ? 'found' : 'default'])),
        Object.fromEntries(w.map((v, i) => [i, v > heights[i] ? `${heights[i]}+${v - heights[i]}` : String(v)])),
        [{ key: 'Final', value: w.join(',') }, { key: 'Water Added', value: w.reduce((s, v, i) => s + v - heights[i], 0) + ' units' }],
      ),
    });

    return steps;
  },
};

export default pourWater;
