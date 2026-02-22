import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const circularArrayLoop: AlgorithmDefinition = {
  id: 'circular-array-loop',
  title: 'Circular Array Loop',
  leetcodeNumber: 457,
  difficulty: 'Medium',
  category: 'Fast And Slow Pointers',
  description:
    'Given a circular array, determine if a cycle exists. A cycle must be in the same direction and have length > 1. Uses fast and slow pointers starting from each index.',
  tags: ['fast and slow pointers', 'circular array', 'cycle detection'],

  code: {
    pseudocode: `function circularArrayLoop(nums):
  n = len(nums)
  for i = 0 to n-1:
    slow = fast = i
    dir = sign(nums[i])
    do:
      slow = next(nums, slow, dir)
      fast = next(nums, next(nums, fast, dir), dir)
      if slow == -1 or fast == -1: break
    while slow != fast
    if slow != -1 and slow == fast: return true
  return false

function next(nums, idx, dir):
  if sign(nums[idx]) != dir: return -1
  nextIdx = (idx + nums[idx]) % n
  if nextIdx < 0: nextIdx += n
  if nextIdx == idx: return -1  // single-element cycle
  return nextIdx`,

    python: `def circularArrayLoop(nums: list[int]) -> bool:
    n = len(nums)
    def nxt(idx, direction):
        if (nums[idx] > 0) != direction: return -1
        ni = (idx + nums[idx]) % n
        if ni < 0: ni += n
        if ni == idx: return -1
        return ni
    for i in range(n):
        direction = nums[i] > 0
        slow = fast = i
        while True:
            slow = nxt(slow, direction)
            fast = nxt(fast, direction)
            if fast != -1: fast = nxt(fast, direction)
            if slow == -1 or fast == -1 or slow == fast: break
        if slow != -1 and slow == fast:
            return True
    return False`,

    javascript: `function circularArrayLoop(nums) {
  const n = nums.length;
  const next = (idx, dir) => {
    if ((nums[idx] > 0) !== dir) return -1;
    let ni = (idx + nums[idx]) % n;
    if (ni < 0) ni += n;
    return ni === idx ? -1 : ni;
  };
  for (let i = 0; i < n; i++) {
    const dir = nums[i] > 0;
    let slow = i, fast = i;
    do {
      slow = next(slow, dir);
      fast = next(fast, dir);
      if (fast !== -1) fast = next(fast, dir);
    } while (slow !== -1 && fast !== -1 && slow !== fast);
    if (slow !== -1 && slow === fast) return true;
  }
  return false;
}`,

    java: `public boolean circularArrayLoop(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        boolean dir = nums[i] > 0;
        int slow = i, fast = i;
        do {
            slow = next(nums, slow, dir, n);
            fast = next(nums, fast, dir, n);
            if (fast != -1) fast = next(nums, fast, dir, n);
        } while (slow != -1 && fast != -1 && slow != fast);
        if (slow != -1 && slow == fast) return true;
    }
    return false;
}
private int next(int[] nums, int idx, boolean dir, int n) {
    if ((nums[idx] > 0) != dir) return -1;
    int ni = ((idx + nums[idx]) % n + n) % n;
    return ni == idx ? -1 : ni;
}`,
  },

  defaultInput: { nums: [2, -1, 1, 2, 2] },

  inputFields: [
    {
      name: 'nums',
      label: 'Circular Array',
      type: 'array',
      defaultValue: [2, -1, 1, 2, 2],
      placeholder: '2,-1,1,2,2',
      helperText: 'Array where positive = forward, negative = backward movement',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]) || [2, -1, 1, 2, 2];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const nxt = (idx: number, dir: boolean): number => {
      if (idx === -1) return -1;
      if ((nums[idx] > 0) !== dir) return -1;
      let ni = (idx + nums[idx]) % n;
      if (ni < 0) ni += n;
      if (ni === idx) return -1;
      return ni;
    };

    const makeViz = (
      slowIdx: number,
      fastIdx: number,
      startIdx: number,
      trailIndices: number[],
      found: boolean
    ): ArrayVisualization => {
      const h: Record<number, string> = {};
      const l: Record<number, string> = {};

      for (const t of trailIndices) h[t] = 'visited';
      h[startIdx] = 'current';
      l[startIdx] = 'start';

      if (slowIdx >= 0) {
        h[slowIdx] = found ? 'found' : 'pointer';
        l[slowIdx] = (l[slowIdx] ? l[slowIdx] + '/' : '') + 'slow';
      }
      if (fastIdx >= 0 && fastIdx !== slowIdx) {
        h[fastIdx] = found ? 'found' : 'active';
        l[fastIdx] = 'fast';
      } else if (fastIdx === slowIdx && fastIdx >= 0) {
        h[fastIdx] = 'found';
        l[fastIdx] = 'slow=fast';
      }

      return {
        type: 'array',
        array: nums,
        highlights: h,
        labels: l,
        auxData: {
          label: 'Cycle Detection',
          entries: [
            { key: 'start index', value: `${startIdx}` },
            { key: 'slow → index', value: `${slowIdx >= 0 ? slowIdx : 'invalid'}` },
            { key: 'fast → index', value: `${fastIdx >= 0 ? fastIdx : 'invalid'}` },
            { key: 'cycle found', value: found ? 'YES' : 'no' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Try Floyd's fast/slow pointer from each starting index. A valid cycle must go same direction and have length > 1.`,
      variables: { n, arrayValues: nums },
      visualization: {
        type: 'array',
        array: nums,
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, v > 0 ? `+${v}` : `${v}`])),
      },
    });

    let cycleFound = false;
    let cycleAtStep = -1;

    outer: for (let i = 0; i < n; i++) {
      const dir = nums[i] > 0;
      let slow = i;
      let fast = i;

      steps.push({
        line: 3,
        explanation: `Start from index ${i} (value=${nums[i]}, direction=${dir ? 'forward' : 'backward'}). Both slow and fast begin here.`,
        variables: { startIndex: i, direction: dir ? 'forward' : 'backward' },
        visualization: makeViz(slow, fast, i, [], false),
      });

      let iteration = 0;
      do {
        const prevSlow = slow;
        const prevFast = fast;
        slow = nxt(slow, dir);
        fast = nxt(fast, dir);
        if (fast !== -1) fast = nxt(fast, dir);
        iteration++;

        if (slow === -1 || fast === -1) {
          steps.push({
            line: 8,
            explanation: `Pointer became invalid (direction change or self-loop). No cycle from index ${i}. Try next start.`,
            variables: { startIndex: i, slow, fast, iteration },
            visualization: makeViz(prevSlow, prevFast, i, [], false),
          });
          break;
        }

        const found = slow === fast;
        steps.push({
          line: 6,
          explanation: `Iteration ${iteration}: slow→${slow}, fast→${fast}. ${found ? 'CYCLE DETECTED!' : 'Not equal, continue.'}`,
          variables: { startIndex: i, slow, fast, iteration },
          visualization: makeViz(slow, fast, i, [i], found),
        });

        if (found) {
          cycleFound = true;
          cycleAtStep = i;
          steps.push({
            line: 10,
            explanation: `Cycle found starting from index ${i}! slow == fast == ${slow}. Return true.`,
            variables: { result: true, cycleAt: slow },
            visualization: makeViz(slow, fast, i, [i], true),
          });
          break outer;
        }

        if (iteration > n) break; // safety
      } while (slow !== -1 && fast !== -1);
    }

    if (!cycleFound) {
      steps.push({
        line: 12,
        explanation: `Checked all starting indices. No valid cycle found. Return false.`,
        variables: { result: false },
        visualization: {
          type: 'array',
          array: nums,
          highlights: Object.fromEntries(nums.map((_, i) => [i, 'visited'])),
          labels: {},
        },
      });
    }

    return steps;
  },
};

export default circularArrayLoop;
