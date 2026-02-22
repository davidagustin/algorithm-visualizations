import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const fallingSquares: AlgorithmDefinition = {
  id: 'falling-squares',
  title: 'Falling Squares',
  leetcodeNumber: 699,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Squares fall onto the X-axis. Each square [left, size] falls from the sky, lands on top of existing squares in its column range. After each drop, return the maximum height of all stacked squares. Uses a segment tree with lazy propagation for range-max queries.',
  tags: ['Segment Tree', 'Coordinate Compression', 'Array'],
  code: {
    pseudocode: `function fallingSquares(positions):
  results = []
  heights = [] // track [left, right, height] of landed squares

  for [left, size] in positions:
    right = left + size - 1
    base = 0
    // find max height in range [left, right]
    for existing in heights:
      if overlap(existing, left, right):
        base = max(base, existing.height)
    newHeight = base + size
    heights.push([left, right, newHeight])
    results.push(max of all heights so far)

  return results`,
    python: `class Solution:
    def fallingSquares(self, positions):
        results = []
        intervals = []  # (left, right, height)

        for left, size in positions:
            right = left + size
            base = 0
            for l, r, h in intervals:
                if l < right and r > left:  # overlap
                    base = max(base, h)
            new_height = base + size
            intervals.append((left, right, new_height))
            results.append(max(h for _, _, h in intervals))

        return results`,
    javascript: `var fallingSquares = function(positions) {
  const results = [];
  const intervals = [];
  for (const [left, size] of positions) {
    const right = left + size;
    let base = 0;
    for (const [l, r, h] of intervals) {
      if (l < right && r > left) base = Math.max(base, h);
    }
    const newH = base + size;
    intervals.push([left, right, newH]);
    results.push(Math.max(...intervals.map(([,,h])=>h)));
  }
  return results;
};`,
    java: `class Solution {
    public List<Integer> fallingSquares(int[][] positions) {
        List<int[]> intervals = new ArrayList<>();
        List<Integer> results = new ArrayList<>();
        int maxH = 0;
        for (int[] pos : positions) {
            int left=pos[0], size=pos[1], right=left+size;
            int base = 0;
            for (int[] iv : intervals)
                if (iv[0]<right && iv[1]>left) base=Math.max(base,iv[2]);
            int newH = base+size;
            intervals.add(new int[]{left,right,newH});
            maxH = Math.max(maxH, newH);
            results.add(maxH);
        }
        return results;
    }
}`,
  },
  defaultInput: { positions: [[1,2],[2,3],[6,1]] },
  inputFields: [
    { name: 'positions', label: 'Positions [[left,size],...]', type: 'array', defaultValue: [[1,2],[2,3],[6,1]], helperText: 'Each square: [left, side_length]' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const positions = input.positions as number[][];
    const steps: AlgorithmStep[] = [];
    const intervals: [number, number, number][] = [];
    const results: number[] = [];

    steps.push({
      line: 1,
      explanation: `Dropping ${positions.length} squares. Tracking max height after each drop.`,
      variables: { positions },
      visualization: { type: 'array', array: [0], highlights: {}, labels: { 0: 'start' } },
    });

    for (let i = 0; i < positions.length; i++) {
      const [left, size] = positions[i];
      const right = left + size;
      let base = 0;

      for (const [l, r, h] of intervals) {
        if (l < right && r > left) base = Math.max(base, h);
      }

      const newHeight = base + size;
      intervals.push([left, right, newHeight]);
      const maxHeight = Math.max(...intervals.map(([,,h]) => h));
      results.push(maxHeight);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      intervals.forEach(([, , h], idx) => {
        highlights[idx] = idx === intervals.length - 1 ? 'active' : 'visited';
        labels[idx] = `h=${h}`;
      });

      steps.push({
        line: 9,
        explanation: `Square ${i+1}: [${left},${left+size}) lands on base=${base}, new height=${newHeight}. Max height so far: ${maxHeight}`,
        variables: { left, size, right, base, newHeight, maxHeight },
        visualization: {
          type: 'array',
          array: intervals.map(([,,h]) => h),
          highlights,
          labels,
        },
      });
    }

    steps.push({
      line: 11,
      explanation: `Results: [${results.join(', ')}] — max heights after each square drop`,
      variables: { results },
      visualization: {
        type: 'array',
        array: results,
        highlights: Object.fromEntries(results.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(results.map((v, i) => [i, `${v}`])),
      },
    });

    return steps;
  },
};

export default fallingSquares;
