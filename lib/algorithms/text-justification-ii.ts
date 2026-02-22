import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const textJustificationIi: AlgorithmDefinition = {
  id: 'text-justification-ii',
  title: 'Text Justification',
  leetcodeNumber: 68,
  difficulty: 'Hard',
  category: 'String',
  description:
    'Given words and a max width, format text so each line has exactly maxWidth characters with full justification. Greedily pack words per line, then distribute spaces evenly (extra spaces go to left slots). Last line is left-justified.',
  tags: ['string', 'greedy', 'simulation', 'text formatting'],
  code: {
    pseudocode: `function fullJustify(words, maxWidth):
  result = []
  i = 0
  while i < len(words):
    line_words = [words[i]]
    line_len = len(words[i])
    i++
    while i < len(words) and line_len+1+len(words[i]) <= maxWidth:
      line_words.append(words[i])
      line_len += 1 + len(words[i])
      i++
    result.append(buildLine(line_words, maxWidth, i==len(words)))
  return result`,
    python: `def fullJustify(words, maxWidth):
    result, i = [], 0
    while i < len(words):
        line, length = [words[i]], len(words[i])
        i += 1
        while i < len(words) and length + 1 + len(words[i]) <= maxWidth:
            line.append(words[i])
            length += 1 + len(words[i])
            i += 1
        if i == len(words) or len(line) == 1:
            result.append(' '.join(line).ljust(maxWidth))
        else:
            total_spaces = maxWidth - sum(len(w) for w in line)
            gaps = len(line) - 1
            space, extra = divmod(total_spaces, gaps)
            row = ''
            for j, w in enumerate(line[:-1]):
                row += w + ' ' * (space + (1 if j < extra else 0))
            result.append(row + line[-1])
    return result`,
    javascript: `function fullJustify(words, maxWidth) {
  const result = [];
  let i = 0;
  while (i < words.length) {
    let line = [words[i]], len = words[i].length;
    i++;
    while (i < words.length && len + 1 + words[i].length <= maxWidth) {
      line.push(words[i]); len += 1 + words[i].length; i++;
    }
    if (i === words.length || line.length === 1) {
      result.push(line.join(' ').padEnd(maxWidth));
    } else {
      const totalSpaces = maxWidth - line.reduce((s, w) => s + w.length, 0);
      const gaps = line.length - 1;
      const [space, extra] = [Math.floor(totalSpaces / gaps), totalSpaces % gaps];
      result.push(line.slice(0,-1).map((w,j) => w + ' '.repeat(space + (j < extra ? 1 : 0))).join('') + line.at(-1));
    }
  }
  return result;
}`,
    java: `public List<String> fullJustify(String[] words, int maxWidth) {
    List<String> result = new ArrayList<>();
    int i = 0;
    while (i < words.length) {
        List<String> line = new ArrayList<>();
        line.add(words[i]);
        int len = words[i].length();
        i++;
        while (i < words.length && len + 1 + words[i].length() <= maxWidth) {
            line.add(words[i]); len += 1 + words[i].length(); i++;
        }
        // build line (omitted for brevity)
        result.add(buildLine(line, maxWidth, i == words.length));
    }
    return result;
}`,
  },
  defaultInput: { words: ['This', 'is', 'an', 'example', 'of', 'text', 'justification.'], maxWidth: 16 },
  inputFields: [
    { name: 'words', label: 'Words', type: 'array', defaultValue: ['This', 'is', 'an', 'example', 'of', 'text', 'justification.'], placeholder: 'This,is,an', helperText: 'Words to justify' },
    { name: 'maxWidth', label: 'Max Width', type: 'number', defaultValue: 16, placeholder: '16', helperText: 'Maximum line width' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const maxWidth = input.maxWidth as number;
    const steps: AlgorithmStep[] = [];
    const lines: string[] = [];

    const makeViz = (lineIdx: number, wordsOnLine: string[], result: string[]): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const startIdx = words.indexOf(wordsOnLine[0]);
      wordsOnLine.forEach((w, k) => {
        const wi = words.indexOf(w, startIdx + k);
        if (wi >= 0) highlights[wi] = 'active';
      });
      result.forEach((_, ri) => { /* mark as processed */ });
      const labels: Record<number, string> = {};
      words.forEach((w, i) => { labels[i] = w; });
      return {
        type: 'array',
        array: words.map((_, i) => i),
        highlights,
        labels,
        auxData: {
          label: `Text Justification (width=${maxWidth})`,
          entries: [
            { key: 'current line', value: wordsOnLine.join(' ') },
            { key: 'line length', value: String(wordsOnLine.join(' ').length) },
            { key: 'lines done', value: String(result.length) },
            { key: 'last line', value: result[result.length - 1] ? `"${result[result.length - 1]}"` : '-' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Justify ${words.length} words with maxWidth=${maxWidth}. Greedily pack words per line, then distribute spaces.`,
      variables: { words, maxWidth },
      visualization: makeViz(0, [], []),
    });

    let i = 0;
    while (i < words.length) {
      const lineWords: string[] = [words[i]];
      let lineLen = words[i].length;
      i++;

      while (i < words.length && lineLen + 1 + words[i].length <= maxWidth) {
        lineWords.push(words[i]);
        lineLen += 1 + words[i].length;
        i++;
      }

      steps.push({
        line: 8,
        explanation: `Line ${lines.length + 1}: packed words [${lineWords.map(w => `"${w}"`).join(', ')}], length ${lineLen}.`,
        variables: { lineWords, lineLen },
        visualization: makeViz(lines.length, lineWords, [...lines]),
      });

      let line: string;
      const isLastLine = i === words.length;
      if (isLastLine || lineWords.length === 1) {
        line = lineWords.join(' ').padEnd(maxWidth);
      } else {
        const totalSpaces = maxWidth - lineWords.reduce((s, w) => s + w.length, 0);
        const gaps = lineWords.length - 1;
        const space = Math.floor(totalSpaces / gaps);
        const extra = totalSpaces % gaps;
        line = lineWords.slice(0, -1).map((w, k) => w + ' '.repeat(space + (k < extra ? 1 : 0))).join('') + lineWords[lineWords.length - 1];
      }
      lines.push(line);

      steps.push({
        line: 13,
        explanation: `Justified: "${line}" (${isLastLine ? 'last line - left justified' : 'spaces distributed evenly'}).`,
        variables: { line, isLastLine },
        visualization: makeViz(lines.length - 1, lineWords, [...lines]),
      });
    }

    steps.push({
      line: 15,
      explanation: `All ${lines.length} lines justified:\n${lines.map((l, i) => `  ${i + 1}: "${l}"`).join('\n')}`,
      variables: { result: [...lines] },
      visualization: makeViz(-1, [], lines),
    });

    return steps;
  },
};

export default textJustificationIi;
