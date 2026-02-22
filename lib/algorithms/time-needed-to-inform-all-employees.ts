import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const timeNeededToInformAllEmployees: AlgorithmDefinition = {
  id: 'time-needed-to-inform-all-employees',
  title: 'Time Needed to Inform All Employees',
  leetcodeNumber: 1376,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'A company has n employees arranged in a tree hierarchy. The head of the company wants to inform all employees of an urgent piece of news. Each manager needs informTime[i] minutes to inform their direct subordinates. Find the total time needed to inform all employees using DFS on the tree.',
  tags: ['graph', 'dfs', 'tree', 'bfs', 'recursion'],

  code: {
    pseudocode: `function numOfMinutes(n, headID, manager, informTime):
  build tree: children[manager[i]].append(i)
  return dfs(headID)

function dfs(node):
  maxTime = 0
  for each child of node:
    maxTime = max(maxTime, dfs(child))
  return informTime[node] + maxTime`,

    python: `def numOfMinutes(n, headID, manager, informTime):
    children = defaultdict(list)
    for i, m in enumerate(manager):
        if m != -1:
            children[m].append(i)
    def dfs(node):
        return informTime[node] + max((dfs(c) for c in children[node]), default=0)
    return dfs(headID)`,

    javascript: `function numOfMinutes(n, headID, manager, informTime) {
  const children = Array.from({length: n}, () => []);
  for (let i = 0; i < n; i++) {
    if (manager[i] !== -1) children[manager[i]].push(i);
  }
  function dfs(node) {
    let max = 0;
    for (const child of children[node]) {
      max = Math.max(max, dfs(child));
    }
    return informTime[node] + max;
  }
  return dfs(headID);
}`,

    java: `public int numOfMinutes(int n, int headID, int[] manager, int[] informTime) {
    List<List<Integer>> children = new ArrayList<>();
    for (int i = 0; i < n; i++) children.add(new ArrayList<>());
    for (int i = 0; i < n; i++) if (manager[i] != -1) children.get(manager[i]).add(i);
    return dfs(headID, children, informTime);
}
int dfs(int node, List<List<Integer>> children, int[] informTime) {
    int max = 0;
    for (int child : children.get(node)) max = Math.max(max, dfs(child, children, informTime));
    return informTime[node] + max;
}`,
  },

  defaultInput: {
    n: 6,
    headID: 2,
    manager: [2, 2, -1, 2, 2, 2],
    informTime: [0, 0, 1, 0, 0, 0],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Employees',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
    },
    {
      name: 'headID',
      label: 'Head Employee ID',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
    },
    {
      name: 'manager',
      label: 'Manager array',
      type: 'array',
      defaultValue: [2, 2, -1, 2, 2, 2],
      placeholder: '2,2,-1,2,2,2',
      helperText: 'manager[i] = manager of employee i (-1 for head)',
    },
    {
      name: 'informTime',
      label: 'Inform Time array',
      type: 'array',
      defaultValue: [0, 0, 1, 0, 0, 0],
      placeholder: '0,0,1,0,0,0',
      helperText: 'Time for each manager to inform subordinates',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const headID = input.headID as number;
    const manager = input.manager as number[];
    const informTime = input.informTime as number[];
    const steps: AlgorithmStep[] = [];

    const children: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
      if (manager[i] !== -1 && manager[i] < n) {
        children[manager[i]].push(i);
      }
    }

    const employees = Array.from({ length: n }, (_, i) => i);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: informTime.slice(0, n),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `${n} employees, head=${headID}. InformTime array shown. DFS down the tree accumulating max time paths.`,
      variables: { n, headID, informTime: informTime.slice(0, n).join(',') },
      visualization: makeViz({ [headID]: 'active' }, { [headID]: 'head' }),
    });

    steps.push({
      line: 2,
      explanation: `Build tree from manager array. Children: ${children.map((ch, i) => `${i}->[${ch.join(',')}]`).join(' ')}.`,
      variables: { children: children.map((ch, i) => `${i}:[${ch}]`).join(' ') },
      visualization: makeViz(
        employees.reduce((acc, i) => { acc[i] = 'visited'; return acc; }, {} as Record<number, string>),
        employees.reduce((acc, i) => { acc[i] = `t=${informTime[i] || 0}`; return acc; }, {} as Record<number, string>)
      ),
    });

    const timeResults: number[] = new Array(n).fill(0);

    function dfs(node: number, depth: number): number {
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      hl[node] = 'active';
      lb[node] = `dfs(${node})`;

      steps.push({
        line: 5,
        explanation: `DFS at employee ${node} (informTime=${informTime[node] || 0}). Children: [${children[node].join(', ')}].`,
        variables: { node, informTime: informTime[node] || 0, depth },
        visualization: makeViz(hl, lb),
      });

      let maxChildTime = 0;
      for (const child of children[node]) {
        const childTime = dfs(child, depth + 1);
        if (childTime > maxChildTime) maxChildTime = childTime;

        const hl2: Record<number, string> = {};
        const lb2: Record<number, string> = {};
        hl2[node] = 'active';
        lb2[node] = `max=${maxChildTime}`;
        hl2[child] = 'found';
        lb2[child] = `ret=${childTime}`;

        steps.push({
          line: 6,
          explanation: `Child ${child} returns time ${childTime}. Max child time now ${maxChildTime}.`,
          variables: { child, childTime, maxChildTime },
          visualization: makeViz(hl2, lb2),
        });
      }

      const total = (informTime[node] || 0) + maxChildTime;
      timeResults[node] = total;

      const hl3: Record<number, string> = {};
      const lb3: Record<number, string> = {};
      hl3[node] = 'found';
      lb3[node] = `=${total}`;

      steps.push({
        line: 7,
        explanation: `Node ${node}: informTime[${node}]=${informTime[node] || 0} + maxChild=${maxChildTime} = ${total}.`,
        variables: { node, result: total },
        visualization: makeViz(hl3, lb3),
      });

      return total;
    }

    const result = dfs(headID, 0);

    steps.push({
      line: 3,
      explanation: `Total time to inform all ${n} employees = ${result} minutes.`,
      variables: { result },
      visualization: makeViz(
        employees.reduce((acc, i) => { acc[i] = 'sorted'; return acc; }, {} as Record<number, string>),
        { [headID]: `ans=${result}` }
      ),
    });

    return steps;
  },
};

export default timeNeededToInformAllEmployees;
