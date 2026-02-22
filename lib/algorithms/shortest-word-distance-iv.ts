import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestWordDistanceIv: AlgorithmDefinition = {
  id: 'shortest-word-distance-iv',
  title: 'Shortest Word Distance',
  leetcodeNumber: 243,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an array of strings wordsDict and two words word1 and word2, return the shortest distance between them in the list. Build a hash map from word to list of indices, then find the minimum difference between any index in word1 list and any index in word2 list using two-pointer merge.',
  tags: ['hash map', 'array', 'string', 'two pointers'],

  code: {
    pseudocode: `function shortestDistance(wordsDict, word1, word2):
  positions = {}
  for i, w in enumerate(wordsDict):
    positions[w].append(i)
  i, j = 0, 0
  p1 = positions[word1]
  p2 = positions[word2]
  minDist = infinity
  while i < len(p1) and j < len(p2):
    minDist = min(minDist, |p1[i] - p2[j]|)
    if p1[i] < p2[j]: i++
    else: j++
  return minDist`,
    python: `def shortestDistance(wordsDict, word1, word2):
    pos = {}
    for i, w in enumerate(wordsDict):
        pos.setdefault(w, []).append(i)
    p1, p2 = pos[word1], pos[word2]
    i = j = 0
    minDist = float('inf')
    while i < len(p1) and j < len(p2):
        minDist = min(minDist, abs(p1[i] - p2[j]))
        if p1[i] < p2[j]: i += 1
        else: j += 1
    return minDist`,
    javascript: `function shortestDistance(wordsDict, word1, word2) {
  const pos = {};
  for (let i = 0; i < wordsDict.length; i++) {
    (pos[wordsDict[i]] = pos[wordsDict[i]] || []).push(i);
  }
  const p1 = pos[word1], p2 = pos[word2];
  let i = 0, j = 0, min = Infinity;
  while (i < p1.length && j < p2.length) {
    min = Math.min(min, Math.abs(p1[i] - p2[j]));
    if (p1[i] < p2[j]) i++; else j++;
  }
  return min;
}`,
    java: `public int shortestDistance(String[] wordsDict, String word1, String word2) {
    Map<String, List<Integer>> pos = new HashMap<>();
    for (int i = 0; i < wordsDict.length; i++)
        pos.computeIfAbsent(wordsDict[i], k -> new ArrayList<>()).add(i);
    List<Integer> p1 = pos.get(word1), p2 = pos.get(word2);
    int i = 0, j = 0, min = Integer.MAX_VALUE;
    while (i < p1.size() && j < p2.size()) {
        min = Math.min(min, Math.abs(p1.get(i) - p2.get(j)));
        if (p1.get(i) < p2.get(j)) i++; else j++;
    }
    return min;
}`,
  },

  defaultInput: {
    wordsDict: ['practice', 'makes', 'perfect', 'coding', 'makes'],
    word1: 'coding',
    word2: 'practice',
  },

  inputFields: [
    {
      name: 'wordsDict',
      label: 'Words Dictionary',
      type: 'array',
      defaultValue: ['practice', 'makes', 'perfect', 'coding', 'makes'],
      placeholder: 'practice,makes,perfect,coding,makes',
      helperText: 'Comma-separated words',
    },
    {
      name: 'word1',
      label: 'Word 1',
      type: 'string',
      defaultValue: 'coding',
      placeholder: 'coding',
      helperText: 'First target word',
    },
    {
      name: 'word2',
      label: 'Word 2',
      type: 'string',
      defaultValue: 'practice',
      placeholder: 'practice',
      helperText: 'Second target word',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const wordsDict = input.wordsDict as string[];
    const word1 = input.word1 as string;
    const word2 = input.word2 as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: wordsDict as unknown as number[],
      highlights,
      labels,
    });

    const pos: Record<string, number[]> = {};
    for (let i = 0; i < wordsDict.length; i++) {
      if (!pos[wordsDict[i]]) pos[wordsDict[i]] = [];
      pos[wordsDict[i]].push(i);

      const hl: Record<number, string> = {};
      hl[i] = wordsDict[i] === word1 ? 'found' : wordsDict[i] === word2 ? 'comparing' : 'active';

      steps.push({
        line: 2,
        explanation: `Index ${i}: "${wordsDict[i]}" added to positions map.`,
        variables: { index: i, word: wordsDict[i], positions: JSON.stringify(pos) },
        visualization: makeViz(hl, { [i]: `${i}` }),
      });
    }

    const p1 = pos[word1] || [];
    const p2 = pos[word2] || [];

    steps.push({
      line: 5,
      explanation: `Positions: "${word1}" at [${p1.join(', ')}], "${word2}" at [${p2.join(', ')}]. Now merge-scan for minimum distance.`,
      variables: { [`"${word1}"`]: `[${p1.join(', ')}]`, [`"${word2}"`]: `[${p2.join(', ')}]` },
      visualization: makeViz(
        Object.fromEntries([
          ...p1.map((idx) => [idx, 'found'] as [number, string]),
          ...p2.map((idx) => [idx, 'comparing'] as [number, string]),
        ]),
        Object.fromEntries([
          ...p1.map((idx) => [idx, 'w1'] as [number, string]),
          ...p2.map((idx) => [idx, 'w2'] as [number, string]),
        ])
      ),
    });

    let i = 0;
    let j = 0;
    let minDist = Infinity;

    while (i < p1.length && j < p2.length) {
      const dist = Math.abs(p1[i] - p2[j]);
      if (dist < minDist) minDist = dist;

      steps.push({
        line: 9,
        explanation: `p1[${i}]=${p1[i]} vs p2[${j}]=${p2[j]}: dist=${dist}. minDist=${minDist}.`,
        variables: { i, j, p1i: p1[i], p2j: p2[j], dist, minDist },
        visualization: makeViz(
          { [p1[i]]: 'active', [p2[j]]: 'comparing' },
          { [p1[i]]: `i=${i}`, [p2[j]]: `j=${j}` }
        ),
      });

      if (p1[i] < p2[j]) i++;
      else j++;
    }

    steps.push({
      line: 11,
      explanation: `Minimum distance between "${word1}" and "${word2}" is ${minDist}.`,
      variables: { result: minDist },
      visualization: makeViz(
        Object.fromEntries(wordsDict.map((_, idx) => [idx, 'sorted'])),
        Object.fromEntries(wordsDict.map((_, idx) => [idx, wordsDict[idx]]))
      ),
    });

    return steps;
  },
};

export default shortestWordDistanceIv;
