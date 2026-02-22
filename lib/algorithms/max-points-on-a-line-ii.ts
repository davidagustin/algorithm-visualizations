import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxPointsOnALineII: AlgorithmDefinition = {
  id: 'max-points-on-a-line-ii',
  title: 'Max Points on a Line',
  leetcodeNumber: 149,
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Given an array of points, find the maximum number of points that lie on the same straight line. For each point, compute the slope to every other point using a hash map of reduced fractions (gcd normalization). The line through point i with most others gives the answer.',
  tags: ['math', 'geometry', 'hash map', 'gcd'],

  code: {
    pseudocode: `function maxPoints(points):
  n = len(points)
  if n <= 2: return n
  result = 2
  for i in range(n):
    slopes = {}
    for j in range(n):
      if i == j: continue
      dx = x2 - x1, dy = y2 - y1
      g = gcd(|dx|, |dy|)
      slope = (dy/g, dx/g) normalized
      slopes[slope] += 1
    result = max(result, max(slopes.values()) + 1)
  return result`,

    python: `from math import gcd
def maxPoints(points):
    n = len(points)
    if n <= 2: return n
    res = 2
    for i in range(n):
        cnt = {}
        for j in range(n):
            if i == j: continue
            dx = points[j][0]-points[i][0]
            dy = points[j][1]-points[i][1]
            g = gcd(abs(dx),abs(dy))
            key = (dx//g if g else 0, dy//g if g else 1)
            cnt[key] = cnt.get(key,0)+1
        res = max(res, max(cnt.values())+1)
    return res`,

    javascript: `function maxPoints(points) {
  const gcd = (a,b) => b===0?a:gcd(b,a%b);
  const n = points.length;
  if (n<=2) return n;
  let res = 2;
  for (let i=0;i<n;i++) {
    const map = new Map();
    for (let j=0;j<n;j++) {
      if (i===j) continue;
      let dx=points[j][0]-points[i][0],dy=points[j][1]-points[i][1];
      const g=gcd(Math.abs(dx),Math.abs(dy));
      if (g) { dx/=g; dy/=g; }
      if (dx<0||(dx===0&&dy<0)){dx=-dx;dy=-dy;}
      const k=dx+','+dy;
      map.set(k,(map.get(k)||0)+1);
    }
    res=Math.max(res,Math.max(...map.values())+1);
  }
  return res;
}`,

    java: `public int maxPoints(int[][] points) {
    int n=points.length; if(n<=2)return n;
    int res=2;
    for(int i=0;i<n;i++){
        Map<String,Integer>map=new HashMap<>();
        for(int j=0;j<n;j++){
            if(i==j)continue;
            int dx=points[j][0]-points[i][0],dy=points[j][1]-points[i][1];
            int g=gcd(Math.abs(dx),Math.abs(dy));
            if(g>0){dx/=g;dy/=g;}
            if(dx<0||(dx==0&&dy<0)){dx=-dx;dy=-dy;}
            String k=dx+","+dy;
            map.merge(k,1,Integer::sum);
        }
        res=Math.max(res,Collections.max(map.values())+1);
    }
    return res;
}`,
  },

  defaultInput: { points: [[1, 1], [2, 2], [3, 3], [1, 3], [2, 4]] },

  inputFields: [
    { name: 'points', label: 'Points', type: 'array', defaultValue: [[1, 1], [2, 2], [3, 3], [1, 3], [2, 4]], helperText: 'Array of [x,y] points' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const points = input.points as number[][];
    const n = points.length;
    const steps: AlgorithmStep[] = [];

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: points.map((_, i) => i), highlights, labels,
    });

    if (n <= 2) {
      steps.push({
        line: 2,
        explanation: `Only ${n} points. All lie on the same line. Return ${n}.`,
        variables: { result: n },
        visualization: makeViz(Object.fromEntries(points.map((_, i) => [i, 'found'])), Object.fromEntries(points.map((p, i) => [i, `(${p[0]},${p[1]})`]))),
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Find max collinear points from ${n} points. For each anchor point, map slopes to counts using GCD-normalized fractions.`,
      variables: { n, result: 2 },
      visualization: makeViz(
        Object.fromEntries(points.map((_, i) => [i, 'default'])),
        Object.fromEntries(points.map((p, i) => [i, `(${p[0]},${p[1]})`]))
      ),
    });

    let result = 2;

    for (let i = 0; i < n; i++) {
      const slopeMap = new Map<string, number>();

      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        let dx = points[j][0] - points[i][0];
        let dy = points[j][1] - points[i][1];
        const g = gcd(Math.abs(dx), Math.abs(dy));
        if (g > 0) { dx = Math.floor(dx / g); dy = Math.floor(dy / g); }
        if (dx < 0 || (dx === 0 && dy < 0)) { dx = -dx; dy = -dy; }
        const key = `${dx},${dy}`;
        slopeMap.set(key, (slopeMap.get(key) || 0) + 1);
      }

      const localMax = Math.max(...slopeMap.values()) + 1;
      const improved = localMax > result;
      if (improved) result = localMax;

      steps.push({
        line: 9,
        explanation: `Anchor point ${i} (${points[i][0]},${points[i][1]}): found ${slopeMap.size} distinct slopes. Max collinear = ${localMax}. ${improved ? `New result = ${result}!` : `Result stays ${result}.`}`,
        variables: { anchor: i, localMax, result },
        visualization: makeViz(
          Object.fromEntries(points.map((_, idx) => [idx, idx === i ? 'active' : improved ? 'found' : 'default'])),
          Object.fromEntries(points.map((p, idx) => [idx, `(${p[0]},${p[1]})`]))
        ),
      });
    }

    steps.push({
      line: 12,
      explanation: `Maximum points on a line: ${result}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(points.map((_, i) => [i, 'found'])),
        Object.fromEntries(points.map((p, i) => [i, `(${p[0]},${p[1]})`]))
      ),
    });

    return steps;
  },
};

export default maxPointsOnALineII;
