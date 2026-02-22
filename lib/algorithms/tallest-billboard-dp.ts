import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const tallestBillboardDp: AlgorithmDefinition = {
  id: 'tallest-billboard-dp',
  title: 'Tallest Billboard (Meet in Middle)',
  leetcodeNumber: 956,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Alternative approach to the tallest billboard problem using meet-in-middle. Split the rods into two halves. For each half, enumerate all subsets: assign each rod to left support (+), right support (-), or neither (0). For each state, record the maximum sum of left+right. Then combine halves: for left state diff d and right state diff -d, the answer is leftMax[d] + rightMax[-d].',
  tags: ['dynamic programming', 'meet in middle', 'subset enumeration'],

  code: {
    pseudocode: `function tallestBillboard(rods):
  function enumerate(subset):
    // returns map: diff -> max (larger+smaller)
    dp = {0: 0}
    for rod in subset:
      ndp = copy dp
      for diff, total in dp:
        ndp[diff+rod] = max(ndp.get(diff+rod,0), total+rod)
        ndp[abs(diff-rod)] = max(..., total+rod)
      dp = ndp
    return dp

  half = len(rods)//2
  left = enumerate(rods[:half])
  right = enumerate(rods[half:])
  ans = 0
  for diff, ltotal in left:
    if diff in right:
      ans = max(ans, (ltotal+right[diff])//2 + diff//2)
  return ans`,

    python: `def tallestBillboard(rods):
    def solve(A):
        dp = {0: 0}
        for r in A:
            ndp = dict(dp)
            for d, t in dp.items():
                ndp[d+r] = max(ndp.get(d+r,0), t+r)
                nd=abs(d-r); nt=t+r
                ndp[nd]=max(ndp.get(nd,0),nt)
            dp = ndp
        return dp
    n = len(rods)
    L = solve(rods[:n//2])
    R = solve(rods[n//2:])
    ans = 0
    for d,lt in L.items():
        if d in R:
            ans=max(ans,(lt+R[d]+d)//2)
    return ans`,

    javascript: `function tallestBillboard(rods) {
  function solve(A) {
    let dp = new Map([[0,0]]);
    for (const r of A) {
      const ndp = new Map(dp);
      for (const [d,t] of dp) {
        ndp.set(d+r, Math.max(ndp.get(d+r)||0, t+r));
        const nd=Math.abs(d-r), nt=t+r;
        ndp.set(nd, Math.max(ndp.get(nd)||0,nt));
      }
      dp=ndp;
    }
    return dp;
  }
  const n=rods.length, half=n>>1;
  const L=solve(rods.slice(0,half)), R=solve(rods.slice(half));
  let ans=0;
  for (const [d,lt] of L) {
    if (R.has(d)) ans=Math.max(ans,(lt+R.get(d)+d)/2);
  }
  return ans;
}`,

    java: `public int tallestBillboard(int[] rods) {
    int n=rods.length, h=n/2;
    Map<Integer,Integer>L=solve(rods,0,h),R=solve(rods,h,n);
    int ans=0;
    for(Map.Entry<Integer,Integer>e:L.entrySet()){
        int d=e.getKey(),lt=e.getValue();
        if(R.containsKey(d))ans=Math.max(ans,(lt+R.get(d)+d)/2);
    }
    return ans;
}
Map<Integer,Integer>solve(int[]r,int s,int e){
    Map<Integer,Integer>dp=new HashMap<>();dp.put(0,0);
    for(int i=s;i<e;i++){int rod=r[i];
        Map<Integer,Integer>ndp=new HashMap<>(dp);
        for(Map.Entry<Integer,Integer>en:dp.entrySet()){
            int d=en.getKey(),t=en.getValue();
            ndp.merge(d+rod,t+rod,Math::max);
            ndp.merge(Math.abs(d-rod),t+rod,Math::max);
        }
        dp=ndp;}
    return dp;}`,
  },

  defaultInput: {
    rods: [1, 2, 3, 6],
  },

  inputFields: [
    {
      name: 'rods',
      label: 'Rod Lengths',
      type: 'array',
      defaultValue: [1, 2, 3, 6],
      placeholder: '1,2,3,6',
      helperText: 'Lengths of steel rods for the billboard',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rods = input.rods as number[];
    const steps: AlgorithmStep[] = [];
    const n = rods.length;
    const half = Math.floor(n / 2);

    function solve(subset: number[]): Map<number, number> {
      let dp = new Map<number, number>([[0, 0]]);
      for (const r of subset) {
        const ndp = new Map(dp);
        for (const [d, t] of dp) {
          const v1 = ndp.get(d + r) ?? 0;
          if (t + r > v1) ndp.set(d + r, t + r);
          const nd = Math.abs(d - r);
          const nt = t + r;
          const v2 = ndp.get(nd) ?? 0;
          if (nt > v2) ndp.set(nd, nt);
        }
        dp = ndp;
      }
      return dp;
    }

    steps.push({
      line: 1,
      explanation: `Meet-in-middle: split ${n} rods into two halves. Left: [${rods.slice(0, half).join(', ')}], Right: [${rods.slice(half).join(', ')}].`,
      variables: { n, half, leftRods: rods.slice(0, half), rightRods: rods.slice(half) },
      visualization: {
        type: 'array',
        array: rods,
        highlights: Object.fromEntries(rods.map((_, i) => [i, i < half ? 'active' : 'found'])),
        labels: Object.fromEntries(rods.map((v, i) => [i, i < half ? `L${v}` : `R${v}`])),
      },
    });

    const L = solve(rods.slice(0, half));
    const R = solve(rods.slice(half));

    const lEntries = [...L.entries()].slice(0, 6);
    steps.push({
      line: 8,
      explanation: `Left half enumeration done: ${L.size} diff states. Sample: ${lEntries.map(([d, t]) => `diff=${d}->total=${t}`).join(', ')}.`,
      variables: { leftStates: L.size },
      visualization: {
        type: 'dp' as const,
        table: {
          headers: ['Diff', 'Max Total (left)'],
          rows: lEntries.map(([d, t]) => ({
            label: `diff=${d}`,
            cells: [
              { value: d, highlight: 'active' as string },
              { value: t, highlight: 'active' as string },
            ],
          })),
        },
      },
    });

    const rEntries = [...R.entries()].slice(0, 6);
    steps.push({
      line: 9,
      explanation: `Right half enumeration done: ${R.size} diff states. Sample: ${rEntries.map(([d, t]) => `diff=${d}->total=${t}`).join(', ')}.`,
      variables: { rightStates: R.size },
      visualization: {
        type: 'dp' as const,
        table: {
          headers: ['Diff', 'Max Total (right)'],
          rows: rEntries.map(([d, t]) => ({
            label: `diff=${d}`,
            cells: [
              { value: d, highlight: 'found' as string },
              { value: t, highlight: 'found' as string },
            ],
          })),
        },
      },
    });

    let ans = 0;
    for (const [d, lt] of L) {
      if (R.has(d)) {
        const combined = Math.floor((lt + R.get(d)! + d) / 2);
        if (combined > ans) ans = combined;
      }
    }

    steps.push({
      line: 12,
      explanation: `Combine halves: for each diff d in left, if right also has diff d, compute height = (leftTotal+rightTotal+d)/2. Max billboard height: ${ans}.`,
      variables: { answer: ans },
      visualization: {
        type: 'array',
        array: rods,
        highlights: {},
        labels: Object.fromEntries(rods.map((v, i) => [i, `${v}`])),
      },
    });

    return steps;
  },
};

export default tallestBillboardDp;
