import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designSearchAutocompleteSystem: AlgorithmDefinition = {
  id: 'design-search-autocomplete-system',
  title: 'Design Search Autocomplete System',
  leetcodeNumber: 642,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Design a search autocomplete system that returns the top 3 most frequent historical sentences matching the current prefix typed by the user. Use a trie where each node stores a map of sentence -> frequency. As each character is typed, traverse the trie and collect all sentences under the current node, returning the top 3 by frequency (then lexicographic order). When "#" is typed, save the current input as a new sentence.',
  tags: ['trie', 'design', 'string', 'priority queue', 'hash map'],

  code: {
    pseudocode: `class AutocompleteSystem:
  trie = Trie()
  for sentence, freq in sentences:
    trie.insert(sentence, freq)
  current = ""

  input(c):
    if c == "#":
      trie.insert(current, 1)
      current = ""
      return []
    current += c
    node = trie.search(current)
    if not node: return []
    candidates = collectAll(node)
    sort by (-freq, lex)
    return top 3 sentences`,

    python: `class AutocompleteSystem:
    def __init__(self, sentences, times):
        self.freq = {}
        for s, t in zip(sentences, times):
            self.freq[s] = t
        self.curr = ""

    def input(self, c: str):
        if c == '#':
            self.freq[self.curr] = self.freq.get(self.curr, 0) + 1
            self.curr = ""
            return []
        self.curr += c
        res = [(s, f) for s, f in self.freq.items() if s.startswith(self.curr)]
        res.sort(key=lambda x: (-x[1], x[0]))
        return [s for s, _ in res[:3]]`,

    javascript: `class AutocompleteSystem {
  constructor(sentences, times) {
    this.freq = new Map();
    for (let i = 0; i < sentences.length; i++)
      this.freq.set(sentences[i], times[i]);
    this.curr = '';
  }
  input(c) {
    if (c === '#') {
      this.freq.set(this.curr, (this.freq.get(this.curr) || 0) + 1);
      this.curr = '';
      return [];
    }
    this.curr += c;
    const candidates = [...this.freq.entries()]
      .filter(([s]) => s.startsWith(this.curr))
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return candidates.slice(0, 3).map(([s]) => s);
  }
}`,

    java: `class AutocompleteSystem {
    Map<String, Integer> freq = new HashMap<>();
    StringBuilder curr = new StringBuilder();
    public AutocompleteSystem(String[] sentences, int[] times) {
        for (int i = 0; i < sentences.length; i++) freq.put(sentences[i], times[i]);
    }
    public List<String> input(char c) {
        if (c == '#') {
            freq.merge(curr.toString(), 1, Integer::sum);
            curr.setLength(0); return new ArrayList<>();
        }
        curr.append(c);
        String prefix = curr.toString();
        return freq.entrySet().stream()
            .filter(e -> e.getKey().startsWith(prefix))
            .sorted((a, b) -> !a.getValue().equals(b.getValue()) ? b.getValue() - a.getValue() : a.getKey().compareTo(b.getKey()))
            .limit(3).map(Map.Entry::getKey).collect(Collectors.toList());
    }
}`,
  },

  defaultInput: {
    sentences: ['i love you', 'island', 'iroman', 'i love leetcode'],
    times: [5, 3, 2, 2],
    inputs: ['i', ' ', 'a'],
  },

  inputFields: [
    {
      name: 'sentences',
      label: 'Historical Sentences',
      type: 'array',
      defaultValue: ['i love you', 'island', 'iroman', 'i love leetcode'],
      placeholder: 'sentence1,sentence2',
      helperText: 'Previously searched sentences',
    },
    {
      name: 'times',
      label: 'Frequencies',
      type: 'array',
      defaultValue: [5, 3, 2, 2],
      placeholder: '5,3,2,2',
      helperText: 'How many times each sentence was searched',
    },
    {
      name: 'inputs',
      label: 'Characters Typed',
      type: 'array',
      defaultValue: ['i', ' ', 'a'],
      placeholder: 'i, ,a',
      helperText: 'Characters typed one by one',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const sentences = input.sentences as string[];
    const times = input.times as number[];
    const inputs = input.inputs as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    const freq: Record<string, number> = {};
    for (let i = 0; i < sentences.length; i++) {
      freq[sentences[i]] = times[i];
    }

    steps.push({
      line: 1,
      explanation: `Initialized autocomplete system with ${sentences.length} sentences. Frequencies: ${sentences.map((s, i) => `"${s}"(${times[i]})`).join(', ')}.`,
      variables: { sentences: sentences.length },
      visualization: makeViz(times, Object.fromEntries(times.map((_, i) => [i, 'active'])), Object.fromEntries(sentences.map((s, i) => [i, s.slice(0, 8)]))),
    });

    let curr = '';
    for (let ci = 0; ci < inputs.length; ci++) {
      const c = inputs[ci];
      curr += c;

      steps.push({
        line: 8,
        explanation: `Typed character "${c}". Current prefix: "${curr}". Searching for all sentences starting with "${curr}".`,
        variables: { char: c, currentPrefix: curr },
        visualization: makeViz(times, { [ci]: 'active' }, Object.fromEntries(sentences.map((s, i) => [i, s]))),
      });

      const candidates = Object.entries(freq)
        .filter(([s]) => s.startsWith(curr))
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 3)
        .map(([s, f]) => ({ s, f }));

      steps.push({
        line: 12,
        explanation: `Top ${candidates.length} autocomplete suggestion(s) for prefix "${curr}": ${candidates.map(({ s, f }) => `"${s}"(${f})`).join(', ')}.`,
        variables: { prefix: curr, suggestions: candidates.map(({ s }) => s).join(', ') },
        visualization: makeViz(
          sentences.map((s) => freq[s] ?? 0),
          Object.fromEntries(sentences.map((s, i) => [i, candidates.some(({ s: cs }) => cs === s) ? 'found' : 'default'])),
          Object.fromEntries(sentences.map((s, i) => [i, s.slice(0, 8)]))
        ),
      });
    }

    steps.push({
      line: 15,
      explanation: 'Autocomplete simulation complete. The system returns top 3 results by frequency (then lexicographic order) for each prefix typed.',
      variables: { finalPrefix: curr },
      visualization: makeViz(times, Object.fromEntries(times.map((_, i) => [i, 'default'])), Object.fromEntries(sentences.map((s, i) => [i, s.slice(0, 8)]))),
    });

    return steps;
  },
};

export default designSearchAutocompleteSystem;
