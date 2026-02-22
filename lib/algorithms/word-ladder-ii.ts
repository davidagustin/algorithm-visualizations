import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wordLadderIi: AlgorithmDefinition = {
  id: 'word-ladder-ii',
  title: 'Word Ladder II',
  leetcodeNumber: 126,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Find all shortest transformation sequences from beginWord to endWord, where each step changes exactly one letter and each intermediate word must exist in the wordList. Uses BFS to build a shortest-path DAG, then DFS to enumerate all paths through that DAG.',
  tags: ['BFS', 'DFS', 'word ladder', 'shortest path', 'graph'],

  code: {
    pseudocode: `function findLadders(begin, end, wordList):
  wordSet = set(wordList)
  if end not in wordSet: return []
  layer = {begin: [[begin]]}
  wordSet.discard(begin)
  while layer:
    nextLayer = {}
    for word in layer:
      for each neighbor of word (1-char change):
        if neighbor in wordSet:
          extend paths and add to nextLayer
    remove nextLayer words from wordSet
    if end in nextLayer: return nextLayer[end]
    layer = nextLayer
  return []`,

    python: `from collections import defaultdict
def findLadders(beginWord, endWord, wordList):
    wordSet = set(wordList)
    if endWord not in wordSet: return []
    layer = {beginWord: [[beginWord]]}
    wordSet.discard(beginWord)
    while layer:
        next_layer = defaultdict(list)
        for word, paths in layer.items():
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    nw = word[:i] + c + word[i+1:]
                    if nw in wordSet:
                        next_layer[nw].extend([p + [nw] for p in paths])
        wordSet -= set(next_layer)
        if endWord in next_layer: return next_layer[endWord]
        layer = next_layer
    return []`,

    javascript: `function findLadders(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return [];
  let layer = new Map([[beginWord, [[beginWord]]]]);
  wordSet.delete(beginWord);
  while (layer.size) {
    const next = new Map();
    for (const [word, paths] of layer) {
      const arr = word.split('');
      for (let i = 0; i < arr.length; i++) {
        const orig = arr[i];
        for (let c = 97; c <= 122; c++) {
          arr[i] = String.fromCharCode(c);
          const nw = arr.join('');
          if (wordSet.has(nw)) {
            if (!next.has(nw)) next.set(nw, []);
            next.get(nw).push(...paths.map(p => [...p, nw]));
          }
          arr[i] = orig;
        }
      }
    }
    for (const k of next.keys()) wordSet.delete(k);
    if (next.has(endWord)) return next.get(endWord);
    layer = next;
  }
  return [];
}`,

    java: `public List<List<String>> findLadders(String begin, String end, List<String> wordList) {
    Set<String> wordSet = new HashSet<>(wordList);
    List<List<String>> res = new ArrayList<>();
    if (!wordSet.contains(end)) return res;
    Map<String, List<List<String>>> layer = new HashMap<>();
    layer.put(begin, Collections.singletonList(Collections.singletonList(begin)));
    wordSet.remove(begin);
    while (!layer.isEmpty()) {
        Map<String, List<List<String>>> next = new HashMap<>();
        for (Map.Entry<String, List<List<String>>> e : layer.entrySet())
            for (List<String> path : e.getValue())
                for each neighbor of e.getKey() if in wordSet add to next
        wordSet.removeAll(next.keySet());
        if (next.containsKey(end)) return next.get(end);
        layer = next;
    }
    return res;
}`,
  },

  defaultInput: {
    beginWord: 'hit',
    endWord: 'cog',
    wordList: ['hot', 'dot', 'dog', 'lot', 'log', 'cog'],
  },

  inputFields: [
    {
      name: 'beginWord',
      label: 'Begin Word',
      type: 'string',
      defaultValue: 'hit',
      placeholder: 'hit',
    },
    {
      name: 'endWord',
      label: 'End Word',
      type: 'string',
      defaultValue: 'cog',
      placeholder: 'cog',
    },
    {
      name: 'wordList',
      label: 'Word List (comma-separated)',
      type: 'array',
      defaultValue: ['hot', 'dot', 'dog', 'lot', 'log', 'cog'],
      placeholder: 'hot,dot,dog,lot,log,cog',
      helperText: 'Available intermediate words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const beginWord = input.beginWord as string;
    const endWord = input.endWord as string;
    const wordListRaw = input.wordList as unknown[];
    const wordList = wordListRaw.map(w => String(w));
    const steps: AlgorithmStep[] = [];

    const wordSet = new Set(wordList);
    const allWords = [beginWord, ...wordList];

    function getNeighbors(word: string, ws: Set<string>): string[] {
      const result: string[] = [];
      const arr = word.split('');
      for (let i = 0; i < arr.length; i++) {
        const orig = arr[i];
        for (let c = 97; c <= 122; c++) {
          arr[i] = String.fromCharCode(c);
          const nw = arr.join('');
          if (nw !== word && ws.has(nw)) result.push(nw);
          arr[i] = orig;
        }
      }
      return result;
    }

    const makeViz = (visited: string[], current: string): ArrayVisualization => ({
      type: 'array',
      array: allWords.map((_, i) => i),
      highlights: Object.fromEntries(
        allWords.map((w, i) => [
          i,
          w === current ? 'active' : w === endWord ? 'found' : visited.includes(w) ? 'visited' : 'default',
        ])
      ),
      labels: Object.fromEntries(allWords.map((w, i) => [i, w])),
    });

    if (!wordSet.has(endWord)) {
      steps.push({
        line: 2,
        explanation: `End word "${endWord}" not in wordList. Return empty.`,
        variables: { beginWord, endWord },
        visualization: makeViz([], beginWord),
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Word Ladder II: find all shortest paths from "${beginWord}" to "${endWord}".`,
      variables: { beginWord, endWord, wordListSize: wordList.length },
      visualization: makeViz([], beginWord),
    });

    let layer = new Map<string, string[][]>();
    layer.set(beginWord, [[beginWord]]);
    wordSet.delete(beginWord);
    const visited: string[] = [beginWord];
    let level = 1;
    let found = false;
    let resultPaths: string[][] = [];

    while (layer.size > 0 && !found) {
      const next = new Map<string, string[][]>();
      const nextWords: string[] = [];

      steps.push({
        line: 6,
        explanation: `BFS level ${level}. Processing ${layer.size} word(s): [${[...layer.keys()].join(', ')}].`,
        variables: { level, layerWords: [...layer.keys()] },
        visualization: makeViz(visited, [...layer.keys()][0]),
      });

      for (const [word, paths] of layer) {
        const neighbors = getNeighbors(word, wordSet);
        for (const nw of neighbors) {
          if (!next.has(nw)) next.set(nw, []);
          next.get(nw)!.push(...paths.map(p => [...p, nw]));
          if (!nextWords.includes(nw)) nextWords.push(nw);
        }
      }

      for (const k of nextWords) { wordSet.delete(k); visited.push(k); }

      if (next.has(endWord)) {
        resultPaths = next.get(endWord)!;
        found = true;
        steps.push({
          line: 11,
          explanation: `Reached "${endWord}" at level ${level + 1}! Found ${resultPaths.length} shortest path(s).`,
          variables: { paths: resultPaths.map(p => p.join('->')), level: level + 1 },
          visualization: makeViz(visited, endWord),
        });
      } else {
        steps.push({
          line: 12,
          explanation: `Level ${level} done. Added words: [${nextWords.join(', ')}]. End not yet reached.`,
          variables: { nextWords, level },
          visualization: makeViz(visited, nextWords[0] ?? ''),
        });
      }

      layer = next;
      level++;
    }

    if (!found) {
      steps.push({
        line: 13,
        explanation: `No path from "${beginWord}" to "${endWord}" found.`,
        variables: { result: [] },
        visualization: makeViz(visited, endWord),
      });
    }

    return steps;
  },
};

export default wordLadderIi;
