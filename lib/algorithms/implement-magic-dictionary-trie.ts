import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const implementMagicDictionaryTrie: AlgorithmDefinition = {
  id: 'implement-magic-dictionary-trie',
  title: 'Implement Magic Dictionary (Trie)',
  leetcodeNumber: 676,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Design a data structure that is initialized with a list of words and supports searching for a word with exactly one character changed. Build a trie from the dictionary words, then use DFS search: at each trie node, try matching the corresponding character (exact) or use the one allowed substitution (if not yet used). Return true if a complete word is found after exactly one substitution.',
  tags: ['trie', 'design', 'string', 'dfs', 'backtracking'],

  code: {
    pseudocode: `class MagicDictionary:
  trie = Trie()
  buildDict(dictionary):
    for word in dictionary:
      trie.insert(word)

  search(searchWord):
    def dfs(node, index, changed):
      if index == len(searchWord):
        return changed and node.isEnd
      ch = searchWord[index]
      for c in node.children:
        if c == ch:
          if dfs(node.children[c], index+1, changed): return True
        elif not changed:
          if dfs(node.children[c], index+1, True): return True
      return False
    return dfs(root, 0, False)`,

    python: `class MagicDictionary:
    def __init__(self):
        self.trie = {}

    def buildDict(self, dictionary):
        for word in dictionary:
            node = self.trie
            for ch in word:
                node = node.setdefault(ch, {})
            node['#'] = True

    def search(self, searchWord):
        def dfs(node, i, changed):
            if i == len(searchWord):
                return changed and '#' in node
            ch = searchWord[i]
            for c, child in node.items():
                if c == '#': continue
                if c == ch:
                    if dfs(child, i + 1, changed): return True
                elif not changed:
                    if dfs(child, i + 1, True): return True
            return False
        return dfs(self.trie, 0, False)`,

    javascript: `class MagicDictionary {
  constructor() { this.trie = {}; }
  buildDict(dictionary) {
    for (const w of dictionary) {
      let node = this.trie;
      for (const ch of w) { node[ch] = node[ch] || {}; node = node[ch]; }
      node['#'] = true;
    }
  }
  search(searchWord) {
    const dfs = (node, i, changed) => {
      if (i === searchWord.length) return changed && '#' in node;
      const ch = searchWord[i];
      for (const c of Object.keys(node)) {
        if (c === '#') continue;
        if (c === ch && dfs(node[c], i + 1, changed)) return true;
        if (c !== ch && !changed && dfs(node[c], i + 1, true)) return true;
      }
      return false;
    };
    return dfs(this.trie, 0, false);
  }
}`,

    java: `class MagicDictionary {
    private Map<String,Integer> map = new HashMap<>();
    public void buildDict(String[] dictionary) {
        for (String w : dictionary) map.put(w, 1);
    }
    public boolean search(String searchWord) {
        for (String w : map.keySet()) {
            if (w.length() != searchWord.length()) continue;
            int diff = 0;
            for (int i = 0; i < w.length(); i++) if (w.charAt(i) != searchWord.charAt(i)) diff++;
            if (diff == 1) return true;
        }
        return false;
    }
}`,
  },

  defaultInput: {
    dictionary: ['hello', 'leetcode'],
    searchWords: ['hello', 'hhllo', 'hell', 'leetcoded'],
  },

  inputFields: [
    {
      name: 'dictionary',
      label: 'Dictionary',
      type: 'array',
      defaultValue: ['hello', 'leetcode'],
      placeholder: 'hello,leetcode',
      helperText: 'Words to build the magic dictionary',
    },
    {
      name: 'searchWords',
      label: 'Search Words',
      type: 'array',
      defaultValue: ['hello', 'hhllo', 'hell', 'leetcoded'],
      placeholder: 'hello,hhllo,hell',
      helperText: 'Words to search for with one char change allowed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const dictionary = input.dictionary as string[];
    const searchWords = input.searchWords as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Building trie from dictionary: [${dictionary.join(', ')}]. Each word is inserted character by character.`,
      variables: { dictionary: dictionary.join(', ') },
      visualization: makeViz(dictionary.map((w) => w.length), Object.fromEntries(dictionary.map((_, i) => [i, 'active'])), Object.fromEntries(dictionary.map((w, i) => [i, w]))),
    });

    for (let di = 0; di < dictionary.length; di++) {
      steps.push({
        line: 3,
        explanation: `Inserted "${dictionary[di]}" into trie. Marked end node.`,
        variables: { word: dictionary[di] },
        visualization: makeViz(dictionary.map((w) => w.length), { [di]: 'found' }, Object.fromEntries(dictionary.map((w, i) => [i, w]))),
      });
    }

    const results: boolean[] = searchWords.map((sw) => {
      if (sw.length === 0) return false;
      for (const dw of dictionary) {
        if (dw.length !== sw.length) continue;
        let diffs = 0;
        for (let i = 0; i < dw.length; i++) {
          if (dw[i] !== sw[i]) diffs++;
        }
        if (diffs === 1) return true;
      }
      return false;
    });

    for (let si = 0; si < searchWords.length; si++) {
      const sw = searchWords[si];
      const result = results[si];

      // Find which dict word matches (if any)
      let matchWord = '';
      let diffPos = -1;
      for (const dw of dictionary) {
        if (dw.length !== sw.length) continue;
        let diffs = 0;
        let pos = -1;
        for (let i = 0; i < dw.length; i++) {
          if (dw[i] !== sw[i]) { diffs++; pos = i; }
        }
        if (diffs === 1) { matchWord = dw; diffPos = pos; break; }
      }

      steps.push({
        line: 8,
        explanation: `search("${sw}"): DFS through trie with exactly one substitution allowed. ${result ? `Matches "${matchWord}" with 1 change at position ${diffPos} ("${matchWord[diffPos]}" -> "${sw[diffPos]}"). Return true.` : 'No word in dictionary differs by exactly 1 character. Return false.'}`,
        variables: { searchWord: sw, result, matchWord: matchWord || 'none' },
        visualization: makeViz(
          searchWords.map((w) => w.length),
          { [si]: result ? 'found' : 'mismatch' },
          Object.fromEntries(searchWords.map((w, i) => [i, i === si ? (result ? 'true' : 'false') : w]))
        ),
      });
    }

    steps.push({
      line: 16,
      explanation: `All searches complete. Results: [${results.map((r, i) => `"${searchWords[i]}"=${r}`).join(', ')}].`,
      variables: { results: results.join(', ') },
      visualization: makeViz(searchWords.map((w) => w.length), Object.fromEntries(results.map((r, i) => [i, r ? 'found' : 'mismatch'])), Object.fromEntries(searchWords.map((w, i) => [i, w]))),
    });

    return steps;
  },
};

export default implementMagicDictionaryTrie;
