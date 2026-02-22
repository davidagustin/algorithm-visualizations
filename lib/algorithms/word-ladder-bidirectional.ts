import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const wordLadderBidirectional: AlgorithmDefinition = {
  id: 'word-ladder-bidirectional',
  title: 'Word Ladder (Bidirectional BFS)',
  leetcodeNumber: 127,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Find shortest transformation sequence from beginWord to endWord. Uses bidirectional BFS: expand simultaneously from both begin and end. At each step, expand the smaller frontier. When the two frontiers meet, compute the path length. This is significantly faster than standard BFS.',
  tags: ['graph', 'BFS', 'bidirectional BFS', 'word transformation', 'string'],

  code: {
    pseudocode: `function ladderLength(beginWord, endWord, wordList):
  wordSet = set(wordList)
  if endWord not in wordSet: return 0
  frontSet = {beginWord}, backSet = {endWord}
  visited = {beginWord, endWord}
  level = 1
  while frontSet and backSet:
    if size(frontSet) > size(backSet): swap
    nextSet = {}
    for word in frontSet:
      for each neighbor (1-char change):
        if neighbor in backSet: return level+1
        if neighbor in wordSet and not visited:
          visited.add(neighbor); nextSet.add(neighbor)
    frontSet = nextSet; level++
  return 0`,

    python: `def ladderLength(beginWord, endWord, wordList):
    wordSet=set(wordList)
    if endWord not in wordSet: return 0
    front,back={beginWord},{endWord}
    vis={beginWord,endWord}; level=1
    while front and back:
        if len(front)>len(back): front,back=back,front
        nxt=set()
        for w in front:
            for i in range(len(w)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    nb=w[:i]+c+w[i+1:]
                    if nb in back: return level+1
                    if nb in wordSet and nb not in vis:
                        vis.add(nb); nxt.add(nb)
        front=nxt; level+=1
    return 0`,

    javascript: `function ladderLength(beginWord, endWord, wordList) {
  const wordSet=new Set(wordList);
  if(!wordSet.has(endWord)) return 0;
  let front=new Set([beginWord]),back=new Set([endWord]);
  const vis=new Set([beginWord,endWord]); let level=1;
  while(front.size&&back.size) {
    if(front.size>back.size)[front,back]=[back,front];
    const nxt=new Set();
    for(const w of front)
      for(let i=0;i<w.length;i++)
        for(let c=97;c<=122;c++){
          const nb=w.slice(0,i)+String.fromCharCode(c)+w.slice(i+1);
          if(back.has(nb)) return level+1;
          if(wordSet.has(nb)&&!vis.has(nb)){vis.add(nb);nxt.add(nb);}
        }
    front=nxt; level++;
  }
  return 0;
}`,

    java: `public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> wordSet=new HashSet<>(wordList);
    if(!wordSet.contains(endWord)) return 0;
    Set<String> front=new HashSet<>(Set.of(beginWord)),back=new HashSet<>(Set.of(endWord));
    Set<String> vis=new HashSet<>(front); vis.addAll(back);
    int level=1;
    while(!front.isEmpty()&&!back.isEmpty()){
        if(front.size()>back.size()){Set<String> t=front;front=back;back=t;}
        Set<String> nxt=new HashSet<>();
        for(String w:front){char[]cs=w.toCharArray();for(int i=0;i<cs.length;i++){char orig=cs[i];for(char c='a';c<='z';c++){cs[i]=c;String nb=new String(cs);if(back.contains(nb)) return level+1;if(wordSet.contains(nb)&&!vis.contains(nb)){vis.add(nb);nxt.add(nb);}cs[i]=orig;}}}
        front=nxt; level++;
    }
    return 0;
}`,
  },

  defaultInput: {
    beginWord: 'hit',
    endWord: 'cog',
    wordList: ['hot','dot','dog','lot','log','cog'],
  },

  inputFields: [
    {
      name: 'beginWord',
      label: 'Begin Word',
      type: 'string',
      defaultValue: 'hit',
      placeholder: 'hit',
      helperText: 'Starting word',
    },
    {
      name: 'endWord',
      label: 'End Word',
      type: 'string',
      defaultValue: 'cog',
      placeholder: 'cog',
      helperText: 'Target word',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const beginWord = input.beginWord as string;
    const endWord = input.endWord as string;
    const wordList = input.wordList as string[];
    const steps: AlgorithmStep[] = [];

    const wordSet = new Set(wordList);

    steps.push({
      line: 2,
      explanation: `Bidirectional BFS. Begin: "${beginWord}", End: "${endWord}". Word list has ${wordList.length} words.`,
      variables: { beginWord, endWord, wordListSize: wordList.length },
      visualization: {
        type: 'array',
        array: wordList.map((_, i) => i + 1),
        highlights: { 0: 'active', [wordList.length - 1]: 'pointer' },
        labels: { 0: beginWord, [wordList.length - 1]: endWord },
      },
    });

    if (!wordSet.has(endWord)) {
      steps.push({
        line: 3,
        explanation: `"${endWord}" is not in word list. Return 0 (impossible).`,
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: wordList.map((_, i) => i + 1),
          highlights: {},
          labels: { 0: 'no path' },
        },
      });
      return steps;
    }

    function neighbors(word: string, wordSet: Set<string>): string[] {
      const result: string[] = [];
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const nb = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
          if (wordSet.has(nb)) result.push(nb);
        }
      }
      return result;
    }

    let front = new Set([beginWord]);
    let back = new Set([endWord]);
    const vis = new Set([beginWord, endWord]);
    let level = 1;
    let found = false;

    while (front.size > 0 && back.size > 0 && !found) {
      if (front.size > back.size) {
        [front, back] = [back, front];
      }

      steps.push({
        line: 8,
        explanation: `Level ${level}: Expanding smaller frontier (${front.size} words): [${[...front].join(', ')}].`,
        variables: { level, frontSize: front.size, backSize: back.size },
        visualization: {
          type: 'array',
          array: [...front].map((_, i) => level),
          highlights: Object.fromEntries([...front].map((_, i) => [i, 'active'])),
          labels: Object.fromEntries([...front].map((w, i) => [i, w])),
        },
      });

      const nxt = new Set<string>();
      for (const word of front) {
        const nbs = neighbors(word, wordSet);
        for (const nb of nbs) {
          if (back.has(nb)) {
            steps.push({
              line: 11,
              explanation: `Frontiers meet! "${word}" -> "${nb}" which is in back frontier. Path length = ${level + 1}.`,
              variables: { meetWord: nb, pathLength: level + 1 },
              visualization: {
                type: 'array',
                array: [level + 1],
                highlights: { 0: 'found' },
                labels: { 0: `ans=${level + 1}` },
              },
            });
            found = true;
            break;
          }
          if (!vis.has(nb)) {
            vis.add(nb);
            nxt.add(nb);
            steps.push({
              line: 13,
              explanation: `"${word}" -> "${nb}": one char change. Add to next frontier.`,
              variables: { from: word, to: nb },
              visualization: {
                type: 'array',
                array: [...nxt].map((_, i) => level + 1),
                highlights: Object.fromEntries([...nxt].map((_, i) => [i, 'comparing'])),
                labels: Object.fromEntries([...nxt].map((w, i) => [i, w])),
              },
            });
          }
        }
        if (found) break;
      }

      front = nxt;
      level++;
    }

    if (!found) {
      steps.push({
        line: 15,
        explanation: 'No transformation sequence exists. Return 0.',
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: [0],
          highlights: { 0: 'mismatch' },
          labels: { 0: 'no path' },
        },
      });
    }

    return steps;
  },
};

export default wordLadderBidirectional;
