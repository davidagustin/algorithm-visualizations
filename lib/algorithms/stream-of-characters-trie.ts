import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const streamOfCharactersTrie: AlgorithmDefinition = {
  id: 'stream-of-characters-trie',
  title: 'Stream of Characters (Trie)',
  leetcodeNumber: 1032,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Design an algorithm that accepts a stream of characters and checks if a suffix of these characters forms a word from a given dictionary. Build a trie of REVERSED words. Maintain a set of active trie nodes. For each new character, advance all active nodes forward in the reversed trie, and also start a new search from the root. If any active node reaches a word end, return true.',
  tags: ['trie', 'design', 'string', 'streaming'],

  code: {
    pseudocode: `class StreamChecker:
  insert reversed words into trie
  active = []

  query(letter):
    active.append(root)
    next_active = []
    for node in active:
      if letter in node.children:
        child = node.children[letter]
        if child.isEnd: return True
        next_active.append(child)
    active = next_active
    return False`,

    python: `class StreamChecker:
    def __init__(self, words):
        self.trie = {}
        for w in words:
            node = self.trie
            for ch in reversed(w):
                node = node.setdefault(ch, {})
            node['#'] = True
        self.active = []

    def query(self, letter: str) -> bool:
        self.active.append(self.trie)
        nxt = []
        found = False
        for node in self.active:
            if letter in node:
                child = node[letter]
                if '#' in child: found = True
                else: nxt.append(child)
        self.active = nxt
        return found`,

    javascript: `class StreamChecker {
  constructor(words) {
    this.trie = {};
    for (const w of words) {
      let node = this.trie;
      for (let i = w.length - 1; i >= 0; i--) {
        node[w[i]] = node[w[i]] || {};
        node = node[w[i]];
      }
      node['#'] = true;
    }
    this.active = [];
  }
  query(letter) {
    this.active.push(this.trie);
    const nxt = [];
    let found = false;
    for (const node of this.active) {
      if (node[letter]) {
        const child = node[letter];
        if (child['#']) found = true;
        else nxt.push(child);
      }
    }
    this.active = nxt;
    return found;
  }
}`,

    java: `// Build reversed trie, maintain active node set per query`,
  },

  defaultInput: {
    words: ['cd', 'f', 'kl'],
    stream: ['a', 'b', 'c', 'd', 'e', 'f'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Dictionary Words',
      type: 'array',
      defaultValue: ['cd', 'f', 'kl'],
      placeholder: 'cd,f,kl',
      helperText: 'Words to watch for in the stream',
    },
    {
      name: 'stream',
      label: 'Character Stream',
      type: 'array',
      defaultValue: ['a', 'b', 'c', 'd', 'e', 'f'],
      placeholder: 'a,b,c,d,e,f',
      helperText: 'Characters arriving in the stream',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const stream = input.stream as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    // Build reversed trie
    const trie: Record<string, unknown> = {};
    for (const w of words) {
      let node = trie as Record<string, unknown>;
      for (let i = w.length - 1; i >= 0; i--) {
        const ch = w[i];
        if (!node[ch]) node[ch] = {};
        node = node[ch] as Record<string, unknown>;
      }
      node['#'] = true;
    }

    steps.push({
      line: 1,
      explanation: `Built reversed trie from words: [${words.join(', ')}]. Words are inserted in reverse so we can match suffixes of the stream by traversing forward from root with each new character.`,
      variables: { words: words.join(', '), reversedWords: words.map((w) => w.split('').reverse().join('')).join(', ') },
      visualization: makeViz(words.map((w) => w.length), Object.fromEntries(words.map((_, i) => [i, 'active'])), Object.fromEntries(words.map((w, i) => [i, w.split('').reverse().join('')]))),
    });

    const results: boolean[] = [];
    let active: Record<string, unknown>[] = [];

    for (let si = 0; si < stream.length; si++) {
      const letter = stream[si];
      active.push(trie);

      const nxt: Record<string, unknown>[] = [];
      let found = false;

      for (const node of active) {
        const nodeTyped = node as Record<string, unknown>;
        if (nodeTyped[letter]) {
          const child = nodeTyped[letter] as Record<string, unknown>;
          if (child['#']) {
            found = true;
          } else {
            nxt.push(child);
          }
        }
      }
      active = nxt;
      results.push(found);

      steps.push({
        line: 9,
        explanation: `Stream char "${letter}" (position ${si}): ${found ? `A suffix of the stream matches a dictionary word! Return true.` : `No complete word match yet. Active nodes: ${active.length}.`}`,
        variables: { letter, position: si, found, activeNodes: active.length },
        visualization: makeViz(
          stream.map(() => 1),
          Object.fromEntries(stream.map((_, i) => [i, i === si ? (found ? 'found' : 'active') : i < si ? 'default' : 'default'])),
          Object.fromEntries(stream.map((c, i) => [i, i < results.length ? (results[i] ? 'T' : 'F') : c]))
        ),
      });
    }

    steps.push({
      line: 12,
      explanation: `Stream processing complete. Results for each character: [${stream.map((c, i) => `"${c}"=${results[i]}`).join(', ')}].`,
      variables: { results: results.join(', ') },
      visualization: makeViz(stream.map(() => 1), Object.fromEntries(results.map((r, i) => [i, r ? 'found' : 'default'])), Object.fromEntries(stream.map((c, i) => [i, c]))),
    });

    return steps;
  },
};

export default streamOfCharactersTrie;
