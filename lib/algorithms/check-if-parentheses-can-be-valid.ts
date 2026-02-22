import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const checkIfParenthesesCanBeValid: AlgorithmDefinition = {
  id: 'check-if-parentheses-can-be-valid',
  title: 'Check if a Parentheses String Can Be Valid',
  leetcodeNumber: 2116,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a parentheses string s and a locked string where 0 means the character can be changed and 1 means it is locked, determine if s can be made valid. Use two stacks: one for locked open parens indices and one for unlocked (flexible) indices. On a locked close paren, match with a locked open or a flexible. Finally match remaining locked opens with flexible positions to the right.',
  tags: ['stack', 'string', 'greedy', 'parentheses'],

  code: {
    pseudocode: `function canBeValid(s, locked):
  if len(s) is odd: return false
  openStack = []   // indices of locked '('
  freeStack = []   // indices of unlocked chars
  for i in 0..n-1:
    if locked[i] == '0':
      freeStack.push(i)
    elif s[i] == '(':
      openStack.push(i)
    else:  // locked ')'
      if openStack not empty: openStack.pop()
      elif freeStack not empty: freeStack.pop()
      else: return false
  // Match remaining locked '(' with free positions to the right
  while openStack and freeStack:
    if openStack.top() < freeStack.top():
      openStack.pop(); freeStack.pop()
    else: return false
  return openStack is empty`,

    python: `def canBeValid(s: str, locked: str) -> bool:
    if len(s) % 2 == 1:
        return False
    open_stack, free_stack = [], []
    for i, (c, lock) in enumerate(zip(s, locked)):
        if lock == '0':
            free_stack.append(i)
        elif c == '(':
            open_stack.append(i)
        else:
            if open_stack:
                open_stack.pop()
            elif free_stack:
                free_stack.pop()
            else:
                return False
    while open_stack and free_stack:
        if open_stack[-1] < free_stack[-1]:
            open_stack.pop(); free_stack.pop()
        else:
            return False
    return not open_stack`,

    javascript: `function canBeValid(s, locked) {
  if (s.length % 2 === 1) return false;
  const openStack = [], freeStack = [];
  for (let i = 0; i < s.length; i++) {
    if (locked[i] === '0') freeStack.push(i);
    else if (s[i] === '(') openStack.push(i);
    else {
      if (openStack.length) openStack.pop();
      else if (freeStack.length) freeStack.pop();
      else return false;
    }
  }
  while (openStack.length && freeStack.length) {
    if (openStack[openStack.length-1] < freeStack[freeStack.length-1]) {
      openStack.pop(); freeStack.pop();
    } else return false;
  }
  return openStack.length === 0;
}`,

    java: `public boolean canBeValid(String s, String locked) {
    if (s.length() % 2 == 1) return false;
    Deque<Integer> openStack = new ArrayDeque<>(), freeStack = new ArrayDeque<>();
    for (int i = 0; i < s.length(); i++) {
        if (locked.charAt(i) == '0') freeStack.push(i);
        else if (s.charAt(i) == '(') openStack.push(i);
        else {
            if (!openStack.isEmpty()) openStack.pop();
            else if (!freeStack.isEmpty()) freeStack.pop();
            else return false;
        }
    }
    while (!openStack.isEmpty() && !freeStack.isEmpty()) {
        if (openStack.peek() < freeStack.peek()) { openStack.pop(); freeStack.pop(); }
        else return false;
    }
    return openStack.isEmpty();
}`,
  },

  defaultInput: {
    s: '))()))',
    locked: '010100',
  },

  inputFields: [
    {
      name: 's',
      label: 'Parentheses String',
      type: 'string',
      defaultValue: '))()))',
      placeholder: '))()))',
      helperText: 'String of parentheses characters',
    },
    {
      name: 'locked',
      label: 'Locked String',
      type: 'string',
      defaultValue: '010100',
      placeholder: '010100',
      helperText: '0 = unlocked (can change), 1 = locked (fixed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const locked = input.locked as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    const openStack: number[] = [];
    const freeStack: number[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [
        ...openStack.map(i => `open[${i}]`),
        ...freeStack.map(i => `free[${i}]`),
      ],
      inputChars: chars.map((c, i) => c + (locked[i] === '0' ? '?' : '')),
      currentIndex: idx,
      action,
    });

    if (s.length % 2 === 1) {
      steps.push({
        line: 1,
        explanation: `Length ${s.length} is odd. A valid parentheses string must have even length. Return false.`,
        variables: { length: s.length, result: false },
        visualization: makeViz(-1, 'mismatch'),
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Check if "${s}" (locked="${locked}") can be valid. Two stacks: locked opens and free positions.`,
      variables: { s, locked },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const lock = locked[i];

      if (lock === '0') {
        freeStack.push(i);
        steps.push({
          line: 5,
          explanation: `Index ${i} '${c}' is unlocked (0). Push to freeStack. Can act as either paren.`,
          variables: { i, char: c, freeStack: [...freeStack] },
          visualization: makeViz(i, 'push'),
        });
      } else if (c === '(') {
        openStack.push(i);
        steps.push({
          line: 6,
          explanation: `Index ${i} '(' is locked. Push to openStack.`,
          variables: { i, char: c, openStack: [...openStack] },
          visualization: makeViz(i, 'push'),
        });
      } else {
        // Locked ')'
        if (openStack.length > 0) {
          const matched = openStack.pop()!;
          steps.push({
            line: 8,
            explanation: `Locked ')' at ${i}. Matched with locked '(' at ${matched}. Pop from openStack.`,
            variables: { i, matched, openStack: [...openStack] },
            visualization: makeViz(i, 'match'),
          });
        } else if (freeStack.length > 0) {
          const matched = freeStack.pop()!;
          steps.push({
            line: 9,
            explanation: `Locked ')' at ${i}. No locked open. Use free position at ${matched} as '('. Pop from freeStack.`,
            variables: { i, matched, freeStack: [...freeStack] },
            visualization: makeViz(i, 'match'),
          });
        } else {
          steps.push({
            line: 10,
            explanation: `Locked ')' at ${i}. Both stacks empty. Cannot match. Return false.`,
            variables: { i, result: false },
            visualization: makeViz(i, 'mismatch'),
          });
          return steps;
        }
      }
    }

    // Match remaining open with free positions to their right
    steps.push({
      line: 12,
      explanation: `All chars processed. Match remaining locked opens with free positions. openStack: [${openStack}], freeStack: [${freeStack}].`,
      variables: { openStack: [...openStack], freeStack: [...freeStack] },
      visualization: makeViz(-1, 'idle'),
    });

    while (openStack.length > 0 && freeStack.length > 0) {
      const oi = openStack[openStack.length - 1];
      const fi = freeStack[freeStack.length - 1];
      if (oi < fi) {
        openStack.pop();
        freeStack.pop();
        steps.push({
          line: 13,
          explanation: `Locked '(' at ${oi} matched with free position at ${fi} (acting as ')'). Both popped.`,
          variables: { openIdx: oi, freeIdx: fi },
          visualization: makeViz(fi, 'match'),
        });
      } else {
        steps.push({
          line: 14,
          explanation: `Locked '(' at ${oi} is after free position at ${fi}. Cannot match (free must be to the right). Return false.`,
          variables: { openIdx: oi, freeIdx: fi, result: false },
          visualization: makeViz(oi, 'mismatch'),
        });
        return steps;
      }
    }

    const result = openStack.length === 0;
    steps.push({
      line: 15,
      explanation: `Final check: openStack ${result ? 'is empty' : 'has unmatched opens'}. Result: ${result}.`,
      variables: { unmatchedOpens: openStack.length, result },
      visualization: makeViz(-1, result ? 'found' : 'mismatch'),
    });

    return steps;
  },
};

export default checkIfParenthesesCanBeValid;
