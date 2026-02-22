import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const pathWithMaximumProbability: AlgorithmDefinition = {
  id: 'path-with-maximum-probability',
  title: 'Path with Maximum Probability',
  leetcodeNumber: 1514,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find the path between start and end nodes with maximum probability. Uses a modified Dijkstra algorithm with a max-heap, where instead of minimizing distance we maximize the product of edge probabilities. The probability of a path is the product of all edge probabilities along it.',
  tags: ['graph', 'dijkstra', 'heap', 'shortest path', 'probability'],

  code: {
    pseudocode: `function maxProbability(n, edges, probs, start, end):
  graph = build adjacency list
  dist = array of 0.0, dist[start] = 1.0
  maxHeap = [(1.0, start)]
  while maxHeap not empty:
    prob, node = pop max from heap
    if node == end: return prob
    if prob < dist[node]: continue
    for each neighbor, edgeProb in graph[node]:
      newProb = prob * edgeProb
      if newProb > dist[neighbor]:
        dist[neighbor] = newProb
        push (newProb, neighbor) to heap
  return 0.0`,

    python: `import heapq
def maxProbability(n, edges, succProb, start, end):
    graph = [[] for _ in range(n)]
    for i, (u, v) in enumerate(edges):
        graph[u].append((v, succProb[i]))
        graph[v].append((u, succProb[i]))
    dist = [0.0] * n
    dist[start] = 1.0
    heap = [(-1.0, start)]
    while heap:
        neg_prob, node = heapq.heappop(heap)
        prob = -neg_prob
        if node == end:
            return prob
        if prob < dist[node]:
            continue
        for nb, ep in graph[node]:
            np = prob * ep
            if np > dist[nb]:
                dist[nb] = np
                heapq.heappush(heap, (-np, nb))
    return 0.0`,

    javascript: `function maxProbability(n, edges, succProb, start, end) {
  const graph = Array.from({length: n}, () => []);
  for (let i = 0; i < edges.length; i++) {
    const [u, v] = edges[i];
    graph[u].push([v, succProb[i]]);
    graph[v].push([u, succProb[i]]);
  }
  const dist = new Array(n).fill(0);
  dist[start] = 1.0;
  const heap = [[1.0, start]];
  while (heap.length) {
    heap.sort((a, b) => b[0] - a[0]);
    const [prob, node] = heap.shift();
    if (node === end) return prob;
    if (prob < dist[node]) continue;
    for (const [nb, ep] of graph[node]) {
      const np = prob * ep;
      if (np > dist[nb]) {
        dist[nb] = np;
        heap.push([np, nb]);
      }
    }
  }
  return 0.0;
}`,

    java: `public double maxProbability(int n, int[][] edges, double[] succProb, int start, int end) {
    List<double[]>[] graph = new List[n];
    for (int i = 0; i < n; i++) graph[i] = new ArrayList<>();
    for (int i = 0; i < edges.length; i++) {
        graph[edges[i][0]].add(new double[]{edges[i][1], succProb[i]});
        graph[edges[i][1]].add(new double[]{edges[i][0], succProb[i]});
    }
    double[] dist = new double[n];
    dist[start] = 1.0;
    PriorityQueue<double[]> pq = new PriorityQueue<>((a, b) -> Double.compare(b[0], a[0]));
    pq.offer(new double[]{1.0, start});
    while (!pq.isEmpty()) {
        double[] cur = pq.poll();
        double prob = cur[0]; int node = (int)cur[1];
        if (node == end) return prob;
        if (prob < dist[node]) continue;
        for (double[] nb : graph[node]) {
            double np = prob * nb[1];
            if (np > dist[(int)nb[0]]) {
                dist[(int)nb[0]] = np;
                pq.offer(new double[]{np, nb[0]});
            }
        }
    }
    return 0.0;
}`,
  },

  defaultInput: {
    n: 4,
    edges: [[0,1],[1,2],[0,2],[2,3]],
    succProb: [0.5, 0.5, 0.2, 0.8],
    start: 0,
    end: 3,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Total nodes (0 to n-1)',
    },
    {
      name: 'start',
      label: 'Start Node',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Starting node index',
    },
    {
      name: 'end',
      label: 'End Node',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Ending node index',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const succProb = input.succProb as number[];
    const start = input.start as number;
    const end = input.end as number;
    const steps: AlgorithmStep[] = [];

    // Build graph
    const graph: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
    for (let i = 0; i < edges.length; i++) {
      const [u, v] = edges[i];
      graph[u].push([v, succProb[i]]);
      graph[v].push([u, succProb[i]]);
    }

    const dist = new Array(n).fill(0);
    dist[start] = 1.0;

    steps.push({
      line: 2,
      explanation: `Initialize probabilities. dist[${start}] = 1.0 (start), all others = 0.0.`,
      variables: { dist: dist.map(d => d.toFixed(2)), start, end },
      visualization: {
        type: 'array',
        array: dist.map(d => parseFloat(d.toFixed(2))),
        highlights: { [start]: 'active' },
        labels: { [start]: 'start', [end]: 'end' },
      },
    });

    // Simple Dijkstra simulation using array as heap
    const heap: Array<[number, number]> = [[1.0, start]];

    let iterations = 0;
    while (heap.length > 0 && iterations < 20) {
      iterations++;
      heap.sort((a, b) => b[0] - a[0]);
      const [prob, node] = heap.shift()!;

      steps.push({
        line: 6,
        explanation: `Processing node ${node} with probability ${prob.toFixed(3)}. Current best distances: [${dist.map(d => d.toFixed(2)).join(', ')}].`,
        variables: { node, prob: prob.toFixed(3), dist: dist.map(d => d.toFixed(2)) },
        visualization: {
          type: 'array',
          array: dist.map(d => parseFloat(d.toFixed(2))),
          highlights: { [node]: 'active', [end]: 'pointer' },
          labels: { [node]: 'cur', [end]: 'end' },
        },
      });

      if (node === end) {
        steps.push({
          line: 7,
          explanation: `Reached end node ${end} with probability ${prob.toFixed(3)}. This is the maximum probability path.`,
          variables: { result: prob.toFixed(3) },
          visualization: {
            type: 'array',
            array: dist.map(d => parseFloat(d.toFixed(2))),
            highlights: { [end]: 'found', [start]: 'found' },
            labels: { [start]: 'start', [end]: 'end' },
          },
        });
        break;
      }

      if (prob < dist[node]) {
        steps.push({
          line: 8,
          explanation: `Skipping node ${node}: heap prob ${prob.toFixed(3)} < best known ${dist[node].toFixed(3)} (stale entry).`,
          variables: { node, heapProb: prob.toFixed(3), bestKnown: dist[node].toFixed(3) },
          visualization: {
            type: 'array',
            array: dist.map(d => parseFloat(d.toFixed(2))),
            highlights: { [node]: 'mismatch' },
            labels: { [node]: 'skip' },
          },
        });
        continue;
      }

      for (const [nb, ep] of graph[node]) {
        const newProb = prob * ep;
        if (newProb > dist[nb]) {
          dist[nb] = newProb;
          heap.push([newProb, nb]);
          steps.push({
            line: 12,
            explanation: `Update node ${nb}: ${prob.toFixed(2)} * ${ep.toFixed(2)} = ${newProb.toFixed(3)} > ${dist[nb].toFixed(3)} (old). Pushing to heap.`,
            variables: { from: node, to: nb, newProb: newProb.toFixed(3), edgeProb: ep },
            visualization: {
              type: 'array',
              array: dist.map(d => parseFloat(d.toFixed(2))),
              highlights: { [node]: 'active', [nb]: 'comparing' },
              labels: { [node]: 'cur', [nb]: 'updated' },
            },
          });
        }
      }
    }

    return steps;
  },
};

export default pathWithMaximumProbability;
