import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countWaysToBuildRooms: AlgorithmDefinition = {
  id: 'count-ways-to-build-rooms',
  title: 'Count Ways to Build Rooms in an Ant Colony',
  leetcodeNumber: 1916,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a tree rooted at node 0 (prevRoom[i] is the parent of room i), count the number of valid topological orderings to build all rooms (each room must be built after its prevRoom). Use topological sort with combinatorics: multiply factorial of subtree sizes and divide by product of child subtree factorials.',
  tags: ['Graph', 'Topological Sort', 'Combinatorics', 'Tree'],
  code: {
    pseudocode: `function waysToBuildRooms(prevRoom):
  n = len(prevRoom)
  MOD = 1e9+7
  adj = children list from prevRoom
  size = [1]*n  // subtree sizes
  inDegree = [0]*n; for p in prevRoom[1:]: inDegree[p]++? no
  // process leaves to root
  queue = leaf nodes
  while queue:
    node = queue.dequeue()
    parent = prevRoom[node]
    size[parent] += size[node]
    answer[parent] = answer[parent]*answer[node]*inv(size[node]!) % MOD
    if node is last child of parent: queue.add(parent)
  ans[root] *= (n-1)!
  return ans[root]`,
    python: `def waysToBuildRooms(prevRoom):
    MOD=10**9+7
    n=len(prevRoom)
    children=[[]for _ in range(n)]
    for i in range(1,n): children[prevRoom[i]].append(i)
    size=[1]*n; ans=[1]*n
    inDeg=[len(children[i])for i in range(n)]
    q=deque(i for i in range(n) if not children[i])
    fact=[1]*(n+1)
    for i in range(1,n+1): fact[i]=fact[i-1]*i%MOD
    inv_fact=[1]*(n+1)
    inv_fact[n]=pow(fact[n],MOD-2,MOD)
    for i in range(n-1,-1,-1): inv_fact[i]=inv_fact[i+1]*(i+1)%MOD
    while q:
        node=q.popleft()
        p=prevRoom[node]
        ans[p]=ans[p]*ans[node]%MOD*inv_fact[size[node]]%MOD
        size[p]+=size[node]
        inDeg[p]-=1
        if inDeg[p]==0 and p: q.append(p)
    return ans[0]*fact[n-1]%MOD`,
    javascript: `function waysToBuildRooms(prevRoom) {
  const MOD=BigInt(1e9+7), n=prevRoom.length;
  const children=Array.from({length:n},()=>[]);
  for(let i=1;i<n;i++)children[prevRoom[i]].push(i);
  const size=new Array(n).fill(1), ans=new Array(n).fill(1n);
  const inDeg=children.map(c=>c.length);
  const fact=new Array(n+1).fill(1n);
  for(let i=1;i<=n;i++)fact[i]=fact[i-1]*BigInt(i)%MOD;
  const modpow=(b,e,m)=>{let r=1n;b%=m;while(e>0n){if(e&1n)r=r*b%m;b=b*b%m;e>>=1n;}return r;};
  const invFact=new Array(n+1).fill(1n);
  invFact[n]=modpow(fact[n],MOD-2n,MOD);
  for(let i=n-1;i>=0;i--)invFact[i]=invFact[i+1]*BigInt(i+1)%MOD;
  const q=[];for(let i=0;i<n;i++)if(!inDeg[i])q.push(i);
  while(q.length){
    const node=q.shift(),p=prevRoom[node];
    if(p<0)continue;
    ans[p]=ans[p]*ans[node]%MOD*invFact[size[node]]%MOD;
    size[p]+=size[node];
    if(--inDeg[p]===0&&p)q.push(p);
  }
  return Number(ans[0]*fact[n-1]%MOD);
}`,
    java: `public int waysToBuildRooms(int[] prevRoom) {
    int n=prevRoom.length; long MOD=1000000007L;
    List<Integer>[]ch=new List[n];for(int i=0;i<n;i++)ch[i]=new ArrayList<>();
    for(int i=1;i<n;i++)ch[prevRoom[i]].add(i);
    int[]sz=new int[n],inDeg=new int[n];Arrays.fill(sz,1);
    for(int i=0;i<n;i++)inDeg[i]=ch[i].size();
    long[]fact=new long[n+1],invF=new long[n+1],ans=new long[n];
    fact[0]=1;for(int i=1;i<=n;i++)fact[i]=fact[i-1]*i%MOD;
    invF[n]=pow(fact[n],MOD-2,MOD);for(int i=n-1;i>=0;i--)invF[i]=invF[i+1]*(i+1)%MOD;
    Arrays.fill(ans,1);
    Queue<Integer>q=new LinkedList<>();for(int i=0;i<n;i++)if(inDeg[i]==0)q.add(i);
    while(!q.isEmpty()){int node=q.poll(),p=prevRoom[node];if(p<0)continue;
        ans[p]=ans[p]*ans[node]%MOD*invF[sz[node]]%MOD;sz[p]+=sz[node];if(--inDeg[p]==0&&p!=0)q.add(p);}
    return(int)(ans[0]*fact[n-1]%MOD);
}`,
  },
  defaultInput: {
    prevRoom: [-1, 0, 1, 1, 2],
  },
  inputFields: [
    {
      name: 'prevRoom',
      label: 'Previous Room Array',
      type: 'array',
      defaultValue: [-1, 0, 1, 1, 2],
      placeholder: '[-1,0,1,1,2]',
      helperText: 'prevRoom[i] = parent room that must be built before room i (-1 for root)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prevRoom = input.prevRoom as number[];
    const n = prevRoom.length;
    const MOD = 1000000007;
    const steps: AlgorithmStep[] = [];

    const children: number[][] = Array.from({ length: n }, () => []);
    for (let i = 1; i < n; i++) children[prevRoom[i]].push(i);

    const size = new Array(n).fill(1);
    const inDeg = children.map(c => c.length);

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      queue: number[],
      result: number
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...size],
        highlights,
        labels,
        auxData: {
          label: 'Count Room Build Orders',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.join(', ') : 'empty' },
            { key: 'Subtree Sizes', value: size.map((s, i) => `${i}:${s}`).join(' ') },
            { key: 'Answer (mod)', value: String(result) },
          ],
        },
      };
    }

    // Precompute factorials
    const fact = new Array(n + 1).fill(1);
    for (let i = 1; i <= n; i++) fact[i] = (fact[i - 1] * i) % MOD;

    function modpow(base: number, exp: number, mod: number): number {
      let result = 1; base %= mod;
      while (exp > 0) { if (exp & 1) result = result * base % mod; base = base * base % mod; exp >>= 1; }
      return result;
    }

    const invFact = new Array(n + 1).fill(1);
    invFact[n] = modpow(fact[n], MOD - 2, MOD);
    for (let i = n - 1; i >= 0; i--) invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;

    const ans = new Array(n).fill(1);

    steps.push({
      line: 1,
      explanation: `Tree with ${n} rooms. prevRoom=[${prevRoom.join(',')}]. Children counts: [${children.map(c => c.length).join(', ')}].`,
      variables: { n, prevRoom },
      visualization: makeViz(
        {},
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `r${i}:sz1`])),
        [],
        0
      ),
    });

    const queue: number[] = [];
    for (let i = 0; i < n; i++) if (inDeg[i] === 0) queue.push(i);

    steps.push({
      line: 8,
      explanation: `Start from leaf rooms (no children): [${queue.join(', ')}]. Process bottom-up.`,
      variables: { leaves: [...queue] },
      visualization: makeViz(
        Object.fromEntries(queue.map(q => [q, 'active'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `r${i}:sz${size[i]}`])),
        [...queue],
        0
      ),
    });

    while (queue.length > 0) {
      const node = queue.shift()!;
      const p = prevRoom[node];
      if (p < 0) continue;

      ans[p] = (ans[p] * ans[node]) % MOD;
      ans[p] = (ans[p] * invFact[size[node]]) % MOD;
      size[p] += size[node];
      inDeg[p]--;
      if (inDeg[p] === 0 && p !== 0) queue.push(p);

      steps.push({
        line: 11,
        explanation: `Room ${node} (subtree size ${size[node] - size[node] + size[node]}) processed. Update parent room ${p}: size[${p}]=${size[p]}, multiply inv_fact[${size[node]}].`,
        variables: { node, p, sizeP: size[p], ans: ans[p] },
        visualization: makeViz(
          { [node]: 'found', [p]: inDeg[p] === 0 ? 'active' : 'comparing' },
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `r${i}:sz${size[i]}`])),
          [...queue],
          (ans[0] * fact[n - 1]) % MOD
        ),
      });
    }

    const result = (ans[0] * fact[n - 1]) % MOD;

    steps.push({
      line: 15,
      explanation: `Final answer: ans[0] * (n-1)! mod 10^9+7 = ${ans[0]} * ${fact[n - 1]} % MOD = ${result}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'found'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `r${i}:sz${size[i]}`])),
        [],
        result
      ),
    });

    return steps;
  },
};

export default countWaysToBuildRooms;
