import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const wordSearchIiTrie: AlgorithmDefinition = {
  id: 'word-search-ii-trie',
  title: 'Word Search II (Trie)',
  leetcodeNumber: 212,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Given an m x n board and a list of words, find all words that exist in the board. Characters must be connected horizontally or vertically. Build a trie from the words, then DFS from each cell. At each DFS step, follow the trie; if a word end is reached, record it. Pruning: remove found words and dead trie branches for efficiency.',
  tags: ['trie', 'dfs', 'backtracking', 'matrix'],

  code: {
    pseudocode: `function findWords(board, words):
  build trie from words
  result = []
  for each cell (r, c) in board:
    dfs(board, r, c, trie.root, result)
  return result

function dfs(board, r, c, node, result):
  if out of bounds or visited or char not in node: return
  node = node[board[r][c]]
  if node.isEnd: result.add(node.word)
  mark visited
  dfs all 4 neighbors
  unmark visited`,

    python: `def findWords(board, words):
    trie = {}
    for word in words:
        node = trie
        for ch in word:
            node = node.setdefault(ch, {})
        node['#'] = word
    result = []
    rows, cols = len(board), len(board[0])
    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node: return
        next_node = node[ch]
        if '#' in next_node:
            result.append(next_node['#'])
            del next_node['#']
        board[r][c] = '*'
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0 <= nr < rows and 0 <= nc < cols:
                dfs(nr, nc, next_node)
        board[r][c] = ch
    for r in range(rows):
        for c in range(cols):
            dfs(r, c, trie)
    return result`,

    javascript: `function findWords(board, words) {
  const trie = {};
  for (const word of words) {
    let node = trie;
    for (const ch of word) { if (!node[ch]) node[ch] = {}; node = node[ch]; }
    node['#'] = word;
  }
  const result = [];
  const [rows, cols] = [board.length, board[0].length];
  function dfs(r, c, node) {
    const ch = board[r][c];
    if (!node[ch]) return;
    const next = node[ch];
    if (next['#']) { result.push(next['#']); delete next['#']; }
    board[r][c] = '*';
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const [nr, nc] = [r+dr, c+dc];
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) dfs(nr, nc, next);
    }
    board[r][c] = ch;
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) dfs(r, c, trie);
  return result;
}`,

    java: `public List<String> findWords(char[][] board, String[] words) {
    Map<Character, Object> trie = new HashMap<>();
    for (String word : words) {
        Map node = trie;
        for (char c : word.toCharArray()) node = (Map)node.computeIfAbsent(c, k -> new HashMap<>());
        node.put('#', word);
    }
    List<String> result = new ArrayList<>();
    for (int r = 0; r < board.length; r++)
        for (int c = 0; c < board[0].length; c++) dfs(board, r, c, trie, result);
    return result;
}`,
  },

  defaultInput: {
    board: [['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']],
    words: ['oath', 'pea', 'eat', 'rain'],
  },

  inputFields: [
    {
      name: 'board',
      label: 'Board (JSON)',
      type: 'string',
      defaultValue: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]',
      placeholder: '[["o","a"],["e","t"]]',
      helperText: 'JSON 2D array of characters',
    },
    {
      name: 'words',
      label: 'Words (JSON)',
      type: 'string',
      defaultValue: '["oath","pea","eat","rain"]',
      placeholder: '["oath","eat"]',
      helperText: 'JSON array of words to search',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const board = (typeof input.board === 'string'
      ? JSON.parse(input.board)
      : input.board) as string[][];
    const words = (typeof input.words === 'string'
      ? JSON.parse(input.words)
      : input.words) as string[];
    const steps: AlgorithmStep[] = [];

    const rows = board.length;
    const cols = board[0].length;
    const flatBoard = board.flat();

    steps.push({
      line: 1,
      explanation: `Build trie from ${words.length} words: [${words.map(w => `"${w}"`).join(', ')}].`,
      variables: { words: `[${words.join(', ')}]`, boardSize: `${rows}x${cols}` },
      visualization: {
        type: 'array',
        array: flatBoard.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(flatBoard.map((ch, i) => [i, ch])),
      },
    });

    // Build trie
    const trie: Record<string, unknown> = {};
    for (const word of words) {
      let node = trie;
      for (const ch of word) {
        if (!node[ch]) node[ch] = {};
        node = node[ch] as Record<string, unknown>;
      }
      node['#'] = word;
    }

    steps.push({
      line: 2,
      explanation: `Trie built. Now DFS from each cell on the board to find words.`,
      variables: { trieWords: words.length },
      visualization: {
        type: 'array',
        array: flatBoard.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(flatBoard.map((ch, i) => [i, ch])),
      },
    });

    const result: string[] = [];
    const boardCopy = board.map(row => [...row]);

    function dfs(r: number, c: number, node: Record<string, unknown>, path: number[]): void {
      if (r < 0 || r >= rows || c < 0 || c >= cols) return;
      const ch = boardCopy[r][c];
      if (ch === '*' || !node[ch]) return;

      const flatIdx = r * cols + c;
      const nextNode = node[ch] as Record<string, unknown>;

      steps.push({
        line: 9,
        explanation: `DFS at (${r},${c})="${ch}". Path so far explores: ${path.map(idx => flatBoard[idx]).join('')}${ch}.`,
        variables: { r, c, ch, pathLen: path.length + 1 },
        visualization: {
          type: 'array',
          array: flatBoard.map((_, i) => i),
          highlights: {
            ...Object.fromEntries(path.map(idx => [idx, 'visited'])),
            [flatIdx]: 'active',
          },
          labels: Object.fromEntries(flatBoard.map((c2, i) => [i, c2])),
        },
      });

      if (nextNode['#']) {
        const foundWord = nextNode['#'] as string;
        result.push(foundWord);
        delete nextNode['#'];
        steps.push({
          line: 11,
          explanation: `Word "${foundWord}" found! Added to results: [${result.map(w => `"${w}"`).join(', ')}].`,
          variables: { found: foundWord, results: result.join(', ') },
          visualization: {
            type: 'array',
            array: flatBoard.map((_, i) => i),
            highlights: {
              ...Object.fromEntries([...path, flatIdx].map(idx => [idx, 'found'])),
            },
            labels: Object.fromEntries(flatBoard.map((c2, i) => [i, c2])),
          },
        });
      }

      boardCopy[r][c] = '*';
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        dfs(r + dr, c + dc, nextNode, [...path, flatIdx]);
      }
      boardCopy[r][c] = ch;

      if (steps.length > 40) return;
    }

    for (let r = 0; r < rows && steps.length < 40; r++) {
      for (let c = 0; c < cols && steps.length < 40; c++) {
        dfs(r, c, trie, []);
      }
    }

    steps.push({
      line: 14,
      explanation: `Search complete. Found words: [${result.map(w => `"${w}"`).join(', ')}].`,
      variables: { result: result.join(', ') },
      visualization: {
        type: 'array',
        array: result.length > 0 ? result.map((_, i) => i) : [0],
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((w, i) => [i, `"${w}"`])),
      },
    });

    return steps;
  },
};

export default wordSearchIiTrie;
