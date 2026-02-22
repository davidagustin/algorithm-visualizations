import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const addBoldTagInString: AlgorithmDefinition = {
  id: 'add-bold-tag-in-string',
  title: 'Add Bold Tag in String',
  leetcodeNumber: 616,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Given a string s and a list of words, add bold tags around substrings of s that match any word in the list. Overlapping and adjacent matches should be merged into a single bold range. Build a trie from the word list, then for each position in s, find all word matches (potentially overlapping). Mark covered positions, then merge intervals and insert the bold tags.',
  tags: ['trie', 'string', 'interval merging'],

  code: {
    pseudocode: `function addBoldTag(s, words):
  trie = buildTrie(words)
  n = len(s)
  bold = [False] * n

  for i in range(n):
    node = trie.root
    for j in range(i, n):
      if s[j] not in node.children: break
      node = node.children[s[j]]
      if node.isEnd:
        for k in range(i, j + 1):
          bold[k] = True

  result = []
  i = 0
  while i < n:
    if not bold[i]:
      result.append(s[i]); i++
    else:
      j = i
      while j < n and bold[j]: j++
      result.append("<b>" + s[i:j] + "</b>")
      i = j
  return "".join(result)`,

    python: `def addBoldTag(s, words):
    trie = {}
    for w in words:
        node = trie
        for ch in w:
            node = node.setdefault(ch, {})
        node['#'] = True
    n = len(s)
    bold = [False] * n
    for i in range(n):
        node = trie
        for j in range(i, n):
            if s[j] not in node: break
            node = node[s[j]]
            if '#' in node:
                for k in range(i, j + 1): bold[k] = True
    res = []
    i = 0
    while i < n:
        if not bold[i]: res.append(s[i]); i += 1
        else:
            j = i
            while j < n and bold[j]: j += 1
            res.append('<b>' + s[i:j] + '</b>'); i = j
    return ''.join(res)`,

    javascript: `function addBoldTag(s, words) {
  const trie = {};
  for (const w of words) {
    let node = trie;
    for (const ch of w) { node[ch] = node[ch] || {}; node = node[ch]; }
    node['#'] = true;
  }
  const n = s.length;
  const bold = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    let node = trie;
    for (let j = i; j < n; j++) {
      if (!node[s[j]]) break;
      node = node[s[j]];
      if (node['#']) for (let k = i; k <= j; k++) bold[k] = true;
    }
  }
  let res = '', i = 0;
  while (i < n) {
    if (!bold[i]) { res += s[i++]; }
    else {
      let j = i;
      while (j < n && bold[j]) j++;
      res += '<b>' + s.slice(i, j) + '</b>'; i = j;
    }
  }
  return res;
}`,

    java: `// Build trie, mark bold positions, then merge intervals and wrap in <b> tags`,
  },

  defaultInput: {
    s: 'abcxyz123',
    words: ['abc', 'xyz'],
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abcxyz123',
      placeholder: 'abcxyz123',
      helperText: 'String to add bold tags to',
    },
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['abc', 'xyz'],
      placeholder: 'abc,xyz',
      helperText: 'Words to bold in the string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const words = input.words as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    // Build trie
    const trie: Record<string, unknown> = {};
    for (const w of words) {
      let node = trie as Record<string, unknown>;
      for (const ch of w) {
        if (!node[ch]) node[ch] = {};
        node = node[ch] as Record<string, unknown>;
      }
      node['#'] = true;
    }

    const n = s.length;
    const bold = new Array(n).fill(false);

    steps.push({
      line: 1,
      explanation: `Built trie from words: [${words.join(', ')}]. Now scan string "${s}" to find all matches.`,
      variables: { s, words: words.join(', ') },
      visualization: makeViz(s.split('').map(() => 0), {}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    for (let i = 0; i < n; i++) {
      let node = trie as Record<string, unknown>;
      for (let j = i; j < n; j++) {
        const ch = s[j];
        if (!node[ch]) break;
        node = node[ch] as Record<string, unknown>;
        if (node['#']) {
          for (let k = i; k <= j; k++) bold[k] = true;
          steps.push({
            line: 10,
            explanation: `Found word "${s.slice(i, j + 1)}" at positions [${i}, ${j}]. Mark as bold.`,
            variables: { word: s.slice(i, j + 1), start: i, end: j },
            visualization: makeViz(bold.map((b) => (b ? 1 : 0)), Object.fromEntries([...Array(j - i + 1)].map((_, k) => [i + k, 'found'])), Object.fromEntries(s.split('').map((c, idx) => [idx, c]))),
          });
        }
      }
    }

    steps.push({
      line: 14,
      explanation: `Bold marking complete. Bold positions: [${bold.map((b, i) => (b ? i : '')).filter((x) => x !== '').join(', ')}].`,
      variables: { boldPositions: bold.filter(Boolean).length },
      visualization: makeViz(bold.map((b) => (b ? 1 : 0)), Object.fromEntries(bold.map((b, i) => [i, b ? 'found' : 'default'])), Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    // Build result
    let result = '';
    let i = 0;
    const boldRanges: [number, number][] = [];
    while (i < n) {
      if (!bold[i]) {
        i++;
      } else {
        let j = i;
        while (j < n && bold[j]) j++;
        boldRanges.push([i, j - 1]);
        result += '<b>' + s.slice(i, j) + '</b>';
        i = j;
      }
    }

    for (const [start, end] of boldRanges) {
      steps.push({
        line: 18,
        explanation: `Bold range [${start}, ${end}]: "${s.slice(start, end + 1)}" -> wrapped in "<b>${s.slice(start, end + 1)}</b>".`,
        variables: { start, end, boldText: s.slice(start, end + 1) },
        visualization: makeViz(bold.map((b) => (b ? 1 : 0)), Object.fromEntries([...Array(end - start + 1)].map((_, k) => [start + k, 'found'])), Object.fromEntries(s.split('').map((c, idx) => [idx, c]))),
      });
    }

    // Fill in non-bold parts too
    let finalResult = '';
    i = 0;
    while (i < n) {
      if (!bold[i]) {
        let j = i;
        while (j < n && !bold[j]) j++;
        finalResult += s.slice(i, j);
        i = j;
      } else {
        let j = i;
        while (j < n && bold[j]) j++;
        finalResult += '<b>' + s.slice(i, j) + '</b>';
        i = j;
      }
    }

    steps.push({
      line: 20,
      explanation: `Final result: "${finalResult}".`,
      variables: { result: finalResult },
      visualization: makeViz(s.split('').map(() => 1), Object.fromEntries(bold.map((b, i) => [i, b ? 'found' : 'default'])), Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    return steps;
  },
};

export default addBoldTagInString;
