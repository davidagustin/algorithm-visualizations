import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rectangleAreaII: AlgorithmDefinition = {
  id: 'rectangle-area-ii',
  title: 'Rectangle Area II',
  leetcodeNumber: 850,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Compute the total area covered by a set of axis-aligned rectangles, handling overlaps. Use a coordinate compression sweep line: sort all x-coordinates, for each vertical strip compute the active y-coverage using a segment tree or interval union.',
  tags: ['Segment Tree', 'Line Sweep', 'Coordinate Compression', 'Array'],
  code: {
    pseudocode: `function rectangleArea(rectangles):
  MOD = 1e9 + 7
  // compress x and y coordinates
  xs = sorted unique x-values
  ys = sorted unique y-values
  // for each pair of consecutive x-values
  //   find all y-ranges active at this x-strip
  //   compute union length of y-intervals
  //   area += (x2 - x1) * union_y_length

  for each consecutive x strip [x1, x2]:
    active_y_intervals = rectangles overlapping this strip
    covered_y = union of [y1,y2] intervals
    area += (x2-x1) * covered_y`,
    python: `class Solution:
    def rectangleArea(self, rectangles):
        MOD = 10**9+7
        xs = sorted(set(x for r in rectangles for x in (r[0],r[2])))
        ys = sorted(set(y for r in rectangles for y in (r[1],r[3])))
        xi = {v:i for i,v in enumerate(xs)}
        yi = {v:i for i,v in enumerate(ys)}

        area = 0
        for i in range(len(xs)-1):
            x1,x2 = xs[i],xs[i+1]
            # find y-coverage for this x strip
            active = []
            for rx1,ry1,rx2,ry2 in rectangles:
                if rx1<=x1 and x2<=rx2:
                    active.append((ry1,ry2))
            # compute union of active y intervals
            active.sort()
            covered=0; cur=-1
            for a,b in active:
                if a>cur: covered+=b-a; cur=b
                elif b>cur: covered+=b-cur; cur=b
            area=(area+(x2-x1)*covered)%MOD
        return area`,
    javascript: `var rectangleArea = function(rectangles) {
  const MOD = 1e9+7;
  const xs=[...new Set(rectangles.flatMap(r=>[r[0],r[2]]))].sort((a,b)=>a-b);
  let area=0;
  for(let i=0;i<xs.length-1;i++){
    const [x1,x2]=[xs[i],xs[i+1]];
    const active=rectangles
      .filter(([rx1,,rx2])=>rx1<=x1&&x2<=rx2)
      .map(([,ry1,,ry2])=>[ry1,ry2])
      .sort((a,b)=>a[0]-b[0]);
    let covered=0, cur=-Infinity;
    for(const [a,b] of active){
      if(a>cur){covered+=b-a;cur=b;}
      else if(b>cur){covered+=b-cur;cur=b;}
    }
    area=(area+(x2-x1)*covered)%MOD;
  }
  return area;
};`,
    java: `class Solution {
    public int rectangleArea(int[][] rectangles) {
        final int MOD=(int)1e9+7;
        TreeSet<Integer> xSet=new TreeSet<>();
        for(int[] r:rectangles){xSet.add(r[0]);xSet.add(r[2]);}
        Integer[] xs=xSet.toArray(new Integer[0]);
        long area=0;
        for(int i=0;i<xs.length-1;i++){
            int x1=xs[i],x2=xs[i+1];
            List<int[]> active=new ArrayList<>();
            for(int[] r:rectangles)
                if(r[0]<=x1&&x2<=r[2]) active.add(new int[]{r[1],r[3]});
            active.sort((a,b)->a[0]-b[0]);
            long covered=0; int cur=0;
            for(int[] seg:active){
                if(seg[0]>cur){covered+=seg[1]-seg[0];cur=seg[1];}
                else if(seg[1]>cur){covered+=seg[1]-cur;cur=seg[1];}
            }
            area=(area+(long)(x2-x1)*covered)%MOD;
        }
        return (int)area;
    }
}`,
  },
  defaultInput: { rectangles: [[0,0,2,2],[1,0,3,1],[1,0,2,2]] },
  inputFields: [
    { name: 'rectangles', label: 'Rectangles [[x1,y1,x2,y2],...]', type: 'array', defaultValue: [[0,0,2,2],[1,0,3,1],[1,0,2,2]], helperText: 'List of rectangles' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rectangles = input.rectangles as number[][];
    const steps: AlgorithmStep[] = [];
    const MOD = 1000000007;

    const xs = [...new Set(rectangles.flatMap(r => [r[0], r[2]]))].sort((a, b) => a - b);

    steps.push({
      line: 1,
      explanation: `Sweep line over x-coordinates: [${xs.join(',')}]. For each x-strip, compute covered y-length.`,
      variables: { xs, rectangles },
      visualization: { type: 'array', array: xs, highlights: {}, labels: Object.fromEntries(xs.map((v,i)=>[i,`x=${v}`])) },
    });

    let totalArea = 0;
    const stripAreas: number[] = [];

    for (let i = 0; i < xs.length - 1; i++) {
      const x1 = xs[i], x2 = xs[i + 1];
      const active = rectangles
        .filter(([rx1,, rx2]) => rx1 <= x1 && x2 <= rx2)
        .map(([, ry1,, ry2]) => [ry1, ry2])
        .sort((a, b) => a[0] - b[0]);

      let covered = 0, cur = -Infinity;
      for (const [a, b] of active) {
        if (a > cur) { covered += b - a; cur = b; }
        else if (b > cur) { covered += b - cur; cur = b; }
      }

      const stripArea = (x2 - x1) * covered;
      totalArea = (totalArea + stripArea) % MOD;
      stripAreas.push(stripArea);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      highlights[i] = 'active';
      labels[i] = `w=${x2-x1},h=${covered}`;

      steps.push({
        line: 12,
        explanation: `Strip x=[${x1},${x2}]: ${active.length} active rects, y-coverage=${covered}, area=${stripArea}. Running total=${totalArea}`,
        variables: { x1, x2, covered, stripArea, totalArea, active },
        visualization: { type: 'array', array: xs.slice(0, -1).map((_, j) => stripAreas[j] ?? 0), highlights, labels },
      });
    }

    steps.push({
      line: 14,
      explanation: `Total covered area: ${totalArea} (mod 1e9+7)`,
      variables: { totalArea },
      visualization: {
        type: 'array',
        array: stripAreas,
        highlights: Object.fromEntries(stripAreas.map((_, i) => [i, 'found'])),
        labels: { 0: `total=${totalArea}` },
      },
    });

    return steps;
  },
};

export default rectangleAreaII;
