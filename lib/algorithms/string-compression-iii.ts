import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stringCompressionIii: AlgorithmDefinition = {
  id: 'string-compression-iii',
  title: 'String Compression III',
  leetcodeNumber: 3163,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Compress a string by counting consecutive characters, but limit each run to at most 9. For example "aaaaaaaaaabc" -> "9a1a1b1c". Greedily consume up to 9 identical characters at a time and output count+char.',
  tags: ['string', 'compression', 'run-length encoding', 'greedy'],
  code: {
    pseudocode: `function compressedString(word):
  result = ""
  i = 0
  while i < len(word):
    j = i
    count = 0
    while j < len(word) and word[j] == word[i] and count < 9:
      j++; count++
    result += str(count) + word[i]
    i = j
  return result`,
    python: `def compressedString(word: str) -> str:
    result = []
    i = 0
    while i < len(word):
        j, count = i, 0
        while j < len(word) and word[j] == word[i] and count < 9:
            j += 1
            count += 1
        result.append(str(count) + word[i])
        i = j
    return ''.join(result)`,
    javascript: `function compressedString(word) {
  let result = '', i = 0;
  while (i < word.length) {
    let j = i, count = 0;
    while (j < word.length && word[j] === word[i] && count < 9) {
      j++; count++;
    }
    result += count + word[i];
    i = j;
  }
  return result;
}`,
    java: `public String compressedString(String word) {
    StringBuilder sb = new StringBuilder();
    int i = 0;
    while (i < word.length()) {
        int j = i, count = 0;
        while (j < word.length() && word.charAt(j) == word.charAt(i) && count < 9) {
            j++; count++;
        }
        sb.append(count).append(word.charAt(i));
        i = j;
    }
    return sb.toString();
}`,
  },
  defaultInput: { word: 'aaaaaaaaaabc' },
  inputFields: [
    { name: 'word', label: 'Word', type: 'string', defaultValue: 'aaaaaaaaaabc', placeholder: 'aaaaaaaaaabc', helperText: 'Word to compress (runs capped at 9)' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word = input.word as string;
    const n = word.length;
    const steps: AlgorithmStep[] = [];
    let result = '';

    const makeViz = (i: number, j: number, result: string): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      for (let x = 0; x < i; x++) highlights[x] = 'sorted';
      for (let x = i; x < j && x < n; x++) highlights[x] = 'active';
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = word[x];
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, x) => x),
        highlights,
        labels,
        auxData: {
          label: 'String Compression III',
          entries: [
            { key: 'current char', value: i < n ? word[i] : '-' },
            { key: 'run length', value: String(j - i) },
            { key: 'compressed so far', value: result },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Compress "${word}" with run-length encoding capped at 9. Output: count+char for each run.`,
      variables: { word, n },
      visualization: makeViz(0, 0, ''),
    });

    let i = 0;
    while (i < n) {
      let j = i, count = 0;
      while (j < n && word[j] === word[i] && count < 9) {
        j++; count++;
      }
      const token = `${count}${word[i]}`;
      result += token;
      steps.push({
        line: 6,
        explanation: `Run of '${word[i]}' from ${i} to ${j - 1}: count=${count} (capped at 9). Append "${token}". Result: "${result}".`,
        variables: { i, j, char: word[i], count, token, result },
        visualization: makeViz(i, j, result),
      });
      i = j;
    }

    steps.push({
      line: 9,
      explanation: `Compression complete: "${word}" -> "${result}".`,
      variables: { original: word, compressed: result },
      visualization: makeViz(n, n, result),
    });

    return steps;
  },
};

export default stringCompressionIii;
