import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestTransformationSequence: AlgorithmDefinition = {
  id: 'shortest-transformation-sequence',
  title: 'Shortest Transformation Sequence',
  leetcodeNumber: 127,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a beginWord, endWord, and a word list, find the length of the shortest transformation sequence from beginWord to endWord, such that each step changes exactly one letter and the intermediate word must be in the word list. Uses BFS on an implicit graph of words.',
  tags: ['Graph', 'BFS', 'String'],
  code: {
    pseudocode: `function ladderLength(beginWord, endWord, wordList):
  wordSet = set(wordList)
  if endWord not in wordSet: return 0
  queue = [(beginWord, 1)]
  visited = {beginWord}
  while queue not empty:
    (word, level) = queue.dequeue()
    for i from 0 to len(word)-1:
      for c in 'a' to 'z':
        newWord = word[:i] + c + word[i+1:]
        if newWord == endWord: return level + 1
        if newWord in wordSet and newWord not in visited:
          visited.add(newWord)
          queue.enqueue((newWord, level + 1))
  return 0`,
    python: `def ladderLength(beginWord, endWord, wordList):
    wordSet = set(wordList)
    if endWord not in wordSet:
        return 0
    queue = deque([(beginWord, 1)])
    visited = {beginWord}
    while queue:
        word, level = queue.popleft()
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                newWord = word[:i] + c + word[i+1:]
                if newWord == endWord:
                    return level + 1
                if newWord in wordSet and newWord not in visited:
                    visited.add(newWord)
                    queue.append((newWord, level + 1))
    return 0`,
    javascript: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  const queue = [[beginWord, 1]];
  const visited = new Set([beginWord]);
  while (queue.length > 0) {
    const [word, level] = queue.shift();
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const newWord = word.slice(0,i) + String.fromCharCode(c) + word.slice(i+1);
        if (newWord === endWord) return level + 1;
        if (wordSet.has(newWord) && !visited.has(newWord)) {
          visited.add(newWord);
          queue.push([newWord, level + 1]);
        }
      }
    }
  }
  return 0;
}`,
    java: `public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> wordSet = new HashSet<>(wordList);
    if (!wordSet.contains(endWord)) return 0;
    Queue<String[]> queue = new LinkedList<>();
    queue.add(new String[]{beginWord, "1"});
    Set<String> visited = new HashSet<>();
    visited.add(beginWord);
    while (!queue.isEmpty()) {
        String[] pair = queue.poll();
        String word = pair[0];
        int level = Integer.parseInt(pair[1]);
        char[] chars = word.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            char orig = chars[i];
            for (char c = 'a'; c <= 'z'; c++) {
                chars[i] = c;
                String newWord = new String(chars);
                if (newWord.equals(endWord)) return level + 1;
                if (wordSet.contains(newWord) && !visited.contains(newWord)) {
                    visited.add(newWord);
                    queue.add(new String[]{newWord, String.valueOf(level+1)});
                }
            }
            chars[i] = orig;
        }
    }
    return 0;
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
      helperText: 'Starting word',
    },
    {
      name: 'endWord',
      label: 'End Word',
      type: 'string',
      defaultValue: 'cog',
      placeholder: 'cog',
      helperText: 'Target word',
    },
    {
      name: 'wordList',
      label: 'Word List',
      type: 'array',
      defaultValue: ['hot', 'dot', 'dog', 'lot', 'log', 'cog'],
      placeholder: 'hot,dot,dog,lot,log,cog',
      helperText: 'Comma-separated list of valid intermediate words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const beginWord = input.beginWord as string;
    const endWord = input.endWord as string;
    const wordList = input.wordList as string[];
    const steps: AlgorithmStep[] = [];

    // Build display array: beginWord + wordList words (endWord is in wordList)
    const allWords = [beginWord, ...wordList.filter(w => w !== beginWord)];
    const wordIndex = new Map<string, number>();
    allWords.forEach((w, i) => wordIndex.set(w, i));

    const wordSet = new Set(wordList);
    const visited = new Set<string>();
    const wordLevel = new Map<string, number>();

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      level: number
    ): ArrayVisualization {
      const baseHighlights: Record<number, string> = {};
      for (const w of visited) {
        const wi = wordIndex.get(w);
        if (wi !== undefined) baseHighlights[wi] = 'visited';
      }
      // Show begin word
      const bi = wordIndex.get(beginWord);
      if (bi !== undefined) baseHighlights[bi] = 'pointer';
      // Show end word
      const ei = wordIndex.get(endWord);
      if (ei !== undefined && !visited.has(endWord)) baseHighlights[ei] = 'comparing';

      return {
        type: 'array',
        array: allWords.map((_, i) => i),
        highlights: { ...baseHighlights, ...highlights },
        labels: { ...Object.fromEntries(allWords.map((w, i) => [i, w])), ...labels },
        auxData: {
          label: 'BFS State',
          entries: [
            { key: 'Level', value: String(level) },
            { key: 'Visited', value: [...visited].join(', ') || 'none' },
          ],
        },
      };
    }

    if (!wordSet.has(endWord)) {
      steps.push({
        line: 3,
        explanation: `End word "${endWord}" is not in the word list. Return 0 (impossible).`,
        variables: { result: 0 },
        visualization: makeViz({}, {}, 0),
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Start BFS from "${beginWord}" to "${endWord}". Word list has ${wordList.length} words.`,
      variables: { beginWord, endWord, wordListSize: wordList.length },
      visualization: makeViz({}, {}, 1),
    });

    // BFS
    const queue: [string, number][] = [[beginWord, 1]];
    visited.add(beginWord);
    wordLevel.set(beginWord, 1);

    while (queue.length > 0) {
      const [word, level] = queue.shift()!;
      const wi = wordIndex.get(word);

      steps.push({
        line: 7,
        explanation: `Dequeue "${word}" at level ${level}. Try changing each character.`,
        variables: { word, level },
        visualization: makeViz(
          wi !== undefined ? { [wi]: 'active' } : {},
          {},
          level
        ),
      });

      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
          if (newWord === endWord) {
            const ei = wordIndex.get(endWord);
            steps.push({
              line: 11,
              explanation: `Found "${endWord}"! Changed "${word}" position ${i} to "${String.fromCharCode(c)}". Shortest path length = ${level + 1}.`,
              variables: { word, newWord, level: level + 1, result: level + 1 },
              visualization: makeViz(
                {
                  ...(wi !== undefined ? { [wi]: 'active' } : {}),
                  ...(ei !== undefined ? { [ei]: 'found' } : {}),
                },
                {},
                level + 1
              ),
            });
            return steps;
          }
          if (wordSet.has(newWord) && !visited.has(newWord)) {
            visited.add(newWord);
            wordLevel.set(newWord, level + 1);
            queue.push([newWord, level + 1]);
            const ni = wordIndex.get(newWord);

            steps.push({
              line: 13,
              explanation: `"${word}" -> "${newWord}" (changed position ${i}). Enqueue at level ${level + 1}.`,
              variables: { word, newWord, position: i, level: level + 1 },
              visualization: makeViz(
                {
                  ...(wi !== undefined ? { [wi]: 'active' } : {}),
                  ...(ni !== undefined ? { [ni]: 'comparing' } : {}),
                },
                {},
                level + 1
              ),
            });
          }
        }
      }
    }

    // Not found
    steps.push({
      line: 15,
      explanation: `BFS exhausted. No transformation sequence from "${beginWord}" to "${endWord}" exists. Return 0.`,
      variables: { result: 0 },
      visualization: makeViz({}, {}, 0),
    });

    return steps;
  },
};

export default shortestTransformationSequence;
