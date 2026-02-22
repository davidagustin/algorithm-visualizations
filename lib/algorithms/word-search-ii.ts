import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const wordSearchIi: AlgorithmDefinition = {
  id: 'word-search-ii',
  title: 'Word Search II (Trie Optimization)',
  leetcodeNumber: 212,
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'Given a board of characters and a list of words, find all words that exist in the board. Characters can be used in adjacent cells (horizontal/vertical) but not reused in the same path. Uses a Trie to efficiently prune search paths and avoid redundant work.',
  tags: ['backtracking', 'trie', 'matrix', 'dfs', 'word search'],

  code: {
    pseudocode: `function findWords(board, words):
  trie = buildTrie(words)
  result = []
  for each cell (r, c) in board:
    dfs(board, trie.root, r, c, result)
  return result

function dfs(board, node, r, c, result):
  if r/c out of bounds or board[r][c] == '#': return
  char = board[r][c]
  if char not in node.children: return (trie prune)
  nextNode = node.children[char]
  if nextNode.word: result.add(nextNode.word)
  board[r][c] = '#' (mark visited)
  dfs all 4 neighbors
  board[r][c] = char (restore)`,

    python: `def findWords(board, words):
    trie = {}
    for word in words:
        node = trie
        for ch in word:
            node = node.setdefault(ch, {})
        node['#'] = word
    result = []
    def dfs(node, r, c):
        if r < 0 or r >= len(board) or c < 0 or c >= len(board[0]):
            return
        ch = board[r][c]
        if ch not in node:
            return
        next_node = node[ch]
        if '#' in next_node:
            result.append(next_node.pop('#'))
        board[r][c] = '!'
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            dfs(next_node, r+dr, c+dc)
        board[r][c] = ch
    for r in range(len(board)):
        for c in range(len(board[0])):
            dfs(trie, r, c)
    return result`,

    javascript: `function findWords(board, words) {
  const trie = {};
  for (const word of words) {
    let node = trie;
    for (const ch of word) {
      node[ch] = node[ch] || {};
      node = node[ch];
    }
    node['#'] = word;
  }
  const result = [];
  function dfs(node, r, c) {
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
    const ch = board[r][c];
    if (!node[ch]) return;
    const next = node[ch];
    if (next['#']) { result.push(next['#']); delete next['#']; }
    board[r][c] = '#';
    dfs(next, r-1, c); dfs(next, r+1, c);
    dfs(next, r, c-1); dfs(next, r, c+1);
    board[r][c] = ch;
  }
  for (let r = 0; r < board.length; r++)
    for (let c = 0; c < board[0].length; c++)
      dfs(trie, r, c);
  return result;
}`,

    java: `public List<String> findWords(char[][] board, String[] words) {
    Map<Character, Object> trie = new HashMap<>();
    for (String word : words) {
        Map node = trie;
        for (char ch : word.toCharArray()) {
            node = (Map) node.computeIfAbsent(ch, k -> new HashMap<>());
        }
        node.put('#', word);
    }
    Set<String> result = new HashSet<>();
    for (int r = 0; r < board.length; r++)
        for (int c = 0; c < board[0].length; c++)
            dfs(board, trie, r, c, result);
    return new ArrayList<>(result);
}`,
  },

  defaultInput: {
    board: [['o','a','a','n'],['e','t','a','e'],['i','h','k','r'],['i','f','l','v']],
    words: ['oath', 'eat', 'rain'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words to Find',
      type: 'array',
      defaultValue: ['oath', 'eat', 'rain'],
      placeholder: 'oath,eat,rain',
      helperText: 'Comma-separated words to search for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const board = (input.board as string[][]) || [
      ['o','a','a','n'],
      ['e','t','a','e'],
      ['i','h','k','r'],
      ['i','f','l','v'],
    ];
    const steps: AlgorithmStep[] = [];
    const rows = board.length;
    const cols = board[0].length;
    const found: string[] = [];

    steps.push({
      line: 1,
      explanation: `Building Trie from words: [${words.map(w => `"${w}"`).join(', ')}]. Trie allows prefix-based pruning.`,
      variables: { words, boardSize: `${rows}x${cols}` },
      visualization: {
        type: 'array',
        array: words.map((_, i) => i + 1),
        highlights: words.reduce((acc, _, i) => ({ ...acc, [i]: 'active' }), {}),
        labels: words.reduce((acc, w, i) => ({ ...acc, [i]: w }), {} as Record<number, string>),
      },
    });

    type TrieNode = { [key: string]: TrieNode | string };
    const trie: TrieNode = {};
    for (const word of words) {
      let node = trie;
      for (const ch of word) {
        if (!node[ch]) node[ch] = {};
        node = node[ch] as TrieNode;
      }
      node['#'] = word;
    }

    steps.push({
      line: 2,
      explanation: `Trie built. Now scanning each cell of the ${rows}x${cols} board as a potential starting point.`,
      variables: { trieWords: words.length, boardCells: rows * cols },
      visualization: {
        type: 'array',
        array: board.flat().map((c, i) => i),
        highlights: {},
        labels: board.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
      },
    });

    const localBoard = board.map(row => [...row]);

    function dfs(node: TrieNode, r: number, c: number, path: string) {
      if (r < 0 || r >= rows || c < 0 || c >= cols) return;
      const ch = localBoard[r][c];
      if (ch === '#' || !node[ch]) return;

      const nextNode = node[ch] as TrieNode;

      steps.push({
        line: 8,
        explanation: `At cell (${r},${c})="${ch}", path="${path + ch}". Checking Trie node for prefix match.`,
        variables: { row: r, col: c, char: ch, path: path + ch },
        visualization: {
          type: 'array',
          array: board.flat().map((_, i) => i),
          highlights: { [r * cols + c]: 'active' },
          labels: { [r * cols + c]: ch },
        },
      });

      if (nextNode['#']) {
        const word = nextNode['#'] as string;
        found.push(word);
        delete nextNode['#'];
        steps.push({
          line: 13,
          explanation: `Found word "${word}" ending at (${r},${c})! Total found: ${found.length}`,
          variables: { wordFound: word, totalFound: found.length, foundSoFar: [...found] },
          visualization: {
            type: 'array',
            array: board.flat().map((_, i) => i),
            highlights: { [r * cols + c]: 'found' },
            labels: { [r * cols + c]: word },
          },
        });
      }

      localBoard[r][c] = '#';
      dfs(nextNode, r - 1, c, path + ch);
      dfs(nextNode, r + 1, c, path + ch);
      dfs(nextNode, r, c - 1, path + ch);
      dfs(nextNode, r, c + 1, path + ch);
      localBoard[r][c] = ch;
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dfs(trie, r, c, '');
      }
    }

    steps.push({
      line: 6,
      explanation: `Word search complete. Found ${found.length} words: [${found.map(w => `"${w}"`).join(', ')}]`,
      variables: { found, totalFound: found.length },
      visualization: {
        type: 'array',
        array: found.map((_, i) => i + 1),
        highlights: found.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        labels: found.reduce((acc, w, i) => ({ ...acc, [i]: w }), {} as Record<number, string>),
      },
    });

    return steps;
  },
};

export default wordSearchIi;
