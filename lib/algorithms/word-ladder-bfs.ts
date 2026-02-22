import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wordLadderBfs: AlgorithmDefinition = {
  id: 'word-ladder-bfs',
  title: 'Word Ladder (BFS)',
  leetcodeNumber: 127,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a beginWord, endWord, and wordList, find the length of the shortest transformation sequence from beginWord to endWord, changing one letter at a time where each intermediate word must be in the wordList. BFS explores all one-letter transformations level by level.',
  tags: ['bfs', 'graph', 'string', 'word ladder', 'shortest path'],

  code: {
    pseudocode: `function ladderLength(beginWord, endWord, wordList):
  wordSet = set(wordList)
  if endWord not in wordSet: return 0
  queue = [(beginWord, 1)]
  visited = {beginWord}
  while queue not empty:
    word, length = dequeue()
    for i in range(len(word)):
      for c in 'a'..'z':
        newWord = word[:i] + c + word[i+1:]
        if newWord == endWord: return length + 1
        if newWord in wordSet and newWord not in visited:
          visited.add(newWord)
          enqueue(newWord, length+1)
  return 0`,

    python: `from collections import deque

def ladderLength(beginWord, endWord, wordList):
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    queue = deque([(beginWord, 1)])
    visited = {beginWord}
    while queue:
        word, length = queue.popleft()
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]
                if new_word == endWord:
                    return length + 1
                if new_word in word_set and new_word not in visited:
                    visited.add(new_word)
                    queue.append((new_word, length + 1))
    return 0`,

    javascript: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  const queue = [[beginWord, 1]];
  const visited = new Set([beginWord]);
  while (queue.length) {
    const [word, length] = queue.shift();
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const newWord = word.slice(0,i) + String.fromCharCode(c) + word.slice(i+1);
        if (newWord === endWord) return length + 1;
        if (wordSet.has(newWord) && !visited.has(newWord)) {
          visited.add(newWord);
          queue.push([newWord, length + 1]);
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
    queue.offer(new String[]{beginWord, "1"});
    Set<String> visited = new HashSet<>();
    visited.add(beginWord);
    while (!queue.isEmpty()) {
        String[] cur = queue.poll();
        String word = cur[0]; int length = Integer.parseInt(cur[1]);
        for (int i = 0; i < word.length(); i++) {
            char[] arr = word.toCharArray();
            for (char c = 'a'; c <= 'z'; c++) {
                arr[i] = c;
                String newWord = new String(arr);
                if (newWord.equals(endWord)) return length + 1;
                if (wordSet.contains(newWord) && !visited.contains(newWord)) {
                    visited.add(newWord);
                    queue.offer(new String[]{newWord, String.valueOf(length+1)});
                }
            }
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
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const beginWord = input.beginWord as string;
    const endWord = input.endWord as string;
    const wordList = input.wordList as string[];
    const steps: AlgorithmStep[] = [];

    const wordSet = new Set<string>(wordList);
    const displayList = wordList.slice(0, 8);

    steps.push({
      line: 1,
      explanation: `Transform "${beginWord}" to "${endWord}" changing one letter at a time. Word list has ${wordList.length} word(s). ${wordSet.has(endWord) ? 'endWord is in list.' : 'endWord NOT in list, return 0.'}`,
      variables: { beginWord, endWord, wordListSize: wordList.length },
      visualization: {
        type: 'array',
        array: displayList.map((_, i) => i),
        highlights: Object.fromEntries(displayList.map((w, i) => [i, w === endWord ? 'pointer' : 'default'])),
        labels: Object.fromEntries(displayList.map((w, i) => [i, w])),
      } as ArrayVisualization,
    });

    if (!wordSet.has(endWord)) {
      steps.push({
        line: 3,
        explanation: `endWord "${endWord}" not in wordList. Return 0.`,
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: [0],
          highlights: { 0: 'mismatch' },
          labels: { 0: 'result=0' },
        } as ArrayVisualization,
      });
      return steps;
    }

    const queue: [string, number][] = [[beginWord, 1]];
    const visited = new Set<string>([beginWord]);

    while (queue.length > 0) {
      const [word, length] = queue.shift()!;

      steps.push({
        line: 7,
        explanation: `BFS level ${length}: processing word "${word}". Trying all one-letter substitutions.`,
        variables: { currentWord: word, level: length, visited: visited.size },
        visualization: {
          type: 'array',
          array: displayList.map((_, i) => i),
          highlights: Object.fromEntries(
            displayList.map((w, i) => [i, visited.has(w) ? 'visited' : w === word ? 'active' : 'default'])
          ),
          labels: Object.fromEntries(displayList.map((w, i) => [i, w])),
        } as ArrayVisualization,
      });

      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);

          if (newWord === endWord) {
            steps.push({
              line: 10,
              explanation: `Found endWord "${endWord}" from "${word}" by changing position ${i} to '${String.fromCharCode(c)}'. Total length: ${length + 1}.`,
              variables: { result: length + 1, from: word, to: newWord },
              visualization: {
                type: 'array',
                array: displayList.map((_, i2) => i2),
                highlights: Object.fromEntries(
                  displayList.map((w, i2) => [i2, w === endWord ? 'found' : visited.has(w) ? 'visited' : 'default'])
                ),
                labels: Object.fromEntries(displayList.map((w, i2) => [i2, w])),
              } as ArrayVisualization,
            });
            return steps;
          }

          if (wordSet.has(newWord) && !visited.has(newWord)) {
            visited.add(newWord);
            queue.push([newWord, length + 1]);
            steps.push({
              line: 12,
              explanation: `"${word}" -> "${newWord}": valid transformation. Added to queue at level ${length + 1}.`,
              variables: { from: word, to: newWord, newLevel: length + 1 },
              visualization: {
                type: 'array',
                array: displayList.map((_, i2) => i2),
                highlights: Object.fromEntries(
                  displayList.map((w, i2) => [i2, w === newWord ? 'comparing' : visited.has(w) ? 'visited' : 'default'])
                ),
                labels: Object.fromEntries(displayList.map((w, i2) => [i2, w])),
              } as ArrayVisualization,
            });
          }
        }
      }

      if (steps.length > 18) break;
    }

    steps.push({
      line: 14,
      explanation: `BFS exhausted. No transformation sequence found from "${beginWord}" to "${endWord}". Return 0.`,
      variables: { result: 0 },
      visualization: {
        type: 'array',
        array: displayList.map((_, i) => i),
        highlights: Object.fromEntries(displayList.map((_, i) => [i, 'mismatch'])),
        labels: Object.fromEntries(displayList.map((w, i) => [i, w])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default wordLadderBfs;
