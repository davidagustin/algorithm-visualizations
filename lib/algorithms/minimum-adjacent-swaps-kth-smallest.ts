import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumAdjacentSwapsKthSmallest: AlgorithmDefinition = {
  id: 'minimum-adjacent-swaps-kth-smallest',
  title: 'Minimum Adjacent Swaps to Reach the Kth Smallest Number',
  leetcodeNumber: 1850,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given a number string and integer k, find the minimum adjacent swaps needed to reach the kth smallest numeric permutation greater than the current number. Step 1: find the kth next permutation greedily. Step 2: count adjacent swaps to transform the original into the target digit sequence.',
  tags: ['greedy', 'string', 'permutation', 'two pointers'],

  code: {
    pseudocode: `function getMinSwaps(num, k):
  original = num as array
  target = next_permutation k times
  swaps = 0
  for i from 0 to n-1:
    j = i
    while original[j] != target[i]: j++
    while j > i:
      swap(original[j], original[j-1])
      j--; swaps++
  return swaps`,

    python: `from itertools import permutations

def getMinSwaps(num: str, k: int) -> int:
    def next_perm(arr):
        n = len(arr)
        i = n - 2
        while i >= 0 and arr[i] >= arr[i + 1]: i -= 1
        if i < 0: return
        j = n - 1
        while arr[j] <= arr[i]: j -= 1
        arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1:] = arr[i + 1:][::-1]
    target = list(num)
    for _ in range(k):
        next_perm(target)
    original = list(num)
    swaps = 0
    for i in range(len(original)):
        j = i
        while original[j] != target[i]: j += 1
        while j > i:
            original[j], original[j-1] = original[j-1], original[j]
            j -= 1; swaps += 1
    return swaps`,

    javascript: `function getMinSwaps(num, k) {
  function nextPerm(arr) {
    let i = arr.length - 2;
    while (i >= 0 && arr[i] >= arr[i + 1]) i--;
    if (i < 0) return;
    let j = arr.length - 1;
    while (arr[j] <= arr[i]) j--;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    let l = i + 1, r = arr.length - 1;
    while (l < r) { [arr[l], arr[r]] = [arr[r], arr[l]]; l++; r--; }
  }
  const target = num.split('');
  for (let i = 0; i < k; i++) nextPerm(target);
  const original = num.split('');
  let swaps = 0;
  for (let i = 0; i < original.length; i++) {
    let j = i;
    while (original[j] !== target[i]) j++;
    while (j > i) { [original[j], original[j-1]] = [original[j-1], original[j]]; j--; swaps++; }
  }
  return swaps;
}`,

    java: `public int getMinSwaps(String num, int k) {
    char[] target = num.toCharArray();
    for (int t = 0; t < k; t++) {
        int i = target.length - 2;
        while (i >= 0 && target[i] >= target[i+1]) i--;
        int j = target.length - 1;
        while (target[j] <= target[i]) j--;
        char tmp = target[i]; target[i] = target[j]; target[j] = tmp;
        int l = i+1, r = target.length-1;
        while (l < r) { tmp = target[l]; target[l] = target[r]; target[r] = tmp; l++; r--; }
    }
    char[] original = num.toCharArray();
    int swaps = 0;
    for (int i = 0; i < original.length; i++) {
        int j = i;
        while (original[j] != target[i]) j++;
        while (j > i) { char t = original[j]; original[j] = original[j-1]; original[j-1] = t; j--; swaps++; }
    }
    return swaps;
}`,
  },

  defaultInput: {
    num: '5489355142',
    k: 4,
  },

  inputFields: [
    {
      name: 'num',
      label: 'Number String',
      type: 'string',
      defaultValue: '5489355142',
      placeholder: '5489355142',
      helperText: 'A number represented as a string',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Find the kth next permutation',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num = input.num as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    function nextPerm(arr: string[]): void {
      let i = arr.length - 2;
      while (i >= 0 && arr[i] >= arr[i + 1]) i--;
      if (i < 0) return;
      let j = arr.length - 1;
      while (arr[j] <= arr[i]) j--;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      let l = i + 1;
      let r = arr.length - 1;
      while (l < r) {
        [arr[l], arr[r]] = [arr[r], arr[l]];
        l++;
        r--;
      }
    }

    const target = num.split('');
    const original = num.split('');

    steps.push({
      line: 1,
      explanation: `Start with number "${num}". Find the ${k}th next permutation, then count swaps to reach it.`,
      variables: { num, k },
      visualization: {
        type: 'array',
        array: num.split('').map(Number),
        highlights: {},
        labels: Object.fromEntries(num.split('').map((c, i) => [i, c])) as Record<number, string>,
      },
    });

    for (let t = 0; t < k; t++) {
      nextPerm(target);
      steps.push({
        line: 3,
        explanation: `Next permutation ${t + 1}: "${target.join('')}".`,
        variables: { step: t + 1, target: target.join('') },
        visualization: {
          type: 'array',
          array: target.map(Number),
          highlights: {},
          labels: Object.fromEntries(target.map((c, i) => [i, c])) as Record<number, string>,
        },
      });
    }

    steps.push({
      line: 4,
      explanation: `Target permutation after ${k} steps: "${target.join('')}". Now count adjacent swaps to transform original into target.`,
      variables: { original: original.join(''), target: target.join('') },
      visualization: {
        type: 'array',
        array: original.map(Number),
        highlights: {},
        labels: Object.fromEntries(original.map((c, i) => [i, c])) as Record<number, string>,
      },
    });

    let swaps = 0;
    const arr = [...original];

    for (let i = 0; i < arr.length; i++) {
      let j = i;
      while (arr[j] !== target[i]) j++;
      if (j !== i) {
        steps.push({
          line: 6,
          explanation: `Position ${i}: need "${target[i]}" but found it at index ${j}. Need ${j - i} swaps to bubble it left.`,
          variables: { i, j, needed: target[i], swaps },
          visualization: {
            type: 'array',
            array: arr.map(Number),
            highlights: { [i]: 'active', [j]: 'found' } as Record<number, string>,
            labels: { [i]: `need ${target[i]}`, [j]: `here` } as Record<number, string>,
          },
        });
      }
      while (j > i) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        j--;
        swaps++;
      }
    }

    steps.push({
      line: 8,
      explanation: `Minimum adjacent swaps needed: ${swaps}.`,
      variables: { result: swaps },
      visualization: {
        type: 'array',
        array: arr.map(Number),
        highlights: Object.fromEntries(arr.map((_, i) => [i, 'found'])) as Record<number, string>,
        labels: Object.fromEntries(arr.map((c, i) => [i, c])) as Record<number, string>,
      },
    });

    return steps;
  },
};

export default minimumAdjacentSwapsKthSmallest;
