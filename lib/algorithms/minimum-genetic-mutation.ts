import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumGeneticMutation: AlgorithmDefinition = {
  id: 'minimum-genetic-mutation',
  title: 'Minimum Genetic Mutation',
  leetcodeNumber: 433,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find minimum mutations to transform startGene into endGene using only valid gene strings from the bank. Each mutation changes exactly one character and the result must be in the bank. Uses BFS where each valid gene string is a node. Count BFS levels until endGene is reached.',
  tags: ['graph', 'BFS', 'string transformation', 'gene mutation', 'shortest path'],

  code: {
    pseudocode: `function minMutation(startGene, endGene, bank):
  bankSet = set(bank)
  if endGene not in bankSet: return -1
  queue = [(startGene, 0)]
  visited = {startGene}
  while queue not empty:
    gene, mutations = dequeue
    if gene == endGene: return mutations
    for each position i in gene:
      for c in "ACGT":
        nextGene = gene with position i changed to c
        if nextGene in bankSet and nextGene not in visited:
          visited.add(nextGene)
          enqueue (nextGene, mutations+1)
  return -1`,

    python: `from collections import deque
def minMutation(startGene, endGene, bank):
    bankSet=set(bank)
    if endGene not in bankSet: return -1
    q=deque([(startGene,0)]); vis={startGene}
    while q:
        gene,mut=q.popleft()
        if gene==endGene: return mut
        for i in range(len(gene)):
            for c in 'ACGT':
                ng=gene[:i]+c+gene[i+1:]
                if ng in bankSet and ng not in vis:
                    vis.add(ng); q.append((ng,mut+1))
    return -1`,

    javascript: `function minMutation(startGene, endGene, bank) {
  const bankSet=new Set(bank);
  if(!bankSet.has(endGene)) return -1;
  const q=[[startGene,0]]; const vis=new Set([startGene]);
  let qi=0;
  while(qi<q.length) {
    const[gene,mut]=q[qi++];
    if(gene===endGene) return mut;
    for(let i=0;i<gene.length;i++)
      for(const c of 'ACGT') {
        const ng=gene.slice(0,i)+c+gene.slice(i+1);
        if(bankSet.has(ng)&&!vis.has(ng)){vis.add(ng);q.push([ng,mut+1]);}
      }
  }
  return -1;
}`,

    java: `public int minMutation(String startGene, String endGene, String[] bank) {
    Set<String> bankSet=new HashSet<>(Arrays.asList(bank));
    if(!bankSet.contains(endGene)) return -1;
    Queue<String[]> q=new LinkedList<>(); q.offer(new String[]{startGene,"0"});
    Set<String> vis=new HashSet<>(Set.of(startGene));
    while(!q.isEmpty()){
        String[]cur=q.poll(); String gene=cur[0]; int mut=Integer.parseInt(cur[1]);
        if(gene.equals(endGene)) return mut;
        for(int i=0;i<gene.length();i++) for(char c:"ACGT".toCharArray()){
            String ng=gene.substring(0,i)+c+gene.substring(i+1);
            if(bankSet.contains(ng)&&!vis.contains(ng)){vis.add(ng);q.offer(new String[]{ng,String.valueOf(mut+1)});}
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    startGene: 'AACCGGTT',
    endGene: 'AACCGGTA',
    bank: ['AACCGGTA'],
  },

  inputFields: [
    {
      name: 'startGene',
      label: 'Start Gene',
      type: 'string',
      defaultValue: 'AACCGGTT',
      placeholder: 'AACCGGTT',
      helperText: '8-character gene string (A, C, G, T)',
    },
    {
      name: 'endGene',
      label: 'End Gene',
      type: 'string',
      defaultValue: 'AACCGGTA',
      placeholder: 'AACCGGTA',
      helperText: 'Target gene string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const startGene = input.startGene as string;
    const endGene = input.endGene as string;
    const bank = input.bank as string[];
    const steps: AlgorithmStep[] = [];

    const bankSet = new Set(bank);

    steps.push({
      line: 2,
      explanation: `Gene mutation BFS. Start: "${startGene}", End: "${endGene}". Bank has ${bank.length} valid genes.`,
      variables: { start: startGene, end: endGene, bankSize: bank.length },
      visualization: {
        type: 'array',
        array: bank.map((_, i) => i + 1),
        highlights: {},
        labels: Object.fromEntries(bank.map((g, i) => [i, g === endGene ? 'target' : g])),
      },
    });

    if (!bankSet.has(endGene)) {
      steps.push({
        line: 3,
        explanation: `"${endGene}" not in bank. Mutation impossible. Return -1.`,
        variables: { result: -1 },
        visualization: {
          type: 'array',
          array: [0],
          highlights: { 0: 'mismatch' },
          labels: { 0: 'impossible' },
        },
      });
      return steps;
    }

    const queue: Array<[string, number]> = [[startGene, 0]];
    const visited = new Set([startGene]);
    let qi = 0;

    while (qi < queue.length) {
      const [gene, mutations] = queue[qi++];

      steps.push({
        line: 6,
        explanation: `Check gene "${gene}" (mutations so far: ${mutations}).`,
        variables: { gene, mutations },
        visualization: {
          type: 'array',
          array: bank.map((g, i) => visited.has(g) ? mutations : 0),
          highlights: Object.fromEntries(bank.map((g, i) => [i, g === gene ? 'active' : visited.has(g) ? 'visited' : 'default'])),
          labels: Object.fromEntries(bank.map((g, i) => [i, g])),
        },
      });

      if (gene === endGene) {
        steps.push({
          line: 7,
          explanation: `Reached "${endGene}"! Minimum mutations = ${mutations}.`,
          variables: { result: mutations },
          visualization: {
            type: 'array',
            array: bank.map((g) => visited.has(g) ? mutations : 0),
            highlights: Object.fromEntries(bank.map((g, i) => [i, g === endGene ? 'found' : 'default'])),
            labels: { [bank.indexOf(endGene)]: `ans=${mutations}` },
          },
        });
        break;
      }

      for (let i = 0; i < gene.length; i++) {
        for (const c of 'ACGT') {
          const nextGene = gene.slice(0, i) + c + gene.slice(i + 1);
          if (bankSet.has(nextGene) && !visited.has(nextGene)) {
            visited.add(nextGene);
            queue.push([nextGene, mutations + 1]);
            steps.push({
              line: 11,
              explanation: `Valid mutation: "${gene}" -> "${nextGene}" (change pos ${i}: ${gene[i]}->${c}). Mutations = ${mutations + 1}.`,
              variables: { from: gene, to: nextGene, position: i, newChar: c, totalMutations: mutations + 1 },
              visualization: {
                type: 'array',
                array: bank.map((g) => visited.has(g) ? mutations + 1 : 0),
                highlights: Object.fromEntries(bank.map((g, i) => [i, g === nextGene ? 'comparing' : g === gene ? 'active' : 'default'])),
                labels: Object.fromEntries(bank.map((g, i) => [i, g])),
              },
            });
          }
        }
      }
    }

    return steps;
  },
};

export default minimumGeneticMutation;
