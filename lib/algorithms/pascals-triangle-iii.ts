import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pascalsTriangleIII: AlgorithmDefinition = {
  id: 'pascals-triangle-iii',
  title: "Pascal's Triangle III",
  leetcodeNumber: 118,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    "Generate the first numRows of Pascal's Triangle. Each row starts and ends with 1. Interior elements equal the sum of the two elements above. Demonstrates dynamic programming: each row is derived from the previous. O(n²) time and space where n=numRows.",
  tags: ['Dynamic Programming', 'Array', 'Math'],
  code: {
    pseudocode: `function generate(numRows):
  triangle = [[1]]
  for i from 1 to numRows-1:
    prev = triangle[i-1]
    row = [1]
    for j from 1 to i-1:
      row.append(prev[j-1] + prev[j])
    row.append(1)
    triangle.append(row)
  return triangle`,
    python: `def generate(numRows):
    triangle = [[1]]
    for i in range(1, numRows):
        prev = triangle[i-1]
        row = [1] + [prev[j-1]+prev[j] for j in range(1,i)] + [1]
        triangle.append(row)
    return triangle`,
    javascript: `function generate(numRows) {
  const triangle = [[1]];
  for (let i = 1; i < numRows; i++) {
    const prev = triangle[i-1];
    const row = [1];
    for (let j = 1; j < i; j++) row.push(prev[j-1]+prev[j]);
    row.push(1);
    triangle.push(row);
  }
  return triangle;
}`,
    java: `public List<List<Integer>> generate(int numRows) {
    List<List<Integer>> tri = new ArrayList<>();
    tri.add(Arrays.asList(1));
    for (int i=1; i<numRows; i++) {
        List<Integer> prev=tri.get(i-1), row=new ArrayList<>();
        row.add(1);
        for (int j=1; j<i; j++) row.add(prev.get(j-1)+prev.get(j));
        row.add(1); tri.add(row);
    }
    return tri;
}`,
  },
  defaultInput: { numRows: 5 },
  inputFields: [
    {
      name: 'numRows',
      label: 'Number of Rows',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Number of rows to generate',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numRows = input.numRows as number;
    const steps: AlgorithmStep[] = [];

    const triangle: number[][] = [[1]];

    const makeViz = (
      flatArr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: flatArr,
      highlights,
      labels,
      auxData: { label: "Pascal's Triangle", entries: auxEntries },
    });

    const flattenTriangle = () => triangle.flat();

    steps.push({
      line: 1,
      explanation: `Generate ${numRows} rows of Pascal's Triangle. Row 0: [1].`,
      variables: { numRows },
      visualization: makeViz(
        [1],
        {},
        { 0: 'row0' },
        [{ key: 'Rows to Generate', value: String(numRows) }],
      ),
    });

    for (let i = 1; i < numRows; i++) {
      const prev = triangle[i - 1];
      const row = [1];
      for (let j = 1; j < i; j++) {
        const val = prev[j - 1] + prev[j];
        row.push(val);
      }
      row.push(1);
      triangle.push(row);

      const flat = flattenTriangle();
      const flatLen = flat.length;
      const rowStartIdx = flat.length - row.length;

      steps.push({
        line: 7,
        explanation: `Row ${i}: [${row.join(',')}]. Each interior value = sum of two values above.`,
        variables: { row: i, values: [...row] },
        visualization: makeViz(
          flat,
          {
            ...Object.fromEntries(Array.from({ length: rowStartIdx }, (_, k) => [k, 'visited'])),
            ...Object.fromEntries(Array.from({ length: row.length }, (_, k) => [rowStartIdx + k, k === 0 || k === row.length - 1 ? 'sorted' : 'active'])),
          },
          Object.fromEntries(flat.map((v, k) => [k, String(v)])),
          [{ key: 'Row', value: String(i) }, { key: 'Values', value: row.join(',') }],
        ),
      });
    }

    const flat = flattenTriangle();

    steps.push({
      line: 9,
      explanation: `Done! Generated ${numRows} rows. Triangle (flattened): [${flat.join(',')}].`,
      variables: { triangle },
      visualization: makeViz(
        flat,
        Object.fromEntries(flat.map((_, k) => [k, 'found'])),
        Object.fromEntries(flat.map((v, k) => [k, String(v)])),
        [{ key: 'Total Elements', value: String(flat.length) }, { key: 'Rows', value: String(numRows) }],
      ),
    });

    return steps;
  },
};

export default pascalsTriangleIII;
