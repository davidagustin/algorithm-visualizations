import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimizeHammingDistanceAfterSwap: AlgorithmDefinition = {
  id: 'minimize-hamming-distance-after-swap',
  title: 'Minimize Hamming Distance After Swap',
  leetcodeNumber: 1722,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given two arrays source and target and a list of allowed swap pairs for source, find the minimum Hamming distance after optimally performing swaps. Indices connected by swaps form groups via union find. Within each group, greedily match available source values to target values to minimize mismatches.',
  tags: ['union find', 'graph', 'greedy', 'counting'],

  code: {
    pseudocode: `function minimumHammingDistance(source, target, allowedSwaps):
  n = len(source)
  parent = [0..n-1]
  for [a, b] in allowedSwaps:
    union(a, b)
  // Group source indices by component
  groups = {}
  for i in 0..n-1:
    root = find(i)
    groups[root].append(source[i])
  // For each target index, try to match from its component
  distance = 0
  for i in 0..n-1:
    root = find(i)
    if target[i] in groups[root]:
      remove one target[i] from groups[root]
    else:
      distance += 1
  return distance`,

    python: `def minimumHammingDistance(source, target, allowedSwaps):
    n = len(source)
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for a, b in allowedSwaps:
        pa, pb = find(a), find(b)
        if pa != pb: parent[pa] = pb
    from collections import defaultdict, Counter
    groups = defaultdict(list)
    for i in range(n):
        groups[find(i)].append(source[i])
    groups = {k: Counter(v) for k, v in groups.items()}
    dist = 0
    for i in range(n):
        root = find(i)
        if groups[root][target[i]] > 0:
            groups[root][target[i]] -= 1
        else:
            dist += 1
    return dist`,

    javascript: `function minimumHammingDistance(source, target, allowedSwaps) {
  const n = source.length;
  const parent = Array.from({length:n},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  for(const[a,b]of allowedSwaps){
    const pa=find(a),pb=find(b);
    if(pa!==pb) parent[pa]=pb;
  }
  const groups=new Map();
  for(let i=0;i<n;i++){
    const root=find(i);
    if(!groups.has(root)) groups.set(root,new Map());
    const m=groups.get(root);
    m.set(source[i],(m.get(source[i])||0)+1);
  }
  let dist=0;
  for(let i=0;i<n;i++){
    const root=find(i);
    const m=groups.get(root);
    if((m.get(target[i])||0)>0) m.set(target[i],m.get(target[i])-1);
    else dist++;
  }
  return dist;
}`,

    java: `public int minimumHammingDistance(int[] source, int[] target, int[][] allowedSwaps) {
    int n = source.length;
    int[] parent = new int[n];
    for(int i=0;i<n;i++) parent[i]=i;
    for(int[] s : allowedSwaps) union(parent,s[0],s[1]);
    Map<Integer,Map<Integer,Integer>> groups = new HashMap<>();
    for(int i=0;i<n;i++){
        int root=find(parent,i);
        groups.computeIfAbsent(root,k->new HashMap<>()).merge(source[i],1,Integer::sum);
    }
    int dist=0;
    for(int i=0;i<n;i++){
        int root=find(parent,i);
        Map<Integer,Integer> m=groups.get(root);
        if(m.getOrDefault(target[i],0)>0) m.merge(target[i],-1,Integer::sum);
        else dist++;
    }
    return dist;
}`,
  },

  defaultInput: {
    source: [1, 2, 3, 4],
    target: [2, 1, 4, 5],
    allowedSwaps: [[0, 1], [2, 3]],
  },

  inputFields: [
    {
      name: 'source',
      label: 'Source Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Source array values',
    },
    {
      name: 'target',
      label: 'Target Array',
      type: 'array',
      defaultValue: [2, 1, 4, 5],
      placeholder: '2,1,4,5',
      helperText: 'Target array values',
    },
    {
      name: 'allowedSwaps',
      label: 'Allowed Swaps',
      type: 'array',
      defaultValue: [[0, 1], [2, 3]],
      placeholder: '[[0,1],[2,3]]',
      helperText: 'Pairs of indices that can be swapped in source',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const source = input.source as number[];
    const target = input.target as number[];
    const allowedSwaps = input.allowedSwaps as number[][];
    const steps: AlgorithmStep[] = [];
    const n = source.length;
    const parent: number[] = Array.from({ length: n }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
      }
      return x;
    }

    steps.push({
      line: 1,
      explanation: `Initialize union-find for ${n} indices. Source: [${source}], Target: [${target}].`,
      variables: { n, initialHamming: source.filter((v, i) => v !== target[i]).length },
      visualization: {
        type: 'array',
        array: [...source],
        highlights: {},
        labels: Object.fromEntries(source.map((_, i) => [i, `i${i}`])),
      },
    });

    for (const [a, b] of allowedSwaps) {
      const pa = find(a);
      const pb = find(b);
      if (pa !== pb) parent[pa] = pb;
      steps.push({
        line: 4,
        explanation: `Allowed swap [${a}, ${b}]: union indices ${a} and ${b}. find(${a})=${find(a)}.`,
        variables: { a, b, rootA: find(a), rootB: find(b) },
        visualization: {
          type: 'array',
          array: [...source],
          highlights: { [a]: 'active', [b]: 'comparing' },
          labels: { [a]: `grp:${find(a)}`, [b]: `grp:${find(b)}` },
        },
      });
    }

    // Group source by component
    const groups: Map<number, Map<number, number>> = new Map();
    for (let i = 0; i < n; i++) {
      const root = find(i);
      if (!groups.has(root)) groups.set(root, new Map());
      const m = groups.get(root)!;
      m.set(source[i], (m.get(source[i]) ?? 0) + 1);
    }

    steps.push({
      line: 7,
      explanation: `Grouped source elements by component. Now try to match target[i] from same component.`,
      variables: { componentCount: groups.size },
      visualization: {
        type: 'array',
        array: [...source],
        highlights: Object.fromEntries(source.map((_, i) => [i, 'visited'])),
        labels: Object.fromEntries(source.map((_, i) => [i, `grp:${find(i)}`])),
      },
    });

    let dist = 0;
    for (let i = 0; i < n; i++) {
      const root = find(i);
      const m = groups.get(root)!;
      const tv = target[i];

      if ((m.get(tv) ?? 0) > 0) {
        m.set(tv, m.get(tv)! - 1);
        steps.push({
          line: 13,
          explanation: `Index ${i}: target[${i}]=${tv} found in component ${root}. Matched! Hamming distance unchanged.`,
          variables: { index: i, targetVal: tv, component: root, distance: dist },
          visualization: {
            type: 'array',
            array: [...source],
            highlights: { [i]: 'found' },
            labels: { [i]: `match:${tv}` },
          },
        });
      } else {
        dist++;
        steps.push({
          line: 15,
          explanation: `Index ${i}: target[${i}]=${tv} NOT in component ${root}. Hamming distance += 1 (now ${dist}).`,
          variables: { index: i, targetVal: tv, component: root, distance: dist },
          visualization: {
            type: 'array',
            array: [...source],
            highlights: { [i]: 'mismatch' },
            labels: { [i]: `miss:${tv}` },
          },
        });
      }
    }

    steps.push({
      line: 17,
      explanation: `Minimum Hamming distance after optimal swaps: ${dist}.`,
      variables: { result: dist },
      visualization: {
        type: 'array',
        array: [...source],
        highlights: {},
        labels: { 0: `result:${dist}` },
      },
    });

    return steps;
  },
};

export default minimizeHammingDistanceAfterSwap;
