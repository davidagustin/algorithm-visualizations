import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const parallelCourses: AlgorithmDefinition = {
  id: 'parallel-courses',
  title: 'Parallel Courses',
  leetcodeNumber: 1136,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n courses and prerequisite pairs, find the minimum number of semesters to complete all courses, given that you can take any number of courses per semester as long as prerequisites are met. This is equivalent to finding the longest path in a DAG using topological sort (Kahn BFS).',
  tags: ['topological sort', 'DAG', 'BFS', 'longest path', 'graph'],

  code: {
    pseudocode: `function minSemesters(n, relations):
  inDeg = [0]*n, adj = {}
  for each (pre, course) in relations:
    adj[pre].add(course)
    inDeg[course] += 1
  queue = all courses with inDeg == 0
  semesters = 0, processed = 0
  while queue not empty:
    semesters++
    nextQueue = []
    for each course in queue:
      processed++
      for each next in adj[course]:
        inDeg[next]--
        if inDeg[next] == 0: nextQueue.add(next)
    queue = nextQueue
  return semesters if processed == n else -1`,

    python: `from collections import deque
def min_semesters(n, relations):
    in_deg = [0] * (n+1)
    adj = [[] for _ in range(n+1)]
    for pre, course in relations:
        adj[pre].append(course)
        in_deg[course] += 1
    q = deque(i for i in range(1, n+1) if in_deg[i] == 0)
    sems = processed = 0
    while q:
        sems += 1
        for _ in range(len(q)):
            u = q.popleft()
            processed += 1
            for v in adj[u]:
                in_deg[v] -= 1
                if in_deg[v] == 0: q.append(v)
    return sems if processed == n else -1`,

    javascript: `function minimumSemesters(n, relations) {
  const inDeg = new Array(n+1).fill(0);
  const adj = Array.from({length:n+1},()=>[]);
  for (const [pre, course] of relations) {
    adj[pre].push(course); inDeg[course]++;
  }
  let queue = [];
  for (let i=1;i<=n;i++) if(inDeg[i]===0) queue.push(i);
  let sems=0, processed=0;
  while (queue.length) {
    sems++;
    const next=[];
    for (const u of queue) {
      processed++;
      for (const v of adj[u]) if(--inDeg[v]===0) next.push(v);
    }
    queue=next;
  }
  return processed===n ? sems : -1;
}`,

    java: `public int minimumSemesters(int n, int[][] relations) {
    int[] inDeg = new int[n+1];
    List<List<Integer>> adj = new ArrayList<>();
    for (int i=0;i<=n;i++) adj.add(new ArrayList<>());
    for (int[] r:relations){adj.get(r[0]).add(r[1]);inDeg[r[1]]++;}
    Queue<Integer> q=new LinkedList<>();
    for(int i=1;i<=n;i++) if(inDeg[i]==0) q.offer(i);
    int sems=0,proc=0;
    while(!q.isEmpty()){
        sems++;
        for(int sz=q.size();sz>0;sz--){
            int u=q.poll(); proc++;
            for(int v:adj.get(u)) if(--inDeg[v]==0) q.offer(v);
        }
    }
    return proc==n?sems:-1;
}`,
  },

  defaultInput: {
    n: 4,
    relations: [2, 1, 3, 1, 1, 4],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Courses',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'relations',
      label: 'Prerequisites (pre,course pairs flat)',
      type: 'array',
      defaultValue: [2, 1, 3, 1, 1, 4],
      placeholder: '2,1,3,1,1,4',
      helperText: 'Flat list of prerequisite->course pairs (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const relFlat = input.relations as number[];
    const steps: AlgorithmStep[] = [];

    const relations: [number, number][] = [];
    for (let i = 0; i + 1 < relFlat.length; i += 2) relations.push([relFlat[i], relFlat[i + 1]]);

    const inDeg: number[] = new Array(n + 1).fill(0);
    const adj: number[][] = Array.from({ length: n + 1 }, () => []);
    for (const [pre, course] of relations) {
      adj[pre].push(course);
      inDeg[course]++;
    }

    const makeViz = (highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: inDeg.slice(1),
      highlights,
      labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `C${i + 1}`])),
    });

    steps.push({
      line: 3,
      explanation: `In-degrees: [${inDeg.slice(1).join(', ')}]. Courses with 0 prerequisites start first.`,
      variables: { inDegrees: inDeg.slice(1) },
      visualization: makeViz({}),
    });

    let queue: number[] = [];
    for (let i = 1; i <= n; i++) if (inDeg[i] === 0) queue.push(i);

    steps.push({
      line: 5,
      explanation: `Semester 1 queue (no prerequisites): [${queue.join(', ')}].`,
      variables: { queue: [...queue] },
      visualization: makeViz(Object.fromEntries(queue.map(v => [v - 1, 'active']))),
    });

    let sems = 0;
    let processed = 0;

    while (queue.length > 0) {
      sems++;
      const next: number[] = [];

      steps.push({
        line: 7,
        explanation: `Semester ${sems}: taking courses [${queue.join(', ')}] simultaneously.`,
        variables: { semester: sems, courses: [...queue] },
        visualization: makeViz(Object.fromEntries(queue.map(v => [v - 1, 'active']))),
      });

      for (const u of queue) {
        processed++;
        for (const v of adj[u]) {
          inDeg[v]--;
          if (inDeg[v] === 0) {
            next.push(v);
            steps.push({
              line: 12,
              explanation: `Course ${u} done. Course ${v} now has 0 prerequisites. Enqueue for next semester.`,
              variables: { completedCourse: u, unlockedCourse: v },
              visualization: makeViz({ [u - 1]: 'sorted', [v - 1]: 'found' }),
            });
          }
        }
      }

      queue = next;
    }

    const result = processed === n ? sems : -1;
    steps.push({
      line: 15,
      explanation: `Processed ${processed}/${n} courses. Minimum semesters needed = ${result === -1 ? 'impossible (cycle detected)' : result}.`,
      variables: { processed, n, result },
      visualization: makeViz(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, processed === n ? 'sorted' : 'mismatch']))),
    });

    return steps;
  },
};

export default parallelCourses;
