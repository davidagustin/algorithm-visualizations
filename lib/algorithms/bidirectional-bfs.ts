import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const bidirectionalBfs: AlgorithmDefinition = {
  id: 'bidirectional-bfs',
  title: 'Bidirectional BFS',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Bidirectional BFS runs simultaneous BFS from both the source and target. It expands the smaller frontier at each step. When the frontiers meet, the shortest path is found. This reduces the search space significantly compared to standard BFS - from O(b^d) to O(b^(d/2)).',
  tags: ['graph', 'BFS', 'bidirectional', 'shortest path', 'optimization'],

  code: {
    pseudocode: `function bidirectionalBFS(graph, src, dst):
  if src == dst: return 0
  frontFront = {src}, backFront = {dst}
  frontVisited = {src:0}, backVisited = {dst:0}
  dist = 0
  while frontFront and backFront:
    if size(frontFront) > size(backFront):
      swap frontFront and backFront
      swap frontVisited and backVisited
    nextFront = {}
    for node in frontFront:
      for nb in graph[node]:
        if nb not in frontVisited:
          frontVisited[nb] = dist+1
          nextFront.add(nb)
        if nb in backVisited:
          return frontVisited[nb] + backVisited[nb]
    frontFront = nextFront; dist++
  return -1`,

    python: `from collections import deque
def bidirectionalBFS(graph, src, dst):
    if src == dst: return 0
    fFront, bFront = {src}, {dst}
    fVisited, bVisited = {src:0}, {dst:0}
    dist = 0
    while fFront and bFront:
        if len(fFront)>len(bFront):
            fFront,bFront=bFront,fFront
            fVisited,bVisited=bVisited,fVisited
        nxt = set()
        for node in fFront:
            for nb in graph[node]:
                if nb not in fVisited:
                    fVisited[nb]=dist+1; nxt.add(nb)
                if nb in bVisited:
                    return fVisited.get(nb,dist+1)+bVisited[nb]
        fFront=nxt; dist+=1
    return -1`,

    javascript: `function bidirectionalBFS(graph, src, dst) {
  if (src===dst) return 0;
  let fFront=new Set([src]), bFront=new Set([dst]);
  let fVis=new Map([[src,0]]), bVis=new Map([[dst,0]]);
  let dist=0;
  while(fFront.size&&bFront.size) {
    if(fFront.size>bFront.size){[fFront,bFront]=[bFront,fFront];[fVis,bVis]=[bVis,fVis];}
    const nxt=new Set();
    for(const node of fFront)
      for(const nb of graph[node]) {
        if(!fVis.has(nb)){fVis.set(nb,dist+1);nxt.add(nb);}
        if(bVis.has(nb)) return fVis.get(nb)+bVis.get(nb);
      }
    fFront=nxt; dist++;
  }
  return -1;
}`,

    java: `public int bidirectionalBFS(Map<Integer,List<Integer>> graph, int src, int dst) {
    if(src==dst) return 0;
    Set<Integer> ff=new HashSet<>(Set.of(src)),bf=new HashSet<>(Set.of(dst));
    Map<Integer,Integer> fv=new HashMap<>(Map.of(src,0)),bv=new HashMap<>(Map.of(dst,0));
    int dist=0;
    while(!ff.isEmpty()&&!bf.isEmpty()){
        if(ff.size()>bf.size()){Set<Integer>ts=ff;ff=bf;bf=ts;Map<Integer,Integer>tm=fv;fv=bv;bv=tm;}
        Set<Integer> nxt=new HashSet<>();
        for(int node:ff) for(int nb:graph.getOrDefault(node,List.of())){
            if(!fv.containsKey(nb)){fv.put(nb,dist+1);nxt.add(nb);}
            if(bv.containsKey(nb)) return fv.get(nb)+bv.get(nb);
        }
        ff=nxt; dist++;
    }
    return -1;
}`,
  },

  defaultInput: {
    n: 8,
    edges: [[0,1],[1,2],[2,3],[3,7],[0,4],[4,5],[5,6],[6,7]],
    source: 0,
    target: 7,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Total nodes in graph',
    },
    {
      name: 'source',
      label: 'Source Node',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'BFS start node',
    },
    {
      name: 'target',
      label: 'Target Node',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'BFS destination node',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const source = input.source as number;
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const graph: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      graph[u].push(v);
      graph[v].push(u);
    }

    if (source === target) {
      steps.push({
        line: 1,
        explanation: `Source equals target. Distance = 0.`,
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: Array.from({ length: n }, (_, i) => i),
          highlights: { [source]: 'found' },
          labels: { [source]: 'src=dst' },
        },
      });
      return steps;
    }

    let fFront = new Set([source]);
    let bFront = new Set([target]);
    const fVis = new Map([[source, 0]]);
    const bVis = new Map([[target, 0]]);
    let dist = 0;
    let found = false;

    steps.push({
      line: 2,
      explanation: `Start bidirectional BFS. Forward frontier: {${source}}, Backward frontier: {${target}}.`,
      variables: { forwardFrontier: [source], backwardFrontier: [target] },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => {
          if (i === source) return 0;
          if (i === target) return 0;
          return -1;
        }),
        highlights: { [source]: 'active', [target]: 'pointer' },
        labels: { [source]: 'fwd', [target]: 'bwd' },
      },
    });

    let iterations = 0;
    while (fFront.size > 0 && bFront.size > 0 && !found && iterations < 10) {
      iterations++;

      if (fFront.size > bFront.size) {
        [fFront, bFront] = [bFront, fFront];
        const tmp = new Map(fVis);
        fVis.clear(); bVis.forEach((v, k) => fVis.set(k, v));
        bVis.clear(); tmp.forEach((v, k) => bVis.set(k, v));
      }

      const vizArray = Array.from({ length: n }, (_, i) => {
        if (fVis.has(i) && bVis.has(i)) return 99;
        if (fVis.has(i)) return fVis.get(i)!;
        if (bVis.has(i)) return bVis.get(i)!;
        return -1;
      });

      steps.push({
        line: 7,
        explanation: `Level ${dist}: Expanding smaller frontier (size ${fFront.size}). Nodes: {${[...fFront].join(', ')}}.`,
        variables: { level: dist, frontierSize: fFront.size },
        visualization: {
          type: 'array',
          array: vizArray,
          highlights: Object.fromEntries([...fFront].map(v => [v, 'active'])),
          labels: { [source]: 'src', [target]: 'dst' },
        },
      });

      const nxt = new Set<number>();
      for (const node of fFront) {
        for (const nb of graph[node]) {
          if (!fVis.has(nb)) {
            fVis.set(nb, dist + 1);
            nxt.add(nb);
          }
          if (bVis.has(nb)) {
            const totalDist = (fVis.get(nb) ?? dist + 1) + bVis.get(nb)!;
            steps.push({
              line: 13,
              explanation: `Frontiers meet at node ${nb}! fDist=${fVis.get(nb)}, bDist=${bVis.get(nb)}. Total path length = ${totalDist}.`,
              variables: { meetNode: nb, totalDistance: totalDist },
              visualization: {
                type: 'array',
                array: Array.from({ length: n }, (_, i) => {
                  if (i === nb) return totalDist;
                  if (fVis.has(i)) return fVis.get(i)!;
                  if (bVis.has(i)) return bVis.get(i)!;
                  return -1;
                }),
                highlights: { [nb]: 'found', [source]: 'active', [target]: 'pointer' },
                labels: { [nb]: `meet!`, [source]: 'src', [target]: 'dst' },
              },
            });
            found = true;
            break;
          }
        }
        if (found) break;
      }

      fFront = nxt;
      dist++;
    }

    return steps;
  },
};

export default bidirectionalBfs;
