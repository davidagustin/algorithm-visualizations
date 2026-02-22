import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const gcdSortOfAnArray: AlgorithmDefinition = {
  id: 'gcd-sort-of-an-array',
  title: 'GCD Sort of an Array',
  leetcodeNumber: 1998,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given an array, you can swap two elements if their GCD is greater than 1. Determine if the array can be sorted. Use union find: for each number, factor it and union all numbers sharing a prime factor. Then check if each element can reach its target sorted position within the same component.',
  tags: ['union find', 'graph', 'math', 'sorting', 'prime factors'],

  code: {
    pseudocode: `function gcdSort(nums):
  n = len(nums)
  maxVal = max(nums)
  parent = [0..maxVal]
  // Sieve to find smallest prime factor
  spf = smallest_prime_factor sieve
  for num in nums:
    x = num
    while x > 1:
      p = spf[x]
      union(num, p)
      while x % p == 0: x //= p
  sorted_nums = sorted(nums)
  for i in 0..n-1:
    if find(nums[i]) != find(sorted_nums[i]):
      return False
  return True`,

    python: `def gcdSort(nums):
    maxVal = max(nums)
    spf = list(range(maxVal + 1))
    for i in range(2, int(maxVal**0.5) + 1):
        if spf[i] == i:
            for j in range(i*i, maxVal+1, i):
                if spf[j] == j: spf[j] = i
    parent = list(range(maxVal + 1))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for num in nums:
        x = num
        while x > 1:
            p = spf[x]
            if find(num) != find(p):
                parent[find(num)] = find(p)
            while x % p == 0: x //= p
    sorted_nums = sorted(nums)
    return all(find(a) == find(b) for a, b in zip(nums, sorted_nums))`,

    javascript: `function gcdSort(nums) {
  const maxVal = Math.max(...nums);
  const spf = Array.from({length:maxVal+1},(_,i)=>i);
  for(let i=2;i*i<=maxVal;i++)
    if(spf[i]===i) for(let j=i*i;j<=maxVal;j+=i) if(spf[j]===j) spf[j]=i;
  const parent=Array.from({length:maxVal+1},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  for(const num of nums){
    let x=num;
    while(x>1){
      const p=spf[x];
      const pn=find(num),pp=find(p);
      if(pn!==pp) parent[pn]=pp;
      while(x%p===0) x=Math.floor(x/p);
    }
  }
  const sorted=[...nums].sort((a,b)=>a-b);
  return nums.every((v,i)=>find(v)===find(sorted[i]));
}`,

    java: `public boolean gcdSort(int[] nums) {
    int maxVal = Arrays.stream(nums).max().getAsInt();
    int[] spf = new int[maxVal+1];
    for(int i=0;i<=maxVal;i++) spf[i]=i;
    for(int i=2;i*i<=maxVal;i++)
        if(spf[i]==i) for(int j=i*i;j<=maxVal;j+=i) if(spf[j]==j) spf[j]=i;
    int[] parent = new int[maxVal+1];
    for(int i=0;i<=maxVal;i++) parent[i]=i;
    for(int num:nums){
        int x=num;
        while(x>1){int p=spf[x];union(parent,num,p);while(x%p==0)x/=p;}
    }
    int[] sorted=nums.clone(); Arrays.sort(sorted);
    for(int i=0;i<nums.length;i++) if(find(parent,nums[i])!=find(parent,sorted[i])) return false;
    return true;
}`,
  },

  defaultInput: {
    nums: [7, 21, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [7, 21, 3],
      placeholder: '7,21,3',
      helperText: 'Array of positive integers to check if sortable via GCD swaps',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const maxVal = Math.max(...nums);

    // Build smallest prime factor sieve
    const spf: number[] = Array.from({ length: maxVal + 1 }, (_, i) => i);
    for (let i = 2; i * i <= maxVal; i++) {
      if (spf[i] === i) {
        for (let j = i * i; j <= maxVal; j += i) {
          if (spf[j] === j) spf[j] = i;
        }
      }
    }

    const parent: number[] = Array.from({ length: maxVal + 1 }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
      }
      return x;
    }

    steps.push({
      line: 1,
      explanation: `Array: [${nums}]. Build smallest prime factor sieve up to ${maxVal}. Then union numbers sharing prime factors.`,
      variables: { maxVal, numCount: nums.length },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, String(v)])),
      },
    });

    for (let idx = 0; idx < nums.length; idx++) {
      const num = nums[idx];
      let x = num;
      const factors: number[] = [];

      while (x > 1) {
        const p = spf[x];
        factors.push(p);
        const pn = find(num);
        const pp = find(p);
        if (pn !== pp) parent[pn] = pp;
        while (x % p === 0) x = Math.floor(x / p);
      }

      steps.push({
        line: 8,
        explanation: `Number ${num}: prime factors are [${factors.join(', ')}]. Unioned ${num} with each factor.`,
        variables: { num, factors: factors.join(','), root: find(num) },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [idx]: 'active' },
          labels: { [idx]: `root:${find(num)}` },
        },
      });
    }

    const sorted = [...nums].sort((a, b) => a - b);

    steps.push({
      line: 11,
      explanation: `Sorted target: [${sorted}]. Check if nums[i] and sorted[i] are in same union-find component.`,
      variables: { sorted: sorted.join(',') },
      visualization: {
        type: 'array',
        array: sorted,
        highlights: Object.fromEntries(sorted.map((_, i) => [i, 'comparing'])),
        labels: Object.fromEntries(sorted.map((v, i) => [i, `t:${v}`])),
      },
    });

    let canSort = true;
    for (let i = 0; i < nums.length; i++) {
      const rootA = find(nums[i]);
      const rootB = find(sorted[i]);
      const ok = rootA === rootB;
      if (!ok) canSort = false;

      steps.push({
        line: 13,
        explanation: `Position ${i}: nums[${i}]=${nums[i]} (root=${rootA}) vs sorted[${i}]=${sorted[i]} (root=${rootB}). ${ok ? 'Same component - can swap.' : 'Different components - CANNOT sort!'}`,
        variables: { i, numsI: nums[i], sortedI: sorted[i], rootA, rootB, match: ok },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: ok ? 'found' : 'mismatch' },
          labels: { [i]: ok ? 'ok' : 'fail' },
        },
      });

      if (!ok) {
        steps.push({
          line: 14,
          explanation: `Cannot place ${sorted[i]} at position ${i}. Returning false.`,
          variables: { result: false },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'mismatch' },
            labels: {},
          },
        });
        return steps;
      }
    }

    steps.push({
      line: 16,
      explanation: `All elements can reach their target positions. Array CAN be sorted via GCD swaps. Return true.`,
      variables: { result: true },
      visualization: {
        type: 'array',
        array: sorted,
        highlights: Object.fromEntries(sorted.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(sorted.map((v, i) => [i, String(v)])),
      },
    });

    return steps;
  },
};

export default gcdSortOfAnArray;
