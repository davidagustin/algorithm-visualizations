import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const longestPathWithDifferentAdjacentChars: AlgorithmDefinition = {
  id: 'longest-path-with-different-adjacent-chars',
  title: 'Longest Path With Different Adjacent Characters',
  leetcodeNumber: 2246,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a tree rooted at node 0 with character labels on each node, find the longest path such that no two adjacent nodes have the same character. Uses DFS with DP: for each node, compute the longest chain going downward through children with different chars. The answer is the sum of the two longest such chains plus 1.',
  tags: ['dynamic programming', 'tree', 'depth-first search', 'string'],

  code: {
    pseudocode: `function longestPath(parent, s):
  build children list from parent
  ans = 1
  function dfs(node):
    top1 = top2 = 0  // two longest chains from children
    for child in children[node]:
      len = dfs(child)
      if s[child] != s[node]:
        if len > top1: top2=top1; top1=len
        elif len > top2: top2=len
    ans = max(ans, top1+top2+1)
    return top1+1
  dfs(0)
  return ans`,

    python: `def longestPath(parent, s):
    n = len(parent)
    children = [[] for _ in range(n)]
    for i in range(1, n):
        children[parent[i]].append(i)
    ans = [1]
    def dfs(node):
        top1 = top2 = 0
        for child in children[node]:
            length = dfs(child)
            if s[child] != s[node]:
                if length > top1: top2=top1; top1=length
                elif length > top2: top2=length
        ans[0] = max(ans[0], top1+top2+1)
        return top1+1
    dfs(0)
    return ans[0]`,

    javascript: `function longestPath(parent, s) {
  const n = parent.length;
  const children = Array.from({length:n}, ()=>[]);
  for (let i = 1; i < n; i++) children[parent[i]].push(i);
  let ans = 1;
  function dfs(node) {
    let top1=0, top2=0;
    for (const child of children[node]) {
      const len = dfs(child);
      if (s[child] !== s[node]) {
        if (len > top1) {top2=top1; top1=len;}
        else if (len > top2) top2=len;
      }
    }
    ans = Math.max(ans, top1+top2+1);
    return top1+1;
  }
  dfs(0);
  return ans;
}`,

    java: `public int longestPath(int[] parent, String s) {
    int n = parent.length;
    List<Integer>[] ch = new List[n];
    for (int i=0;i<n;i++) ch[i]=new ArrayList<>();
    for (int i=1;i<n;i++) ch[parent[i]].add(i);
    int[] ans = {1};
    dfs(0, ch, s, ans);
    return ans[0];
}
int dfs(int node, List<Integer>[] ch, String s, int[] ans) {
    int top1=0, top2=0;
    for (int child : ch[node]) {
        int len=dfs(child,ch,s,ans);
        if (s.charAt(child)!=s.charAt(node)) {
            if (len>top1){top2=top1;top1=len;} else if(len>top2)top2=len;
        }
    }
    ans[0]=Math.max(ans[0],top1+top2+1);
    return top1+1;
}`,
  },

  defaultInput: {
    parent: [-1, 0, 0, 1, 1, 2],
    s: 'abacbe',
  },

  inputFields: [
    {
      name: 'parent',
      label: 'Parent Array',
      type: 'array',
      defaultValue: [-1, 0, 0, 1, 1, 2],
      placeholder: '-1,0,0,1,1,2',
      helperText: 'parent[i] = parent of node i (root has parent -1)',
    },
    {
      name: 's',
      label: 'Node Labels',
      type: 'string',
      defaultValue: 'abacbe',
      placeholder: 'abacbe',
      helperText: 'Character label for each node (s[i] = label of node i)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const parent = input.parent as number[];
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = parent.length;

    const children: number[][] = Array.from({ length: n }, () => []);
    for (let i = 1; i < n; i++) children[parent[i]].push(i);

    let ans = 1;
    const dpVal = new Array(n).fill(1);

    steps.push({
      line: 1,
      explanation: `Tree with ${n} nodes labeled "${s}". DFS from root 0. For each node, track the 2 longest chains from children with different chars.`,
      variables: { n, labels: s },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i),
        highlights: { 0: 'active' },
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, s[i]])),
      },
    });

    function dfs(node: number): number {
      let top1 = 0, top2 = 0;
      for (const child of children[node]) {
        const len = dfs(child);
        if (s[child] !== s[node]) {
          if (len > top1) { top2 = top1; top1 = len; }
          else if (len > top2) top2 = len;
        }
      }
      ans = Math.max(ans, top1 + top2 + 1);
      dpVal[node] = top1 + 1;

      const highlights: Record<number, string> = { [node]: 'found' };
      for (const c of children[node]) highlights[c] = 'active';

      steps.push({
        line: 7,
        explanation: `Node ${node} ("${s[node]}"): top chains from children = [${top1}, ${top2}]. Path through node = ${top1 + top2 + 1}. Global max = ${ans}.`,
        variables: { node, label: s[node], top1, top2, pathLength: top1 + top2 + 1, globalMax: ans },
        visualization: {
          type: 'array',
          array: [...dpVal],
          highlights,
          labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, s[i]])),
        },
      });

      return top1 + 1;
    }

    dfs(0);

    steps.push({
      line: 10,
      explanation: `Longest path with different adjacent characters: ${ans}.`,
      variables: { answer: ans },
      visualization: {
        type: 'array',
        array: [...dpVal],
        highlights: {},
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, s[i]])),
      },
    });

    return steps;
  },
};

export default longestPathWithDifferentAdjacentChars;
