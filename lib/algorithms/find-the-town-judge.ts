import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findTheTownJudge: AlgorithmDefinition = {
  id: 'find-the-town-judge',
  title: 'Find the Town Judge',
  leetcodeNumber: 997,
  difficulty: 'Easy',
  category: 'Graph',
  description:
    'In a town of n people, the town judge trusts nobody but is trusted by everyone else. Given a list of trust pairs [a, b] meaning a trusts b, find the judge. Track in-degree (trusted by) and out-degree (trusts others). The judge has in-degree n-1 and out-degree 0.',
  tags: ['graph', 'degree', 'in-degree', 'out-degree', 'hash map'],

  code: {
    pseudocode: `function findJudge(n, trust):
  inDegree = array of 0, size n+1
  outDegree = array of 0, size n+1
  for each [a, b] in trust:
    outDegree[a] += 1
    inDegree[b] += 1
  for person from 1 to n:
    if inDegree[person] == n-1 and outDegree[person] == 0:
      return person
  return -1`,

    python: `def findJudge(n, trust):
    in_deg = [0] * (n + 1)
    out_deg = [0] * (n + 1)
    for a, b in trust:
        out_deg[a] += 1
        in_deg[b] += 1
    for p in range(1, n + 1):
        if in_deg[p] == n - 1 and out_deg[p] == 0:
            return p
    return -1`,

    javascript: `function findJudge(n, trust) {
  const inDeg = new Array(n+1).fill(0);
  const outDeg = new Array(n+1).fill(0);
  for (const [a, b] of trust) {
    outDeg[a]++;
    inDeg[b]++;
  }
  for (let p = 1; p <= n; p++) {
    if (inDeg[p] === n-1 && outDeg[p] === 0) return p;
  }
  return -1;
}`,

    java: `public int findJudge(int n, int[][] trust) {
    int[] inDeg = new int[n+1];
    int[] outDeg = new int[n+1];
    for (int[] t : trust) {
        outDeg[t[0]]++;
        inDeg[t[1]]++;
    }
    for (int p = 1; p <= n; p++) {
        if (inDeg[p] == n-1 && outDeg[p] == 0) return p;
    }
    return -1;
}`,
  },

  defaultInput: {
    n: 4,
    trustFlat: [1, 3, 1, 4, 2, 3, 2, 4, 4, 3],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of People',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'trustFlat',
      label: 'Trust pairs (flattened)',
      type: 'array',
      defaultValue: [1, 3, 1, 4, 2, 3, 2, 4, 4, 3],
      placeholder: '1,3,1,4,2,3,2,4,4,3',
      helperText: 'Pairs [a1,b1,a2,b2,...] meaning a trusts b',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const trustFlat = input.trustFlat as number[];
    const steps: AlgorithmStep[] = [];

    const trust: [number, number][] = [];
    for (let i = 0; i + 1 < trustFlat.length; i += 2) {
      trust.push([trustFlat[i], trustFlat[i + 1]]);
    }

    const inDeg = new Array(n + 1).fill(0);
    const outDeg = new Array(n + 1).fill(0);

    const people = Array.from({ length: n }, (_, i) => i + 1);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: people,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize in-degree and out-degree arrays for ${n} people. The judge must have in-degree ${n - 1} and out-degree 0.`,
      variables: { n, inDeg: JSON.stringify(inDeg.slice(1)), outDeg: JSON.stringify(outDeg.slice(1)) },
      visualization: makeViz({}, {}),
    });

    for (const [a, b] of trust) {
      outDeg[a]++;
      inDeg[b]++;

      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      hl[a - 1] = 'comparing';
      lb[a - 1] = `out=${outDeg[a]}`;
      hl[b - 1] = 'active';
      lb[b - 1] = `in=${inDeg[b]}`;

      steps.push({
        line: 4,
        explanation: `Person ${a} trusts person ${b}. outDeg[${a}]=${outDeg[a]}, inDeg[${b}]=${inDeg[b]}.`,
        variables: {
          a, b,
          outDeg: JSON.stringify(outDeg.slice(1)),
          inDeg: JSON.stringify(inDeg.slice(1))
        },
        visualization: makeViz(hl, lb),
      });
    }

    steps.push({
      line: 6,
      explanation: `All trust pairs processed. Final in-degrees: [${inDeg.slice(1).join(',')}]. Out-degrees: [${outDeg.slice(1).join(',')}]. Now find the judge.`,
      variables: { inDeg: JSON.stringify(inDeg.slice(1)), outDeg: JSON.stringify(outDeg.slice(1)) },
      visualization: makeViz(
        people.reduce((acc, p, i) => { acc[i] = 'visited'; return acc; }, {} as Record<number, string>),
        people.reduce((acc, p, i) => { acc[i] = `in=${inDeg[p]}`; return acc; }, {} as Record<number, string>)
      ),
    });

    let judge = -1;
    for (let p = 1; p <= n; p++) {
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      hl[p - 1] = 'active';
      lb[p - 1] = `in=${inDeg[p]},out=${outDeg[p]}`;

      if (inDeg[p] === n - 1 && outDeg[p] === 0) {
        judge = p;
        hl[p - 1] = 'found';
        lb[p - 1] = 'JUDGE!';

        steps.push({
          line: 8,
          explanation: `Person ${p} has in-degree ${n - 1} and out-degree 0. Person ${p} is the town judge!`,
          variables: { person: p, inDeg: inDeg[p], outDeg: outDeg[p], result: p },
          visualization: makeViz(hl, lb),
        });
        break;
      } else {
        steps.push({
          line: 7,
          explanation: `Person ${p}: in=${inDeg[p]}, out=${outDeg[p]}. Not the judge (needs in=${n - 1}, out=0).`,
          variables: { person: p, inDeg: inDeg[p], outDeg: outDeg[p] },
          visualization: makeViz(hl, lb),
        });
      }
    }

    if (judge === -1) {
      steps.push({
        line: 9,
        explanation: `No person satisfies both conditions. No town judge found. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz(
          people.reduce((acc, _, i) => { acc[i] = 'mismatch'; return acc; }, {} as Record<number, string>),
          { 0: 'no judge' }
        ),
      });
    }

    return steps;
  },
};

export default findTheTownJudge;
