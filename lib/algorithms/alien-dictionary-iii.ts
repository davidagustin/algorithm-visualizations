import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const alienDictionaryIii: AlgorithmDefinition = {
  id: 'alien-dictionary-iii',
  title: 'Alien Dictionary',
  leetcodeNumber: 269,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a sorted list of words from an alien language, derive the order of characters in that language. Build a graph of character ordering constraints from adjacent words, then perform topological sort (Kahn\'s BFS) to produce the character ordering. If a cycle exists, return empty string.',
  tags: ['Graph', 'Topological Sort', 'BFS', 'String'],
  code: {
    pseudocode: `function alienOrder(words):
  chars = all unique characters
  inDegree = {c: 0 for c in chars}
  adj = adjacency list
  for i in 0..len(words)-2:
    w1, w2 = words[i], words[i+1]
    minLen = min(len(w1), len(w2))
    for j in 0..minLen-1:
      if w1[j] != w2[j]:
        adj[w1[j]].add(w2[j])
        inDegree[w2[j]] += 1
        break
    if len(w1)>len(w2) and w1 starts with w2: return ""
  queue = chars with inDegree 0
  result = BFS topological sort
  return result if len == len(chars) else ""`,
    python: `def alienOrder(words):
    adj = {c: set() for w in words for c in w}
    inDegree = {c: 0 for c in adj}
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i+1]
        minLen = min(len(w1), len(w2))
        if len(w1) > len(w2) and w1[:minLen] == w2[:minLen]:
            return ""
        for j in range(minLen):
            if w1[j] != w2[j]:
                if w2[j] not in adj[w1[j]]:
                    adj[w1[j]].add(w2[j])
                    inDegree[w2[j]] += 1
                break
    q = deque(c for c in inDegree if inDegree[c] == 0)
    res = []
    while q:
        c = q.popleft()
        res.append(c)
        for nb in adj[c]:
            inDegree[nb] -= 1
            if inDegree[nb] == 0: q.append(nb)
    return "".join(res) if len(res) == len(inDegree) else ""`,
    javascript: `function alienOrder(words) {
  const adj = new Map();
  const inDegree = new Map();
  for (const w of words) for (const c of w) {
    if (!adj.has(c)) { adj.set(c, new Set()); inDegree.set(c, 0); }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const [w1, w2] = [words[i], words[i+1]];
    const minLen = Math.min(w1.length, w2.length);
    if (w1.length > w2.length && w1.startsWith(w2)) return "";
    for (let j = 0; j < minLen; j++) {
      if (w1[j] !== w2[j]) {
        if (!adj.get(w1[j]).has(w2[j])) {
          adj.get(w1[j]).add(w2[j]);
          inDegree.set(w2[j], inDegree.get(w2[j]) + 1);
        }
        break;
      }
    }
  }
  const queue = [...inDegree.entries()].filter(([,d])=>d===0).map(([c])=>c);
  const res = [];
  while (queue.length) {
    const c = queue.shift();
    res.push(c);
    for (const nb of adj.get(c)) {
      inDegree.set(nb, inDegree.get(nb) - 1);
      if (inDegree.get(nb) === 0) queue.push(nb);
    }
  }
  return res.length === inDegree.size ? res.join('') : "";
}`,
    java: `public String alienOrder(String[] words) {
    Map<Character,Set<Character>> adj = new HashMap<>();
    Map<Character,Integer> inDegree = new HashMap<>();
    for (String w : words) for (char c : w.toCharArray()) {
        adj.putIfAbsent(c, new HashSet<>());
        inDegree.putIfAbsent(c, 0);
    }
    for (int i = 0; i < words.length - 1; i++) {
        String w1 = words[i], w2 = words[i+1];
        int minLen = Math.min(w1.length(), w2.length());
        if (w1.length() > w2.length() && w1.startsWith(w2)) return "";
        for (int j = 0; j < minLen; j++) {
            if (w1.charAt(j) != w2.charAt(j)) {
                if (adj.get(w1.charAt(j)).add(w2.charAt(j)))
                    inDegree.merge(w2.charAt(j), 1, Integer::sum);
                break;
            }
        }
    }
    Queue<Character> q = new LinkedList<>();
    for (var e : inDegree.entrySet()) if (e.getValue() == 0) q.add(e.getKey());
    StringBuilder sb = new StringBuilder();
    while (!q.isEmpty()) {
        char c = q.poll(); sb.append(c);
        for (char nb : adj.get(c)) {
            inDegree.merge(nb, -1, Integer::sum);
            if (inDegree.get(nb) == 0) q.add(nb);
        }
    }
    return sb.length() == inDegree.size() ? sb.toString() : "";
}`,
  },
  defaultInput: {
    words: ['wrt', 'wrf', 'er', 'ett', 'rftt'],
  },
  inputFields: [
    {
      name: 'words',
      label: 'Words (alien language sorted)',
      type: 'array',
      defaultValue: ['wrt', 'wrf', 'er', 'ett', 'rftt'],
      placeholder: '["wrt","wrf","er","ett","rftt"]',
      helperText: 'List of words sorted in alien language order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const steps: AlgorithmStep[] = [];

    // Collect all unique chars
    const charSet = new Set<string>();
    for (const w of words) for (const c of w) charSet.add(c);
    const chars = [...charSet].sort();
    const charIndex = new Map<string, number>();
    chars.forEach((c, i) => charIndex.set(c, i));

    const inDegree = new Map<string, number>();
    const adj = new Map<string, Set<string>>();
    for (const c of chars) { inDegree.set(c, 0); adj.set(c, new Set()); }

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      result: string[],
      queue: string[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: chars.map(c => inDegree.get(c) ?? 0),
        highlights,
        labels,
        auxData: {
          label: 'Alien Dictionary',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.join(', ') : 'empty' },
            { key: 'Order', value: result.length > 0 ? result.join('') : 'empty' },
            { key: 'Chars', value: chars.join(', ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Extract ${chars.length} unique chars: [${chars.join(', ')}]. Build constraints from adjacent word pairs.`,
      variables: { chars: chars.join(''), wordCount: words.length },
      visualization: makeViz(
        {},
        Object.fromEntries(chars.map((c, i) => [i, `${c}:0`])),
        [],
        []
      ),
    });

    let invalid = false;
    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i], w2 = words[i + 1];
      const minLen = Math.min(w1.length, w2.length);
      if (w1.length > w2.length && w1.startsWith(w2)) {
        invalid = true;
        steps.push({
          line: 11,
          explanation: `Invalid: "${w1}" is longer than "${w2}" and is a prefix. Return empty string.`,
          variables: { w1, w2 },
          visualization: makeViz(
            Object.fromEntries(chars.map((_, i) => [i, 'mismatch'])),
            Object.fromEntries(chars.map((c, i) => [i, `${c}:${inDegree.get(c)}`])),
            [],
            []
          ),
        });
        break;
      }
      for (let j = 0; j < minLen; j++) {
        if (w1[j] !== w2[j]) {
          const from = w1[j], to = w2[j];
          if (!adj.get(from)!.has(to)) {
            adj.get(from)!.add(to);
            inDegree.set(to, (inDegree.get(to) ?? 0) + 1);
          }
          const fi = charIndex.get(from)!;
          const ti = charIndex.get(to)!;
          steps.push({
            line: 9,
            explanation: `Compare "${w1}" vs "${w2}": first diff at pos ${j}: '${from}'<'${to}'. Add edge ${from}->${to}. In-degree[${to}]=${inDegree.get(to)}.`,
            variables: { from, to, inDegree: Object.fromEntries(inDegree) },
            visualization: makeViz(
              { [fi]: 'active', [ti]: 'comparing' },
              Object.fromEntries(chars.map((c, i) => [i, `${c}:${inDegree.get(c)}`])),
              [],
              []
            ),
          });
          break;
        }
      }
    }

    if (!invalid) {
      const queue: string[] = chars.filter(c => inDegree.get(c) === 0);
      const qHighlights: Record<number, string> = {};
      for (const c of queue) qHighlights[charIndex.get(c)!] = 'active';

      steps.push({
        line: 12,
        explanation: `BFS start. Chars with in-degree 0: [${queue.join(', ')}].`,
        variables: { queue: [...queue] },
        visualization: makeViz(
          qHighlights,
          Object.fromEntries(chars.map((c, i) => [i, `${c}:${inDegree.get(c)}`])),
          [],
          [...queue]
        ),
      });

      const result: string[] = [];
      while (queue.length > 0) {
        const c = queue.shift()!;
        result.push(c);
        const ci = charIndex.get(c)!;

        steps.push({
          line: 13,
          explanation: `Dequeue '${c}'. Add to result="${result.join('')}". Process neighbors: [${[...adj.get(c)!].join(', ')}].`,
          variables: { c, result: result.join('') },
          visualization: makeViz(
            { [ci]: 'found' },
            Object.fromEntries(chars.map((ch, i) => [i, `${ch}:${inDegree.get(ch)}`])),
            [...result],
            [...queue]
          ),
        });

        for (const nb of adj.get(c)!) {
          inDegree.set(nb, (inDegree.get(nb) ?? 0) - 1);
          if (inDegree.get(nb) === 0) queue.push(nb);
          const ni = charIndex.get(nb)!;
          steps.push({
            line: 14,
            explanation: `In-degree['${nb}'] decremented to ${inDegree.get(nb)}${inDegree.get(nb) === 0 ? '. Enqueue!' : '.'}`,
            variables: { nb, newInDegree: inDegree.get(nb) },
            visualization: makeViz(
              { [ci]: 'found', [ni]: inDegree.get(nb) === 0 ? 'active' : 'comparing' },
              Object.fromEntries(chars.map((ch, i) => [i, `${ch}:${inDegree.get(ch)}`])),
              [...result],
              [...queue]
            ),
          });
        }
      }

      const finalResult = result.length === chars.length ? result.join('') : '';
      const finalHighlights: Record<number, string> = {};
      for (let i = 0; i < chars.length; i++) {
        finalHighlights[i] = result.includes(chars[i]) ? 'found' : 'mismatch';
      }

      steps.push({
        line: 16,
        explanation: finalResult
          ? `Alien alphabet order: "${finalResult}". All ${chars.length} characters processed.`
          : `Cycle detected! Only ${result.length}/${chars.length} chars processed. Return "".`,
        variables: { result: finalResult },
        visualization: makeViz(
          finalHighlights,
          Object.fromEntries(chars.map((c, i) => [i, c])),
          [...result],
          []
        ),
      });
    }

    return steps;
  },
};

export default alienDictionaryIii;
