import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const courseScheduleIv: AlgorithmDefinition = {
  id: 'course-schedule-iv',
  title: 'Course Schedule IV',
  leetcodeNumber: 1462,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given course prerequisites and queries [u, v], answer whether course u is an indirect or direct prerequisite of course v. Precompute transitive closure using Floyd-Warshall: reachable[i][j] = true if i can reach j. Then answer each query in O(1).',
  tags: ['transitive closure', 'Floyd-Warshall', 'BFS', 'DAG', 'graph'],

  code: {
    pseudocode: `function checkIfPrerequisite(numCourses, prerequisites, queries):
  reachable = n x n boolean matrix, false
  for each (u, v) in prerequisites:
    reachable[u][v] = true
  // Floyd-Warshall transitive closure
  for k from 0 to n-1:
    for i from 0 to n-1:
      for j from 0 to n-1:
        if reachable[i][k] and reachable[k][j]:
          reachable[i][j] = true
  return [reachable[u][v] for (u,v) in queries]`,

    python: `def checkIfPrerequisite(numCourses, prerequisites, queries):
    n = numCourses
    reach = [[False]*n for _ in range(n)]
    for u, v in prerequisites:
        reach[u][v] = True
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if reach[i][k] and reach[k][j]:
                    reach[i][j] = True
    return [reach[u][v] for u, v in queries]`,

    javascript: `function checkIfPrerequisite(numCourses, prerequisites, queries) {
  const n = numCourses;
  const reach = Array.from({length:n},()=>new Array(n).fill(false));
  for (const [u,v] of prerequisites) reach[u][v] = true;
  for (let k=0;k<n;k++)
    for (let i=0;i<n;i++)
      for (let j=0;j<n;j++)
        if (reach[i][k] && reach[k][j]) reach[i][j] = true;
  return queries.map(([u,v]) => reach[u][v]);
}`,

    java: `public List<Boolean> checkIfPrerequisite(int n, int[][] prereqs, int[][] queries) {
    boolean[][] reach = new boolean[n][n];
    for (int[] p : prereqs) reach[p[0]][p[1]] = true;
    for (int k=0;k<n;k++)
        for (int i=0;i<n;i++)
            for (int j=0;j<n;j++)
                if (reach[i][k] && reach[k][j]) reach[i][j] = true;
    List<Boolean> res = new ArrayList<>();
    for (int[] q : queries) res.add(reach[q[0]][q[1]]);
    return res;
}`,
  },

  defaultInput: {
    numCourses: 4,
    prerequisites: [0, 1, 1, 2, 2, 3],
    queries: [0, 3, 3, 0, 1, 3],
  },

  inputFields: [
    {
      name: 'numCourses',
      label: 'Number of Courses',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'prerequisites',
      label: 'Prerequisites (u,v pairs flat)',
      type: 'array',
      defaultValue: [0, 1, 1, 2, 2, 3],
      placeholder: '0,1,1,2,...',
      helperText: 'Flat list of prerequisite pairs u->v',
    },
    {
      name: 'queries',
      label: 'Queries (u,v pairs flat)',
      type: 'array',
      defaultValue: [0, 3, 3, 0, 1, 3],
      placeholder: '0,3,3,0,...',
      helperText: 'Flat list of query pairs: is u a prereq of v?',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.numCourses as number;
    const prereqFlat = input.prerequisites as number[];
    const queryFlat = input.queries as number[];
    const steps: AlgorithmStep[] = [];

    const prerequisites: [number, number][] = [];
    for (let i = 0; i + 1 < prereqFlat.length; i += 2) prerequisites.push([prereqFlat[i], prereqFlat[i + 1]]);

    const queries: [number, number][] = [];
    for (let i = 0; i + 1 < queryFlat.length; i += 2) queries.push([queryFlat[i], queryFlat[i + 1]]);

    const reach: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    for (const [u, v] of prerequisites) reach[u][v] = true;

    const flatReach = () => reach.flat().map(b => (b ? 1 : 0));

    const makeViz = (highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: flatReach(),
      highlights,
      labels: {},
    });

    steps.push({
      line: 2,
      explanation: `Initialize ${n}x${n} reachability matrix. Direct prerequisites set: [${prerequisites.map(([u, v]) => `${u}->${v}`).join(', ')}].`,
      variables: { n, directEdges: prerequisites.length },
      visualization: makeViz({}),
    });

    steps.push({
      line: 5,
      explanation: 'Apply Floyd-Warshall transitive closure: for each intermediate k, propagate reachability.',
      variables: {},
      visualization: makeViz({}),
    });

    for (let k = 0; k < n; k++) {
      let updated = false;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (reach[i][k] && reach[k][j] && !reach[i][j]) {
            reach[i][j] = true;
            updated = true;
            steps.push({
              line: 7,
              explanation: `k=${k}: reach[${i}][${j}] = true via intermediate ${k} (${i}->${k}->${j}).`,
              variables: { k, i, j },
              visualization: makeViz({ [i * n + k]: 'active', [k * n + j]: 'active', [i * n + j]: 'found' }),
            });
          }
        }
      }
      if (!updated) {
        steps.push({
          line: 6,
          explanation: `k=${k}: No new paths discovered through vertex ${k}.`,
          variables: { k },
          visualization: makeViz({}),
        });
      }
    }

    const results = queries.map(([u, v]) => reach[u][v]);

    steps.push({
      line: 9,
      explanation: `Transitive closure complete. Answering queries: ${queries.map(([u, v], i) => `(${u},${v})->${results[i]}`).join(', ')}.`,
      variables: { queryResults: results },
      visualization: makeViz(Object.fromEntries(flatReach().map((v, i) => [i, v ? 'sorted' : 'default']))),
    });

    return steps;
  },
};

export default courseScheduleIv;
