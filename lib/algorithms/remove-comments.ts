import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeComments: AlgorithmDefinition = {
  id: 'remove-comments',
  title: 'Remove Comments',
  leetcodeNumber: 722,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Given a C++ source code as an array of lines, remove all comments. Block comments start with /* and end with */. Line comments start with // and extend to end of line. A block comment can span multiple lines.',
  tags: ['string', 'simulation'],

  code: {
    pseudocode: `function removeComments(source):
  result = []
  inBlock = false
  current = ""
  for line in source:
    i = 0
    if not inBlock: current = ""
    while i < len(line):
      if not inBlock and line[i:i+2] == "/*":
        inBlock = true; i += 2
      elif inBlock and line[i:i+2] == "*/":
        inBlock = false; i += 2
      elif not inBlock and line[i:i+2] == "//":
        break
      elif not inBlock:
        current += line[i]; i++
      else:
        i++
    if not inBlock and current:
      result.append(current)
  return result`,

    python: `def removeComments(source: list[str]) -> list[str]:
    result = []
    in_block = False
    current = ""
    for line in source:
        i = 0
        if not in_block:
            current = ""
        while i < len(line):
            if not in_block and line[i:i+2] == '/*':
                in_block = True; i += 2
            elif in_block and line[i:i+2] == '*/':
                in_block = False; i += 2
            elif not in_block and line[i:i+2] == '//':
                break
            elif not in_block:
                current += line[i]; i += 1
            else:
                i += 1
        if not in_block and current:
            result.append(current)
    return result`,

    javascript: `function removeComments(source) {
  const result = [];
  let inBlock = false, current = '';
  for (const line of source) {
    let i = 0;
    if (!inBlock) current = '';
    while (i < line.length) {
      if (!inBlock && line.slice(i, i+2) === '/*') { inBlock = true; i += 2; }
      else if (inBlock && line.slice(i, i+2) === '*/') { inBlock = false; i += 2; }
      else if (!inBlock && line.slice(i, i+2) === '//') break;
      else if (!inBlock) { current += line[i]; i++; }
      else i++;
    }
    if (!inBlock && current) result.push(current);
  }
  return result;
}`,

    java: `public List<String> removeComments(String[] source) {
    List<String> result = new ArrayList<>();
    boolean inBlock = false;
    StringBuilder current = new StringBuilder();
    for (String line : source) {
        int i = 0;
        if (!inBlock) current = new StringBuilder();
        while (i < line.length()) {
            if (!inBlock && i+1 < line.length() && line.charAt(i) == '/' && line.charAt(i+1) == '*') { inBlock = true; i += 2; }
            else if (inBlock && i+1 < line.length() && line.charAt(i) == '*' && line.charAt(i+1) == '/') { inBlock = false; i += 2; }
            else if (!inBlock && i+1 < line.length() && line.charAt(i) == '/' && line.charAt(i+1) == '/') break;
            else if (!inBlock) { current.append(line.charAt(i)); i++; }
            else i++;
        }
        if (!inBlock && current.length() > 0) result.add(current.toString());
    }
    return result;
}`,
  },

  defaultInput: {
    source: 'int main() {,  /* block,  comment */ int x = 1; // line comment,  return x;,}',
  },

  inputFields: [
    {
      name: 'source',
      label: 'Source Lines (comma-separated)',
      type: 'string',
      defaultValue: 'int main() {,  /* block,  comment */ int x = 1; // line comment,  return x;,}',
      placeholder: 'int main() {,/* block comment */,// line comment',
      helperText: 'Source code lines separated by commas',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const sourceRaw = input.source as string;
    const source = sourceRaw.split(',');
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: source as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Process ${source.length} source lines. Track block comment state and build cleaned lines.`,
      variables: { lineCount: source.length, inBlock: false },
      visualization: makeViz({}, {}),
    });

    const result: string[] = [];
    let inBlock = false;
    let current = '';

    for (let li = 0; li < source.length; li++) {
      const line = source[li];
      let i = 0;
      if (!inBlock) current = '';

      steps.push({
        line: 4,
        explanation: `Line ${li}: "${line}". inBlock=${inBlock}. ${!inBlock ? 'Reset current="".' : 'Continue block comment.'}`,
        variables: { lineIndex: li, line, inBlock, current },
        visualization: makeViz({ [li]: 'active' }, { [li]: `line ${li}` }),
      });

      while (i < line.length) {
        if (!inBlock && line.slice(i, i + 2) === '/*') {
          steps.push({
            line: 6,
            explanation: `Found /* at position ${i}. Enter block comment mode.`,
            variables: { position: i, inBlock: true },
            visualization: makeViz({ [li]: 'comparing' }, { [li]: '/* start' }),
          });
          inBlock = true;
          i += 2;
        } else if (inBlock && line.slice(i, i + 2) === '*/') {
          steps.push({
            line: 8,
            explanation: `Found */ at position ${i}. Exit block comment mode.`,
            variables: { position: i, inBlock: false },
            visualization: makeViz({ [li]: 'comparing' }, { [li]: '*/ end' }),
          });
          inBlock = false;
          i += 2;
        } else if (!inBlock && line.slice(i, i + 2) === '//') {
          steps.push({
            line: 10,
            explanation: `Found // at position ${i}. Skip rest of line.`,
            variables: { position: i },
            visualization: makeViz({ [li]: 'visited' }, { [li]: '// skip' }),
          });
          break;
        } else if (!inBlock) {
          current += line[i];
          i++;
        } else {
          i++;
        }
      }

      if (!inBlock && current) {
        result.push(current);
        steps.push({
          line: 15,
          explanation: `End of line ${li}. Not in block comment and current="${current}" is non-empty. Add to result.`,
          variables: { current, resultSize: result.length },
          visualization: makeViz({ [li]: 'found' }, { [li]: `=> "${current}"` }),
        });
      }
    }

    steps.push({
      line: 16,
      explanation: `Done. Result: [${result.map(r => `"${r}"`).join(', ')}].`,
      variables: { result: result.join(' | '), lineCount: result.length },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default removeComments;
