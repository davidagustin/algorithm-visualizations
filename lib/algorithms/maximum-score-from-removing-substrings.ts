import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const maximumScoreFromRemovingSubstrings: AlgorithmDefinition = {
  id: 'maximum-score-from-removing-substrings',
  title: 'Maximum Score From Removing Substrings',
  leetcodeNumber: 1717,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a string s and two integers x and y, you can remove substring "ab" for x points or "ba" for y points. Remove substrings optimally to maximize score. Greedily remove the higher-value pair first using a stack. After the first pass, remove the lower-value pair in a second pass. Each stack pass collapses the target substring.',
  tags: ['stack', 'greedy', 'string'],

  code: {
    pseudocode: `function maximumGain(s, x, y):
  // Remove higher-value pair first
  first = "ab" if x >= y else "ba"
  second = "ba" if x >= y else "ab"
  firstVal = max(x, y)
  secondVal = min(x, y)
  score = 0

  // First pass: remove first pair
  stack1 = []
  for c in s:
    if stack1 and stack1.top() == first[0] and c == first[1]:
      stack1.pop()
      score += firstVal
    else:
      stack1.push(c)

  // Second pass: remove second pair
  stack2 = []
  for c in stack1:
    if stack2 and stack2.top() == second[0] and c == second[1]:
      stack2.pop()
      score += secondVal
    else:
      stack2.push(c)

  return score`,

    python: `def maximumGain(s: str, x: int, y: int) -> int:
    def remove(s, pair, val):
        stack = []
        score = 0
        for c in s:
            if stack and stack[-1] == pair[0] and c == pair[1]:
                stack.pop()
                score += val
            else:
                stack.append(c)
        return ''.join(stack), score

    if x >= y:
        s, s1 = remove(s, 'ab', x)
        s, s2 = remove(s, 'ba', y)
    else:
        s, s1 = remove(s, 'ba', y)
        s, s2 = remove(s, 'ab', x)
    return s1 + s2`,

    javascript: `function maximumGain(s, x, y) {
  function remove(str, pair, val) {
    const stack = [];
    let score = 0;
    for (const c of str) {
      if (stack.length && stack[stack.length-1] === pair[0] && c === pair[1]) {
        stack.pop(); score += val;
      } else stack.push(c);
    }
    return [stack.join(''), score];
  }
  let score = 0;
  if (x >= y) {
    const [s1, sc1] = remove(s, 'ab', x);
    const [, sc2] = remove(s1, 'ba', y);
    score = sc1 + sc2;
  } else {
    const [s1, sc1] = remove(s, 'ba', y);
    const [, sc2] = remove(s1, 'ab', x);
    score = sc1 + sc2;
  }
  return score;
}`,

    java: `public int maximumGain(String s, int x, int y) {
    int score = 0;
    String first = x >= y ? "ab" : "ba";
    String second = x >= y ? "ba" : "ab";
    int fv = Math.max(x, y), sv = Math.min(x, y);
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (!stack.isEmpty() && stack.peek() == first.charAt(0) && c == first.charAt(1)) {
            stack.pop(); score += fv;
        } else stack.push(c);
    }
    Deque<Character> stack2 = new ArrayDeque<>();
    while (!stack.isEmpty()) {
        char c = stack.pollLast();
        if (!stack2.isEmpty() && stack2.peek() == second.charAt(0) && c == second.charAt(1)) {
            stack2.pop(); score += sv;
        } else stack2.push(c);
    }
    return score;
}`,
  },

  defaultInput: {
    s: 'cdbcbbaaabab',
    x: 4,
    y: 5,
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'cdbcbbaaabab',
      placeholder: 'cdbcbbaaabab',
      helperText: 'String with lowercase letters',
    },
    {
      name: 'x',
      label: 'Points for "ab"',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Points for removing substring "ab"',
    },
    {
      name: 'y',
      label: 'Points for "ba"',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Points for removing substring "ba"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const x = input.x as number;
    const y = input.y as number;
    const steps: AlgorithmStep[] = [];

    const firstPair = x >= y ? 'ab' : 'ba';
    const secondPair = x >= y ? 'ba' : 'ab';
    const firstVal = Math.max(x, y);
    const secondVal = Math.min(x, y);

    const stack: string[] = [];
    let score = 0;
    let pass1Result = '';

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: s.split(''),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Maximize score from removing "ab" (+${x}) and "ba" (+${y}). Remove "${firstPair}" first (worth ${firstVal} pts each), then "${secondPair}" (worth ${secondVal} pts).`,
      variables: { s, x, y, firstPair, firstVal, secondPair, secondVal },
      visualization: makeViz(-1, 'idle'),
    });

    // First pass
    steps.push({
      line: 8,
      explanation: `Pass 1: Remove all "${firstPair}" substrings. Greedy stack approach.`,
      variables: { pass: 1, pair: firstPair, pointsEach: firstVal },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < s.length; i++) {
      const c = s[i];

      if (stack.length > 0 && stack[stack.length - 1] === firstPair[0] && c === firstPair[1]) {
        stack.pop();
        score += firstVal;
        steps.push({
          line: 10,
          explanation: `'${firstPair}' found! Stack top '${firstPair[0]}' + current '${c}'. Remove pair, gain ${firstVal} pts. Score = ${score}.`,
          variables: { i, char: c, score, stack: [...stack] },
          visualization: makeViz(i, 'match'),
        });
      } else {
        stack.push(c);
        steps.push({
          line: 12,
          explanation: `Push '${c}'. No "${firstPair}" match yet. Stack: [${stack.join('')}].`,
          variables: { i, char: c, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      }
    }

    pass1Result = stack.join('');
    steps.push({
      line: 14,
      explanation: `Pass 1 complete. Remaining string: "${pass1Result}". Score so far: ${score}.`,
      variables: { pass1Result, score },
      visualization: makeViz(-1, 'idle'),
    });

    // Second pass
    const stack2: string[] = [];
    steps.push({
      line: 16,
      explanation: `Pass 2: Remove all "${secondPair}" from "${pass1Result}".`,
      variables: { pass: 2, pair: secondPair, pointsEach: secondVal },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < pass1Result.length; i++) {
      const c = pass1Result[i];
      stack.length = 0; // clear for visualization
      stack.push(...stack2);

      if (stack2.length > 0 && stack2[stack2.length - 1] === secondPair[0] && c === secondPair[1]) {
        stack2.pop();
        score += secondVal;
        stack.length = 0;
        stack.push(...stack2);
        steps.push({
          line: 18,
          explanation: `'${secondPair}' found! Remove pair, gain ${secondVal} pts. Score = ${score}.`,
          variables: { i, char: c, score, stack2: [...stack2] },
          visualization: makeViz(i, 'match'),
        });
      } else {
        stack2.push(c);
        stack.push(c);
        steps.push({
          line: 20,
          explanation: `Push '${c}'. Stack2: [${stack2.join('')}].`,
          variables: { i, char: c, stack2: [...stack2] },
          visualization: makeViz(i, 'push'),
        });
      }
    }

    steps.push({
      line: 22,
      explanation: `Done. Maximum score = ${score}.`,
      variables: { result: score },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default maximumScoreFromRemovingSubstrings;
