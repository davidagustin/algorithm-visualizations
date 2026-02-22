import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const implementMagicDictionary: AlgorithmDefinition = {
  id: 'implement-magic-dictionary',
  title: 'Implement Magic Dictionary',
  leetcodeNumber: 676,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Design a data structure with buildDict and search operations. search(word) returns true if there is any string in the dictionary that differs from word by exactly one character. Build a trie from the dictionary, then DFS the trie while tracking how many characters differ. Allow exactly one mismatch.',
  tags: ['Trie', 'String', 'Design'],
  code: {
    pseudocode: `class MagicDictionary:
  buildDict(dictionary):
    insert all words into trie

  search(searchWord):
    DFS trie with (node, index, mismatches):
      if index == len(word) and mismatches == 1:
        return node.isEnd
      for each child ch in node:
        diff = (ch != word[index]) ? 1 : 0
        if mismatches + diff <= 1:
          recurse(child, index+1, mismatches+diff)
      return false`,
    python: `class MagicDictionary:
    def buildDict(self, dictionary):
        self.trie = {}
        for word in dictionary:
            node = self.trie
            for ch in word:
                node = node.setdefault(ch, {})
            node['#'] = True

    def search(self, searchWord):
        def dfs(node, i, diff):
            if i == len(searchWord):
                return diff == 1 and '#' in node
            for ch, child in node.items():
                if ch == '#': continue
                d = diff + (0 if ch == searchWord[i] else 1)
                if d <= 1 and dfs(child, i + 1, d):
                    return True
            return False
        return dfs(self.trie, 0, 0)`,
    javascript: `class MagicDictionary {
  buildDict(dictionary) {
    this.trie = {};
    for (const word of dictionary) {
      let node = this.trie;
      for (const ch of word) {
        if (!node[ch]) node[ch] = {};
        node = node[ch];
      }
      node['#'] = true;
    }
  }
  search(searchWord) {
    const dfs = (node, i, diff) => {
      if (i === searchWord.length) return diff === 1 && node['#'];
      for (const [ch, child] of Object.entries(node)) {
        if (ch === '#') continue;
        const d = diff + (ch !== searchWord[i] ? 1 : 0);
        if (d <= 1 && dfs(child, i + 1, d)) return true;
      }
      return false;
    };
    return dfs(this.trie, 0, 0);
  }
}`,
    java: `class MagicDictionary {
    private Map<String,Object> trie = new HashMap<>();
    public void buildDict(String[] dictionary) {
        for (String word : dictionary) {
            Map<String,Object> node = trie;
            for (char ch : word.toCharArray())
                node = (Map<String,Object>) node.computeIfAbsent(String.valueOf(ch), k -> new HashMap<>());
            node.put("#", true);
        }
    }
    public boolean search(String word) {
        return dfs(trie, word, 0, 0);
    }
    private boolean dfs(Map<String,Object> node, String word, int i, int diff) {
        if (i == word.length()) return diff == 1 && node.containsKey("#");
        for (Map.Entry<String,Object> e : node.entrySet()) {
            if (e.getKey().equals("#")) continue;
            int d = diff + (e.getKey().charAt(0) != word.charAt(i) ? 1 : 0);
            if (d <= 1 && dfs((Map<String,Object>)e.getValue(), word, i+1, d)) return true;
        }
        return false;
    }
}`,
  },
  defaultInput: {
    dictionary: ['hello', 'leetcode'],
    searchWord: 'hhllo',
  },
  inputFields: [
    {
      name: 'dictionary',
      label: 'Dictionary',
      type: 'array',
      defaultValue: ['hello', 'leetcode'],
      placeholder: '["hello","leetcode"]',
      helperText: 'Words to build the magic dictionary from',
    },
    {
      name: 'searchWord',
      label: 'Search Word',
      type: 'string',
      defaultValue: 'hhllo',
      placeholder: 'hhllo',
      helperText: 'Word to search (exactly 1 char difference allowed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const dictionary = input.dictionary as string[];
    const searchWord = input.searchWord as string;
    const steps: AlgorithmStep[] = [];

    interface TrieNode { children: Record<string, TrieNode>; isEnd: boolean; }
    const root: TrieNode = { children: {}, isEnd: false };

    function insert(word: string) {
      let node = root;
      for (const ch of word) {
        if (!node.children[ch]) node.children[ch] = { children: {}, isEnd: false };
        node = node.children[ch];
      }
      node.isEnd = true;
    }

    function trieEntries(): { key: string; value: string }[] {
      const entries: { key: string; value: string }[] = [];
      function traverse(node: TrieNode, prefix: string) {
        const kids = Object.keys(node.children).sort();
        entries.push({ key: prefix || 'root', value: `[${kids.join(',')}]${node.isEnd ? ' END' : ''}` });
        for (const ch of kids) traverse(node.children[ch], prefix + ch);
      }
      traverse(root, '');
      return entries;
    }

    steps.push({
      line: 2,
      explanation: `Build magic dictionary from: [${dictionary.join(', ')}]. Then search for "${searchWord}" allowing exactly 1 character change.`,
      variables: { dictionary, searchWord },
      visualization: {
        type: 'array',
        array: dictionary.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(dictionary.map((w, i) => [i, w])),
        auxData: { label: 'Building Trie', entries: [{ key: 'root', value: 'empty' }] },
      },
    });

    for (const word of dictionary) {
      insert(word);
      steps.push({
        line: 3,
        explanation: `Inserted "${word}" into trie.`,
        variables: { inserted: word },
        visualization: {
          type: 'array',
          array: word.split('').map((_, i) => i),
          highlights: Object.fromEntries(word.split('').map((_, i) => [i, 'found'])),
          labels: Object.fromEntries(word.split('').map((ch, i) => [i, ch])),
          auxData: { label: 'Trie state', entries: trieEntries() },
        },
      });
    }

    // DFS search simulation
    steps.push({
      line: 6,
      explanation: `Trie built. Now DFS search for "${searchWord}" allowing exactly 1 mismatch. Explore all trie paths tracking mismatch count.`,
      variables: { searchWord },
      visualization: {
        type: 'array',
        array: searchWord.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(searchWord.split('').map((ch, i) => [i, ch])),
        auxData: { label: 'Search', entries: [
          { key: 'searchWord', value: searchWord },
          { key: 'mismatches allowed', value: 'exactly 1' },
          ...trieEntries(),
        ]},
      },
    });

    let searchResult = false;

    function dfs(node: TrieNode, i: number, diff: number, path: string): boolean {
      if (i === searchWord.length) {
        const match = diff === 1 && node.isEnd;
        if (match) {
          const charHl: Record<number, string> = {};
          for (let j = 0; j < searchWord.length; j++) {
            charHl[j] = searchWord[j] !== path[j] ? 'swapping' : 'found';
          }
          steps.push({
            line: 8,
            explanation: `Reached end of word "${searchWord}" with path "${path}". Mismatches=${diff}, isEnd=${node.isEnd}. MATCH (diff==1 and isEnd)!`,
            variables: { path, diff, isEnd: node.isEnd, match: true },
            visualization: {
              type: 'array',
              array: searchWord.split('').map((_, idx) => idx),
              highlights: charHl,
              labels: Object.fromEntries(searchWord.split('').map((ch, idx) => [idx, `${ch}↔${path[idx] ?? '?'}`])),
              auxData: { label: 'DFS Path Found!', entries: [
                { key: 'searchWord', value: searchWord },
                { key: 'dict word', value: path },
                { key: 'mismatches', value: String(diff) },
                { key: 'result', value: 'true' },
              ]},
            },
          });
        }
        return match;
      }

      const kids = Object.keys(node.children).sort();
      for (const ch of kids) {
        const d = diff + (ch !== searchWord[i] ? 1 : 0);
        if (d <= 1) {
          const hl: Record<number, string> = {};
          for (let j = 0; j < i; j++) hl[j] = searchWord[j] !== path[j] ? 'swapping' : 'found';
          hl[i] = ch !== searchWord[i] ? 'comparing' : 'active';

          steps.push({
            line: 10,
            explanation: `DFS at depth ${i}: trie char '${ch}' vs search '${searchWord[i]}'. ${ch !== searchWord[i] ? 'MISMATCH' : 'MATCH'}. diff=${d}. Path so far: "${path + ch}".`,
            variables: { depth: i, trieChar: ch, searchChar: searchWord[i], diff: d, path: path + ch },
            visualization: {
              type: 'array',
              array: searchWord.split('').map((_, idx) => idx),
              highlights: hl,
              labels: Object.fromEntries(searchWord.split('').map((c, idx) => [idx, idx < i ? `${c}↔${path[idx]}` : idx === i ? `${c}↔${ch}` : c])),
              auxData: { label: 'DFS Exploring', entries: [
                { key: 'depth', value: String(i) },
                { key: 'path', value: path + ch },
                { key: 'mismatches', value: String(d) },
              ]},
            },
          });

          if (dfs(node.children[ch], i + 1, d, path + ch)) return true;
        }
      }
      return false;
    }

    searchResult = dfs(root, 0, 0, '');

    if (!searchResult) {
      const missHl: Record<number, string> = {};
      for (let j = 0; j < searchWord.length; j++) missHl[j] = 'mismatch';
      steps.push({
        line: 12,
        explanation: `No path found with exactly 1 mismatch. "${searchWord}" is NOT in the magic dictionary. Return false.`,
        variables: { result: false },
        visualization: {
          type: 'array',
          array: searchWord.split('').map((_, i) => i),
          highlights: missHl,
          labels: Object.fromEntries(searchWord.split('').map((ch, i) => [i, ch])),
          auxData: { label: 'Result', entries: [{ key: 'search result', value: 'false' }] },
        },
      });
    } else {
      steps.push({
        line: 8,
        explanation: `Done! search("${searchWord}") = ${searchResult}. Found a word in dictionary differing by exactly 1 character.`,
        variables: { result: searchResult },
        visualization: {
          type: 'array',
          array: searchWord.split('').map((_, i) => i),
          highlights: Object.fromEntries(searchWord.split('').map((_, i) => [i, 'found'])),
          labels: Object.fromEntries(searchWord.split('').map((ch, i) => [i, ch])),
          auxData: { label: 'Result', entries: [{ key: 'search result', value: String(searchResult) }] },
        },
      });
    }

    return steps;
  },
};

export default implementMagicDictionary;
