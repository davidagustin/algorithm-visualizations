import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designSkiplist: AlgorithmDefinition = {
  id: 'design-skiplist',
  title: 'Design Skiplist',
  leetcodeNumber: 1206,
  difficulty: 'Hard',
  category: 'Linked List',
  description:
    'Implement a skip list data structure without using built-in libraries. A skip list is a probabilistic data structure with multiple levels of sorted linked lists. Each element may appear on multiple levels with probability 0.5, enabling O(log n) average search, insert, and delete.',
  tags: ['linked list', 'design', 'probabilistic', 'skip list'],

  code: {
    pseudocode: `class Skiplist:
  MAX_LEVEL = 16, P = 0.5
  head = Node(-inf, MAX_LEVEL)

  search(target):
    cur = head
    for level from MAX_LEVEL-1 down to 0:
      while cur.next[level] and cur.next[level].val < target:
        cur = cur.next[level]
    cur = cur.next[0]
    return cur and cur.val == target

  add(num):
    update = [head] * MAX_LEVEL
    cur = head
    for level from MAX_LEVEL-1 down to 0:
      while cur.next[level] and cur.next[level].val < num:
        cur = cur.next[level]
      update[level] = cur
    level = randomLevel()
    node = Node(num, level)
    for i in range(level):
      node.next[i] = update[i].next[i]
      update[i].next[i] = node

  erase(num):
    similar to add but removes node`,

    python: `import random
class Skiplist:
    MAX_LEVEL = 16
    P = 0.5
    def __init__(self):
        self.head = [None] * self.MAX_LEVEL
        self.level = 0
    def _random_level(self):
        lvl = 1
        while random.random() < self.P and lvl < self.MAX_LEVEL:
            lvl += 1
        return lvl
    def search(self, target):
        cur = self.head
        for i in range(self.level - 1, -1, -1):
            while cur[i] and cur[i][0] < target:
                cur = cur[i][1]
        return cur[0] and cur[0][0] == target if cur[0] else False`,

    javascript: `class Skiplist {
  constructor() {
    this.MAX_LEVEL = 16;
    this.P = 0.5;
    this.head = new Array(this.MAX_LEVEL).fill(null);
    this.level = 0;
  }
  randomLevel() {
    let lvl = 1;
    while (Math.random() < this.P && lvl < this.MAX_LEVEL) lvl++;
    return lvl;
  }
  search(target) {
    let cur = this.head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (cur[i] && cur[i].val < target) cur = cur[i].next;
    }
    return cur[0] !== null && cur[0].val === target;
  }
}`,

    java: `class Skiplist {
    static final int MAX_LEVEL = 16;
    static final double P = 0.5;
    int[] head = new int[MAX_LEVEL];
    int level = 0;
    Random rand = new Random();
    int randomLevel() {
        int lvl = 1;
        while (rand.nextDouble() < P && lvl < MAX_LEVEL) lvl++;
        return lvl;
    }
    boolean search(int target) {
        // traverse from top level down
        return false; // simplified
    }
}`,
  },

  defaultInput: {
    nums: [1, 3, 5, 7, 9],
    target: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Elements to insert',
      type: 'array',
      defaultValue: [1, 3, 5, 7, 9],
      placeholder: '1,3,5,7,9',
      helperText: 'Values to insert into the skip list',
    },
    {
      name: 'target',
      label: 'Search target',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Value to search for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

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
      explanation: 'Initialize skip list with head sentinel and multiple levels (visualized as base sorted list).',
      variables: { maxLevel: 16, probability: 0.5 },
      visualization: makeViz({}, {}),
    });

    // Simulate insertions
    for (let i = 0; i < nums.length; i++) {
      const level = Math.floor(Math.random() * 3) + 1;
      steps.push({
        line: 12,
        explanation: `Insert ${nums[i]}: assigned to ${level} level(s). Update forward pointers at each level.`,
        variables: { value: nums[i], assignedLevel: level },
        visualization: makeViz(
          { [i]: 'active' },
          { [i]: `L${level}` }
        ),
      });
    }

    steps.push({
      line: 6,
      explanation: `Search for target = ${target}. Start at the highest level and traverse right, then drop down.`,
      variables: { target },
      visualization: makeViz(
        { 0: 'pointer' },
        { 0: 'start' }
      ),
    });

    // Simulate search
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] < target) {
        steps.push({
          line: 8,
          explanation: `${nums[i]} < ${target}: move right on current level.`,
          variables: { current: nums[i], target },
          visualization: makeViz(
            { [i]: 'comparing' },
            { [i]: 'skip' }
          ),
        });
      } else if (nums[i] === target) {
        steps.push({
          line: 9,
          explanation: `Found ${target} at index ${i}! Search complete.`,
          variables: { found: true, target, index: i },
          visualization: makeViz(
            { [i]: 'found' },
            { [i]: 'FOUND' }
          ),
        });
        break;
      } else {
        steps.push({
          line: 8,
          explanation: `${nums[i]} > ${target}: drop down a level and continue search.`,
          variables: { current: nums[i], target },
          visualization: makeViz(
            { [i]: 'pointer' },
            { [i]: 'drop' }
          ),
        });
      }
    }

    return steps;
  },
};

export default designSkiplist;
