import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designBrowserHistory: AlgorithmDefinition = {
  id: 'design-browser-history',
  title: 'Design Browser History',
  leetcodeNumber: 1472,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Implement a browser history with visit(url), back(steps), and forward(steps) operations. Use a doubly linked list where each node stores a URL and has prev/next pointers. The current pointer tracks the active page. back() moves current backward, forward() moves it forward, visit() creates a new node after current and discards forward history.',
  tags: ['linked list', 'doubly linked list', 'design'],

  code: {
    pseudocode: `class BrowserHistory:
  constructor(homepage):
    current = new Node(homepage)

  visit(url):
    node = new Node(url)
    current.next = node
    node.prev = current
    current = node  // forward history discarded

  back(steps):
    while steps > 0 and current.prev != null:
      current = current.prev, steps--
    return current.url

  forward(steps):
    while steps > 0 and current.next != null:
      current = current.next, steps--
    return current.url`,

    python: `class BrowserHistory:
    def __init__(self, homepage):
        self.cur = [homepage]
        self.idx = 0
    def visit(self, url):
        self.cur = self.cur[:self.idx + 1]
        self.cur.append(url)
        self.idx += 1
    def back(self, steps):
        self.idx = max(0, self.idx - steps)
        return self.cur[self.idx]
    def forward(self, steps):
        self.idx = min(len(self.cur) - 1, self.idx + steps)
        return self.cur[self.idx]`,

    javascript: `class BrowserHistory {
  constructor(homepage) { this.history = [homepage]; this.idx = 0; }
  visit(url) {
    this.history = this.history.slice(0, this.idx + 1);
    this.history.push(url);
    this.idx++;
  }
  back(steps) { this.idx = Math.max(0, this.idx - steps); return this.history[this.idx]; }
  forward(steps) { this.idx = Math.min(this.history.length - 1, this.idx + steps); return this.history[this.idx]; }
}`,

    java: `class BrowserHistory {
    List<String> history = new ArrayList<>(); int idx = 0;
    public BrowserHistory(String homepage) { history.add(homepage); }
    public void visit(String url) {
        while (history.size() > idx + 1) history.remove(history.size() - 1);
        history.add(url); idx++;
    }
    public String back(int steps) { idx = Math.max(0, idx - steps); return history.get(idx); }
    public String forward(int steps) { idx = Math.min(history.size()-1, idx+steps); return history.get(idx); }
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Page IDs to Visit',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Sequence of page IDs to simulate visiting (start at page 1)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const pages = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    const history: number[] = [pages[0]];
    let idx = 0;

    steps.push({
      line: 1,
      explanation: `Initialize BrowserHistory with homepage = page ${pages[0]}. History: [${history.join(', ')}]. Current index = ${idx}.`,
      variables: { current: pages[0], idx, history: [...history] },
      visualization: makeViz([...history], { 0: 'found' }, { 0: `cur=${pages[0]}` }),
    });

    // Visit all pages
    for (let i = 1; i < pages.length; i++) {
      history.splice(idx + 1);
      history.push(pages[i]);
      idx++;

      steps.push({
        line: 4,
        explanation: `visit(${pages[i]}): Discard forward history, append page ${pages[i]}. idx = ${idx}. History: [${history.join(', ')}].`,
        variables: { visited: pages[i], idx, history: [...history] },
        visualization: makeViz([...history],
          { ...Object.fromEntries(Array.from({ length: idx }, (_, k) => [k, 'visited'])), [idx]: 'active' },
          { [idx]: `cur=${pages[i]}` }),
      });
    }

    // Go back 2
    const backSteps = 2;
    const prevIdx = idx;
    idx = Math.max(0, idx - backSteps);
    steps.push({
      line: 10,
      explanation: `back(${backSteps}): Move back ${backSteps} steps from index ${prevIdx} to index ${idx}. Current page = ${history[idx]}.`,
      variables: { 'back steps': backSteps, 'previous idx': prevIdx, 'new idx': idx, 'current page': history[idx] },
      visualization: makeViz([...history],
        { ...Object.fromEntries(Array.from({ length: history.length }, (_, k) => [k, k > idx ? 'pointer' : 'visited'])), [idx]: 'found' },
        { [idx]: `cur=${history[idx]}`, [history.length - 1]: 'fwd avail' }),
    });

    // Go forward 1
    const fwdSteps = 1;
    const prevIdx2 = idx;
    idx = Math.min(history.length - 1, idx + fwdSteps);
    steps.push({
      line: 14,
      explanation: `forward(${fwdSteps}): Move forward ${fwdSteps} step from index ${prevIdx2} to index ${idx}. Current page = ${history[idx]}.`,
      variables: { 'forward steps': fwdSteps, 'previous idx': prevIdx2, 'new idx': idx, 'current page': history[idx] },
      visualization: makeViz([...history],
        { ...Object.fromEntries(Array.from({ length: history.length }, (_, k) => [k, k > idx ? 'pointer' : (k < idx ? 'visited' : 'found')])) },
        { [idx]: `cur=${history[idx]}` }),
    });

    steps.push({
      line: 15,
      explanation: `Final state: history = [${history.join(', ')}], current index = ${idx}, current page = ${history[idx]}.`,
      variables: { history, 'current index': idx, 'current page': history[idx] },
      visualization: makeViz([...history], Object.fromEntries(history.map((_, i) => [i, i === idx ? 'found' : 'visited'])), { [idx]: 'current' }),
    });

    return steps;
  },
};

export default designBrowserHistory;
