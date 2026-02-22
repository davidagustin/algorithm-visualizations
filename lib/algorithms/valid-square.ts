import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const validSquare: AlgorithmDefinition = {
  id: 'valid-square',
  title: 'Valid Square',
  leetcodeNumber: 593,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Given 4 points, determine if they form a valid square. A valid square has 4 equal sides and 2 equal diagonals (longer than sides). Compute all 6 pairwise distances squared and check: exactly 2 distinct values where smaller appears 4 times (sides) and larger appears 2 times (diagonals).',
  tags: ['math', 'geometry'],

  code: {
    pseudocode: `function validSquare(p1, p2, p3, p4):
  function dist2(a, b):
    return (a[0]-b[0])^2 + (a[1]-b[1])^2
  dists = sorted all 6 pairwise distances
  // Valid square: d[0]=d[1]=d[2]=d[3] > 0 and d[4]=d[5]
  return dists[0]==dists[3] and dists[4]==dists[5] and dists[0]>0`,

    python: `def validSquare(p1,p2,p3,p4):
    def dist2(a,b):
        return (a[0]-b[0])**2+(a[1]-b[1])**2
    pts=[p1,p2,p3,p4]
    dists=sorted(dist2(pts[i],pts[j])
                 for i in range(4) for j in range(i+1,4))
    return dists[0]==dists[3] and dists[4]==dists[5] and dists[0]>0`,

    javascript: `function validSquare(p1,p2,p3,p4) {
  const dist2=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2;
  const pts=[p1,p2,p3,p4];
  const dists=[];
  for(let i=0;i<4;i++)
    for(let j=i+1;j<4;j++)
      dists.push(dist2(pts[i],pts[j]));
  dists.sort((a,b)=>a-b);
  return dists[0]===dists[3]&&dists[4]===dists[5]&&dists[0]>0;
}`,

    java: `public boolean validSquare(int[]p1,int[]p2,int[]p3,int[]p4){
    int[][]pts={p1,p2,p3,p4};
    int[]dists=new int[6];int k=0;
    for(int i=0;i<4;i++)
      for(int j=i+1;j<4;j++){
        int dx=pts[i][0]-pts[j][0],dy=pts[i][1]-pts[j][1];
        dists[k++]=dx*dx+dy*dy;
      }
    Arrays.sort(dists);
    return dists[0]==dists[3]&&dists[4]==dists[5]&&dists[0]>0;
}`,
  },

  defaultInput: { p1: [0, 0], p2: [1, 1], p3: [1, 0], p4: [0, 1] },

  inputFields: [
    { name: 'p1', label: 'Point 1', type: 'array', defaultValue: [0, 0], helperText: '[x, y]' },
    { name: 'p2', label: 'Point 2', type: 'array', defaultValue: [1, 1], helperText: '[x, y]' },
    { name: 'p3', label: 'Point 3', type: 'array', defaultValue: [1, 0], helperText: '[x, y]' },
    { name: 'p4', label: 'Point 4', type: 'array', defaultValue: [0, 1], helperText: '[x, y]' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const pts = [
      input.p1 as number[],
      input.p2 as number[],
      input.p3 as number[],
      input.p4 as number[],
    ];
    const steps: AlgorithmStep[] = [];

    const dist2 = (a: number[], b: number[]): number =>
      (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]);

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    steps.push({
      line: 1,
      explanation: `Check if 4 points form a square: ${pts.map(p => `(${p[0]},${p[1]})`).join(', ')}.`,
      variables: { points: pts.map(p => `(${p[0]},${p[1]})`).join(', ') },
      visualization: makeViz(pts.map((_, i) => i), Object.fromEntries(pts.map((_, i) => [i, 'default'])), Object.fromEntries(pts.map((p, i) => [i, `(${p[0]},${p[1]})`]))),
    });

    const distances: number[] = [];
    const pairs: string[] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const d = dist2(pts[i], pts[j]);
        distances.push(d);
        pairs.push(`d(${i},${j})`);

        steps.push({
          line: 3,
          explanation: `dist²(${i},${j}) = (${pts[i][0]}-${pts[j][0]})²+(${pts[i][1]}-${pts[j][1]})² = ${d}.`,
          variables: { pair: `(${i},${j})`, distance: d },
          visualization: makeViz(
            distances,
            Object.fromEntries(distances.map((_, k) => [k, k === distances.length - 1 ? 'active' : 'default'])),
            Object.fromEntries(pairs.map((p, k) => [k, `${p}=${distances[k]}`]))
          ),
        });
      }
    }

    const sorted = [...distances].sort((a, b) => a - b);
    const isValid = sorted[0] === sorted[3] && sorted[4] === sorted[5] && sorted[0] > 0;

    steps.push({
      line: 6,
      explanation: `Sorted distances²: [${sorted.join(', ')}]. Side²=${sorted[0]} (×4), diagonal²=${sorted[4]} (×2). Valid square: ${isValid}.`,
      variables: { sorted: sorted.join(','), side2: sorted[0], diag2: sorted[4], result: isValid },
      visualization: makeViz(
        sorted,
        Object.fromEntries(sorted.map((_, i) => [i, i < 4 ? (isValid ? 'found' : 'mismatch') : (isValid ? 'active' : 'mismatch')])),
        { 0: 'side', 1: 'side', 2: 'side', 3: 'side', 4: 'diag', 5: 'diag' }
      ),
    });

    return steps;
  },
};

export default validSquare;
