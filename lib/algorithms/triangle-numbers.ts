import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const triangleNumbers: AlgorithmDefinition = {
  id: 'triangle-numbers',
  title: 'Triangle Numbers',
  leetcodeNumber: 118,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Generate the first n rows of Pascal\'s triangle. Each row starts and ends with 1, and each interior value is the sum of the two values directly above it from the previous row.',
  tags: ['Math', 'Array', 'Dynamic Programming'],
  code: {
    pseudocode: `function generate(numRows):
  triangle = []
  for i from 0 to numRows-1:
    row = array of size i+1, filled with 1
    for j from 1 to i-1:
      row[j] = triangle[i-1][j-1] + triangle[i-1][j]
    triangle.append(row)
  return triangle`,
    python: `def generate(numRows):
    triangle = []
    for i in range(numRows):
        row = [1] * (i + 1)
        for j in range(1, i):
            row[j] = triangle[i-1][j-1] + triangle[i-1][j]
        triangle.append(row)
    return triangle`,
    javascript: `function generate(numRows) {
  const triangle = [];
  for (let i = 0; i < numRows; i++) {
    const row = new Array(i + 1).fill(1);
    for (let j = 1; j < i; j++) {
      row[j] = triangle[i-1][j-1] + triangle[i-1][j];
    }
    triangle.push(row);
  }
  return triangle;
}`,
    java: `public List<List<Integer>> generate(int numRows) {
    List<List<Integer>> triangle = new ArrayList<>();
    for (int i = 0; i < numRows; i++) {
        List<Integer> row = new ArrayList<>();
        for (int j = 0; j <= i; j++) {
            if (j == 0 || j == i) row.add(1);
            else row.add(triangle.get(i-1).get(j-1)
                       + triangle.get(i-1).get(j));
        }
        triangle.add(row);
    }
    return triangle;
}`,
  },
  defaultInput: { numRows: 5 },
  inputFields: [
    {
      name: 'numRows',
      label: 'Number of Rows',
      type: 'number',
      defaultValue: 5,
      placeholder: 'e.g. 5',
      helperText: 'Number of rows of Pascal\'s triangle to generate (1-10)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numRows = input.numRows as number;
    const steps: AlgorithmStep[] = [];
    const triangle: number[][] = [];

    // Flatten all values into a single dp-table visualization
    // Total cells = sum of 1+2+...+numRows = numRows*(numRows+1)/2
    function makeViz(
      activeRow: number,
      activeCol: number | null,
      comparing: [number, number][]
    ): DPVisualization {
      const values: (number | null)[] = [];
      const labels: string[] = [];
      const highlights: Record<number, string> = {};
      let idx = 0;

      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c <= r; c++) {
          if (r < triangle.length) {
            values.push(triangle[r][c]);
            labels.push(`R${r}[${c}]`);
            highlights[idx] = 'found';
          } else if (r === triangle.length && activeCol !== null) {
            // Current row being built
            values.push(null);
            labels.push(`R${r}[${c}]`);
            highlights[idx] = 'default';
          } else {
            values.push(null);
            labels.push(`R${r}[${c}]`);
          }

          // Active cell
          if (r === activeRow && c === activeCol) {
            highlights[idx] = 'active';
          }

          // Comparing cells (parents)
          for (const [cr, cc] of comparing) {
            if (r === cr && c === cc) {
              highlights[idx] = 'comparing';
            }
          }

          idx++;
        }
      }

      return {
        type: 'dp-table',
        values,
        highlights,
        labels,
      };
    }

    steps.push({
      line: 1,
      explanation: `Generate ${numRows} rows of Pascal's triangle.`,
      variables: { numRows },
      visualization: makeViz(-1, null, []),
    });

    for (let i = 0; i < numRows; i++) {
      const row = new Array(i + 1).fill(1);

      steps.push({
        line: 3,
        explanation: `Start row ${i}: initialize with 1s. Row has ${i + 1} elements.`,
        variables: { row: i, size: i + 1 },
        visualization: (() => {
          // Temporarily add the row for viz
          triangle.push(row.slice());
          const viz = makeViz(i, 0, []);
          triangle.pop();
          return viz;
        })(),
      });

      for (let j = 1; j < i; j++) {
        const left = triangle[i - 1][j - 1];
        const right = triangle[i - 1][j];
        row[j] = left + right;

        // Show computation
        triangle.push(row.slice()); // temp
        const viz = makeViz(i, j, [[i - 1, j - 1], [i - 1, j]]);
        triangle.pop();

        steps.push({
          line: 5,
          explanation: `R${i}[${j}] = R${i - 1}[${j - 1}] + R${i - 1}[${j}] = ${left} + ${right} = ${row[j]}.`,
          variables: { row: i, col: j, left, right, value: row[j] },
          visualization: viz,
        });
      }

      triangle.push(row);

      steps.push({
        line: 6,
        explanation: `Row ${i} complete: [${row.join(', ')}].`,
        variables: { row: i, values: [...row] },
        visualization: makeViz(i, null, []),
      });
    }

    // Final result
    steps.push({
      line: 7,
      explanation: `Pascal's triangle with ${numRows} rows complete!`,
      variables: { triangle: triangle.map(r => [...r]) },
      visualization: (() => {
        const values: (number | null)[] = [];
        const labels: string[] = [];
        const highlights: Record<number, string> = {};
        let idx = 0;
        for (let r = 0; r < numRows; r++) {
          for (let c = 0; c <= r; c++) {
            values.push(triangle[r][c]);
            labels.push(`${triangle[r][c]}`);
            highlights[idx] = 'found';
            idx++;
          }
        }
        return { type: 'dp-table' as const, values, highlights, labels };
      })(),
    });

    return steps;
  },
};

export default triangleNumbers;
