import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const longestPathWithDifferentCharacters: AlgorithmDefinition = {
  id: 'longest-path-with-different-characters',
  title: 'Longest Path With Different Adjacent Characters',
  leetcodeNumber: 2246,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given a tree rooted at node 0 with n nodes labeled 0 to n-1, and a string s where s[i] is the character of node i, find the longest path where no two adjacent nodes have the same character. Use DFS: for each node, collect the two longest valid child paths and combine them.',
  tags: ['Tree', 'DFS', 'String'],
  code: {
    pseudocode: `ans = 1
function longestPath(parent, s):
  build adjacency list
  dfs(0, -1)
  return ans

function dfs(node, parentNode):
  top1 = top2 = 0
  for child in children[node]:
    childLen = dfs(child, node)
    if s[child] != s[node]:
      if childLen > top1: top2=top1; top1=childLen
      elif childLen > top2: top2=childLen
  ans = max(ans, top1+top2+1)
  return top1 + 1`,
    python: `def longestPath(parent, s):
    n = len(s)
    children = defaultdict(list)
    for i in range(1, n):
        children[parent[i]].append(i)
    ans = 1
    def dfs(node):
        nonlocal ans
        top1 = top2 = 0
        for child in children[node]:
            length = dfs(child)
            if s[child] != s[node]:
                if length > top1: top2, top1 = top1, length
                elif length > top2: top2 = length
        ans = max(ans, top1 + top2 + 1)
        return top1 + 1
    dfs(0)
    return ans`,
    javascript: `function longestPath(parent, s) {
  const n = s.length;
  const children = Array.from({length: n}, () => []);
  for (let i = 1; i < n; i++) children[parent[i]].push(i);
  let ans = 1;
  function dfs(node) {
    let top1 = 0, top2 = 0;
    for (const child of children[node]) {
      const len = dfs(child);
      if (s[child] !== s[node]) {
        if (len > top1) { top2 = top1; top1 = len; }
        else if (len > top2) top2 = len;
      }
    }
    ans = Math.max(ans, top1 + top2 + 1);
    return top1 + 1;
  }
  dfs(0);
  return ans;
}`,
    java: `public int longestPath(int[] parent, String s) {
    int n = s.length();
    List<List<Integer>> children = new ArrayList<>();
    for (int i = 0; i < n; i++) children.add(new ArrayList<>());
    for (int i = 1; i < n; i++) children.get(parent[i]).add(i);
    int[] ans = {1};
    dfs(0, parent, s, children, ans);
    return ans[0];
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5, 6, 7], s: 'aabcabb' },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order, represents node values)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5, 6, 7],
      placeholder: 'e.g. 1,2,3,4,5,6,7',
      helperText: 'Level-order tree for visualization.',
    },
    {
      name: 's',
      label: 'Node characters string',
      type: 'string',
      defaultValue: 'aabcabb',
      placeholder: 'e.g. aabcabb',
      helperText: 'Character for each node (index = node id).',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const s = (input.s as string) || 'aabcabb';
    const steps: AlgorithmStep[] = [];
    let ans = 1;
    const visited = new Set<number>();

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty. Return 1.', variables: { ans: 1 }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Find longest path with no two adjacent nodes having same character. String s="${s}".`,
      variables: { s, root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;
      visited.add(idx);

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      const l = 2 * idx + 1, r = 2 * idx + 2;
      let top1 = 0, top2 = 0;

      const charCur = s[idx] || '';

      [l, r].forEach(childIdx => {
        if (childIdx < tree.length && tree[childIdx] != null) {
          const len = dfs(childIdx);
          const charChild = s[childIdx] || '';
          if (charChild !== charCur) {
            if (len > top1) { top2 = top1; top1 = len; }
            else if (len > top2) top2 = len;
          }
        }
      });

      const pathLen = top1 + top2 + 1;
      if (pathLen > ans) ans = pathLen;

      steps.push({
        line: 11,
        explanation: `Node ${tree[idx]} (char='${charCur}'): top two child lengths=${top1},${top2}. Path through=${pathLen}. Global ans=${ans}.`,
        variables: { node: tree[idx], char: charCur, top1, top2, pathLen, ans },
        visualization: makeViz(highlights),
      });

      return top1 + 1;
    }

    dfs(0);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 5,
      explanation: `Longest path with different adjacent characters = ${ans}.`,
      variables: { ans },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default longestPathWithDifferentCharacters;
