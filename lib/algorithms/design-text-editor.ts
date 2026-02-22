import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designTextEditor: AlgorithmDefinition = {
  id: 'design-text-editor',
  title: 'Design Text Editor',
  leetcodeNumber: 2296,
  difficulty: 'Hard',
  category: 'Linked List',
  description:
    'Design a text editor with a cursor using two stacks (or doubly linked list). Left stack holds characters before cursor, right stack holds characters after. addText appends to left stack. deleteText removes from left. cursorLeft/cursorRight moves characters between stacks.',
  tags: ['linked list', 'stack', 'design', 'string', 'two stacks'],

  code: {
    pseudocode: `class TextEditor:
  left = []   // chars before cursor
  right = []  // chars after cursor

  addText(text):
    for char in text: left.push(char)

  deleteText(k):
    deleted = 0
    while k > 0 and left not empty:
      left.pop()
      k--; deleted++
    return deleted

  cursorLeft(k):
    while k > 0 and left not empty:
      right.push(left.pop())
      k--
    return last 10 chars of left

  cursorRight(k):
    while k > 0 and right not empty:
      left.push(right.pop())
      k--
    return last 10 chars of left`,

    python: `class TextEditor:
    def __init__(self):
        self.left = []
        self.right = []
    def addText(self, text):
        self.left.extend(text)
    def deleteText(self, k):
        deleted = 0
        while k > 0 and self.left:
            self.left.pop()
            k -= 1
            deleted += 1
        return deleted
    def cursorLeft(self, k):
        while k > 0 and self.left:
            self.right.append(self.left.pop())
            k -= 1
        return ''.join(self.left[-10:])
    def cursorRight(self, k):
        while k > 0 and self.right:
            self.left.append(self.right.pop())
            k -= 1
        return ''.join(self.left[-10:])`,

    javascript: `class TextEditor {
  constructor() {
    this.left = [];
    this.right = [];
  }
  addText(text) { this.left.push(...text.split('')); }
  deleteText(k) {
    let deleted = 0;
    while (k-- > 0 && this.left.length) { this.left.pop(); deleted++; }
    return deleted;
  }
  cursorLeft(k) {
    while (k-- > 0 && this.left.length) this.right.push(this.left.pop());
    return this.left.slice(-10).join('');
  }
  cursorRight(k) {
    while (k-- > 0 && this.right.length) this.left.push(this.right.pop());
    return this.left.slice(-10).join('');
  }
}`,

    java: `class TextEditor {
    Deque<Character> left = new ArrayDeque<>();
    Deque<Character> right = new ArrayDeque<>();
    public void addText(String text) {
        for (char c : text.toCharArray()) left.push(c);
    }
    public int deleteText(int k) {
        int deleted = 0;
        while (k-- > 0 && !left.isEmpty()) { left.pop(); deleted++; }
        return deleted;
    }
    public String cursorLeft(int k) {
        while (k-- > 0 && !left.isEmpty()) right.push(left.pop());
        return getText();
    }
    public String cursorRight(int k) {
        while (k-- > 0 && !right.isEmpty()) left.push(right.pop());
        return getText();
    }
}`,
  },

  defaultInput: {
    nums: [104, 101, 108, 108, 111],
    target: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Character ASCII codes to type',
      type: 'array',
      defaultValue: [104, 101, 108, 108, 111],
      placeholder: '104,101,108,108,111',
      helperText: 'ASCII codes for h,e,l,l,o',
    },
    {
      name: 'target',
      label: 'Cursor moves left',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of positions to move cursor left',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const movesLeft = input.target as number;
    const steps: AlgorithmStep[] = [];

    const chars = nums.map(n => String.fromCharCode(n));

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize TextEditor with empty left and right stacks. Cursor at end.',
      variables: { left: '', right: '', cursor: 0 },
      visualization: makeViz([], {}, {}),
    });

    const left: string[] = [];
    const right: string[] = [];

    // Add text
    for (let i = 0; i < chars.length; i++) {
      left.push(chars[i]);
      steps.push({
        line: 5,
        explanation: `addText: Push '${chars[i]}' to left stack. Left: "${left.join('')}|" (cursor after last char).`,
        variables: { added: chars[i], leftStack: left.join(''), cursorAt: left.length },
        visualization: makeViz(
          left.map(c => c.charCodeAt(0)),
          { [left.length - 1]: 'active' },
          { [left.length - 1]: 'new' }
        ),
      });
    }

    steps.push({
      line: 4,
      explanation: `Text added: "${left.join('')}". Cursor at position ${left.length} (after all chars).`,
      variables: { text: left.join(''), cursorPos: left.length },
      visualization: makeViz(
        left.map(c => c.charCodeAt(0)),
        Object.fromEntries(left.map((_, i) => [i, 'found'])),
        { [left.length - 1]: 'cursor' }
      ),
    });

    // Move cursor left
    const actualMoves = Math.min(movesLeft, left.length);
    for (let i = 0; i < actualMoves; i++) {
      const moved = left.pop()!;
      right.unshift(moved);

      steps.push({
        line: 14,
        explanation: `cursorLeft: Move '${moved}' from left stack to right stack. Left: "${left.join('')}" | Right: "${right.join('')}".`,
        variables: { moved, leftStack: left.join(''), rightStack: right.join(''), cursorPos: left.length },
        visualization: makeViz(
          [...left, ...right].map(c => c.charCodeAt(0)),
          {
            ...Object.fromEntries(left.map((_, i) => [i, 'active'])),
            ...Object.fromEntries(right.map((_, i) => [left.length + i, 'pointer'])),
          },
          { [left.length]: 'cursor' }
        ),
      });
    }

    steps.push({
      line: 16,
      explanation: `cursorLeft complete. Text shown near cursor (last 10 of left): "${left.slice(-10).join('')}". Right side: "${right.join('')}".`,
      variables: { nearCursor: left.slice(-10).join(''), rightSide: right.join('') },
      visualization: makeViz(
        [...left, ...right].map(c => c.charCodeAt(0)),
        {
          ...Object.fromEntries(left.map((_, i) => [i, 'sorted'])),
          ...Object.fromEntries(right.map((_, i) => [left.length + i, 'comparing'])),
        },
        { [left.length > 0 ? left.length - 1 : 0]: 'cursor' }
      ),
    });

    return steps;
  },
};

export default designTextEditor;
