import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bookingConcertTickets: AlgorithmDefinition = {
  id: 'booking-concert-tickets',
  title: 'Booking Concert Tickets in Groups',
  leetcodeNumber: 2286,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'A concert has n rows each with maxRow seats. Support gather(k, maxRow): find lowest row ≤ maxRow with k consecutive seats, book them. Support scatter(k, maxRow): book k seats across rows ≤ maxRow as early as possible. Uses segment tree for range max and prefix sum queries.',
  tags: ['Segment Tree', 'Binary Search', 'Design'],
  code: {
    pseudocode: `class BookMyShow:
  n rows, m seats each
  segMax[]: segment tree for max available seats per row
  segSum[]: segment tree for total available seats (prefix)

  gather(k, maxRow):
    find leftmost row in [0, maxRow] where available >= k
    book k consecutive seats in that row
    return [row, startSeat]

  scatter(k, maxRow):
    if totalAvailable(0, maxRow) < k: return false
    greedily take from each row left to right
    return true`,
    python: `class BookMyShow:
    def __init__(self, n, m):
        self.n = n
        self.m = m
        self.avail = [m] * n  # available seats per row

    def gather(self, k, maxRow):
        for i in range(maxRow + 1):
            if self.avail[i] >= k:
                seat = self.m - self.avail[i]
                self.avail[i] -= k
                return [i, seat]
        return []

    def scatter(self, k, maxRow):
        total = sum(self.avail[:maxRow+1])
        if total < k: return False
        for i in range(maxRow + 1):
            take = min(self.avail[i], k)
            self.avail[i] -= take
            k -= take
            if k == 0: break
        return True`,
    javascript: `class BookMyShow {
  constructor(n, m) { this.avail = new Array(n).fill(m); this.m = m; }
  gather(k, maxRow) {
    for (let i=0; i<=maxRow; i++) {
      if (this.avail[i] >= k) {
        const seat = this.m - this.avail[i];
        this.avail[i] -= k;
        return [i, seat];
      }
    }
    return [];
  }
  scatter(k, maxRow) {
    const total = this.avail.slice(0, maxRow+1).reduce((s,v)=>s+v, 0);
    if (total < k) return false;
    for (let i=0; i<=maxRow && k>0; i++) {
      const take = Math.min(this.avail[i], k);
      this.avail[i] -= take; k -= take;
    }
    return true;
  }
}`,
    java: `class BookMyShow {
    int[] avail; int m;
    public BookMyShow(int n,int m){avail=new int[n];Arrays.fill(avail,m);this.m=m;}
    public int[] gather(int k,int maxRow){
        for(int i=0;i<=maxRow;i++)
            if(avail[i]>=k){int s=m-avail[i];avail[i]-=k;return new int[]{i,s};}
        return new int[]{};
    }
    public boolean scatter(int k,int maxRow){
        long t=0;for(int i=0;i<=maxRow;i++)t+=avail[i];
        if(t<k)return false;
        for(int i=0;i<=maxRow&&k>0;i++){int take=Math.min(avail[i],k);avail[i]-=take;k-=take;}
        return true;
    }
}`,
  },
  defaultInput: { n: 2, m: 5, operations: ['gather','gather','scatter'], args: [[4,0],[2,0],[5,1]] },
  inputFields: [
    { name: 'n', label: 'Rows (n)', type: 'number', defaultValue: 2 },
    { name: 'm', label: 'Seats per row (m)', type: 'number', defaultValue: 5 },
    { name: 'operations', label: 'Operations', type: 'array', defaultValue: ['gather','gather','scatter'] },
    { name: 'args', label: 'Args [[k,maxRow],...]', type: 'array', defaultValue: [[4,0],[2,0],[5,1]] },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const m = input.m as number;
    const operations = input.operations as string[];
    const args = input.args as number[][];
    const steps: AlgorithmStep[] = [];

    const avail = new Array(n).fill(m);

    steps.push({
      line: 1,
      explanation: `BookMyShow: ${n} rows × ${m} seats. All rows start with ${m} available seats.`,
      variables: { n, m },
      visualization: { type: 'array', array: [...avail], highlights: {}, labels: Object.fromEntries(avail.map((_,i)=>[i,`r${i}`])) },
    });

    for (let op = 0; op < operations.length; op++) {
      const [k, maxRow] = args[op];
      const opName = operations[op];

      if (opName === 'gather') {
        let result: number[] = [];
        for (let i = 0; i <= maxRow; i++) {
          if (avail[i] >= k) {
            const seat = m - avail[i];
            avail[i] -= k;
            result = [i, seat];
            break;
          }
        }

        const highlights: Record<number, string> = {};
        const labels: Record<number, string> = {};
        avail.forEach((a, i) => {
          highlights[i] = i <= maxRow ? (result[0] === i ? 'found' : 'active') : 'visited';
          labels[i] = `${a}`;
        });

        steps.push({
          line: 7,
          explanation: `gather(${k}, ${maxRow}): ${result.length ? `Booked row ${result[0]}, seat ${result[1]}. Available: [${avail.join(',')}]` : 'No row found.'}`,
          variables: { k, maxRow, result },
          visualization: { type: 'array', array: [...avail], highlights, labels },
        });
      } else if (opName === 'scatter') {
        const total = avail.slice(0, maxRow + 1).reduce((s, v) => s + v, 0);
        const possible = total >= k;

        if (possible) {
          let rem = k;
          for (let i = 0; i <= maxRow && rem > 0; i++) {
            const take = Math.min(avail[i], rem);
            avail[i] -= take;
            rem -= take;
          }
        }

        const highlights: Record<number, string> = {};
        const labels: Record<number, string> = {};
        avail.forEach((a, i) => {
          highlights[i] = i <= maxRow ? (possible ? 'found' : 'mismatch') : 'visited';
          labels[i] = `${a}`;
        });

        steps.push({
          line: 13,
          explanation: `scatter(${k}, ${maxRow}): total available=${total}, ${possible ? `Booked ${k} seats. Available: [${avail.join(',')}]` : 'Not enough seats.'}`,
          variables: { k, maxRow, total, possible },
          visualization: { type: 'array', array: [...avail], highlights, labels },
        });
      }
    }

    return steps;
  },
};

export default bookingConcertTickets;
