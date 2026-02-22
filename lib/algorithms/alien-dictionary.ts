import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const alienDictionary: AlgorithmDefinition = {
  id: 'alien-dictionary',
  title: 'Alien Dictionary',
  leetcodeNumber: 269,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a list of words sorted in an alien language, derive the order of characters in the alien alphabet. Compare adjacent words to find ordering constraints between characters, then topological sort the resulting DAG. Return "" if a cycle is found.',
  tags: ['Graph', 'Topological Sort', 'DFS', 'BFS'],
  code: {
    pseudocode: `function alienOrder(words):
  chars = all unique chars in words
  inDegree = {c: 0 for c in chars}
  adj = {}
  for i from 0 to len(words)-2:
    w1, w2 = words[i], words[i+1]
    minLen = min(len(w1), len(w2))
    if w1 starts with w2 and len(w1) > len(w2): return ""
    for j in range(minLen):
      if w1[j] != w2[j]:
        adj[w1[j]].add(w2[j])
        inDegree[w2[j]] += 1
        break
  topological sort → return order or "" if cycle`,
    python: `def alienOrder(words):
    adj = {c: set() for w in words for c in w}
    inDegree = {c: 0 for c in adj}
    for i in range(len(words)-1):
        w1, w2 = words[i], words[i+1]
        minL = min(len(w1), len(w2))
        if len(w1)>len(w2) and w1[:minL]==w2[:minL]: return ""
        for j in range(minL):
            if w1[j]!=w2[j]:
                if w2[j] not in adj[w1[j]]:
                    adj[w1[j]].add(w2[j])
                    inDegree[w2[j]]+=1
                break
    queue=deque(c for c in inDegree if inDegree[c]==0)
    order=""
    while queue:
        c=queue.popleft(); order+=c
        for nb in adj[c]:
            inDegree[nb]-=1
            if inDegree[nb]==0: queue.append(nb)
    return order if len(order)==len(adj) else ""`,
    javascript: `function alienOrder(words) {
  const adj = new Map(), inDeg = new Map();
  for (const w of words) for (const c of w) { if(!adj.has(c)) adj.set(c,new Set()); if(!inDeg.has(c)) inDeg.set(c,0); }
  for (let i=0;i<words.length-1;i++) {
    const [w1,w2]=[words[i],words[i+1]];
    const minL=Math.min(w1.length,w2.length);
    if(w1.length>w2.length&&w1.slice(0,minL)===w2.slice(0,minL)) return "";
    for(let j=0;j<minL;j++) if(w1[j]!==w2[j]){if(!adj.get(w1[j]).has(w2[j])){adj.get(w1[j]).add(w2[j]);inDeg.set(w2[j],inDeg.get(w2[j])+1);}break;}
  }
  const queue=[...inDeg.keys()].filter(c=>inDeg.get(c)===0);
  let order="";
  while(queue.length){const c=queue.shift();order+=c;for(const nb of adj.get(c)){inDeg.set(nb,inDeg.get(nb)-1);if(inDeg.get(nb)===0) queue.push(nb);}}
  return order.length===adj.size?order:"";
}`,
    java: `public String alienOrder(String[] words) {
    Map<Character,Set<Character>> adj=new HashMap<>();
    Map<Character,Integer> inDeg=new HashMap<>();
    for(String w:words) for(char c:w.toCharArray()){adj.putIfAbsent(c,new HashSet<>());inDeg.putIfAbsent(c,0);}
    for(int i=0;i<words.length-1;i++){String w1=words[i],w2=words[i+1];int minL=Math.min(w1.length(),w2.length());if(w1.length()>w2.length()&&w1.substring(0,minL).equals(w2)) return "";for(int j=0;j<minL;j++)if(w1.charAt(j)!=w2.charAt(j)){char a=w1.charAt(j),b=w2.charAt(j);if(adj.get(a).add(b)) inDeg.put(b,inDeg.get(b)+1);break;}}
    Queue<Character> q=new LinkedList<>();for(char c:inDeg.keySet()) if(inDeg.get(c)==0) q.add(c);
    StringBuilder sb=new StringBuilder();while(!q.isEmpty()){char c=q.poll();sb.append(c);for(char nb:adj.get(c)) if(--inDeg.get(nb)==0) q.add(nb);}
    return sb.length()==adj.size()?sb.toString():"";
}`,
  },
  defaultInput: {
    words: ['wrt', 'wrf', 'er', 'ett', 'rftt'],
  },
  inputFields: [
    {
      name: 'words',
      label: 'Sorted Alien Words',
      type: 'array',
      defaultValue: ['wrt', 'wrf', 'er', 'ett', 'rftt'],
      placeholder: '["wrt","wrf","er","ett","rftt"]',
      helperText: 'List of words sorted in alien language order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const steps: AlgorithmStep[] = [];

    // Collect all unique chars
    const allChars = [...new Set(words.join('').split(''))].sort();
    const charToIdx: Record<string, number> = {};
    allChars.forEach((c, i) => { charToIdx[c] = i; });
    const n = allChars.length;

    const inDegree = new Array(n).fill(0);
    const adj: Set<number>[] = Array.from({ length: n }, () => new Set());
    const edges: [string, string][] = [];

    function makeViz(
      highlights: Record<number, string>,
      order: string[],
      queue: string[]
    ): ArrayVisualization {
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) labels[i] = `${allChars[i]}:${inDegree[i]}`;
      return {
        type: 'array',
        array: [...inDegree],
        highlights,
        labels,
        auxData: {
          label: 'Alien Alphabet Order',
          entries: [
            { key: 'Characters', value: allChars.join(', ') },
            { key: 'Edges', value: edges.map(([a, b]) => `${a}→${b}`).join(', ') || 'none' },
            { key: 'Queue', value: queue.join(', ') || 'empty' },
            { key: 'Order', value: order.join('') || 'none' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Alien words: [${words.map(w => `"${w}"`).join(', ')}]. Unique chars: [${allChars.join(', ')}]. Compare adjacent words to find ordering constraints.`,
      variables: { chars: allChars },
      visualization: makeViz({}, [], []),
    });

    // Build graph
    let invalid = false;
    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i], w2 = words[i + 1];
      const minL = Math.min(w1.length, w2.length);
      if (w1.length > w2.length && w1.slice(0, minL) === w2) {
        invalid = true;
        steps.push({
          line: 8,
          explanation: `Invalid: "${w1}" comes before "${w2}" but "${w1}" is longer and starts with "${w2}". Return "".`,
          variables: { w1, w2 },
          visualization: makeViz({}, [], []),
        });
        return steps;
      }
      for (let j = 0; j < minL; j++) {
        if (w1[j] !== w2[j]) {
          const from = charToIdx[w1[j]];
          const to = charToIdx[w2[j]];
          if (!adj[from].has(to)) {
            adj[from].add(to);
            inDegree[to]++;
            edges.push([w1[j], w2[j]]);
            steps.push({
              line: 11,
              explanation: `Compare "${w1}" vs "${w2}": first diff at pos ${j}: '${w1[j]}' < '${w2[j]}'. Add edge ${w1[j]}→${w2[j]}.`,
              variables: { from: w1[j], to: w2[j] },
              visualization: makeViz({ [from]: 'active', [to]: 'comparing' }, [], []),
            });
          }
          break;
        }
      }
    }

    if (!invalid) {
      steps.push({
        line: 14,
        explanation: `Graph built with ${edges.length} edges. Now topological sort (Kahn's BFS).`,
        variables: { edges: edges.map(([a, b]) => `${a}→${b}`) },
        visualization: makeViz({}, [], []),
      });

      const queue: string[] = allChars.filter((_, i) => inDegree[i] === 0);
      const order: string[] = [];

      const seedHL: Record<number, string> = {};
      for (const c of queue) seedHL[charToIdx[c]] = 'active';
      steps.push({
        line: 15,
        explanation: `Start BFS with chars having in-degree 0: [${queue.join(', ')}].`,
        variables: { queue: [...queue] },
        visualization: makeViz(seedHL, [], [...queue]),
      });

      while (queue.length > 0) {
        const c = queue.shift()!;
        order.push(c);
        const ci = charToIdx[c];
        steps.push({
          line: 17,
          explanation: `Process '${c}'. Add to order. Current order: "${order.join('')}".`,
          variables: { char: c, order: order.join('') },
          visualization: makeViz({ [ci]: 'found' }, [...order], [...queue]),
        });
        for (const nbi of adj[ci]) {
          inDegree[nbi]--;
          if (inDegree[nbi] === 0) {
            queue.push(allChars[nbi]);
            steps.push({
              line: 20,
              explanation: `'${allChars[nbi]}' in-degree → 0. Enqueue it.`,
              variables: { char: allChars[nbi] },
              visualization: makeViz({ [ci]: 'found', [nbi]: 'active' }, [...order], [...queue]),
            });
          }
        }
      }

      const result = order.length === n ? order.join('') : '';
      const finalHL: Record<number, string> = {};
      for (let i = 0; i < n; i++) finalHL[i] = order.includes(allChars[i]) ? 'found' : 'mismatch';

      steps.push({
        line: 22,
        explanation: result
          ? `Alien alphabet order: "${result}".`
          : `Cycle detected — no valid ordering exists. Return "".`,
        variables: { result },
        visualization: makeViz(finalHL, [...order], []),
      });
    }

    return steps;
  },
};

export default alienDictionary;
