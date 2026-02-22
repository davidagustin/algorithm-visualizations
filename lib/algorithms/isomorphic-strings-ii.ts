import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const isomorphicStringsIi: AlgorithmDefinition = {
  id: 'isomorphic-strings-ii',
  title: 'Isomorphic Strings',
  leetcodeNumber: 205,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Two strings s and t are isomorphic if characters in s can be replaced to get t, preserving order. Use two maps: one from s->t chars and one from t->s chars. Check consistency at each position.',
  tags: ['string', 'hash map', 'isomorphic', 'character mapping'],
  code: {
    pseudocode: `function isIsomorphic(s, t):
  mapST = {}, mapTS = {}
  for i in 0..len(s)-1:
    cs, ct = s[i], t[i]
    if cs in mapST and mapST[cs] != ct: return False
    if ct in mapTS and mapTS[ct] != cs: return False
    mapST[cs] = ct
    mapTS[ct] = cs
  return True`,
    python: `def isIsomorphic(s: str, t: str) -> bool:
    mapST, mapTS = {}, {}
    for cs, ct in zip(s, t):
        if cs in mapST and mapST[cs] != ct:
            return False
        if ct in mapTS and mapTS[ct] != cs:
            return False
        mapST[cs] = ct
        mapTS[ct] = cs
    return True`,
    javascript: `function isIsomorphic(s, t) {
  const mapST = {}, mapTS = {};
  for (let i = 0; i < s.length; i++) {
    const cs = s[i], ct = t[i];
    if (cs in mapST && mapST[cs] !== ct) return false;
    if (ct in mapTS && mapTS[ct] !== cs) return false;
    mapST[cs] = ct;
    mapTS[ct] = cs;
  }
  return true;
}`,
    java: `public boolean isIsomorphic(String s, String t) {
    Map<Character, Character> mapST = new HashMap<>(), mapTS = new HashMap<>();
    for (int i = 0; i < s.length(); i++) {
        char cs = s.charAt(i), ct = t.charAt(i);
        if (mapST.containsKey(cs) && mapST.get(cs) != ct) return false;
        if (mapTS.containsKey(ct) && mapTS.get(ct) != cs) return false;
        mapST.put(cs, ct);
        mapTS.put(ct, cs);
    }
    return true;
}`,
  },
  defaultInput: { s: 'egg', t: 'add' },
  inputFields: [
    { name: 's', label: 'String s', type: 'string', defaultValue: 'egg', placeholder: 'egg', helperText: 'First string' },
    { name: 't', label: 'String t', type: 'string', defaultValue: 'add', placeholder: 'add', helperText: 'Second string' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = input.t as string;
    const steps: AlgorithmStep[] = [];
    const mapST: Record<string, string> = {};
    const mapTS: Record<string, string> = {};

    const makeViz = (pos: number, valid: boolean | null): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      for (let x = 0; x < pos; x++) highlights[x] = 'sorted';
      if (pos < s.length) highlights[pos] = valid === false ? 'mismatch' : 'active';
      const labels: Record<number, string> = {};
      for (let x = 0; x < s.length; x++) labels[x] = `${s[x]}/${t[x]}`;
      return {
        type: 'array',
        array: Array.from({ length: s.length }, (_, x) => x),
        highlights,
        labels,
        auxData: {
          label: 'Isomorphic Check',
          entries: [
            { key: 's', value: s },
            { key: 't', value: t },
            { key: 's->t map', value: JSON.stringify(mapST) },
            { key: 't->s map', value: JSON.stringify(mapTS) },
            { key: 'valid?', value: valid === null ? '...' : valid ? 'YES' : 'NO' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Check if "${s}" and "${t}" are isomorphic. Build bidirectional character mapping.`,
      variables: { s, t },
      visualization: makeViz(0, null),
    });

    let valid = true;
    for (let i = 0; i < s.length; i++) {
      const cs = s[i], ct = t[i];
      const conflict = (cs in mapST && mapST[cs] !== ct) || (ct in mapTS && mapTS[ct] !== cs);

      if (conflict) {
        steps.push({
          line: 5,
          explanation: `Conflict at pos ${i}: '${cs}'->'${ct}' but map says '${cs}'->'${mapST[cs] || '?'}' or '${ct}'->'${mapTS[ct] || '?'}'. NOT isomorphic.`,
          variables: { pos: i, cs, ct, mapST: { ...mapST }, mapTS: { ...mapTS } },
          visualization: makeViz(i, false),
        });
        valid = false;
        break;
      }

      mapST[cs] = ct;
      mapTS[ct] = cs;

      steps.push({
        line: 7,
        explanation: `Pos ${i}: '${cs}' <-> '${ct}'. Mapping consistent. mapST=${JSON.stringify(mapST)}.`,
        variables: { pos: i, cs, ct, mapST: { ...mapST }, mapTS: { ...mapTS } },
        visualization: makeViz(i + 1, null),
      });
    }

    steps.push({
      line: 9,
      explanation: `"${s}" and "${t}" are ${valid ? '' : 'NOT '}isomorphic.`,
      variables: { result: valid },
      visualization: makeViz(s.length, valid),
    });

    return steps;
  },
};

export default isomorphicStringsIi;
