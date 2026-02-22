import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const loudAndRich: AlgorithmDefinition = {
  id: 'loud-and-rich',
  title: 'Loud and Rich',
  leetcodeNumber: 851,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given richer[i] = [a, b] meaning a is richer than b, and quiet[i] = how quiet person i is, find for each person the least quiet person among all people at least as rich. Build a graph where richer means incoming edge, then DFS/topological order to propagate the quietest richer person.',
  tags: ['dfs', 'graph', 'topological sort', 'memoization'],

  code: {
    pseudocode: `function loudAndRich(richer, quiet):
  n = len(quiet)
  // graph[a] contains people poorer than a
  graph = [[] for _ in range(n)]
  for (a, b) in richer:
    graph[a].append(b)
  answer = list(range(n))  // each person starts as own quietest
  memo = {}

  dfs(node):
    if node in memo: return memo[node]
    for poorer in graph[node]:
      candidate = dfs(poorer)
      if quiet[candidate] < quiet[answer[node]]:
        answer[node] = candidate
    memo[node] = answer[node]
    return answer[node]

  for i in range(n): dfs(i)
  return answer`,

    python: `def loudAndRich(richer, quiet):
    n = len(quiet)
    graph = [[] for _ in range(n)]
    for a, b in richer:
        graph[a].append(b)
    answer = list(range(n))
    memo = {}

    def dfs(node):
        if node in memo:
            return memo[node]
        for poorer in graph[node]:
            candidate = dfs(poorer)
            if quiet[candidate] < quiet[answer[node]]:
                answer[node] = candidate
        memo[node] = answer[node]
        return answer[node]

    for i in range(n):
        dfs(i)
    return answer`,

    javascript: `function loudAndRich(richer, quiet) {
  const n = quiet.length;
  const graph = Array.from({length: n}, () => []);
  for (const [a, b] of richer) graph[a].push(b);
  const answer = Array.from({length: n}, (_, i) => i);
  const memo = {};

  function dfs(node) {
    if (node in memo) return memo[node];
    for (const poorer of graph[node]) {
      const candidate = dfs(poorer);
      if (quiet[candidate] < quiet[answer[node]]) {
        answer[node] = candidate;
      }
    }
    memo[node] = answer[node];
    return answer[node];
  }

  for (let i = 0; i < n; i++) dfs(i);
  return answer;
}`,

    java: `public int[] loudAndRich(int[][] richer, int[] quiet) {
    int n = quiet.length;
    List<List<Integer>> graph = new ArrayList<>();
    for (int i=0;i<n;i++) graph.add(new ArrayList<>());
    for (int[] r : richer) graph.get(r[0]).add(r[1]);
    int[] answer = IntStream.range(0,n).toArray();
    int[] memo = new int[n]; Arrays.fill(memo,-1);

    for (int i=0;i<n;i++) dfs(graph,quiet,answer,memo,i);
    return answer;
}
int dfs(List<List<Integer>> g, int[] q, int[] ans, int[] memo, int node) {
    if (memo[node]!=-1) return memo[node];
    for (int poorer : g.get(node)) {
        int cand=dfs(g,q,ans,memo,poorer);
        if (q[cand]<q[ans[node]]) ans[node]=cand;
    }
    return memo[node]=ans[node];
}`,
  },

  defaultInput: {
    richer: [[1,0],[2,1],[3,1],[3,7],[4,3],[5,3],[6,3]],
    quiet: [3, 2, 5, 4, 6, 1, 7, 0],
  },

  inputFields: [
    {
      name: 'quiet',
      label: 'Quiet Values',
      type: 'array',
      defaultValue: [3, 2, 5, 4, 6, 1, 7, 0],
      placeholder: '3,2,5,4,6,1,7,0',
      helperText: 'Quietness level for each person (lower = quieter)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const richer = input.richer as number[][];
    const quiet = input.quiet as number[];
    const steps: AlgorithmStep[] = [];
    const n = quiet.length;

    steps.push({
      line: 1,
      explanation: `${n} people with quiet values: [${quiet.join(', ')}]. Build graph where richer[a][b] means a -> b (a is richer, propagate quiet info to b).`,
      variables: { n, quiet: quiet.join(',') },
      visualization: {
        type: 'array',
        array: quiet,
        highlights: {},
        labels: Object.fromEntries(quiet.map((_, i) => [i, `P${i}`])),
      } as ArrayVisualization,
    });

    const graph: number[][] = Array.from({ length: n }, () => []);
    for (const [a, b] of richer) {
      graph[a].push(b);
    }

    steps.push({
      line: 3,
      explanation: `Graph built: ${graph.map((edges, i) => edges.length > 0 ? `P${i}->[${edges.map(e => 'P' + e).join(',')}]` : '').filter(Boolean).join(', ')}. Each person starts as their own quietest richer.`,
      variables: {},
      visualization: {
        type: 'array',
        array: graph.map(e => e.length),
        highlights: {},
        labels: Object.fromEntries(graph.map((edges, i) => [i, `P${i}:${edges.length}edges`])),
      } as ArrayVisualization,
    });

    const answer = Array.from({ length: n }, (_, i) => i);
    const memo: Record<number, number> = {};

    function dfs(node: number): number {
      if (node in memo) return memo[node];

      for (const poorer of graph[node]) {
        const candidate = dfs(poorer);
        if (quiet[candidate] < quiet[answer[node]]) {
          answer[node] = candidate;
        }
      }
      memo[node] = answer[node];
      return answer[node];
    }

    for (let i = 0; i < n && steps.length < 18; i++) {
      dfs(i);
      steps.push({
        line: 14,
        explanation: `DFS from person ${i}: quietest richer-or-equal person = P${answer[i]} (quiet=${quiet[answer[i]]}). Answer[${i}] = ${answer[i]}.`,
        variables: { person: i, answer: answer[i], quiet: quiet[answer[i]] },
        visualization: {
          type: 'array',
          array: [...answer],
          highlights: { [i]: 'active', [answer[i]]: answer[i] === i ? 'sorted' : 'found' },
          labels: Object.fromEntries(answer.map((v, idx) => [idx, `P${idx}->P${v}`])),
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 16,
      explanation: `All DFS complete. Answer: [${answer.join(', ')}]. For each person, the least quiet person at least as rich.`,
      variables: { result: answer.join(',') },
      visualization: {
        type: 'array',
        array: answer,
        highlights: Object.fromEntries(answer.map((v, i) => [i, v === i ? 'sorted' : 'found'])),
        labels: Object.fromEntries(answer.map((v, i) => [i, `P${i}->P${v}(q=${quiet[v]})`])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default loudAndRich;
