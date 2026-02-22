import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sequenceReconstruction: AlgorithmDefinition = {
  id: 'sequence-reconstruction',
  title: 'Sequence Reconstruction',
  leetcodeNumber: 444,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a sequence nums (a permutation of 1..n) and a list of subsequences, determine if nums is the only shortest supersequence that can be reconstructed from the subsequences. Use topological sort: build an ordering graph from the subsequences and verify there is a unique topological order matching nums.',
  tags: ['Graph', 'Topological Sort', 'BFS'],
  code: {
    pseudocode: `function sequenceReconstruction(nums, sequences):
  n = len(nums)
  inDegree = {1..n: 0}
  adj = adjacency list
  for seq in sequences:
    for i in 0..len(seq)-2:
      u, v = seq[i], seq[i+1]
      if edge u->v not seen:
        adj[u].add(v); inDegree[v]++
  queue = nodes with inDegree 0
  result = []
  while queue:
    if queue.size != 1: return false  // not unique
    node = queue.dequeue()
    result.append(node)
    for nb in adj[node]:
      inDegree[nb]--
      if inDegree[nb] == 0: queue.add(nb)
  return result == nums`,
    python: `def sequenceReconstruction(nums, sequences):
    n = len(nums)
    inDegree = {i: 0 for i in range(1, n+1)}
    adj = {i: set() for i in range(1, n+1)}
    for seq in sequences:
        for i in range(len(seq)-1):
            u, v = seq[i], seq[i+1]
            if v not in adj[u]:
                adj[u].add(v)
                inDegree[v] += 1
    q = deque(x for x in inDegree if inDegree[x] == 0)
    res = []
    while q:
        if len(q) != 1: return False
        node = q.popleft()
        res.append(node)
        for nb in adj[node]:
            inDegree[nb] -= 1
            if inDegree[nb] == 0: q.append(nb)
    return res == nums`,
    javascript: `function sequenceReconstruction(nums, sequences) {
  const n = nums.length;
  const inDegree = new Array(n+1).fill(0);
  const adj = Array.from({length: n+1}, () => new Set());
  for (const seq of sequences) {
    for (let i = 0; i < seq.length-1; i++) {
      const [u,v] = [seq[i], seq[i+1]];
      if (!adj[u].has(v)) { adj[u].add(v); inDegree[v]++; }
    }
  }
  const queue = [];
  for (let i = 1; i <= n; i++) if (inDegree[i] === 0) queue.push(i);
  const res = [];
  while (queue.length) {
    if (queue.length !== 1) return false;
    const node = queue.shift();
    res.push(node);
    for (const nb of adj[node]) { inDegree[nb]--; if (!inDegree[nb]) queue.push(nb); }
  }
  return res.join() === nums.join();
}`,
    java: `public boolean sequenceReconstruction(int[] nums, int[][] sequences) {
    int n = nums.length;
    int[] inDegree = new int[n+1];
    Set<Integer>[] adj = new HashSet[n+1];
    for (int i = 1; i <= n; i++) adj[i] = new HashSet<>();
    for (int[] seq : sequences)
        for (int i = 0; i < seq.length-1; i++)
            if (adj[seq[i]].add(seq[i+1])) inDegree[seq[i+1]]++;
    Queue<Integer> q = new LinkedList<>();
    for (int i = 1; i <= n; i++) if (inDegree[i] == 0) q.add(i);
    List<Integer> res = new ArrayList<>();
    while (!q.isEmpty()) {
        if (q.size() != 1) return false;
        int node = q.poll(); res.add(node);
        for (int nb : adj[node]) if (--inDegree[nb] == 0) q.add(nb);
    }
    for (int i = 0; i < n; i++) if (res.get(i) != nums[i]) return false;
    return true;
}`,
  },
  defaultInput: {
    nums: [1, 2, 3],
    sequences: [[1, 2], [1, 3], [2, 3]],
  },
  inputFields: [
    {
      name: 'nums',
      label: 'Target Sequence',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '[1,2,3]',
      helperText: 'The target permutation to verify',
    },
    {
      name: 'sequences',
      label: 'Subsequences',
      type: 'array',
      defaultValue: [[1, 2], [1, 3], [2, 3]],
      placeholder: '[[1,2],[1,3],[2,3]]',
      helperText: 'List of subsequences that constrain the order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const sequences = input.sequences as number[][];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const inDegree = new Array(n + 1).fill(0);
    const adj: Set<number>[] = Array.from({ length: n + 1 }, () => new Set());

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      queue: number[],
      result: number[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: inDegree.slice(1),
        highlights,
        labels,
        auxData: {
          label: 'Sequence Reconstruction',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.join(', ') : 'empty' },
            { key: 'Result', value: result.length > 0 ? result.join(' -> ') : 'empty' },
            { key: 'Target', value: nums.join(' -> ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Build ordering graph from ${sequences.length} subsequences for ${n} nodes.`,
      variables: { n, sequenceCount: sequences.length },
      visualization: makeViz(
        {},
        Object.fromEntries(nums.map((_, i) => [i, `n${i + 1}:0`])),
        [],
        []
      ),
    });

    for (const seq of sequences) {
      for (let i = 0; i < seq.length - 1; i++) {
        const u = seq[i], v = seq[i + 1];
        if (!adj[u].has(v)) {
          adj[u].add(v);
          inDegree[v]++;
          steps.push({
            line: 6,
            explanation: `From sequence: add edge ${u}->${v}. In-degree[${v}]=${inDegree[v]}.`,
            variables: { u, v, inDegree: inDegree.slice(1) },
            visualization: makeViz(
              { [u - 1]: 'active', [v - 1]: 'comparing' },
              Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i + 1}:${inDegree[i + 1]}`])),
              [],
              []
            ),
          });
        }
      }
    }

    const queue: number[] = [];
    for (let i = 1; i <= n; i++) if (inDegree[i] === 0) queue.push(i);

    steps.push({
      line: 10,
      explanation: `Nodes with in-degree 0: [${queue.join(', ')}]. Queue must have exactly 1 at each step for unique reconstruction.`,
      variables: { queue: [...queue] },
      visualization: makeViz(
        Object.fromEntries(queue.map(q => [q - 1, 'active'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i + 1}:${inDegree[i + 1]}`])),
        [...queue],
        []
      ),
    });

    const result: number[] = [];
    let isUnique = true;

    while (queue.length > 0) {
      if (queue.length !== 1) {
        isUnique = false;
        steps.push({
          line: 12,
          explanation: `Queue has ${queue.length} choices: [${queue.join(', ')}]. Multiple valid orderings exist. NOT unique!`,
          variables: { queue: [...queue] },
          visualization: makeViz(
            Object.fromEntries(queue.map(q => [q - 1, 'mismatch'])),
            Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i + 1}:${inDegree[i + 1]}`])),
            [...queue],
            [...result]
          ),
        });
        break;
      }
      const node = queue.shift()!;
      result.push(node);

      steps.push({
        line: 13,
        explanation: `Queue size=1: dequeue ${node} (unique choice). Result: [${result.join(', ')}].`,
        variables: { node, result: [...result] },
        visualization: makeViz(
          { [node - 1]: 'found' },
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i + 1}:${inDegree[i + 1]}`])),
          [...queue],
          [...result]
        ),
      });

      for (const nb of adj[node]) {
        inDegree[nb]--;
        if (inDegree[nb] === 0) queue.push(nb);
      }
    }

    const finalMatch = isUnique && result.join(',') === nums.join(',');
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalHighlights[i] = finalMatch ? 'found' : 'mismatch';
    }

    steps.push({
      line: 17,
      explanation: finalMatch
        ? `nums is the ONLY shortest supersequence. Result matches target.`
        : `nums is NOT uniquely reconstructable. ${!isUnique ? 'Multiple orderings exist.' : 'Order mismatch.'}`,
      variables: { result: finalMatch },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(nums.map((v, i) => [i, String(v)])),
        [],
        [...result]
      ),
    });

    return steps;
  },
};

export default sequenceReconstruction;
