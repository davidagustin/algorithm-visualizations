import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const firstAndLastOccurrences: AlgorithmDefinition = {
  id: 'first-and-last-occurrences',
  title: 'First and Last Occurrences',
  leetcodeNumber: 34,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given a sorted array of integers and a target value, find the starting and ending position of the target. If the target is not found, return [-1, -1]. Uses two binary searches: one biased left to find the first occurrence and one biased right to find the last occurrence. Runs in O(log n) time.',
  tags: ['Binary Search', 'Array', 'Sorted'],
  code: {
    pseudocode: `function searchRange(nums, target):
  first = findFirst(nums, target)
  last = findLast(nums, target)
  return [first, last]

function findFirst(nums, target):
  left = 0, right = n - 1, result = -1
  while left <= right:
    mid = left + (right - left) / 2
    if nums[mid] == target:
      result = mid
      right = mid - 1
    else if nums[mid] < target:
      left = mid + 1
    else:
      right = mid - 1
  return result

function findLast(nums, target):
  left = 0, right = n - 1, result = -1
  while left <= right:
    mid = left + (right - left) / 2
    if nums[mid] == target:
      result = mid
      left = mid + 1
    else if nums[mid] < target:
      left = mid + 1
    else:
      right = mid - 1
  return result`,
    python: `def searchRange(nums, target):
    def findFirst():
        left, right, result = 0, len(nums) - 1, -1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                result = mid
                right = mid - 1
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return result

    def findLast():
        left, right, result = 0, len(nums) - 1, -1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                result = mid
                left = mid + 1
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return result

    return [findFirst(), findLast()]`,
    javascript: `function searchRange(nums, target) {
  function findFirst() {
    let left = 0, right = nums.length - 1, result = -1;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] === target) {
        result = mid;
        right = mid - 1;
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return result;
  }

  function findLast() {
    let left = 0, right = nums.length - 1, result = -1;
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (nums[mid] === target) {
        result = mid;
        left = mid + 1;
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return result;
  }

  return [findFirst(), findLast()];
}`,
    java: `public int[] searchRange(int[] nums, int target) {
    return new int[]{findFirst(nums, target), findLast(nums, target)};
}

private int findFirst(int[] nums, int target) {
    int left = 0, right = nums.length - 1, result = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            result = mid;
            right = mid - 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return result;
}

private int findLast(int[] nums, int target) {
    int left = 0, right = nums.length - 1, result = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            result = mid;
            left = mid + 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return result;
}`,
  },
  defaultInput: { nums: [5, 7, 7, 8, 8, 10], target: 8 },
  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [5, 7, 7, 8, 8, 10],
      placeholder: '5,7,7,8,8,10',
      helperText: 'Comma-separated sorted integers (may have duplicates)',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Value to find first and last positions of',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Results', entries: auxEntries } } : {}),
    });

    // --- Phase 1: Find First Occurrence ---
    steps.push({
      line: 1,
      explanation: `Search for target ${target} in array [${nums.join(', ')}]. First, find the leftmost (first) occurrence.`,
      variables: { target, phase: 'findFirst' },
      visualization: makeViz({}, {}),
    });

    let left = 0;
    let right = n - 1;
    let firstResult = -1;

    steps.push({
      line: 7,
      explanation: `findFirst: Initialize left=0, right=${right}, result=-1.`,
      variables: { left, right, firstResult },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' },
      ),
    });

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);

      steps.push({
        line: 9,
        explanation: `findFirst: mid = ${left} + floor((${right} - ${left}) / 2) = ${mid}. nums[${mid}] = ${nums[mid]}.`,
        variables: { left, right, mid, 'nums[mid]': nums[mid], firstResult },
        visualization: makeViz(
          { [left]: 'pointer', [right]: 'pointer', [mid]: 'active' },
          { [left]: 'L', [right]: 'R', [mid]: 'mid' },
        ),
      });

      if (nums[mid] === target) {
        firstResult = mid;
        steps.push({
          line: 11,
          explanation: `findFirst: nums[${mid}] == ${target}. Record result=${mid}, then search LEFT (right = ${mid - 1}) to find an earlier occurrence.`,
          variables: { left, right: mid - 1, mid, firstResult },
          visualization: makeViz(
            { [left]: 'pointer', [mid - 1]: 'pointer', [mid]: 'found' },
            { [left]: 'L', ...(mid - 1 >= 0 ? { [mid - 1]: 'R' } : {}), [mid]: 'found' },
          ),
        });
        right = mid - 1;
      } else if (nums[mid] < target) {
        steps.push({
          line: 13,
          explanation: `findFirst: nums[${mid}] = ${nums[mid]} < ${target}. Move left to ${mid + 1}.`,
          variables: { left: mid + 1, right, mid, firstResult },
          visualization: makeViz(
            { [mid + 1]: 'pointer', [right]: 'pointer', [mid]: 'visited' },
            { [mid + 1]: 'L', [right]: 'R' },
          ),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 15,
          explanation: `findFirst: nums[${mid}] = ${nums[mid]} > ${target}. Move right to ${mid - 1}.`,
          variables: { left, right: mid - 1, mid, firstResult },
          visualization: makeViz(
            { [left]: 'pointer', ...(mid - 1 >= 0 ? { [mid - 1]: 'pointer' } : {}), [mid]: 'visited' },
            { [left]: 'L', ...(mid - 1 >= 0 ? { [mid - 1]: 'R' } : {}) },
          ),
        });
        right = mid - 1;
      }
    }

    steps.push({
      line: 16,
      explanation: `findFirst complete. First occurrence of ${target} is at index ${firstResult}.`,
      variables: { firstResult },
      visualization: makeViz(
        firstResult >= 0 ? { [firstResult]: 'found' } : {},
        firstResult >= 0 ? { [firstResult]: 'first' } : {},
      ),
    });

    // --- Phase 2: Find Last Occurrence ---
    steps.push({
      line: 18,
      explanation: `Now find the rightmost (last) occurrence of ${target}.`,
      variables: { phase: 'findLast' },
      visualization: makeViz(
        firstResult >= 0 ? { [firstResult]: 'found' } : {},
        firstResult >= 0 ? { [firstResult]: 'first' } : {},
      ),
    });

    left = 0;
    right = n - 1;
    let lastResult = -1;

    steps.push({
      line: 19,
      explanation: `findLast: Initialize left=0, right=${right}, result=-1.`,
      variables: { left, right, lastResult },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' },
      ),
    });

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);

      steps.push({
        line: 21,
        explanation: `findLast: mid = ${mid}. nums[${mid}] = ${nums[mid]}.`,
        variables: { left, right, mid, 'nums[mid]': nums[mid], lastResult },
        visualization: makeViz(
          { [left]: 'pointer', [right]: 'pointer', [mid]: 'active' },
          { [left]: 'L', [right]: 'R', [mid]: 'mid' },
        ),
      });

      if (nums[mid] === target) {
        lastResult = mid;
        steps.push({
          line: 23,
          explanation: `findLast: nums[${mid}] == ${target}. Record result=${mid}, then search RIGHT (left = ${mid + 1}) to find a later occurrence.`,
          variables: { left: mid + 1, right, mid, lastResult },
          visualization: makeViz(
            { [mid + 1 < n ? mid + 1 : mid]: 'pointer', [right]: 'pointer', [mid]: 'found' },
            { ...(mid + 1 < n ? { [mid + 1]: 'L' } : {}), [right]: 'R', [mid]: 'found' },
          ),
        });
        left = mid + 1;
      } else if (nums[mid] < target) {
        steps.push({
          line: 25,
          explanation: `findLast: nums[${mid}] = ${nums[mid]} < ${target}. Move left to ${mid + 1}.`,
          variables: { left: mid + 1, right, mid, lastResult },
          visualization: makeViz(
            { [mid + 1 < n ? mid + 1 : mid]: 'pointer', [right]: 'pointer', [mid]: 'visited' },
            { ...(mid + 1 < n ? { [mid + 1]: 'L' } : {}), [right]: 'R' },
          ),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 27,
          explanation: `findLast: nums[${mid}] = ${nums[mid]} > ${target}. Move right to ${mid - 1}.`,
          variables: { left, right: mid - 1, mid, lastResult },
          visualization: makeViz(
            { [left]: 'pointer', ...(mid - 1 >= 0 ? { [mid - 1]: 'pointer' } : {}), [mid]: 'visited' },
            { [left]: 'L', ...(mid - 1 >= 0 ? { [mid - 1]: 'R' } : {}) },
          ),
        });
        right = mid - 1;
      }
    }

    // Final result
    const resultHighlights: Record<number, string> = {};
    const resultLabels: Record<number, string> = {};
    if (firstResult >= 0) {
      for (let i = firstResult; i <= lastResult; i++) {
        resultHighlights[i] = 'found';
      }
      resultLabels[firstResult] = 'first';
      resultLabels[lastResult] = lastResult === firstResult ? 'first/last' : 'last';
    }

    steps.push({
      line: 3,
      explanation: firstResult >= 0
        ? `Result: [${firstResult}, ${lastResult}]. Target ${target} first appears at index ${firstResult} and last appears at index ${lastResult}.`
        : `Result: [-1, -1]. Target ${target} was not found in the array.`,
      variables: { first: firstResult, last: lastResult, result: [firstResult, lastResult] },
      visualization: makeViz(resultHighlights, resultLabels,
        [{ key: 'First', value: String(firstResult) }, { key: 'Last', value: String(lastResult) }]),
    });

    return steps;
  },
};

export default firstAndLastOccurrences;
