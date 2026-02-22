import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestConsecutiveSequenceUf: AlgorithmDefinition = {
  id: 'longest-consecutive-sequence-uf',
  title: 'Longest Consecutive Sequence (Union Find)',
  leetcodeNumber: 128,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find the length of the longest consecutive sequence using Union Find. Store all numbers in a set. For each number, if num+1 exists, union them together. Track component sizes. The maximum component size is the answer. This achieves O(n * alpha(n)) time.',
  tags: ['union find', 'graph', 'hash set', 'consecutive'],

  code: {
    pseudocode: `function longestConsecutive(nums):
  numSet = set(nums)
  index = {num: i for i, num in enumerate(nums)}
  parent = [0..n-1]
  size = [1]*n
  for i, num in enumerate(nums):
    if num + 1 in numSet:
      j = index[num + 1]
      rootI, rootJ = find(i), find(j)
      if rootI != rootJ:
        union and merge sizes
  return max(size[find(i)] for all i)`,

    python: `def longestConsecutive(nums):
    if not nums: return 0
    num_set = set(nums)
    index = {num: i for i, num in enumerate(nums)}
    parent = list(range(len(nums)))
    size = [1] * len(nums)
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for i, num in enumerate(nums):
        if num + 1 in num_set:
            j = index[num + 1]
            ri, rj = find(i), find(j)
            if ri != rj:
                parent[ri] = rj
                size[rj] += size[ri]
    return max(size[find(i)] for i in range(len(nums)))`,

    javascript: `function longestConsecutive(nums) {
  if(!nums.length) return 0;
  const numSet=new Set(nums);
  const index=new Map(nums.map((v,i)=>[v,i]));
  const parent=Array.from({length:nums.length},(_,i)=>i);
  const size=new Array(nums.length).fill(1);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  for(let i=0;i<nums.length;i++){
    if(numSet.has(nums[i]+1)){
      const j=index.get(nums[i]+1);
      const ri=find(i),rj=find(j);
      if(ri!==rj){parent[ri]=rj;size[rj]+=size[ri];}
    }
  }
  return Math.max(...Array.from({length:nums.length},(_,i)=>size[find(i)]));
}`,

    java: `public int longestConsecutive(int[] nums) {
    if(nums.length==0) return 0;
    Map<Integer,Integer> index=new HashMap<>();
    for(int i=0;i<nums.length;i++) index.put(nums[i],i);
    int[]parent=new int[nums.length],size=new int[nums.length];
    for(int i=0;i<nums.length;i++){parent[i]=i;size[i]=1;}
    for(int i=0;i<nums.length;i++)
        if(index.containsKey(nums[i]+1)){
            int j=index.get(nums[i]+1);
            int ri=find(parent,i),rj=find(parent,j);
            if(ri!=rj){parent[ri]=rj;size[rj]+=size[ri];}
        }
    int res=0;
    for(int i=0;i<nums.length;i++) res=Math.max(res,size[find(parent,i)]);
    return res;
}`,
  },

  defaultInput: {
    nums: [100, 4, 200, 1, 3, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [100, 4, 200, 1, 3, 2],
      placeholder: '100,4,200,1,3,2',
      helperText: 'Unsorted array of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const numSet = new Set(nums);
    const index: Map<number, number> = new Map(nums.map((v, i) => [v, i]));
    const parent: number[] = Array.from({ length: n }, (_, i) => i);
    const size: number[] = new Array(n).fill(1);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    steps.push({
      line: 1,
      explanation: `Array: [${nums}]. Build a set for O(1) lookup. Each element starts as its own component of size 1.`,
      variables: { n, elements: nums.join(',') },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, String(v)])),
      },
    });

    for (let i = 0; i < n; i++) {
      const num = nums[i];
      const next = num + 1;

      steps.push({
        line: 5,
        explanation: `Check if ${num} + 1 = ${next} exists in the set. ${numSet.has(next) ? 'Yes! Union them.' : 'No.'}`,
        variables: { num, next, exists: numSet.has(next) },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: numSet.has(next) ? 'active' : 'visited' },
          labels: { [i]: numSet.has(next) ? `${num}+1?` : `${num}` },
        },
      });

      if (numSet.has(next)) {
        const j = index.get(next)!;
        const ri = find(i);
        const rj = find(j);

        if (ri !== rj) {
          parent[ri] = rj;
          size[rj] += size[ri];

          steps.push({
            line: 8,
            explanation: `Union ${num} (idx ${i}, root ${ri}) and ${next} (idx ${j}, root ${rj}). New component size: ${size[rj]}.`,
            variables: { num, next, newSize: size[rj] },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: { [i]: 'comparing', [j]: 'comparing' },
              labels: { [i]: `sz:${size[find(i)]}`, [j]: `sz:${size[rj]}` },
            },
          });
        }
      }
    }

    let maxSize = 0;
    for (let i = 0; i < n; i++) {
      maxSize = Math.max(maxSize, size[find(i)]);
    }

    steps.push({
      line: 10,
      explanation: `All unions complete. Component sizes: [${Array.from({ length: n }, (_, i) => size[find(i)]).join(', ')}]. Longest consecutive sequence length: ${maxSize}.`,
      variables: { result: maxSize },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, size[find(i)] === maxSize ? 'found' : 'visited'])),
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `sz:${size[find(i)]}`])),
      },
    });

    return steps;
  },
};

export default longestConsecutiveSequenceUf;
