import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const satisfiabilityOfEqualityEquations: AlgorithmDefinition = {
  id: 'satisfiability-of-equality-equations',
  title: 'Satisfiability of Equality Equations',
  leetcodeNumber: 990,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a list of equations in the form "a==b" or "a!=b" where variables are single lowercase letters, determine if all equations can be satisfied simultaneously. Use Union-Find: first union all equality pairs, then verify no inequality pair has both sides in the same component.',
  tags: ['graph', 'union find', 'disjoint set', 'string parsing'],

  code: {
    pseudocode: `function equationsPossible(equations):
  uf = UnionFind(26 variables a-z)
  // Pass 1: union all equality pairs
  for each eq "a==b":
    uf.union(a, b)
  // Pass 2: check inequality pairs
  for each eq "a!=b":
    if uf.find(a) == uf.find(b):
      return false  // conflict!
  return true`,

    python: `def equationsPossible(equations):
    parent = list(range(26))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(x, y):
        parent[find(x)] = find(y)
    for eq in equations:
        if eq[1] == '=':
            union(ord(eq[0])-97, ord(eq[3])-97)
    for eq in equations:
        if eq[1] == '!':
            if find(ord(eq[0])-97) == find(ord(eq[3])-97):
                return False
    return True`,

    javascript: `function equationsPossible(equations) {
  const parent = Array.from({length:26},(_,i)=>i);
  function find(x) {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  function union(x, y) { parent[find(x)] = find(y); }
  for (const eq of equations) if (eq[1]==='=') union(eq.charCodeAt(0)-97, eq.charCodeAt(3)-97);
  for (const eq of equations) if (eq[1]==='!') if (find(eq.charCodeAt(0)-97)===find(eq.charCodeAt(3)-97)) return false;
  return true;
}`,

    java: `public boolean equationsPossible(String[] equations) {
    int[] parent = new int[26];
    for (int i=0;i<26;i++) parent[i]=i;
    for (String eq : equations)
        if (eq.charAt(1)=='=') parent[find(parent,eq.charAt(0)-'a')] = find(parent,eq.charAt(3)-'a');
    for (String eq : equations)
        if (eq.charAt(1)=='!' && find(parent,eq.charAt(0)-'a')==find(parent,eq.charAt(3)-'a'))
            return false;
    return true;
}`,
  },

  defaultInput: {
    equations: ['a==b', 'b!=c', 'b==c'],
  },

  inputFields: [
    {
      name: 'equations',
      label: 'Equations (comma-separated)',
      type: 'string',
      defaultValue: 'a==b,b!=c,b==c',
      placeholder: 'a==b,b!=c,b==c',
      helperText: 'Equations like "a==b" or "a!=b"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawEqs = input.equations as string[] | string;
    const eqs: string[] = Array.isArray(rawEqs) ? rawEqs : String(rawEqs).split(',').map(s => s.trim());
    const steps: AlgorithmStep[] = [];

    // Union-Find on 26 letters
    const parent = Array.from({ length: 26 }, (_, i) => i);
    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }
    function union(x: number, y: number) { parent[find(x)] = find(y); }

    // Collect unique variables for display
    const varSet = new Set<number>();
    for (const eq of eqs) {
      if (eq.length >= 4) {
        varSet.add(eq.charCodeAt(0) - 97);
        varSet.add(eq.charCodeAt(3) - 97);
      }
    }
    const vars = [...varSet].sort((a, b) => a - b);
    const varNames = vars.map(v => String.fromCharCode(v + 97));

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: vars,
      highlights,
      labels,
    });

    const varIdx = (code: number) => vars.indexOf(code);

    steps.push({
      line: 1,
      explanation: `Check ${eqs.length} equations: ${eqs.join(', ')}. Variables: [${varNames.join(', ')}]. Initialize Union-Find.`,
      variables: { equations: eqs.join(', '), variables: varNames.join(',') },
      visualization: makeViz({}, varIdx.length ? vars.reduce((acc, v, i) => { acc[i] = String.fromCharCode(v + 97); return acc; }, {} as Record<number, string>) : {}),
    });

    // Pass 1: union equalities
    for (const eq of eqs) {
      if (eq.length < 4) continue;
      const a = eq.charCodeAt(0) - 97;
      const b = eq.charCodeAt(3) - 97;
      const isEq = eq[1] === '=';

      if (isEq) {
        union(a, b);
        const ia = varIdx(a);
        const ib = varIdx(b);
        const hl: Record<number, string> = {};
        const lb: Record<number, string> = {};
        if (ia >= 0) { hl[ia] = 'found'; lb[ia] = String.fromCharCode(a + 97); }
        if (ib >= 0) { hl[ib] = 'found'; lb[ib] = String.fromCharCode(b + 97); }

        steps.push({
          line: 3,
          explanation: `Equation "${eq}": union(${String.fromCharCode(a + 97)}, ${String.fromCharCode(b + 97)}). They are now in the same component.`,
          variables: { equation: eq, unionRoot: find(a) },
          visualization: makeViz(hl, lb),
        });
      }
    }

    steps.push({
      line: 5,
      explanation: `Pass 1 done. All equality constraints unified. Now verify inequality constraints.`,
      variables: { parentState: vars.map(v => `${String.fromCharCode(v + 97)}->${find(v)}`).join(',') },
      visualization: makeViz(
        vars.reduce((acc, _, i) => { acc[i] = 'visited'; return acc; }, {} as Record<number, string>),
        vars.reduce((acc, v, i) => { acc[i] = `root=${find(v)}`; return acc; }, {} as Record<number, string>)
      ),
    });

    // Pass 2: check inequalities
    let satisfiable = true;
    for (const eq of eqs) {
      if (eq.length < 4) continue;
      const a = eq.charCodeAt(0) - 97;
      const b = eq.charCodeAt(3) - 97;
      const isNeq = eq[1] === '!';

      if (isNeq) {
        const ra = find(a);
        const rb = find(b);
        const ia = varIdx(a);
        const ib = varIdx(b);
        const conflict = ra === rb;

        const hl: Record<number, string> = {};
        const lb: Record<number, string> = {};
        if (ia >= 0) { hl[ia] = conflict ? 'mismatch' : 'found'; lb[ia] = String.fromCharCode(a + 97); }
        if (ib >= 0) { hl[ib] = conflict ? 'mismatch' : 'found'; lb[ib] = String.fromCharCode(b + 97); }

        steps.push({
          line: 7,
          explanation: `Equation "${eq}": find(${String.fromCharCode(a + 97)})=${ra}, find(${String.fromCharCode(b + 97)})=${rb}. ${conflict ? 'CONFLICT! Same component.' : 'OK, different components.'}`,
          variables: { equation: eq, rootA: ra, rootB: rb, conflict },
          visualization: makeViz(hl, lb),
        });

        if (conflict) {
          satisfiable = false;
          break;
        }
      }
    }

    steps.push({
      line: 8,
      explanation: `Result: equations are ${satisfiable ? 'SATISFIABLE' : 'UNSATISFIABLE'}.`,
      variables: { result: satisfiable },
      visualization: makeViz(
        vars.reduce((acc, _, i) => { acc[i] = satisfiable ? 'sorted' : 'mismatch'; return acc; }, {} as Record<number, string>),
        { 0: `ans=${satisfiable}` }
      ),
    });

    return steps;
  },
};

export default satisfiabilityOfEqualityEquations;
