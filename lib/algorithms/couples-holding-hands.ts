import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const couplesHoldingHands: AlgorithmDefinition = {
  id: 'couples-holding-hands',
  title: 'Couples Holding Hands',
  leetcodeNumber: 765,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'N couples sit in 2N seats. Couple k consists of persons 2k and 2k+1. Find the minimum number of swaps so every couple is sitting together. Use union find on couples (person i belongs to couple i/2). For each adjacent pair, if they belong to different couples, union those couples. The answer is the number of merged pairs (unions performed).',
  tags: ['union find', 'graph', 'greedy', 'cycle counting'],

  code: {
    pseudocode: `function minSwapsCouples(row):
  n = len(row) // 2 // number of couples
  parent = [0..n-1]
  swaps = 0
  for i in 0, 2, 4, ..., len(row)-2:
    coupleA = row[i] // 2
    coupleB = row[i+1] // 2
    rootA = find(coupleA), rootB = find(coupleB)
    if rootA != rootB:
      union(rootA, rootB)
      swaps += 1
  return swaps`,

    python: `def minSwapsCouples(row):
    n = len(row) // 2
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    swaps = 0
    for i in range(0, len(row), 2):
        ca = row[i] // 2
        cb = row[i+1] // 2
        ra, rb = find(ca), find(cb)
        if ra != rb:
            parent[ra] = rb
            swaps += 1
    return swaps`,

    javascript: `function minSwapsCouples(row) {
  const n=row.length>>1;
  const parent=Array.from({length:n},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  let swaps=0;
  for(let i=0;i<row.length;i+=2){
    const ca=row[i]>>1, cb=row[i+1]>>1;
    const ra=find(ca), rb=find(cb);
    if(ra!==rb){parent[ra]=rb;swaps++;}
  }
  return swaps;
}`,

    java: `public int minSwapsCouples(int[] row) {
    int n=row.length/2;
    int[]parent=new int[n];
    for(int i=0;i<n;i++) parent[i]=i;
    int swaps=0;
    for(int i=0;i<row.length;i+=2){
        int ca=row[i]/2, cb=row[i+1]/2;
        int ra=find(parent,ca), rb=find(parent,cb);
        if(ra!=rb){parent[ra]=rb;swaps++;}
    }
    return swaps;
}`,
  },

  defaultInput: {
    row: [0, 2, 1, 3],
  },

  inputFields: [
    {
      name: 'row',
      label: 'Row',
      type: 'array',
      defaultValue: [0, 2, 1, 3],
      placeholder: '0,2,1,3',
      helperText: 'Seating arrangement. Person 2k and 2k+1 are a couple',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const row = input.row as number[];
    const steps: AlgorithmStep[] = [];
    const n = row.length >> 1;
    const parent: number[] = Array.from({ length: n }, (_, i) => i);
    let swaps = 0;

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    steps.push({
      line: 1,
      explanation: `${n} couples in ${row.length} seats: [${row}]. Person 2k and 2k+1 form couple k. Check each adjacent pair.`,
      variables: { n, row: row.join(',') },
      visualization: {
        type: 'array',
        array: [...row],
        highlights: {},
        labels: Object.fromEntries(row.map((v, i) => [i, `p${v}`])),
      },
    });

    for (let i = 0; i < row.length; i += 2) {
      const ca = row[i] >> 1;
      const cb = row[i + 1] >> 1;
      const ra = find(ca);
      const rb = find(cb);

      steps.push({
        line: 5,
        explanation: `Seats ${i} and ${i + 1}: persons ${row[i]} and ${row[i + 1]} belong to couples ${ca} and ${cb}. find(${ca})=${ra}, find(${cb})=${rb}. ${ra !== rb ? 'Different couples - need a swap.' : 'Already same couple!'}`,
        variables: { seatPair: [i, i + 1], person1: row[i], person2: row[i + 1], couple1: ca, couple2: cb, swaps },
        visualization: {
          type: 'array',
          array: [...row],
          highlights: { [i]: 'active', [i + 1]: 'comparing' },
          labels: { [i]: `c${ca}`, [i + 1]: `c${cb}` },
        },
      });

      if (ra !== rb) {
        parent[ra] = rb;
        swaps++;

        steps.push({
          line: 8,
          explanation: `Union couple ${ca} and couple ${cb}. This represents one swap operation. Swaps so far: ${swaps}.`,
          variables: { swaps, mergedCouples: [ca, cb] },
          visualization: {
            type: 'array',
            array: [...row],
            highlights: { [i]: 'found', [i + 1]: 'found' },
            labels: { [i]: `swap${swaps}`, [i + 1]: `swap${swaps}` },
          },
        });
      } else {
        steps.push({
          line: 7,
          explanation: `Seats ${i} and ${i + 1} already hold couple ${ca}. No swap needed.`,
          variables: { swaps },
          visualization: {
            type: 'array',
            array: [...row],
            highlights: { [i]: 'sorted', [i + 1]: 'sorted' },
            labels: { [i]: 'ok', [i + 1]: 'ok' },
          },
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Minimum swaps to seat all couples together: ${swaps}.`,
      variables: { result: swaps },
      visualization: {
        type: 'array',
        array: [...parent],
        highlights: Object.fromEntries(parent.map((v, i) => [i, v === i ? 'found' : 'sorted'])),
        labels: { 0: `swaps:${swaps}` },
      },
    });

    return steps;
  },
};

export default couplesHoldingHands;
