import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const cutOffTreesForGolf: AlgorithmDefinition = {
  id: 'cut-off-trees-for-golf',
  title: 'Cut Off Trees for Golf Event',
  leetcodeNumber: 675,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'In a grid, trees have height > 1 and must be cut in order from shortest to tallest. Starting at (0,0), find the minimum total steps to cut all trees in order. Use BFS to find shortest path between consecutive trees. Sort trees by height and sum all BFS distances.',
  tags: ['graph', 'BFS', 'grid', 'sorting', 'simulation'],

  code: {
    pseudocode: `function cutOffTree(forest):
  trees = all (height, r, c) with height > 1
  sort trees by height
  total = 0
  (r, c) = (0, 0)
  for each tree (h, tr, tc) in sorted order:
    dist = BFS((r,c), (tr,tc), forest)
    if dist == -1: return -1
    total += dist
    (r, c) = (tr, tc)
  return total`,

    python: `from collections import deque
def cutOffTree(forest):
    R,C=len(forest),len(forest[0])
    trees=sorted((forest[r][c],r,c) for r in range(R) for c in range(C) if forest[r][c]>1)
    def bfs(sr,sc,er,ec):
        if sr==er and sc==ec: return 0
        vis={(sr,sc)}; q=deque([(sr,sc,0)])
        while q:
            r,c,d=q.popleft()
            for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)]:
                nr,nc=r+dr,c+dc
                if 0<=nr<R and 0<=nc<C and forest[nr][nc] and (nr,nc) not in vis:
                    if nr==er and nc==ec: return d+1
                    vis.add((nr,nc)); q.append((nr,nc,d+1))
        return -1
    total=0; r,c=0,0
    for _,tr,tc in trees:
        d=bfs(r,c,tr,tc)
        if d==-1: return -1
        total+=d; r,c=tr,tc
    return total`,

    javascript: `function cutOffTree(forest) {
  const R=forest.length,C=forest[0].length;
  const trees=[];
  for(let r=0;r<R;r++) for(let c=0;c<C;c++) if(forest[r][c]>1) trees.push([forest[r][c],r,c]);
  trees.sort((a,b)=>a[0]-b[0]);
  function bfs(sr,sc,er,ec){
    if(sr===er&&sc===ec) return 0;
    const vis=new Set([sr+','+sc]); const q=[[sr,sc,0]]; let qi=0;
    while(qi<q.length){
      const[r,c,d]=q[qi++];
      for(const[dr,dc] of[[0,1],[0,-1],[1,0],[-1,0]]){
        const nr=r+dr,nc=c+dc,k=nr+','+nc;
        if(nr>=0&&nr<R&&nc>=0&&nc<C&&forest[nr][nc]&&!vis.has(k)){
          if(nr===er&&nc===ec) return d+1; vis.add(k); q.push([nr,nc,d+1]);
        }
      }
    }
    return -1;
  }
  let total=0,r=0,c=0;
  for(const[,tr,tc] of trees){const d=bfs(r,c,tr,tc);if(d===-1) return -1;total+=d;r=tr;c=tc;}
  return total;
}`,

    java: `public int cutOffTree(List<List<Integer>> forest) {
    int R=forest.size(),C=forest.get(0).size();
    List<int[]> trees=new ArrayList<>();
    for(int r=0;r<R;r++) for(int c=0;c<C;c++) if(forest.get(r).get(c)>1) trees.add(new int[]{forest.get(r).get(c),r,c});
    trees.sort((a,b)->a[0]-b[0]);
    int total=0,r=0,c=0;
    for(int[]t:trees){int d=bfs(forest,r,c,t[1],t[2],R,C);if(d==-1)return -1;total+=d;r=t[1];c=t[2];}
    return total;
}`,
  },

  defaultInput: {
    forest: [[1,2,3],[0,0,4],[7,6,5]],
  },

  inputFields: [
    {
      name: 'forest',
      label: 'Forest Grid (rows)',
      type: 'array',
      defaultValue: [1,2,3,0,0,4,7,6,5],
      placeholder: '1,2,3,0,0,4,7,6,5',
      helperText: 'Grid values: 0=blocked, 1=empty, >1=tree height',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const forest = input.forest as number[][];
    const steps: AlgorithmStep[] = [];
    const R = forest.length;
    const C = forest[0].length;

    // Collect and sort trees
    const trees: Array<[number, number, number]> = [];
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (forest[r][c] > 1) trees.push([forest[r][c], r, c]);
      }
    }
    trees.sort((a, b) => a[0] - b[0]);

    steps.push({
      line: 2,
      explanation: `Collect ${trees.length} trees and sort by height. Order: [${trees.map(t => `h${t[0]}@(${t[1]},${t[2]})`).join(', ')}].`,
      variables: { treeCount: trees.length, order: trees.map(t => t[0]).join(', ') },
      visualization: {
        type: 'array',
        array: forest.flat(),
        highlights: Object.fromEntries(trees.map((t, i) => [t[1] * C + t[2], i === 0 ? 'active' : 'comparing'])),
        labels: Object.fromEntries(trees.map((t, idx) => [t[1] * C + t[2], `#${idx + 1}h=${t[0]}`])),
      },
    });

    function bfs(sr: number, sc: number, er: number, ec: number): number {
      if (sr === er && sc === ec) return 0;
      const vis = new Set([`${sr},${sc}`]);
      const queue: Array<[number, number, number]> = [[sr, sc, 0]];
      let qi = 0;
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      while (qi < queue.length) {
        const [r, c, d] = queue[qi++];
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          const key = `${nr},${nc}`;
          if (nr >= 0 && nr < R && nc >= 0 && nc < C && forest[nr][nc] !== 0 && !vis.has(key)) {
            if (nr === er && nc === ec) return d + 1;
            vis.add(key);
            queue.push([nr, nc, d + 1]);
          }
        }
      }
      return -1;
    }

    let total = 0;
    let curR = 0;
    let curC = 0;

    for (let i = 0; i < trees.length; i++) {
      const [height, tr, tc] = trees[i];
      const dist = bfs(curR, curC, tr, tc);

      if (dist === -1) {
        steps.push({
          line: 9,
          explanation: `Cannot reach tree ${i + 1} (height ${height}) at (${tr},${tc}) from (${curR},${curC}). Return -1.`,
          variables: { treeIndex: i + 1, from: `(${curR},${curC})`, to: `(${tr},${tc})` },
          visualization: {
            type: 'array',
            array: forest.flat(),
            highlights: { [curR * C + curC]: 'active', [tr * C + tc]: 'mismatch' },
            labels: { [curR * C + curC]: 'here', [tr * C + tc]: 'blocked' },
          },
        });
        return steps;
      }

      total += dist;
      steps.push({
        line: 8,
        explanation: `BFS from (${curR},${curC}) to tree ${i + 1} (h=${height}) at (${tr},${tc}): ${dist} steps. Running total = ${total}.`,
        variables: { treeIndex: i + 1, height, from: `(${curR},${curC})`, to: `(${tr},${tc})`, steps: dist, total },
        visualization: {
          type: 'array',
          array: forest.flat(),
          highlights: { [curR * C + curC]: 'active', [tr * C + tc]: 'found' },
          labels: { [curR * C + curC]: 'start', [tr * C + tc]: `d=${dist}` },
        },
      });

      curR = tr;
      curC = tc;
    }

    steps.push({
      line: 10,
      explanation: `All ${trees.length} trees cut in order. Total steps = ${total}.`,
      variables: { result: total, treesCount: trees.length },
      visualization: {
        type: 'array',
        array: forest.flat(),
        highlights: { 0: 'found' },
        labels: { 0: `total=${total}` },
      },
    });

    return steps;
  },
};

export default cutOffTreesForGolf;
