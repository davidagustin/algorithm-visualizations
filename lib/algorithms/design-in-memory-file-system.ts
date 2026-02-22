import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designInMemoryFileSystem: AlgorithmDefinition = {
  id: 'design-in-memory-file-system',
  title: 'Design In-Memory File System',
  leetcodeNumber: 588,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Design an in-memory file system supporting ls, mkdir, addContentToFile, and readContentFromFile. Use a trie where each node represents a directory or file. Directory nodes have children (subdirectories and files). File nodes additionally store content. Paths are split by "/" to traverse the trie.',
  tags: ['trie', 'design', 'string', 'hash map'],

  code: {
    pseudocode: `class FileSystem:
  root = DirNode()

  ls(path):
    node = navigate to path
    if node is file: return [filename]
    return sorted(node.children.keys())

  mkdir(path):
    node = root
    for part in path.split("/"):
      node = node.children.setdefault(part, DirNode())

  addContentToFile(path, content):
    dir, filename = split path
    navigate to dir node
    create/append to file node content

  readContentFromFile(path):
    navigate to file node
    return node.content`,

    python: `class FileSystem:
    def __init__(self):
        self.root = {'files': {}, 'dirs': {}}

    def _navigate(self, path):
        node = self.root
        for part in path.strip('/').split('/'):
            if part: node = node['dirs'].setdefault(part, {'files': {}, 'dirs': {}})
        return node

    def ls(self, path):
        parts = path.strip('/').split('/')
        node = self.root
        for i, part in enumerate(parts):
            if part in node.get('files', {}):
                return [part]
            if part: node = node['dirs'].get(part, {})
        return sorted(list(node.get('dirs', {}).keys()) + list(node.get('files', {}).keys()))

    def mkdir(self, path):
        self._navigate(path)

    def addContentToFile(self, filePath, content):
        parts = filePath.strip('/').split('/')
        node = self._navigate('/' + '/'.join(parts[:-1]))
        fname = parts[-1]
        node['files'][fname] = node['files'].get(fname, '') + content

    def readContentFromFile(self, filePath):
        parts = filePath.strip('/').split('/')
        node = self._navigate('/' + '/'.join(parts[:-1]))
        return node['files'][parts[-1]]`,

    javascript: `class FileSystem {
  constructor() { this.root = { dirs: {}, files: {} }; }
  _nav(path) {
    let node = this.root;
    for (const p of path.split('/').filter(Boolean))
      node = node.dirs[p] = node.dirs[p] || { dirs: {}, files: {} };
    return node;
  }
  ls(path) {
    const parts = path.split('/').filter(Boolean);
    let node = this.root;
    for (let i = 0; i < parts.length; i++) {
      if (node.files[parts[i]] !== undefined) return [parts[i]];
      node = node.dirs[parts[i]];
    }
    return [...Object.keys(node.dirs), ...Object.keys(node.files)].sort();
  }
  mkdir(path) { this._nav(path); }
  addContentToFile(path, content) {
    const p = path.split('/').filter(Boolean);
    const dir = this._nav('/' + p.slice(0,-1).join('/'));
    dir.files[p[p.length-1]] = (dir.files[p[p.length-1]] || '') + content;
  }
  readContentFromFile(path) {
    const p = path.split('/').filter(Boolean);
    return this._nav('/' + p.slice(0,-1).join('/'))[p[p.length-1]];
  }
}`,

    java: `class FileSystem {
    // Use TrieNode with Map<String, TrieNode> children and String content
}`,
  },

  defaultInput: {
    operations: ['mkdir', 'addContentToFile', 'ls', 'readContentFromFile', 'ls'],
    args: [['/a/b/c'], ['/a/b/c/d', 'hello'], ['/'], ['/a/b/c/d'], ['/a/b/c']],
  },

  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'array',
      defaultValue: ['mkdir', 'addContentToFile', 'ls', 'readContentFromFile', 'ls'],
      placeholder: 'mkdir,addContentToFile,ls',
      helperText: 'File system operations to perform',
    },
    {
      name: 'args',
      label: 'Arguments (JSON arrays)',
      type: 'array',
      defaultValue: [['/a/b/c'], ['/a/b/c/d', 'hello'], ['/'], ['/a/b/c/d'], ['/a/b/c']],
      placeholder: '[[path],[path,content],[path]]',
      helperText: 'Arguments for each operation',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const operations = input.operations as string[];
    const args = input.args as string[][];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    // File system state
    const root: { dirs: Record<string, unknown>; files: Record<string, string> } = { dirs: {}, files: {} };

    type DirNode = { dirs: Record<string, unknown>; files: Record<string, string> };

    const nav = (path: string): DirNode => {
      let node = root as DirNode;
      for (const p of path.split('/').filter(Boolean)) {
        if (!node.dirs[p]) node.dirs[p] = { dirs: {}, files: {} };
        node = node.dirs[p] as DirNode;
      }
      return node;
    };

    steps.push({
      line: 1,
      explanation: 'Initialize in-memory file system with root node. Root contains empty dirs and files maps.',
      variables: { state: 'empty root' },
      visualization: makeViz([0], {}, { 0: '/' }),
    });

    const results: string[] = [];

    for (let oi = 0; oi < operations.length; oi++) {
      const op = operations[oi];
      const opArgs = args[oi];

      if (op === 'mkdir') {
        const path = opArgs[0];
        nav(path);
        results.push('null');
        steps.push({
          line: 5,
          explanation: `mkdir("${path}"): Created directory path by inserting each segment into the trie. State updated.`,
          variables: { operation: 'mkdir', path },
          visualization: makeViz(operations.map(() => 1), { [oi]: 'active' }, Object.fromEntries(operations.map((o, i) => [i, i === oi ? path : o]))),
        });
      } else if (op === 'addContentToFile') {
        const [path, content] = opArgs;
        const parts = path.split('/').filter(Boolean);
        const dirPath = '/' + parts.slice(0, -1).join('/');
        const fname = parts[parts.length - 1];
        const dirNode = nav(dirPath);
        dirNode.files[fname] = (dirNode.files[fname] ?? '') + content;
        results.push('null');
        steps.push({
          line: 16,
          explanation: `addContentToFile("${path}", "${content}"): Navigate to parent dir, create/append to file "${fname}". Content: "${dirNode.files[fname]}".`,
          variables: { path, filename: fname, content: dirNode.files[fname] },
          visualization: makeViz(operations.map(() => 1), { [oi]: 'found' }, Object.fromEntries(operations.map((o, i) => [i, i === oi ? `${fname}="${dirNode.files[fname]}"` : o]))),
        });
      } else if (op === 'ls') {
        const path = opArgs[0];
        const parts = path.split('/').filter(Boolean);
        let node = root as DirNode;
        for (const p of parts) {
          if (node.files[p] !== undefined) {
            results.push(p);
            steps.push({
              line: 8,
              explanation: `ls("${path}"): Path points directly to file "${p}". Return ["${p}"].`,
              variables: { path, result: [p] },
              visualization: makeViz(operations.map(() => 1), { [oi]: 'found' }, Object.fromEntries(operations.map((o, i) => [i, i === oi ? `[${p}]` : o]))),
            });
            break;
          }
          node = node.dirs[p] as DirNode ?? node;
        }
        if (results.length <= oi) {
          const listing = [...Object.keys(node.dirs), ...Object.keys(node.files)].sort();
          results.push(listing.join(','));
          steps.push({
            line: 9,
            explanation: `ls("${path}"): Directory listing: [${listing.join(', ')}].`,
            variables: { path, listing: listing.join(', ') },
            visualization: makeViz(operations.map(() => 1), { [oi]: 'found' }, Object.fromEntries(operations.map((o, i) => [i, i === oi ? `[${listing.join(',')}]` : o]))),
          });
        }
      } else if (op === 'readContentFromFile') {
        const path = opArgs[0];
        const parts = path.split('/').filter(Boolean);
        const fname = parts[parts.length - 1];
        const dirNode = nav('/' + parts.slice(0, -1).join('/'));
        const content = dirNode.files[fname] ?? '';
        results.push(content);
        steps.push({
          line: 20,
          explanation: `readContentFromFile("${path}"): Navigate to parent directory, read file "${fname}". Content: "${content}".`,
          variables: { path, filename: fname, content },
          visualization: makeViz(operations.map(() => 1), { [oi]: 'found' }, Object.fromEntries(operations.map((o, i) => [i, i === oi ? `"${content}"` : o]))),
        });
      }
    }

    steps.push({
      line: 22,
      explanation: `All ${operations.length} operations complete. Results: [${results.join(', ')}].`,
      variables: { results: results.join(', ') },
      visualization: makeViz(operations.map(() => 1), Object.fromEntries(operations.map((_, i) => [i, 'found'])), Object.fromEntries(results.map((r, i) => [i, r]))),
    });

    return steps;
  },
};

export default designInMemoryFileSystem;
