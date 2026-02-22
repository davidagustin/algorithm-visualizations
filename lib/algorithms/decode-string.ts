import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const decodeString: AlgorithmDefinition = {
  id: 'decode-string',
  title: 'Decode String',
  leetcodeNumber: 394,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Decode an encoded string like "3[a2[c]]" → "accaccacc". Use a stack: push current string and repeat count when "[" is seen, build current string until "]", then pop and repeat. The stack stores (previousString, repeatCount) pairs.',
  tags: ['Stack', 'String', 'Recursion'],
  code: {
    pseudocode: `function decodeString(s):
  stack = []
  currentStr = ""
  currentNum = 0
  for char in s:
    if char is digit:
      currentNum = currentNum * 10 + digit
    elif char == '[':
      stack.push((currentStr, currentNum))
      currentStr = ""
      currentNum = 0
    elif char == ']':
      prevStr, num = stack.pop()
      currentStr = prevStr + currentStr * num
    else:
      currentStr += char
  return currentStr`,
    python: `def decodeString(s: str) -> str:
    stack = []
    current_str = ""
    current_num = 0
    for char in s:
        if char.isdigit():
            current_num = current_num * 10 + int(char)
        elif char == '[':
            stack.append((current_str, current_num))
            current_str = ""
            current_num = 0
        elif char == ']':
            prev_str, num = stack.pop()
            current_str = prev_str + current_str * num
        else:
            current_str += char
    return current_str`,
    javascript: `function decodeString(s) {
  const stack = [];
  let currentStr = '';
  let currentNum = 0;
  for (const char of s) {
    if (!isNaN(char)) {
      currentNum = currentNum * 10 + Number(char);
    } else if (char === '[') {
      stack.push([currentStr, currentNum]);
      currentStr = '';
      currentNum = 0;
    } else if (char === ']') {
      const [prevStr, num] = stack.pop();
      currentStr = prevStr + currentStr.repeat(num);
    } else {
      currentStr += char;
    }
  }
  return currentStr;
}`,
    java: `public String decodeString(String s) {
    Deque<String> strStack = new ArrayDeque<>();
    Deque<Integer> numStack = new ArrayDeque<>();
    StringBuilder curr = new StringBuilder();
    int num = 0;
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            num = num * 10 + (c - '0');
        } else if (c == '[') {
            strStack.push(curr.toString());
            numStack.push(num);
            curr = new StringBuilder();
            num = 0;
        } else if (c == ']') {
            String prev = strStack.pop();
            int k = numStack.pop();
            curr = new StringBuilder(prev + curr.toString().repeat(k));
        } else {
            curr.append(c);
        }
    }
    return curr.toString();
}`,
  },
  defaultInput: { s: '3[a2[c]]' },
  inputFields: [
    {
      name: 's',
      label: 'Encoded String',
      type: 'string',
      defaultValue: '3[a2[c]]',
      placeholder: 'e.g. 3[a2[c]]',
      helperText: 'Encoded string with k[pattern] syntax',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const chars = s.split('');
    const steps: AlgorithmStep[] = [];
    const stack: [string, number][] = [];
    let currentStr = '';
    let currentNum = 0;

    const makeViz = (currentIndex: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(([str, num]) => `"${str}",${num}`),
      inputChars: chars,
      currentIndex,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Initialize stack, currentStr="" and currentNum=0. Process each character of "${s}".`,
      variables: { currentStr, currentNum, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];

      if (!isNaN(Number(char)) && char !== ' ') {
        currentNum = currentNum * 10 + Number(char);
        steps.push({
          line: 5,
          explanation: `Digit '${char}': accumulate currentNum = ${currentNum}.`,
          variables: { i, char, currentNum, currentStr },
          visualization: makeViz(i, 'idle'),
        });
      } else if (char === '[') {
        stack.push([currentStr, currentNum]);
        steps.push({
          line: 7,
          explanation: `'[': Push (currentStr="${currentStr}", currentNum=${currentNum}) onto stack. Reset to empty string and 0.`,
          variables: { i, pushed: [currentStr, currentNum], stack: stack.map(([s, n]) => [s, n]) },
          visualization: makeViz(i, 'push'),
        });
        currentStr = '';
        currentNum = 0;
      } else if (char === ']') {
        const [prevStr, num] = stack.pop()!;
        const repeated = currentStr.repeat(num);
        currentStr = prevStr + repeated;
        steps.push({
          line: 10,
          explanation: `']': Pop (prevStr="${prevStr}", num=${num}). Repeat "${currentStr.slice(prevStr.length)}" ${num} times → "${repeated}". New currentStr="${currentStr}".`,
          variables: { i, prevStr, num, repeated, currentStr },
          visualization: makeViz(i, 'pop'),
        });
      } else {
        currentStr += char;
        steps.push({
          line: 12,
          explanation: `Letter '${char}': append to currentStr → "${currentStr}".`,
          variables: { i, char, currentStr },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    steps.push({
      line: 13,
      explanation: `Decoding complete. Result: "${currentStr}".`,
      variables: { result: currentStr },
      visualization: makeViz(chars.length, 'match'),
    });

    return steps;
  },
};

export default decodeString;
