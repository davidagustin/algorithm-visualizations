import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const binarySearchInsertion: AlgorithmDefinition = {
  id: 'binary-search-insertion',
  title: 'Search Insert Position',
  leetcodeNumber: 35,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be inserted in order. Uses binary search for O(log n) time.',
  tags: ['binary search', 'array', 'sorted', 'insertion'],

  code: {
    pseudocode: `function searchInsert(nums, target):
  left = 0
  right = length(nums) - 1
  while left <= right:
    mid = left + (right - left) / 2
    if nums[mid] == target:
      return mid
    else if nums[mid] < target:
      left = mid + 1
    else:
      right = mid - 1
  return left`,

    python: `def searchInsert(nums: list[int], target: int) -> int:
    left = 0
    right = len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return left`,

    javascript: `function searchInsert(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return left;
}`,

    java: `public int searchInsert(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return left;
}`,
  },

  defaultInput: {
    nums: [1, 3, 5, 7, 9, 11, 13],
    target: 6,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 3, 5, 7, 9, 11, 13],
      placeholder: '1,3,5,7,9,11,13',
      helperText: 'Comma-separated sorted distinct integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Value to find or insert',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const eliminated = new Set<number>();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => {
      // Layer eliminated indices underneath
      const merged: Record<number, string> = {};
      Array.from(eliminated).forEach((idx) => {
        merged[idx] = 'visited';
      });
      // Active highlights override eliminated
      for (const [k, v] of Object.entries(highlights)) {
        merged[Number(k)] = v;
      }
      return {
        type: 'array',
        array: [...nums],
        highlights: merged,
        labels,
      };
    };

    let left = 0;
    let right = nums.length - 1;

    // Step: Initialize pointers
    steps.push({
      line: 2,
      explanation: `Initialize left pointer at index 0 (value ${nums[0]}).`,
      variables: { left, right: '?', target },
      visualization: makeViz(
        { [left]: 'pointer' },
        { [left]: 'L' }
      ),
    });

    steps.push({
      line: 3,
      explanation: `Initialize right pointer at index ${right} (value ${nums[right]}).`,
      variables: { left, right, target },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);

      // Step: Calculate mid
      steps.push({
        line: 5,
        explanation: `Calculate mid = ${left} + floor((${right} - ${left}) / 2) = ${mid}. nums[${mid}] = ${nums[mid]}.`,
        variables: { left, right, mid, 'nums[mid]': nums[mid], target },
        visualization: makeViz(
          { [left]: 'pointer', [right]: 'pointer', [mid]: 'active' },
          { [left]: 'L', [right]: 'R', [mid]: 'mid' }
        ),
      });

      if (nums[mid] === target) {
        // Found target
        steps.push({
          line: 7,
          explanation: `nums[${mid}] = ${nums[mid]} equals target ${target}. Found at index ${mid}!`,
          variables: { left, right, mid, 'nums[mid]': nums[mid], target, result: mid },
          visualization: makeViz(
            { [mid]: 'found' },
            { [mid]: 'found' }
          ),
        });
        return steps;
      } else if (nums[mid] < target) {
        // Step: Too small, move left up
        steps.push({
          line: 9,
          explanation: `nums[${mid}] = ${nums[mid]} < target ${target}. Eliminate left half. Set left = ${mid + 1}.`,
          variables: { left: mid + 1, right, mid, target },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'pointer', [mid]: 'active' },
            { [left]: 'L', [right]: 'R', [mid]: 'mid' }
          ),
        });
        // Mark eliminated indices
        for (let e = left; e <= mid; e++) {
          eliminated.add(e);
        }
        left = mid + 1;
      } else {
        // Step: Too large, move right down
        steps.push({
          line: 11,
          explanation: `nums[${mid}] = ${nums[mid]} > target ${target}. Eliminate right half. Set right = ${mid - 1}.`,
          variables: { left, right: mid - 1, mid, target },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'pointer', [mid]: 'active' },
            { [left]: 'L', [right]: 'R', [mid]: 'mid' }
          ),
        });
        // Mark eliminated indices
        for (let e = mid; e <= right; e++) {
          eliminated.add(e);
        }
        right = mid - 1;
      }

      // Show new bounds after adjustment
      if (left <= right) {
        steps.push({
          line: 4,
          explanation: `New search range: left=${left}, right=${right}. Continue while left <= right.`,
          variables: { left, right, target },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'pointer' },
            { [left]: 'L', [right]: 'R' }
          ),
        });
      }
    }

    // Not found, return insertion point
    steps.push({
      line: 12,
      explanation: `left (${left}) > right (${right}). Target ${target} not found. Insertion index is left = ${left}.`,
      variables: { left, right, target, result: left },
      visualization: (() => {
        const hl: Record<number, string> = {};
        Array.from(eliminated).forEach((idx) => {
          hl[idx] = 'visited';
        });
        if (left < nums.length) {
          hl[left] = 'found';
        }
        const lb: Record<number, string> = {};
        if (left < nums.length) {
          lb[left] = 'insert';
        }
        return {
          type: 'array' as const,
          array: [...nums],
          highlights: hl,
          labels: lb,
        };
      })(),
    });

    return steps;
  },
};

export default binarySearchInsertion;
