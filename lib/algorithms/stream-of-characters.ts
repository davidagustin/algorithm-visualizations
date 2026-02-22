import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const streamOfCharacters: AlgorithmDefinition = {
  id: 'stream-of-characters',
  title: 'Stream of Characters',
  leetcodeNumber: 1032,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Given a list of words and a stream of characters, for each character in the stream determine if any suffix of the stream so far matches any word in the list. Insert all words reversed into a trie. As each character arrives, maintain a list of active trie nodes and advance them. A match occurs if any active node marks a word end.',
  tags: ['trie', 'reverse trie', 'stream', 'suffix matching'],

  code: {
    pseudocode: `class StreamChecker:
  build reverse-trie from words
  active = []
  function query(letter):
    active.append(root)
    next_active = []
    for node in active:
      if letter in node.children:
        next_node = node.children[letter]
        next_active.append(next_node)
        if next_node.isEnd: return true
    active = next_active
    return false`,

    python: `class StreamChecker:
    def __init__(self, words):
        self.root = {}
        for word in words:
            node = self.root
            for ch in reversed(word):
                node = node.setdefault(ch, {})
            node['#'] = True
        self.active = []

    def query(self, letter: str) -> bool:
        self.active = [self.root] + self.active
        next_active = []
        found = False
        for node in self.active:
            if letter in node:
                nxt = node[letter]
                next_active.append(nxt)
                if '#' in nxt:
                    found = True
        self.active = next_active
        return found`,

    javascript: `class StreamChecker {
  constructor(words) {
    this.root = {};
    for (const word of words) {
      let node = this.root;
      for (let i = word.length-1; i >= 0; i--) {
        if (!node[word[i]]) node[word[i]] = {};
        node = node[word[i]];
      }
      node['#'] = true;
    }
    this.active = [];
  }
  query(letter) {
    this.active.unshift(this.root);
    const next = [];
    let found = false;
    for (const node of this.active) {
      if (node[letter]) {
        next.push(node[letter]);
        if (node[letter]['#']) found = true;
      }
    }
    this.active = next;
    return found;
  }
}`,

    java: `class StreamChecker {
    Map<Character, Object> root = new HashMap<>();
    List<Map> active = new ArrayList<>();
    public StreamChecker(String[] words) {
        for (String word : words) {
            Map node = root;
            for (int i = word.length()-1; i >= 0; i--)
                node = (Map)node.computeIfAbsent(word.charAt(i), k -> new HashMap<>());
            node.put('#', true);
        }
    }
    public boolean query(char letter) {
        active.add(0, root);
        List<Map> next = new ArrayList<>();
        boolean found = false;
        for (Map node : active) {
            if (node.containsKey(letter)) {
                Map nxt = (Map)node.get(letter);
                next.add(nxt);
                if (nxt.containsKey('#')) found = true;
            }
        }
        active = next;
        return found;
    }
}`,
  },

  defaultInput: {
    words: ['cd', 'f', 'kl'],
    stream: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words (JSON)',
      type: 'string',
      defaultValue: '["cd","f","kl"]',
      placeholder: '["cd","f","kl"]',
      helperText: 'JSON array of words to match',
    },
    {
      name: 'stream',
      label: 'Character Stream (JSON)',
      type: 'string',
      defaultValue: '["a","b","c","d","e","f","g","h","i","j","k","l"]',
      placeholder: '["a","b","c","d"]',
      helperText: 'JSON array of characters arriving one by one',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = (typeof input.words === 'string'
      ? JSON.parse(input.words)
      : input.words) as string[];
    const stream = (typeof input.stream === 'string'
      ? JSON.parse(input.stream)
      : input.stream) as string[];
    const steps: AlgorithmStep[] = [];

    // Build reverse trie
    const root: Record<string, unknown> = {};
    for (const word of words) {
      let node = root;
      for (let i = word.length - 1; i >= 0; i--) {
        const ch = word[i];
        if (!node[ch]) node[ch] = {};
        node = node[ch] as Record<string, unknown>;
      }
      node['#'] = true;
    }

    steps.push({
      line: 1,
      explanation: `Build reverse trie from words [${words.map(w => `"${w}"`).join(', ')}]. Words are inserted reversed to allow suffix matching.`,
      variables: { words: words.join(', ') },
      visualization: {
        type: 'array',
        array: words.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(words.map((w, i) => [i, `"${w}" => reversed="${w.split('').reverse().join('')}"`])),
      },
    });

    let active: Record<string, unknown>[] = [];
    const history: string[] = [];

    for (let si = 0; si < stream.length; si++) {
      const letter = stream[si];
      history.push(letter);
      active.unshift(root);
      const next: Record<string, unknown>[] = [];
      let found = false;

      steps.push({
        line: 5,
        explanation: `Query('${letter}'). Stream so far: "${history.join('')}". Active nodes: ${active.length}. Add root to active list.`,
        variables: { letter, stream: history.join(''), activeCount: active.length },
        visualization: {
          type: 'array',
          array: stream.map((_, i) => i),
          highlights: { [si]: 'active' },
          labels: Object.fromEntries(stream.map((c, i) => [i, i < si ? 'seen' : i === si ? `'${c}'` : c])),
        },
      });

      for (const node of active) {
        if (node[letter]) {
          const nxt = node[letter] as Record<string, unknown>;
          next.push(nxt);
          if (nxt['#']) found = true;
        }
      }
      active = next;

      steps.push({
        line: 9,
        explanation: `After advancing active nodes with '${letter}': ${active.length} still active. Match found: ${found}.`,
        variables: { letter, activeCount: active.length, found },
        visualization: {
          type: 'array',
          array: stream.map((_, i) => i),
          highlights: { [si]: found ? 'found' : 'visited' },
          labels: Object.fromEntries(stream.map((c, i) => [i,
            i < si ? c :
            i === si ? (found ? `'${c}' MATCH` : `'${c}'`) :
            c
          ])),
        },
      });
    }

    return steps;
  },
};

export default streamOfCharacters;
