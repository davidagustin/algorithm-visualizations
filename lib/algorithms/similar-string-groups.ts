import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const similarStringGroups: AlgorithmDefinition = {
  id: 'similar-string-groups',
  title: 'Similar String Groups',
  leetcodeNumber: 839,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Two strings are similar if they are anagrams of each other and differ in at most 2 positions (swapping two letters). Given an array of strings (all anagrams), group them into similar-string groups using Union-Find. Count the number of groups.',
  tags: ['graph', 'union find', 'string', 'anagram', 'grouping'],

  code: {
    pseudocode: `function numSimilarGroups(strs):
  n = strs.length
  parent = [0..n-1]
  for i from 0 to n-1:
    for j from i+1 to n-1:
      if similar(strs[i], strs[j]):
        union(i, j)
  return count of distinct roots

function similar(a, b):
  diff = count positions where a[k] != b[k]
  return diff == 0 or diff == 2`,

    python: `def numSimilarGroups(strs):
    n = len(strs)
    parent = list(range(n))
    def find(x):
        while parent[x]!=x: parent[x]=parent[parent[x]]; x=parent[x]
        return x
    def union(x,y): parent[find(x)]=find(y)
    def similar(a,b):
        diff=sum(c!=d for c,d in zip(a,b))
        return diff==0 or diff==2
    for i in range(n):
        for j in range(i+1,n):
            if similar(strs[i],strs[j]):
                union(i,j)
    return len({find(i) for i in range(n)})`,

    javascript: `function numSimilarGroups(strs) {
  const n = strs.length;
  const parent = Array.from({length:n},(_,i)=>i);
  function find(x) { while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];} return x; }
  function union(x,y) { parent[find(x)]=find(y); }
  function similar(a,b) { let d=0; for(let k=0;k<a.length;k++) if(a[k]!==b[k]) d++; return d===0||d===2; }
  for (let i=0;i<n;i++) for(let j=i+1;j<n;j++) if(similar(strs[i],strs[j])) union(i,j);
  return new Set(Array.from({length:n},(_,i)=>find(i))).size;
}`,

    java: `public int numSimilarGroups(String[] strs) {
    int n = strs.length;
    int[] parent = new int[n];
    for (int i=0;i<n;i++) parent[i]=i;
    for (int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(similar(strs[i],strs[j])) union(parent,i,j);
    Set<Integer> roots = new HashSet<>();
    for (int i=0;i<n;i++) roots.add(find(parent,i));
    return roots.size();
}`,
  },

  defaultInput: {
    strs: ['tars', 'rats', 'arts', 'star'],
  },

  inputFields: [
    {
      name: 'strs',
      label: 'Strings (comma-separated)',
      type: 'string',
      defaultValue: 'tars,rats,arts,star',
      placeholder: 'tars,rats,arts,star',
      helperText: 'Comma-separated anagram strings',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawStrs = input.strs as string[] | string;
    const strs: string[] = Array.isArray(rawStrs) ? rawStrs : String(rawStrs).split(',').map(s => s.trim());
    const steps: AlgorithmStep[] = [];

    const n = strs.length;
    const parent = Array.from({ length: n }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }
    function union(x: number, y: number) { parent[find(x)] = find(y); }
    function similar(a: string, b: string): boolean {
      let diff = 0;
      for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) diff++;
      return diff === 0 || diff === 2;
    }

    const indices = Array.from({ length: n }, (_, i) => i);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: indices,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Check similarity between all pairs of ${n} strings: [${strs.join(', ')}]. Two strings are similar if they differ in 0 or 2 positions.`,
      variables: { n, strs: strs.join(',') },
      visualization: makeViz(
        indices.reduce((acc, i) => { acc[i] = 'visited'; return acc; }, {} as Record<number, string>),
        indices.reduce((acc, i) => { acc[i] = strs[i]; return acc; }, {} as Record<number, string>)
      ),
    });

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const sim = similar(strs[i], strs[j]);
        const hl: Record<number, string> = {};
        const lb: Record<number, string> = {};
        hl[i] = 'active';
        lb[i] = strs[i];
        hl[j] = 'comparing';
        lb[j] = strs[j];

        // Count diff positions for explanation
        let diff = 0;
        for (let k = 0; k < strs[i].length; k++) if (strs[i][k] !== strs[j][k]) diff++;

        steps.push({
          line: 3,
          explanation: `Compare "${strs[i]}" and "${strs[j]}": differ in ${diff} positions. Similar: ${sim}.`,
          variables: { i, j, strI: strs[i], strJ: strs[j], diffCount: diff, similar: sim },
          visualization: makeViz(hl, lb),
        });

        if (sim) {
          union(i, j);
          const hl2: Record<number, string> = {};
          const lb2: Record<number, string> = {};
          hl2[i] = 'found';
          lb2[i] = `root=${find(i)}`;
          hl2[j] = 'found';
          lb2[j] = `root=${find(j)}`;

          steps.push({
            line: 4,
            explanation: `Strings are similar! Union groups of "${strs[i]}" and "${strs[j]}".`,
            variables: { unioned: `${i} and ${j}`, root: find(i) },
            visualization: makeViz(hl2, lb2),
          });
        }
      }
    }

    const roots = new Set(indices.map(i => find(i)));
    const groups = roots.size;

    steps.push({
      line: 6,
      explanation: `All pairs checked. Distinct roots: {${[...roots].join(', ')}}. Total similar string groups = ${groups}.`,
      variables: { result: groups, roots: [...roots].join(',') },
      visualization: makeViz(
        indices.reduce((acc, i) => { acc[i] = 'sorted'; return acc; }, {} as Record<number, string>),
        indices.reduce((acc, i) => { acc[i] = `grp=${find(i)}`; return acc; }, {} as Record<number, string>)
      ),
    });

    return steps;
  },
};

export default similarStringGroups;
