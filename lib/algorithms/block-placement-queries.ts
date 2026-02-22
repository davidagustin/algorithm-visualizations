import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const blockPlacementQueries: AlgorithmDefinition = {
  id: 'block-placement-queries',
  title: 'Block Placement Queries',
  leetcodeNumber: 2940,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Process queries on a number line [0, inf]. Type 1: place an obstacle at x. Type 2: can we place a block of size sz ending at position x (i.e., does [x-sz+1, x] have no obstacle)? Use a sorted set of obstacle positions and binary search to check gaps.',
  tags: ['Segment Tree', 'Binary Search', 'Sorted Set', 'Design'],
  code: {
    pseudocode: `function getResults(queries):
  obstacles = sorted set with {0} initially
  results = []

  for each query [type, x, sz?]:
    if type == 1:
      obstacles.insert(x)
    else (type == 2):
      // find largest gap ending at or before x
      prev = largest obstacle position <= x
      // gap between prev and the obstacle before prev must be >= sz
      // i.e., prev - prev_prev >= sz  OR  x - prev >= sz
      if x - prev >= sz: results.append(True)
      else:
        prev_prev = obstacle before prev
        results.append(prev - prev_prev >= sz)

  return results`,
    python: `from sortedcontainers import SortedList

class Solution:
    def getResults(self, queries):
        obstacles = SortedList([0])
        results = []
        max_gap = 0  # max gap considering segment tree approach

        for q in queries:
            if q[0] == 1:
                x = q[1]
                idx = obstacles.bisect_left(x)
                prev = obstacles[idx-1]
                nxt = obstacles[idx] if idx < len(obstacles) else float('inf')
                # removing gap [prev, nxt], adding [prev,x] and [x, nxt]
                obstacles.add(x)
            else:
                x, sz = q[1], q[2]
                idx = obstacles.bisect_right(x) - 1
                prev = obstacles[idx]
                if x - prev >= sz:
                    results.append(True)
                elif idx > 0:
                    prev_prev = obstacles[idx-1]
                    results.append(prev - prev_prev >= sz)
                else:
                    results.append(False)
        return results`,
    javascript: `var getResults = function(queries) {
  const obs = [0]; // sorted obstacles
  const res = [];
  for (const q of queries) {
    if (q[0] === 1) {
      let lo=0,hi=obs.length;
      while(lo<hi){const m=(lo+hi)>>1;obs[m]<q[1]?lo=m+1:hi=m;}
      obs.splice(lo,0,q[1]);
    } else {
      const [,x,sz]=q;
      let lo=0,hi=obs.length;
      while(lo<hi){const m=(lo+hi)>>1;obs[m]<=x?lo=m+1:hi=m;}
      const idx=lo-1;
      const prev=obs[idx];
      if(x-prev>=sz){res.push(true);}
      else if(idx>0){res.push(prev-obs[idx-1]>=sz);}
      else{res.push(false);}
    }
  }
  return res;
};`,
    java: `class Solution {
    public boolean[] getResults(int[][] queries) {
        TreeSet<Integer> obs=new TreeSet<>(); obs.add(0);
        List<Boolean> res=new ArrayList<>();
        for(int[]q:queries){
            if(q[0]==1) obs.add(q[1]);
            else{
                int x=q[1],sz=q[2];
                int prev=obs.floor(x);
                if(x-prev>=sz){res.add(true);}
                else{Integer pp=obs.lower(prev);res.add(pp!=null&&prev-pp>=sz);}
            }
        }
        return res.stream().mapToInt(b->b?1:0).collect(...);
    }
}`,
  },
  defaultInput: { queries: [[1,2],[2,3,3],[2,3,1],[2,2,2]] },
  inputFields: [
    { name: 'queries', label: 'Queries [[type,x,sz?],...]', type: 'array', defaultValue: [[1,2],[2,3,3],[2,3,1],[2,2,2]], helperText: 'type 1: obstacle at x; type 2: can place block of size sz ending at x?' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const queries = input.queries as number[][];
    const steps: AlgorithmStep[] = [];

    const obstacles: number[] = [0];
    const results: boolean[] = [];

    steps.push({
      line: 1,
      explanation: `Block Placement: number line starts with obstacle at 0. Processing ${queries.length} queries.`,
      variables: { obstacles: [...obstacles] },
      visualization: { type: 'array', array: [0], highlights: { 0: 'active' }, labels: { 0: 'obs=0' } },
    });

    for (const q of queries) {
      if (q[0] === 1) {
        const x = q[1];
        let lo = 0, hi = obstacles.length;
        while (lo < hi) { const m = (lo + hi) >> 1; obstacles[m] < x ? lo = m + 1 : hi = m; }
        obstacles.splice(lo, 0, x);

        steps.push({
          line: 4,
          explanation: `Query 1: place obstacle at x=${x}. Obstacles: [${obstacles.join(',')}]`,
          variables: { type: 1, x, obstacles: [...obstacles] },
          visualization: {
            type: 'array',
            array: [...obstacles],
            highlights: { [obstacles.indexOf(x)]: 'swapping' },
            labels: { [obstacles.indexOf(x)]: `obs=${x}` },
          },
        });
      } else {
        const [, x, sz] = q;
        let lo = 0, hi = obstacles.length;
        while (lo < hi) { const m = (lo + hi) >> 1; obstacles[m] <= x ? lo = m + 1 : hi = m; }
        const idx = lo - 1;
        const prev = obstacles[idx];

        let canPlace = false;
        if (x - prev >= sz) {
          canPlace = true;
        } else if (idx > 0) {
          const prevPrev = obstacles[idx - 1];
          canPlace = prev - prevPrev >= sz;
        }

        results.push(canPlace);

        steps.push({
          line: 8,
          explanation: `Query 2: place block size=${sz} ending at x=${x}. prev_obstacle=${prev}, gap=${x-prev}. ${canPlace ? 'YES — fits!' : 'NO — does not fit'}`,
          variables: { type: 2, x, sz, prev, gap: x - prev, canPlace },
          visualization: {
            type: 'array',
            array: [...obstacles],
            highlights: { [idx]: canPlace ? 'found' : 'mismatch' },
            labels: { [idx]: `gap=${x-prev}` },
          },
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Results: [${results.join(', ')}]`,
      variables: { results },
      visualization: {
        type: 'array',
        array: results.map(b => b ? 1 : 0),
        highlights: Object.fromEntries(results.map((b, i) => [i, b ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(results.map((b, i) => [i, `${b}`])),
      },
    });

    return steps;
  },
};

export default blockPlacementQueries;
