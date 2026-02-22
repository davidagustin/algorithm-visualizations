import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const completeBinaryTreeInserter: AlgorithmDefinition = {
  id: 'complete-binary-tree-inserter',
  title: 'Complete Binary Tree Inserter',
  leetcodeNumber: 919,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Design a data structure that inserts values into a complete binary tree in level-order. A complete binary tree fills all levels left to right. Store nodes in a list (BFS order). To insert: find the parent at index (size-1)//2. If parent has no left child, attach as left; otherwise attach as right. get_root returns the root node value.',
  tags: ['tree', 'bfs', 'design', 'array'],

  code: {
    pseudocode: `class CBTInserter:
  def __init__(root):
    tree = []  # BFS level-order list
    queue = [root]
    while queue:
      node = queue.pop(0)
      tree.append(node)
      if node.left: queue.append(node.left)
      if node.right: queue.append(node.right)

  def insert(val):
    newNode = Node(val)
    tree.append(newNode)
    parentIdx = (len(tree) - 2) // 2
    parent = tree[parentIdx]
    if parent.left is null:
      parent.left = newNode
    else:
      parent.right = newNode
    return parent.val

  def get_root():
    return tree[0].val`,
    python: `class CBTInserter:
    def __init__(self, root):
        self.tree = []
        q = deque([root])
        while q:
            node = q.popleft()
            self.tree.append(node)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
    def insert(self, val):
        new = TreeNode(val)
        self.tree.append(new)
        p = self.tree[(len(self.tree)-2)//2]
        if not p.left: p.left = new
        else: p.right = new
        return p.val
    def get_root(self):
        return self.tree[0].val`,
    javascript: `class CBTInserter {
  constructor(root) {
    this.tree = [];
    const q = [root];
    while (q.length) {
      const node = q.shift();
      this.tree.push(node);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
  }
  insert(val) {
    const node = new TreeNode(val);
    this.tree.push(node);
    const p = this.tree[Math.floor((this.tree.length - 2) / 2)];
    if (!p.left) p.left = node;
    else p.right = node;
    return p.val;
  }
  get_root() { return this.tree[0].val; }
}`,
    java: `class CBTInserter {
    List<TreeNode> tree = new ArrayList<>();
    public CBTInserter(TreeNode root) {
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            tree.add(n);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
    }
    public int insert(int val) {
        TreeNode node = new TreeNode(val);
        tree.add(node);
        TreeNode p = tree.get((tree.size() - 2) / 2);
        if (p.left == null) p.left = node;
        else p.right = node;
        return p.val;
    }
    public int get_root() { return tree.get(0).val; }
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
    insertVals: [6, 7, 8],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Initial Tree (level-order)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Initial complete binary tree in level-order',
    },
    {
      name: 'insertVals',
      label: 'Values to Insert',
      type: 'array',
      defaultValue: [6, 7, 8],
      placeholder: '6,7,8',
      helperText: 'Values to insert into the complete tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const insertVals = input.insertVals as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    const tree = [...nums];

    const initH: Record<number, string> = {};
    nums.forEach((_, i) => { initH[i] = 'sorted'; });

    steps.push({
      line: 1,
      explanation: `Initialize CBTInserter with complete tree: [${nums.join(', ')}]. BFS order stored as array. Size = ${nums.length}.`,
      variables: { treeSize: nums.length, root: nums[0] },
      visualization: makeViz(tree, initH, {}),
    });

    for (const val of insertVals) {
      tree.push(val);
      const newIdx = tree.length - 1;
      const parentIdx = Math.floor((newIdx - 1) / 2);
      const parentVal = tree[parentIdx];
      const isLeft = newIdx % 2 === 1;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      tree.forEach((_, i) => { highlights[i] = i < newIdx ? 'sorted' : 'found'; });
      highlights[parentIdx] = 'active';
      labels[parentIdx] = 'parent';
      labels[newIdx] = isLeft ? 'new(L)' : 'new(R)';

      steps.push({
        line: 12,
        explanation: `Insert(${val}): new node at index ${newIdx}. Parent index = floor((${newIdx}-1)/2) = ${parentIdx} (val=${parentVal}). Attach as ${isLeft ? 'LEFT' : 'RIGHT'} child. Return parent val = ${parentVal}.`,
        variables: { inserted: val, newIdx, parentIdx, parentVal, isLeftChild: isLeft },
        visualization: makeViz([...tree], highlights, labels),
      });
    }

    steps.push({
      line: 17,
      explanation: `get_root() returns tree[0] = ${tree[0]}. Final complete tree: [${tree.join(', ')}].`,
      variables: { root: tree[0], treeSize: tree.length },
      visualization: makeViz([...tree], Object.fromEntries(tree.map((_, i) => [i, i === 0 ? 'found' : 'sorted'])), { 0: 'root' }),
    });

    return steps;
  },
};

export default completeBinaryTreeInserter;
