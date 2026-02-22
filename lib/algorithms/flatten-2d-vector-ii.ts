import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const flatten2dVectorII: AlgorithmDefinition = {
  id: 'flatten-2d-vector-ii',
  title: 'Flatten 2D Vector II',
  leetcodeNumber: 251,
  difficulty: 'Medium',
  category: 'Design',
  description:
    'Design an iterator to flatten a 2D vector. Use an outer index for the row and an inner index for the column. hasNext() advances past empty rows. next() returns the current element and advances. O(1) amortized per call.',
  tags: ['Design', 'Iterator', 'Array', 'Two Pointers'],
  code: {
    pseudocode: `class Vector2D:
  def __init__(vec):
    self.vec = vec
    self.row = self.col = 0
  def advance():
    while row < len(vec) and col >= len(vec[row]):
      row++; col = 0
  def next():
    advance()
    val = vec[row][col]; col++
    return val
  def hasNext():
    advance()
    return row < len(vec)`,
    python: `class Vector2D:
    def __init__(self, vec):
        self.vec = vec
        self.row = self.col = 0
    def _advance(self):
        while self.row < len(self.vec) and self.col >= len(self.vec[self.row]):
            self.row += 1; self.col = 0
    def next(self):
        self._advance()
        val = self.vec[self.row][self.col]
        self.col += 1
        return val
    def hasNext(self):
        self._advance()
        return self.row < len(self.vec)`,
    javascript: `class Vector2D {
  constructor(vec) { this.vec=vec; this.row=this.col=0; }
  advance() {
    while (this.row<this.vec.length && this.col>=this.vec[this.row].length) {
      this.row++; this.col=0;
    }
  }
  next() { this.advance(); return this.vec[this.row][this.col++]; }
  hasNext() { this.advance(); return this.row<this.vec.length; }
}`,
    java: `class Vector2D {
    private int[][] vec; private int row, col;
    public Vector2D(int[][] vec) { this.vec=vec; }
    private void advance() {
        while(row<vec.length && col>=vec[row].length) { row++; col=0; }
    }
    public int next() { advance(); return vec[row][col++]; }
    public boolean hasNext() { advance(); return row<vec.length; }
}`,
  },
  defaultInput: { vec: [1, 2, 3, 4, 5, 6] },
  inputFields: [
    {
      name: 'vec',
      label: '2D Vector (flat)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6],
      placeholder: '1,2,3,4,5,6',
      helperText: 'Flat representation of 2D vector rows',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flatVec = input.vec as number[];
    const steps: AlgorithmStep[] = [];

    // Split into rows of size 2-3 for demo
    const vec: number[][] = [];
    for (let i = 0; i < flatVec.length; i += 3) {
      vec.push(flatVec.slice(i, Math.min(i + 3, flatVec.length)));
    }

    const allValues = vec.flat();
    let row = 0, col = 0;
    const result: number[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...allValues],
      highlights,
      labels,
      auxData: { label: 'Vector2D Iterator', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `Vector2D initialized. vec=${JSON.stringify(vec)}. Flattened: [${allValues.join(',')}]. row=0, col=0.`,
      variables: { vec, row, col },
      visualization: makeViz(
        {},
        Object.fromEntries(allValues.map((v, i) => [i, String(v)])),
        [{ key: 'row', value: '0' }, { key: 'col', value: '0' }],
      ),
    });

    let flatIdx = 0;
    while (row < vec.length) {
      // advance past empty rows
      while (row < vec.length && col >= vec[row].length) { row++; col = 0; }
      if (row >= vec.length) break;

      const val = vec[row][col];
      steps.push({
        line: 7,
        explanation: `next() returns vec[${row}][${col}]=${val}. Advance col to ${col + 1}.`,
        variables: { val, row, col },
        visualization: makeViz(
          { [flatIdx]: 'active' },
          Object.fromEntries(allValues.map((v, i) => [i, i === flatIdx ? `row${row}` : String(v)])),
          [{ key: 'Returned', value: String(val) }, { key: 'row', value: String(row) }, { key: 'col', value: String(col) }],
        ),
      });

      result.push(val);
      col++; flatIdx++;
    }

    steps.push({
      line: 10,
      explanation: `hasNext() = false. Flattened output: [${result.join(',')}].`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        Object.fromEntries(result.map((v, i) => [i, String(v)])),
        [{ key: 'Flattened', value: result.join(',') }],
      ),
    });

    return steps;
  },
};

export default flatten2dVectorII;
