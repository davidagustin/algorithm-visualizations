import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countPrefixSuffixPairs: AlgorithmDefinition = {
  id: 'count-prefix-suffix-pairs',
  title: 'Count Prefix and Suffix Pairs I',
  leetcodeNumber: 3042,
  difficulty: 'Easy',
  category: 'Trie',
  description:
    'Given an array of strings, count the number of pairs (i, j) with i < j such that words[i] is both a prefix and a suffix of words[j]. For each pair, check if words[j] starts with words[i] AND ends with words[i]. Since words[i] must fit as both prefix and suffix, its length must not exceed words[j] length.',
  tags: ['trie', 'string', 'enumeration', 'prefix', 'suffix'],

  code: {
    pseudocode: `function countPrefixSuffixPairs(words):
  count = 0
  n = len(words)
  for i in range(n):
    for j in range(i + 1, n):
      wi = words[i]
      wj = words[j]
      if len(wi) > len(wj): continue
      if wj.startswith(wi) and wj.endswith(wi):
        count++
  return count`,

    python: `def countPrefixSuffixPairs(words):
    count = 0
    n = len(words)
    for i in range(n):
        for j in range(i + 1, n):
            wi, wj = words[i], words[j]
            if len(wi) <= len(wj) and wj.startswith(wi) and wj.endswith(wi):
                count += 1
    return count`,

    javascript: `function countPrefixSuffixPairs(words) {
  let count = 0;
  const n = words.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const wi = words[i], wj = words[j];
      if (wi.length <= wj.length && wj.startsWith(wi) && wj.endsWith(wi)) {
        count++;
      }
    }
  }
  return count;
}`,

    java: `public int countPrefixSuffixPairs(String[] words) {
    int count = 0, n = words.length;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) {
            String wi = words[i], wj = words[j];
            if (wi.length() <= wj.length() && wj.startsWith(wi) && wj.endsWith(wi))
                count++;
        }
    return count;
}`,
  },

  defaultInput: {
    words: ['a', 'aba', 'ababa', 'aa'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['a', 'aba', 'ababa', 'aa'],
      placeholder: 'a,aba,ababa,aa',
      helperText: 'Words to check for prefix-suffix pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Check all pairs (i, j) where i < j. Count pairs where words[i] is both a prefix and suffix of words[j]. Words: [${words.join(', ')}].`,
      variables: { words: words.join(', '), n: words.length },
      visualization: makeViz(words.map((w) => w.length), Object.fromEntries(words.map((_, i) => [i, 'active'])), Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    let count = 0;
    const n = words.length;
    const pairCounts = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const wi = words[i];
        const wj = words[j];

        steps.push({
          line: 5,
          explanation: `Check pair (${i}, ${j}): is "${wi}" a prefix AND suffix of "${wj}"?`,
          variables: { i, j, wi, wj },
          visualization: makeViz(words.map((w) => w.length), { [i]: 'active', [j]: 'comparing' }, Object.fromEntries(words.map((w, idx) => [idx, w]))),
        });

        if (wi.length > wj.length) {
          steps.push({
            line: 6,
            explanation: `"${wi}" (len ${wi.length}) longer than "${wj}" (len ${wj.length}). Cannot be prefix or suffix. Skip.`,
            variables: { wi, wj, wiLen: wi.length, wjLen: wj.length },
            visualization: makeViz(words.map((w) => w.length), { [i]: 'mismatch', [j]: 'mismatch' }, Object.fromEntries(words.map((w, idx) => [idx, w]))),
          });
          continue;
        }

        const isPrefix = wj.startsWith(wi);
        const isSuffix = wj.endsWith(wi);
        const isPair = isPrefix && isSuffix;

        if (isPair) {
          count++;
          pairCounts[j]++;
          steps.push({
            line: 8,
            explanation: `MATCH: "${wi}" is a prefix of "${wj}" (${isPrefix}) AND a suffix of "${wj}" (${isSuffix}). Count = ${count}.`,
            variables: { wi, wj, isPrefix, isSuffix, count },
            visualization: makeViz(words.map((w) => w.length), { [i]: 'found', [j]: 'found' }, Object.fromEntries(words.map((w, idx) => [idx, w]))),
          });
        } else {
          steps.push({
            line: 8,
            explanation: `No match: "${wi}" isPrefix="${isPrefix}", isSuffix="${isSuffix}" for "${wj}". Skip.`,
            variables: { wi, wj, isPrefix, isSuffix },
            visualization: makeViz(words.map((w) => w.length), { [i]: 'mismatch', [j]: 'default' }, Object.fromEntries(words.map((w, idx) => [idx, w]))),
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Total pairs where words[i] is both prefix and suffix of words[j]: ${count}.`,
      variables: { count },
      visualization: makeViz(pairCounts, Object.fromEntries(pairCounts.map((v, i) => [i, v > 0 ? 'found' : 'default'])), Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    return steps;
  },
};

export default countPrefixSuffixPairs;
