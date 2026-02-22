import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const evaluateBracketPairs: AlgorithmDefinition = {
  id: 'evaluate-bracket-pairs',
  title: 'Evaluate the Bracket Pairs of a String',
  leetcodeNumber: 1807,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a string s with bracket expressions like "(key)" and a list of key-value pairs, replace each bracket expression with its corresponding value. If a key has no mapping, keep it as-is with brackets. Use a stack to detect when we are inside brackets, collect the key, and perform the lookup when the closing bracket is found.',
  tags: ['stack', 'string', 'hash map'],

  code: {
    pseudocode: `function evaluate(s, knowledge):
  lookup = dict(knowledge)
  result = []
  stack = []  // used to detect bracket state
  for c in s:
    if c == '(':
      stack = []  // start collecting key
    elif c == ')':
      key = join(stack)
      result.append(lookup.get(key, '?'))
      stack = null  // reset
    elif stack is not null:
      stack.append(c)  // collecting key
    else:
      result.append(c)
  return join(result)`,

    python: `def evaluate(s: str, knowledge: list[list[str]]) -> str:
    lookup = dict(knowledge)
    result = []
    key_buf = None
    for c in s:
        if c == '(':
            key_buf = []
        elif c == ')':
            key = ''.join(key_buf)
            result.append(lookup.get(key, '?'))
            key_buf = None
        elif key_buf is not None:
            key_buf.append(c)
        else:
            result.append(c)
    return ''.join(result)`,

    javascript: `function evaluate(s, knowledge) {
  const lookup = Object.fromEntries(knowledge);
  const result = [];
  let keyBuf = null;
  for (const c of s) {
    if (c === '(') keyBuf = [];
    else if (c === ')') {
      result.push(lookup[keyBuf.join('')] ?? '?');
      keyBuf = null;
    } else if (keyBuf !== null) keyBuf.push(c);
    else result.push(c);
  }
  return result.join('');
}`,

    java: `public String evaluate(String s, List<List<String>> knowledge) {
    Map<String,String> lookup = new HashMap<>();
    for (List<String> pair : knowledge) lookup.put(pair.get(0), pair.get(1));
    StringBuilder result = new StringBuilder();
    StringBuilder keyBuf = null;
    for (char c : s.toCharArray()) {
        if (c == '(') keyBuf = new StringBuilder();
        else if (c == ')') {
            result.append(lookup.getOrDefault(keyBuf.toString(), "?"));
            keyBuf = null;
        } else if (keyBuf != null) keyBuf.append(c);
        else result.append(c);
    }
    return result.toString();
}`,
  },

  defaultInput: {
    s: '(name)is(age)yearsold',
    knowledge: [['name', 'bob'], ['age', '2']],
  },

  inputFields: [
    {
      name: 's',
      label: 'Template String',
      type: 'string',
      defaultValue: '(name)is(age)yearsold',
      placeholder: '(name)is(age)yearsold',
      helperText: 'String with bracket keys to be replaced',
    },
    {
      name: 'knowledge',
      label: 'Knowledge (key-value pairs)',
      type: 'array',
      defaultValue: [['name', 'bob'], ['age', '2']],
      placeholder: '[["name","bob"],["age","2"]]',
      helperText: 'Array of [key, value] pairs for lookup',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const knowledge = input.knowledge as string[][];
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    const stack: string[] = []; // visual stack for bracket tracking

    const lookup: Record<string, string> = {};
    for (const [k, v] of knowledge) lookup[k] = v;

    let keyBuf: string[] | null = null;
    let result = '';

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Evaluate bracket pairs in "${s}". Lookup: {${Object.entries(lookup).map(([k, v]) => k + ':' + v).join(', ')}}.`,
      variables: { s, lookup: { ...lookup }, result: '' },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];

      if (c === '(') {
        keyBuf = [];
        stack.push('(');
        steps.push({
          line: 4,
          explanation: `'(' at index ${i}: start collecting key. Push bracket marker to stack.`,
          variables: { i, char: c, result },
          visualization: makeViz(i, 'push'),
        });
      } else if (c === ')') {
        const key = (keyBuf || []).join('');
        const val = lookup[key] !== undefined ? lookup[key] : '?';
        result += val;
        keyBuf = null;
        stack.pop();
        steps.push({
          line: 6,
          explanation: `')' at index ${i}: key="${key}", value="${val}". Append "${val}" to result. Result: "${result}".`,
          variables: { i, key, value: val, result },
          visualization: makeViz(i, 'match'),
        });
      } else if (keyBuf !== null) {
        keyBuf.push(c);
        steps.push({
          line: 9,
          explanation: `Inside brackets. Collecting key character '${c}'. Current key buffer: "${keyBuf.join('')}".`,
          variables: { i, char: c, keyBuf: keyBuf.join(''), result },
          visualization: makeViz(i, 'idle'),
        });
      } else {
        result += c;
        steps.push({
          line: 11,
          explanation: `Regular character '${c}'. Append directly to result. Result: "${result}".`,
          variables: { i, char: c, result },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Done. Final evaluated string: "${result}".`,
      variables: { result },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default evaluateBracketPairs;
