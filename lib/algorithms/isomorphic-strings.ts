import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const isomorphicStrings: AlgorithmDefinition = {
  id: 'isomorphic-strings',
  title: 'Isomorphic Strings',
  leetcodeNumber: 205,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given two strings s and t, determine if they are isomorphic. Two strings are isomorphic if characters in s can be replaced to get t, where each character maps to exactly one character and no two characters map to the same character.',
  tags: ['hash map', 'string', 'bijection', 'mapping'],

  code: {
    pseudocode: `function isIsomorphic(s, t):
  sToT = {}
  tToS = {}
  for i = 0 to len(s)-1:
    sc = s[i], tc = t[i]
    if sc in sToT and sToT[sc] != tc:
      return false
    if tc in tToS and tToS[tc] != sc:
      return false
    sToT[sc] = tc
    tToS[tc] = sc
  return true`,

    python: `def isIsomorphic(s: str, t: str) -> bool:
    s_to_t, t_to_s = {}, {}
    for sc, tc in zip(s, t):
        if sc in s_to_t and s_to_t[sc] != tc:
            return False
        if tc in t_to_s and t_to_s[tc] != sc:
            return False
        s_to_t[sc] = tc
        t_to_s[tc] = sc
    return True`,

    javascript: `function isIsomorphic(s, t) {
  const sToT = {}, tToS = {};
  for (let i = 0; i < s.length; i++) {
    const sc = s[i], tc = t[i];
    if (sToT[sc] !== undefined && sToT[sc] !== tc) return false;
    if (tToS[tc] !== undefined && tToS[tc] !== sc) return false;
    sToT[sc] = tc;
    tToS[tc] = sc;
  }
  return true;
}`,

    java: `public boolean isIsomorphic(String s, String t) {
    Map<Character, Character> sToT = new HashMap<>(), tToS = new HashMap<>();
    for (int i = 0; i < s.length(); i++) {
        char sc = s.charAt(i), tc = t.charAt(i);
        if (sToT.containsKey(sc) && sToT.get(sc) != tc) return false;
        if (tToS.containsKey(tc) && tToS.get(tc) != sc) return false;
        sToT.put(sc, tc);
        tToS.put(tc, sc);
    }
    return true;
}`,
  },

  defaultInput: {
    s: 'egg',
    t: 'add',
  },

  inputFields: [
    {
      name: 's',
      label: 'String S',
      type: 'string',
      defaultValue: 'egg',
      placeholder: 'egg',
      helperText: 'Source string',
    },
    {
      name: 't',
      label: 'String T',
      type: 'string',
      defaultValue: 'add',
      placeholder: 'add',
      helperText: 'Target string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = input.t as string;
    const steps: AlgorithmStep[] = [];
    const sToT: Record<string, string> = {};
    const tToS: Record<string, string> = {};

    const sArr = s.split('').map((c) => c.charCodeAt(0));

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      entries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...sArr],
      highlights,
      labels,
      auxData: { label: 'S→T Mapping', entries },
    });

    const mapToEntries = () =>
      Object.entries(sToT).map(([k, v]) => ({ key: `'${k}'`, value: `'${v}'` }));

    steps.push({
      line: 1,
      explanation: `Check if "${s}" and "${t}" are isomorphic. We need a consistent one-to-one character mapping.`,
      variables: { s, t },
      visualization: makeViz({}, {}, []),
    });

    for (let i = 0; i < s.length; i++) {
      const sc = s[i];
      const tc = t[i];

      steps.push({
        line: 4,
        explanation: `Position ${i}: s[${i}]='${sc}', t[${i}]='${tc}'. Check if mapping is consistent.`,
        variables: { i, sc, tc, sToT: { ...sToT }, tToS: { ...tToS } },
        visualization: makeViz({ [i]: 'active' }, { [i]: `${sc}→${tc}` }, mapToEntries()),
      });

      if (sToT[sc] !== undefined && sToT[sc] !== tc) {
        steps.push({
          line: 5,
          explanation: `Conflict! '${sc}' already maps to '${sToT[sc]}', but now we need it to map to '${tc}'. Return false.`,
          variables: { sc, existing: sToT[sc], tc },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: 'conflict' }, mapToEntries()),
        });
        return steps;
      }

      if (tToS[tc] !== undefined && tToS[tc] !== sc) {
        steps.push({
          line: 7,
          explanation: `Conflict! '${tc}' already maps back to '${tToS[tc]}', not '${sc}'. Return false.`,
          variables: { tc, existing: tToS[tc], sc },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: 'conflict' }, mapToEntries()),
        });
        return steps;
      }

      sToT[sc] = tc;
      tToS[tc] = sc;

      steps.push({
        line: 9,
        explanation: `Map '${sc}' → '${tc}' (and reverse). Mapping consistent so far.`,
        variables: { sc, tc, sToT: { ...sToT } },
        visualization: makeViz({ [i]: 'found' }, { [i]: `${sc}→${tc}` }, mapToEntries()),
      });
    }

    steps.push({
      line: 10,
      explanation: `All characters consistently mapped. "${s}" and "${t}" ARE isomorphic. Return true.`,
      variables: { result: true, sToT: { ...sToT } },
      visualization: makeViz(
        Object.fromEntries(sArr.map((_, i) => [i, 'sorted'])),
        {},
        mapToEntries()
      ),
    });

    return steps;
  },
};

export default isomorphicStrings;
