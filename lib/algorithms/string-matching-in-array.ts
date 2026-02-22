import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stringMatchingInArray: AlgorithmDefinition = {
  id: 'string-matching-in-array',
  title: 'String Matching in an Array',
  leetcodeNumber: 1408,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given an array of strings, return all strings that are substrings of another string in the array. For each pair (i, j) where i != j, check if words[i] is a substring of words[j].',
  tags: ['string', 'substring', 'brute force'],
  code: {
    pseudocode: `function stringMatching(words):
  result = []
  for i in 0..n-1:
    for j in 0..n-1:
      if i != j and words[i] in words[j]:
        result.append(words[i])
        break
  return result`,
    python: `def stringMatching(words):
    result = []
    for i, w in enumerate(words):
        for j, other in enumerate(words):
            if i != j and w in other:
                result.append(w)
                break
    return result`,
    javascript: `function stringMatching(words) {
  return words.filter((w, i) =>
    words.some((other, j) => i !== j && other.includes(w))
  );
}`,
    java: `public List<String> stringMatching(String[] words) {
    List<String> result = new ArrayList<>();
    for (int i = 0; i < words.length; i++)
        for (int j = 0; j < words.length; j++)
            if (i != j && words[j].contains(words[i])) {
                result.add(words[i]);
                break;
            }
    return result;
}`,
  },
  defaultInput: { words: ['mass', 'as', 'hero', 'superhero'] },
  inputFields: [
    { name: 'words', label: 'Words Array', type: 'array', defaultValue: ['mass', 'as', 'hero', 'superhero'], placeholder: 'mass,as,hero,superhero', helperText: 'Array of strings' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const n = words.length;
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];

    const makeViz = (i: number, j: number, match: boolean): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      result.forEach((_, ri) => { highlights[words.indexOf(result[ri])] = 'found'; });
      if (i >= 0) highlights[i] = match ? 'match' : 'active';
      if (j >= 0 && j !== i) highlights[j] = match ? 'comparing' : 'comparing';
      const labels: Record<number, string> = {};
      words.forEach((w, idx) => { labels[idx] = w; });
      return {
        type: 'array',
        array: words.map((_, idx) => idx),
        highlights,
        labels,
        auxData: {
          label: 'String Matching',
          entries: [
            { key: 'checking', value: i >= 0 ? `"${words[i]}"` : '-' },
            { key: 'against', value: j >= 0 ? `"${words[j]}"` : '-' },
            { key: 'is substring?', value: match ? 'YES' : 'NO' },
            { key: 'result', value: result.join(', ') || '(none)' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Check which words are substrings of other words: [${words.map(w => `"${w}"`).join(', ')}].`,
      variables: { words, n },
      visualization: makeViz(-1, -1, false),
    });

    for (let i = 0; i < n; i++) {
      let found = false;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const isMatch = words[j].includes(words[i]);
        steps.push({
          line: 4,
          explanation: `"${words[i]}" ${isMatch ? 'IS' : 'is NOT'} a substring of "${words[j]}".`,
          variables: { word: words[i], against: words[j], isSubstring: isMatch },
          visualization: makeViz(i, j, isMatch),
        });
        if (isMatch) { found = true; break; }
      }
      if (found) result.push(words[i]);
    }

    steps.push({
      line: 7,
      explanation: `Result: [${result.map(w => `"${w}"`).join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(-1, -1, false),
    });

    return steps;
  },
};

export default stringMatchingInArray;
