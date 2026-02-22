import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const courseScheduleDfs: AlgorithmDefinition = {
  id: 'course-schedule-dfs',
  title: 'Course Schedule (DFS Cycle Detection)',
  leetcodeNumber: 207,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given numCourses and prerequisites (pairs [a,b] meaning b must be taken before a), determine if you can finish all courses. Build a directed graph and use DFS to detect cycles. A cycle means it is impossible to finish all courses. States: 0=unvisited, 1=in-progress, 2=done.',
  tags: ['dfs', 'graph', 'cycle detection', 'topological sort'],

  code: {
    pseudocode: `function canFinish(numCourses, prerequisites):
  build adjacency list graph
  state = [0] * numCourses  // 0=unvisited, 1=visiting, 2=done

  dfs(node):
    if state[node] == 1: return false  // cycle!
    if state[node] == 2: return true   // already verified
    state[node] = 1  // mark visiting
    for neighbor in graph[node]:
      if not dfs(neighbor): return false
    state[node] = 2  // mark done
    return true

  for each course:
    if not dfs(course): return false
  return true`,

    python: `def canFinish(numCourses, prerequisites):
    graph = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        graph[b].append(a)

    state = [0] * numCourses  # 0=unvisited, 1=visiting, 2=done

    def dfs(node):
        if state[node] == 1: return False
        if state[node] == 2: return True
        state[node] = 1
        for nei in graph[node]:
            if not dfs(nei): return False
        state[node] = 2
        return True

    return all(dfs(i) for i in range(numCourses))`,

    javascript: `function canFinish(numCourses, prerequisites) {
  const graph = Array.from({length: numCourses}, () => []);
  for (const [a, b] of prerequisites) graph[b].push(a);
  const state = new Array(numCourses).fill(0);

  function dfs(node) {
    if (state[node] === 1) return false;
    if (state[node] === 2) return true;
    state[node] = 1;
    for (const nei of graph[node]) {
      if (!dfs(nei)) return false;
    }
    state[node] = 2;
    return true;
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return false;
  }
  return true;
}`,

    java: `public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
    for (int[] p : prerequisites) graph.get(p[1]).add(p[0]);
    int[] state = new int[numCourses];

    for (int i = 0; i < numCourses; i++) {
        if (!dfs(graph, state, i)) return false;
    }
    return true;
}

boolean dfs(List<List<Integer>> graph, int[] state, int node) {
    if (state[node] == 1) return false;
    if (state[node] == 2) return true;
    state[node] = 1;
    for (int nei : graph.get(node)) {
        if (!dfs(graph, state, nei)) return false;
    }
    state[node] = 2;
    return true;
}`,
  },

  defaultInput: {
    numCourses: 4,
    prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]],
  },

  inputFields: [
    {
      name: 'numCourses',
      label: 'Number of Courses',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Total number of courses',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numCourses = input.numCourses as number;
    const prerequisites = input.prerequisites as number[][];
    const steps: AlgorithmStep[] = [];

    const graph: number[][] = Array.from({ length: numCourses }, () => []);
    for (const [a, b] of prerequisites) {
      graph[b].push(a);
    }

    steps.push({
      line: 1,
      explanation: `${numCourses} courses, ${prerequisites.length} prerequisite(s). Build adjacency list and DFS to detect cycles.`,
      variables: { numCourses, prerequisites: prerequisites.length },
      visualization: {
        type: 'array',
        array: Array.from({ length: numCourses }, (_, i) => i),
        highlights: {},
        labels: Object.fromEntries(Array.from({ length: numCourses }, (_, i) => [i, `C${i}`])),
      } as ArrayVisualization,
    });

    steps.push({
      line: 2,
      explanation: `Graph built: ${graph.map((edges, i) => `C${i}->[${edges.map(e => 'C' + e).join(',')}]`).join(', ')}.`,
      variables: { graph: graph.map((e, i) => `${i}:[${e.join(',')}]`).join(' ') },
      visualization: {
        type: 'array',
        array: graph.map(edges => edges.length),
        highlights: {},
        labels: Object.fromEntries(graph.map((edges, i) => [i, `C${i}->C${edges.join(',C')}`])),
      } as ArrayVisualization,
    });

    const state = new Array(numCourses).fill(0);
    let hasCycle = false;

    function dfs(node: number): boolean {
      if (state[node] === 1) return false;
      if (state[node] === 2) return true;
      state[node] = 1;

      steps.push({
        line: 7,
        explanation: `DFS visiting course ${node}. State set to 1 (visiting). Neighbors: [${graph[node].map(n => 'C' + n).join(', ')}].`,
        variables: { node, state: [...state] },
        visualization: {
          type: 'array',
          array: [...state],
          highlights: { [node]: 'active' },
          labels: Object.fromEntries(state.map((s, i) => [i, s === 0 ? 'unvisited' : s === 1 ? 'visiting' : 'done'])),
        } as ArrayVisualization,
      });

      for (const nei of graph[node]) {
        if (!dfs(nei)) return false;
      }
      state[node] = 2;

      steps.push({
        line: 10,
        explanation: `Course ${node} DFS complete. State set to 2 (done). No cycle found through this node.`,
        variables: { node, state: [...state] },
        visualization: {
          type: 'array',
          array: [...state],
          highlights: { [node]: 'sorted' },
          labels: Object.fromEntries(state.map((s, i) => [i, s === 0 ? 'unvisited' : s === 1 ? 'visiting' : 'done'])),
        } as ArrayVisualization,
      });

      return true;
    }

    for (let i = 0; i < numCourses && !hasCycle; i++) {
      if (state[i] === 0) {
        if (!dfs(i)) {
          hasCycle = true;
          steps.push({
            line: 6,
            explanation: `Cycle detected! Course ${i} is already being visited. Cannot finish all courses.`,
            variables: { result: false },
            visualization: {
              type: 'array',
              array: [...state],
              highlights: { [i]: 'mismatch' },
              labels: { [i]: 'CYCLE!' },
            } as ArrayVisualization,
          });
        }
      }
    }

    steps.push({
      line: 13,
      explanation: `DFS complete on all courses. ${hasCycle ? 'Cycle detected: CANNOT finish all courses.' : 'No cycle found: CAN finish all courses.'}`,
      variables: { result: !hasCycle, state: state.join(',') },
      visualization: {
        type: 'array',
        array: [...state],
        highlights: Object.fromEntries(state.map((_, i) => [i, hasCycle ? 'mismatch' : 'found'])),
        labels: Object.fromEntries(state.map((s, i) => [i, s === 2 ? 'done' : `state${s}`])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default courseScheduleDfs;
