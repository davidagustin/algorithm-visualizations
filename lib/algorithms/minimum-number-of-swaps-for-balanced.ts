import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const minimumNumberOfSwapsForBalanced: AlgorithmDefinition = {
  id: 'minimum-number-of-swaps-for-balanced',
  title: 'Minimum Number of Swaps to Make the String Balanced',
  leetcodeNumber: 1963,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a string of brackets that is a permutation of a balanced string, find the minimum number of swaps to make it balanced. Use a stack to count unmatched open brackets. Cancel matched pairs. Each swap fixes two unmatched brackets (one misplaced open and one misplaced close), so the answer is ceil(unmatched_open / 2).',
  tags: ['stack', 'string', 'greedy', 'two pointers'],

  code: {
    pseudocode: `function minSwaps(s):
  stack = 0  // count of unmatched open brackets
  for c in s:
    if c == '[':
      stack += 1
    elif stack > 0:
      stack -= 1  // matched a close bracket
  // stack holds unmatched open brackets
  return (stack + 1) // 2  // each swap fixes 2`,

    python: `def minSwaps(s: str) -> int:
    open_count = 0
    for c in s:
        if c == '[':
            open_count += 1
        elif open_count > 0:
            open_count -= 1
    return (open_count + 1) // 2`,

    javascript: `function minSwaps(s) {
  let openCount = 0;
  for (const c of s) {
    if (c === '[') {
      openCount++;
    } else if (openCount > 0) {
      openCount--;
    }
  }
  return Math.ceil(openCount / 2);
}`,

    java: `public int minSwaps(String s) {
    int openCount = 0;
    for (char c : s.toCharArray()) {
        if (c == '[') openCount++;
        else if (openCount > 0) openCount--;
    }
    return (openCount + 1) / 2;
}`,
  },

  defaultInput: {
    s: '][][',
  },

  inputFields: [
    {
      name: 's',
      label: 'Bracket String',
      type: 'string',
      defaultValue: '][][',
      placeholder: '][][',
      helperText: 'String of square brackets that can be rebalanced',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    const stack: string[] = [];
    let openCount = 0;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Find minimum swaps to balance "${s}". Count unmatched open brackets after pairing.`,
      variables: { s, openCount: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];

      if (c === '[') {
        openCount++;
        stack.push('[');
        steps.push({
          line: 3,
          explanation: `'[' at index ${i}: increment unmatched open count to ${openCount}. Push to visual stack.`,
          variables: { i, char: c, openCount },
          visualization: makeViz(i, 'push'),
        });
      } else {
        if (openCount > 0) {
          openCount--;
          stack.pop();
          steps.push({
            line: 5,
            explanation: `']' at index ${i}: matched with an open bracket. Decrement openCount to ${openCount}. Pop from stack.`,
            variables: { i, char: c, openCount },
            visualization: makeViz(i, 'match'),
          });
        } else {
          steps.push({
            line: 5,
            explanation: `']' at index ${i}: no open bracket to match (openCount = 0). This is an unmatched close (will be fixed by a swap).`,
            variables: { i, char: c, openCount },
            visualization: makeViz(i, 'mismatch'),
          });
        }
      }
    }

    const answer = Math.ceil(openCount / 2);
    steps.push({
      line: 7,
      explanation: `Unmatched open brackets remaining = ${openCount}. Each swap fixes 2 unmatched brackets. Minimum swaps = ceil(${openCount}/2) = ${answer}.`,
      variables: { unmatchedOpen: openCount, result: answer },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default minimumNumberOfSwapsForBalanced;
