import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const smallestStringWithSwaps: AlgorithmDefinition = {
  id: 'smallest-string-with-swaps',
  title: 'Smallest String with Swaps',
  leetcodeNumber: 1202,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a string and a list of index pairs that can be swapped any number of times, return the lexicographically smallest string after all possible swaps. Union find groups connected indices together, then sort characters within each group and place them back in sorted order at the group positions.',
  tags: ['union find', 'graph', 'string', 'sorting'],

  code: {
    pseudocode: `function smallestStringWithSwaps(s, pairs):
  n = len(s)
  parent = [0..n-1]
  for [a, b] in pairs:
    union(a, b)
  // Group indices by component
  groups = {}
  for i in 0..n-1:
    groups[find(i)].append(i)
  // Sort chars within each group
  result = list(s)
  for indices in groups.values():
    chars = sorted(s[i] for i in indices)
    for i, idx in enumerate(sorted(indices)):
      result[idx] = chars[i]
  return "".join(result)`,

    python: `def smallestStringWithSwaps(s, pairs):
    n = len(s)
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        pa, pb = find(a), find(b)
        if pa != pb: parent[pa] = pb
    for a, b in pairs:
        union(a, b)
    from collections import defaultdict
    groups = defaultdict(list)
    for i in range(n):
        groups[find(i)].append(i)
    result = list(s)
    for indices in groups.values():
        chars = sorted(s[i] for i in indices)
        for i, idx in enumerate(sorted(indices)):
            result[idx] = chars[i]
    return ''.join(result)`,

    javascript: `function smallestStringWithSwaps(s, pairs) {
  const n = s.length;
  const parent = Array.from({length:n},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  for(const[a,b]of pairs){
    const pa=find(a),pb=find(b);
    if(pa!==pb) parent[pa]=pb;
  }
  const groups=new Map();
  for(let i=0;i<n;i++){
    const r=find(i);
    if(!groups.has(r)) groups.set(r,[]);
    groups.get(r).push(i);
  }
  const res=[...s];
  for(const indices of groups.values()){
    const chars=[...indices.map(i=>s[i])].sort();
    const sorted_idx=[...indices].sort((a,b)=>a-b);
    sorted_idx.forEach((idx,i)=>res[idx]=chars[i]);
  }
  return res.join('');
}`,

    java: `public String smallestStringWithSwaps(String s, List<List<Integer>> pairs) {
    int n = s.length();
    int[] parent = new int[n];
    for(int i=0;i<n;i++) parent[i]=i;
    for(List<Integer> p : pairs) union(parent,p.get(0),p.get(1));
    Map<Integer,List<Integer>> groups = new TreeMap<>();
    for(int i=0;i<n;i++)
        groups.computeIfAbsent(find(parent,i),k->new ArrayList<>()).add(i);
    char[] res = s.toCharArray();
    for(List<Integer> indices : groups.values()){
        List<Character> chars = new ArrayList<>();
        for(int i : indices) chars.add(s.charAt(i));
        Collections.sort(chars);
        Collections.sort(indices);
        for(int i=0;i<indices.size();i++) res[indices.get(i)]=chars.get(i);
    }
    return new String(res);
}`,
  },

  defaultInput: {
    s: 'dcab',
    pairs: [[0, 3], [1, 2]],
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'dcab',
      placeholder: 'dcab',
      helperText: 'Input string to rearrange',
    },
    {
      name: 'pairs',
      label: 'Swap Pairs',
      type: 'array',
      defaultValue: [[0, 3], [1, 2]],
      placeholder: '[[0,3],[1,2]]',
      helperText: 'Index pairs that can be swapped',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const pairs = input.pairs as number[][];
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const parent: number[] = Array.from({ length: n }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
      }
      return x;
    }

    const chars = s.split('');

    steps.push({
      line: 1,
      explanation: `String "${s}" has ${n} characters. Initialize union-find for each index.`,
      variables: { string: s, n },
      visualization: {
        type: 'array',
        array: chars.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(chars.map((c, i) => [i, c])),
      },
    });

    for (const [a, b] of pairs) {
      const pa = find(a);
      const pb = find(b);
      if (pa !== pb) parent[pa] = pb;
      steps.push({
        line: 4,
        explanation: `Union indices ${a} (${s[a]}) and ${b} (${s[b]}). Now in same swap group.`,
        variables: { a, b, charA: s[a], charB: s[b], rootA: find(a) },
        visualization: {
          type: 'array',
          array: chars.map((_, i) => i),
          highlights: { [a]: 'active', [b]: 'comparing' },
          labels: Object.fromEntries(chars.map((c, i) => [i, `${c}(g${find(i)})`])),
        },
      });
    }

    // Group indices by component
    const groups: Map<number, number[]> = new Map();
    for (let i = 0; i < n; i++) {
      const root = find(i);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root)!.push(i);
    }

    steps.push({
      line: 7,
      explanation: `Grouped indices by component. ${groups.size} group(s) found. Sort chars within each group.`,
      variables: { groupCount: groups.size },
      visualization: {
        type: 'array',
        array: chars.map((_, i) => i),
        highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'visited'])),
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `g${find(i)}`])),
      },
    });

    const result = [...chars];

    for (const indices of groups.values()) {
      const sortedChars = indices.map(i => s[i]).sort();
      const sortedIndices = [...indices].sort((a, b) => a - b);

      steps.push({
        line: 11,
        explanation: `Group [${sortedIndices.join(',')}]: chars [${sortedChars.join(',')}] assigned to sorted positions.`,
        variables: { indices: sortedIndices.join(','), chars: sortedChars.join(',') },
        visualization: {
          type: 'array',
          array: chars.map((_, i) => i),
          highlights: Object.fromEntries(sortedIndices.map(i => [i, 'comparing'])),
          labels: Object.fromEntries(sortedIndices.map((idx, k) => [idx, sortedChars[k]])),
        },
      });

      sortedIndices.forEach((idx, k) => {
        result[idx] = sortedChars[k];
      });
    }

    const resultStr = result.join('');
    steps.push({
      line: 14,
      explanation: `Result: "${resultStr}". Lexicographically smallest possible string after allowed swaps.`,
      variables: { original: s, result: resultStr },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i),
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default smallestStringWithSwaps;
