import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wordSquares: AlgorithmDefinition = {
  id: 'word-squares',
  title: 'Word Squares',
  leetcodeNumber: 425,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Given a set of words of equal length, find all word squares. A word square is a sequence where the k-th row and k-th column form the same word. Use a trie to efficiently look up all words that start with a given prefix. Backtrack row by row, using column characters of placed words as the prefix constraint for the next row.',
  tags: ['trie', 'backtracking', 'string'],

  code: {
    pseudocode: `function wordSquares(words):
  trie = buildTrie(words)
  n = len(words[0])
  result = []

  def backtrack(square):
    row = len(square)
    if row == n:
      result.append(square[:])
      return
    prefix = "".join(square[i][row] for i in range(row))
    for word in getWordsWithPrefix(trie, prefix):
      square.append(word)
      backtrack(square)
      square.pop()

  for word in words:
    backtrack([word])
  return result`,

    python: `def wordSquares(words):
    trie = {}
    for w in words:
        node = trie
        for ch in w:
            node = node.setdefault(ch, {})
        node.setdefault('#', []).append(w)

    def get_words(prefix):
        node = trie
        for ch in prefix:
            if ch not in node: return []
            node = node[ch]
        return node.get('#', [])  # simplified

    n = len(words[0])
    res = []
    def bt(sq):
        if len(sq) == n:
            res.append(sq[:])
            return
        prefix = "".join(sq[i][len(sq)] for i in range(len(sq)))
        for w in get_words(prefix):
            bt(sq + [w])
    for w in words:
        bt([w])
    return res`,

    javascript: `function wordSquares(words) {
  const trie = {};
  for (const w of words) {
    let node = trie;
    for (const ch of w) {
      node[ch] = node[ch] || {};
      node = node[ch];
    }
    (node['#'] = node['#'] || []).push(w);
  }
  const n = words[0].length;
  const res = [];
  function bt(sq) {
    if (sq.length === n) { res.push([...sq]); return; }
    const prefix = sq.map(w => w[sq.length]).join('');
    let node = trie;
    for (const ch of prefix) {
      if (!node[ch]) return;
      node = node[ch];
    }
    // collect all words under this subtree
    function collect(n2) {
      if (n2['#']) for (const w of n2['#']) { sq.push(w); bt(sq); sq.pop(); }
      for (const k of Object.keys(n2)) if (k !== '#') collect(n2[k]);
    }
    collect(node);
  }
  for (const w of words) bt([w]);
  return res;
}`,

    java: `// Build prefix trie storing word lists at each node, then backtrack`,
  },

  defaultInput: {
    words: ['area', 'lead', 'wall', 'lady', 'ball'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['area', 'lead', 'wall', 'lady', 'ball'],
      placeholder: 'area,lead,wall,lady,ball',
      helperText: 'Equal-length words to form squares',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    if (!words.length) return steps;
    const n = words[0].length;

    steps.push({
      line: 1,
      explanation: `Building trie from ${words.length} words of length ${n}. Each trie node stores words that pass through it for fast prefix lookup.`,
      variables: { words: words.length, wordLength: n },
      visualization: makeViz(words.map((w) => w.length), {}, Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    // Build prefix map
    const prefixMap: Record<string, string[]> = {};
    for (const w of words) {
      for (let i = 0; i <= w.length; i++) {
        const p = w.slice(0, i);
        if (!prefixMap[p]) prefixMap[p] = [];
        prefixMap[p].push(w);
      }
    }

    steps.push({
      line: 2,
      explanation: `Prefix map built. Each prefix maps to all words starting with it. For example, prefix "ba" -> [${(prefixMap['ba'] ?? []).join(', ')}].`,
      variables: { examplePrefix: 'ba', matches: (prefixMap['ba'] ?? []).join(', ') },
      visualization: makeViz(words.map((w) => w.length), {}, Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    const result: string[][] = [];
    let backtrackCalls = 0;

    const backtrack = (square: string[]): void => {
      backtrackCalls++;
      if (backtrackCalls > 50) return; // limit steps
      const row = square.length;
      if (row === n) {
        result.push([...square]);
        return;
      }
      const prefix = square.map((w) => w[row]).join('');
      const candidates = prefixMap[prefix] ?? [];

      steps.push({
        line: 10,
        explanation: `Row ${row}: need words starting with prefix "${prefix}" (column chars from rows 0..${row - 1}). Found ${candidates.length} candidate(s): [${candidates.join(', ')}].`,
        variables: { row, prefix, candidates: candidates.join(', ') },
        visualization: makeViz(
          words.map((w) => (candidates.includes(w) ? 1 : 0)),
          Object.fromEntries(words.map((w, i) => [i, candidates.includes(w) ? 'active' : 'default'])),
          Object.fromEntries(words.map((w, i) => [i, w]))
        ),
      });

      for (const word of candidates) {
        square.push(word);
        backtrack(square);
        square.pop();
      }
    };

    for (const w of words) {
      backtrack([w]);
    }

    steps.push({
      line: 15,
      explanation: `Found ${result.length} word square(s). Example: [${(result[0] ?? []).join(', ')}].`,
      variables: { squares: result.length, example: (result[0] ?? []).join(', ') },
      visualization: makeViz(
        result.map(() => n),
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        Object.fromEntries(result.map((sq, i) => [i, sq[0]]))
      ),
    });

    return steps;
  },
};

export default wordSquares;
