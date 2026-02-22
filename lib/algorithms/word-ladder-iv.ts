import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wordLadderIV: AlgorithmDefinition = {
  id: 'word-ladder-iv',
  title: 'Word Ladder IV',
  leetcodeNumber: 127,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given beginWord, endWord, and a word list, find the length of the shortest transformation sequence from beginWord to endWord where each step changes exactly one letter and the intermediate word must be in the word list. Uses bidirectional BFS for efficiency.',
  tags: ['Graph', 'BFS', 'Bidirectional BFS', 'String'],
  code: {
    pseudocode: `function ladderLength(beginWord, endWord, wordList):
  wordSet = set(wordList)
  if endWord not in wordSet: return 0
  // Bidirectional BFS
  beginSet = {beginWord}, endSet = {endWord}
  visited = set(), steps = 1
  while beginSet and endSet:
    if len(beginSet) > len(endSet): swap(beginSet, endSet)
    nextSet = set()
    for word in beginSet:
      for each one-letter variation:
        if variation in endSet: return steps+1
        if variation in wordSet and not visited:
          nextSet.add(variation); visited.add(variation)
    beginSet = nextSet; steps++
  return 0`,
    python: `def ladderLength(beginWord, endWord, wordList):
    wordSet = set(wordList)
    if endWord not in wordSet: return 0
    beginSet, endSet = {beginWord}, {endWord}
    visited = set()
    steps = 1
    while beginSet and endSet:
        if len(beginSet) > len(endSet):
            beginSet, endSet = endSet, beginSet
        nextSet = set()
        for word in beginSet:
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    nw = word[:i] + c + word[i+1:]
                    if nw in endSet: return steps + 1
                    if nw in wordSet and nw not in visited:
                        nextSet.add(nw); visited.add(nw)
        beginSet = nextSet; steps += 1
    return 0`,
    javascript: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  let beginSet = new Set([beginWord]), endSet = new Set([endWord]);
  const visited = new Set();
  let steps = 1;
  while (beginSet.size > 0 && endSet.size > 0) {
    if (beginSet.size > endSet.size) [beginSet, endSet] = [endSet, beginSet];
    const nextSet = new Set();
    for (const word of beginSet) {
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const nw = word.slice(0,i) + String.fromCharCode(c) + word.slice(i+1);
          if (endSet.has(nw)) return steps + 1;
          if (wordSet.has(nw) && !visited.has(nw)) {
            nextSet.add(nw); visited.add(nw);
          }
        }
      }
    }
    beginSet = nextSet; steps++;
  }
  return 0;
}`,
    java: `public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> wordSet=new HashSet<>(wordList);
    if (!wordSet.contains(endWord)) return 0;
    Set<String> beginSet=new HashSet<>(), endSet=new HashSet<>(), visited=new HashSet<>();
    beginSet.add(beginWord); endSet.add(endWord);
    int steps=1;
    while (!beginSet.isEmpty()&&!endSet.isEmpty()) {
        if (beginSet.size()>endSet.size()){Set<String>t=beginSet;beginSet=endSet;endSet=t;}
        Set<String> next=new HashSet<>();
        for (String w:beginSet) {
            char[] arr=w.toCharArray();
            for (int i=0;i<arr.length;i++) {
                char orig=arr[i];
                for (char c='a';c<='z';c++) {
                    arr[i]=c; String nw=new String(arr);
                    if (endSet.contains(nw)) return steps+1;
                    if (wordSet.contains(nw)&&!visited.contains(nw)){next.add(nw);visited.add(nw);}
                }
                arr[i]=orig;
            }
        }
        beginSet=next; steps++;
    }
    return 0;
}`,
  },
  defaultInput: {
    beginWord: 'hit',
    endWord: 'cog',
    wordList: ['hot','dot','dog','lot','log','cog'],
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
      label: 'Word List',
      type: 'array',
      defaultValue: ['hot','dot','dog','lot','log','cog'],
      placeholder: '["hot","dot","dog"]',
      helperText: 'Dictionary of valid transformation words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const beginWord = input.beginWord as string;
    const endWord = input.endWord as string;
    const wordList = input.wordList as string[];
    const steps: AlgorithmStep[] = [];

    const wordSet = new Set(wordList);

    // Encode words as indices for visualization
    const allWords = [beginWord, ...wordList];
    const wordIndex = new Map(allWords.map((w, i) => [w, i]));

    function makeViz(highlights: Record<number, string>, extra: string, current?: string[]): ArrayVisualization {
      return {
        type: 'array',
        array: allWords.map((_, i) => i),
        highlights,
        labels: Object.fromEntries(allWords.map((w, i) => [i, w])),
        auxData: {
          label: 'Word Ladder (Bidirectional BFS)',
          entries: [
            { key: 'Begin', value: beginWord },
            { key: 'End', value: endWord },
            { key: 'Current Frontier', value: current ? current.join(', ') : '' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    if (!wordSet.has(endWord)) {
      steps.push({
        line: 2,
        explanation: `"${endWord}" not in word list. No transformation possible. Return 0.`,
        variables: { result: 0 },
        visualization: makeViz(
          Object.fromEntries(allWords.map((_, i) => [i, 'default'])),
          'endWord not in list'
        ),
      });
      return steps;
    }

    steps.push({
      line: 3,
      explanation: `Bidirectional BFS: expand from both "${beginWord}" and "${endWord}" simultaneously. Meet in the middle for efficiency.`,
      variables: { beginWord, endWord, wordListSize: wordList.length },
      visualization: makeViz(
        {
          0: 'active',
          ...(wordIndex.has(endWord) ? { [wordIndex.get(endWord)!]: 'found' } : {}),
        },
        'Initialized'
      ),
    });

    let beginSet = new Set([beginWord]);
    let endSet = new Set([endWord]);
    const visited = new Set<string>();
    let numSteps = 1;
    let result = 0;

    while (beginSet.size > 0 && endSet.size > 0) {
      if (beginSet.size > endSet.size) {
        const tmp = beginSet; beginSet = endSet; endSet = tmp;
      }

      const nextSet = new Set<string>();
      let found = false;

      for (const word of beginSet) {
        const arr = word.split('');
        for (let i = 0; i < arr.length; i++) {
          const orig = arr[i];
          for (let c = 97; c <= 122; c++) {
            arr[i] = String.fromCharCode(c);
            const nw = arr.join('');
            if (endSet.has(nw)) {
              result = numSteps + 1;
              found = true;
              const h: Record<number, string> = {};
              for (const w of beginSet) if (wordIndex.has(w)) h[wordIndex.get(w)!] = 'active';
              for (const w of endSet) if (wordIndex.has(w)) h[wordIndex.get(w)!] = 'found';
              if (wordIndex.has(nw)) h[wordIndex.get(nw)!] = 'sorted';
              steps.push({
                line: 9,
                explanation: `"${word}" → "${nw}" meets end frontier. Transformation found! Length = ${result}.`,
                variables: { result, steps: numSteps + 1 },
                visualization: makeViz(h, `Met at "${nw}". Result: ${result}`, [nw]),
              });
              break;
            }
            if (wordSet.has(nw) && !visited.has(nw)) {
              nextSet.add(nw);
              visited.add(nw);
            }
          }
          arr[i] = orig;
          if (found) break;
        }
        if (found) break;
      }

      if (found) break;

      const frontierWords = [...nextSet].slice(0, 5);
      const h: Record<number, string> = {};
      for (const w of nextSet) if (wordIndex.has(w)) h[wordIndex.get(w)!] = 'comparing';
      for (const w of endSet) if (wordIndex.has(w)) h[wordIndex.get(w)!] = 'found';

      steps.push({
        line: 13,
        explanation: `Step ${numSteps}: Expanded ${beginSet.size} words → ${nextSet.size} new reachable words.`,
        variables: { step: numSteps, newWords: nextSet.size },
        visualization: makeViz(h, `Step ${numSteps}: ${nextSet.size} new words`, frontierWords),
      });

      beginSet = nextSet;
      numSteps++;

      if (numSteps > 15) break; // Safety limit
    }

    if (result === 0) {
      steps.push({
        line: 15,
        explanation: `No transformation sequence found from "${beginWord}" to "${endWord}". Return 0.`,
        variables: { result: 0 },
        visualization: makeViz(
          Object.fromEntries(allWords.map((_, i) => [i, 'mismatch'])),
          'No path found'
        ),
      });
    }

    return steps;
  },
};

export default wordLadderIV;
