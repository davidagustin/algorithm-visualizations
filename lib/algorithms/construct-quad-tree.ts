import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const constructQuadTree: AlgorithmDefinition = {
  id: 'construct-quad-tree',
  title: 'Construct Quad Tree',
  leetcodeNumber: 427,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given an n x n binary matrix, construct a quad tree. A quad tree node has isLeaf (true if all values in region are same) and val. If not a leaf, split region into 4 quadrants: topLeft, topRight, bottomLeft, bottomRight. Recursively build each quadrant. Uses divide and conquer with O(n^2 log n) time.',
  tags: ['tree', 'divide and conquer', 'matrix', 'recursion'],

  code: {
    pseudocode: `function construct(grid):
  function build(r, c, size):
    # Check if all values in region are same
    val = grid[r][c]
    isLeaf = true
    for each cell in region:
      if cell != val: isLeaf = false; break
    if isLeaf:
      return Node(val, true)
    half = size / 2
    topLeft = build(r, c, half)
    topRight = build(r, c+half, half)
    bottomLeft = build(r+half, c, half)
    bottomRight = build(r+half, c+half, half)
    return Node(1, false, topLeft, topRight, bottomLeft, bottomRight)
  return build(0, 0, n)`,
    python: `def construct(grid):
    n = len(grid)
    def build(r, c, size):
        val = grid[r][c]
        isLeaf = all(grid[r+i][c+j] == val
                     for i in range(size) for j in range(size))
        if isLeaf:
            return Node(val, True)
        h = size // 2
        return Node(1, False,
            build(r,c,h), build(r,c+h,h),
            build(r+h,c,h), build(r+h,c+h,h))
    return build(0, 0, n)`,
    javascript: `function construct(grid) {
  const n = grid.length;
  function build(r, c, size) {
    const val = grid[r][c];
    let isLeaf = true;
    for (let i = r; i < r+size && isLeaf; i++)
      for (let j = c; j < c+size && isLeaf; j++)
        if (grid[i][j] !== val) isLeaf = false;
    if (isLeaf) return new Node(val === 1, true);
    const h = size >> 1;
    return new Node(true, false,
      build(r,c,h), build(r,c+h,h),
      build(r+h,c,h), build(r+h,c+h,h));
  }
  return build(0, 0, n);
}`,
    java: `public Node construct(int[][] grid) {
    return build(grid, 0, 0, grid.length);
}
private Node build(int[][] g, int r, int c, int size) {
    int val = g[r][c]; boolean isLeaf = true;
    for (int i = r; i < r+size && isLeaf; i++)
        for (int j = c; j < c+size && isLeaf; j++)
            if (g[i][j] != val) isLeaf = false;
    if (isLeaf) return new Node(val == 1, true);
    int h = size / 2;
    return new Node(true, false,
        build(g,r,c,h), build(g,r,c+h,h),
        build(g,r+h,c,h), build(g,r+h,c+h,h));
}`,
  },

  defaultInput: {
    nums: [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Grid (row-major, n x n)',
      type: 'array',
      defaultValue: [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
      placeholder: '1,1,0,0,1,1,0,0,0,0,0,0,1,1,1,1',
      helperText: 'n x n binary matrix in row-major order (n^2 elements)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = Math.round(Math.sqrt(nums.length));

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Build quad tree for ${n}x${n} grid. Recursively divide into quadrants until each region is uniform.`,
      variables: { n, totalCells: nums.length },
      visualization: makeViz({}, {}),
    });

    let stepCount = 0;

    function build(r: number, c: number, size: number, depth: number): boolean {
      if (stepCount > 15) return false;

      const indices: number[] = [];
      for (let i = r; i < r + size; i++) {
        for (let j = c; j < c + size; j++) {
          indices.push(i * n + j);
        }
      }

      const val = nums[r * n + c];
      const isLeaf = indices.every(idx => nums[idx] === val);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      indices.forEach((idx, pos) => {
        highlights[idx] = isLeaf ? 'found' : 'active';
        if (pos === 0) labels[idx] = `r${r}c${c}`;
      });

      steps.push({
        line: isLeaf ? 7 : 9,
        explanation: isLeaf
          ? `Region (row=${r}, col=${c}, size=${size}): all values = ${val}. isLeaf=true. Create leaf node.`
          : `Region (row=${r}, col=${c}, size=${size}): mixed values. Not a leaf. Split into 4 quadrants.`,
        variables: { row: r, col: c, size, isLeaf, val, depth },
        visualization: makeViz(highlights, labels),
      });

      if (!isLeaf && size > 1) {
        stepCount++;
        const half = Math.floor(size / 2);
        build(r, c, half, depth + 1);
        build(r, c + half, half, depth + 1);
        build(r + half, c, half, depth + 1);
        build(r + half, c + half, half, depth + 1);
      }
      return isLeaf;
    }

    build(0, 0, n, 0);

    steps.push({
      line: 16,
      explanation: 'Quad tree construction complete. Uniform regions became leaves; mixed regions were subdivided.',
      variables: { done: true },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default constructQuadTree;
