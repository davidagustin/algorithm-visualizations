import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const repeatedRemovalOfAdjacentDuplicates: AlgorithmDefinition = {
  id: 'repeated-removal-of-adjacent-duplicates',
  title: 'Repeated Removal of Adjacent Duplicates',
  leetcodeNumber: 1209,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Remove all adjacent groups of k duplicate characters repeatedly until no more removals can be made. Use a stack where each entry tracks a character and its consecutive count. When the count reaches k, pop it off.',
  tags: ['Stack', 'String'],
  code: {
    pseudocode: `function removeDuplicates(s, k):
  stack = []  // each entry: [char, count]
  for each char in s:
    if stack not empty and stack.top.char == char:
      stack.top.count += 1
      if stack.top.count == k:
        pop from stack
    else:
      push [char, 1] onto stack
  result = ""
  for each [char, count] in stack:
    result += char repeated count times
  return result`,
    python: `def removeDuplicates(s, k):
    stack = []  # [(char, count)]
    for char in s:
        if stack and stack[-1][0] == char:
            stack[-1] = (char, stack[-1][1] + 1)
            if stack[-1][1] == k:
                stack.pop()
        else:
            stack.append((char, 1))
    return ''.join(c * cnt for c, cnt in stack)`,
    javascript: `function removeDuplicates(s, k) {
  const stack = []; // [{char, count}]
  for (const char of s) {
    if (stack.length && stack[stack.length - 1].char === char) {
      stack[stack.length - 1].count++;
      if (stack[stack.length - 1].count === k) {
        stack.pop();
      }
    } else {
      stack.push({ char, count: 1 });
    }
  }
  return stack.map(e => e.char.repeat(e.count)).join('');
}`,
    java: `public String removeDuplicates(String s, int k) {
    Deque<int[]> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (!stack.isEmpty() && stack.peek()[0] == c) {
            stack.peek()[1]++;
            if (stack.peek()[1] == k) stack.pop();
        } else {
            stack.push(new int[]{c, 1});
        }
    }
    StringBuilder sb = new StringBuilder();
    for (int[] e : stack)
        sb.insert(0, String.valueOf((char)e[0]).repeat(e[1]));
    return sb.toString();
}`,
  },
  defaultInput: { s: 'deeedbbcccbdaa', k: 3 },
  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'deeedbbcccbdaa',
      placeholder: 'e.g. deeedbbcccbdaa',
      helperText: 'Input string',
    },
    {
      name: 'k',
      label: 'K (group size)',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Remove groups of k adjacent duplicates',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const chars = s.split('');
    const steps: AlgorithmStep[] = [];
    const stack: { char: string; count: number }[] = [];

    const makeViz = (
      currentIndex: number,
      action: StackVisualization['action']
    ): StackVisualization => ({
      type: 'stack',
      items: stack.map(e => `${e.char}(${e.count})`),
      inputChars: chars,
      currentIndex,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Initialize empty stack. Process each character, tracking consecutive counts. Remove groups of ${k}.`,
      variables: { s, k, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      if (stack.length > 0 && stack[stack.length - 1].char === char) {
        stack[stack.length - 1].count++;

        if (stack[stack.length - 1].count === k) {
          steps.push({
            line: 5,
            explanation: `'${char}' at index ${i}: count for '${char}' reaches ${k}. Remove the group!`,
            variables: { i, char, count: k, removing: true },
            visualization: makeViz(i, 'pop'),
          });
          stack.pop();
        } else {
          steps.push({
            line: 4,
            explanation: `'${char}' at index ${i}: matches stack top '${char}'. Increment count to ${stack[stack.length - 1].count}.`,
            variables: { i, char, count: stack[stack.length - 1].count },
            visualization: makeViz(i, 'push'),
          });
        }
      } else {
        stack.push({ char, count: 1 });
        steps.push({
          line: 7,
          explanation: `'${char}' at index ${i}: new character. Push '${char}' with count 1.`,
          variables: { i, char, count: 1 },
          visualization: makeViz(i, 'push'),
        });
      }
    }

    // Build result
    const result = stack.map(e => e.char.repeat(e.count)).join('');

    steps.push({
      line: 9,
      explanation: `All characters processed. Build result from stack: "${result}".`,
      variables: { result, stack: stack.map(e => `${e.char}x${e.count}`) },
      visualization: makeViz(chars.length, 'match'),
    });

    return steps;
  },
};

export default repeatedRemovalOfAdjacentDuplicates;
