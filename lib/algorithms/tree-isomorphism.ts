import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const treeIsomorphism: AlgorithmDefinition = {
  id: 'tree-isomorphism',
  title: 'Tree Isomorphism',
  leetcodeNumber: undefined,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Two trees are isomorphic if one can be transformed into the other by renaming vertices. Canonical form algorithm: recursively compute a canonical string for each subtree by sorting children\'s canonical strings. Two trees are isomorphic iff they have the same canonical form. This is also used to find the AHU (Aho-Hopcroft-Ullman) tree isomorphism in O(n log n).',
  tags: ['Tree', 'Dynamic Programming', 'Hashing', 'Canonical Form'],
  code: {
    pseudocode: `function treeIsomorphism(tree1, tree2):
  function canonical(node):
    if leaf: return "()"
    childForms = sorted([canonical(c) for c in node.children])
    return "(" + join(childForms) + ")"

  form1 = canonical(root1)
  form2 = canonical(root2)
  return form1 == form2

# If tree has even number of nodes, root at one of the two centers
# Centers found by repeatedly removing leaves`,
    python: `def isIsomorphic(tree1, tree2):
    def canonical(idx, tree):
        if idx >= len(tree) or tree[idx] is None:
            return ""
        l, r = 2*idx+1, 2*idx+2
        lc = canonical(l, tree)
        rc = canonical(r, tree)
        children = sorted([c for c in [lc, rc] if c])
        return "(" + "".join(children) + ")"
    return canonical(0, tree1) == canonical(0, tree2)`,
    javascript: `function isIsomorphic(tree1, tree2) {
  function canonical(idx, tree) {
    if (idx >= tree.length || tree[idx] == null) return "";
    const lc = canonical(2*idx+1, tree), rc = canonical(2*idx+2, tree);
    const children = [lc, rc].filter(Boolean).sort();
    return "(" + children.join("") + ")";
  }
  return canonical(0, tree1) === canonical(0, tree2);
}`,
    java: `boolean isIsomorphic(Integer[] tree1, Integer[] tree2) {
    return canonical(0, tree1).equals(canonical(0, tree2));
}
String canonical(int idx, Integer[] tree) {
    if (idx >= tree.length || tree[idx] == null) return "";
    String lc = canonical(2*idx+1, tree), rc = canonical(2*idx+2, tree);
    String[] ch = Stream.of(lc, rc).filter(s -> !s.isEmpty()).sorted().toArray(String[]::new);
    return "(" + String.join("", ch) + ")";
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, null, null, 5] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree 1 (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, null, null, 5],
      placeholder: 'e.g. 1,2,3,4,null,null,5',
      helperText: 'First tree. Canonical form computed and compared with a mirror.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree1 = (input.tree as (number | null)[]).slice();
    // Create a second tree that IS isomorphic (mirror)
    const tree2 = [...tree1];

    const steps: AlgorithmStep[] = [];
    const canonMap: Record<number, string> = {};

    function makeViz(activeIdx: number | null, tree: (number | null)[], extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: 'Tree Isomorphism: compute canonical form for each tree by recursively sorting children\'s canonical strings. Two trees are isomorphic iff canonical forms match.',
      variables: {},
      visualization: makeViz(0, tree1),
    });

    function canonical(idx: number, tree: (number | null)[]): string {
      if (idx >= tree.length || tree[idx] == null) return '';

      const val = tree[idx];
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      const lc = canonical(leftIdx, tree);
      const rc = canonical(rightIdx, tree);
      const children = [lc, rc].filter(Boolean).sort();
      const form = '(' + children.join('') + ')';

      canonMap[idx] = form;

      steps.push({
        line: 4,
        explanation: `Node ${val} at index ${idx}: children canonical forms = [${[lc, rc].map(s => s || '""').join(', ')}]. Sorted and merged: "${form}".`,
        variables: { node: val, leftCanon: lc || '(empty)', rightCanon: rc || '(empty)', form },
        visualization: makeViz(idx, tree, { [idx]: 'found' }),
      });

      return form;
    }

    const form1 = canonical(0, tree1);
    steps.push({
      line: 6,
      explanation: `Tree 1 canonical form: "${form1}". Now computing Tree 2 (mirror) canonical form.`,
      variables: { form1 },
      visualization: makeViz(0, tree1, { 0: 'found' }),
    });

    // Mirror tree2
    function mirrorTree(tree: (number | null)[]): (number | null)[] {
      const result = [...tree];
      function swap(idx: number): void {
        if (idx >= result.length || result[idx] == null) return;
        const l = 2 * idx + 1, r = 2 * idx + 2;
        if (l < result.length || r < result.length) {
          while (result.length <= Math.max(l, r)) result.push(null);
          [result[l], result[r]] = [result[r], result[l]];
          swap(l); swap(r);
        }
      }
      swap(0);
      return result;
    }

    const tree2mirrored = mirrorTree([...tree2]);
    const form2 = canonical(0, tree2mirrored);

    steps.push({
      line: 7,
      explanation: `Tree 2 (mirror) canonical form: "${form2}". Comparing with Tree 1.`,
      variables: { form2 },
      visualization: makeViz(0, tree2mirrored, { 0: 'found' }),
    });

    const isomorphic = form1 === form2;

    steps.push({
      line: 8,
      explanation: `Tree 1 "${form1}" ${isomorphic ? '==' : '!='} Tree 2 "${form2}". Trees are ${isomorphic ? 'ISOMORPHIC' : 'NOT isomorphic'}.`,
      variables: { form1, form2, isomorphic },
      visualization: makeViz(0, tree1, { 0: isomorphic ? 'found' : 'swapping' }),
    });

    return steps;
  },
};

export default treeIsomorphism;
