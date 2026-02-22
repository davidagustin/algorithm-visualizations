import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const operationsOnTree: AlgorithmDefinition = {
  id: 'operations-on-tree',
  title: 'Operations on Tree',
  leetcodeNumber: 1993,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Design a tree-based lock system with nodes 0 to n-1. Each node can be locked/unlocked by a user if: no ancestor or descendant is locked by a different user. Simulate lock, unlock, and upgrade operations on the tree.',
  tags: ['Tree', 'DFS', 'Design', 'Hash Map'],
  code: {
    pseudocode: `class LockingTree:
  lock(num, user):
    if locked[num] != 0: return false
    locked[num] = user; return true
  
  unlock(num, user):
    if locked[num] != user: return false
    locked[num] = 0; return true
  
  upgrade(num, user):
    if locked[num] != 0: return false
    if any ancestor is locked: return false
    if no locked descendant: return false
    unlock all locked descendants
    locked[num] = user; return true`,
    python: `class LockingTree:
    def __init__(self, parent):
        n = len(parent)
        self.locked = [0] * n
        self.parent = parent
        self.children = defaultdict(list)
        for i in range(1, n):
            self.children[parent[i]].append(i)
    def lock(self, num, user):
        if self.locked[num]: return False
        self.locked[num] = user; return True
    def unlock(self, num, user):
        if self.locked[num] != user: return False
        self.locked[num] = 0; return True
    def upgrade(self, num, user):
        if self.locked[num]: return False
        node = self.parent[num]
        while node != -1:
            if self.locked[node]: return False
            node = self.parent[node]
        locked_desc = []
        def dfs(v):
            if self.locked[v]: locked_desc.append(v)
            for c in self.children[v]: dfs(c)
        dfs(num)
        if not locked_desc: return False
        for v in locked_desc: self.locked[v] = 0
        self.locked[num] = user; return True`,
    javascript: `class LockingTree {
  constructor(parent) {
    this.n = parent.length;
    this.locked = new Array(this.n).fill(0);
    this.parent = parent;
    this.children = Array.from({length: this.n}, () => []);
    for (let i = 1; i < this.n; i++) this.children[parent[i]].push(i);
  }
  lock(num, user) {
    if (this.locked[num]) return false;
    this.locked[num] = user; return true;
  }
  unlock(num, user) {
    if (this.locked[num] !== user) return false;
    this.locked[num] = 0; return true;
  }
  upgrade(num, user) { /* ... */ }
}`,
    java: `class LockingTree {
    int[] locked, parent;
    List<List<Integer>> children;
    LockingTree(int[] parent) {
        this.parent = parent;
        locked = new int[parent.length];
        children = new ArrayList<>();
        for (int i = 0; i < parent.length; i++) children.add(new ArrayList<>());
        for (int i = 1; i < parent.length; i++) children.get(parent[i]).add(i);
    }
    // lock, unlock, upgrade methods
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5, 6, 7] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5, 6, 7],
      placeholder: 'e.g. 1,2,3,4,5,6,7',
      helperText: 'Tree structure for operations visualization.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const locked: Record<number, number> = {}; // idx -> user

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty.', variables: {}, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Initialize LockingTree. All nodes start unlocked.',
      variables: { nodes: tree.filter(v => v != null).length },
      visualization: makeViz({}),
    });

    // Simulate lock(1, 1)
    locked[1] = 1;
    steps.push({
      line: 2,
      explanation: `lock(node=1, user=1): Node at idx 1 was unlocked. Lock it. Return true.`,
      variables: { operation: 'lock', node: 1, user: 1, result: true },
      visualization: makeViz({ 1: 'active' }),
    });

    // Simulate lock(1, 2) - fail
    steps.push({
      line: 2,
      explanation: `lock(node=1, user=2): Node at idx 1 is already locked by user 1. Return false.`,
      variables: { operation: 'lock', node: 1, user: 2, result: false },
      visualization: makeViz({ 1: 'mismatch' }),
    });

    // Simulate unlock(1, 1) - success
    delete locked[1];
    steps.push({
      line: 7,
      explanation: `unlock(node=1, user=1): User 1 matches. Unlock node. Return true.`,
      variables: { operation: 'unlock', node: 1, user: 1, result: true },
      visualization: makeViz({ 1: 'found' }),
    });

    // Show upgrade concept
    locked[3] = 2;
    locked[5] = 2;
    steps.push({
      line: 12,
      explanation: 'Upgrade operation: lock a node and unlock all its locked descendants in one step (if no ancestors are locked).',
      variables: { operation: 'upgrade', concept: 'lock target + unlock descendants' },
      visualization: makeViz({ 3: 'pointer', 5: 'pointer', 0: 'active' }),
    });

    const finalHighlights: Record<number, string> = {};
    tree.forEach((v, i) => { if (v != null) finalHighlights[i] = 'visited'; });

    steps.push({
      line: 16,
      explanation: 'LockingTree operations: lock O(1), unlock O(1), upgrade O(n) for ancestor/descendant scan.',
      variables: { timeComplexity: { lock: 'O(1)', unlock: 'O(1)', upgrade: 'O(n)' } },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default operationsOnTree;
