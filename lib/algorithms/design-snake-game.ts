import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designSnakeGame: AlgorithmDefinition = {
  id: 'design-snake-game',
  title: 'Design Snake Game',
  leetcodeNumber: 353,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a Snake game on an m x n grid. The snake starts at (0,0) with length 1. Food appears at specific positions. Move the snake in U/D/L/R directions. Return score (foods eaten) or -1 if game over.',
  tags: ['Hash Map', 'Design', 'Queue', 'Simulation'],
  code: {
    pseudocode: `class SnakeGame:
  function init(width, height, food):
    snake = deque([(0,0)])
    snakeSet = {(0,0)}
    foodIndex = 0
  function move(direction):
    head = snake[0]
    newHead = move head in direction
    if newHead out of bounds: return -1
    if food[foodIndex] == newHead:
      foodIndex++; score++
    else:
      tail = snake.pop(); snakeSet.remove(tail)
    if newHead in snakeSet: return -1
    snake.appendleft(newHead)
    snakeSet.add(newHead)
    return score`,
    python: `from collections import deque

class SnakeGame:
    def __init__(self, width, height, food):
        self.w = width; self.h = height
        self.food = food; self.fi = 0; self.score = 0
        self.snake = deque([(0, 0)])
        self.body = {(0, 0)}

    def move(self, direction: str) -> int:
        r, c = self.snake[0]
        dr = {'U': -1, 'D': 1, 'L': 0, 'R': 0}
        dc = {'U': 0, 'D': 0, 'L': -1, 'R': 1}
        nr, nc = r + dr[direction], c + dc[direction]
        if nr < 0 or nr >= self.h or nc < 0 or nc >= self.w: return -1
        tail = self.snake[-1]
        if self.fi < len(self.food) and [nr, nc] == self.food[self.fi]:
            self.fi += 1; self.score += 1
        else:
            self.snake.pop(); self.body.remove(tail)
        if (nr, nc) in self.body: return -1
        self.snake.appendleft((nr, nc)); self.body.add((nr, nc))
        return self.score`,
    javascript: `class SnakeGame {
  constructor(width, height, food) {
    this.w = width; this.h = height;
    this.food = food; this.fi = 0; this.score = 0;
    this.snake = [[0, 0]];
    this.body = new Set(['0,0']);
  }
  move(dir) {
    const [r, c] = this.snake[0];
    const d = {U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]};
    const [nr, nc] = [r + d[dir][0], c + d[dir][1]];
    if (nr < 0 || nr >= this.h || nc < 0 || nc >= this.w) return -1;
    const tail = this.snake[this.snake.length - 1];
    if (this.fi < this.food.length && this.food[this.fi][0]===nr && this.food[this.fi][1]===nc) {
      this.fi++; this.score++;
    } else {
      this.snake.pop(); this.body.delete(tail.join(','));
    }
    if (this.body.has(\`\${nr},\${nc}\`)) return -1;
    this.snake.unshift([nr, nc]); this.body.add(\`\${nr},\${nc}\`);
    return this.score;
  }
}`,
    java: `class SnakeGame {
    private int w, h, fi, score;
    private int[][] food;
    private Deque<int[]> snake = new ArrayDeque<>();
    private Set<String> body = new HashSet<>();
    public SnakeGame(int width, int height, int[][] food) {
        w = width; h = height; this.food = food;
        snake.addFirst(new int[]{0, 0}); body.add("0,0");
    }
    public int move(String dir) {
        int[] head = snake.peekFirst();
        int nr = head[0], nc = head[1];
        if (dir.equals("U")) nr--; else if (dir.equals("D")) nr++;
        else if (dir.equals("L")) nc--; else nc++;
        if (nr < 0 || nr >= h || nc < 0 || nc >= w) return -1;
        int[] tail = snake.peekLast();
        if (fi < food.length && food[fi][0] == nr && food[fi][1] == nc) { fi++; score++; }
        else { snake.pollLast(); body.remove(tail[0]+","+tail[1]); }
        if (body.contains(nr+","+nc)) return -1;
        snake.addFirst(new int[]{nr, nc}); body.add(nr+","+nc);
        return score;
    }
}`,
  },
  defaultInput: {
    width: 3,
    height: 2,
    food: [[1, 2], [0, 1]],
    moves: ['R', 'D', 'R', 'U', 'L', 'U'],
  },
  inputFields: [
    { name: 'width', label: 'Width', type: 'number', defaultValue: 3 },
    { name: 'height', label: 'Height', type: 'number', defaultValue: 2 },
    {
      name: 'moves',
      label: 'Moves',
      type: 'string',
      defaultValue: 'R, D, R, U, L, U',
      placeholder: 'R, D, L, U',
      helperText: 'Comma-separated directions: U, D, L, R',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const width = (input.width as number) || 3;
    const height = (input.height as number) || 2;
    const food = (input.food as number[][]) || [[1, 2], [0, 1]];
    const movesRaw = input.moves as string | string[];
    const moves = Array.isArray(movesRaw) ? movesRaw as string[] : (movesRaw as string).split(',').map(s => s.trim().toUpperCase());

    const steps: AlgorithmStep[] = [];
    let snake: [number, number][] = [[0, 0]];
    const body = new Set<string>(['0,0']);
    let fi = 0, score = 0;

    function makeViz(label: string, gameOver: boolean): ArrayVisualization {
      const arr = snake.map(([r, c]) => r * width + c);
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      snake.forEach(([r, c], i) => {
        const idx = r * width + c;
        highlights[i] = gameOver ? 'mismatch' : i === 0 ? 'active' : 'found';
        lbls[i] = i === 0 ? `H(${r},${c})` : `B(${r},${c})`;
      });
      return {
        type: 'array',
        array: arr,
        highlights,
        labels: lbls,
        auxData: {
          label: 'Snake Game',
          entries: [
            { key: 'Action', value: label },
            { key: 'Score', value: `${score}` },
            { key: 'Length', value: `${snake.length}` },
            { key: 'Head', value: `(${snake[0][0]},${snake[0][1]})` },
            { key: 'Next food', value: fi < food.length ? `(${food[fi][0]},${food[fi][1]})` : 'none' },
            { key: 'Game over', value: `${gameOver}` },
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: `Initialize Snake Game on ${height}x${width} grid. Snake starts at (0,0).`, variables: { width, height, score }, visualization: makeViz('Init', false) });

    const dirMap: Record<string, [number, number]> = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };

    for (const dir of moves) {
      const [r, c] = snake[0];
      const [dr, dc] = dirMap[dir] || [0, 0];
      const nr = r + dr, nc = c + dc;

      if (nr < 0 || nr >= height || nc < 0 || nc >= width) {
        steps.push({ line: 10, explanation: `move(${dir}): Snake hits wall at (${nr},${nc}). Game over! Return -1.`, variables: { dir, newHead: [nr, nc], result: -1 }, visualization: makeViz(`move(${dir}) -> -1 (wall)`, true) });
        break;
      }

      const tail = snake[snake.length - 1];
      if (fi < food.length && food[fi][0] === nr && food[fi][1] === nc) {
        fi++; score++;
      } else {
        snake.pop();
        body.delete(`${tail[0]},${tail[1]}`);
      }

      if (body.has(`${nr},${nc}`)) {
        steps.push({ line: 16, explanation: `move(${dir}): Snake collides with body at (${nr},${nc}). Game over! Return -1.`, variables: { dir, newHead: [nr, nc], result: -1 }, visualization: makeViz(`move(${dir}) -> -1 (self)`, true) });
        break;
      }

      snake.unshift([nr, nc]);
      body.add(`${nr},${nc}`);

      steps.push({ line: 17, explanation: `move(${dir}): Snake moves to (${nr},${nc}). Score: ${score}. Length: ${snake.length}.`, variables: { dir, head: [nr, nc], score, length: snake.length }, visualization: makeViz(`move(${dir}) -> ${score}`, false) });
    }

    steps.push({ line: 18, explanation: `Simulation complete. Final score: ${score}.`, variables: { score, length: snake.length }, visualization: makeViz('Complete', false) });

    return steps;
  },
};

export default designSnakeGame;
