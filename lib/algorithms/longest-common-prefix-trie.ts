import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestCommonPrefixTrie: AlgorithmDefinition = {
  id: 'longest-common-prefix-trie',
  title: 'Longest Common Prefix (Trie)',
  leetcodeNumber: 14,
  difficulty: 'Easy',
  category: 'Trie',
  description:
    'Find the longest common prefix among an array of strings using a trie approach. Insert all strings into the trie, then traverse from the root as long as each node has exactly one child and is not a word end. The depth reached is the length of the longest common prefix.',
  tags: ['trie', 'string', 'prefix'],

  code: {
    pseudocode: `function longestCommonPrefix(strs):
  trie = buildTrie(strs)
  prefix = ""
  node = trie.root
  while True:
    if node.isEnd or len(node.children) != 1:
      break
    ch = only key in node.children
    prefix += ch
    node = node.children[ch]
  return prefix`,

    python: `def longestCommonPrefix(strs):
    if not strs: return ""
    trie = {}
    for s in strs:
        node = trie
        for ch in s:
            node = node.setdefault(ch, {})
        node['#'] = True
    prefix = ""
    node = trie
    while len(node) == 1 and '#' not in node:
        ch = next(iter(node))
        prefix += ch
        node = node[ch]
    return prefix`,

    javascript: `function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  const trie = {};
  for (const s of strs) {
    let node = trie;
    for (const ch of s) { node[ch] = node[ch] || {}; node = node[ch]; }
    node['#'] = true;
  }
  let prefix = '', node = trie;
  while (Object.keys(node).length === 1 && !node['#']) {
    const ch = Object.keys(node)[0];
    prefix += ch;
    node = node[ch];
  }
  return prefix;
}`,

    java: `public String longestCommonPrefix(String[] strs) {
    if (strs.length == 0) return "";
    String prefix = strs[0];
    for (String s : strs)
        while (!s.startsWith(prefix))
            prefix = prefix.substring(0, prefix.length() - 1);
    return prefix;
}`,
  },

  defaultInput: {
    strs: ['flower', 'flow', 'flight'],
  },

  inputFields: [
    {
      name: 'strs',
      label: 'Strings',
      type: 'array',
      defaultValue: ['flower', 'flow', 'flight'],
      placeholder: 'flower,flow,flight',
      helperText: 'Strings to find the common prefix of',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const strs = input.strs as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    if (!strs.length) {
      steps.push({
        line: 1,
        explanation: 'No strings provided. Return empty string.',
        variables: { result: '' },
        visualization: makeViz([], {}, {}),
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Insert all ${strs.length} strings into a trie. Strings: [${strs.join(', ')}].`,
      variables: { strings: strs.join(', ') },
      visualization: makeViz(strs.map((s) => s.length), {}, Object.fromEntries(strs.map((s, i) => [i, s]))),
    });

    // Build trie
    const trie: Record<string, unknown> = {};
    for (let si = 0; si < strs.length; si++) {
      const s = strs[si];
      let node = trie as Record<string, unknown>;
      for (const ch of s) {
        if (!node[ch]) node[ch] = {};
        node = node[ch] as Record<string, unknown>;
      }
      node['#'] = true;

      steps.push({
        line: 3,
        explanation: `Inserted "${s}" into trie. Marked end node with "#".`,
        variables: { word: s },
        visualization: makeViz(strs.map((w) => w.length), { [si]: 'active' }, Object.fromEntries(strs.map((w, i) => [i, i <= si ? 'inserted' : w]))),
      });
    }

    // Traverse to find LCP
    let prefix = '';
    let node = trie as Record<string, unknown>;

    steps.push({
      line: 5,
      explanation: 'Traversing trie from root. Continue while each node has exactly 1 child and is not a word end.',
      variables: { prefix: '' },
      visualization: makeViz(strs.map((s) => s.length), {}, Object.fromEntries(strs.map((s, i) => [i, s]))),
    });

    while (true) {
      const keys = Object.keys(node).filter((k) => k !== '#');
      const isEnd = '#' in node;

      if (keys.length !== 1 || isEnd) {
        steps.push({
          line: 6,
          explanation: `Stop: node has ${keys.length} child(ren) or is a word end. Current prefix: "${prefix}".`,
          variables: { prefix, children: keys.length, isWordEnd: isEnd },
          visualization: makeViz(strs.map((s) => (s.startsWith(prefix) ? prefix.length : 0)), Object.fromEntries(strs.map((_, i) => [i, 'found'])), Object.fromEntries(strs.map((s, i) => [i, s]))),
        });
        break;
      }

      const ch = keys[0];
      prefix += ch;
      node = node[ch] as Record<string, unknown>;

      steps.push({
        line: 8,
        explanation: `Single child "${ch}". Extend prefix to "${prefix}".`,
        variables: { char: ch, prefix },
        visualization: makeViz(strs.map((s) => (s.startsWith(prefix) ? prefix.length : 0)), Object.fromEntries(strs.map((_, i) => [i, 'active'])), Object.fromEntries(strs.map((s, i) => [i, s]))),
      });
    }

    steps.push({
      line: 10,
      explanation: `Longest common prefix is "${prefix}" (length ${prefix.length}).`,
      variables: { result: prefix, length: prefix.length },
      visualization: makeViz(strs.map((s) => (s.startsWith(prefix) ? prefix.length : 0)), Object.fromEntries(strs.map((_, i) => [i, 'found'])), Object.fromEntries(strs.map((s, i) => [i, s]))),
    });

    return steps;
  },
};

export default longestCommonPrefixTrie;
