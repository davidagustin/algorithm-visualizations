import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const textJustification: AlgorithmDefinition = {
  id: 'text-justification',
  title: 'Text Justification',
  leetcodeNumber: 68,
  difficulty: 'Hard',
  category: 'String',
  description:
    'Given an array of words and a max width, format the text so each line has exactly maxWidth characters with fully justified text (except the last line which is left-justified). Extra spaces are distributed as evenly as possible, with extra spaces going to the leftmost slots.',
  tags: ['string', 'greedy', 'simulation'],

  code: {
    pseudocode: `function fullJustify(words, maxWidth):
  result = []
  i = 0
  while i < len(words):
    lineWords = [], lineLen = 0
    while i < len(words) and lineLen + len(words[i]) <= maxWidth:
      lineWords.append(words[i])
      lineLen += len(words[i]) + 1
      i++
    if i == len(words) or len(lineWords) == 1:
      result.append(leftJustify(lineWords, maxWidth))
    else:
      result.append(fullJustifyLine(lineWords, maxWidth))
  return result`,

    python: `def fullJustify(words, maxWidth):
    result = []
    i = 0
    while i < len(words):
        line_words = [words[i]]
        line_len = len(words[i])
        i += 1
        while i < len(words) and line_len + 1 + len(words[i]) <= maxWidth:
            line_len += 1 + len(words[i])
            line_words.append(words[i])
            i += 1
        if i == len(words) or len(line_words) == 1:
            result.append(' '.join(line_words).ljust(maxWidth))
        else:
            spaces = maxWidth - sum(len(w) for w in line_words)
            gaps = len(line_words) - 1
            q, r = divmod(spaces, gaps)
            line = ''
            for j, w in enumerate(line_words[:-1]):
                line += w + ' ' * (q + (1 if j < r else 0))
            result.append(line + line_words[-1])
    return result`,

    javascript: `function fullJustify(words, maxWidth) {
  const result = [];
  let i = 0;
  while (i < words.length) {
    const line = [words[i++]];
    let len = line[0].length;
    while (i < words.length && len + 1 + words[i].length <= maxWidth) {
      len += 1 + words[i].length;
      line.push(words[i++]);
    }
    if (i === words.length || line.length === 1) {
      result.push(line.join(' ').padEnd(maxWidth));
    } else {
      const spaces = maxWidth - line.reduce((s, w) => s + w.length, 0);
      const gaps = line.length - 1;
      let row = '';
      line.forEach((w, j) => {
        if (j < gaps) row += w + ' '.repeat(Math.floor(spaces/gaps) + (j < spaces%gaps ? 1 : 0));
        else row += w;
      });
      result.push(row);
    }
  }
  return result;
}`,

    java: `public List<String> fullJustify(String[] words, int maxWidth) {
    List<String> result = new ArrayList<>();
    int i = 0;
    while (i < words.length) {
        List<String> line = new ArrayList<>();
        line.add(words[i++]);
        int len = line.get(0).length();
        while (i < words.length && len + 1 + words[i].length() <= maxWidth) {
            len += 1 + words[i].length();
            line.add(words[i++]);
        }
        // build justified line
        result.add(buildLine(line, maxWidth, i == words.length));
    }
    return result;
}`,
  },

  defaultInput: {
    words: 'This,is,an,example,of,text,justification',
    maxWidth: 16,
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'string',
      defaultValue: 'This,is,an,example,of,text,justification',
      placeholder: 'This,is,an,example',
      helperText: 'Comma-separated words to justify',
    },
    {
      name: 'maxWidth',
      label: 'Max Width',
      type: 'number',
      defaultValue: 16,
      placeholder: '16',
      helperText: 'Maximum width of each line',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const wordsStr = input.words as string;
    const maxWidth = input.maxWidth as number;
    const words = wordsStr.split(',').map(w => w.trim());
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `${words.length} words, maxWidth=${maxWidth}. Greedily pack words into lines, then justify each line.`,
      variables: { wordCount: words.length, maxWidth },
      visualization: {
        type: 'array',
        array: words.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(words.map((w, i) => [i, w])),
      },
    });

    const result: string[] = [];
    let i = 0;
    let lineNum = 0;

    while (i < words.length) {
      lineNum++;
      const lineWords: string[] = [words[i]];
      let len = words[i].length;
      const lineStart = i;
      i++;

      while (i < words.length && len + 1 + words[i].length <= maxWidth) {
        len += 1 + words[i].length;
        lineWords.push(words[i]);
        i++;
      }

      steps.push({
        line: 5,
        explanation: `Line ${lineNum}: packed words [${lineWords.map(w => `"${w}"`).join(', ')}], total chars=${len}, maxWidth=${maxWidth}.`,
        variables: { lineNum, lineWords: lineWords.join(', '), len, maxWidth, wordCount: lineWords.length },
        visualization: {
          type: 'array',
          array: words.map((_, idx) => idx),
          highlights: {
            ...Object.fromEntries(Array.from({ length: lineWords.length }, (_, j) => [lineStart + j, 'active'])),
            ...Object.fromEntries(Array.from({ length: lineStart }, (_, j) => [j, 'sorted'])),
          },
          labels: Object.fromEntries(words.map((w, idx) => [idx, w])),
        },
      });

      let line: string;
      const isLastLine = i === words.length;
      const isSingleWord = lineWords.length === 1;

      if (isLastLine || isSingleWord) {
        line = lineWords.join(' ').padEnd(maxWidth);
        steps.push({
          line: 9,
          explanation: `${isLastLine ? 'Last line' : 'Single word line'}: left-justify. "${line}"`,
          variables: { lineType: isLastLine ? 'last' : 'single', line, length: line.length },
          visualization: {
            type: 'array',
            array: lineWords.map((_, j) => j),
            highlights: Object.fromEntries(lineWords.map((_, j) => [j, 'found'])),
            labels: Object.fromEntries(lineWords.map((w, j) => [j, w])),
          },
        });
      } else {
        const totalChars = lineWords.reduce((s, w) => s + w.length, 0);
        const spaces = maxWidth - totalChars;
        const gaps = lineWords.length - 1;
        const baseSpaces = Math.floor(spaces / gaps);
        const extra = spaces % gaps;

        steps.push({
          line: 11,
          explanation: `Full justify: totalChars=${totalChars}, spaces=${spaces}, gaps=${gaps}, baseSpaces=${baseSpaces}, extra=${extra}`,
          variables: { totalChars, spaces, gaps, baseSpaces, extra },
          visualization: {
            type: 'array',
            array: lineWords.map((_, j) => j),
            highlights: Object.fromEntries(lineWords.map((_, j) => [j, 'comparing'])),
            labels: Object.fromEntries(lineWords.map((w, j) => [j, w])),
          },
        });

        let row = '';
        lineWords.forEach((w, j) => {
          if (j < gaps) {
            const sp = baseSpaces + (j < extra ? 1 : 0);
            row += w + ' '.repeat(sp);
          } else {
            row += w;
          }
        });
        line = row;

        steps.push({
          line: 11,
          explanation: `Justified line: "${line}" (length=${line.length})`,
          variables: { line, length: line.length },
          visualization: {
            type: 'array',
            array: lineWords.map((_, j) => j),
            highlights: Object.fromEntries(lineWords.map((_, j) => [j, 'found'])),
            labels: Object.fromEntries(lineWords.map((w, j) => [j, w])),
          },
        });
      }

      result.push(line);
    }

    steps.push({
      line: 12,
      explanation: `All ${result.length} line(s) built. Result:\n${result.map((l, i) => `Line ${i + 1}: "|${l}|"`).join('\n')}`,
      variables: { lineCount: result.length, result: result.join(' | ') },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i),
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((l, i) => [i, `L${i + 1}:${l.trim()}`])),
      },
    });

    return steps;
  },
};

export default textJustification;
