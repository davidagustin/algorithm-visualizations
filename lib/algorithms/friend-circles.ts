import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const friendCircles: AlgorithmDefinition = {
  id: 'friend-circles',
  title: 'Friend Circles (Number of Provinces)',
  leetcodeNumber: 547,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an n x n adjacency matrix isConnected where isConnected[i][j]=1 means person i and j are friends, count the total number of friend circles (connected components). Use union find to merge all directly connected people. The number of remaining components is the answer.',
  tags: ['union find', 'graph', 'connected components', 'adjacency matrix'],

  code: {
    pseudocode: `function findCircleNum(isConnected):
  n = len(isConnected)
  parent = [0..n-1]
  components = n
  for i in 0..n-1:
    for j in i+1..n-1:
      if isConnected[i][j] == 1:
        rootI = find(i), rootJ = find(j)
        if rootI != rootJ:
          union(rootI, rootJ)
          components -= 1
  return components`,

    python: `def findCircleNum(isConnected):
    n = len(isConnected)
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    components = n
    for i in range(n):
        for j in range(i+1, n):
            if isConnected[i][j] == 1:
                ri, rj = find(i), find(j)
                if ri != rj:
                    parent[ri] = rj
                    components -= 1
    return components`,

    javascript: `function findCircleNum(isConnected) {
  const n=isConnected.length;
  const parent=Array.from({length:n},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  let components=n;
  for(let i=0;i<n;i++)
    for(let j=i+1;j<n;j++)
      if(isConnected[i][j]===1){
        const ri=find(i),rj=find(j);
        if(ri!==rj){parent[ri]=rj;components--;}
      }
  return components;
}`,

    java: `public int findCircleNum(int[][] isConnected) {
    int n=isConnected.length;
    int[]parent=new int[n];
    for(int i=0;i<n;i++) parent[i]=i;
    int components=n;
    for(int i=0;i<n;i++)
        for(int j=i+1;j<n;j++)
            if(isConnected[i][j]==1){
                int ri=find(parent,i),rj=find(parent,j);
                if(ri!=rj){parent[ri]=rj;components--;}
            }
    return components;
}`,
  },

  defaultInput: {
    isConnected: [[1, 1, 0], [1, 1, 0], [0, 0, 1]],
  },

  inputFields: [
    {
      name: 'isConnected',
      label: 'Adjacency Matrix',
      type: 'array',
      defaultValue: [[1, 1, 0], [1, 1, 0], [0, 0, 1]],
      placeholder: '[[1,1,0],[1,1,0],[0,0,1]]',
      helperText: 'n x n matrix: isConnected[i][j]=1 if i and j are friends',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const isConnected = input.isConnected as number[][];
    const steps: AlgorithmStep[] = [];
    const n = isConnected.length;

    const parent: number[] = Array.from({ length: n }, (_, i) => i);
    let components = n;

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    steps.push({
      line: 1,
      explanation: `${n} people in adjacency matrix. Each person starts as their own friend circle. Total circles: ${n}.`,
      variables: { n, components },
      visualization: {
        type: 'array',
        array: [...parent],
        highlights: {},
        labels: Object.fromEntries(parent.map((_, i) => [i, `p${i}`])),
      },
    });

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        steps.push({
          line: 5,
          explanation: `Check isConnected[${i}][${j}] = ${isConnected[i][j]}. ${isConnected[i][j] === 1 ? 'Friends! Check if in same circle.' : 'Not friends.'}`,
          variables: { i, j, connected: isConnected[i][j] },
          visualization: {
            type: 'array',
            array: [...parent],
            highlights: { [i]: 'active', [j]: 'comparing' },
            labels: { [i]: `p${i}`, [j]: `p${j}` },
          },
        });

        if (isConnected[i][j] === 1) {
          const ri = find(i);
          const rj = find(j);

          if (ri !== rj) {
            parent[ri] = rj;
            components--;

            steps.push({
              line: 8,
              explanation: `Merge circle of person ${i} (root ${ri}) with circle of person ${j} (root ${rj}). Circles: ${components}.`,
              variables: { i, j, ri, rj, components },
              visualization: {
                type: 'array',
                array: [...parent],
                highlights: { [i]: 'found', [j]: 'found', [ri]: 'active' },
                labels: { [ri]: `-> ${rj}`, [i]: `circle:${rj}`, [j]: `circle:${rj}` },
              },
            });
          } else {
            steps.push({
              line: 7,
              explanation: `Person ${i} and ${j} already in same circle (root=${ri}). No merge needed.`,
              variables: { i, j, commonRoot: ri, components },
              visualization: {
                type: 'array',
                array: [...parent],
                highlights: { [i]: 'visited', [j]: 'visited' },
                labels: { [i]: 'same', [j]: 'same' },
              },
            });
          }
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `All pairs processed. Total friend circles: ${components}.`,
      variables: { result: components },
      visualization: {
        type: 'array',
        array: [...parent],
        highlights: Object.fromEntries(parent.map((v, i) => [i, v === i ? 'found' : 'sorted'])),
        labels: { 0: `circles:${components}` },
      },
    });

    return steps;
  },
};

export default friendCircles;
