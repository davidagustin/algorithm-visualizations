import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const nextGreaterElementIII: AlgorithmDefinition = {
  id: 'next-greater-element-iii',
  title: 'Next Greater Element III',
  leetcodeNumber: 556,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a positive 32-bit integer n, find the smallest integer that is greater than n and has exactly the same digits. Use a monotonic stack approach on the digit array: find the rightmost digit that can be swapped with a larger digit to its right.',
  tags: ['Stack', 'Monotonic Stack', 'Math', 'String'],
  code: {
    pseudocode: `function nextGreaterElement(n):
  digits = split n into digit array
  i = len(digits) - 2
  while i >= 0 and digits[i] >= digits[i+1]:
    i -= 1
  if i < 0: return -1   // already largest
  j = len(digits) - 1
  while digits[j] <= digits[i]:
    j -= 1
  swap digits[i] and digits[j]
  reverse digits[i+1:]
  result = join digits
  return result if fits 32-bit else -1`,
    python: `def nextGreaterElement(n: int) -> int:
    digits = list(str(n))
    i = len(digits) - 2
    while i >= 0 and digits[i] >= digits[i+1]:
        i -= 1
    if i < 0:
        return -1
    j = len(digits) - 1
    while digits[j] <= digits[i]:
        j -= 1
    digits[i], digits[j] = digits[j], digits[i]
    digits[i+1:] = digits[i+1:][::-1]
    result = int(''.join(digits))
    return result if result <= 2**31 - 1 else -1`,
    javascript: `function nextGreaterElement(n) {
  const digits = String(n).split('');
  let i = digits.length - 2;
  while (i >= 0 && digits[i] >= digits[i+1]) i--;
  if (i < 0) return -1;
  let j = digits.length - 1;
  while (digits[j] <= digits[i]) j--;
  [digits[i], digits[j]] = [digits[j], digits[i]];
  const suffix = digits.splice(i+1).reverse();
  digits.push(...suffix);
  const result = parseInt(digits.join(''));
  return result <= 2**31 - 1 ? result : -1;
}`,
    java: `public int nextGreaterElement(int n) {
    char[] d = String.valueOf(n).toCharArray();
    int i = d.length - 2;
    while (i >= 0 && d[i] >= d[i+1]) i--;
    if (i < 0) return -1;
    int j = d.length - 1;
    while (d[j] <= d[i]) j--;
    char tmp = d[i]; d[i] = d[j]; d[j] = tmp;
    // reverse suffix
    int l = i+1, r = d.length-1;
    while (l < r) { tmp=d[l]; d[l]=d[r]; d[r]=tmp; l++; r--; }
    long result = Long.parseLong(new String(d));
    return result <= Integer.MAX_VALUE ? (int)result : -1;
}`,
  },
  defaultInput: { n: 12 },
  inputFields: [
    {
      name: 'n',
      label: 'Integer n',
      type: 'number',
      defaultValue: 12,
      placeholder: 'e.g. 12',
      helperText: 'Positive 32-bit integer',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const digits = String(n).split('');
    const stack: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: digits,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Convert n=${n} to digits: [${digits.join(', ')}]. Find pivot where digits[i] < digits[i+1].`,
      variables: { n, digits: [...digits] },
      visualization: makeViz(-1, 'idle'),
    });

    let i = digits.length - 2;
    while (i >= 0 && digits[i] >= digits[i + 1]) {
      stack.push(`d[${i}]=${digits[i]}`);
      steps.push({
        line: 3,
        explanation: `digits[${i}]=${digits[i]} >= digits[${i + 1}]=${digits[i + 1]}, not a pivot. Move left.`,
        variables: { i, 'digits[i]': digits[i] },
        visualization: makeViz(i, 'push'),
      });
      i--;
    }

    if (i < 0) {
      steps.push({
        line: 5,
        explanation: `No pivot found. Digits are in descending order. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz(0, 'mismatch'),
      });
      return steps;
    }

    stack.push(`pivot:d[${i}]=${digits[i]}`);
    steps.push({
      line: 6,
      explanation: `Pivot found at i=${i}: digits[${i}]=${digits[i]} < digits[${i + 1}]=${digits[i + 1]}.`,
      variables: { pivotIndex: i, pivotValue: digits[i] },
      visualization: makeViz(i, 'match'),
    });

    let j = digits.length - 1;
    while (digits[j] <= digits[i]) j--;

    steps.push({
      line: 8,
      explanation: `Find smallest digit > digits[${i}]=${digits[i]} from right. Found digits[${j}]=${digits[j]} at j=${j}.`,
      variables: { j, 'digits[j]': digits[j] },
      visualization: makeViz(j, 'idle'),
    });

    const tmp = digits[i];
    digits[i] = digits[j];
    digits[j] = tmp;
    stack.push(`swap:d[${i}]<->d[${j}]`);

    steps.push({
      line: 9,
      explanation: `Swap digits[${i}]=${digits[i]} and digits[${j}]=${digits[j]}. Digits now: [${digits.join(', ')}].`,
      variables: { i, j, digits: [...digits] },
      visualization: makeViz(i, 'pop'),
    });

    const suffix = digits.splice(i + 1).reverse();
    digits.push(...suffix);

    steps.push({
      line: 10,
      explanation: `Reverse suffix from index ${i + 1}. Final digits: [${digits.join(', ')}].`,
      variables: { digits: [...digits] },
      visualization: makeViz(i + 1, 'match'),
    });

    const result = parseInt(digits.join(''));
    const ans = result <= 2147483647 ? result : -1;

    steps.push({
      line: 11,
      explanation: `Result = ${result}. ${ans === -1 ? 'Exceeds 32-bit int limit. Return -1.' : `Fits in 32-bit. Return ${ans}.`}`,
      variables: { result: ans },
      visualization: makeViz(digits.length - 1, ans === -1 ? 'mismatch' : 'match'),
    });

    return steps;
  },
};

export default nextGreaterElementIII;
