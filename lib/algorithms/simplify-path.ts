import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const simplifyPath: AlgorithmDefinition = {
  id: 'simplify-path',
  title: 'Simplify Path',
  leetcodeNumber: 71,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Simplify a Unix file path by resolving "." (current dir) and ".." (parent dir). Split by "/", push valid directory names onto a stack, pop for "..", ignore "." and empty strings. Join the stack with "/" to form the canonical path.',
  tags: ['Stack', 'String'],
  code: {
    pseudocode: `function simplifyPath(path):
  stack = []
  parts = path.split('/')
  for part in parts:
    if part == '' or part == '.':
      continue
    elif part == '..':
      if stack not empty: stack.pop()
    else:
      stack.push(part)
  return '/' + '/'.join(stack)`,
    python: `def simplifyPath(path: str) -> str:
    stack = []
    for part in path.split('/'):
        if part == '' or part == '.':
            continue
        elif part == '..':
            if stack:
                stack.pop()
        else:
            stack.append(part)
    return '/' + '/'.join(stack)`,
    javascript: `function simplifyPath(path) {
  const stack = [];
  for (const part of path.split('/')) {
    if (part === '' || part === '.') continue;
    else if (part === '..') { if (stack.length) stack.pop(); }
    else stack.push(part);
  }
  return '/' + stack.join('/');
}`,
    java: `public String simplifyPath(String path) {
    Deque<String> stack = new ArrayDeque<>();
    for (String part : path.split("/")) {
        if (part.isEmpty() || part.equals(".")) continue;
        else if (part.equals("..")) { if (!stack.isEmpty()) stack.pop(); }
        else stack.push(part);
    }
    StringBuilder sb = new StringBuilder();
    for (String dir : stack) sb.insert(0, "/" + dir);
    return sb.length() > 0 ? sb.toString() : "/";
}`,
  },
  defaultInput: { path: '/home//foo/../bar/./baz' },
  inputFields: [
    {
      name: 'path',
      label: 'Unix Path',
      type: 'string',
      defaultValue: '/home//foo/../bar/./baz',
      placeholder: 'e.g. /home//foo/../bar/./baz',
      helperText: 'Unix absolute path with . and .. components',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const path = input.path as string;
    const parts = path.split('/');
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];

    const makeViz = (currentIndex: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: parts,
      currentIndex,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Initialize empty stack. Split "${path}" by "/" into ${parts.length} parts. Process each part.`,
      variables: { path, parts, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (part === '' || part === '.') {
        steps.push({
          line: 3,
          explanation: `Part "${part}": ${part === "" ? "empty string from consecutive slashes" : 'current directory "."'}. Skip.`,
          variables: { i, part, stack: [...stack] },
          visualization: makeViz(i, 'idle'),
        });
      } else if (part === '..') {
        if (stack.length > 0) {
          const popped = stack.pop()!;
          steps.push({
            line: 5,
            explanation: `Part "..": Go up one directory. Pop "${popped}" from stack. New path: /${stack.join('/')}.`,
            variables: { i, part, popped, stack: [...stack] },
            visualization: makeViz(i, 'pop'),
          });
        } else {
          steps.push({
            line: 5,
            explanation: `Part "..": Already at root, stack empty. Nothing to pop.`,
            variables: { i, part, stack: [...stack] },
            visualization: makeViz(i, 'idle'),
          });
        }
      } else {
        stack.push(part);
        steps.push({
          line: 7,
          explanation: `Part "${part}": Valid directory name. Push onto stack. Current path: /${stack.join('/')}.`,
          variables: { i, part, stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      }
    }

    const result = '/' + stack.join('/');
    steps.push({
      line: 8,
      explanation: `All parts processed. Join stack with "/": "${result}".`,
      variables: { result, stack: [...stack] },
      visualization: makeViz(parts.length, 'match'),
    });

    return steps;
  },
};

export default simplifyPath;
