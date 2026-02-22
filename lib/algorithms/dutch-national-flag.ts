import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const dutchNationalFlag: AlgorithmDefinition = {
  id: 'dutch-national-flag',
  title: 'Dutch National Flag (Sort Colors)',
  leetcodeNumber: 75,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Sort an array containing only 0s, 1s, and 2s in-place using three pointers (lo, mid, hi). This is the Dutch National Flag algorithm by Edsger Dijkstra. All 0s go to the left, all 2s to the right, and 1s stay in the middle.',
  tags: ['Sorting', 'Three Pointers', 'In-Place', 'Dutch National Flag'],
  code: {
    pseudocode: `function sortColors(nums):
  lo = 0, mid = 0, hi = n - 1
  while mid <= hi:
    if nums[mid] == 0:
      swap nums[lo] and nums[mid]
      lo++, mid++
    else if nums[mid] == 1:
      mid++
    else:
      swap nums[mid] and nums[hi]
      hi--`,
    python: `def sortColors(nums):
    lo, mid, hi = 0, 0, len(nums) - 1
    while mid <= hi:
        if nums[mid] == 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi -= 1`,
    javascript: `function sortColors(nums) {
  let lo = 0, mid = 0, hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] === 0) {
      [nums[lo], nums[mid]] = [nums[mid], nums[lo]];
      lo++; mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[hi]] = [nums[hi], nums[mid]];
      hi--;
    }
  }
}`,
    java: `public void sortColors(int[] nums) {
    int lo = 0, mid = 0, hi = nums.length - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) {
            int tmp = nums[lo]; nums[lo] = nums[mid]; nums[mid] = tmp;
            lo++; mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            int tmp = nums[mid]; nums[mid] = nums[hi]; nums[hi] = tmp;
            hi--;
        }
    }
}`,
  },
  defaultInput: { nums: [2, 0, 2, 1, 1, 0, 1, 2, 0, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array (0s, 1s, 2s only)',
      type: 'array',
      defaultValue: [2, 0, 2, 1, 1, 0, 1, 2, 0, 1],
      placeholder: 'e.g. 2,0,2,1,1,0',
      helperText: 'Comma-separated values containing only 0, 1, and 2',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    function makeViz(
      lo: number,
      mid: number,
      hi: number,
      swappingIndices: number[] | null,
    ): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      // Color regions based on the three-pointer invariant
      for (let i = 0; i < n; i++) {
        if (i < lo) {
          // 0s region (sorted left)
          highlights[i] = 'found';
        } else if (i > hi) {
          // 2s region (sorted right)
          highlights[i] = 'sorted';
        } else {
          // Unknown/unprocessed region
          highlights[i] = 'default';
        }
      }

      // Mark mid pointer position
      if (mid >= 0 && mid < n && mid >= lo && mid <= hi) {
        highlights[mid] = 'active';
      }

      // Mark swapping indices
      if (swappingIndices) {
        for (const idx of swappingIndices) {
          highlights[idx] = 'comparing';
        }
      }

      // Labels for pointers
      // Handle overlapping pointers by combining labels
      const labelMap = new Map<number, string[]>();
      const addLabel = (idx: number, lbl: string) => {
        if (idx >= 0 && idx < n) {
          if (!labelMap.has(idx)) labelMap.set(idx, []);
          labelMap.get(idx)!.push(lbl);
        }
      };

      addLabel(lo, 'lo');
      addLabel(mid, 'mid');
      addLabel(hi, 'hi');

      labelMap.forEach((lbls, idx) => {
        labels[idx] = lbls.join(',');
      });

      return {
        type: 'array',
        array: nums.slice(),
        highlights,
        labels,
      };
    }

    if (n === 0) {
      steps.push({
        line: 1,
        explanation: 'Array is empty. Nothing to sort.',
        variables: {},
        visualization: { type: 'array', array: [], highlights: {}, labels: {} },
      });
      return steps;
    }

    let lo = 0;
    let mid = 0;
    let hi = n - 1;

    // Initial step
    steps.push({
      line: 2,
      explanation: `Initialize three pointers: lo = 0, mid = 0, hi = ${hi}. The invariant is: [0..lo-1] are 0s, [lo..mid-1] are 1s, [hi+1..end] are 2s, [mid..hi] is unknown.`,
      variables: { lo, mid, hi, nums: nums.slice() },
      visualization: makeViz(lo, mid, hi, null),
    });

    let iterCount = 0;
    const maxIter = n * 2; // Safety bound

    while (mid <= hi && iterCount < maxIter) {
      iterCount++;

      // Step: Check while condition
      steps.push({
        line: 3,
        explanation: `mid (${mid}) <= hi (${hi}), so continue. Examine nums[mid] = nums[${mid}] = ${nums[mid]}.`,
        variables: { lo, mid, hi, 'nums[mid]': nums[mid] },
        visualization: makeViz(lo, mid, hi, null),
      });

      if (nums[mid] === 0) {
        // Step: nums[mid] == 0, swap with lo
        steps.push({
          line: 4,
          explanation: `nums[mid] = ${nums[mid]} (which is 0). Swap nums[lo=${lo}] (${nums[lo]}) with nums[mid=${mid}] (${nums[mid]}). Then advance both lo and mid.`,
          variables: { lo, mid, hi, 'nums[lo]': nums[lo], 'nums[mid]': nums[mid] },
          visualization: makeViz(lo, mid, hi, [lo, mid]),
        });

        // Perform the swap
        const temp = nums[lo];
        nums[lo] = nums[mid];
        nums[mid] = temp;
        lo++;
        mid++;

        // Step: After swap
        steps.push({
          line: 6,
          explanation: `After swap: lo = ${lo}, mid = ${mid}. The 0 has been moved to the left partition.`,
          variables: { lo, mid, hi, nums: nums.slice() },
          visualization: makeViz(lo, mid, hi, null),
        });
      } else if (nums[mid] === 1) {
        // Step: nums[mid] == 1, just advance mid
        steps.push({
          line: 7,
          explanation: `nums[mid] = ${nums[mid]} (which is 1). It is already in the correct middle region. Just advance mid.`,
          variables: { lo, mid, hi, 'nums[mid]': nums[mid] },
          visualization: makeViz(lo, mid, hi, null),
        });

        mid++;

        steps.push({
          line: 8,
          explanation: `mid advanced to ${mid}. The 1 stays in place.`,
          variables: { lo, mid, hi, nums: nums.slice() },
          visualization: makeViz(lo, mid, hi, null),
        });
      } else {
        // nums[mid] === 2
        // Step: nums[mid] == 2, swap with hi
        steps.push({
          line: 9,
          explanation: `nums[mid] = ${nums[mid]} (which is 2). Swap nums[mid=${mid}] (${nums[mid]}) with nums[hi=${hi}] (${nums[hi]}). Then decrement hi. Do NOT advance mid (the swapped element is unknown).`,
          variables: { lo, mid, hi, 'nums[mid]': nums[mid], 'nums[hi]': nums[hi] },
          visualization: makeViz(lo, mid, hi, [mid, hi]),
        });

        // Perform the swap
        const temp = nums[mid];
        nums[mid] = nums[hi];
        nums[hi] = temp;
        hi--;

        // Step: After swap
        steps.push({
          line: 10,
          explanation: `After swap: hi = ${hi}. The 2 has been moved to the right partition. mid stays at ${mid} to re-examine the swapped value (${nums[mid]}).`,
          variables: { lo, mid, hi, nums: nums.slice() },
          visualization: makeViz(lo, mid, hi, null),
        });
      }
    }

    // Final step
    steps.push({
      line: 3,
      explanation: `mid (${mid}) > hi (${hi}), loop ends. The array is now sorted: [${nums.join(', ')}]. All 0s are on the left, 1s in the middle, 2s on the right.`,
      variables: { lo, mid, hi, nums: nums.slice(), sorted: true },
      visualization: {
        type: 'array',
        array: nums.slice(),
        highlights: Object.fromEntries(
          nums.map((val, i) => {
            if (val === 0) return [i, 'found'];
            if (val === 1) return [i, 'active'];
            return [i, 'sorted'];
          })
        ),
        labels: {},
      },
    });

    return steps;
  },
};

export default dutchNationalFlag;
