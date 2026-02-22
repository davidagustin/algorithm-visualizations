import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const searchInRotatedSortedArrayIi: AlgorithmDefinition = {
  id: 'search-in-rotated-sorted-array-ii',
  title: 'Search in Rotated Sorted Array II',
  leetcodeNumber: 81,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Search for a target in a rotated sorted array that may contain duplicates. When duplicates are present at both ends we cannot determine which half is sorted, so we shrink both pointers by one and continue binary search.',
  tags: ['binary search', 'array', 'rotated', 'duplicates'],

  code: {
    pseudocode: `function search(nums, target):
  left = 0, right = len(nums) - 1
  while left <= right:
    mid = (left + right) / 2
    if nums[mid] == target: return true
    if nums[left] == nums[mid] == nums[right]:
      left++, right--
    else if nums[left] <= nums[mid]:
      if nums[left] <= target < nums[mid]:
        right = mid - 1
      else:
        left = mid + 1
    else:
      if nums[mid] < target <= nums[right]:
        left = mid + 1
      else:
        right = mid - 1
  return false`,
    python: `def search(nums: list[int], target: int) -> bool:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return True
        if nums[left] == nums[mid] == nums[right]:
            left += 1
            right -= 1
        elif nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return False`,
    javascript: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return true;
    if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
      left++; right--;
    } else if (nums[left] <= nums[mid]) {
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
  return false;
}`,
    java: `public boolean search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (nums[mid] == target) return true;
        if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
            left++; right--;
        } else if (nums[left] <= nums[mid]) {
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
    return false;
}`,
  },

  defaultInput: {
    nums: [2, 5, 6, 0, 0, 1, 2],
    target: 0,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Rotated Array (may have duplicates)',
      type: 'array',
      defaultValue: [2, 5, 6, 0, 0, 1, 2],
      placeholder: '2,5,6,0,0,1,2',
      helperText: 'Comma-separated integers (rotated, may have duplicates)',
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

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    let left = 0;
    let right = nums.length - 1;

    steps.push({
      line: 1,
      explanation: `Initialize binary search: left=${left}, right=${right}, target=${target}.`,
      variables: { left, right, target },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        line: 3,
        explanation: `mid = floor((${left}+${right})/2) = ${mid}. nums[mid]=${nums[mid]}.`,
        variables: { left, mid, right, 'nums[mid]': nums[mid], target },
        visualization: makeViz(
          { [left]: 'active', [mid]: 'comparing', [right]: 'active' },
          { [left]: 'L', [mid]: 'mid', [right]: 'R' }
        ),
      });

      if (nums[mid] === target) {
        steps.push({
          line: 4,
          explanation: `nums[mid]=${nums[mid]} equals target. Found target at index ${mid}.`,
          variables: { left, mid, right, result: true },
          visualization: makeViz(
            { [mid]: 'found' },
            { [mid]: 'FOUND' }
          ),
        });
        return steps;
      }

      if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
        steps.push({
          line: 6,
          explanation: `nums[left]=nums[mid]=nums[right]=${nums[left]}. Cannot determine sorted half. Shrink both ends.`,
          variables: { left, mid, right, action: 'shrink' },
          visualization: makeViz(
            { [left]: 'mismatch', [mid]: 'comparing', [right]: 'mismatch' },
            { [left]: 'L++', [mid]: 'mid', [right]: 'R--' }
          ),
        });
        left++;
        right--;
      } else if (nums[left] <= nums[mid]) {
        steps.push({
          line: 8,
          explanation: `Left half [${left}..${mid}] is sorted. nums[left]=${nums[left]} <= nums[mid]=${nums[mid]}.`,
          variables: { left, mid, right, 'nums[left]': nums[left], 'nums[mid]': nums[mid] },
          visualization: makeViz(
            { [left]: 'sorted', [mid]: 'comparing', [right]: 'active' },
            { [left]: 'L', [mid]: 'mid', [right]: 'R' }
          ),
        });
        if (nums[left] <= target && target < nums[mid]) {
          steps.push({
            line: 9,
            explanation: `Target ${target} is in left sorted half [${nums[left]}, ${nums[mid]}). Set right=mid-1=${mid - 1}.`,
            variables: { left, right: mid - 1, target },
            visualization: makeViz(
              { [left]: 'active', [mid]: 'mismatch', [right]: 'pointer' },
              { [left]: 'L', [mid]: 'mid', [right]: 'R' }
            ),
          });
          right = mid - 1;
        } else {
          steps.push({
            line: 11,
            explanation: `Target ${target} is NOT in left sorted half. Set left=mid+1=${mid + 1}.`,
            variables: { left: mid + 1, right, target },
            visualization: makeViz(
              { [left]: 'mismatch', [mid]: 'pointer', [right]: 'active' },
              { [left]: 'L', [mid]: 'mid', [right]: 'R' }
            ),
          });
          left = mid + 1;
        }
      } else {
        steps.push({
          line: 12,
          explanation: `Right half [${mid}..${right}] is sorted. nums[mid]=${nums[mid]} < nums[right]=${nums[right]}.`,
          variables: { left, mid, right, 'nums[mid]': nums[mid], 'nums[right]': nums[right] },
          visualization: makeViz(
            { [left]: 'active', [mid]: 'comparing', [right]: 'sorted' },
            { [left]: 'L', [mid]: 'mid', [right]: 'R' }
          ),
        });
        if (nums[mid] < target && target <= nums[right]) {
          steps.push({
            line: 13,
            explanation: `Target ${target} is in right sorted half (${nums[mid]}, ${nums[right]}]. Set left=mid+1=${mid + 1}.`,
            variables: { left: mid + 1, right, target },
            visualization: makeViz(
              { [left]: 'mismatch', [mid]: 'pointer', [right]: 'active' },
              { [left]: 'L', [mid]: 'mid', [right]: 'R' }
            ),
          });
          left = mid + 1;
        } else {
          steps.push({
            line: 15,
            explanation: `Target ${target} is NOT in right sorted half. Set right=mid-1=${mid - 1}.`,
            variables: { left, right: mid - 1, target },
            visualization: makeViz(
              { [left]: 'active', [mid]: 'mismatch', [right]: 'pointer' },
              { [left]: 'L', [mid]: 'mid', [right]: 'R' }
            ),
          });
          right = mid - 1;
        }
      }
    }

    steps.push({
      line: 16,
      explanation: `Search exhausted. Target ${target} not found. Return false.`,
      variables: { left, right, result: false },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default searchInRotatedSortedArrayIi;
