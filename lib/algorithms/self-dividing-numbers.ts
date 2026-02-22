import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const selfDividingNumbers: AlgorithmDefinition = {
  id: 'self-dividing-numbers',
  title: 'Self Dividing Numbers',
  leetcodeNumber: 728,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'A self-dividing number is one that is divisible by every digit it contains. It cannot contain the digit 0. Given a range [left, right], return all self-dividing numbers in that range. Check each digit of each number for divisibility.',
  tags: ['math', 'enumeration'],

  code: {
    pseudocode: `function selfDividingNumbers(left, right):
  result = []
  for n from left to right:
    if isSelfDividing(n):
      result.append(n)
  return result

function isSelfDividing(n):
  for digit in digits(n):
    if digit == 0 or n % digit != 0:
      return false
  return true`,

    python: `def selfDividingNumbers(left, right):
    def ok(n):
        for d in str(n):
            if d == '0' or n % int(d) != 0:
                return False
        return True
    return [n for n in range(left, right+1) if ok(n)]`,

    javascript: `function selfDividingNumbers(left, right) {
  const isSelf = n => String(n).split('').every(d => d !== '0' && n % +d === 0);
  const result = [];
  for (let n = left; n <= right; n++) if (isSelf(n)) result.push(n);
  return result;
}`,

    java: `public List<Integer> selfDividingNumbers(int left, int right) {
    List<Integer> result = new ArrayList<>();
    for (int n = left; n <= right; n++) {
        boolean ok = true;
        for (char c : String.valueOf(n).toCharArray()) {
            int d = c - '0';
            if (d == 0 || n % d != 0) { ok = false; break; }
        }
        if (ok) result.add(n);
    }
    return result;
}`,
  },

  defaultInput: {
    left: 1,
    right: 22,
  },

  inputFields: [
    {
      name: 'left',
      label: 'Left Bound',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Start of range (inclusive)',
    },
    {
      name: 'right',
      label: 'Right Bound',
      type: 'number',
      defaultValue: 22,
      placeholder: '22',
      helperText: 'End of range (inclusive)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const left = input.left as number;
    const right = input.right as number;
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];
    const range = Array.from({ length: right - left + 1 }, (_, i) => left + i);

    steps.push({
      line: 1,
      explanation: `Find all self-dividing numbers from ${left} to ${right}. A self-dividing number is divisible by each of its non-zero digits.`,
      variables: { left, right },
      visualization: {
        type: 'array',
        array: range,
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let n = left; n <= right; n++) {
      const digits = String(n).split('').map(Number);
      const hasZero = digits.includes(0);
      const failures = digits.filter(d => d === 0 || n % d !== 0);
      const selfDividing = !hasZero && failures.length === 0;

      if (selfDividing) result.push(n);

      steps.push({
        line: 3,
        explanation: `n = ${n}. Digits: [${digits.join(', ')}]. ${selfDividing ? 'All digits divide n evenly. Self-dividing!' : hasZero ? 'Contains digit 0. Not self-dividing.' : `Digit(s) ${failures.join(', ')} do not divide ${n}. Not self-dividing.`}`,
        variables: { n, digits, selfDividing, resultSoFar: [...result] },
        visualization: {
          type: 'array',
          array: range,
          highlights: Object.fromEntries(range.map((v, i) => [i, v === n ? 'active' : result.includes(v) ? 'found' : 'default'])),
          labels: Object.fromEntries(range.map((v, i) => [i, result.includes(v) ? String(v) : ''])),
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 4,
      explanation: `Done. Self-dividing numbers in [${left}, ${right}]: [${result.join(', ')}]. Count = ${result.length}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((v, i) => [i, String(v)])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default selfDividingNumbers;
