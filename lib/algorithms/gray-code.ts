import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const grayCode: AlgorithmDefinition = {
  id: 'gray-code',
  title: 'Gray Code',
  leetcodeNumber: 89,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'An n-bit Gray code sequence is a sequence of 2^n integers where each successive pair differs by exactly one bit. Given n, return any valid n-bit Gray code sequence starting from 0. The mathematical formula is: Gray(i) = i XOR (i >> 1), generating the sequence directly.',
  tags: ['backtracking', 'bit manipulation', 'math', 'sequence', 'xor'],

  code: {
    pseudocode: `function grayCode(n):
  result = []
  for i from 0 to 2^n - 1:
    gray = i XOR (i >> 1)
    result.push(gray)
  return result

Alternative backtracking approach:
function grayBacktrack(n):
  result = [0]
  visited = {0}
  backtrack(0, n, result, visited)

function backtrack(current, n, result, visited):
  if length(result) == 2^n: return true
  for bit from 0 to n-1:
    next = current XOR (1 << bit)
    if next not in visited:
      visited.add(next)
      result.push(next)
      if backtrack(next, n, result, visited): return true
      result.pop()
      visited.remove(next)
  return false`,

    python: `def grayCode(n: int) -> list[int]:
    # Formula approach: O(2^n)
    return [i ^ (i >> 1) for i in range(1 << n)]

# Backtracking approach
def grayCodeBacktrack(n: int) -> list[int]:
    result = [0]
    visited = {0}
    target = 1 << n
    def backtrack(current):
        if len(result) == target:
            return True
        for bit in range(n):
            nxt = current ^ (1 << bit)
            if nxt not in visited:
                visited.add(nxt)
                result.append(nxt)
                if backtrack(nxt):
                    return True
                result.pop()
                visited.remove(nxt)
        return False
    backtrack(0)
    return result`,

    javascript: `function grayCode(n) {
  // Formula: i XOR (i >> 1)
  const result = [];
  for (let i = 0; i < (1 << n); i++) {
    result.push(i ^ (i >> 1));
  }
  return result;
}

// Backtracking approach
function grayCodeBT(n) {
  const result = [0], visited = new Set([0]);
  const target = 1 << n;
  function backtrack(current) {
    if (result.length === target) return true;
    for (let bit = 0; bit < n; bit++) {
      const next = current ^ (1 << bit);
      if (!visited.has(next)) {
        visited.add(next); result.push(next);
        if (backtrack(next)) return true;
        result.pop(); visited.delete(next);
      }
    }
    return false;
  }
  backtrack(0);
  return result;
}`,

    java: `public List<Integer> grayCode(int n) {
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < (1 << n); i++) {
        result.add(i ^ (i >> 1));
    }
    return result;
}`,
  },

  defaultInput: {
    n: 3,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Bits (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of bits in Gray code sequence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const result: number[] = [0];
    const visited = new Set<number>([0]);
    const target = 1 << n;

    steps.push({
      line: 1,
      explanation: `Generating ${n}-bit Gray code sequence. Need ${target} numbers where consecutive ones differ by exactly 1 bit. Starting at 0.`,
      variables: { n, totalNumbers: target, start: 0 },
      visualization: {
        type: 'array',
        array: [0],
        highlights: { 0: 'active' },
        labels: { 0: '0' },
      },
    });

    function backtrack(current: number): boolean {
      if (result.length === target) return true;

      for (let bit = 0; bit < n; bit++) {
        const next = current ^ (1 << bit);
        if (!visited.has(next)) {
          visited.add(next);
          result.push(next);

          const binaryNext = next.toString(2).padStart(n, '0');
          const binaryCurrent = current.toString(2).padStart(n, '0');

          steps.push({
            line: 14,
            explanation: `Step ${result.length}: ${current}(${binaryCurrent}) -> flip bit ${bit} -> ${next}(${binaryNext}). Differs by 1 bit.`,
            variables: { previous: current, current: next, flippedBit: bit, binary: binaryNext, step: result.length },
            visualization: {
              type: 'array',
              array: [...result],
              highlights: { [result.length - 1]: 'active' },
              labels: result.reduce((acc, v, i) => ({ ...acc, [i]: v.toString(2).padStart(n, '0') }), {} as Record<number, string>),
            },
          });

          if (backtrack(next)) return true;
          result.pop();
          visited.delete(next);
        }
      }
      return false;
    }

    backtrack(0);

    steps.push({
      line: 6,
      explanation: `Gray code sequence complete! Generated ${result.length} numbers. Each consecutive pair differs by exactly 1 bit.`,
      variables: { sequence: result, n, total: result.length },
      visualization: {
        type: 'array',
        array: result,
        highlights: result.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        labels: result.reduce((acc, v, i) => ({ ...acc, [i]: v.toString(2).padStart(n, '0') }), {} as Record<number, string>),
      },
    });

    return steps;
  },
};

export default grayCode;
