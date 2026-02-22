import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const assignCookiesGreedy: AlgorithmDefinition = {
  id: 'assign-cookies-greedy',
  title: 'Assign Cookies (Greedy)',
  leetcodeNumber: 455,
  difficulty: 'Easy',
  category: 'Greedy',
  description:
    'Each child i has a greed factor g[i] and each cookie j has size s[j]. A cookie satisfies a child if s[j] >= g[i]. Maximize the number of content children. Greedy: sort both arrays and use two pointers to greedily match the smallest sufficient cookie to the least greedy child.',
  tags: ['greedy', 'sorting', 'two pointers'],

  code: {
    pseudocode: `function findContentChildren(g, s):
  sort g ascending
  sort s ascending
  child = 0
  cookie = 0
  while child < len(g) and cookie < len(s):
    if s[cookie] >= g[child]:
      child++
    cookie++
  return child`,

    python: `def findContentChildren(g: list[int], s: list[int]) -> int:
    g.sort()
    s.sort()
    child = cookie = 0
    while child < len(g) and cookie < len(s):
        if s[cookie] >= g[child]:
            child += 1
        cookie += 1
    return child`,

    javascript: `function findContentChildren(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  let child = 0, cookie = 0;
  while (child < g.length && cookie < s.length) {
    if (s[cookie] >= g[child]) child++;
    cookie++;
  }
  return child;
}`,

    java: `public int findContentChildren(int[] g, int[] s) {
    Arrays.sort(g);
    Arrays.sort(s);
    int child = 0, cookie = 0;
    while (child < g.length && cookie < s.length) {
        if (s[cookie] >= g[child]) child++;
        cookie++;
    }
    return child;
}`,
  },

  defaultInput: {
    g: [1, 2, 3],
    s: [1, 1],
  },

  inputFields: [
    {
      name: 'g',
      label: 'Children Greed Factors',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Greed factor for each child',
    },
    {
      name: 's',
      label: 'Cookie Sizes',
      type: 'array',
      defaultValue: [1, 1],
      placeholder: '1,1',
      helperText: 'Size of each cookie',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const g = [...(input.g as number[])].sort((a, b) => a - b);
    const s = [...(input.s as number[])].sort((a, b) => a - b);
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Sort children by greed: [${g.join(', ')}]. Sort cookies by size: [${s.join(', ')}]. Use two pointers.`,
      variables: { g: [...g], s: [...s] },
      visualization: {
        type: 'array',
        array: [...s],
        highlights: {},
        labels: Object.fromEntries(s.map((sz, i) => [i, `s=${sz}`])) as Record<number, string>,
      },
    });

    let child = 0;
    let cookie = 0;

    while (child < g.length && cookie < s.length) {
      if (s[cookie] >= g[child]) {
        steps.push({
          line: 6,
          explanation: `Cookie ${cookie} (size=${s[cookie]}) >= child ${child} greed (${g[child]}). Assign cookie. Content children: ${child + 1}.`,
          variables: { child, cookie, 's[cookie]': s[cookie], 'g[child]': g[child], contentSoFar: child + 1 },
          visualization: {
            type: 'array',
            array: [...s],
            highlights: {
              [cookie]: 'found',
              ...Object.fromEntries(Array.from({ length: cookie }, (_, j) => [j, j < child + 1 ? 'sorted' : 'visited'])),
            } as Record<number, string>,
            labels: { [cookie]: `->c${child}` } as Record<number, string>,
          },
        });
        child++;
      } else {
        steps.push({
          line: 7,
          explanation: `Cookie ${cookie} (size=${s[cookie]}) < child ${child} greed (${g[child]}). Cookie too small. Move to next cookie.`,
          variables: { child, cookie, 's[cookie]': s[cookie], 'g[child]': g[child] },
          visualization: {
            type: 'array',
            array: [...s],
            highlights: { [cookie]: 'mismatch' } as Record<number, string>,
            labels: { [cookie]: 'small' } as Record<number, string>,
          },
        });
      }
      cookie++;
    }

    steps.push({
      line: 8,
      explanation: `Maximum content children: ${child}.`,
      variables: { result: child },
      visualization: {
        type: 'array',
        array: [...s],
        highlights: Object.fromEntries(s.map((_, i) => [i, i < child ? 'found' : 'visited'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default assignCookiesGreedy;
