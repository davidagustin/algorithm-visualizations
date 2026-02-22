import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findSmallestLetterGreaterThanTarget: AlgorithmDefinition = {
  id: 'find-smallest-letter-greater-than-target',
  title: 'Find Smallest Letter Greater Than Target',
  leetcodeNumber: 744,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'Given a sorted array of lowercase English letters and a target letter, find the smallest letter in the array that is greater than the target. The letters wrap around, so if no letter is greater, return the first letter in the array.',
  tags: ['binary search', 'array', 'string'],

  code: {
    pseudocode: `function nextGreatestLetter(letters, target):
  left = 0
  right = length(letters)
  while left < right:
    mid = (left + right) / 2
    if letters[mid] <= target:
      left = mid + 1
    else:
      right = mid
  return letters[left % length(letters)]`,

    python: `def nextGreatestLetter(letters: list[str], target: str) -> str:
    left, right = 0, len(letters)
    while left < right:
        mid = (left + right) // 2
        if letters[mid] <= target:
            left = mid + 1
        else:
            right = mid
    return letters[left % len(letters)]`,

    javascript: `function nextGreatestLetter(letters, target) {
  let left = 0, right = letters.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (letters[mid] <= target) left = mid + 1;
    else right = mid;
  }
  return letters[left % letters.length];
}`,

    java: `public char nextGreatestLetter(char[] letters, char target) {
    int left = 0, right = letters.length;
    while (left < right) {
        int mid = (left + right) / 2;
        if (letters[mid] <= target) left = mid + 1;
        else right = mid;
    }
    return letters[left % letters.length];
}`,
  },

  defaultInput: {
    letters: ['c', 'f', 'j'],
    target: 'c',
  },

  inputFields: [
    {
      name: 'letters',
      label: 'Sorted Letters',
      type: 'array',
      defaultValue: ['c', 'f', 'j'],
      placeholder: 'c,f,j',
      helperText: 'Comma-separated sorted lowercase letters',
    },
    {
      name: 'target',
      label: 'Target Letter',
      type: 'string',
      defaultValue: 'c',
      placeholder: 'c',
      helperText: 'Target letter to find the next greatest from',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const letters = input.letters as string[];
    const target = input.target as string;
    const steps: AlgorithmStep[] = [];

    const charCodes = letters.map(l => l.charCodeAt(0) - 96);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: charCodes,
      highlights,
      labels,
    });

    let left = 0;
    let right = letters.length;

    steps.push({
      line: 1,
      explanation: `Find smallest letter greater than "${target}" in [${letters.join(', ')}]. left=0, right=${right}.`,
      variables: { left, right, target },
      visualization: makeViz(
        { 0: 'pointer', [letters.length - 1]: 'pointer' },
        { 0: 'L', [letters.length - 1]: 'R' }
      ),
    });

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        line: 4,
        explanation: `mid=${mid}, letters[${mid}]="${letters[mid]}". Compare with target="${target}".`,
        variables: { left, right, mid, 'letters[mid]': letters[mid], target },
        visualization: makeViz(
          { [left]: 'active', [Math.min(right, letters.length) - 1]: 'active', [mid]: 'comparing' },
          { [left]: 'L', [Math.min(right, letters.length) - 1]: 'R', [mid]: `"${letters[mid]}"` }
        ),
      });

      if (letters[mid] <= target) {
        steps.push({
          line: 6,
          explanation: `"${letters[mid]}" <= "${target}". Not large enough. Move left to ${mid + 1}.`,
          variables: { left, right, mid },
          visualization: makeViz(
            { [mid]: 'mismatch' },
            { [mid]: 'too small' }
          ),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 8,
          explanation: `"${letters[mid]}" > "${target}". Possible answer. Move right to ${mid}.`,
          variables: { left, right, mid },
          visualization: makeViz(
            { [mid]: 'active' },
            { [mid]: 'candidate' }
          ),
        });
        right = mid;
      }
    }

    const resultIdx = left % letters.length;
    steps.push({
      line: 9,
      explanation: `Result index = ${left} % ${letters.length} = ${resultIdx}. Answer is "${letters[resultIdx]}".`,
      variables: { left, resultIdx, result: letters[resultIdx] },
      visualization: makeViz(
        { [resultIdx]: 'found' },
        { [resultIdx]: `ans="${letters[resultIdx]}"` }
      ),
    });

    return steps;
  },
};

export default findSmallestLetterGreaterThanTarget;
