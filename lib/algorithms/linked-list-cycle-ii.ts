import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const linkedListCycleIi: AlgorithmDefinition = {
  id: 'linked-list-cycle-ii',
  title: 'Linked List Cycle II',
  leetcodeNumber: 142,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null. Use Floyd cycle detection: first find the meeting point of slow and fast pointers, then reset one pointer to head and advance both one step at a time to find the cycle entry node.',
  tags: ['linked list', 'two pointers', 'floyd cycle detection', 'fast and slow pointers'],

  code: {
    pseudocode: `function detectCycle(head):
  slow = head
  fast = head
  while fast != null and fast.next != null:
    slow = slow.next
    fast = fast.next.next
    if slow == fast:
      break
  if fast == null or fast.next == null:
    return null
  slow = head
  while slow != fast:
    slow = slow.next
    fast = fast.next
  return slow`,

    python: `def detectCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    return slow`,

    javascript: `function detectCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) break;
  }
  if (!fast || !fast.next) return null;
  slow = head;
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }
  return slow;
}`,

    java: `public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) break;
    }
    if (fast == null || fast.next == null) return null;
    slow = head;
    while (slow != fast) {
        slow = slow.next;
        fast = fast.next;
    }
    return slow;
}`,
  },

  defaultInput: {
    nums: [3, 2, 0, -4],
    cyclePos: 1,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [3, 2, 0, -4],
      placeholder: '3,2,0,-4',
      helperText: 'Node values of the linked list',
    },
    {
      name: 'cyclePos',
      label: 'Cycle Start Index',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Index (0-based) where the tail connects to form a cycle (-1 for no cycle)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const cyclePos = input.cyclePos as number;
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
      explanation: `Initialize slow and fast pointers both at head (index 0, value ${nums[0]}). Cycle starts at index ${cyclePos}.`,
      variables: { slow: 0, fast: 0, phase: 'detection' },
      visualization: makeViz({ 0: 'active' }, { 0: 'S/F' }),
    });

    let slow = 0;
    let fast = 0;
    let met = false;

    for (let iter = 0; iter < n * 2; iter++) {
      const nextSlow = (slow + 1) % (cyclePos >= 0 ? n : n);
      const afterFast = (fast + 1) % n;
      const nextFast = (afterFast + 1) % n;

      slow = nextSlow;
      fast = cyclePos >= 0 ? nextFast : Math.min(fast + 2, n - 1);

      const slowLabel: Record<number, string> = { [slow]: 'S' };
      const fastLabel: Record<number, string> = {};
      if (fast !== slow) fastLabel[fast] = 'F';
      else slowLabel[slow] = 'S/F';

      const hl: Record<number, string> = { [slow]: 'active' };
      if (fast !== slow) hl[fast] = 'pointer';

      steps.push({
        line: 5,
        explanation: `Phase 1 - Move slow one step to index ${slow} (value ${nums[slow]}), fast two steps to index ${fast} (value ${nums[fast]}).`,
        variables: { slow, fast, 'slow value': nums[slow], 'fast value': nums[fast] },
        visualization: makeViz(hl, { ...slowLabel, ...fastLabel }),
      });

      if (slow === fast && cyclePos >= 0) {
        met = true;
        steps.push({
          line: 6,
          explanation: `Slow and fast met at index ${slow} (value ${nums[slow]}). Cycle confirmed. Reset slow to head.`,
          variables: { meetPoint: slow, 'meet value': nums[slow] },
          visualization: makeViz({ [slow]: 'found' }, { [slow]: 'MEET' }),
        });
        break;
      }
    }

    if (!met || cyclePos < 0) {
      steps.push({
        line: 8,
        explanation: 'Fast reached null. No cycle detected in the linked list.',
        variables: { result: 'null' },
        visualization: makeViz({}, {}),
      });
      return steps;
    }

    slow = 0;
    steps.push({
      line: 10,
      explanation: `Reset slow to head (index 0, value ${nums[0]}). Fast stays at meeting point. Both advance one step at a time.`,
      variables: { slow: 0, fast, phase: 'find entry' },
      visualization: makeViz({ 0: 'pointer', [fast]: 'active' }, { 0: 'S', [fast]: 'F' }),
    });

    while (slow !== fast) {
      slow = (slow + 1) % n;
      fast = (fast + 1) % n;
      if (fast >= n) fast = cyclePos;

      const hl2: Record<number, string> = { [slow]: 'active' };
      if (fast !== slow) hl2[fast] = 'pointer';
      else hl2[slow] = 'found';

      const lab2: Record<number, string> = {};
      if (fast !== slow) { lab2[slow] = 'S'; lab2[fast] = 'F'; }
      else lab2[slow] = 'S=F';

      steps.push({
        line: 12,
        explanation: slow === fast
          ? `Slow and fast meet at index ${slow} (value ${nums[slow]}). This is the cycle start node!`
          : `Advance both one step: slow at index ${slow} (value ${nums[slow]}), fast at index ${fast} (value ${nums[fast]}).`,
        variables: { slow, fast, 'cycle start': slow === fast ? slow : '?' },
        visualization: makeViz(hl2, lab2),
      });
    }

    return steps;
  },
};

export default linkedListCycleIi;
