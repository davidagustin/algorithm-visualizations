import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const setIntersectionSizeAtLeastTwo: AlgorithmDefinition = {
  id: 'set-intersection-size-at-least-two',
  title: 'Set Intersection Size At Least Two',
  leetcodeNumber: 757,
  difficulty: 'Hard',
  category: 'Interval',
  description:
    'Find the minimum size of a set S such that every interval [a,b] contains at least 2 elements of S. Sort intervals by end ascending, then by start descending for ties. Greedily add two rightmost points of each interval not yet covered by at least 2 points. O(n log n) time.',
  tags: ['Intervals', 'Greedy', 'Sorting'],
  code: {
    pseudocode: `function intersectionSizeTwo(intervals):
  sort by end asc, start desc
  S = []
  for [a, b] in intervals:
    // check how many of S are in [a,b]
    cnt = count(x in S where a<=x<=b)
    if cnt == 0:
      S.append(b-1); S.append(b)
    elif cnt == 1:
      S.append(b)
  return |S|`,
    python: `def intersectionSizeTwo(intervals):
    intervals.sort(key=lambda x: (x[1], -x[0]))
    S = []
    for a, b in intervals:
        cnt = sum(1 for x in S if a <= x <= b)
        if cnt == 0:
            S.extend([b-1, b])
        elif cnt == 1:
            S.append(b)
    return len(S)`,
    javascript: `function intersectionSizeTwo(intervals) {
  intervals.sort((x, y) => x[1] !== y[1] ? x[1] - y[1] : y[0] - x[0]);
  const S = [];
  for (const [a, b] of intervals) {
    const cnt = S.filter(x => a <= x && x <= b).length;
    if (cnt === 0) { S.push(b - 1); S.push(b); }
    else if (cnt === 1) S.push(b);
  }
  return S.length;
}`,
    java: `public int intersectionSizeTwo(int[][] intervals) {
    Arrays.sort(intervals, (x,y)->x[1]!=y[1]?x[1]-y[1]:y[0]-x[0]);
    List<Integer> S = new ArrayList<>();
    for (int[] iv : intervals) {
        int cnt = 0;
        for (int x : S) if (iv[0] <= x && x <= iv[1]) cnt++;
        if (cnt == 0) { S.add(iv[1]-1); S.add(iv[1]); }
        else if (cnt == 1) S.add(iv[1]);
    }
    return S.size();
}`,
  },
  defaultInput: { intervals: [[1, 3], [1, 4], [2, 5], [3, 5]] },
  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals',
      type: 'array',
      defaultValue: [[1, 3], [1, 4], [2, 5], [3, 5]],
      placeholder: '[[1,3],[1,4],[2,5],[3,5]]',
      helperText: 'Array of [start, end] intervals',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const raw = (input.intervals as number[][]).map(iv => [iv[0], iv[1]]);
    raw.sort((x, y) => x[1] !== y[1] ? x[1] - y[1] : y[0] - x[0]);
    const flat = raw.flat();
    const steps: AlgorithmStep[] = [];
    const S: number[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Set S', entries: auxEntries } } : {}),
    });

    steps.push({ line: 2, explanation: `Sort by end asc, start desc: [${raw.map(iv=>`[${iv[0]},${iv[1]}]`).join(', ')}].`,
      variables: { sorted: raw.map(iv=>[...iv]) }, visualization: makeViz({}, {}) });

    for (let i = 0; i < raw.length; i++) {
      const [a, b] = raw[i];
      const ci = i * 2;
      const cnt = S.filter(x => a <= x && x <= b).length;
      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };
      for (let j = 0; j < i; j++) { hl[j * 2] = 'visited'; hl[j * 2 + 1] = 'visited'; }

      steps.push({ line: 5,
        explanation: `Interval [${a},${b}]: ${cnt} element(s) of S in range. S=[${S.join(', ')}].`,
        variables: { a, b, cnt, S: [...S] },
        visualization: makeViz(hl, { [ci]: `a=${a}`, [ci+1]: `b=${b}` },
          S.map((x, k) => ({ key: `S[${k}]`, value: String(x) }))) });

      if (cnt === 0) {
        S.push(b - 1, b);
        hl[ci] = 'found'; hl[ci + 1] = 'found';
        steps.push({ line: 7, explanation: `0 covered. Add ${b-1} and ${b} to S. S=[${S.join(', ')}].`,
          variables: { added: [b-1, b], S: [...S] },
          visualization: makeViz(hl, {},
            S.map((x, k) => ({ key: `S[${k}]`, value: String(x) }))) });
      } else if (cnt === 1) {
        S.push(b);
        hl[ci] = 'comparing'; hl[ci + 1] = 'comparing';
        steps.push({ line: 9, explanation: `1 covered. Add ${b} to S. S=[${S.join(', ')}].`,
          variables: { added: b, S: [...S] },
          visualization: makeViz(hl, {},
            S.map((x, k) => ({ key: `S[${k}]`, value: String(x) }))) });
      } else {
        hl[ci] = 'sorted'; hl[ci + 1] = 'sorted';
        steps.push({ line: 10, explanation: `2+ covered. Skip [${a},${b}]. S unchanged.`,
          variables: { S: [...S] },
          visualization: makeViz(hl, {},
            S.map((x, k) => ({ key: `S[${k}]`, value: String(x) }))) });
      }
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';
    steps.push({ line: 11, explanation: `Done. Min set size = ${S.length}. S = [${S.join(', ')}].`,
      variables: { result: S.length, S: [...S] },
      visualization: makeViz(finalHl, {}, [{ key: '|S|', value: String(S.length) }, ...S.map((x,k)=>({ key: `S[${k}]`, value: String(x) }))]) });

    return steps;
  },
};

export default setIntersectionSizeAtLeastTwo;
