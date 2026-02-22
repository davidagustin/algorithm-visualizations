import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countVowelStringsInRanges: AlgorithmDefinition = {
  id: 'count-vowel-strings-in-ranges',
  title: 'Count Vowel Strings in Ranges',
  leetcodeNumber: 2559,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Given an array of words and queries [li, ri], for each query count words[li..ri] that start and end with a vowel. Build a prefix sum of "vowel words" markers, then each query is answered in O(1). O(n+q) total time.',
  tags: ['Prefix Sum', 'Array', 'String'],
  code: {
    pseudocode: `function vowelStrings(words, queries):
  VOWELS = {'a','e','i','o','u'}
  n = len(words)
  prefix = [0] * (n + 1)
  for i from 0 to n-1:
    isVowel = words[i][0] in VOWELS and words[i][-1] in VOWELS
    prefix[i+1] = prefix[i] + (1 if isVowel else 0)
  return [prefix[r+1] - prefix[l] for l,r in queries]`,
    python: `def vowelStrings(words: list[str], queries: list[list[int]]) -> list[int]:
    vowels = set('aeiou')
    n = len(words)
    prefix = [0] * (n + 1)
    for i, w in enumerate(words):
        prefix[i + 1] = prefix[i] + (1 if w[0] in vowels and w[-1] in vowels else 0)
    return [prefix[r + 1] - prefix[l] for l, r in queries]`,
    javascript: `function vowelStrings(words, queries) {
  const vowels = new Set('aeiou');
  const n = words.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    const w = words[i];
    prefix[i + 1] = prefix[i] + (vowels.has(w[0]) && vowels.has(w.at(-1)) ? 1 : 0);
  }
  return queries.map(([l, r]) => prefix[r + 1] - prefix[l]);
}`,
    java: `public int[] vowelStrings(String[] words, int[][] queries) {
    Set<Character> vowels = new HashSet<>(Arrays.asList('a','e','i','o','u'));
    int n = words.length;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) {
        String w = words[i];
        prefix[i+1] = prefix[i] + (vowels.contains(w.charAt(0)) && vowels.contains(w.charAt(w.length()-1)) ? 1 : 0);
    }
    int[] res = new int[queries.length];
    for (int i = 0; i < queries.length; i++)
        res[i] = prefix[queries[i][1]+1] - prefix[queries[i][0]];
    return res;
}`,
  },
  defaultInput: {
    words: ['aba', 'bcb', 'ece', 'aa', 'e'],
    queries: [[0, 2], [1, 4], [1, 1]],
  },
  inputFields: [
    {
      name: 'words',
      label: 'Words (as numbers: 1=vowel-word, 0=not)',
      type: 'array',
      defaultValue: [1, 0, 1, 1, 1],
      placeholder: '1,0,1,1,1',
      helperText: '1 if word starts/ends with vowel, 0 otherwise',
    },
    {
      name: 'left',
      label: 'Query left',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
    },
    {
      name: 'right',
      label: 'Query right',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const marks = input.words as number[];
    const left = (input.left as number) ?? 0;
    const right = (input.right as number) ?? 2;
    const steps: AlgorithmStep[] = [];
    const n = marks.length;
    const prefix: number[] = new Array(n + 1).fill(0);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...marks],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Build prefix sum of vowel-words. marks = [${marks.join(', ')}] (1=starts&ends with vowel).`,
      variables: { marks },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      prefix[i + 1] = prefix[i] + marks[i];
      steps.push({
        line: 6,
        explanation: `prefix[${i + 1}] = prefix[${i}](${prefix[i]}) + marks[${i}](${marks[i]}) = ${prefix[i + 1]}.`,
        variables: { i, 'prefix[i+1]': prefix[i + 1] },
        visualization: makeViz(
          { [i]: marks[i] === 1 ? 'found' : 'visited' },
          { [i]: marks[i] === 1 ? 'vowel' : 'not' },
        ),
      });
    }

    const result = prefix[right + 1] - prefix[left];
    steps.push({
      line: 8,
      explanation: `Query [${left}, ${right}]: prefix[${right + 1}](${prefix[right + 1]}) - prefix[${left}](${prefix[left]}) = ${result} vowel-words.`,
      variables: { left, right, result },
      visualization: makeViz(
        Object.fromEntries(
          Array.from({ length: right - left + 1 }, (_, k) => [left + k, marks[left + k] === 1 ? 'found' : 'active']),
        ),
        { [left]: 'L', [right]: `R ans=${result}` },
      ),
    });

    return steps;
  },
};

export default countVowelStringsInRanges;
