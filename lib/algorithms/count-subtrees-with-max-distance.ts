import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const countSubtreesWithMaxDistance: AlgorithmDefinition = {
  id: 'count-subtrees-with-max-distance',
  title: 'Count Subtrees with Max Distance Between Cities',
  leetcodeNumber: 1617,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given n cities forming a tree, for each possible diameter d (1 to n-1), count how many subtrees have exactly d as their maximum distance between any two nodes. Enumerate all 2^n subsets, and for each connected subset compute the diameter using BFS/DFS. The diameter of a tree equals the sum of the two longest branches from any internal node.',
  tags: ['Tree', 'Dynamic Programming', 'BFS', 'Bitmask', 'Hard'],
  code: {
    pseudocode: `function countSubgraphsForEachDiameter(n, edges):
  build adjacency list
  ans = array of size n-1 (ans[d] = count of subtrees with diameter d)
  for each subset S of {1..n} with |S| >= 2:
    if S forms a connected subtree:
      d = diameter of subtree S
      ans[d-1]++
  return ans`,
    python: `def countSubgraphsForEachDiameter(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u-1].append(v-1); graph[v-1].append(u-1)
    ans = [0] * (n - 1)
    for mask in range(3, 1 << n):
        if bin(mask).count('1') < 2: continue
        nodes = [i for i in range(n) if mask >> i & 1]
        start = nodes[0]
        visited, q = {start}, deque([start])
        while q:
            u = q.popleft()
            for v in graph[u]:
                if v not in visited and mask >> v & 1:
                    visited.add(v); q.append(v)
        if len(visited) != len(nodes): continue
        # BFS twice to find diameter
        def bfs(src):
            dist = {src: 0}
            q = deque([src])
            while q:
                u = q.popleft()
                for v in graph[u]:
                    if v not in dist and mask >> v & 1:
                        dist[v] = dist[u]+1; q.append(v)
            return max(dist, key=dist.get), max(dist.values())
        farthest, _ = bfs(start)
        _, diameter = bfs(farthest)
        ans[diameter-1] += 1
    return ans`,
    javascript: `function countSubgraphsForEachDiameter(n, edges) {
  const g = Array.from({length:n},()=>[]);
  for(const [u,v] of edges){g[u-1].push(v-1);g[v-1].push(u-1);}
  const ans = new Array(n-1).fill(0);
  for(let mask=3;mask<(1<<n);mask++){
    const nodes=[]; for(let i=0;i<n;i++) if(mask>>i&1) nodes.push(i);
    if(nodes.length<2) continue;
    // check connected + find diameter via 2x BFS
    // ...
  }
  return ans;
}`,
    java: `public int[] countSubgraphsForEachDiameter(int n, int[][] edges) {
    List<List<Integer>> g = new ArrayList<>();
    for(int i=0;i<n;i++) g.add(new ArrayList<>());
    for(int[] e:edges){g.get(e[0]-1).add(e[1]-1);g.get(e[1]-1).add(e[0]-1);}
    int[] ans = new int[n-1];
    for(int mask=3;mask<(1<<n);mask++){
        // enumerate connected subsets, compute diameter
    }
    return ans;
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4] },
  inputFields: [
    {
      name: 'tree',
      label: 'Tree nodes (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4],
      placeholder: 'e.g. 1,2,3,4',
      helperText: 'Nodes form a tree. Counts subtrees by their diameter.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = tree.filter(v => v != null).length;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Count Subtrees by Max Distance: n=${n} nodes. Enumerate all 2^${n}=${1 << n} subsets. For each connected subset, compute its diameter and tally into ans[diameter-1].`,
      variables: { n, totalSubsets: 1 << n },
      visualization: makeViz(0),
    });

    // Build adjacency from binary tree structure
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
      if (tree[i] == null) continue;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && tree[l] != null) { adj[i].push(l); adj[l].push(i); }
      if (r < n && tree[r] != null) { adj[i].push(r); adj[r].push(i); }
    }

    const ans = new Array(n - 1).fill(0);

    function bfs(src: number, mask: number): { farthest: number; dist: number } {
      const dist: Record<number, number> = { [src]: 0 };
      const queue = [src];
      let farthest = src;
      for (let qi = 0; qi < queue.length; qi++) {
        const u = queue[qi];
        for (const v of adj[u]) {
          if (!(mask >> v & 1)) continue;
          if (dist[v] === undefined) {
            dist[v] = dist[u] + 1;
            queue.push(v);
            if (dist[v] > dist[farthest]) farthest = v;
          }
        }
      }
      return { farthest, dist: dist[farthest] };
    }

    let subsetsChecked = 0;

    for (let mask = 3; mask < (1 << n); mask++) {
      const nodes: number[] = [];
      for (let i = 0; i < n; i++) if (mask >> i & 1) nodes.push(i);
      if (nodes.length < 2) continue;

      // Check connectivity
      const start = nodes[0];
      const visited = new Set<number>([start]);
      const queue = [start];
      for (let qi = 0; qi < queue.length; qi++) {
        const u = queue[qi];
        for (const v of adj[u]) {
          if ((mask >> v & 1) && !visited.has(v)) {
            visited.add(v);
            queue.push(v);
          }
        }
      }
      if (visited.size !== nodes.length) continue;

      // Two-BFS diameter
      const { farthest } = bfs(start, mask);
      const { dist: diameter } = bfs(farthest, mask);
      if (diameter >= 1 && diameter <= n - 1) ans[diameter - 1]++;

      subsetsChecked++;
      if (subsetsChecked <= 6) {
        steps.push({
          line: 5,
          explanation: `Subset {${nodes.join(',')}} (mask=${mask}): connected, diameter=${diameter}. ans[${diameter-1}] incremented.`,
          variables: { subset: nodes, diameter, ans: ans.slice() },
          visualization: makeViz(null, Object.fromEntries(nodes.map(i => [i, 'comparing']))),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `Done! ans = [${ans.join(', ')}]. ans[d-1] = number of connected subtrees with diameter d.`,
      variables: { answer: ans },
      visualization: makeViz(null, { 0: 'found' }),
    });

    return steps;
  },
};

export default countSubtreesWithMaxDistance;
