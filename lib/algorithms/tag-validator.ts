import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const tagValidator: AlgorithmDefinition = {
  id: 'tag-validator',
  title: 'Tag Validator',
  leetcodeNumber: 591,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Validate XML-like code snippets. A valid code must have a closed tag, the tag name must be uppercase with 1-9 characters, tags must be properly nested (use a stack), and CDATA sections are allowed. Parse the string character by character tracking open tags on a stack.',
  tags: ['stack', 'string', 'parsing', 'xml', 'validation'],

  code: {
    pseudocode: `function isValid(code):
  stack = []
  i = 0
  while i < len(code):
    if code[i:i+9] == "<![CDATA[":
      end = code.index("]]>", i)
      i = end + 3
    elif code[i:i+2] == "</":
      end = code.index(">", i)
      tag = code[i+2:end]
      if not valid_tag(tag) or stack.top != tag: return false
      stack.pop()
      i = end + 1
    elif code[i] == "<":
      end = code.index(">", i)
      tag = code[i+1:end]
      if not valid_tag(tag): return false
      stack.push(tag)
      i = end + 1
    else:
      if stack is empty: return false
      i += 1
  return stack is empty`,

    python: `def isValid(code: str) -> bool:
    stack = []
    i = 0
    while i < len(code):
        if code[i:i+9] == "<![CDATA[":
            j = code.find("]]>", i)
            if j == -1: return False
            i = j + 3
        elif code[i:i+2] == "</":
            j = code.find(">", i)
            if j == -1: return False
            tag = code[i+2:j]
            if not (1 <= len(tag) <= 9 and tag.isupper()):
                return False
            if not stack or stack[-1] != tag:
                return False
            stack.pop()
            i = j + 1
        elif code[i] == "<":
            j = code.find(">", i)
            if j == -1: return False
            tag = code[i+1:j]
            if not (1 <= len(tag) <= 9 and tag.isupper()):
                return False
            stack.append(tag)
            i = j + 1
        else:
            if not stack: return False
            i += 1
    return len(stack) == 0`,

    javascript: `function isValid(code) {
  const stack = [];
  let i = 0;
  while (i < code.length) {
    if (code.startsWith('<![CDATA[', i)) {
      const j = code.indexOf(']]>', i);
      if (j === -1) return false;
      i = j + 3;
    } else if (code.startsWith('</', i)) {
      const j = code.indexOf('>', i);
      if (j === -1) return false;
      const tag = code.slice(i + 2, j);
      if (tag.length < 1 || tag.length > 9 || tag !== tag.toUpperCase()) return false;
      if (!stack.length || stack.at(-1) !== tag) return false;
      stack.pop();
      i = j + 1;
    } else if (code[i] === '<') {
      const j = code.indexOf('>', i);
      if (j === -1) return false;
      const tag = code.slice(i + 1, j);
      if (tag.length < 1 || tag.length > 9 || tag !== tag.toUpperCase()) return false;
      stack.push(tag);
      i = j + 1;
    } else {
      if (!stack.length) return false;
      i++;
    }
  }
  return stack.length === 0;
}`,

    java: `public boolean isValid(String code) {
    Deque<String> stack = new ArrayDeque<>();
    int i = 0;
    while (i < code.length()) {
        if (code.startsWith("<![CDATA[", i)) {
            int j = code.indexOf("]]>", i);
            if (j == -1) return false;
            i = j + 3;
        } else if (code.startsWith("</", i)) {
            int j = code.indexOf('>', i);
            if (j == -1) return false;
            String tag = code.substring(i + 2, j);
            if (tag.isEmpty() || tag.length() > 9 || !tag.equals(tag.toUpperCase())) return false;
            if (stack.isEmpty() || !stack.peek().equals(tag)) return false;
            stack.pop();
            i = j + 1;
        } else if (code.charAt(i) == '<') {
            int j = code.indexOf('>', i);
            if (j == -1) return false;
            String tag = code.substring(i + 1, j);
            if (tag.isEmpty() || tag.length() > 9 || !tag.equals(tag.toUpperCase())) return false;
            stack.push(tag);
            i = j + 1;
        } else {
            if (stack.isEmpty()) return false;
            i++;
        }
    }
    return stack.isEmpty();
}`,
  },

  defaultInput: {
    code: '<DIV>This is the first line <![CDATA[<div>]]></DIV>',
  },

  inputFields: [
    {
      name: 'code',
      label: 'Code String',
      type: 'string',
      defaultValue: '<DIV>This is the first line <![CDATA[<div>]]></DIV>',
      placeholder: '<DIV>text</DIV>',
      helperText: 'XML-like code string to validate',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const code = input.code as string;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];
    let i = 0;
    let valid = true;

    const isValidTag = (tag: string) => tag.length >= 1 && tag.length <= 9 && tag === tag.toUpperCase() && /^[A-Z]+$/.test(tag);

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: code.split('').slice(0, 20),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize empty stack. Begin parsing the code string.',
      variables: { stack: [], i: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    let stepCount = 0;
    while (i < code.length && stepCount < 20) {
      stepCount++;
      if (code.startsWith('<![CDATA[', i)) {
        const j = code.indexOf(']]>', i);
        if (j === -1) { valid = false; break; }
        steps.push({
          line: 5,
          explanation: `Found CDATA section at index ${i}. Skip to end of CDATA (index ${j + 3}).`,
          variables: { i, cdataEnd: j + 3, stack: [...stack] },
          visualization: makeViz(i, 'idle'),
        });
        i = j + 3;
      } else if (code.startsWith('</', i)) {
        const j = code.indexOf('>', i);
        if (j === -1) { valid = false; break; }
        const tag = code.slice(i + 2, j);
        if (!isValidTag(tag)) { valid = false; break; }
        if (!stack.length || stack[stack.length - 1] !== tag) { valid = false; break; }
        stack.pop();
        steps.push({
          line: 11,
          explanation: `Closing tag </${tag}>. Matches stack top. Pop "${tag}". Stack = [${stack.join(', ')}].`,
          variables: { tag, stack: [...stack], i },
          visualization: makeViz(i, 'pop'),
        });
        i = j + 1;
      } else if (code[i] === '<') {
        const j = code.indexOf('>', i);
        if (j === -1) { valid = false; break; }
        const tag = code.slice(i + 1, j);
        if (!isValidTag(tag)) { valid = false; break; }
        stack.push(tag);
        steps.push({
          line: 17,
          explanation: `Opening tag <${tag}>. Push "${tag}" onto stack. Stack = [${stack.join(', ')}].`,
          variables: { tag, stack: [...stack], i },
          visualization: makeViz(i, 'push'),
        });
        i = j + 1;
      } else {
        if (!stack.length) { valid = false; break; }
        i++;
      }
    }

    const result = valid && stack.length === 0;
    steps.push({
      line: 20,
      explanation: `Parsing complete. Stack ${stack.length === 0 ? 'is empty' : 'has unmatched tags'}. Result = ${result}.`,
      variables: { result, stack: [...stack] },
      visualization: makeViz(code.length, result ? 'match' : 'mismatch'),
    });

    return steps;
  },
};

export default tagValidator;
