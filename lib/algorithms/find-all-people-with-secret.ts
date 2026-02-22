import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findAllPeopleWithSecret: AlgorithmDefinition = {
  id: 'find-all-people-with-secret',
  title: 'Find All People With Secret',
  leetcodeNumber: 2092,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Person 0 has a secret at time 0. Meetings happen at various times where people share what they know. Find all people who eventually know the secret. Sort meetings by time. For each time group, union all meeting participants. Anyone connected to a person who knows the secret joins the secret-knowing group. Reset isolated people after each time group.',
  tags: ['union find', 'graph', 'sorting', 'bfs'],

  code: {
    pseudocode: `function findAllPeople(n, meetings, firstPerson):
  // person 0 knows secret; union 0 with firstPerson
  parent = [0..n-1]
  union(0, firstPerson)
  // Sort meetings by time
  sort meetings by time
  // Process each time group
  for each time group of meetings:
    union all meeting pairs in this group
    // Reset those not connected to person 0
    for each pair in this group:
      if find(u) != find(0): reset u
      if find(v) != find(0): reset v
  // Collect all people who know the secret
  return [i for i in 0..n-1 if find(i) == find(0)]`,

    python: `def findAllPeople(n, meetings, firstPerson):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        pa, pb = find(a), find(b)
        if pa != pb: parent[pa] = pb
    union(0, firstPerson)
    meetings.sort(key=lambda x: x[2])
    i = 0
    while i < len(meetings):
        j = i
        while j < len(meetings) and meetings[j][2] == meetings[i][2]:
            j += 1
        group = meetings[i:j]
        for x, y, _ in group: union(x, y)
        for x, y, _ in group:
            if find(x) != find(0): parent[x] = x
            if find(y) != find(0): parent[y] = y
        i = j
    return [i for i in range(n) if find(i) == find(0)]`,

    javascript: `function findAllPeople(n, meetings, firstPerson) {
  const parent=Array.from({length:n},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  function union(a,b){const pa=find(a),pb=find(b);if(pa!==pb)parent[pa]=pb;}
  union(0,firstPerson);
  meetings.sort((a,b)=>a[2]-b[2]);
  let i=0;
  while(i<meetings.length){
    let j=i;
    while(j<meetings.length&&meetings[j][2]===meetings[i][2]) j++;
    const group=meetings.slice(i,j);
    group.forEach(([x,y])=>union(x,y));
    group.forEach(([x,y])=>{
      if(find(x)!==find(0))parent[x]=x;
      if(find(y)!==find(0))parent[y]=y;
    });
    i=j;
  }
  return Array.from({length:n},(_,i)=>i).filter(i=>find(i)===find(0));
}`,

    java: `public List<Integer> findAllPeople(int n, int[][] meetings, int firstPerson) {
    int[] parent=new int[n];
    for(int i=0;i<n;i++) parent[i]=i;
    union(parent,0,firstPerson);
    Arrays.sort(meetings,(a,b)->a[2]-b[2]);
    int i=0;
    while(i<meetings.length){
        int j=i;
        while(j<meetings.length&&meetings[j][2]==meetings[i][2]) j++;
        for(int k=i;k<j;k++) union(parent,meetings[k][0],meetings[k][1]);
        for(int k=i;k<j;k++){
            if(find(parent,meetings[k][0])!=find(parent,0)) parent[meetings[k][0]]=meetings[k][0];
            if(find(parent,meetings[k][1])!=find(parent,0)) parent[meetings[k][1]]=meetings[k][1];
        }
        i=j;
    }
    List<Integer> res=new ArrayList<>();
    for(int k=0;k<n;k++) if(find(parent,k)==find(parent,0)) res.add(k);
    return res;
}`,
  },

  defaultInput: {
    n: 6,
    meetings: [[1, 2, 5], [2, 3, 8], [1, 5, 10]],
    firstPerson: 1,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of People',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'People labeled 0 to n-1',
    },
    {
      name: 'firstPerson',
      label: 'First Person',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Person who receives secret from person 0 at time 0',
    },
    {
      name: 'meetings',
      label: 'Meetings',
      type: 'array',
      defaultValue: [[1, 2, 5], [2, 3, 8], [1, 5, 10]],
      placeholder: '[[1,2,5],[2,3,8]]',
      helperText: 'Each meeting is [personA, personB, time]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const meetings = input.meetings as number[][];
    const firstPerson = input.firstPerson as number;
    const steps: AlgorithmStep[] = [];

    const parent: number[] = Array.from({ length: n }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    function union(a: number, b: number): void {
      const pa = find(a), pb = find(b);
      if (pa !== pb) parent[pa] = pb;
    }

    steps.push({
      line: 1,
      explanation: `${n} people. Person 0 knows the secret. Union person 0 with person ${firstPerson} at time 0.`,
      variables: { n, firstPerson },
      visualization: {
        type: 'array',
        array: [...parent],
        highlights: { 0: 'found', [firstPerson]: 'found' },
        labels: { 0: 'secret', [firstPerson]: 'secret' },
      },
    });

    union(0, firstPerson);

    const sorted = [...meetings].sort((a, b) => a[2] - b[2]);

    steps.push({
      line: 5,
      explanation: `Sort ${meetings.length} meetings by time. Process each time group together.`,
      variables: { meetingCount: meetings.length },
      visualization: {
        type: 'array',
        array: [...parent],
        highlights: { 0: 'found', [firstPerson]: 'active' },
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `p${i}`])),
      },
    });

    let i = 0;
    while (i < sorted.length) {
      let j = i;
      while (j < sorted.length && sorted[j][2] === sorted[i][2]) j++;
      const group = sorted.slice(i, j);
      const time = group[0][2];

      steps.push({
        line: 8,
        explanation: `Time ${time}: ${group.length} meeting(s). Union all pairs in this time group.`,
        variables: { time, groupSize: group.length },
        visualization: {
          type: 'array',
          array: [...parent],
          highlights: Object.fromEntries(group.flatMap(([x, y]) => [[x, 'active'], [y, 'comparing']])),
          labels: { 0: `t=${time}` },
        },
      });

      for (const [x, y] of group) {
        union(x, y);
      }

      // Reset those not connected to person 0
      const reset: number[] = [];
      for (const [x, y] of group) {
        if (find(x) !== find(0)) { parent[x] = x; reset.push(x); }
        if (find(y) !== find(0)) { parent[y] = y; reset.push(y); }
      }

      steps.push({
        line: 10,
        explanation: `After time ${time}: reset isolated people [${reset.join(', ') || 'none'}] who are not connected to person 0.`,
        variables: { time, reset: reset.join(','), knowsSecret: Array.from({ length: n }, (_, k) => k).filter(k => find(k) === find(0)).join(',') },
        visualization: {
          type: 'array',
          array: [...parent],
          highlights: {
            ...Object.fromEntries(Array.from({ length: n }, (_, k) => [k, find(k) === find(0) ? 'found' : 'visited'])),
            ...Object.fromEntries(reset.map(r => [r, 'mismatch'])),
          },
          labels: Object.fromEntries(Array.from({ length: n }, (_, k) => [k, `r:${find(k)}`])),
        },
      });

      i = j;
    }

    const result = Array.from({ length: n }, (_, k) => k).filter(k => find(k) === find(0));

    steps.push({
      line: 13,
      explanation: `All meetings processed. People who know the secret: [${result.join(', ')}].`,
      variables: { result: result.join(',') },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((v, i) => [i, `p${v}`])),
      },
    });

    return steps;
  },
};

export default findAllPeopleWithSecret;
