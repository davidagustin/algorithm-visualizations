import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfLinesToWriteString: AlgorithmDefinition = {
  id: 'number-of-lines-to-write-string',
  title: 'Number of Lines To Write String',
  leetcodeNumber: 806,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a widths array where widths[i] is the width of character i (a=0 to z=25), and a string s, find the number of lines needed and the width of the last line when each line has at most 100 units width.',
  tags: ['string', 'simulation'],

  code: {
    pseudocode: `function numberOfLines(widths, s):
  lines = 1
  currentWidth = 0
  for char in s:
    w = widths[char - 'a']
    if currentWidth + w > 100:
      lines++
      currentWidth = w
    else:
      currentWidth += w
  return [lines, currentWidth]`,

    python: `def numberOfLines(widths: list[int], s: str) -> list[int]:
    lines = 1
    current = 0
    for c in s:
        w = widths[ord(c) - ord('a')]
        if current + w > 100:
            lines += 1
            current = w
        else:
            current += w
    return [lines, current]`,

    javascript: `function numberOfLines(widths, s) {
  let lines = 1, current = 0;
  for (const c of s) {
    const w = widths[c.charCodeAt(0) - 97];
    if (current + w > 100) { lines++; current = w; }
    else current += w;
  }
  return [lines, current];
}`,

    java: `public int[] numberOfLines(int[] widths, String s) {
    int lines = 1, current = 0;
    for (char c : s.toCharArray()) {
        int w = widths[c - 'a'];
        if (current + w > 100) { lines++; current = w; }
        else current += w;
    }
    return new int[]{lines, current};
}`,
  },

  defaultInput: {
    s: 'abcdefghijklmnopqrstuvwxyz',
    widths: '10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abcdefghijklmnopqrstuvwxyz',
      placeholder: 'abcdefghijklmnopqrstuvwxyz',
      helperText: 'The string to write',
    },
    {
      name: 'widths',
      label: 'Widths (26 values, comma-separated)',
      type: 'string',
      defaultValue: '10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10',
      placeholder: '10,10,...',
      helperText: 'Width of each letter a-z (26 values)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const widthsRaw = input.widths as string;
    const widths = widthsRaw.split(',').map(Number);
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: s.split('') as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Write string "${s}" with each line max 100 units wide. Initialize lines=1, currentWidth=0.`,
      variables: { s, lines: 1, currentWidth: 0 },
      visualization: makeViz({}, {}),
    });

    let lines = 1;
    let current = 0;

    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      const w = widths[c.charCodeAt(0) - 97];

      if (current + w > 100) {
        lines++;
        steps.push({
          line: 6,
          explanation: `Character "${c}" (width=${w}): current ${current} + ${w} = ${current + w} > 100. Start new line ${lines}. current=${w}.`,
          variables: { char: c, width: w, lines, currentWidth: w },
          visualization: makeViz({ [i]: 'active' }, { [i]: `line${lines}` }),
        });
        current = w;
      } else {
        current += w;
        steps.push({
          line: 8,
          explanation: `Character "${c}" (width=${w}): current=${current} fits on line ${lines}.`,
          variables: { char: c, width: w, lines, currentWidth: current },
          visualization: makeViz({ [i]: 'found' }, { [i]: `${current}u` }),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Result: [${lines}, ${current}] - ${lines} lines, last line width=${current}.`,
      variables: { result: [lines, current] },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default numberOfLinesToWriteString;
