import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfFlowersInFullBloom: AlgorithmDefinition = {
  id: 'number-of-flowers-in-full-bloom',
  title: 'Number of Flowers in Full Bloom',
  leetcodeNumber: 2251,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given flower bloom intervals [start,end] and person arrival times, count how many flowers are blooming when each person arrives. Sort bloom starts and ends separately. For person at time t: blooms started = upper_bound(starts, t), blooms ended = upper_bound(ends, t-1). Answer = started - ended.',
  tags: ['Binary Search', 'Prefix Sum', 'Sorting', 'Hash Map'],
  code: {
    pseudocode: `function fullBloomFlowers(flowers, people):
  starts = sorted list of bloom start times
  ends = sorted list of bloom end times

  result = []
  for t in people:
    // flowers that have started by time t
    started = upper_bound(starts, t)
    // flowers that have ended before time t (end < t, i.e., end <= t-1)
    ended = upper_bound(ends, t - 1)
    result.append(started - ended)

  return result`,
    python: `class Solution:
    def fullBloomFlowers(self, flowers, people):
        from bisect import bisect_right
        starts = sorted(f[0] for f in flowers)
        ends = sorted(f[1] for f in flowers)
        return [bisect_right(starts, t) - bisect_right(ends, t-1) for t in people]`,
    javascript: `var fullBloomFlowers = function(flowers, people) {
  const starts = flowers.map(f=>f[0]).sort((a,b)=>a-b);
  const ends = flowers.map(f=>f[1]).sort((a,b)=>a-b);
  const ub = (arr, v) => {
    let lo=0, hi=arr.length;
    while(lo<hi){const m=(lo+hi)>>1; arr[m]<=v?lo=m+1:hi=m;}
    return lo;
  };
  return people.map(t => ub(starts,t) - ub(ends,t-1));
};`,
    java: `class Solution {
    public int[] fullBloomFlowers(int[][] flowers, int[] people) {
        int[] starts=new int[flowers.length], ends=new int[flowers.length];
        for(int i=0;i<flowers.length;i++){starts[i]=flowers[i][0];ends[i]=flowers[i][1];}
        Arrays.sort(starts); Arrays.sort(ends);
        int[] res=new int[people.length];
        for(int i=0;i<people.length;i++){
            int t=people[i];
            res[i]=upperBound(starts,t)-upperBound(ends,t-1);
        }
        return res;
    }
    int upperBound(int[] a,int v){int lo=0,hi=a.length;while(lo<hi){int m=(lo+hi)/2;a[m]<=v?lo=m+1:hi=m;}return lo;}
}`,
  },
  defaultInput: { flowers: [[1,6],[3,7],[9,12],[4,13]], people: [2,3,7,11] },
  inputFields: [
    { name: 'flowers', label: 'Flowers [[start,end],...]', type: 'array', defaultValue: [[1,6],[3,7],[9,12],[4,13]], helperText: 'Bloom intervals' },
    { name: 'people', label: 'People arrival times', type: 'array', defaultValue: [2,3,7,11], placeholder: '2,3,7,11' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flowers = input.flowers as number[][];
    const people = input.people as number[];
    const steps: AlgorithmStep[] = [];

    const starts = flowers.map(f => f[0]).sort((a, b) => a - b);
    const ends = flowers.map(f => f[1]).sort((a, b) => a - b);

    steps.push({
      line: 1,
      explanation: `Flowers bloom starts: [${starts.join(',')}], ends: [${ends.join(',')}]. People arrive at: [${people.join(',')}]`,
      variables: { starts, ends, people },
      visualization: { type: 'array', array: starts, highlights: {}, labels: Object.fromEntries(starts.map((v,i)=>[i,`s=${v}`])) },
    });

    const ub = (arr: number[], v: number) => {
      let lo = 0, hi = arr.length;
      while (lo < hi) { const m = (lo + hi) >> 1; arr[m] <= v ? lo = m + 1 : hi = m; }
      return lo;
    };

    const results: number[] = [];

    for (let i = 0; i < people.length; i++) {
      const t = people[i];
      const started = ub(starts, t);
      const ended = ub(ends, t - 1);
      const blooming = started - ended;
      results.push(blooming);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      flowers.forEach(([s, e], fi) => {
        const active = s <= t && t <= e;
        highlights[fi] = active ? 'found' : 'visited';
        labels[fi] = `[${s},${e}]`;
      });

      steps.push({
        line: 6,
        explanation: `Person at t=${t}: ${started} flowers started, ${ended} flowers ended, ${blooming} currently blooming`,
        variables: { t, started, ended, blooming },
        visualization: {
          type: 'array',
          array: flowers.map(([s, e]) => s <= t && t <= e ? 1 : 0),
          highlights,
          labels,
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `Results: [${results.join(', ')}] flowers blooming for each person`,
      variables: { results },
      visualization: {
        type: 'array',
        array: results,
        highlights: Object.fromEntries(results.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(results.map((v, i) => [i, `${v}`])),
      },
    });

    return steps;
  },
};

export default numberOfFlowersInFullBloom;
