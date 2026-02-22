import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const constructBinaryTreeFromString: AlgorithmDefinition = {
  id: 'construct-binary-tree-from-string',
  title: 'Construct Binary Tree from String',
  leetcodeNumber: 536,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Construct a binary tree from a string representation where each node is formatted as "val(leftSubtree)(rightSubtree)". The string contains integers (possibly negative) and parentheses. Parse the integer first, then recursively parse left and right subtrees enclosed in parentheses. The result is stored in level-order array for visualization.',
  tags: ['tree', 'recursion', 'string parsing', 'stack'],

  code: {
    pseudocode: `function str2tree(s):
  if s is empty: return null
  index = 0

  function parse():
    # Parse the integer value
    start = index
    if s[index] == '-': index++
    while index < len(s) and s[index].isdigit():
      index++
    val = int(s[start:index])
    node = Node(val)

    # Parse left subtree if present
    if index < len(s) and s[index] == '(':
      index++  # skip '('
      node.left = parse()
      index++  # skip ')'

    # Parse right subtree if present
    if index < len(s) and s[index] == '(':
      index++  # skip '('
      node.right = parse()
      index++  # skip ')'

    return node

  return parse()`,
    python: `def str2tree(s):
    if not s: return None
    idx = [0]
    def parse():
        start = idx[0]
        if s[idx[0]] == '-': idx[0] += 1
        while idx[0] < len(s) and s[idx[0]].isdigit():
            idx[0] += 1
        node = TreeNode(int(s[start:idx[0]]))
        if idx[0] < len(s) and s[idx[0]] == '(':
            idx[0] += 1; node.left = parse(); idx[0] += 1
        if idx[0] < len(s) and s[idx[0]] == '(':
            idx[0] += 1; node.right = parse(); idx[0] += 1
        return node
    return parse()`,
    javascript: `function str2tree(s) {
  if (!s) return null;
  let idx = 0;
  function parse() {
    const start = idx;
    if (s[idx] === '-') idx++;
    while (idx < s.length && s[idx] >= '0' && s[idx] <= '9') idx++;
    const node = new TreeNode(parseInt(s.slice(start, idx)));
    if (idx < s.length && s[idx] === '(') {
      idx++; node.left = parse(); idx++;
    }
    if (idx < s.length && s[idx] === '(') {
      idx++; node.right = parse(); idx++;
    }
    return node;
  }
  return parse();
}`,
    java: `int idx = 0;
public TreeNode str2tree(String s) {
    if (s.isEmpty()) return null;
    return parse(s);
}
private TreeNode parse(String s) {
    int start = idx;
    if (s.charAt(idx) == '-') idx++;
    while (idx < s.length() && Character.isDigit(s.charAt(idx))) idx++;
    TreeNode node = new TreeNode(Integer.parseInt(s.substring(start, idx)));
    if (idx < s.length() && s.charAt(idx) == '(') {
        idx++; node.left = parse(s); idx++;
    }
    if (idx < s.length() && s.charAt(idx) == '(') {
        idx++; node.right = parse(s); idx++;
    }
    return node;
}`,
  },

  defaultInput: {
    treeStr: '4(2(3)(1))(6(5))',
  },

  inputFields: [
    {
      name: 'treeStr',
      label: 'Tree String',
      type: 'string',
      defaultValue: '4(2(3)(1))(6(5))',
      placeholder: '4(2(3)(1))(6(5))',
      helperText: 'Format: val(left)(right), parentheses optional for absent subtrees',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const treeStr = (input.treeStr as string) || '4(2(3)(1))(6(5))';
    const steps: AlgorithmStep[] = [];

    // Parse and build level-order array
    const resultArr: number[] = [];
    let idx = 0;

    function parseTree(arrIdx: number): void {
      if (idx >= treeStr.length) return;

      // Parse number
      let start = idx;
      if (treeStr[idx] === '-') idx++;
      while (idx < treeStr.length && treeStr[idx] >= '0' && treeStr[idx] <= '9') idx++;
      const val = parseInt(treeStr.slice(start, idx));

      // Place in array
      while (resultArr.length <= arrIdx) resultArr.push(0);
      resultArr[arrIdx] = val;

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      resultArr.forEach((v, i) => {
        if (v !== 0) { h[i] = 'visited'; l[i] = `${v}`; }
      });
      h[arrIdx] = 'active';
      l[arrIdx] = `${val}`;

      steps.push({
        line: 7,
        explanation: `Parsed value ${val} at string position ${start}-${idx}. Placed at array index ${arrIdx} (tree position).`,
        variables: { parsedVal: val, arrayIdx: arrIdx, stringPos: start },
        visualization: {
          type: 'array',
          array: [...resultArr],
          highlights: h,
          labels: l,
        },
      });

      // Parse left child
      if (idx < treeStr.length && treeStr[idx] === '(') {
        idx++; // skip '('
        steps.push({
          line: 10,
          explanation: `Found '(' at pos ${idx - 1}. Parsing LEFT subtree of node ${val}.`,
          variables: { parentVal: val, direction: 'left', strPos: idx },
          visualization: {
            type: 'array',
            array: [...resultArr],
            highlights: { [arrIdx]: 'comparing' },
            labels: { [arrIdx]: `${val}->L` },
          },
        });
        parseTree(2 * arrIdx + 1);
        idx++; // skip ')'
      }

      // Parse right child
      if (idx < treeStr.length && treeStr[idx] === '(') {
        idx++; // skip '('
        steps.push({
          line: 14,
          explanation: `Found second '(' at pos ${idx - 1}. Parsing RIGHT subtree of node ${val}.`,
          variables: { parentVal: val, direction: 'right', strPos: idx },
          visualization: {
            type: 'array',
            array: [...resultArr],
            highlights: { [arrIdx]: 'comparing' },
            labels: { [arrIdx]: `${val}->R` },
          },
        });
        parseTree(2 * arrIdx + 2);
        idx++; // skip ')'
      }
    }

    steps.push({
      line: 1,
      explanation: `Parse tree string "${treeStr}". Format: val(leftSubtree)(rightSubtree). Recursive descent parser.`,
      variables: { input: treeStr, length: treeStr.length },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        labels: {},
      },
    });

    parseTree(0);

    steps.push({
      line: 20,
      explanation: `Tree constructed. Level-order: [${resultArr.join(', ')}]. Non-zero values are valid nodes.`,
      variables: { result: resultArr },
      visualization: {
        type: 'array',
        array: [...resultArr],
        highlights: Object.fromEntries(resultArr.map((v, i) => [i, v !== 0 ? 'found' : 'default'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default constructBinaryTreeFromString;
