import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestWordDistanceIi: AlgorithmDefinition = {
  id: 'shortest-word-distance-ii',
  title: 'Shortest Word Distance II',
  leetcodeNumber: 244,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Design a class that accepts a list of words and supports multiple shortest distance queries. Pre-process by storing indices for each word in a map, then use two pointers on the sorted index lists to find the minimum distance in O(M+N) per query.',
  tags: ['two pointers', 'hash map', 'design', 'string'],

  code: {
    pseudocode: `class WordDistance:
  __init__(words):
    map = {}
    for i, w in words:
      map[w].append(i)

  shortest(word1, word2):
    list1 = map[word1]
    list2 = map[word2]
    i = j = 0, minDist = infinity
    while i < len(list1) and j < len(list2):
      minDist = min(minDist, |list1[i] - list2[j]|)
      if list1[i] < list2[j]: i++
      else: j++
    return minDist`,

    python: `class WordDistance:
    def __init__(self, words: list[str]):
        self.map = {}
        for i, w in enumerate(words):
            self.map.setdefault(w, []).append(i)

    def shortest(self, word1: str, word2: str) -> int:
        l1, l2 = self.map[word1], self.map[word2]
        i = j = 0
        min_dist = float('inf')
        while i < len(l1) and j < len(l2):
            min_dist = min(min_dist, abs(l1[i] - l2[j]))
            if l1[i] < l2[j]:
                i += 1
            else:
                j += 1
        return min_dist`,

    javascript: `class WordDistance {
  constructor(words) {
    this.map = {};
    words.forEach((w, i) => {
      (this.map[w] = this.map[w] || []).push(i);
    });
  }
  shortest(word1, word2) {
    const l1 = this.map[word1], l2 = this.map[word2];
    let i = 0, j = 0, minDist = Infinity;
    while (i < l1.length && j < l2.length) {
      minDist = Math.min(minDist, Math.abs(l1[i] - l2[j]));
      if (l1[i] < l2[j]) i++;
      else j++;
    }
    return minDist;
  }
}`,

    java: `class WordDistance {
    Map<String, List<Integer>> map = new HashMap<>();
    public WordDistance(String[] words) {
        for (int i = 0; i < words.length; i++)
            map.computeIfAbsent(words[i], k -> new ArrayList<>()).add(i);
    }
    public int shortest(String w1, String w2) {
        List<Integer> l1 = map.get(w1), l2 = map.get(w2);
        int i = 0, j = 0, min = Integer.MAX_VALUE;
        while (i < l1.size() && j < l2.size()) {
            min = Math.min(min, Math.abs(l1.get(i) - l2.get(j)));
            if (l1.get(i) < l2.get(j)) i++; else j++;
        }
        return min;
    }
}`,
  },

  defaultInput: {
    words: ['practice', 'makes', 'perfect', 'coding', 'makes'],
    word1: 'makes',
    word2: 'coding',
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words Array',
      type: 'array',
      defaultValue: ['practice', 'makes', 'perfect', 'coding', 'makes'],
      placeholder: 'practice,makes,perfect,coding,makes',
      helperText: 'Comma-separated words',
    },
    {
      name: 'word1',
      label: 'Word 1',
      type: 'string',
      defaultValue: 'makes',
      placeholder: 'makes',
      helperText: 'First word to query',
    },
    {
      name: 'word2',
      label: 'Word 2',
      type: 'string',
      defaultValue: 'coding',
      placeholder: 'coding',
      helperText: 'Second word to query',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const word1 = input.word1 as string;
    const word2 = input.word2 as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: words.map((_, i) => i),
      highlights,
      labels,
    });

    // Build map
    const indexMap: Record<string, number[]> = {};
    for (let i = 0; i < words.length; i++) {
      if (!indexMap[words[i]]) indexMap[words[i]] = [];
      indexMap[words[i]].push(i);
    }

    steps.push({
      line: 2,
      explanation: `Pre-processing: build index map. Each word maps to list of its positions.`,
      variables: { indexMap },
      visualization: makeViz({}, Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    const l1 = indexMap[word1] || [];
    const l2 = indexMap[word2] || [];

    steps.push({
      line: 7,
      explanation: `Query: word1="${word1}" at indices [${l1}], word2="${word2}" at indices [${l2}]. Use two pointers.`,
      variables: { list1: l1, list2: l2 },
      visualization: makeViz(
        {
          ...Object.fromEntries(l1.map(idx => [idx, 'active'])),
          ...Object.fromEntries(l2.map(idx => [idx, 'comparing'])),
        },
        {
          ...Object.fromEntries(l1.map(idx => [idx, word1])),
          ...Object.fromEntries(l2.map(idx => [idx, word2])),
        }
      ),
    });

    let i = 0;
    let j = 0;
    let minDist = Infinity;

    while (i < l1.length && j < l2.length) {
      const dist = Math.abs(l1[i] - l2[j]);
      if (dist < minDist) minDist = dist;

      steps.push({
        line: 11,
        explanation: `Comparing indices l1[${i}]=${l1[i]} and l2[${j}]=${l2[j]}. Distance=${dist}. minDist=${minDist}.`,
        variables: { i, j, 'l1[i]': l1[i], 'l2[j]': l2[j], dist, minDist },
        visualization: makeViz({ [l1[i]]: 'active', [l2[j]]: 'found' }, { [l1[i]]: `p1`, [l2[j]]: `p2` }),
      });

      if (l1[i] < l2[j]) {
        steps.push({
          line: 12,
          explanation: `l1[i]=${l1[i]} < l2[j]=${l2[j]}, advance i to ${i + 1}.`,
          variables: { i: i + 1, j },
          visualization: makeViz({ [l1[i]]: 'pointer' }, { [l1[i]]: `i++` }),
        });
        i++;
      } else {
        steps.push({
          line: 13,
          explanation: `l2[j]=${l2[j]} <= l1[i]=${l1[i]}, advance j to ${j + 1}.`,
          variables: { i, j: j + 1 },
          visualization: makeViz({ [l2[j]]: 'pointer' }, { [l2[j]]: `j++` }),
        });
        j++;
      }
    }

    steps.push({
      line: 14,
      explanation: `Shortest distance between "${word1}" and "${word2}" is ${minDist}.`,
      variables: { minDist },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default shortestWordDistanceIi;
