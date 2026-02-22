import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findAllWordsOnABoard: AlgorithmDefinition = {
  id: 'find-all-words-on-a-board',
  title: 'Find All Words on a Board',
  leetcodeNumber: 212,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Given an m x n board of characters and a list of words, find all words that can be formed by sequentially adjacent cells (horizontal or vertical neighbors). We build a trie from the word list and perform DFS on the board, pruning paths that don\'t match any trie prefix.',
  tags: ['Trie', 'Backtracking', 'Matrix'],
  code: {
    pseudocode: `function findWords(board, words):
  build trie from words
  result = []
  for each cell (r, c) in board:
    dfs(board, r, c, trie.root, result)
  return result

function dfs(board, r, c, node, result):
  if out of bounds or visited: return
  char = board[r][c]
  if char not in node.children: return
  node = node.children[char]
  if node.word exists:
    result.append(node.word)
    node.word = null
  mark (r,c) as visited
  dfs all 4 neighbors
  unmark (r,c)`,
    python: `def findWords(board, words):
    trie = {}
    for w in words:
        node = trie
        for ch in w:
            node = node.setdefault(ch, {})
        node['$'] = w
    result = []
    for r in range(len(board)):
        for c in range(len(board[0])):
            dfs(board, r, c, trie, result)
    return result

def dfs(board, r, c, node, result):
    if r < 0 or r >= len(board) or c < 0 or c >= len(board[0]):
        return
    ch = board[r][c]
    if ch not in node:
        return
    node = node[ch]
    if '$' in node:
        result.append(node['$'])
        del node['$']
    board[r][c] = '#'
    for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
        dfs(board, r+dr, c+dc, node, result)
    board[r][c] = ch`,
    javascript: `function findWords(board, words) {
  const trie = {};
  for (const w of words) {
    let node = trie;
    for (const ch of w) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['$'] = w;
  }
  const result = [];
  for (let r = 0; r < board.length; r++)
    for (let c = 0; c < board[0].length; c++)
      dfs(board, r, c, trie, result);
  return result;
}
function dfs(board, r, c, node, result) {
  if (r<0||r>=board.length||c<0||c>=board[0].length) return;
  const ch = board[r][c];
  if (!node[ch]) return;
  node = node[ch];
  if (node['$']) { result.push(node['$']); node['$'] = null; }
  board[r][c] = '#';
  dfs(board,r+1,c,node,result);
  dfs(board,r-1,c,node,result);
  dfs(board,r,c+1,node,result);
  dfs(board,r,c-1,node,result);
  board[r][c] = ch;
}`,
    java: `public List<String> findWords(char[][] board, String[] words) {
    Map<Character, Object>[] trie = buildTrie(words);
    List<String> result = new ArrayList<>();
    for (int r = 0; r < board.length; r++)
        for (int c = 0; c < board[0].length; c++)
            dfs(board, r, c, trie, result);
    return result;
}`,
  },
  defaultInput: {
    board: 'o,a,a,n;e,t,a,e;i,h,k,r;i,f,l,v',
    words: 'oath,pea,eat,rain',
  },
  inputFields: [
    {
      name: 'board',
      label: 'Board (rows separated by ;)',
      type: 'string',
      defaultValue: 'o,a,a,n;e,t,a,e;i,h,k,r;i,f,l,v',
      placeholder: 'e.g. o,a,a,n;e,t,a,e;i,h,k,r;i,f,l,v',
      helperText: 'Rows separated by semicolons, cells by commas.',
    },
    {
      name: 'words',
      label: 'Words to find',
      type: 'string',
      defaultValue: 'oath,pea,eat,rain',
      placeholder: 'e.g. oath,pea,eat,rain',
      helperText: 'Comma-separated list of words to search for.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const boardStr = input.board as string;
    const wordsStr = input.words as string;
    const rows = boardStr.split(';').map(r => r.split(',').map(c => c.trim()));
    const words = wordsStr.split(',').map(w => w.trim());
    const numRows = rows.length;
    const numCols = rows[0].length;
    const flat = rows.flat();
    const steps: AlgorithmStep[] = [];
    const foundWords: string[] = [];

    interface TrieNode {
      children: Record<string, TrieNode>;
      word: string | null;
    }

    // Build trie
    const trieRoot: TrieNode = { children: {}, word: null };
    for (const w of words) {
      let node = trieRoot;
      for (const ch of w) {
        if (!(ch in node.children)) {
          node.children[ch] = { children: {}, word: null };
        }
        node = node.children[ch];
      }
      node.word = w;
    }

    function makeViz(activeIndices: number[], pathIndices: number[]): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < flat.length; i++) {
        labels[i] = flat[i];
      }
      for (const pi of pathIndices) {
        highlights[pi] = 'comparing';
      }
      for (const ai of activeIndices) {
        highlights[ai] = 'active';
      }
      return {
        type: 'array',
        array: Array.from({ length: flat.length }, (_, i) => i),
        highlights,
        labels,
        auxData: {
          label: 'Found Words',
          entries: foundWords.length > 0
            ? foundWords.map((w, i) => ({ key: `${i + 1}`, value: w }))
            : [{ key: '-', value: 'none yet' }],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Build trie from words [${words.join(', ')}]. Then DFS from each cell on the ${numRows}x${numCols} board.`,
      variables: { words, rows: numRows, cols: numCols },
      visualization: makeViz([], []),
    });

    const visited = new Set<number>();
    let stepCount = 0;
    const MAX_STEPS = 40;

    function toFlat(r: number, c: number): number {
      return r * numCols + c;
    }

    function dfs(r: number, c: number, node: TrieNode, path: number[]): void {
      if (stepCount >= MAX_STEPS) return;
      if (r < 0 || r >= numRows || c < 0 || c >= numCols) return;
      const fi = toFlat(r, c);
      if (visited.has(fi)) return;
      const ch = rows[r][c];
      if (!(ch in node.children)) return;

      node = node.children[ch];
      const newPath = [...path, fi];

      if (node.word) {
        foundWords.push(node.word);
        stepCount++;
        steps.push({
          line: 14,
          explanation: `FOUND word "${node.word}"! Path on board: [${newPath.map(i => flat[i]).join(' -> ')}].`,
          variables: { word: node.word, path: newPath.map(i => flat[i]) },
          visualization: makeViz(newPath, []),
        });
        node.word = null;
      } else {
        stepCount++;
        steps.push({
          line: 9,
          explanation: `DFS at (${r},${c})='${ch}'. Trie match so far: "${newPath.map(i => flat[i]).join('')}". Explore neighbors.`,
          variables: { r, c, char: ch },
          visualization: makeViz([fi], path),
        });
      }

      visited.add(fi);
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dr, dc] of dirs) {
        if (stepCount >= MAX_STEPS) break;
        dfs(r + dr, c + dc, node, newPath);
      }
      visited.delete(fi);
    }

    for (let r = 0; r < numRows && stepCount < MAX_STEPS; r++) {
      for (let c = 0; c < numCols && stepCount < MAX_STEPS; c++) {
        const ch = rows[r][c];
        if (ch in trieRoot.children) {
          stepCount++;
          steps.push({
            line: 5,
            explanation: `Start DFS from cell (${r},${c})='${ch}'. This matches a trie root child.`,
            variables: { r, c, char: ch },
            visualization: makeViz([toFlat(r, c)], []),
          });
          dfs(r, c, trieRoot, []);
        }
      }
    }

    steps.push({
      line: 6,
      explanation: `Search complete. Found ${foundWords.length} word(s): [${foundWords.join(', ') || 'none'}].`,
      variables: { result: foundWords.slice() },
      visualization: {
        type: 'array',
        array: Array.from({ length: flat.length }, (_, i) => i),
        highlights: Object.fromEntries(flat.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(flat.map((ch, i) => [i, ch])),
        auxData: {
          label: 'Found Words',
          entries: foundWords.length > 0
            ? foundWords.map((w, i) => ({ key: `${i + 1}`, value: w }))
            : [{ key: '-', value: 'none' }],
        },
      },
    });

    return steps;
  },
};

export default findAllWordsOnABoard;
