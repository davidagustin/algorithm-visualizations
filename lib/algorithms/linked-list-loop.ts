import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const linkedListLoop: AlgorithmDefinition = {
  id: 'linked-list-loop',
  title: 'Linked List Cycle',
  leetcodeNumber: 141,
  difficulty: 'Easy',
  category: 'Fast And Slow Pointers',
  description:
    'Given head of a linked list, determine if it has a cycle. Uses Floyd\'s Tortoise and Hare algorithm: a slow pointer moves one step at a time, a fast pointer moves two steps. If they meet, there is a cycle.',
  tags: ['linked list', 'fast slow pointers', 'cycle detection'],

  code: {
    pseudocode: `function hasCycle(head):
  slow = head
  fast = head
  while fast != null and fast.next != null:
    slow = slow.next
    fast = fast.next.next
    if slow == fast:
      return true
  return false`,

    python: `def hasCycle(head: ListNode) -> bool:
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,

    javascript: `function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,

    java: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
  },

  defaultInput: {
    nodes: [3, 2, 0, -4],
    cyclePos: 1,
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Node Values',
      type: 'array',
      defaultValue: [3, 2, 0, -4],
      placeholder: '3,2,0,-4',
      helperText: 'Comma-separated node values',
    },
    {
      name: 'cyclePos',
      label: 'Cycle Position (-1 for no cycle)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Index where the tail connects to (-1 = no cycle)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nodes = input.nodes as number[];
    const cyclePos = input.cyclePos as number;
    const n = nodes.length;
    const steps: AlgorithmStep[] = [];
    const hasCycleFlag = cyclePos >= 0 && cyclePos < n;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nodes],
      highlights,
      labels,
      auxData: hasCycleFlag
        ? { label: 'Cycle', entries: [{ key: 'tail connects to', value: `index ${cyclePos} (val ${nodes[cyclePos]})` }] }
        : undefined,
    });

    // Step: Initialize
    steps.push({
      line: 2,
      explanation: `Initialize slow and fast at head (index 0, value ${nodes[0]}). ${hasCycleFlag ? `Tail connects back to index ${cyclePos}.` : 'No cycle.'}`,
      variables: { slow: 0, fast: 0 },
      visualization: makeViz({ [0]: 'active' }, { [0]: 'S,F' }),
    });

    let slow = 0;
    let fast = 0;
    let iteration = 0;
    const maxIter = n * 3; // Safety limit

    while (iteration < maxIter) {
      iteration++;

      // Check if fast can advance
      const fastNext1 = fast + 1 < n ? fast + 1 : (hasCycleFlag ? cyclePos : -1);
      if (fastNext1 === -1) {
        // fast.next is null
        steps.push({
          line: 8,
          explanation: `fast is at end of list (no next node). No cycle detected. Return false.`,
          variables: { slow, fast, result: false },
          visualization: makeViz(
            { [slow]: 'pointer', [fast]: 'active' },
            { [slow]: 'S', [fast]: 'F' }
          ),
        });
        break;
      }

      const fastNext2 = fastNext1 + 1 < n ? fastNext1 + 1 : (hasCycleFlag ? cyclePos : -1);
      if (fastNext2 === -1) {
        steps.push({
          line: 8,
          explanation: `fast.next.next is null. No cycle detected. Return false.`,
          variables: { slow, fast, result: false },
          visualization: makeViz(
            { [slow]: 'pointer', [fast]: 'active' },
            { [slow]: 'S', [fast]: 'F' }
          ),
        });
        break;
      }

      // Move pointers
      const slowNext = slow + 1 < n ? slow + 1 : (hasCycleFlag ? cyclePos : -1);
      if (slowNext === -1) break;

      slow = slowNext;
      fast = fastNext2;

      const met = slow === fast;

      steps.push({
        line: met ? 7 : 5,
        explanation: met
          ? `Slow and fast both at index ${slow} (value ${nodes[slow]}). They met! Cycle detected. Return true.`
          : `Move slow to index ${slow} (${nodes[slow]}), fast to index ${fast} (${nodes[fast]}).`,
        variables: { slow, fast, slowVal: nodes[slow], fastVal: nodes[fast], ...(met ? { result: true } : {}) },
        visualization: makeViz(
          met
            ? { [slow]: 'found' }
            : { [slow]: 'pointer', [fast]: 'active' },
          met
            ? { [slow]: 'S=F!' }
            : slow === fast ? { [slow]: 'S,F' } : { [slow]: 'S', [fast]: 'F' }
        ),
      });

      if (met) return steps;
    }

    // No cycle
    if (steps[steps.length - 1].variables.result === undefined) {
      steps.push({
        line: 8,
        explanation: 'Reached end of list. No cycle detected. Return false.',
        variables: { result: false },
        visualization: makeViz(
          Object.fromEntries(nodes.map((_, i) => [i, 'visited'])),
          {}
        ),
      });
    }

    return steps;
  },
};

export default linkedListLoop;
