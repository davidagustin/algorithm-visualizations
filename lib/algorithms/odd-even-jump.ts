import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const oddEvenJump: AlgorithmDefinition = {
  id: 'odd-even-jump',
  title: 'Odd Even Jump',
  leetcodeNumber: 975,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'From each index you can make odd-numbered jumps (to the next greater or equal value) or even-numbered jumps (to the next smaller or equal value). Starting at each index, can you reach the end? Uses a monotonic stack + sorted index maps to find valid next jumps.',
  tags: ['Stack', 'Monotonic Stack', 'Dynamic Programming', 'Hard'],
  code: {
    pseudocode: `function oddEvenJumps(arr):
  n = len(arr)
  odd[n-1] = even[n-1] = true
  // Build sorted index for odd jumps (next >= current)
  sorted_idx = indices sorted by value asc, tie-break by index asc
  oddNext = monotone_stack_next(sorted_idx)
  // Build sorted index for even jumps (next <= current)
  sorted_idx2 = indices sorted by value desc, tie-break by index asc
  evenNext = monotone_stack_next(sorted_idx2)
  for i from n-2 down to 0:
    odd[i] = even[oddNext[i]] if oddNext[i] exists
    even[i] = odd[evenNext[i]] if evenNext[i] exists
  return count of true values in odd[]`,
    python: `def oddEvenJumps(arr):
    n = len(arr)
    def make_next(sorted_idx):
        result = [None]*n
        stack = []
        for i in sorted_idx:
            while stack and stack[-1] < i:
                result[stack.pop()] = i
            stack.append(i)
        return result
    sorted_asc = sorted(range(n), key=lambda i: (arr[i], i))
    sorted_desc = sorted(range(n), key=lambda i: (-arr[i], i))
    odd_next = make_next(sorted_asc)
    even_next = make_next(sorted_desc)
    odd = [False]*n; even = [False]*n
    odd[n-1] = even[n-1] = True
    for i in range(n-2, -1, -1):
        if odd_next[i] is not None: odd[i] = even[odd_next[i]]
        if even_next[i] is not None: even[i] = odd[even_next[i]]
    return sum(odd)`,
    javascript: `function oddEvenJumps(arr) {
  const n = arr.length;
  const makeNext = sorted => {
    const result = new Array(n).fill(-1);
    const stack = [];
    for (const i of sorted) {
      while (stack.length && stack[stack.length-1] < i)
        result[stack.pop()] = i;
      stack.push(i);
    }
    return result;
  };
  const sortedAsc = [...Array(n).keys()].sort((a,b) => arr[a]-arr[b] || a-b);
  const sortedDesc = [...Array(n).keys()].sort((a,b) => arr[b]-arr[a] || a-b);
  const oddNext = makeNext(sortedAsc);
  const evenNext = makeNext(sortedDesc);
  const odd = new Array(n).fill(false);
  const even = new Array(n).fill(false);
  odd[n-1] = even[n-1] = true;
  for (let i = n-2; i >= 0; i--) {
    if (oddNext[i] !== -1) odd[i] = even[oddNext[i]];
    if (evenNext[i] !== -1) even[i] = odd[evenNext[i]];
  }
  return odd.filter(Boolean).length;
}`,
    java: `public int oddEvenJumps(int[] arr) {
    int n = arr.length;
    int[] oddNext = next(IntStream.range(0,n).boxed()
        .sorted((a,b)->arr[a]!=arr[b]?arr[a]-arr[b]:a-b).collect(toList()), n);
    int[] evenNext = next(IntStream.range(0,n).boxed()
        .sorted((a,b)->arr[a]!=arr[b]?arr[b]-arr[a]:a-b).collect(toList()), n);
    boolean[] odd = new boolean[n], even = new boolean[n];
    odd[n-1] = even[n-1] = true;
    for (int i = n-2; i >= 0; i--) {
        if (oddNext[i] != -1) odd[i] = even[oddNext[i]];
        if (evenNext[i] != -1) even[i] = odd[evenNext[i]];
    }
    int count = 0;
    for (boolean b : odd) if (b) count++;
    return count;
}`,
  },
  defaultInput: { arr: [10, 13, 12, 14, 15] },
  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [10, 13, 12, 14, 15],
      placeholder: 'e.g. 10,13,12,14,15',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = (input.arr as number[]).slice();
    const n = arr.length;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: arr.map(v => String(v)),
      currentIndex: i,
      action,
    });

    // Helper to build next array via monotonic stack
    const makeNext = (sorted: number[]): number[] => {
      const result: number[] = new Array(n).fill(-1);
      const st: number[] = [];
      for (const i of sorted) {
        while (st.length > 0 && st[st.length - 1] < i) {
          result[st.pop()!] = i;
        }
        st.push(i);
      }
      return result;
    };

    const sortedAsc = [...Array(n).keys()].sort((a, b) => arr[a] !== arr[b] ? arr[a] - arr[b] : a - b);
    const sortedDesc = [...Array(n).keys()].sort((a, b) => arr[a] !== arr[b] ? arr[b] - arr[a] : a - b);

    steps.push({
      line: 1,
      explanation: `arr=[${arr.join(', ')}]. Sort indices for odd jumps (asc by value): [${sortedAsc.join(', ')}].`,
      variables: { sortedAsc: [...sortedAsc] },
      visualization: makeViz(-1, 'idle'),
    });

    const oddNext = makeNext(sortedAsc);
    stack.push('odd-next built');

    steps.push({
      line: 5,
      explanation: `Use monotonic stack on sorted-asc to find each index's "next greater or equal" target. oddNext=[${oddNext.join(', ')}].`,
      variables: { oddNext: [...oddNext] },
      visualization: makeViz(-1, 'push'),
    });

    const evenNext = makeNext(sortedDesc);
    stack.push('even-next built');

    steps.push({
      line: 7,
      explanation: `Sort indices desc by value, build evenNext. evenNext=[${evenNext.join(', ')}].`,
      variables: { evenNext: [...evenNext] },
      visualization: makeViz(-1, 'push'),
    });

    const odd: boolean[] = new Array(n).fill(false);
    const even: boolean[] = new Array(n).fill(false);
    odd[n - 1] = even[n - 1] = true;

    steps.push({
      line: 9,
      explanation: `Base case: index ${n - 1} is always reachable. odd[${n - 1}]=even[${n - 1}]=true.`,
      variables: { odd: [...odd], even: [...even] },
      visualization: makeViz(n - 1, 'match'),
    });

    for (let i = n - 2; i >= 0; i--) {
      if (oddNext[i] !== -1) odd[i] = even[oddNext[i]];
      if (evenNext[i] !== -1) even[i] = odd[evenNext[i]];

      steps.push({
        line: 11,
        explanation: `i=${i}: odd[${i}]=${odd[i]} (via evenNext=${evenNext[i]}), even[${i}]=${even[i]} (via oddNext=${oddNext[i]}).`,
        variables: { i, 'odd[i]': odd[i], 'even[i]': even[i] },
        visualization: makeViz(i, odd[i] ? 'match' : 'mismatch'),
      });
    }

    const result = odd.filter(Boolean).length;

    steps.push({
      line: 13,
      explanation: `Done. Indices reachable via odd-first jump: ${result}. odd=[${odd.map(b => b ? 'T' : 'F').join(',')}].`,
      variables: { result, odd: [...odd] },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default oddEvenJump;
