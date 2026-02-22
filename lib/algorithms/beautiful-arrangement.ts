import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const beautifulArrangement: AlgorithmDefinition = {
  id: 'beautiful-arrangement',
  title: 'Beautiful Arrangement',
  leetcodeNumber: 526,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given n, count the number of beautiful arrangements of integers 1 to n. A beautiful arrangement satisfies: for each position i (1-indexed), either the value at position i is divisible by i, or i is divisible by the value. Uses backtracking to place numbers while checking the beautiful condition.',
  tags: ['backtracking', 'array', 'recursion', 'permutation', 'counting'],

  code: {
    pseudocode: `function countArrangement(n):
  count = 0
  visited = array of false, length n+1
  backtrack(1, n, visited)
  return count

function backtrack(pos, n, visited):
  if pos > n:
    count++
    return
  for num from 1 to n:
    if not visited[num] and (num % pos == 0 or pos % num == 0):
      visited[num] = true
      backtrack(pos+1, n, visited)
      visited[num] = false`,

    python: `def countArrangement(n: int) -> int:
    count = [0]
    visited = [False] * (n + 1)
    def backtrack(pos):
        if pos > n:
            count[0] += 1
            return
        for num in range(1, n + 1):
            if not visited[num] and (num % pos == 0 or pos % num == 0):
                visited[num] = True
                backtrack(pos + 1)
                visited[num] = False
    backtrack(1)
    return count[0]`,

    javascript: `function countArrangement(n) {
  let count = 0;
  const visited = new Array(n + 1).fill(false);
  function backtrack(pos) {
    if (pos > n) { count++; return; }
    for (let num = 1; num <= n; num++) {
      if (!visited[num] && (num % pos === 0 || pos % num === 0)) {
        visited[num] = true;
        backtrack(pos + 1);
        visited[num] = false;
      }
    }
  }
  backtrack(1);
  return count;
}`,

    java: `public int countArrangement(int n) {
    boolean[] visited = new boolean[n + 1];
    return backtrack(1, n, visited);
}
private int backtrack(int pos, int n, boolean[] visited) {
    if (pos > n) return 1;
    int count = 0;
    for (int num = 1; num <= n; num++) {
        if (!visited[num] && (num % pos == 0 || pos % num == 0)) {
            visited[num] = true;
            count += backtrack(pos + 1, n, visited);
            visited[num] = false;
        }
    }
    return count;
}`,
  },

  defaultInput: {
    n: 4,
  },

  inputFields: [
    {
      name: 'n',
      label: 'N (1 to N)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Count beautiful arrangements using integers 1 to N',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    let count = 0;
    const visited = new Array(n + 1).fill(false);
    const arrangement: number[] = new Array(n).fill(0);

    steps.push({
      line: 1,
      explanation: `Counting beautiful arrangements for n=${n}. A position i is beautiful if value[i] % i == 0 or i % value[i] == 0.`,
      variables: { n, count: 0 },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i + 1),
        highlights: {},
        labels: Array.from({ length: n }, (_, i) => i).reduce(
          (acc, i) => ({ ...acc, [i]: `pos ${i + 1}` }),
          {} as Record<number, string>
        ),
      },
    });

    function backtrack(pos: number) {
      if (pos > n) {
        count++;
        steps.push({
          line: 8,
          explanation: `Valid arrangement found: [${arrangement.join(', ')}]. Total count: ${count}.`,
          variables: { arrangement: [...arrangement], count },
          visualization: {
            type: 'array',
            array: [...arrangement],
            highlights: arrangement.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
            labels: arrangement.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {} as Record<number, string>),
          },
        });
        return;
      }

      for (let num = 1; num <= n; num++) {
        if (!visited[num] && (num % pos === 0 || pos % num === 0)) {
          visited[num] = true;
          arrangement[pos - 1] = num;

          steps.push({
            line: 11,
            explanation: `Position ${pos}: placing ${num}. Check: ${num}%${pos}=${num % pos} or ${pos}%${num}=${pos % num}. Beautiful condition met!`,
            variables: { position: pos, number: num, arrangement: [...arrangement], count },
            visualization: {
              type: 'array',
              array: [...arrangement],
              highlights: { [pos - 1]: 'active' },
              labels: arrangement.reduce((acc, v, i) => ({ ...acc, [i]: v ? `${v}` : '?' }), {} as Record<number, string>),
            },
          });

          backtrack(pos + 1);
          visited[num] = false;
          arrangement[pos - 1] = 0;
        } else if (!visited[num]) {
          steps.push({
            line: 12,
            explanation: `Position ${pos}: cannot place ${num}. ${num}%${pos}=${num % pos} and ${pos}%${num}=${pos % num}. Neither is 0, skip.`,
            variables: { position: pos, number: num, skipped: true },
            visualization: {
              type: 'array',
              array: [...arrangement],
              highlights: { [pos - 1]: 'mismatch' },
              labels: {},
            },
          });
        }
      }
    }

    backtrack(1);

    steps.push({
      line: 5,
      explanation: `Backtracking complete. Found ${count} beautiful arrangements for n=${n}.`,
      variables: { n, totalArrangements: count },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i + 1),
        highlights: Array.from({ length: n }, (_, i) => i).reduce(
          (acc, i) => ({ ...acc, [i]: 'sorted' }),
          {}
        ),
        labels: { 0: `${count} arrangements` },
      },
    });

    return steps;
  },
};

export default beautifulArrangement;
