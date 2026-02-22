import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const lexicographicallySmallestEquivalentString: AlgorithmDefinition = {
  id: 'lexicographically-smallest-equivalent-string',
  title: 'Lexicographically Smallest Equivalent String',
  leetcodeNumber: 1061,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given two strings s1 and s2 of equal length, characters at the same index are equivalent. Find the lexicographically smallest string equivalent to baseStr. Use union find on the 26 characters, always making the smaller character the root. For each character in baseStr, replace it with the root of its component.',
  tags: ['union find', 'graph', 'string', 'equivalence'],

  code: {
    pseudocode: `function smallestEquivalentString(s1, s2, baseStr):
  parent = ['a'..'z']  // each char is own parent
  for i in 0..len(s1)-1:
    union(s1[i], s2[i])  // always keep smaller char as root
  result = ""
  for ch in baseStr:
    result += find(ch)  // replace with smallest equivalent
  return result`,

    python: `def smallestEquivalentString(s1, s2, baseStr):
    parent = list(range(26))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        pa, pb = find(a), find(b)
        if pa != pb:
            # always smaller as root
            if pa < pb: parent[pb] = pa
            else: parent[pa] = pb
    for c1, c2 in zip(s1, s2):
        union(ord(c1)-97, ord(c2)-97)
    return ''.join(chr(find(ord(c)-97)+97) for c in baseStr)`,

    javascript: `function smallestEquivalentString(s1, s2, baseStr) {
  const parent=Array.from({length:26},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  function union(a,b){
    const pa=find(a),pb=find(b);
    if(pa!==pb){if(pa<pb)parent[pb]=pa;else parent[pa]=pb;}
  }
  for(let i=0;i<s1.length;i++)
    union(s1.charCodeAt(i)-97,s2.charCodeAt(i)-97);
  return [...baseStr].map(c=>String.fromCharCode(find(c.charCodeAt(0)-97)+97)).join('');
}`,

    java: `public String smallestEquivalentString(String s1, String s2, String baseStr) {
    int[] parent=new int[26];
    for(int i=0;i<26;i++) parent[i]=i;
    for(int i=0;i<s1.length();i++){
        int a=s1.charAt(i)-'a', b=s2.charAt(i)-'a';
        int pa=find(parent,a), pb=find(parent,b);
        if(pa!=pb){if(pa<pb)parent[pb]=pa;else parent[pa]=pb;}
    }
    StringBuilder sb=new StringBuilder();
    for(char c:baseStr.toCharArray()) sb.append((char)(find(parent,c-'a')+'a'));
    return sb.toString();
}`,
  },

  defaultInput: {
    s1: 'parker',
    s2: 'morris',
    baseStr: 'parser',
  },

  inputFields: [
    {
      name: 's1',
      label: 'String S1',
      type: 'string',
      defaultValue: 'parker',
      placeholder: 'parker',
      helperText: 'First equivalence string',
    },
    {
      name: 's2',
      label: 'String S2',
      type: 'string',
      defaultValue: 'morris',
      placeholder: 'morris',
      helperText: 'Second equivalence string (same length as s1)',
    },
    {
      name: 'baseStr',
      label: 'Base String',
      type: 'string',
      defaultValue: 'parser',
      placeholder: 'parser',
      helperText: 'String to transform to lexicographically smallest equivalent',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const s2 = input.s2 as string;
    const baseStr = input.baseStr as string;
    const steps: AlgorithmStep[] = [];

    const parent: number[] = Array.from({ length: 26 }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    function union(a: number, b: number): void {
      const pa = find(a), pb = find(b);
      if (pa !== pb) {
        if (pa < pb) parent[pb] = pa;
        else parent[pa] = pb;
      }
    }

    steps.push({
      line: 1,
      explanation: `Initialize union-find for 26 letters (a=0, z=25). Always keep smaller letter as root for lexicographic minimality.`,
      variables: { s1, s2, baseStr },
      visualization: {
        type: 'array',
        array: parent.slice(0, 10),
        highlights: {},
        labels: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i, String.fromCharCode(97 + i)])),
      },
    });

    for (let i = 0; i < s1.length; i++) {
      const c1 = s1.charCodeAt(i) - 97;
      const c2 = s2.charCodeAt(i) - 97;
      union(c1, c2);

      steps.push({
        line: 4,
        explanation: `Position ${i}: s1[${i}]='${s1[i]}' and s2[${i}]='${s2[i]}' are equivalent. Union them with smaller as root. Root of '${s1[i]}' is now '${String.fromCharCode(find(c1) + 97)}'.`,
        variables: { i, char1: s1[i], char2: s2[i], root: String.fromCharCode(find(c1) + 97) },
        visualization: {
          type: 'array',
          array: parent.slice(0, 10),
          highlights: { [c1]: 'active', [c2]: 'comparing' },
          labels: { [c1]: `${s1[i]}->r:${String.fromCharCode(find(c1) + 97)}`, [c2]: `${s2[i]}->r:${String.fromCharCode(find(c2) + 97)}` },
        },
      });
    }

    steps.push({
      line: 6,
      explanation: `All equivalences established. Now transform each character in baseStr "${baseStr}" to its smallest equivalent.`,
      variables: { baseStr },
      visualization: {
        type: 'array',
        array: parent.slice(0, 10),
        highlights: {},
        labels: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i, `${String.fromCharCode(97 + i)}->${String.fromCharCode(find(i) + 97)}`])),
      },
    });

    let result = '';
    for (let i = 0; i < baseStr.length; i++) {
      const c = baseStr.charCodeAt(i) - 97;
      const smallest = String.fromCharCode(find(c) + 97);
      result += smallest;

      steps.push({
        line: 8,
        explanation: `baseStr[${i}]='${baseStr[i]}': smallest equivalent is '${smallest}'. Result so far: "${result}".`,
        variables: { char: baseStr[i], smallest, result },
        visualization: {
          type: 'array',
          array: [...baseStr].map((_, k) => k),
          highlights: { [i]: 'found' },
          labels: Object.fromEntries([...baseStr].map((ch, k) => [k, k < i ? String.fromCharCode(find(ch.charCodeAt(0) - 97) + 97) : k === i ? smallest : ch])),
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `Final result: "${result}". This is the lexicographically smallest equivalent string.`,
      variables: { original: baseStr, result },
      visualization: {
        type: 'array',
        array: [...result].map((_, i) => i),
        highlights: Object.fromEntries([...result].map((_, i) => [i, 'found'])),
        labels: Object.fromEntries([...result].map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default lexicographicallySmallestEquivalentString;
