import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sentenceSimilarity: AlgorithmDefinition = {
  id: 'sentence-similarity',
  title: 'Sentence Similarity',
  leetcodeNumber: 734,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Two sentences are similar if they are the same or one can be obtained from the other by inserting a contiguous sequence of words at one end or both ends. Check from left and right simultaneously: advance left pointer while words match, advance right while words match. Return true if all remaining words in the shorter sentence fit in the overlap.',
  tags: ['two pointers', 'string', 'array'],

  code: {
    pseudocode: `function areSentencesSimilar(s1, s2):
  words1 = split(s1), words2 = split(s2)
  if len(words1) > len(words2): swap them
  n1 = len(words1), n2 = len(words2)
  left = 0
  while left < n1 and words1[left] == words2[left]: left++
  right = 0
  while right < n1-left and words1[n1-1-right] == words2[n2-1-right]: right++
  return left + right >= n1`,

    python: `def areSentencesSimilar(s1: str, s2: str) -> bool:
    w1, w2 = s1.split(), s2.split()
    if len(w1) > len(w2):
        w1, w2 = w2, w1
    n1, n2 = len(w1), len(w2)
    left = 0
    while left < n1 and w1[left] == w2[left]:
        left += 1
    right = 0
    while right < n1 - left and w1[n1-1-right] == w2[n2-1-right]:
        right += 1
    return left + right >= n1`,

    javascript: `function areSentencesSimilar(s1, s2) {
  let w1 = s1.split(' '), w2 = s2.split(' ');
  if (w1.length > w2.length) [w1, w2] = [w2, w1];
  const n1 = w1.length, n2 = w2.length;
  let left = 0;
  while (left < n1 && w1[left] === w2[left]) left++;
  let right = 0;
  while (right < n1 - left && w1[n1-1-right] === w2[n2-1-right]) right++;
  return left + right >= n1;
}`,

    java: `public boolean areSentencesSimilar(String s1, String s2) {
    String[] w1 = s1.split(" "), w2 = s2.split(" ");
    if (w1.length > w2.length) { String[] tmp = w1; w1 = w2; w2 = tmp; }
    int n1 = w1.length, n2 = w2.length, left = 0, right = 0;
    while (left < n1 && w1[left].equals(w2[left])) left++;
    while (right < n1 - left && w1[n1-1-right].equals(w2[n2-1-right])) right++;
    return left + right >= n1;
}`,
  },

  defaultInput: {
    s1: 'My name is Haley',
    s2: 'My Haley',
  },

  inputFields: [
    {
      name: 's1',
      label: 'Sentence 1',
      type: 'string',
      defaultValue: 'My name is Haley',
      placeholder: 'My name is Haley',
      helperText: 'First sentence',
    },
    {
      name: 's2',
      label: 'Sentence 2',
      type: 'string',
      defaultValue: 'My Haley',
      placeholder: 'My Haley',
      helperText: 'Second sentence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const s2 = input.s2 as string;
    const steps: AlgorithmStep[] = [];

    let w1 = s1.split(' ');
    let w2 = s2.split(' ');
    if (w1.length > w2.length) {
      const tmp = w1;
      w1 = w2;
      w2 = tmp;
    }
    const n1 = w1.length;
    const n2 = w2.length;

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    const w1Indices = w1.map((_, i) => i);

    steps.push({
      line: 1,
      explanation: `Split sentences. shorter=["${w1.join('","')}"] (n1=${n1}), longer=["${w2.join('","')}"] (n2=${n2}). Match from left then from right.`,
      variables: { w1, w2, n1, n2 },
      visualization: makeViz(
        w1Indices,
        {},
        Object.fromEntries(w1.map((w, i) => [i, w]))
      ),
    });

    let left = 0;
    while (left < n1 && w1[left] === w2[left]) {
      steps.push({
        line: 5,
        explanation: `Left match: w1[${left}]="${w1[left]}" == w2[${left}]="${w2[left]}". Advance left to ${left + 1}.`,
        variables: { left, 'w1[left]': w1[left], 'w2[left]': w2[left] },
        visualization: makeViz(w1Indices, { [left]: 'found' }, { [left]: w1[left] }),
      });
      left++;
    }

    if (left < n1) {
      steps.push({
        line: 5,
        explanation: `Left pointer stopped at ${left}. w1[${left}]="${w1[left]}" != w2[${left}]="${w2[left]}".`,
        variables: { left },
        visualization: makeViz(w1Indices, { [left]: 'mismatch' }, { [left]: w1[left] }),
      });
    }

    let right = 0;
    while (right < n1 - left && w1[n1 - 1 - right] === w2[n2 - 1 - right]) {
      const ri = n1 - 1 - right;
      steps.push({
        line: 7,
        explanation: `Right match: w1[${ri}]="${w1[ri]}" == w2[${n2 - 1 - right}]="${w2[n2 - 1 - right]}". Advance right to ${right + 1}.`,
        variables: { right, 'w1[ri]': w1[ri], 'w2[rj]': w2[n2 - 1 - right] },
        visualization: makeViz(w1Indices, { [ri]: 'found' }, { [ri]: w1[ri] }),
      });
      right++;
    }

    const result = left + right >= n1;
    steps.push({
      line: 8,
      explanation: `left=${left}, right=${right}, n1=${n1}. left+right=${left + right} ${result ? '>=' : '<'} n1. Sentences are ${result ? 'similar' : 'not similar'}.`,
      variables: { left, right, n1, result },
      visualization: makeViz(
        w1Indices,
        Object.fromEntries(w1.map((_, i) => [i, i < left || i >= n1 - right ? 'found' : 'mismatch'])),
        Object.fromEntries(w1.map((w, i) => [i, w]))
      ),
    });

    return steps;
  },
};

export default sentenceSimilarity;
