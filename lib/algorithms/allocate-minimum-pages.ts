import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const allocateMinimumPages: AlgorithmDefinition = {
  id: 'allocate-minimum-pages',
  title: 'Allocate Minimum Pages',
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given books with page counts and m students, allocate contiguous books to each student minimizing the maximum pages any student reads. Binary search on the answer (max pages): check if m students suffice for that page limit.',
  tags: ['binary search', 'greedy', 'array', 'classic'],

  code: {
    pseudocode: `function allocateMinPages(books, m):
  if m > n: return -1
  lo = max(books), hi = sum(books)
  while lo < hi:
    mid = (lo + hi) / 2
    if canAllocate(books, m, mid):
      hi = mid
    else:
      lo = mid + 1
  return lo

function canAllocate(books, m, maxPages):
  students = 1, pages = 0
  for book in books:
    if pages + book <= maxPages:
      pages += book
    else:
      students++, pages = book
      if students > m: return false
  return true`,
    python: `def allocateMinPages(books: list[int], m: int) -> int:
    n = len(books)
    if m > n: return -1
    def canAllocate(maxPages):
        students, pages = 1, 0
        for book in books:
            if pages + book <= maxPages:
                pages += book
            else:
                students += 1
                pages = book
                if students > m:
                    return False
        return True
    lo, hi = max(books), sum(books)
    while lo < hi:
        mid = (lo + hi) // 2
        if canAllocate(mid): hi = mid
        else: lo = mid + 1
    return lo`,
    javascript: `function allocateMinPages(books, m) {
  const n = books.length;
  if (m > n) return -1;
  const canAllocate = (maxPages) => {
    let students = 1, pages = 0;
    for (const book of books) {
      if (pages + book <= maxPages) pages += book;
      else { students++; pages = book; if (students > m) return false; }
    }
    return true;
  };
  let lo = Math.max(...books), hi = books.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canAllocate(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}`,
    java: `public int allocateMinPages(int[] books, int m) {
    int n = books.length;
    if (m > n) return -1;
    int lo = 0, hi = 0;
    for (int b : books) { lo = Math.max(lo, b); hi += b; }
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        int students = 1, pages = 0;
        for (int b : books) {
            if (pages + b <= mid) pages += b;
            else { students++; pages = b; if (students > m) { lo = mid + 1; break; } }
        }
        if (students <= m) hi = mid; else lo = mid + 1;
    }
    return lo;
}`,
  },

  defaultInput: {
    books: [12, 34, 67, 90],
    m: 2,
  },

  inputFields: [
    {
      name: 'books',
      label: 'Books (page counts)',
      type: 'array',
      defaultValue: [12, 34, 67, 90],
      placeholder: '12,34,67,90',
      helperText: 'Page count of each book',
    },
    {
      name: 'm',
      label: 'm (students)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of students to allocate books to',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const books = input.books as number[];
    const m = input.m as number;
    const steps: AlgorithmStep[] = [];
    const n = books.length;

    if (m > n) {
      steps.push({
        line: 1,
        explanation: `m=${m} > n=${n}. Cannot allocate. Return -1.`,
        variables: { m, n, result: -1 },
        visualization: { type: 'array', array: [...books], highlights: {}, labels: {} },
      });
      return steps;
    }

    const canAllocate = (maxPages: number): { result: boolean; assignment: number[] } => {
      const assignment: number[] = [];
      let students = 1;
      let pages = 0;
      for (const book of books) {
        if (pages + book <= maxPages) {
          pages += book;
          assignment.push(students);
        } else {
          students++;
          pages = book;
          assignment.push(students);
          if (students > m) return { result: false, assignment };
        }
      }
      return { result: true, assignment };
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...books],
      highlights,
      labels,
    });

    let lo = Math.max(...books);
    let hi = books.reduce((a, b) => a + b, 0);

    steps.push({
      line: 2,
      explanation: `books=[${books.join(', ')}], m=${m} students. Binary search on max pages: lo=${lo}, hi=${hi}.`,
      variables: { lo, hi, m },
      visualization: makeViz({}, books.reduce((acc, b, i) => ({ ...acc, [i]: `p=${b}` }), {})),
    });

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const { result, assignment } = canAllocate(mid);
      const highlights: Record<number, string> = {};
      books.forEach((_, i) => { highlights[i] = (assignment[i] || 0) <= m ? 'active' : 'mismatch'; });

      steps.push({
        line: 5,
        explanation: `maxPages=mid=${mid}. Can ${m} students handle this? ${result ? 'YES' : 'NO'}. Assignments: [${assignment.join(', ')}].`,
        variables: { lo, mid, hi, result },
        visualization: makeViz(highlights, books.reduce((acc, _, i) => ({ ...acc, [i]: `S${assignment[i] || '?'}` }), {})),
      });

      if (result) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }

    const { assignment } = canAllocate(lo);
    steps.push({
      line: 9,
      explanation: `Minimum maximum pages = ${lo}. Student assignments: [${assignment.join(', ')}].`,
      variables: { result: lo },
      visualization: makeViz(
        books.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        books.reduce((acc, _, i) => ({ ...acc, [i]: `S${assignment[i]}` }), {})
      ),
    });

    return steps;
  },
};

export default allocateMinimumPages;
