import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const earliestMomentWhenEveryoneBecomesF: AlgorithmDefinition = {
  id: 'earliest-moment-when-everyone-becomes-friends',
  title: 'Earliest Moment When Everyone Becomes Friends',
  leetcodeNumber: 1101,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a list of timestamped friendship logs [timestamp, personA, personB], find the earliest time at which every person knows every other person (directly or transitively). Sort logs by timestamp and use union find to merge friend groups. When only one component remains, return the current timestamp.',
  tags: ['union find', 'graph', 'sorting', 'connected components'],

  code: {
    pseudocode: `function earliestAcq(logs, n):
  sort logs by timestamp
  parent = [0..n-1]
  components = n
  for [time, a, b] in sorted logs:
    pa, pb = find(a), find(b)
    if pa != pb:
      union(pa, pb)
      components -= 1
      if components == 1:
        return time
  return -1`,

    python: `def earliestAcq(logs, n):
    logs.sort()
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    components = n
    for time, a, b in logs:
        pa, pb = find(a), find(b)
        if pa != pb:
            parent[pa] = pb
            components -= 1
            if components == 1:
                return time
    return -1`,

    javascript: `function earliestAcq(logs, n) {
  logs.sort((a, b) => a[0] - b[0]);
  const parent = Array.from({length: n}, (_, i) => i);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  let components = n;
  for (const [time, a, b] of logs) {
    const pa = find(a), pb = find(b);
    if (pa !== pb) {
      parent[pa] = pb;
      components--;
      if (components === 1) return time;
    }
  }
  return -1;
}`,

    java: `public int earliestAcq(int[][] logs, int n) {
    Arrays.sort(logs, (a, b) -> a[0] - b[0]);
    int[] parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int components = n;
    for (int[] log : logs) {
        int pa = find(parent, log[1]), pb = find(parent, log[2]);
        if (pa != pb) {
            parent[pa] = pb;
            if (--components == 1) return log[0];
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    n: 6,
    logs: [[20190101, 0, 1], [20190104, 3, 4], [20190107, 2, 3], [20190211, 1, 5], [20190224, 2, 4], [20190301, 0, 3], [20190312, 1, 2], [20190322, 4, 5]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of People',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Total number of people (0 to n-1)',
    },
    {
      name: 'logs',
      label: 'Friendship Logs',
      type: 'array',
      defaultValue: [[20190101, 0, 1], [20190104, 3, 4], [20190107, 2, 3], [20190211, 1, 5], [20190224, 2, 4], [20190301, 0, 3], [20190312, 1, 2], [20190322, 4, 5]],
      placeholder: '[[timestamp,a,b],...]',
      helperText: 'Each log is [timestamp, personA, personB]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const rawLogs = input.logs as number[][];
    const steps: AlgorithmStep[] = [];

    const logs = [...rawLogs].sort((a, b) => a[0] - b[0]);
    const parent: number[] = Array.from({ length: n }, (_, i) => i);
    let components = n;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...parent],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort ${rawLogs.length} logs by timestamp. Initialize ${n} people each in own component.`,
      variables: { n, components },
      visualization: makeViz({}, Object.fromEntries(parent.map((_, i) => [i, `p${i}`]))),
    });

    function find(x: number): number {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
      }
      return x;
    }

    for (const [time, a, b] of logs) {
      const pa = find(a);
      const pb = find(b);

      steps.push({
        line: 5,
        explanation: `Time ${time}: persons ${a} and ${b} become friends. find(${a})=${pa}, find(${b})=${pb}.`,
        variables: { time, a, b, findA: pa, findB: pb, components },
        visualization: makeViz({ [a]: 'active', [b]: 'comparing' }, { [pa]: 'rootA', [pb]: 'rootB' }),
      });

      if (pa !== pb) {
        parent[pa] = pb;
        components--;

        steps.push({
          line: 7,
          explanation: `Merged group of ${a} into group of ${b}. Components: ${components}.`,
          variables: { 'parent[pa]': pb, components },
          visualization: makeViz({ [a]: 'visited', [b]: 'visited', [pa]: 'active' }, { [pa]: `-> ${pb}` }),
        });

        if (components === 1) {
          steps.push({
            line: 9,
            explanation: `All ${n} people are now connected at timestamp ${time}! Return ${time}.`,
            variables: { result: time, components: 1 },
            visualization: makeViz(
              Object.fromEntries(parent.map((_, i) => [i, 'found'])),
              { 0: `t=${time}` }
            ),
          });
          return steps;
        }
      } else {
        steps.push({
          line: 5,
          explanation: `Persons ${a} and ${b} already in same group (root=${pa}). Skip.`,
          variables: { components },
          visualization: makeViz({ [a]: 'found', [b]: 'found' }, { [pa]: 'same-root' }),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Processed all logs. ${components} component(s) remain. Not everyone connected. Return -1.`,
      variables: { components, result: -1 },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default earliestMomentWhenEveryoneBecomesF;
