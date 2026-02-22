import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const operationsOnTree: AlgorithmDefinition = {
  id: 'operations-on-tree',
  title: 'Operations on Tree',
  leetcodeNumber: 1993,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Design a data structure for a tree with n nodes supporting three operations: lock(node, user) - locks node if unlocked and no ancestor/descendant is locked; unlock(node, user) - unlocks node if locked by user; upgrade(node, user) - locks node if no ancestor is locked, at least one descendant is locked, then unlocks all those locked descendants. Tracks locked state and counts locked descendants for efficient upgrade queries.',
  tags: ['tree', 'design', 'dfs', 'hash map'],

  code: {
    pseudocode: `class LockingTree:
  def __init__(parent):
    children = build from parent
    locked = {}  # node -> user

  def lock(node, user):
    if node in locked: return False
    if any ancestor locked: return False
    if any descendant locked: return False
    locked[node] = user
    return True

  def unlock(node, user):
    if locked.get(node) != user: return False
    del locked[node]
    return True

  def upgrade(node, user):
    if node in locked: return False
    if any ancestor locked: return False
    if no descendant locked: return False
    # Lock node, unlock all descendants
    locked[node] = user
    unlock all locked descendants
    return True`,
    python: `class LockingTree:
    def __init__(self, parent):
        n = len(parent)
        self.children = [[] for _ in range(n)]
        self.locked = {}
        for i in range(1, n):
            self.children[parent[i]].append(i)
        self.parent = parent
    def lock(self, num, user):
        if num in self.locked: return False
        cur = self.parent[num]
        while cur != -1:
            if cur in self.locked: return False
            cur = self.parent[cur]
        return self._noLockedDesc(num) and (self.locked.__setitem__(num, user) or True)
    def unlock(self, num, user):
        if self.locked.get(num) != user: return False
        del self.locked[num]; return True
    def upgrade(self, num, user):
        if num in self.locked: return False
        cur = self.parent[num]
        while cur != -1:
            if cur in self.locked: return False
            cur = self.parent[cur]
        locked_desc = self._getLockedDesc(num)
        if not locked_desc: return False
        for d in locked_desc: del self.locked[d]
        self.locked[num] = user; return True`,
    javascript: `class LockingTree {
  constructor(parent) {
    const n = parent.length;
    this.children = Array.from({length: n}, () => []);
    this.locked = new Map();
    this.parent = parent;
    for (let i = 1; i < n; i++) this.children[parent[i]].push(i);
  }
  lock(num, user) {
    if (this.locked.has(num)) return false;
    let cur = this.parent[num];
    while (cur !== -1) { if (this.locked.has(cur)) return false; cur = this.parent[cur]; }
    if (!this._hasNoLockedDesc(num)) return false;
    this.locked.set(num, user); return true;
  }
  unlock(num, user) {
    if (this.locked.get(num) !== user) return false;
    this.locked.delete(num); return true;
  }
  upgrade(num, user) {
    if (this.locked.has(num)) return false;
    let cur = this.parent[num];
    while (cur !== -1) { if (this.locked.has(cur)) return false; cur = this.parent[cur]; }
    const desc = this._getLockedDesc(num);
    if (!desc.length) return false;
    for (const d of desc) this.locked.delete(d);
    this.locked.set(num, user); return true;
  }
}`,
    java: `class LockingTree {
    int[] parent;
    List<List<Integer>> children;
    Map<Integer,Integer> locked = new HashMap<>();
    public LockingTree(int[] parent) {
        this.parent = parent;
        int n = parent.length;
        children = new ArrayList<>();
        for (int i = 0; i < n; i++) children.add(new ArrayList<>());
        for (int i = 1; i < n; i++) children.get(parent[i]).add(i);
    }
    // lock, unlock, upgrade methods...
}`,
  },

  defaultInput: {
    parent: [-1, 0, 0, 1, 1, 2, 2],
    ops: [4, 2, 2, 5, 5, 0, 4],
  },

  inputFields: [
    {
      name: 'parent',
      label: 'Parent Array (-1 = root)',
      type: 'array',
      defaultValue: [-1, 0, 0, 1, 1, 2, 2],
      placeholder: '-1,0,0,1,1,2,2',
      helperText: 'parent[i] = parent of node i (-1 for root)',
    },
    {
      name: 'ops',
      label: 'Operations (node indices to demo)',
      type: 'array',
      defaultValue: [4, 2, 2, 5, 5, 0, 4],
      placeholder: '4,2,2,5,5,0,4',
      helperText: 'Sequence of node indices to demonstrate lock/upgrade/unlock',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const parent = input.parent as number[];
    const ops = input.ops as number[];
    const n = parent.length;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...parent],
      highlights,
      labels,
    });

    // Build children
    const children: number[][] = Array.from({ length: n }, () => []);
    for (let i = 1; i < n; i++) {
      if (parent[i] >= 0) children[parent[i]].push(i);
    }

    const locked: Map<number, number> = new Map();

    steps.push({
      line: 1,
      explanation: `Initialize LockingTree with ${n} nodes. Parent array: [${parent.join(', ')}]. Root = node 0. Operations: lock, unlock, upgrade.`,
      variables: { n, parent },
      visualization: makeViz({}, Object.fromEntries(parent.map((p, i) => [i, p === -1 ? 'root' : `p=${p}`]))),
    });

    function hasLockedAncestor(node: number): boolean {
      let cur = parent[node];
      while (cur !== -1) {
        if (locked.has(cur)) return true;
        cur = parent[cur] ?? -1;
      }
      return false;
    }

    function getLockedDescendants(node: number): number[] {
      const result: number[] = [];
      function dfs(n: number) {
        for (const child of children[n]) {
          if (locked.has(child)) result.push(child);
          dfs(child);
        }
      }
      dfs(node);
      return result;
    }

    // Simulate operations: lock first 3, then upgrade, then unlock
    const opSequence: Array<{ op: string; node: number; user: number }> = [];

    for (let i = 0; i < Math.min(ops.length, 3); i++) {
      opSequence.push({ op: 'lock', node: ops[i], user: i + 1 });
    }
    if (ops.length > 3) opSequence.push({ op: 'upgrade', node: ops[3], user: 99 });
    for (let i = 4; i < Math.min(ops.length, 7); i++) {
      const node = ops[i];
      if (locked.has(node)) {
        opSequence.push({ op: 'unlock', node, user: locked.get(node)! });
      } else {
        opSequence.push({ op: 'lock', node, user: i });
      }
    }

    for (const { op, node, user } of opSequence) {
      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      locked.forEach((u, n) => { h[n] = 'found'; l[n] = `L(u${u})`; });
      h[node] = 'active';
      l[node] = `${op.toUpperCase()}`;

      let result = false;

      if (op === 'lock') {
        if (!locked.has(node) && !hasLockedAncestor(node) && getLockedDescendants(node).length === 0) {
          locked.set(node, user);
          result = true;
          h[node] = 'found';
          l[node] = `L(u${user})`;
        }
        steps.push({
          line: 6,
          explanation: `lock(node=${node}, user=${user}): ${result ? 'SUCCESS - node locked' : 'FAILED - node already locked, ancestor locked, or descendant locked'}. locked nodes: [${[...locked.keys()].join(', ')}].`,
          variables: { op: 'lock', node, user, result, lockedNodes: [...locked.keys()] },
          visualization: makeViz({ ...h }, { ...l }),
        });
      } else if (op === 'unlock') {
        if (locked.get(node) === user) {
          locked.delete(node);
          result = true;
          h[node] = 'sorted';
          l[node] = 'unlocked';
        }
        steps.push({
          line: 13,
          explanation: `unlock(node=${node}, user=${user}): ${result ? 'SUCCESS - node unlocked' : 'FAILED - not locked by this user'}. locked nodes: [${[...locked.keys()].join(', ')}].`,
          variables: { op: 'unlock', node, user, result, lockedNodes: [...locked.keys()] },
          visualization: makeViz({ ...h }, { ...l }),
        });
      } else if (op === 'upgrade') {
        const lockedDesc = getLockedDescendants(node);
        if (!locked.has(node) && !hasLockedAncestor(node) && lockedDesc.length > 0) {
          lockedDesc.forEach(d => locked.delete(d));
          locked.set(node, user);
          result = true;
          h[node] = 'found';
          l[node] = `UPG(u${user})`;
          lockedDesc.forEach(d => { h[d] = 'sorted'; l[d] = 'freed'; });
        }
        steps.push({
          line: 18,
          explanation: `upgrade(node=${node}, user=${user}): ${result ? 'SUCCESS - locked node, freed ' + lockedDesc.length + ' descendants: [' + lockedDesc.join(',') + ']' : 'FAILED - conditions not met'}. locked nodes: [${[...locked.keys()].join(', ')}].`,
          variables: { op: 'upgrade', node, user, result, freedDescendants: lockedDesc, lockedNodes: [...locked.keys()] },
          visualization: makeViz({ ...h }, { ...l }),
        });
      }
    }

    return steps;
  },
};

export default operationsOnTree;
