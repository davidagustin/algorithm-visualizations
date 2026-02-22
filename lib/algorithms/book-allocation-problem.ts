import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bookAllocationProblem: AlgorithmDefinition = {
  id: 'book-allocation-problem',
  title: 'Book Allocation Problem',
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Variant of the book allocation problem: given n books and m students, allocate contiguous books so the student reading the most pages reads as few as possible. Demonstrates the binary search on answer pattern with a feasibility check function.',
  tags: ['binary search', 'greedy', 'array', 'classic'],

  code: {
    pseudocode: `function bookAllocation(arr, m):
  n = len(arr)
  if m > n: return -1
  lo = max(arr), hi = sum(arr)
  while lo <= hi:
    mid = (lo + hi) / 2
    if countStudents(arr, mid) <= m:
      hi = mid - 1
    else:
      lo = mid + 1
  return lo

function countStudents(arr, maxPages):
  students = 1, pages = 0
  for x in arr:
    if pages + x <= maxPages: pages += x
    else: students++, pages = x
  return students`,
    python: `def bookAllocation(arr: list[int], m: int) -> int:
    n = len(arr)
    if m > n: return -1
    def countStudents(maxPages):
        students, pages = 1, 0
        for x in arr:
            if pages + x <= maxPages:
                pages += x
            else:
                students += 1
                pages = x
        return students
    lo, hi = max(arr), sum(arr)
    while lo <= hi:
        mid = (lo + hi) // 2
        if countStudents(mid) <= m:
            hi = mid - 1
        else:
            lo = mid + 1
    return lo`,
    javascript: `function bookAllocation(arr, m) {
  const n = arr.length;
  if (m > n) return -1;
  const countStudents = (maxPages) => {
    let students = 1, pages = 0;
    for (const x of arr) {
      if (pages + x <= maxPages) pages += x;
      else { students++; pages = x; }
    }
    return students;
  };
  let lo = Math.max(...arr), hi = arr.reduce((a, b) => a + b, 0);
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (countStudents(mid) <= m) hi = mid - 1;
    else lo = mid + 1;
  }
  return lo;
}`,
    java: `public int bookAllocation(int[] arr, int m) {
    int n = arr.length;
    if (m > n) return -1;
    int lo = 0, hi = 0;
    for (int x : arr) { lo = Math.max(lo, x); hi += x; }
    while (lo <= hi) {
        int mid = (lo + hi) / 2, students = 1, pages = 0;
        for (int x : arr) {
            if (pages + x <= mid) pages += x;
            else { students++; pages = x; }
        }
        if (students <= m) hi = mid - 1; else lo = mid + 1;
    }
    return lo;
}`,
  },

  defaultInput: {
    arr: [10, 20, 30, 40, 50],
    m: 3,
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Book Page Counts',
      type: 'array',
      defaultValue: [10, 20, 30, 40, 50],
      placeholder: '10,20,30,40,50',
      helperText: 'Page count of each book',
    },
    {
      name: 'm',
      label: 'm (students)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of students',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const m = input.m as number;
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    if (m > n) {
      steps.push({
        line: 1,
        explanation: `m=${m} > n=${n}. Impossible allocation. Return -1.`,
        variables: { m, n, result: -1 },
        visualization: { type: 'array', array: [...arr], highlights: {}, labels: {} },
      });
      return steps;
    }

    const countStudents = (maxPages: number) => {
      let students = 1;
      let pages = 0;
      for (const x of arr) {
        if (pages + x <= maxPages) {
          pages += x;
        } else {
          students++;
          pages = x;
        }
      }
      return students;
    };

    const makeViz = (maxPages: number, highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels: arr.reduce((acc, x, i) => ({ ...acc, [i]: `p=${x}` }), {}),
    });

    let lo = Math.max(...arr);
    let hi = arr.reduce((a, b) => a + b, 0);

    steps.push({
      line: 2,
      explanation: `arr=[${arr.join(', ')}], m=${m}. Binary search on max pages: lo=${lo} (largest book), hi=${hi} (all books to one student).`,
      variables: { lo, hi, m },
      visualization: makeViz(hi, {}),
    });

    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const students = countStudents(mid);

      steps.push({
        line: 6,
        explanation: `mid=${mid}. With max ${mid} pages, need ${students} students (m=${m}).`,
        variables: { lo, mid, hi, students, m },
        visualization: makeViz(mid, arr.reduce((acc, _, i) => ({ ...acc, [i]: 'comparing' }), {})),
      });

      if (students <= m) {
        steps.push({
          line: 7,
          explanation: `students=${students} <= m=${m}. max=${mid} feasible. Try smaller. hi=${mid - 1}.`,
          variables: { lo, hi: mid - 1 },
          visualization: makeViz(mid, arr.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {})),
        });
        hi = mid - 1;
      } else {
        steps.push({
          line: 9,
          explanation: `students=${students} > m=${m}. max=${mid} too small. lo=${mid + 1}.`,
          variables: { lo: mid + 1, hi },
          visualization: makeViz(mid, arr.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {})),
        });
        lo = mid + 1;
      }
    }

    steps.push({
      line: 11,
      explanation: `Minimum maximum pages = ${lo}. With ${lo} pages max, ${countStudents(lo)} students needed.`,
      variables: { result: lo, students: countStudents(lo) },
      visualization: makeViz(lo, arr.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {})),
    });

    return steps;
  },
};

export default bookAllocationProblem;
