import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const imageOverlap: AlgorithmDefinition = {
  id: 'image-overlap',
  title: 'Image Overlap',
  leetcodeNumber: 835,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given two n x n binary matrices A and B, return the largest possible overlap when translating A over B. The overlap is the number of cells where both have a 1 after translation. Try all possible (dx, dy) offsets and count matching 1-1 cells.',
  tags: ['Matrix', 'Counting', 'Simulation'],
  code: {
    pseudocode: `function largestOverlap(A, B):
  n = len(A)
  best = 0
  for dx in range(-(n-1), n):
    for dy in range(-(n-1), n):
      overlap = count cells where A[i][j]==1 and B[i+dx][j+dy]==1
      best = max(best, overlap)
  return best`,
    python: `def largestOverlap(A, B):
    n = len(A)
    best = 0
    for dx in range(-(n-1), n):
        for dy in range(-(n-1), n):
            cnt = 0
            for i in range(n):
                for j in range(n):
                    ni, nj = i+dx, j+dy
                    if 0<=ni<n and 0<=nj<n and A[i][j]==1 and B[ni][nj]==1:
                        cnt += 1
            best = max(best, cnt)
    return best`,
    javascript: `function largestOverlap(A, B) {
  const n = A.length;
  let best = 0;
  for (let dx=-(n-1);dx<n;dx++)
    for (let dy=-(n-1);dy<n;dy++) {
      let cnt=0;
      for (let i=0;i<n;i++) for(let j=0;j<n;j++) {
        const ni=i+dx,nj=j+dy;
        if(ni>=0&&ni<n&&nj>=0&&nj<n&&A[i][j]===1&&B[ni][nj]===1) cnt++;
      }
      best=Math.max(best,cnt);
    }
  return best;
}`,
    java: `public int largestOverlap(int[][] A, int[][] B) {
    int n=A.length, best=0;
    for(int dx=-(n-1);dx<n;dx++) for(int dy=-(n-1);dy<n;dy++) {
        int cnt=0;
        for(int i=0;i<n;i++) for(int j=0;j<n;j++) {
            int ni=i+dx,nj=j+dy;
            if(ni>=0&&ni<n&&nj>=0&&nj<n&&A[i][j]==1&&B[ni][nj]==1) cnt++;
        }
        best=Math.max(best,cnt);
    }
    return best;
}`,
  },
  defaultInput: {
    matrixA: [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
    matrixB: [[0, 0, 0], [0, 1, 1], [0, 0, 1]],
  },
  inputFields: [
    {
      name: 'matrixA',
      label: 'Matrix A',
      type: 'string',
      defaultValue: '1 1 0, 0 1 0, 0 1 0',
      placeholder: 'e.g. 1 1 0, 0 1 0, 0 1 0',
      helperText: 'Binary matrix A, rows by commas',
    },
    {
      name: 'matrixB',
      label: 'Matrix B',
      type: 'string',
      defaultValue: '0 0 0, 0 1 1, 0 0 1',
      placeholder: 'e.g. 0 0 0, 0 1 1, 0 0 1',
      helperText: 'Binary matrix B, rows by commas',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    function parseMatrix(val: unknown): number[][] {
      if (Array.isArray(val) && Array.isArray((val as unknown[][])[0])) return val as number[][];
      return (val as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }
    const A = parseMatrix(input.matrixA);
    const B = parseMatrix(input.matrixB);
    const n = A.length;
    const steps: AlgorithmStep[] = [];
    let best = 0;
    let bestDx = 0, bestDy = 0;

    // combined visualization: A on left half, B on right half of a 1x2n array
    function makeViz(dx: number, dy: number, cnt: number, overlapCells: number[]): ArrayVisualization {
      // Flatten A then B side by side
      const flatA = A.flat();
      const flatB = B.flat();
      const combined = [...flatA, ...flatB];
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `A(${ri},${ci})`;
        highlights[i] = flatA[i] === 1 ? 'visited' : 'default';
      }
      for (let i = 0; i < n * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[n * n + i] = `B(${ri},${ci})`;
        highlights[n * n + i] = flatB[i] === 1 ? 'sorted' : 'default';
      }
      for (const c of overlapCells) {
        highlights[c] = 'found';
        highlights[n * n + c] = 'found';
      }
      return {
        type: 'array',
        array: combined,
        highlights,
        labels,
        auxData: { label: 'Image Overlap', entries: [{ key: 'Offset (dx,dy)', value: `(${dx},${dy})` }, { key: 'Overlap', value: `${cnt}` }, { key: 'Best', value: `${best}` }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find largest overlap between two ${n}x${n} binary images. Try all ${(2 * n - 1) ** 2} offsets.`,
      variables: { n, totalOffsets: (2 * n - 1) ** 2 },
      visualization: makeViz(0, 0, 0, []),
    });

    for (let dx = -(n - 1); dx < n; dx++) {
      for (let dy = -(n - 1); dy < n; dy++) {
        let cnt = 0;
        const overlapCells: number[] = [];
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            const ni = i + dx, nj = j + dy;
            if (ni >= 0 && ni < n && nj >= 0 && nj < n && A[i][j] === 1 && B[ni][nj] === 1) {
              cnt++;
              overlapCells.push(i * n + j);
            }
          }
        }
        if (cnt > best) {
          best = cnt; bestDx = dx; bestDy = dy;
          steps.push({
            line: 6,
            explanation: `Offset (${dx},${dy}): overlap=${cnt}. New best!`,
            variables: { dx, dy, cnt, best },
            visualization: makeViz(dx, dy, cnt, overlapCells),
          });
        }
      }
    }

    steps.push({
      line: 8,
      explanation: `Best overlap = ${best} at offset (${bestDx},${bestDy}).`,
      variables: { best, bestDx, bestDy },
      visualization: makeViz(bestDx, bestDy, best, []),
    });

    return steps;
  },
};

export default imageOverlap;
