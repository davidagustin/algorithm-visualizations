import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const detectAndRemoveCycle: AlgorithmDefinition = {
  id: 'detect-and-remove-cycle',
  title: 'Detect and Remove Cycle in Linked List',
  leetcodeNumber: 142,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Detect if a linked list has a cycle and find where it starts, then remove it. Use Floyd cycle detection: slow and fast pointers meet inside the cycle. Reset one pointer to head; both advance one step at a time until they meet at the cycle start. Then remove the cycle.',
  tags: ['linked list', 'two pointers', 'cycle detection', 'Floyd algorithm'],

  code: {
    pseudocode: `function detectAndRemoveCycle(head):
  slow = fast = head
  // Phase 1: detect cycle
  while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast: break
  else: return head  // no cycle
  // Phase 2: find cycle start
  slow = head
  while slow != fast:
    slow = slow.next
    fast = fast.next
  // now both at cycle start
  // Phase 3: find node before cycle start
  while fast.next != slow:
    fast = fast.next
  fast.next = null  // remove cycle
  return head`,

    python: `def detectAndRemoveCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return head
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    while fast.next != slow:
        fast = fast.next
    fast.next = None
    return head`,

    javascript: `function detectAndRemoveCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) break;
  }
  if (!fast || !fast.next) return head;
  slow = head;
  while (slow !== fast) { slow = slow.next; fast = fast.next; }
  while (fast.next !== slow) fast = fast.next;
  fast.next = null;
  return head;
}`,

    java: `public ListNode detectAndRemoveCycle(ListNode head) {
    ListNode slow = head, fast = head;
    boolean hasCycle = false;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) { hasCycle = true; break; }
    }
    if (!hasCycle) return head;
    slow = head;
    while (slow != fast) { slow = slow.next; fast = fast.next; }
    while (fast.next != slow) fast = fast.next;
    fast.next = null;
    return head;
}`,
  },

  defaultInput: {
    nums: [3, 2, 0, 4],
    target: 1,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List nodes',
      type: 'array',
      defaultValue: [3, 2, 0, 4],
      placeholder: '3,2,0,4',
      helperText: 'Values of the linked list',
    },
    {
      name: 'target',
      label: 'Cycle start index (0-indexed)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Index where the cycle begins (tail points back here)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const cycleStart = input.target as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Detect and remove cycle. List: [${nums.join(' -> ')}]. Cycle: tail (index ${n - 1}) points back to index ${cycleStart}.`,
      variables: { n, cycleStart },
      visualization: makeViz(
        { [n - 1]: 'comparing', [cycleStart]: 'pointer' },
        { [n - 1]: 'tail->cycle', [cycleStart]: 'cycleStart' }
      ),
    });

    // Phase 1: Floyd detection simulation
    let slow = 0;
    let fast = 0;
    let meetIdx = -1;

    steps.push({
      line: 3,
      explanation: 'Phase 1: Use Floyd cycle detection. Slow moves 1 step, fast moves 2 steps.',
      variables: { slow, fast },
      visualization: makeViz({ 0: 'active' }, { 0: 'slow=fast' }),
    });

    // Simulate with linear representation (cycle detected around index cycleStart)
    for (let step = 1; step <= n; step++) {
      slow = (slow + 1) % n;
      fast = (fast + 2) % n;

      steps.push({
        line: 5,
        explanation: `Step ${step}: slow at index ${slow} (val=${nums[slow]}), fast at index ${fast} (val=${nums[fast]}).`,
        variables: { slow, fast, slowVal: nums[slow], fastVal: nums[fast] },
        visualization: makeViz(
          { [slow]: 'active', [fast]: 'pointer' },
          { [slow]: 'slow', [fast]: 'fast' }
        ),
      });

      if (slow === fast) {
        meetIdx = slow;
        steps.push({
          line: 6,
          explanation: `Cycle detected! Slow and fast meet at index ${meetIdx} (value ${nums[meetIdx]}).`,
          variables: { meetPoint: meetIdx, meetVal: nums[meetIdx] },
          visualization: makeViz(
            { [meetIdx]: 'found' },
            { [meetIdx]: 'MEET' }
          ),
        });
        break;
      }
    }

    // Phase 2: Find cycle start
    slow = 0;
    steps.push({
      line: 9,
      explanation: `Phase 2: Reset slow to head. Advance both slow and fast one step at a time until they meet at cycle start.`,
      variables: { slow: 0, fast: meetIdx },
      visualization: makeViz(
        { 0: 'active', [meetIdx]: 'pointer' },
        { 0: 'slow(head)', [meetIdx]: 'fast' }
      ),
    });

    while (slow !== cycleStart) {
      slow++;
      fast = (fast + 1) % n;

      steps.push({
        line: 11,
        explanation: `slow at index ${slow}, fast at index ${fast}. Converging toward cycle start.`,
        variables: { slow, fast },
        visualization: makeViz(
          { [slow]: 'active', [fast]: 'pointer' },
          { [slow]: 'slow', [fast]: 'fast' }
        ),
      });
    }

    steps.push({
      line: 12,
      explanation: `Both pointers meet at index ${cycleStart} (value ${nums[cycleStart]}). This is the cycle start!`,
      variables: { cycleStart, value: nums[cycleStart] },
      visualization: makeViz(
        { [cycleStart]: 'found' },
        { [cycleStart]: 'CYCLE_START' }
      ),
    });

    // Phase 3: Remove cycle
    steps.push({
      line: 15,
      explanation: `Phase 3: Find the node just before cycle start. Set its next = null to remove the cycle.`,
      variables: { tailOfCycle: n - 1 },
      visualization: makeViz(
        { [n - 1]: 'active', [cycleStart]: 'found' },
        { [n - 1]: 'cycleEnd', [cycleStart]: 'cycleStart' }
      ),
    });

    steps.push({
      line: 16,
      explanation: `Cycle removed. Node[${n - 1}].next = null. List is now acyclic: [${nums.join(' -> ')}].`,
      variables: { result: nums.join(' -> ') },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        { 0: 'head', [n - 1]: 'tail' }
      ),
    });

    return steps;
  },
};

export default detectAndRemoveCycle;
