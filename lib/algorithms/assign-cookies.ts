import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const assignCookies: AlgorithmDefinition = {
  id: 'assign-cookies',
  title: 'Assign Cookies',
  leetcodeNumber: 455,
  difficulty: 'Easy',
  category: 'Greedy',
  description:
    'You want to give cookies to children to maximize the number of content children. Child i needs greed[i] units. Cookie j has size s[j]. Assign at most one cookie per child. Greedy: sort both arrays, use two pointers. Try to satisfy the least greedy child first with the smallest sufficient cookie.',
  tags: ['Greedy', 'Sorting', 'Two Pointers'],
  code: {
    pseudocode: `function findContentChildren(g, s):
  sort(g), sort(s)
  child = 0, cookie = 0
  while child < g.length and cookie < s.length:
    if s[cookie] >= g[child]:
      child++  // child satisfied
    cookie++   // move to next cookie regardless
  return child`,
    python: `def findContentChildren(g, s):
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
  defaultInput: { g: [1, 2, 3], s: [1, 1] },
  inputFields: [
    {
      name: 'g',
      label: 'Greed factors (children)',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: 'e.g. 1,2,3',
      helperText: 'Minimum cookie size each child needs',
    },
    {
      name: 's',
      label: 'Cookie sizes',
      type: 'array',
      defaultValue: [1, 1],
      placeholder: 'e.g. 1,1',
      helperText: 'Size of each cookie available',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const g = (input.g as number[]).slice().sort((a, b) => a - b);
    const s = (input.s as number[]).slice().sort((a, b) => a - b);
    const steps: AlgorithmStep[] = [];
    let child = 0, cookie = 0;

    function makeViz(): ArrayVisualization {
      // Show greed array with pointer labels
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < g.length; i++) {
        labels[i] = String(g[i]);
        if (i < child) highlights[i] = 'found';
        else if (i === child) highlights[i] = 'active';
        else highlights[i] = 'default';
      }
      return {
        type: 'array',
        array: g.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Assignment State',
          entries: [
            { key: 'Children sorted', value: g.join(', ') },
            { key: 'Cookies sorted', value: s.join(', ') },
            { key: 'Child pointer', value: String(child) },
            { key: 'Cookie pointer', value: String(cookie) },
            { key: 'Content children', value: String(child) },
            { key: 'Current cookie size', value: cookie < s.length ? String(s[cookie]) : 'none' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort greed: [${g.join(', ')}]. Sort cookies: [${s.join(', ')}]. Use two pointers to greedily assign smallest sufficient cookie.`,
      variables: { g: g.slice(), s: s.slice() },
      visualization: makeViz(),
    });

    steps.push({
      line: 2,
      explanation: `Initialize child=0, cookie=0.`,
      variables: { child, cookie },
      visualization: makeViz(),
    });

    while (child < g.length && cookie < s.length) {
      const satisfied = s[cookie] >= g[child];
      steps.push({
        line: 4,
        explanation: `Cookie[${cookie}]=${s[cookie]} vs Child[${child}] greed=${g[child]}: ${satisfied ? 'satisfies! Content child++' : 'too small, try next cookie'}.`,
        variables: { cookie: s[cookie], greed: g[child], satisfied },
        visualization: (() => {
          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          for (let i = 0; i < g.length; i++) {
            l[i] = String(g[i]);
            if (i < child) h[i] = 'found';
            else if (i === child) h[i] = satisfied ? 'found' : 'comparing';
            else h[i] = 'default';
          }
          return {
            type: 'array' as const,
            array: g.slice(),
            highlights: h,
            labels: l,
            auxData: {
              label: 'Assignment State',
              entries: [
                { key: 'Cookie size', value: String(s[cookie]) },
                { key: 'Child greed', value: String(g[child]) },
                { key: 'Result', value: satisfied ? 'Satisfied!' : 'Not enough' },
                { key: 'Content so far', value: String(satisfied ? child + 1 : child) },
              ],
            },
          };
        })(),
      });
      if (satisfied) child++;
      cookie++;
    }

    steps.push({
      line: 7,
      explanation: `Done. ${child} children can be content with the given cookies.`,
      variables: { contentChildren: child },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < g.length; i++) {
          l[i] = String(g[i]);
          h[i] = i < child ? 'found' : 'mismatch';
        }
        return {
          type: 'array' as const,
          array: g.slice(),
          highlights: h,
          labels: l,
          auxData: {
            label: 'Final Result',
            entries: [
              { key: 'Content children', value: String(child) },
              { key: 'Unsatisfied', value: String(g.length - child) },
              { key: 'Cookies used', value: String(Math.min(cookie, s.length)) },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default assignCookies;
