import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const deleteDuplicateFolders: AlgorithmDefinition = {
  id: 'delete-duplicate-folders',
  title: 'Delete Duplicate Folders in System',
  leetcodeNumber: 1948,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Given folder paths in a file system, delete all folders (and their subfolders) that appear more than once. Two folders are duplicates if their subfolder structure is identical. Build a trie of the file system, serialize each subtree to a string key, group nodes by that key, mark duplicates, then collect surviving paths.',
  tags: ['trie', 'hash map', 'string', 'dfs', 'serialization'],

  code: {
    pseudocode: `function deleteDuplicateFolder(paths):
  root = TrieNode()
  for path in paths:
    node = root
    for folder in path:
      node = node.children.setdefault(folder, TrieNode())

  count = {}
  def serialize(node):
    if no children: return ""
    key = "(" + "".join(ch + serialize(child) for ch, child in sorted(node.children))  + ")"
    count[key] = count.get(key, 0) + 1
    node.key = key
    return key
  serialize(root)

  result = []
  def collect(node, path):
    for ch, child in node.children.items():
      if count.get(child.key, 0) < 2:
        collect(child, path + [ch])
        result.append(path + [ch])
  collect(root, [])
  return result`,

    python: `def deleteDuplicateFolder(paths):
    root = {}
    for path in paths:
        node = root
        for f in path:
            node = node.setdefault(f, {})
    count = {}
    def serialize(node):
        if not node: return ""
        key = "(" + "".join(k + serialize(v) for k, v in sorted(node.items())) + ")"
        count[key] = count.get(key, 0) + 1
        return key
    keys = {}
    def mark(node):
        if not node: return ""
        key = "(" + "".join(k + mark(v) for k, v in sorted(node.items())) + ")"
        keys[id(node)] = key
        return key
    mark(root)
    res = []
    def collect(node, path):
        for k, v in node.items():
            if count.get(keys.get(id(v), ""), 0) < 2:
                res.append(path + [k])
                collect(v, path + [k])
    collect(root, [])
    return res`,

    javascript: `function deleteDuplicateFolder(paths) {
  const root = new Map();
  for (const path of paths) {
    let node = root;
    for (const f of path) {
      if (!node.has(f)) node.set(f, new Map());
      node = node.get(f);
    }
  }
  const count = new Map();
  function serialize(node) {
    if (!node.size) return '';
    let key = '(';
    for (const [k, v] of [...node.entries()].sort()) key += k + serialize(v);
    key += ')';
    count.set(key, (count.get(key) || 0) + 1);
    return key;
  }
  const keys = new Map();
  function mark(node) {
    if (!node.size) return '';
    let key = '(';
    for (const [k, v] of [...node.entries()].sort()) key += k + mark(v);
    key += ')';
    keys.set(node, key);
    return key;
  }
  serialize(root); mark(root);
  const res = [];
  function collect(node, path) {
    for (const [k, v] of node) {
      if ((count.get(keys.get(v)) || 0) < 2) {
        res.push([...path, k]);
        collect(v, [...path, k]);
      }
    }
  }
  collect(root, []);
  return res;
}`,

    java: `// Build trie, serialize subtrees, mark duplicates, collect survivors`,
  },

  defaultInput: {
    paths: [['a'], ['c'], ['d'], ['a', 'b'], ['c', 'b'], ['d', 'a']],
  },

  inputFields: [
    {
      name: 'paths',
      label: 'Folder Paths (JSON)',
      type: 'array',
      defaultValue: [['a'], ['c'], ['d'], ['a', 'b'], ['c', 'b'], ['d', 'a']],
      placeholder: 'Nested array of folder paths',
      helperText: 'Array of folder path arrays',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const paths = input.paths as string[][];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Building trie from ${paths.length} folder paths. Each path inserts nodes level by level.`,
      variables: { paths: paths.length },
      visualization: makeViz(paths.map((p) => p.length), {}, Object.fromEntries(paths.map((p, i) => [i, p.join('/')]))),
    });

    // Build trie structure (simple object-based for visualization)
    const trie: Record<string, unknown> = {};
    for (let pi = 0; pi < paths.length; pi++) {
      const path = paths[pi];
      let node: Record<string, unknown> = trie;
      for (const folder of path) {
        if (!node[folder]) node[folder] = {};
        node = node[folder] as Record<string, unknown>;
      }
      steps.push({
        line: 4,
        explanation: `Inserted path "/${path.join('/')}".`,
        variables: { path: path.join('/'), depth: path.length },
        visualization: makeViz(paths.map((p) => p.length), { [pi]: 'active' }, Object.fromEntries(paths.map((p, i) => [i, i <= pi ? 'inserted' : 'pending']))),
      });
    }

    // Serialize subtrees
    const serializeMap: Record<string, number> = {};
    const serialize = (node: Record<string, unknown>): string => {
      const keys = Object.keys(node).sort();
      if (keys.length === 0) return '';
      const key = '(' + keys.map((k) => k + serialize(node[k] as Record<string, unknown>)).join('') + ')';
      serializeMap[key] = (serializeMap[key] ?? 0) + 1;
      return key;
    };
    serialize(trie);

    const dupKeys = Object.entries(serializeMap).filter(([, v]) => v > 1).map(([k]) => k);
    steps.push({
      line: 10,
      explanation: `Serialized all subtrees. Found ${dupKeys.length} duplicate subtree structure(s). These folders will be deleted.`,
      variables: { duplicates: dupKeys.length, structures: dupKeys.join(', ') },
      visualization: makeViz(Object.values(serializeMap), { ...(dupKeys.length > 0 ? { 0: 'mismatch' } : {}) }, Object.fromEntries(Object.entries(serializeMap).map(([k, v], i) => [i, `count:${v}`]))),
    });

    // Collect survivors
    const result: string[] = [];
    const collect = (node: Record<string, unknown>, path: string[]): void => {
      for (const [k, child] of Object.entries(node)) {
        const childKey = serialize(child as Record<string, unknown>);
        if (!childKey || (serializeMap[childKey] ?? 0) < 2) {
          result.push([...path, k].join('/'));
          collect(child as Record<string, unknown>, [...path, k]);
        }
      }
    };
    collect(trie, []);

    steps.push({
      line: 18,
      explanation: `After removing duplicate subtrees, ${result.length} paths survive: [${result.map((r) => '/' + r).join(', ')}].`,
      variables: { survivingPaths: result.length },
      visualization: makeViz(result.map((r) => r.split('/').length), Object.fromEntries(result.map((_, i) => [i, 'found'])), Object.fromEntries(result.map((r, i) => [i, '/' + r]))),
    });

    return steps;
  },
};

export default deleteDuplicateFolders;
