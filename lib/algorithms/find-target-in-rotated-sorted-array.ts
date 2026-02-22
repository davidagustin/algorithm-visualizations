import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findTargetInRotatedSortedArray: AlgorithmDefinition = {
  id: 'find-target-in-rotated-sorted-array',
  title: 'Find Target in Rotated Sorted Array',
  leetcodeNumber: 33,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Search for a target in a sorted array that has been rotated at an unknown pivot. At each step, determine which half is sorted, then check if the target lies in that sorted half. Achieves O(log n) time.',
  tags: ['Binary Search', 'Array', 'Rotated'],
  code: {
    pseudocode: `function search(nums, target):
  left = 0, right = n - 1
  while left <= right:
    mid = left + (right - left) / 2
    if nums[mid] == target:
      return mid
    if nums[left] <= nums[mid]:
      if nums[left] <= target < nums[mid]:
        right = mid - 1
      else:
        left = mid + 1
    else:
      if nums[mid] < target <= nums[right]:
        left = mid + 1
      else:
        right = mid - 1
  return -1`,
    python: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
    javascript: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`,
    java: `public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}`,
  },
  defaultInput: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 },
  inputFields: [
    {
      name: 'nums',
      label: 'Rotated Sorted Array',
      type: 'array',
      defaultValue: [4, 5, 6, 7, 0, 1, 2],
      placeholder: '4,5,6,7,0,1,2',
      helperText: 'Comma-separated rotated sorted distinct integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Value to search for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const eliminated = new Set<number>();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => {
      const merged: Record<number, string> = {};
      eliminated.forEach((idx) => { merged[idx] = 'visited'; });
      for (const [k, v] of Object.entries(highlights)) {
        merged[Number(k)] = v;
      }
      return { type: 'array', array: [...nums], highlights: merged, labels };
    };

    let left = 0;
    let right = n - 1;

    steps.push({
      line: 2,
      explanation: `Search for target ${target} in rotated sorted array [${nums.join(', ')}]. Initialize left=0, right=${right}.`,
      variables: { left, right, target },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' },
      ),
    });

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);

      steps.push({
        line: 4,
        explanation: `mid = ${mid}, nums[mid] = ${nums[mid]}.`,
        variables: { left, right, mid, 'nums[mid]': nums[mid] },
        visualization: makeViz(
          { [left]: 'pointer', [right]: 'pointer', [mid]: 'active' },
          { [left]: 'L', [right]: 'R', [mid]: 'mid' },
        ),
      });

      if (nums[mid] === target) {
        steps.push({
          line: 6,
          explanation: `nums[${mid}] = ${nums[mid]} == target ${target}. Found at index ${mid}!`,
          variables: { mid, result: mid },
          visualization: makeViz({ [mid]: 'found' }, { [mid]: 'found' }),
        });
        return steps;
      }

      if (nums[left] <= nums[mid]) {
        // Left half is sorted
        steps.push({
          line: 7,
          explanation: `nums[left]=${nums[left]} <= nums[mid]=${nums[mid]}: left half [${left}..${mid}] is sorted.`,
          variables: { 'nums[left]': nums[left], 'nums[mid]': nums[mid], sortedHalf: 'left' },
          visualization: (() => {
            const hl: Record<number, string> = {};
            for (let i = left; i <= mid; i++) hl[i] = 'sorted';
            hl[left] = 'pointer'; hl[right] = 'pointer'; hl[mid] = 'active';
            const lb: Record<number, string> = { [left]: 'L', [right]: 'R', [mid]: 'mid' };
            const mg: Record<number, string> = {};
            eliminated.forEach((idx) => { mg[idx] = 'visited'; });
            Object.entries(hl).forEach(([k, v]) => { mg[Number(k)] = v; });
            return { type: 'array' as const, array: [...nums], highlights: mg, labels: lb };
          })(),
        });

        if (nums[left] <= target && target < nums[mid]) {
          steps.push({
            line: 8,
            explanation: `Target ${target} is in sorted left half [${nums[left]}..${nums[mid]}). Search left: right = ${mid - 1}.`,
            variables: { left, right: mid - 1 },
            visualization: makeViz(
              { [left]: 'pointer', [mid - 1]: 'pointer', [mid]: 'visited' },
              { [left]: 'L', ...(mid - 1 >= 0 ? { [mid - 1]: 'R' } : {}) },
            ),
          });
          for (let i = mid; i <= right; i++) eliminated.add(i);
          right = mid - 1;
        } else {
          steps.push({
            line: 10,
            explanation: `Target ${target} is NOT in sorted left half. Search right: left = ${mid + 1}.`,
            variables: { left: mid + 1, right },
            visualization: makeViz(
              { [mid + 1 < n ? mid + 1 : mid]: 'pointer', [right]: 'pointer', [mid]: 'visited' },
              { ...(mid + 1 < n ? { [mid + 1]: 'L' } : {}), [right]: 'R' },
            ),
          });
          for (let i = left; i <= mid; i++) eliminated.add(i);
          left = mid + 1;
        }
      } else {
        // Right half is sorted
        steps.push({
          line: 12,
          explanation: `nums[left]=${nums[left]} > nums[mid]=${nums[mid]}: right half [${mid}..${right}] is sorted.`,
          variables: { 'nums[left]': nums[left], 'nums[mid]': nums[mid], sortedHalf: 'right' },
          visualization: (() => {
            const hl: Record<number, string> = {};
            for (let i = mid; i <= right; i++) hl[i] = 'sorted';
            hl[left] = 'pointer'; hl[right] = 'pointer'; hl[mid] = 'active';
            const lb: Record<number, string> = { [left]: 'L', [right]: 'R', [mid]: 'mid' };
            const mg: Record<number, string> = {};
            eliminated.forEach((idx) => { mg[idx] = 'visited'; });
            Object.entries(hl).forEach(([k, v]) => { mg[Number(k)] = v; });
            return { type: 'array' as const, array: [...nums], highlights: mg, labels: lb };
          })(),
        });

        if (nums[mid] < target && target <= nums[right]) {
          steps.push({
            line: 13,
            explanation: `Target ${target} is in sorted right half (${nums[mid]}..${nums[right]}]. Search right: left = ${mid + 1}.`,
            variables: { left: mid + 1, right },
            visualization: makeViz(
              { [mid + 1 < n ? mid + 1 : mid]: 'pointer', [right]: 'pointer', [mid]: 'visited' },
              { ...(mid + 1 < n ? { [mid + 1]: 'L' } : {}), [right]: 'R' },
            ),
          });
          for (let i = left; i <= mid; i++) eliminated.add(i);
          left = mid + 1;
        } else {
          steps.push({
            line: 15,
            explanation: `Target ${target} is NOT in sorted right half. Search left: right = ${mid - 1}.`,
            variables: { left, right: mid - 1 },
            visualization: makeViz(
              { [left]: 'pointer', ...(mid - 1 >= 0 ? { [mid - 1]: 'pointer' } : {}), [mid]: 'visited' },
              { [left]: 'L', ...(mid - 1 >= 0 ? { [mid - 1]: 'R' } : {}) },
            ),
          });
          for (let i = mid; i <= right; i++) eliminated.add(i);
          right = mid - 1;
        }
      }
    }

    steps.push({
      line: 16,
      explanation: `left > right. Target ${target} not found in the array. Return -1.`,
      variables: { result: -1 },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default findTargetInRotatedSortedArray;
