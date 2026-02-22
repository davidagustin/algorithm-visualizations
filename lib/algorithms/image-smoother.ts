import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const imageSmoother: AlgorithmDefinition = {
  id: 'image-smoother',
  title: 'Image Smoother',
  leetcodeNumber: 661,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Apply a smoothing filter to an image matrix where each cell is replaced by the floor of the average of itself and its up-to-8 neighbors. Iterate each cell, collect all valid neighbors, compute the average, and store in a result matrix.',
  tags: ['array', 'matrix', 'simulation'],

  code: {
    pseudocode: `function imageSmoother(img):
  rows = length(img); cols = length(img[0])
  result = empty rows x cols matrix
  for r from 0 to rows-1:
    for c from 0 to cols-1:
      total = 0; count = 0
      for dr in [-1,0,1]:
        for dc in [-1,0,1]:
          nr=r+dr; nc=c+dc
          if 0<=nr<rows and 0<=nc<cols:
            total += img[nr][nc]; count++
      result[r][c] = floor(total/count)
  return result`,

    python: `def imageSmoother(img: list[list[int]]) -> list[list[int]]:
    rows, cols = len(img), len(img[0])
    result = [[0] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            total = count = 0
            for dr in [-1, 0, 1]:
                for dc in [-1, 0, 1]:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols:
                        total += img[nr][nc]
                        count += 1
            result[r][c] = total // count
    return result`,

    javascript: `function imageSmoother(img) {
  const rows = img.length, cols = img[0].length;
  const result = Array.from({length: rows}, () => Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let total = 0, count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            total += img[nr][nc]; count++;
          }
        }
      }
      result[r][c] = Math.floor(total / count);
    }
  }
  return result;
}`,

    java: `public int[][] imageSmoother(int[][] img) {
    int rows = img.length, cols = img[0].length;
    int[][] result = new int[rows][cols];
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            int total = 0, count = 0;
            for (int dr = -1; dr <= 1; dr++) {
                for (int dc = -1; dc <= 1; dc++) {
                    int nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        total += img[nr][nc]; count++;
                    }
                }
            }
            result[r][c] = total / count;
        }
    }
    return result;
}`,
  },

  defaultInput: {
    matrix: [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Image Matrix',
      type: 'array',
      defaultValue: [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
      placeholder: '1,1,1,1,0,1,1,1,1',
      helperText: '2D image matrix (grayscale values)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const img = input.matrix as number[][];
    const steps: AlgorithmStep[] = [];
    const rows = img.length;
    const cols = img[0].length;
    const result: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

    steps.push({
      line: 1,
      explanation: `Image is ${rows}x${cols}. Apply smoothing: replace each pixel with the floor average of its neighborhood.`,
      variables: { rows, cols },
      visualization: {
        type: 'array',
        array: img.flat(),
        highlights: {},
        labels: {},
      },
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let total = 0;
        let count = 0;

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              total += img[nr][nc];
              count++;
            }
          }
        }

        result[r][c] = Math.floor(total / count);
        const flatIdx = r * cols + c;

        steps.push({
          line: 9,
          explanation: `Cell (${r},${c}): neighbors sum=${total}, count=${count}. Smoothed value=floor(${total}/${count})=${result[r][c]}.`,
          variables: { r, c, total, count, smoothed: result[r][c] },
          visualization: {
            type: 'array',
            array: img.flat(),
            highlights: { [flatIdx]: 'active' },
            labels: { [flatIdx]: `-> ${result[r][c]}` },
          },
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Smoothing complete. Result: ${JSON.stringify(result)}.`,
      variables: { result: JSON.stringify(result) },
      visualization: {
        type: 'array',
        array: result.flat(),
        highlights: Object.fromEntries(result.flat().map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default imageSmoother;
