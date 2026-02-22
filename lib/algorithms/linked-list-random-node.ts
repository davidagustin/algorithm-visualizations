import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const linkedListRandomNode: AlgorithmDefinition = {
  id: 'linked-list-random-node',
  title: 'Linked List Random Node',
  leetcodeNumber: 382,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given a singly linked list, return a random node value such that each node is equally likely to be chosen. Use reservoir sampling: traverse each node i (1-indexed) and with probability 1/i replace the chosen node with the current node. This gives uniform probability without knowing the list length in advance.',
  tags: ['linked list', 'reservoir sampling', 'randomized', 'math'],

  code: {
    pseudocode: `function getRandom(head):
  result = head.val
  cur = head.next
  i = 2
  while cur != null:
    j = random(1, i)  // inclusive
    if j == 1:
      result = cur.val
    cur = cur.next
    i++
  return result`,

    python: `import random
def getRandom(head):
    result = head.val
    cur = head.next
    i = 2
    while cur:
        if random.randint(1, i) == 1:
            result = cur.val
        cur = cur.next
        i += 1
    return result`,

    javascript: `function getRandom(head) {
  let result = head.val;
  let cur = head.next;
  let i = 2;
  while (cur) {
    if (Math.floor(Math.random() * i) === 0) result = cur.val;
    cur = cur.next;
    i++;
  }
  return result;
}`,

    java: `public int getRandom() {
    int result = head.val;
    ListNode cur = head.next;
    int i = 2;
    while (cur != null) {
        if (new Random().nextInt(i) == 0) result = cur.val;
        cur = cur.next;
        i++;
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Comma-separated integers representing linked list nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
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
      explanation: `Reservoir sampling on list [${nums.join(', ')}]. Initialize result = head.val = ${nums[0]}. Each node gets probability 1/n = 1/${n} of being chosen.`,
      variables: { result: nums[0], i: 1 },
      visualization: makeViz({ 0: 'found' }, { 0: `res=${nums[0]}` }),
    });

    let reservoir = nums[0];

    // Simulate with fixed random choices for demonstration
    // Use deterministic probabilities to show the process clearly
    const randomChoices: boolean[] = [];
    for (let i = 1; i < n; i++) {
      // Probability 1/(i+1) of choosing current node
      // For demonstration, show the probability check
      randomChoices.push(i === Math.floor(n / 2)); // pick the middle one for demonstration
    }

    for (let i = 1; i < n; i++) {
      const prob = `1/${i + 1}`;
      const chosen = randomChoices[i - 1];

      steps.push({
        line: 5,
        explanation: `Node ${i + 1} (value ${nums[i]}): generate random number in [1, ${i + 1}]. Probability of replacing result: ${prob}.`,
        variables: { i: i + 1, 'current value': nums[i], 'current result': reservoir, probability: prob },
        visualization: makeViz(
          { [i]: 'active', ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, k === nums.indexOf(reservoir) ? 'found' : 'visited'])) },
          { [i]: `P=${prob}`, 0: `res=${reservoir}` }
        ),
      });

      if (chosen) {
        reservoir = nums[i];
        steps.push({
          line: 7,
          explanation: `Random check passed (probability ${prob})! Update result to ${nums[i]}.`,
          variables: { 'new result': reservoir, 'previous result': nums[i === 0 ? 0 : i - 1] },
          visualization: makeViz(
            { [i]: 'found', ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'visited'])) },
            { [i]: `NEW res=${reservoir}` }
          ),
        });
      } else {
        steps.push({
          line: 6,
          explanation: `Random check failed. Keep result = ${reservoir}.`,
          variables: { result: reservoir },
          visualization: makeViz(
            { [i]: 'comparing', ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, k === nums.indexOf(reservoir) ? 'found' : 'visited'])) },
            { [i]: 'skip' }
          ),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Reservoir sampling complete. Each of the ${n} nodes had equal probability 1/${n} of being returned. Result: ${reservoir}.`,
      variables: { result: reservoir, 'equal probability': `1/${n}` },
      visualization: makeViz(
        Object.fromEntries(nums.map((v, i) => [i, v === reservoir ? 'found' : 'visited'])),
        Object.fromEntries(nums.map((v, i) => [i, v === reservoir ? 'chosen' : '']))
      ),
    });

    return steps;
  },
};

export default linkedListRandomNode;
