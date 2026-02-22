import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const floodFill: AlgorithmDefinition = {
  id: 'flood-fill',
  title: 'Flood Fill',
  leetcodeNumber: 733,
  difficulty: 'Easy',
  category: 'Graph',
  description:
    'Given an image represented as a 2D grid of integers and a starting pixel, perform a flood fill. Change the color of the starting pixel and all adjacent connected pixels of the same original color to the new color. Uses DFS or BFS to traverse connected pixels.',
  tags: ['graph', 'dfs', 'bfs', 'matrix', 'flood fill'],

  code: {
    pseudocode: `function floodFill(image, sr, sc, color):
  origColor = image[sr][sc]
  if origColor == color: return image
  dfs(image, sr, sc, origColor, color)
  return image

function dfs(image, r, c, orig, newColor):
  if out of bounds or image[r][c] != orig: return
  image[r][c] = newColor
  dfs(image, r-1, c, orig, newColor)
  dfs(image, r+1, c, orig, newColor)
  dfs(image, r, c-1, orig, newColor)
  dfs(image, r, c+1, orig, newColor)`,

    python: `def floodFill(image, sr, sc, color):
    orig = image[sr][sc]
    if orig == color:
        return image
    def dfs(r, c):
        if r < 0 or r >= len(image) or c < 0 or c >= len(image[0]):
            return
        if image[r][c] != orig:
            return
        image[r][c] = color
        dfs(r-1, c); dfs(r+1, c)
        dfs(r, c-1); dfs(r, c+1)
    dfs(sr, sc)
    return image`,

    javascript: `function floodFill(image, sr, sc, color) {
  const orig = image[sr][sc];
  if (orig === color) return image;
  function dfs(r, c) {
    if (r < 0 || r >= image.length || c < 0 || c >= image[0].length) return;
    if (image[r][c] !== orig) return;
    image[r][c] = color;
    dfs(r-1,c); dfs(r+1,c); dfs(r,c-1); dfs(r,c+1);
  }
  dfs(sr, sc);
  return image;
}`,

    java: `public int[][] floodFill(int[][] image, int sr, int sc, int color) {
    int orig = image[sr][sc];
    if (orig == color) return image;
    dfs(image, sr, sc, orig, color);
    return image;
}
void dfs(int[][] image, int r, int c, int orig, int color) {
    if (r < 0 || r >= image.length || c < 0 || c >= image[0].length) return;
    if (image[r][c] != orig) return;
    image[r][c] = color;
    dfs(image,r-1,c,orig,color); dfs(image,r+1,c,orig,color);
    dfs(image,r,c-1,orig,color); dfs(image,r,c+1,orig,color);
}`,
  },

  defaultInput: {
    image: [1, 1, 1, 1, 0, 1, 1, 1, 1],
    rows: 3,
    cols: 3,
    sr: 1,
    sc: 1,
    newColor: 2,
  },

  inputFields: [
    {
      name: 'image',
      label: 'Image (flattened row by row)',
      type: 'array',
      defaultValue: [1, 1, 1, 1, 0, 1, 1, 1, 1],
      placeholder: '1,1,1,1,0,1,1,1,1',
      helperText: 'Flattened 3x3 image grid',
    },
    {
      name: 'rows',
      label: 'Rows',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of rows in image',
    },
    {
      name: 'cols',
      label: 'Cols',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of columns in image',
    },
    {
      name: 'sr',
      label: 'Start Row',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Starting row index',
    },
    {
      name: 'sc',
      label: 'Start Col',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Starting column index',
    },
    {
      name: 'newColor',
      label: 'New Color',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'New color value to fill',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flatImage = input.image as number[];
    const rows = input.rows as number;
    const cols = input.cols as number;
    const sr = input.sr as number;
    const sc = input.sc as number;
    const newColor = input.newColor as number;
    const steps: AlgorithmStep[] = [];

    const image = flatImage.slice(0, rows * cols);
    while (image.length < rows * cols) image.push(0);

    const grid = image.slice();
    const orig = grid[sr * cols + sc];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...grid],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start flood fill from (${sr},${sc}). Original color=${orig}, new color=${newColor}. Grid size: ${rows}x${cols}.`,
      variables: { sr, sc, orig, newColor },
      visualization: makeViz({ [sr * cols + sc]: 'active' }, { [sr * cols + sc]: 'start' }),
    });

    if (orig === newColor) {
      steps.push({
        line: 3,
        explanation: `Original color equals new color. No change needed. Return image as-is.`,
        variables: { result: 'no change' },
        visualization: makeViz({}, {}),
      });
      return steps;
    }

    const visited = new Set<number>();
    const stack: [number, number][] = [[sr, sc]];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      const idx = r * cols + c;

      if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
      if (grid[idx] !== orig) continue;
      if (visited.has(idx)) continue;

      visited.add(idx);
      grid[idx] = newColor;

      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (const v of visited) { hl[v] = 'found'; lb[v] = `${newColor}`; }
      hl[idx] = 'active';
      lb[idx] = 'fill';

      steps.push({
        line: 8,
        explanation: `Fill cell (${r},${c}) from color ${orig} to ${newColor}. Explore neighbors.`,
        variables: { row: r, col: c, filledCount: visited.size },
        visualization: makeViz(hl, lb),
      });

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const nIdx = nr * cols + nc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nIdx] === orig && !visited.has(nIdx)) {
          stack.push([nr, nc]);
        }
      }
    }

    const finalHl: Record<number, string> = {};
    const finalLb: Record<number, string> = {};
    for (const v of visited) { finalHl[v] = 'sorted'; finalLb[v] = `${newColor}`; }

    steps.push({
      line: 12,
      explanation: `Flood fill complete. Filled ${visited.size} cells from color ${orig} to ${newColor}.`,
      variables: { cellsFilled: visited.size, newColor },
      visualization: makeViz(finalHl, finalLb),
    });

    return steps;
  },
};

export default floodFill;
