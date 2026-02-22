import type { Difficulty } from '../types';

export interface ProblemInfo {
  id: string;
  title: string;
  difficulty: Difficulty;
  leetcodeNumber?: number;
  description: string;
  hasVisualization: boolean;
  tags: string[];
  isInterviewRecommended?: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  borderColor: string;
  problems: ProblemInfo[];
}

export const CATEGORIES: CategoryInfo[] = [
  // ─── 01. Two Pointers ───────────────────────────────────────────────
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    icon: '⇌',
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-blue-600/10',
    borderColor: 'border-blue-500/30',
    problems: [
      {
        id: 'pair-sum-sorted',
        title: 'Pair Sum - Sorted',
        difficulty: 'Easy',
        leetcodeNumber: 167,
        description:
          'Find two numbers in a sorted array that add up to a target value using the two-pointer technique.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'sorted'],
      },
      {
        id: 'triplet-sum',
        title: 'Triplet Sum',
        difficulty: 'Medium',
        leetcodeNumber: 15,
        description:
          'Find all unique triplets in an array that sum to zero by combining sorting with two pointers.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'sorting'],
      },
      {
        id: 'is-palindrome-valid',
        title: 'Is Palindrome Valid',
        difficulty: 'Easy',
        leetcodeNumber: 125,
        description:
          'Determine if a string is a valid palindrome considering only alphanumeric characters and ignoring case.',
        hasVisualization: true,
        tags: ['two-pointers', 'string'],
      },
      {
        id: 'largest-container',
        title: 'Largest Container',
        difficulty: 'Medium',
        leetcodeNumber: 11,
        description:
          'Find two lines that together with the x-axis form a container holding the most water.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'greedy'],
      },
      {
        id: 'shift-zeros-to-the-end',
        title: 'Shift Zeros to the End',
        difficulty: 'Easy',
        leetcodeNumber: 283,
        description:
          'Move all zeros in an array to the end while maintaining the relative order of non-zero elements.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'in-place'],
      },
      {
        id: 'next-lexicographical-sequence',
        title: 'Next Lexicographical Sequence',
        difficulty: 'Medium',
        leetcodeNumber: 31,
        description:
          'Rearrange numbers into the next lexicographically greater permutation of the array.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'permutation'],
      },
      {
        id: 'backspace-string-compare',
        title: 'Backspace String Compare',
        difficulty: 'Easy',
        leetcodeNumber: 844,
        description:
          'Given two strings s and t, return true if they are equal when both are typed into empty text editors where # means a backspace. Process each string using a stack-simulation approach or traverse backwards with two pointers.',
        hasVisualization: true,
        tags: ['two-pointers', 'string', 'stack', 'simulation'],
      },
      {
        id: 'boats-to-save-people',
        title: 'Boats to Save People',
        difficulty: 'Medium',
        leetcodeNumber: 881,
        description:
          'Given people weights and a boat weight limit (each boat carries at most 2 people), find the minimum number of boats needed. Sort people by weight, then use two pointers: pair lightest with heaviest when possible.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'reedy', 'sorting'],
      },
      {
        id: 'four-sum',
        title: '4Sum',
        difficulty: 'Medium',
        leetcodeNumber: 18,
        description:
          'Given an array of integers and a target, return all unique quadruplets [a, b, c, d] such that a + b + c + d = target. Sort the array first, fix two outer elements, then use two pointers for the inner pair.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'sorting', 'hash-table'],
      },
      {
        id: 'game-of-life',
        title: 'Game of Life',
        difficulty: 'Medium',
        leetcodeNumber: 289,
        description:
          'Simulate one step of Conway\'s Game of Life on an m×n board. Rules: (1) Live cell with 2-3 live neighbors → stays alive; (2) Live cell with <2 or >3 neighbors → dies; (3) Dead cell with exactly 3 live neighbors → becomes alive. In-place solution uses encoding: 2=dead→alive, -1=alive→dead to track previous state.',
        hasVisualization: true,
        tags: ['array', 'matrix', 'simulation'],
      },
      {
        id: 'longest-common-prefix',
        title: 'Longest Common Prefix',
        difficulty: 'Easy',
        leetcodeNumber: 14,
        description:
          'Find the longest common prefix string among an array of strings. Vertical scanning: for each character position of the first string, check whether all other strings have the same character at that position. Stop when a mismatch or shorter string is found. O(S) time where S is total characters.',
        hasVisualization: true,
        tags: ['string', 'array'],
      },
      {
        id: 'majority-element',
        title: 'Majority Element',
        difficulty: 'Easy',
        leetcodeNumber: 169,
        description:
          'Find the element that appears more than n/2 times in an array. Boyer-Moore Voting Algorithm: maintain a candidate and a count. When count hits 0, switch the candidate to the current element. A majority element always survives because it outvotes every other element combined. O(n) time, O(1) space.',
        hasVisualization: true,
        tags: ['array', 'boyer-moore', 'voting'],
      },
      {
        id: 'remove-duplicates-sorted-array',
        title: 'Remove Duplicates from Sorted Array',
        difficulty: 'Easy',
        leetcodeNumber: 26,
        description:
          'Given a sorted array, remove duplicates in-place so each element appears only once. Return the new length k. The first k elements of the array should contain the unique elements in sorted order.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'in-place', 'sorted'],
      },
      {
        id: 'remove-element-in-place',
        title: 'Remove Element',
        difficulty: 'Easy',
        leetcodeNumber: 27,
        description:
          'Given an integer array nums and an integer val, remove all occurrences of val in-place. Return the number of elements not equal to val. The relative order of elements may be changed.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'in-place'],
      },
      {
        id: 'reverse-string',
        title: 'Reverse String',
        difficulty: 'Easy',
        leetcodeNumber: 344,
        description:
          'Write a function that reverses a string in-place. The input is given as an array of characters. You must do it in-place with O(1) extra memory using two pointers from both ends.',
        hasVisualization: true,
        tags: ['two-pointers', 'string', 'in-place', 'swap'],
      },
      {
        id: 'rotate-array',
        title: 'Rotate Array',
        difficulty: 'Medium',
        leetcodeNumber: 189,
        description:
          'Given an integer array, rotate it to the right by k steps in-place with O(1) extra space. Strategy: reverse the entire array, then reverse the first k elements, then reverse the remaining elements.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'in-place', 'reverse'],
      },
      {
        id: 'squares-of-sorted-array',
        title: 'Squares of a Sorted Array',
        difficulty: 'Easy',
        leetcodeNumber: 977,
        description:
          'Given an integer array sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order. Use two pointers from both ends — the largest squares are at the extremes.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'sorting', 'squares'],
      },
      {
        id: 'three-sum-closest',
        title: '3Sum Closest',
        difficulty: 'Medium',
        leetcodeNumber: 16,
        description:
          'Given an integer array and a target, find three integers such that their sum is closest to target. Return the sum. Sort the array, then for each element use two pointers to find the closest pair sum.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'sorting'],
      },
      {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        leetcodeNumber: 42,
        description:
          'Given n non-negative integers representing elevation heights, compute how much water it can trap after raining. Uses two pointers from both ends, tracking left and right maximums to calculate trapped water at each position.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'dynamic-programming', 'stack'],
      },
      {
        id: 'valid-palindrome-ii',
        title: 'Valid Palindrome II',
        difficulty: 'Easy',
        leetcodeNumber: 680,
        description:
          'Given a string, determine if it can be a palindrome after deleting at most one character. Use two pointers from both ends. When a mismatch is found, try skipping either the left or right character and check if the remaining substring is a palindrome.',
        hasVisualization: true,
        tags: ['two-pointers', 'string', 'greedy'],
      },
      {
        id: 'zigzag-conversion',
        title: 'Zigzag Conversion',
        difficulty: 'Medium',
        leetcodeNumber: 6,
        description:
          'Write the string in a zigzag pattern on a given number of rows, then read off row by row. Simulate the pattern by tracking the current row and direction (going down or going up). Characters are placed into row buckets and concatenated at the end.',
        hasVisualization: true,
        tags: ['string', 'simulation'],
      },
    
      {
        id: 'data-stream-as-disjoint-intervals',
        title: 'Data Stream as Disjoint Intervals',
        leetcodeNumber: 352,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a stream of integers, maintain a sorted list of disjoint intervals. When a new integer arrives, insert it as [val, val] and merge with any adjacent or overlapping intervals. Uses a sorted structure to efficiently find and merge neighboring intervals.',
        hasVisualization: true,
        tags: ['interval', 'sorted set', 'merge', 'stream'],
      },
      {
        id: 'employee-free-time',
        title: 'Employee Free Time',
        leetcodeNumber: 759,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a schedule of working intervals for each employee, find the common free time for all employees. Collect all intervals, sort by start time, merge overlapping ones, then identify the gaps between merged intervals. Those gaps represent time when all employees are free.',
        hasVisualization: true,
        tags: ['interval', 'sorting', 'merge intervals', 'heap'],
      },
      {
        id: 'interval-list-intersections',
        title: 'Interval List Intersections',
        leetcodeNumber: 986,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two lists of closed intervals, each list of intervals is pairwise disjoint and in sorted order. Return the intersection of these two interval lists. Two pointers advance through both lists, computing overlap when intervals intersect.',
        hasVisualization: true,
        tags: ['two pointers', 'interval', 'merge'],
      },
      {
        id: 'long-pressed-name',
        title: 'Long Pressed Name',
        leetcodeNumber: 925,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a name and typed string, determine if typed could have been produced by long-pressing some characters in name. Each character in name appears in typed in order, but may appear more times due to long pressing.',
        hasVisualization: true,
        tags: ['two pointers', 'string'],
      },
      {
        id: 'minimum-interval-to-include-each-query',
        title: 'Minimum Interval to Include Each Query',
        leetcodeNumber: 1851,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given intervals and queries, for each query find the smallest interval that contains the query point. Sort both intervals and queries, then use a min-heap keyed by interval size. Sweep through sorted queries, adding all intervals whose start is within range, then extract the minimum-size interval still containing the query.',
        hasVisualization: true,
        tags: ['interval', 'sorting', 'heap', 'sweep line'],
      },
      {
        id: 'my-calendar-i',
        title: 'My Calendar I',
        leetcodeNumber: 729,
        difficulty: 'Medium' as Difficulty,
        description:
          'Implement a calendar that allows booking events without double-booking. A booking [start,end) can be added if no existing booking overlaps. Two events overlap when one starts before the other ends. Uses a sorted list approach to check each new booking against all existing bookings.',
        hasVisualization: true,
        tags: ['interval', 'sorted list', 'binary search'],
      },
      {
        id: 'my-calendar-ii',
        title: 'My Calendar II',
        leetcodeNumber: 731,
        difficulty: 'Medium' as Difficulty,
        description:
          'Implement a calendar that allows booking events, with at most double booking. A booking can be added if it does not cause a triple booking. Maintains two lists: all bookings and already-overlapped (double-booked) regions. A new booking is rejected only if it overlaps a double-booked region.',
        hasVisualization: true,
        tags: ['interval', 'sorted list', 'greedy'],
      },
      {
        id: 'remove-covered-intervals',
        title: 'Remove Covered Intervals',
        leetcodeNumber: 1288,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a list of intervals, remove all intervals that are covered by another interval in the list. An interval [a,b] is covered by [c,d] if c<=a and b<=d. Sort by start ascending then end descending, then greedily track the maximum right boundary seen.',
        hasVisualization: true,
        tags: ['interval', 'greedy', 'sorting'],
      },
      {
        id: 'reverse-words-in-string',
        title: 'Reverse Words in a String',
        leetcodeNumber: 151,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an input string, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in the result must be separated by a single space, and no leading or trailing spaces are allowed.',
        hasVisualization: true,
        tags: ['string', 'two pointers', 'split', 'reverse'],
      },
      {
        id: 'string-compression',
        title: 'String Compression',
        leetcodeNumber: 443,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of characters, compress it in-place using run-length encoding. For each group of consecutive repeating characters, write the character and its count (if count > 1). Modify the array in-place and return the new length.',
        hasVisualization: true,
        tags: ['two pointers', 'string', 'in-place', 'run-length encoding'],
      },
    
      {
        id: 'append-characters-to-string',
        title: 'Append Characters to String to Make Subsequence',
        leetcodeNumber: 2486,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given strings s and t, find the minimum number of characters to append to s so that t becomes a subsequence of s. Use a pointer j on t: scan s and advance j whenever s[i] == t[j]. The answer is t.length - j (remaining unmatched characters in t).',
        hasVisualization: true,
        tags: ['two pointers', 'string', 'greedy'],
      },
      {
        id: 'array-with-elements-not-equal-to-average',
        title: 'Array With Elements Not Equal to Average of Neighbors',
        leetcodeNumber: 1968,
        difficulty: 'Medium' as Difficulty,
        description:
          'Rearrange a distinct array such that no element equals the average of its neighbors. Sort the array, then interleave the smaller half and larger half: place elements at even indices from the smaller half and odd indices from the larger half.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorting', 'greedy'],
      },
      {
        id: 'available-captures-for-rook',
        title: 'Available Captures for Rook',
        leetcodeNumber: 999,
        difficulty: 'Easy' as Difficulty,
        description:
          'On an 8x8 chessboard with one white rook (R), some white bishops (B), and some black pawns (p), find how many pawns the rook can capture in one move. The rook moves in straight lines (up/down/left/right) and is blocked by bishops. Count pawns reachable before any bishop in each of the 4 directions.',
        hasVisualization: true,
        tags: ['array', 'matrix', 'simulation', 'chess'],
      },
      {
        id: 'boats-to-save-people-iii',
        title: 'Boats to Save People (Weight Limit Variant)',
        leetcodeNumber: 881,
        difficulty: 'Medium' as Difficulty,
        description:
          'Each boat carries at most 2 people with a combined weight limit. Find the minimum number of boats needed to carry all people. Sort weights, then use two pointers: pair the lightest and heaviest if their combined weight fits the limit, otherwise send the heaviest alone.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorting', 'greedy'],
      },
      {
        id: 'camelcase-matching',
        title: 'CamelCase Matching',
        leetcodeNumber: 1023,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a list of queries and a pattern, return a boolean array. A query matches the pattern if you can insert lowercase letters into the pattern to get the query. Equivalently, the uppercase letters in the query must match the pattern exactly in order.',
        hasVisualization: true,
        tags: ['string', 'two pointers', 'pattern matching'],
      },
      {
        id: 'cells-with-odd-values',
        title: 'Cells with Odd Values in a Matrix',
        leetcodeNumber: 1252,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an m x n matrix initialized to zeros and a list of indices [ri, ci], each operation increments all elements in row ri and all elements in column ci by 1. After all operations, count the number of cells with odd values. Use row and column increment counters and apply parity math to avoid building the full matrix.',
        hasVisualization: true,
        tags: ['array', 'matrix', 'simulation'],
      },
      {
        id: 'check-if-string-is-prefix-of-array',
        title: 'Check If String Is a Prefix of Array',
        leetcodeNumber: 1961,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string s and an array of strings words, determine if s is a prefix string of words. A string s is a prefix string if it equals the concatenation of the first k elements of words for some k. Concatenate words one by one and check if s matches exactly.',
        hasVisualization: true,
        tags: ['string', 'array'],
      },
      {
        id: 'check-if-two-string-arrays-are-equivalent',
        title: 'Check If Two String Arrays are Equivalent',
        leetcodeNumber: 1662,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given two string arrays word1 and word2, return true if they represent the same string when concatenated. Simply concatenate all strings in each array and compare.',
        hasVisualization: true,
        tags: ['string', 'array'],
      },
      {
        id: 'container-with-most-water-ii',
        title: 'Container With Most Water (Greedy Proof)',
        leetcodeNumber: 11,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find two lines that together with the x-axis form a container holding the most water. Use two pointers: always move the pointer at the shorter line inward. Proof: moving the taller line can only decrease or maintain width while the height is bounded by the shorter line anyway.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'greedy'],
      },
      {
        id: 'count-items-matching-rule',
        title: 'Count Items Matching a Rule',
        leetcodeNumber: 1773,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a list of items where each item is [type, color, name] and a rule [ruleKey, ruleValue], count how many items match the rule. Map the ruleKey to its index (type=0, color=1, name=2), then count items where item[index] equals ruleValue.',
        hasVisualization: true,
        tags: ['array', 'string', 'enumeration'],
      },
      {
        id: 'count-pairs-whose-sum-is-less-than-target',
        title: 'Count Pairs Whose Sum is Less Than Target',
        leetcodeNumber: 2824,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer array and a target, count the number of pairs (i, j) where i < j and nums[i] + nums[j] < target. Sort the array first, then use two pointers: if sum < target, all elements from left+1 to right pair with left, so add (right-left) to count.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorting'],
      },
      {
        id: 'decompress-run-length-encoded-list',
        title: 'Decompress Run-Length Encoded List',
        leetcodeNumber: 1313,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a run-length encoded list where pairs [freq, val] represent ',
        hasVisualization: true,
        tags: ['array', 'run-length encoding', 'simulation'],
      },
      {
        id: 'degree-of-an-array',
        title: 'Degree of an Array',
        leetcodeNumber: 697,
        difficulty: 'Easy' as Difficulty,
        description:
          'The degree of an array is defined as the maximum frequency of any element. Find the length of the shortest contiguous subarray that has the same degree as the entire array. Track first and last occurrence of each element to compute the minimal subarray length.',
        hasVisualization: true,
        tags: ['array', 'hash map', 'frequency'],
      },
      {
        id: 'di-string-match',
        title: 'DI String Match',
        leetcodeNumber: 942,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string s of length n containing only ',
        hasVisualization: true,
        tags: ['string', 'greedy', 'two pointers'],
      },
      {
        id: 'diagonal-traverse',
        title: 'Diagonal Traverse',
        leetcodeNumber: 498,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an m x n matrix, return all elements in diagonal zigzag order. Diagonals alternate direction: first going up-right, then down-left, and so on. The result is a flattened array of all matrix elements in this traversal order.',
        hasVisualization: true,
        tags: ['matrix', 'simulation', 'diagonal'],
      },
      {
        id: 'expressive-words',
        title: 'Expressive Words',
        leetcodeNumber: 809,
        difficulty: 'Medium' as Difficulty,
        description:
          'A string is stretchy if it can be made from another string by extending groups of characters. Specifically, a group of size k >= 3 in the original can be extended, or groups that are already size >= 3 in the query must match. Count how many words can be ',
        hasVisualization: true,
        tags: ['string', 'two pointers', 'run-length encoding'],
      },
      {
        id: 'find-and-replace-pattern',
        title: 'Find and Replace Pattern',
        leetcodeNumber: 890,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a list of words and a pattern, return all words that match the pattern. A word matches if there exists a bijection (one-to-one, onto mapping) between letters of the pattern and letters of the word. Check both directions: pattern->word and word->pattern mappings must be consistent.',
        hasVisualization: true,
        tags: ['string', 'hash map', 'bijection'],
      },
      {
        id: 'find-numbers-with-even-number-of-digits',
        title: 'Find Numbers with Even Number of Digits',
        leetcodeNumber: 1295,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array of integers, return how many of them have an even number of digits. Convert each number to a string to check its length, or use math to count digits. Numbers with 10-99, 1000-9999, 100000-999999 etc. have an even number of digits.',
        hasVisualization: true,
        tags: ['array', 'math', 'digit counting'],
      },
      {
        id: 'find-pivot-index-ii',
        title: 'Find Pivot Index',
        leetcodeNumber: 724,
        difficulty: 'Easy' as Difficulty,
        description:
          'Find the leftmost pivot index in an array where the sum of all elements to the left equals the sum of all elements to the right. Compute total sum first, then traverse left to right maintaining a running left sum. At each index, right sum = total - leftSum - nums[i]. If leftSum equals rightSum, return the index.',
        hasVisualization: true,
        tags: ['array', 'prefix sum'],
      },
      {
        id: 'flip-string-to-monotone-increasing',
        title: 'Flip String to Monotone Increasing',
        leetcodeNumber: 926,
        difficulty: 'Medium' as Difficulty,
        description:
          'A binary string is monotone increasing if it consists of some 0s followed by some 1s. Given a binary string s, flip the minimum number of characters to make it monotone increasing. DP approach: at each position, track cost of ending with 0 or ending with 1.',
        hasVisualization: true,
        tags: ['string', 'dynamic programming'],
      },
      {
        id: 'flipping-an-image',
        title: 'Flipping an Image',
        leetcodeNumber: 832,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an n x n binary matrix, flip it horizontally (reverse each row), then invert it (0 becomes 1 and 1 becomes 0). Process each row: use two pointers swapping elements while XOR-ing with 1 to simultaneously reverse and invert. If both elements are the same, XOR flips both; if different, they stay the same after swap-and-flip.',
        hasVisualization: true,
        tags: ['array', 'two pointers', 'bit manipulation'],
      },
      {
        id: 'goat-latin',
        title: 'Goat Latin',
        leetcodeNumber: 824,
        difficulty: 'Easy' as Difficulty,
        description:
          'Transform a sentence into Goat Latin. Rules: (1) If a word begins with a vowel, append ',
        hasVisualization: true,
        tags: ['string', 'simulation'],
      },
      {
        id: 'groups-of-special-equivalent-strings',
        title: 'Groups of Special-Equivalent Strings',
        leetcodeNumber: 893,
        difficulty: 'Medium' as Difficulty,
        description:
          'Two strings are special-equivalent if you can swap any even-indexed characters among themselves and any odd-indexed characters among themselves to make them equal. Return the number of groups of special-equivalent strings. The key insight: create a canonical form by sorting even-indexed chars and odd-indexed chars separately.',
        hasVisualization: true,
        tags: ['string', 'hash set', 'sorting'],
      },
      {
        id: 'largest-number-at-least-twice',
        title: 'Largest Number At Least Twice of Others',
        leetcodeNumber: 747,
        difficulty: 'Easy' as Difficulty,
        description:
          'Determine if the largest element in the array is at least twice as large as every other element. If so, return the index of the largest element; otherwise return -1. Find the largest and second largest, then check if largest >= 2 * secondLargest.',
        hasVisualization: true,
        tags: ['array', 'sorting', 'linear scan'],
      },
      {
        id: 'longest-mountain-in-array',
        title: 'Longest Mountain in Array',
        leetcodeNumber: 845,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the length of the longest mountain subarray. A mountain has at least 3 elements: it strictly increases to a peak then strictly decreases. Use two pointers: from each potential peak, expand left and right to measure the mountain.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'enumeration'],
      },
      {
        id: 'magic-squares-in-grid',
        title: 'Magic Squares In Grid',
        leetcodeNumber: 840,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count 3x3 magic squares inside an m x n grid. A 3x3 magic square contains distinct numbers 1-9 and all rows, columns, and both diagonals sum to 15. Slide a 3x3 window over the grid and validate each subgrid by checking the magic square properties.',
        hasVisualization: true,
        tags: ['array', 'matrix', 'enumeration'],
      },
      {
        id: 'max-increase-to-keep-city-skyline',
        title: 'Max Increase to Keep City Skyline',
        leetcodeNumber: 807,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a 2D grid of building heights, you can increase any building height without changing the skyline (max height) from any cardinal direction. The skyline from North/South is the max of each column. The skyline from East/West is the max of each row. Each building can grow to min(rowMax, colMax). Return the total increase.',
        hasVisualization: true,
        tags: ['array', 'matrix', 'greedy'],
      },
      {
        id: 'maximum-number-of-balloons',
        title: 'Maximum Number of Balloons',
        leetcodeNumber: 1189,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string text, find the maximum number of times you can form the word ',
        hasVisualization: true,
        tags: ['string', 'hash map', 'frequency count'],
      },
      {
        id: 'merge-sorted-array',
        title: 'Merge Sorted Array',
        leetcodeNumber: 88,
        difficulty: 'Easy' as Difficulty,
        description:
          'Merge two sorted arrays nums1 and nums2 in-place into nums1. nums1 has length m+n with m valid elements. Use two pointers starting from the end of each array to avoid overwriting elements, placing the larger element at the back of nums1.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorting', 'merge'],
      },
      {
        id: 'minimize-maximum-pair-sum',
        title: 'Minimize Maximum Pair Sum in Array',
        leetcodeNumber: 1877,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an even-length array, pair up all elements to minimize the maximum pair sum. Sort the array, then pair the smallest with the largest using two pointers. This greedy approach ensures the maximum pair sum is minimized.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorting', 'greedy'],
      },
      {
        id: 'minimum-moves-to-equal-array-elements-ii',
        title: 'Minimum Moves to Equal Array Elements II',
        leetcodeNumber: 462,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array, in one move you increment or decrement one element by 1. Find the minimum number of moves to make all elements equal. The optimal target is the median of the array. Sort the array, find the median, then sum the absolute differences of each element from the median.',
        hasVisualization: true,
        tags: ['array', 'math', 'sorting', 'median'],
      },
      {
        id: 'minimum-moves-to-equal-array-elements',
        title: 'Minimum Moves to Equal Array Elements',
        leetcodeNumber: 453,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array, in one move you increment n-1 elements by 1 (equivalently, decrement one element by 1). Find the minimum number of moves to make all elements equal. The answer is the sum of all elements minus n times the minimum element, because each move is equivalent to decreasing one element by 1.',
        hasVisualization: true,
        tags: ['array', 'math'],
      },
      {
        id: 'most-common-word-ii',
        title: 'Most Common Word',
        leetcodeNumber: 819,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a paragraph and a list of banned words, return the most frequent non-banned word. The answer is guaranteed to exist and is unique. Parse the paragraph (case-insensitive, ignoring punctuation), count word frequencies, and skip banned words.',
        hasVisualization: true,
        tags: ['string', 'hash map', 'frequency count'],
      },
      {
        id: 'move-pieces-to-obtain-a-string',
        title: 'Move Pieces to Obtain a String',
        leetcodeNumber: 2337,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given strings start and target with L, R, and underscore characters, check if start can be transformed into target by moving L leftward (only over underscores) and R rightward (only over underscores). Use two pointers skipping underscores and verifying relative order and positions.',
        hasVisualization: true,
        tags: ['two pointers', 'string'],
      },
      {
        id: 'next-permutation',
        title: 'Next Permutation',
        leetcodeNumber: 31,
        difficulty: 'Medium' as Difficulty,
        description:
          'Rearrange nums into the next lexicographically greater permutation in-place. Step 1: Find the rightmost element smaller than its right neighbor (pivot). Step 2: Swap pivot with the rightmost element larger than it. Step 3: Reverse the suffix after the pivot position.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'permutation'],
      },
      {
        id: 'number-of-lines-to-write-string',
        title: 'Number of Lines To Write String',
        leetcodeNumber: 806,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a widths array where widths[i] is the width of character i (a=0 to z=25), and a string s, find the number of lines needed and the width of the last line when each line has at most 100 units width.',
        hasVisualization: true,
        tags: ['string', 'simulation'],
      },
      {
        id: 'number-of-matching-subsequences',
        title: 'Number of Matching Subsequences',
        leetcodeNumber: 792,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s and an array of words, return the number of words that are subsequences of s. A subsequence preserves relative order but does not require contiguous characters. Use bucket/pointer approach: for each character in s, advance pointers of words waiting for that character.',
        hasVisualization: true,
        tags: ['string', 'hash map', 'subsequence', 'two pointers'],
      },
      {
        id: 'number-of-subsequences-that-satisfy-condition',
        title: 'Number of Subsequences That Satisfy the Given Sum Condition',
        leetcodeNumber: 1498,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count subsequences where the sum of min and max elements is <= target. Sort the array, then use two pointers: for each left pointer, find the rightmost index where nums[left]+nums[right]<=target. The count of valid subsequences with nums[left] as min is 2^(right-left).',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorting', 'combinatorics', 'modular arithmetic'],
      },
      {
        id: 'one-edit-distance',
        title: 'One Edit Distance',
        leetcodeNumber: 161,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two strings s and t, determine if they are exactly one edit apart. An edit is defined as inserting a character, deleting a character, or replacing a character. If the lengths differ by more than 1, they cannot be one edit apart.',
        hasVisualization: true,
        tags: ['string', 'two pointers'],
      },
      {
        id: 'orderly-queue',
        title: 'Orderly Queue',
        leetcodeNumber: 899,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a string s and integer k, you can take one of the first k letters of s and put it at the end any number of times. Return the lexicographically smallest string. Key insight: if k==1, only rotations are possible so find the minimum rotation. If k>=2, any permutation is achievable so just sort the string.',
        hasVisualization: true,
        tags: ['string', 'math', 'sorting'],
      },
      {
        id: 'partition-array-into-disjoint-intervals',
        title: 'Partition Array into Disjoint Intervals',
        leetcodeNumber: 915,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array, partition it into two contiguous subarrays left and right such that every element in left is less than or equal to every element in right. Find the minimum length of left. Track the current max of left and the overall max seen so far.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'greedy'],
      },
      {
        id: 'positions-of-large-groups',
        title: 'Positions of Large Groups',
        leetcodeNumber: 830,
        difficulty: 'Easy' as Difficulty,
        description:
          'In a string, a ',
        hasVisualization: true,
        tags: ['array', 'string', 'grouping'],
      },
      {
        id: 'projection-area-of-3d-shapes',
        title: 'Projection Area of 3D Shapes',
        leetcodeNumber: 883,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an n x n grid of cube stack heights, compute the sum of three projection areas: top (xy-plane: count nonzero cells), front (xz-plane: max of each column), and side (yz-plane: max of each row). Sum all three projections for the answer.',
        hasVisualization: true,
        tags: ['array', 'matrix', 'geometry', 'projection'],
      },
      {
        id: 'push-dominoes',
        title: 'Push Dominoes',
        leetcodeNumber: 838,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string of dominoes where R means pushed right, L means pushed left, and . means standing upright, simulate the final state after all dominoes have fallen. Use two-pointer or force-based approach to determine each domino outcome.',
        hasVisualization: true,
        tags: ['string', 'two pointers', 'simulation'],
      },
      {
        id: 'queens-that-can-attack-the-king',
        title: 'Queens That Can Attack the King',
        leetcodeNumber: 1222,
        difficulty: 'Medium' as Difficulty,
        description:
          'On an 8x8 chessboard with queens and a king, find all queens that can directly attack the king (no other queen in between). Search in all 8 directions from the king position and return the first queen found in each direction.',
        hasVisualization: true,
        tags: ['array', 'matrix', 'simulation', 'chess'],
      },
      {
        id: 'range-addition-ii',
        title: 'Range Addition II',
        leetcodeNumber: 598,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an m x n matrix initialized to zeros and a list of operations [a, b] that increment every cell in the top-left a x b sub-matrix, count the number of cells with the maximum value. The maximum value cells are always in the top-left corner defined by the minimum a and minimum b across all operations.',
        hasVisualization: true,
        tags: ['array', 'math', 'matrix'],
      },
      {
        id: 'range-addition',
        title: 'Range Addition',
        leetcodeNumber: 370,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given length n and a list of update operations [startIndex, endIndex, inc], apply each operation by incrementing all elements in the range by inc. Use the prefix sum difference array technique: mark +inc at startIndex and -inc at endIndex+1, then take a running prefix sum to get final values in O(n + k) time.',
        hasVisualization: true,
        tags: ['array', 'prefix sum', 'difference array'],
      },
      {
        id: 'rearrange-array-elements-by-sign',
        title: 'Rearrange Array Elements by Sign',
        leetcodeNumber: 2149,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array with equal numbers of positive and negative integers, rearrange them so that positives occupy even indices and negatives occupy odd indices, preserving relative order. Use two pointers tracking next positive and negative positions.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorting'],
      },
      {
        id: 'remove-comments',
        title: 'Remove Comments',
        leetcodeNumber: 722,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a C++ source code as an array of lines, remove all comments. Block comments start with /* and end with */. Line comments start with // and extend to end of line. A block comment can span multiple lines.',
        hasVisualization: true,
        tags: ['string', 'simulation'],
      },
      {
        id: 'remove-duplicates-from-sorted-array-ii',
        title: 'Remove Duplicates from Sorted Array II',
        leetcodeNumber: 80,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a sorted array, remove duplicates in-place such that each unique element appears at most twice. Return the new length. Uses a slow pointer k that tracks the write position and a fast pointer i that scans the array.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorted', 'in-place'],
      },
      {
        id: 'remove-duplicates-sorted-list-iii',
        title: 'Remove Duplicates from Sorted List (All Occurrences)',
        leetcodeNumber: 83,
        difficulty: 'Easy' as Difficulty,
        description:
          'Remove all duplicate numbers from a sorted array, keeping only elements that appear exactly once. Use a two-pointer approach: pointer i scans the array while pointer k tracks write position, skipping any value that appears more than once.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorted'],
      },
      {
        id: 'reverse-only-letters',
        title: 'Reverse Only Letters',
        leetcodeNumber: 917,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string s, reverse the string but keep non-letter characters in their original positions. Use two pointers from both ends: skip non-letter characters, then swap letters.',
        hasVisualization: true,
        tags: ['string', 'two pointers'],
      },
      {
        id: 'rotate-string',
        title: 'Rotate String',
        leetcodeNumber: 796,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given two strings s and goal, determine if goal is a rotation of s. A rotation shifts some prefix of s to the end. The key insight is that goal is a rotation of s if and only if goal is a substring of s+s (and they have the same length).',
        hasVisualization: true,
        tags: ['string', 'string matching'],
      },
      {
        id: 'sentence-similarity',
        title: 'Sentence Similarity',
        leetcodeNumber: 734,
        difficulty: 'Easy' as Difficulty,
        description:
          'Two sentences are similar if they are the same or one can be obtained from the other by inserting a contiguous sequence of words at one end or both ends. Check from left and right simultaneously: advance left pointer while words match, advance right while words match. Return true if all remaining words in the shorter sentence fit in the overlap.',
        hasVisualization: true,
        tags: ['two pointers', 'string', 'array'],
      },
      {
        id: 'set-mismatch',
        title: 'Set Mismatch',
        leetcodeNumber: 645,
        difficulty: 'Easy' as Difficulty,
        description:
          'You have a set of integers from 1 to n. One number appears twice (duplicate) and one number is missing. Given the array nums containing all integers but with one duplicate and one missing, find and return [duplicate, missing]. Use a frequency count to detect which number appears twice and which is absent.',
        hasVisualization: true,
        tags: ['array', 'hash map', 'frequency count'],
      },
      {
        id: 'shortest-completing-word',
        title: 'Shortest Completing Word',
        leetcodeNumber: 748,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a license plate and an array of words, find the shortest completing word. A completing word contains all letters from the license plate (ignoring numbers and spaces, case-insensitive). If multiple words have the same length, return the first one.',
        hasVisualization: true,
        tags: ['string', 'hash map', 'frequency count'],
      },
      {
        id: 'shortest-distance-to-character',
        title: 'Shortest Distance to a Character',
        leetcodeNumber: 821,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string s and a character c, return an array where each element is the shortest distance from that index to any occurrence of character c. Do two passes: left-to-right tracking the last seen position of c, then right-to-left doing the same, taking the minimum.',
        hasVisualization: true,
        tags: ['array', 'string', 'two pass'],
      },
      {
        id: 'shortest-word-distance-ii',
        title: 'Shortest Word Distance II',
        leetcodeNumber: 244,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a class that accepts a list of words and supports multiple shortest distance queries. Pre-process by storing indices for each word in a map, then use two pointers on the sorted index lists to find the minimum distance in O(M+N) per query.',
        hasVisualization: true,
        tags: ['two pointers', 'hash map', 'design', 'string'],
      },
      {
        id: 'shortest-word-distance-iii',
        title: 'Shortest Word Distance III',
        leetcodeNumber: 245,
        difficulty: 'Medium' as Difficulty,
        description:
          'Similar to Shortest Word Distance, but word1 and word2 may be the same word. If they are the same, find the minimum distance between two different occurrences of that word. Track both pos1 and pos2 independently during the scan.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'string'],
      },
      {
        id: 'shortest-word-distance',
        title: 'Shortest Word Distance',
        leetcodeNumber: 243,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a list of words and two words word1 and word2, return the shortest distance between these two words in the list. Track the last seen positions of both words and compute the distance at each occurrence.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'string'],
      },
      {
        id: 'shuffle-the-array',
        title: 'Shuffle the Array',
        leetcodeNumber: 1470,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array nums of 2n elements in the form [x1, x2, ..., xn, y1, y2, ..., yn], return the array in the form [x1, y1, x2, y2, ..., xn, yn]. Interleave the first half and second half of the array by picking one element from each half alternately.',
        hasVisualization: true,
        tags: ['array', 'interleave', 'simulation'],
      },
      {
        id: 'sort-array-by-parity-ii',
        title: 'Sort Array By Parity II',
        leetcodeNumber: 922,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array with half even and half odd integers, rearrange so that every even-indexed position contains an even number and every odd-indexed position contains an odd number. Use two pointers: one scanning even indices, another scanning odd indices.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorting'],
      },
      {
        id: 'sort-colors-ii',
        title: 'Sort Colors II',
        leetcodeNumber: 75,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array with n objects colored with k colors labeled 0 to k-1, sort them in-place so that objects of the same color are adjacent. This is a Dutch national flag variant extended to k colors. Uses a counting sort approach for O(n) time.',
        hasVisualization: true,
        tags: ['two pointers', 'sorting', 'dutch national flag', 'array'],
      },
      {
        id: 'spiral-matrix-ii',
        title: 'Spiral Matrix II',
        leetcodeNumber: 59,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a positive integer n, generate an n x n matrix filled with elements from 1 to n squared in spiral order. Start from the top-left and move right, then down, then left, then up, repeating until the matrix is filled.',
        hasVisualization: true,
        tags: ['matrix', 'simulation', 'spiral'],
      },
      {
        id: 'split-a-string-in-balanced-strings',
        title: 'Split a String in Balanced Strings',
        leetcodeNumber: 1221,
        difficulty: 'Easy' as Difficulty,
        description:
          'Balanced strings have equal numbers of L and R characters. Given a balanced string s, split it into the maximum number of balanced substrings. Greedy: every time the running count of L equals the running count of R, we have found a balanced substring.',
        hasVisualization: true,
        tags: ['string', 'greedy', 'counting'],
      },
      {
        id: 'stamping-the-sequence',
        title: 'Stamping the Sequence',
        leetcodeNumber: 936,
        difficulty: 'Hard' as Difficulty,
        description:
          'You have a stamp of a given string and a target string. You can stamp the stamp over the target at any position. Return the sequence of stamp positions to build the target (reversed: work backward by ',
        hasVisualization: true,
        tags: ['string', 'greedy', 'simulation'],
      },
      {
        id: 'sum-of-all-odd-length-subarrays',
        title: 'Sum of All Odd Length Subarrays',
        leetcodeNumber: 1588,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a positive integer array, compute the sum of all elements from every odd-length subarray. Enumerate all odd lengths (1, 3, 5, ...) and for each length, slide a window summing elements. Alternatively, each element at index i contributes to a calculable number of odd-length subarrays based on its position.',
        hasVisualization: true,
        tags: ['array', 'prefix sum', 'math'],
      },
      {
        id: 'surface-area-of-3d-shapes',
        title: 'Surface Area of 3D Shapes',
        leetcodeNumber: 892,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an n x n grid where grid[i][j] is the number of cubes stacked at position (i,j), compute the total surface area. Each stack of h cubes contributes 4h + 2 area (sides and top/bottom), but faces shared between adjacent stacks are hidden. Subtract 2 * min(h1, h2) for each shared border.',
        hasVisualization: true,
        tags: ['array', 'matrix', 'geometry'],
      },
      {
        id: 'three-sum-with-multiplicity',
        title: '3Sum With Multiplicity',
        leetcodeNumber: 923,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of ordered triplets (i, j, k) where i < j < k and arr[i] + arr[j] + arr[k] == target. Sort the array, then for each element fix it as the first, and use two pointers for the remaining pair. Handle duplicates carefully to count multiplicities.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorting', 'combinatorics'],
      },
      {
        id: 'trapping-rain-water-two-pointer',
        title: 'Trapping Rain Water (Two Pointer)',
        leetcodeNumber: 42,
        difficulty: 'Hard' as Difficulty,
        description:
          'Calculate how much water is trapped after raining given elevation heights. Two pointer approach: maintain left and right pointers with maxLeft and maxRight. Move the pointer with the smaller max inward, adding water trapped at that position (max - height[ptr]).',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'dynamic programming'],
      },
      {
        id: 'two-sum-less-than-k',
        title: 'Two Sum Less Than K',
        leetcodeNumber: 1099,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer array and integer k, find the maximum sum S such that there exist two indices i < j where nums[i] + nums[j] = S and S < k. Sort the array and use two pointers converging inward, tracking the best valid sum.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorting'],
      },
      {
        id: 'unique-morse-code-words',
        title: 'Unique Morse Code Words',
        leetcodeNumber: 804,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a list of words, return the number of different Morse code representations. Each letter maps to its Morse code; a word maps to the concatenation of its letters codes. Count distinct concatenations.',
        hasVisualization: true,
        tags: ['string', 'hash set'],
      },
      {
        id: 'valid-word-abbreviation',
        title: 'Valid Word Abbreviation',
        leetcodeNumber: 408,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a non-empty string word and an abbreviation abbr, determine if abbr is a valid abbreviation of word. A number in abbr represents skipping that many characters in word. Numbers cannot have leading zeros.',
        hasVisualization: true,
        tags: ['string', 'two pointers'],
      },
      {
        id: 'vowel-spellchecker',
        title: 'Vowel Spellchecker',
        leetcodeNumber: 966,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a wordlist and queries, for each query return: the original word if exact match, case-insensitive match if exists, vowel-error match (treat all vowels as wildcards) if exists, or empty string. Preprocess the wordlist into three lookup structures for efficiency.',
        hasVisualization: true,
        tags: ['string', 'hash map', 'case insensitive'],
      },
      {
        id: 'wiggle-sort',
        title: 'Wiggle Sort',
        leetcodeNumber: 280,
        difficulty: 'Medium' as Difficulty,
        description:
          'Reorder an array in-place so that nums[0] <= nums[1] >= nums[2] <= nums[3]... One-pass approach: for each even index i, if nums[i] > nums[i+1] swap them; for each odd index i, if nums[i] < nums[i+1] swap them.',
        hasVisualization: true,
        tags: ['two pointers', 'array', 'sorting', 'greedy'],
      },
    
      {
        id: 'basic-string-calculator',
        title: 'Basic Calculator',
        leetcodeNumber: 224,
        difficulty: 'Hard' as Difficulty,
        description:
          'Evaluate a basic mathematical expression string with +, -, (, ) and spaces. Use a stack to handle parentheses: when seeing \\',
        hasVisualization: true,
        tags: ['string', 'stack', 'math', 'expression evaluation'],
      },
      {
        id: 'battleships-in-a-board',
        title: 'Battleships in a Board',
        leetcodeNumber: 419,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of battleships in an m x n board. Battleships are represented by ',
        hasVisualization: true,
        tags: ['Matrix', 'Counting'],
      },
      {
        id: 'car-fleet-intervals',
        title: 'Car Fleet (Interval Approach)',
        leetcodeNumber: 853,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given car positions and speeds heading toward target, determine how many fleets arrive together. Model each car as an interval: sort by position descending. Compute arrival time for each car; if a car\\',
        hasVisualization: true,
        tags: ['Intervals', 'Greedy', 'Monotonic Stack', 'Sorting'],
      },
      {
        id: 'check-if-every-row-and-column-contains-all-numbers',
        title: 'Check if Every Row and Column Contains All Numbers',
        leetcodeNumber: 2133,
        difficulty: 'Easy' as Difficulty,
        description:
          'An n x n matrix is valid if every row and every column contains all integers from 1 to n exactly once. Check each row and column using a set of expected values.',
        hasVisualization: true,
        tags: ['Matrix', 'Hash Map', 'Validation'],
      },
      {
        id: 'count-and-say-ii',
        title: 'Count and Say',
        leetcodeNumber: 38,
        difficulty: 'Medium' as Difficulty,
        description:
          'The count-and-say sequence: ',
        hasVisualization: true,
        tags: ['string', 'run-length encoding', 'simulation', 'sequence'],
      },
      {
        id: 'count-integers-in-intervals',
        title: 'Count Integers in Intervals',
        leetcodeNumber: 2276,
        difficulty: 'Hard' as Difficulty,
        description:
          'Design a data structure that adds intervals and counts the total distinct integers covered. When adding [l, r], merge with any existing overlapping intervals and update the count. Uses a sorted interval list; each add is O(n) worst case but amortized O(log n) with sorted containers.',
        hasVisualization: true,
        tags: ['Intervals', 'Design', 'Sorted List', 'Segment Tree'],
      },
      {
        id: 'count-negative-numbers-matrix',
        title: 'Count Negative Numbers in a Sorted Matrix',
        leetcodeNumber: 1351,
        difficulty: 'Easy' as Difficulty,
        description:
          'Count the number of negative numbers in an m x n matrix sorted in non-increasing order (each row and column is sorted descending). Use a staircase search starting from the top-right corner for O(m+n) time.',
        hasVisualization: true,
        tags: ['Matrix', 'Binary Search', 'Counting'],
      },
      {
        id: 'determine-if-two-events-have-conflict',
        title: 'Determine If Two Events Have Conflict',
        leetcodeNumber: 2446,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given two events as ',
        hasVisualization: true,
        tags: ['Intervals', 'String', 'Greedy'],
      },
      {
        id: 'determine-whether-matrix-can-be-obtained',
        title: 'Determine Whether Matrix Can Be Obtained By Rotation',
        leetcodeNumber: 1886,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given two n x n binary matrices mat and target, return true if target can be obtained from mat by rotating it 0, 90, 180, or 270 degrees clockwise. Try each rotation and compare.',
        hasVisualization: true,
        tags: ['Matrix', 'Simulation', 'Rotation'],
      },
      {
        id: 'diagonal-traverse-ii',
        title: 'Diagonal Traverse II',
        leetcodeNumber: 1424,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a 2D list of different row lengths, return all elements in diagonal order. Group elements by their (row + col) sum - elements on the same anti-diagonal have the same r+c sum. Within each diagonal, add elements in reverse row order (bottom to top). O(n) time where n = total elements.',
        hasVisualization: true,
        tags: ['Simulation', 'Array', 'Hash Map', 'Sorting'],
      },
      {
        id: 'difference-between-ones-and-zeros',
        title: 'Difference Between Ones and Zeros in Row and Column',
        leetcodeNumber: 2482,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an m x n binary matrix, compute diff[i][j] = onesRow[i] + onesCol[j] - zerosRow[i] - zerosCol[j], where onesRow[i] is the count of 1s in row i, etc. Precompute row/col counts then fill the result matrix.',
        hasVisualization: true,
        tags: ['Matrix', 'Prefix Sum', 'Array'],
      },
      {
        id: 'distinct-echo-substrings',
        title: 'Distinct Echo Substrings',
        leetcodeNumber: 1316,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count distinct substrings of the form s+s (echo strings). For each even-length window of length 2k, check if the first half equals the second half. Use rolling hash or Z-function for efficient comparison.',
        hasVisualization: true,
        tags: ['string', 'rolling hash', 'hashing', 'substring'],
      },
      {
        id: 'divide-intervals-into-minimum-groups',
        title: 'Divide Intervals Into Minimum Groups',
        leetcodeNumber: 2406,
        difficulty: 'Medium' as Difficulty,
        description:
          'Partition intervals into the minimum number of groups such that no two intervals in the same group overlap. The answer equals the maximum number of intervals active at any single point (the maximum depth). Use event-based sweep: +1 at each start, -1 at each end+1, track running max. O(n log n) time.',
        hasVisualization: true,
        tags: ['Intervals', 'Greedy', 'Heap', 'Sweep Line'],
      },
      {
        id: 'encode-and-decode-strings',
        title: 'Encode and Decode Strings',
        leetcodeNumber: 271,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design an algorithm to encode a list of strings to a single string, and decode it back. Use a length-prefix encoding: prepend each string with its length and a delimiter like ',
        hasVisualization: true,
        tags: ['string', 'design', 'encoding', 'serialization'],
      },
      {
        id: 'game-of-life-ii',
        title: 'Game of Life',
        leetcodeNumber: 289,
        difficulty: 'Medium' as Difficulty,
        description:
          'Conway',
        hasVisualization: true,
        tags: ['Matrix', 'Simulation', 'In-place'],
      },
      {
        id: 'group-shifted-strings-ii',
        title: 'Group Shifted Strings',
        leetcodeNumber: 249,
        difficulty: 'Medium' as Difficulty,
        description:
          'Group strings that belong to the same shifting sequence. A string belongs to a shifting sequence if shifting each character by the same amount gives another string in the sequence. Encode each string as its ',
        hasVisualization: true,
        tags: ['string', 'hash map', 'grouping', 'encoding'],
      },
      {
        id: 'image-overlap',
        title: 'Image Overlap',
        leetcodeNumber: 835,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two n x n binary matrices A and B, return the largest possible overlap when translating A over B. The overlap is the number of cells where both have a 1 after translation. Try all possible (dx, dy) offsets and count matching 1-1 cells.',
        hasVisualization: true,
        tags: ['Matrix', 'Counting', 'Simulation'],
      },
      {
        id: 'insert-interval-iii',
        title: 'Insert Interval III',
        leetcodeNumber: 57,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a sorted non-overlapping list of intervals and a new interval, insert it in the correct position and merge any overlaps. Three phases: add all intervals ending before newInterval starts, merge overlapping intervals, then add remaining. O(n) time.',
        hasVisualization: true,
        tags: ['Intervals', 'Greedy'],
      },
      {
        id: 'interval-list-intersections-iii',
        title: 'Interval List Intersections III',
        leetcodeNumber: 986,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two lists of closed intervals A and B (each sorted and non-overlapping), return the intersection. Two-pointer approach: compute overlap as [max(starts), min(ends)]; if valid, record it. Advance the pointer for whichever interval ends first. O(m+n) time.',
        hasVisualization: true,
        tags: ['Intervals', 'Two Pointers'],
      },
      {
        id: 'island-perimeter-ii',
        title: 'Island Perimeter',
        leetcodeNumber: 463,
        difficulty: 'Easy' as Difficulty,
        description:
          'Calculate the perimeter of the island in a grid. Each land cell (1) contributes 4 to the perimeter, but each shared edge with another land cell subtracts 2. Alternatively, count each land-to-water/border edge.',
        hasVisualization: true,
        tags: ['Matrix', 'Math', 'Counting'],
      },
      {
        id: 'isomorphic-strings-ii',
        title: 'Isomorphic Strings',
        leetcodeNumber: 205,
        difficulty: 'Easy' as Difficulty,
        description:
          'Two strings s and t are isomorphic if characters in s can be replaced to get t, preserving order. Use two maps: one from s->t chars and one from t->s chars. Check consistency at each position.',
        hasVisualization: true,
        tags: ['string', 'hash map', 'isomorphic', 'character mapping'],
      },
      {
        id: 'kmp-pattern-matching',
        title: 'KMP Pattern Matching',
        leetcodeNumber: 28,
        difficulty: 'Medium' as Difficulty,
        description:
          'Knuth-Morris-Pratt (KMP) algorithm finds all occurrences of a pattern in a text in O(n+m) time. It builds a failure function (partial match table) to skip redundant comparisons after a mismatch.',
        hasVisualization: true,
        tags: ['string', 'kmp', 'pattern matching', 'failure function'],
      },
      {
        id: 'longest-duplicate-substring',
        title: 'Longest Duplicate Substring',
        leetcodeNumber: 1044,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the longest substring that appears at least twice. Uses binary search on length + Rabin-Karp rolling hash to check for duplicate substrings of a given length in O(n log n) expected time.',
        hasVisualization: true,
        tags: ['string', 'binary search', 'rolling hash', 'rabin-karp', 'suffix array'],
      },
      {
        id: 'longest-happy-prefix',
        title: 'Longest Happy Prefix',
        leetcodeNumber: 1392,
        difficulty: 'Hard' as Difficulty,
        description:
          'A ',
        hasVisualization: true,
        tags: ['string', 'kmp', 'failure function', 'prefix', 'suffix'],
      },
      {
        id: 'longest-palindromic-substring-manacher',
        title: 'Longest Palindromic Substring (Manacher',
        leetcodeNumber: 5,
        difficulty: 'Hard' as Difficulty,
        description:
          'Manacher',
        hasVisualization: true,
        tags: ['string', 'manacher', 'palindrome', 'linear time'],
      },
      {
        id: 'lucky-numbers-in-matrix',
        title: 'Lucky Numbers in a Matrix',
        leetcodeNumber: 1380,
        difficulty: 'Easy' as Difficulty,
        description:
          'A lucky number in a matrix is the minimum of its row AND the maximum of its column. Find all lucky numbers. First compute row minimums and column maximums, then check which cells satisfy both conditions.',
        hasVisualization: true,
        tags: ['Matrix', 'Array'],
      },
      {
        id: 'maximum-length-of-pair-chain-greedy',
        title: 'Maximum Length of Pair Chain (Greedy)',
        leetcodeNumber: 646,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the longest chain of pairs where each pair (c,d) follows (a,b) only if b < c. Sort by end (greedy activity selection): keep a pair only if its start > currentEnd, then update currentEnd. O(n log n) time — optimal greedy interval scheduling.',
        hasVisualization: true,
        tags: ['Intervals', 'Greedy', 'Sorting', 'Dynamic Programming'],
      },
      {
        id: 'meeting-rooms-iv',
        title: 'Meeting Rooms IV (Min Rooms)',
        leetcodeNumber: 253,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of meeting time intervals, find the minimum number of conference rooms required. Use a min-heap of end times: sort by start, allocate a new room or reuse the earliest-ending room. The heap size at any point is the current room count. O(n log n) time.',
        hasVisualization: true,
        tags: ['Intervals', 'Heap', 'Greedy', 'Sorting'],
      },
      {
        id: 'meeting-rooms-v',
        title: 'Meeting Rooms V (Conference Allocation)',
        difficulty: 'Hard' as Difficulty,
        description:
          'Conference room allocation: given meetings and k rooms, determine the maximum number of meetings that can be scheduled without overlap, and which meetings get assigned to which room. Sort by duration then start time; greedily assign each meeting to the earliest-free room. O(n log n + n·k) time.',
        hasVisualization: true,
        tags: ['Intervals', 'Greedy', 'Heap', 'Sorting'],
      },
      {
        id: 'merge-intervals-iii',
        title: 'Merge Intervals III',
        leetcodeNumber: 56,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a collection of intervals, merge all overlapping intervals. Sort by start, then greedily merge: if the current interval overlaps with the last merged, extend the end; otherwise push a new interval. Returns the minimum number of non-overlapping intervals. O(n log n) time, O(n) space.',
        hasVisualization: true,
        tags: ['Intervals', 'Sorting', 'Greedy'],
      },
      {
        id: 'minimum-interval-to-include-query',
        title: 'Minimum Interval to Include Each Query',
        leetcodeNumber: 1851,
        difficulty: 'Hard' as Difficulty,
        description:
          'For each query point, find the size (end-start+1) of the smallest interval containing it. Sort queries and intervals by start; use a min-heap of (size, end) for active intervals. Process queries in order, adding intervals whose start <= query, then remove stale intervals, answer is heap top. O(n log n + q log q).',
        hasVisualization: true,
        tags: ['Intervals', 'Sorting', 'Heap', 'Sweep Line'],
      },
      {
        id: 'minimum-number-of-arrows-iv',
        title: 'Minimum Number of Arrows IV',
        leetcodeNumber: 452,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given balloon intervals on a number line, find the minimum number of arrows to burst all balloons. An arrow at x bursts all balloons where start <= x <= end. Sort by end; greedily shoot at the rightmost point of the current balloon and count how many subsequent balloons it bursts. O(n log n) time.',
        hasVisualization: true,
        tags: ['Intervals', 'Greedy', 'Sorting'],
      },
      {
        id: 'minimum-number-of-deletions-to-make-sorted',
        title: 'Minimum Deletions to Make String Sorted',
        leetcodeNumber: 1578,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string of \\',
        hasVisualization: true,
        tags: ['string', 'greedy', 'prefix sum', 'sorting'],
      },
      {
        id: 'minimum-number-of-groups-to-clear-intervals',
        title: 'Minimum Number of Groups to Clear Intervals',
        leetcodeNumber: 2406,
        difficulty: 'Medium' as Difficulty,
        description:
          'Variant of LC 2406: partition intervals into minimum groups where no two intervals in a group overlap. This equals the maximum number of intervals active simultaneously at any point. Use a min-heap of end times: for each interval sorted by start, if earliest-ending active interval ends before this starts, reuse that group; else add new group. O(n log n).',
        hasVisualization: true,
        tags: ['Intervals', 'Greedy', 'Heap', 'Sweep Line'],
      },
      {
        id: 'multiply-strings-ii',
        title: 'Multiply Strings',
        leetcodeNumber: 43,
        difficulty: 'Medium' as Difficulty,
        description:
          'Multiply two non-negative integers represented as strings without using BigInteger. For digits num1[i] and num2[j], their product contributes to result positions [i+j] and [i+j+1]. Process all digit pairs, then handle carries.',
        hasVisualization: true,
        tags: ['string', 'math', 'multiplication', 'grade school'],
      },
      {
        id: 'my-calendar-i-ii',
        title: 'My Calendar I II',
        leetcodeNumber: 729,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a calendar that prevents double booking. For each new event [start, end), check if it overlaps any booked event (overlap exists when start < booked.end AND end > booked.start). If no overlap, book it. O(n) per booking, O(n) space.',
        hasVisualization: true,
        tags: ['Intervals', 'Design', 'Sorted List'],
      },
      {
        id: 'my-calendar-ii-ii',
        title: 'My Calendar II II',
        leetcodeNumber: 731,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a calendar allowing double booking but not triple booking. Maintain a list of single bookings and double bookings. For a new event, if it overlaps any double booking → reject. Otherwise add overlaps with single bookings to double bookings list, then add to single bookings. O(n) per booking.',
        hasVisualization: true,
        tags: ['Intervals', 'Design'],
      },
      {
        id: 'my-calendar-iii-ii',
        title: 'My Calendar III II',
        leetcodeNumber: 732,
        difficulty: 'Hard' as Difficulty,
        description:
          'Return the max k-booking count after each event is booked. Use a difference array / event counting approach: increment at start, decrement at end, track running maximum over all intervals. O(n^2) per booking with sorted events. Returns the maximum simultaneous bookings.',
        hasVisualization: true,
        tags: ['Intervals', 'Design', 'Difference Array', 'Segment Tree'],
      },
      {
        id: 'next-closest-time',
        title: 'Next Closest Time',
        leetcodeNumber: 681,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a time ',
        hasVisualization: true,
        tags: ['String', 'Simulation', 'Enumeration'],
      },
      {
        id: 'non-overlapping-intervals-ii',
        title: 'Non-Overlapping Intervals II',
        leetcodeNumber: 435,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the minimum number of intervals to remove to make the rest non-overlapping. Sort by end time; greedily keep intervals that don\\',
        hasVisualization: true,
        tags: ['Intervals', 'Greedy', 'Sorting'],
      },
      {
        id: 'pascals-triangle-ii',
        title: 'Pascal',
        leetcodeNumber: 119,
        difficulty: 'Easy' as Difficulty,
        description:
          'Return the rowIndex-th (0-indexed) row of Pascal',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Array', 'Math'],
      },
      {
        id: 'pascals-triangle-iii',
        title: 'Pascal',
        leetcodeNumber: 118,
        difficulty: 'Easy' as Difficulty,
        description:
          'Generate the first numRows of Pascal',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Array', 'Math'],
      },
      {
        id: 'points-that-intersect-with-cars',
        title: 'Points That Intersect With Cars',
        leetcodeNumber: 2848,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given cars on a number line (each occupying interval [start, end]), count distinct integer points covered by at least one car. Merge intervals then count total length. Sort by start, merge overlapping, sum (end-start+1) of each merged interval. O(n log n) time.',
        hasVisualization: true,
        tags: ['Intervals', 'Sorting', 'Greedy'],
      },
      {
        id: 'pour-water',
        title: 'Pour Water',
        leetcodeNumber: 755,
        difficulty: 'Medium' as Difficulty,
        description:
          'Simulate pouring V units of water at position K on a terrain. Each unit: look left first, find the lowest point (must be strictly lower than starting position) - if found, drop there; else look right; else stay at K. The water fills valleys and stacks on flat surfaces.',
        hasVisualization: true,
        tags: ['Simulation', 'Array'],
      },
      {
        id: 'prison-cells-after-n-days',
        title: 'Prison Cells After N Days',
        leetcodeNumber: 957,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given 8 prison cells (0=empty, 1=occupied), each day a cell becomes occupied if both neighbors were the same state, otherwise empty. First and last cells always empty after day 1. Detect the cycle (max 256 states) and compute state at day N using N % cycleLength. O(1) time after cycle detection.',
        hasVisualization: true,
        tags: ['Simulation', 'Array', 'Bit Manipulation', 'Hash Map'],
      },
      {
        id: 'rabin-karp-search',
        title: 'Rabin-Karp String Search',
        difficulty: 'Medium' as Difficulty,
        description:
          'Rabin-Karp uses rolling hash to search for a pattern in a text. The hash of the current window is computed in O(1) by subtracting the outgoing character and adding the incoming character. Average O(n+m), worst O(nm).',
        hasVisualization: true,
        tags: ['string', 'rolling hash', 'rabin-karp', 'pattern matching'],
      },
      {
        id: 'range-module-ii',
        title: 'Range Module II',
        leetcodeNumber: 715,
        difficulty: 'Hard' as Difficulty,
        description:
          'Design a Range Module that tracks ranges of numbers. Supports addRange(l,r), removeRange(l,r), queryRange(l,r). Uses a sorted list of disjoint intervals. addRange merges overlapping/adjacent intervals; removeRange splits or trims; queryRange checks if [l,r) is fully covered. O(n) per operation.',
        hasVisualization: true,
        tags: ['Intervals', 'Design', 'Sorted List', 'Segment Tree'],
      },
      {
        id: 'remove-covered-intervals-ii',
        title: 'Remove Covered Intervals II',
        leetcodeNumber: 1288,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of remaining intervals after removing all intervals covered by another interval. An interval [a,b] is covered by [c,d] if c<=a and b<=d. Sort by start ascending and end descending; greedily track max end seen — if current end <= maxEnd, it is covered. O(n log n) time.',
        hasVisualization: true,
        tags: ['Intervals', 'Greedy', 'Sorting'],
      },
      {
        id: 'repeated-string-match-kmp',
        title: 'Repeated String Match (KMP)',
        leetcodeNumber: 686,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the minimum number of times string a must be repeated so that b is a substring. Key insight: repeat a enough times to cover b\\',
        hasVisualization: true,
        tags: ['string', 'kmp', 'pattern matching', 'string repetition'],
      },
      {
        id: 'reshape-the-matrix',
        title: 'Reshape the Matrix',
        leetcodeNumber: 566,
        difficulty: 'Easy' as Difficulty,
        description:
          'Reshape an m x n matrix into an r x c matrix with the same elements in row-major order. If total elements differ, return the original matrix. Use the flat index: element k goes to result[k/c][k%c].',
        hasVisualization: true,
        tags: ['Matrix', 'Simulation'],
      },
      {
        id: 'robot-return-to-origin-ii',
        title: 'Robot Return to Origin II',
        leetcodeNumber: 657,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a sequence of moves (U, D, L, R), determine if a robot starting at (0,0) returns to the origin. The robot returns to origin if and only if the number of U moves equals D moves AND L moves equals R moves. O(n) time, O(1) space.',
        hasVisualization: true,
        tags: ['Simulation', 'String'],
      },
      {
        id: 'rotate-image-ii',
        title: 'Rotate Image',
        leetcodeNumber: 48,
        difficulty: 'Medium' as Difficulty,
        description:
          'Rotate an n x n matrix 90 degrees clockwise in-place. The approach is to first transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row. This achieves the rotation without extra space.',
        hasVisualization: true,
        tags: ['Matrix', 'In-place', 'Simulation'],
      },
      {
        id: 'search-a-2d-matrix-ii-advanced',
        title: 'Search a 2D Matrix II',
        leetcodeNumber: 240,
        difficulty: 'Medium' as Difficulty,
        description:
          'Search for a target in an m x n matrix where each row and column is sorted in ascending order. Start from the top-right corner: if current > target, move left; if current < target, move down. This eliminates one row or column per step, achieving O(m+n) time.',
        hasVisualization: true,
        tags: ['Matrix', 'Binary Search', 'Divide and Conquer'],
      },
      {
        id: 'set-intersection-size-at-least-two',
        title: 'Set Intersection Size At Least Two',
        leetcodeNumber: 757,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the minimum size of a set S such that every interval [a,b] contains at least 2 elements of S. Sort intervals by end ascending, then by start descending for ties. Greedily add two rightmost points of each interval not yet covered by at least 2 points. O(n log n) time.',
        hasVisualization: true,
        tags: ['Intervals', 'Greedy', 'Sorting'],
      },
      {
        id: 'set-matrix-zeroes-ii',
        title: 'Set Matrix Zeroes',
        leetcodeNumber: 73,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an m x n matrix, if an element is 0, set its entire row and column to 0 in-place. Use O(1) extra space by storing the zero-row/col flags in the first row and first column of the matrix itself.',
        hasVisualization: true,
        tags: ['Matrix', 'In-place', 'Hash Map'],
      },
      {
        id: 'shortest-palindrome-kmp',
        title: 'Shortest Palindrome (KMP)',
        leetcodeNumber: 214,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the shortest palindrome by adding characters in front of the given string. Key insight: find the longest palindromic prefix using KMP on the string combined with its reverse. Prepend the remaining suffix reversed.',
        hasVisualization: true,
        tags: ['string', 'kmp', 'palindrome', 'failure function'],
      },
      {
        id: 'spiral-matrix-iii',
        title: 'Spiral Matrix III',
        leetcodeNumber: 885,
        difficulty: 'Medium' as Difficulty,
        description:
          'Starting at (rStart, cStart) in an R x C grid, walk in a clockwise spiral and return the coordinates of all cells in the order visited. The spiral grows: right 1, down 1, left 2, up 2, right 3, down 3, ...',
        hasVisualization: true,
        tags: ['Matrix', 'Simulation', 'Spiral'],
      },
      {
        id: 'spiral-matrix-iv',
        title: 'Spiral Matrix IV',
        leetcodeNumber: 2326,
        difficulty: 'Medium' as Difficulty,
        description:
          'Fill an m x n matrix with values from a linked list in spiral order. Traverse the matrix in spiral order (right, down, left, up) and place linked list values. Any remaining cells are filled with -1. O(m*n) time and space.',
        hasVisualization: true,
        tags: ['Simulation', 'Matrix', 'Linked List', 'Array'],
      },
      {
        id: 'string-compression-iii',
        title: 'String Compression III',
        leetcodeNumber: 3163,
        difficulty: 'Medium' as Difficulty,
        description:
          'Compress a string by counting consecutive characters, but limit each run to at most 9. For example ',
        hasVisualization: true,
        tags: ['string', 'compression', 'run-length encoding', 'greedy'],
      },
      {
        id: 'string-matching-in-array',
        title: 'String Matching in an Array',
        leetcodeNumber: 1408,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array of strings, return all strings that are substrings of another string in the array. For each pair (i, j) where i != j, check if words[i] is a substring of words[j].',
        hasVisualization: true,
        tags: ['string', 'substring', 'brute force'],
      },
      {
        id: 'suffix-array-construction',
        title: 'Suffix Array Construction',
        difficulty: 'Hard' as Difficulty,
        description:
          'A suffix array is a sorted array of all suffixes of a string. Naive O(n^2 log n) construction: generate all suffixes, sort them lexicographically, record starting indices. Enables O(m log n) pattern search.',
        hasVisualization: true,
        tags: ['string', 'suffix array', 'sorting', 'advanced'],
      },
      {
        id: 'sum-of-scores-of-built-strings',
        title: 'Sum of Scores of Built Strings',
        leetcodeNumber: 2223,
        difficulty: 'Hard' as Difficulty,
        description:
          'The score of a string is the length of the longest common prefix between the string and any of its suffixes. Sum the scores for all built strings s[0..i]. This equals Z[0] + sum(Z[i]) where Z is the Z-array, with Z[0]=n.',
        hasVisualization: true,
        tags: ['string', 'z-algorithm', 'z-array', 'prefix'],
      },
      {
        id: 'summary-ranges-ii',
        title: 'Summary Ranges II',
        leetcodeNumber: 228,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a sorted unique integer array, return the smallest sorted list of ranges that cover all numbers. Consecutive numbers form a range ',
        hasVisualization: true,
        tags: ['Intervals', 'Two Pointers', 'Array'],
      },
      {
        id: 'teemo-attacking-ii',
        title: 'Teemo Attacking II',
        leetcodeNumber: 495,
        difficulty: 'Easy' as Difficulty,
        description:
          'Teemo attacks at times in timeSeries, each poisoning the enemy for duration seconds. Calculate total seconds of poison. Key insight: for consecutive attacks, the actual poison time is min(timeSeries[i+1] - timeSeries[i], duration). Add duration for the last attack. O(n) time.',
        hasVisualization: true,
        tags: ['Simulation', 'Array', 'Greedy'],
      },
      {
        id: 'text-justification-ii',
        title: 'Text Justification',
        leetcodeNumber: 68,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given words and a max width, format text so each line has exactly maxWidth characters with full justification. Greedily pack words per line, then distribute spaces evenly (extra spaces go to left slots). Last line is left-justified.',
        hasVisualization: true,
        tags: ['string', 'greedy', 'simulation', 'text formatting'],
      },
      {
        id: 'toeplitz-matrix-ii',
        title: 'Toeplitz Matrix',
        leetcodeNumber: 766,
        difficulty: 'Easy' as Difficulty,
        description:
          'A matrix is Toeplitz if every diagonal from top-left to bottom-right has the same element. Check this by verifying matrix[i][j] == matrix[i-1][j-1] for all valid i, j.',
        hasVisualization: true,
        tags: ['Matrix', 'Validation'],
      },
      {
        id: 'valid-sudoku-ii',
        title: 'Valid Sudoku',
        leetcodeNumber: 36,
        difficulty: 'Medium' as Difficulty,
        description:
          'Determine if a 9x9 Sudoku board is valid. Each row, column, and 3x3 sub-box must contain digits 1-9 without repetition. Use three sets of hash sets — one per row, one per column, one per box — to detect duplicates in a single pass.',
        hasVisualization: true,
        tags: ['Matrix', 'Hash Map', 'Validation'],
      },
      {
        id: 'video-stitching-iii',
        title: 'Video Stitching III',
        leetcodeNumber: 1024,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given clips and a time range [0, T], find the minimum number of clips needed to cover the entire range. Sort clips by start; greedily extend the current coverage as far as possible using clips whose start is within current reach, picking the one with farthest end. O(n log n) time.',
        hasVisualization: true,
        tags: ['Intervals', 'Greedy', 'Dynamic Programming'],
      },
      {
        id: 'walking-robot-simulation-ii',
        title: 'Walking Robot Simulation II',
        leetcodeNumber: 874,
        difficulty: 'Medium' as Difficulty,
        description:
          'A robot on an infinite grid faces North, East, South, or West. Given commands (-2=left turn, -1=right turn, 1-9=move forward) and obstacle positions, simulate movement. Return the maximum Euclidean distance squared from origin. O(n+k) where n=commands, k=obstacles.',
        hasVisualization: true,
        tags: ['Simulation', 'Hash Set', 'Array'],
      },
      {
        id: 'z-algorithm-string',
        title: 'Z-Algorithm String Matching',
        difficulty: 'Medium' as Difficulty,
        description:
          'The Z-algorithm computes the Z-array where Z[i] is the length of the longest substring starting from s[i] that is also a prefix of s. Pattern matching: concatenate pattern+',
        hasVisualization: true,
        tags: ['string', 'z-algorithm', 'pattern matching', 'prefix'],
      },
      {
        id: 'zigzag-conversion-ii',
        title: 'Zigzag Conversion',
        leetcodeNumber: 6,
        difficulty: 'Medium' as Difficulty,
        description:
          'Write a string in a zigzag pattern across numRows rows, then read row by row. Use an array of row strings and a direction flag: add each character to the current row, flip direction at top/bottom rows.',
        hasVisualization: true,
        tags: ['string', 'simulation', 'zigzag', 'row traversal'],
      },
    ],
  },

  // ─── 02. Hash Maps And Sets ─────────────────────────────────────────
  {
    id: 'hash-maps-and-sets',
    name: 'Hash Maps And Sets',
    icon: '#',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-emerald-600/10',
    borderColor: 'border-emerald-500/30',
    problems: [
      {
        id: 'pair-sum-unsorted',
        title: 'Pair Sum - Unsorted',
        difficulty: 'Easy',
        leetcodeNumber: 1,
        description:
          'Find two numbers in an unsorted array that add up to a target using a hash map for O(n) lookup.',
        hasVisualization: true,
        tags: ['hash-map', 'array'],
      },
      {
        id: 'verify-sudoku-board',
        title: 'Verify Sudoku Board',
        difficulty: 'Medium',
        leetcodeNumber: 36,
        description:
          'Validate whether a partially filled 9x9 Sudoku board is valid using hash sets for rows, columns, and boxes.',
        hasVisualization: true,
        tags: ['hash-set', 'matrix', 'validation'],
      },
      {
        id: 'zero-striping',
        title: 'Zero Striping',
        difficulty: 'Medium',
        leetcodeNumber: 73,
        description:
          'If an element in a matrix is zero, set its entire row and column to zero.',
        hasVisualization: true,
        tags: ['hash-set', 'matrix', 'in-place'],
      },
      {
        id: 'longest-chain-of-consecutive-numbers',
        title: 'Longest Chain of Consecutive Numbers',
        difficulty: 'Medium',
        leetcodeNumber: 128,
        description:
          'Find the length of the longest sequence of consecutive integers in an unsorted array using a hash set.',
        hasVisualization: true,
        tags: ['hash-set', 'array', 'sequence'],
      },
      {
        id: 'geometric-sequence-triplets',
        title: 'Geometric Sequence Triplets',
        difficulty: 'Medium',
        description:
          'Count triplets in an array that form a geometric progression with a given common ratio.',
        hasVisualization: true,
        tags: ['hash-map', 'array', 'math'],
      },
      {
        id: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        leetcodeNumber: 217,
        description:
          'Given an integer array, return true if any value appears at least twice in the array, and return false if every element is distinct. Use a hash set to track seen elements and detect duplicates in O(n) time.',
        hasVisualization: true,
        tags: ['hash-map', 'hash-set', 'array', 'sorting'],
      },
      {
        id: 'design-hashmap',
        title: 'Design HashMap',
        difficulty: 'Easy',
        leetcodeNumber: 706,
        description:
          'Design a HashMap without using built-in libraries. Use an array of buckets where each bucket holds a list of [key, value] pairs (chaining). Hash function: key % bucketSize. Supports put(key, value), get(key) returning -1 if not found, and remove(key). Demonstrates hash collision handling via chaining.',
        hasVisualization: true,
        tags: ['hash-map', 'design', 'array'],
      },
      {
        id: 'design-hashset',
        title: 'Design HashSet',
        difficulty: 'Easy',
        leetcodeNumber: 705,
        description:
          'Design a HashSet without using built-in libraries. Use an array of buckets (chaining). Each bucket holds a list of keys. Hash function: key % bucketSize. Supports add(key), remove(key), and contains(key). Demonstrates open hashing / separate chaining for collision resolution.',
        hasVisualization: true,
        tags: ['hash-map', 'design', 'array'],
      },
      {
        id: 'encode-decode-strings',
        title: 'Encode and Decode Strings',
        difficulty: 'Medium',
        leetcodeNumber: 271,
        description:
          'Design an algorithm to encode a list of strings to a single string, then decode it back. Use length-prefix encoding: prepend each string with its length and a delimiter (e.g. ',
        hasVisualization: true,
        tags: ['hash-map', 'string', 'encoding', 'design'],
      },
      {
        id: 'first-unique-character',
        title: 'First Unique Character in a String',
        difficulty: 'Easy',
        leetcodeNumber: 387,
        description:
          'Given a string s, find the first non-repeating character and return its index. If no such character exists, return -1. First count all character frequencies, then scan left to right for the first with frequency 1.',
        hasVisualization: true,
        tags: ['hash-map', 'string', 'counting', 'queue'],
      },
      {
        id: 'group-anagrams',
        title: 'Group Anagrams',
        difficulty: 'Medium',
        leetcodeNumber: 49,
        description:
          'Given an array of strings, group the anagrams together. Anagrams are strings using the same characters in the same frequencies. Use a hash map where the sorted string is the key and groups are values.',
        hasVisualization: true,
        tags: ['hash-map', 'string', 'sorting', 'rouping'],
      },
      {
        id: 'intersection-of-two-arrays',
        title: 'Intersection of Two Arrays',
        difficulty: 'Easy',
        leetcodeNumber: 349,
        description:
          'Given two integer arrays nums1 and nums2, return an array of their intersection — elements that appear in both arrays, with each element appearing only once. Use a hash set for O(n+m) time complexity.',
        hasVisualization: true,
        tags: ['hash-map', 'hash-set', 'array', 'binary-search', 'sorting'],
      },
      {
        id: 'isomorphic-strings',
        title: 'Isomorphic Strings',
        difficulty: 'Easy',
        leetcodeNumber: 205,
        description:
          'Given two strings s and t, determine if they are isomorphic. Two strings are isomorphic if characters in s can be replaced to get t, where each character maps to exactly one character and no two characters map to the same character.',
        hasVisualization: true,
        tags: ['hash-map', 'string', 'bijection', 'mapping'],
      },
      {
        id: 'ransom-note',
        title: 'Ransom Note',
        difficulty: 'Easy',
        leetcodeNumber: 383,
        description:
          'Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine. Each letter in magazine can only be used once. Count magazine letters, then verify ransomNote requirements.',
        hasVisualization: true,
        tags: ['hash-map', 'string', 'counting'],
      },
      {
        id: 'top-k-frequent-elements',
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        leetcodeNumber: 347,
        description:
          'Given an integer array and integer k, return the k most frequent elements. Build a frequency map, then use bucket sort (index = frequency) to find top-k elements in O(n) time.',
        hasVisualization: true,
        tags: ['hash-map', 'bucket-sort', 'heap', 'counting'],
      },
      {
        id: 'valid-anagram',
        title: 'Valid Anagram',
        difficulty: 'Easy',
        leetcodeNumber: 242,
        description:
          'Given two strings s and t, return true if t is an anagram of s. An anagram uses all characters of the original string exactly once. Count character frequencies with a hash map and compare.',
        hasVisualization: true,
        tags: ['hash-map', 'string', 'sorting', 'counting'],
      },
      {
        id: 'word-pattern',
        title: 'Word Pattern',
        difficulty: 'Easy',
        leetcodeNumber: 290,
        description:
          'Given a pattern string and a string s, find if s follows the same pattern. Each letter in pattern maps to exactly one word and each word maps to exactly one letter (bijection). Split s into words and check consistency.',
        hasVisualization: true,
        tags: ['hash-map', 'string', 'bijection', 'pattern-matching'],
      },
    
      {
        id: 'array-of-doubled-pairs',
        title: 'Array of Doubled Pairs',
        leetcodeNumber: 954,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of even length, determine if it can be rearranged so that for every element x, there is a corresponding 2x. Sort elements by absolute value, then greedily match each element x with its double 2x using a hash map of remaining counts.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'sorting', 'greedy'],
      },
      {
        id: 'brick-wall',
        title: 'Brick Wall',
        leetcodeNumber: 554,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a brick wall represented as rows of brick widths, find the vertical line that crosses the fewest bricks. Track cumulative widths (edges) per row using a hash map. The line should go through the most edges, minimizing brick crossings.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'greedy'],
      },
      {
        id: 'buddy-strings',
        title: 'Buddy Strings',
        leetcodeNumber: 859,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given two strings s and goal, return true if you can swap exactly one pair of characters in s so that s equals goal. The strings must have the same length. Handle the edge case where s equals goal but has duplicate characters.',
        hasVisualization: true,
        tags: ['string', 'simulation', 'counting'],
      },
      {
        id: 'bulls-and-cows',
        title: 'Bulls and Cows',
        leetcodeNumber: 299,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a secret number and a guess, return a hint as "xAyB" where x is the number of bulls (correct digit, correct position) and y is the number of cows (correct digit, wrong position). Use frequency maps to count mismatches.',
        hasVisualization: true,
        tags: ['hash map', 'string', 'counting'],
      },
      {
        id: 'check-if-array-pairs-divisible-by-k',
        title: 'Check If Array Pairs Are Divisible by K',
        leetcodeNumber: 1497,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of even length and integer k, determine if you can divide the array into pairs such that each pair sum is divisible by k. Count remainders modulo k using a hash map: remainder r must be paired with remainder (k-r). Handle remainder 0 and k/2 separately.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'math', 'divisibility'],
      },
      {
        id: 'check-if-pangram',
        title: 'Check if the Sentence Is Pangram',
        leetcodeNumber: 1832,
        difficulty: 'Easy' as Difficulty,
        description:
          'A pangram is a sentence where every letter of the English alphabet appears at least once. Given a string sentence containing only lowercase English letters, return true if it is a pangram, false otherwise.',
        hasVisualization: true,
        tags: ['hash map', 'hash set', 'string', 'alphabet'],
      },
      {
        id: 'compare-version-numbers',
        title: 'Compare Version Numbers',
        leetcodeNumber: 165,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two version strings version1 and version2, compare them. Version strings consist of revisions separated by dots. Compare each revision integer from left to right. Return 1 if version1 > version2, -1 if version1 < version2, and 0 if equal.',
        hasVisualization: true,
        tags: ['string', 'two pointers', 'split'],
      },
      {
        id: 'contiguous-array-hash',
        title: 'Contiguous Array (Equal 0s and 1s)',
        leetcodeNumber: 525,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the maximum length subarray with an equal number of 0s and 1s. Replace 0s with -1 and use prefix sums: when the same prefix sum appears again, the subarray between those indices has equal counts of 0s and 1s. Store first occurrences in a hash map.',
        hasVisualization: true,
        tags: ['hash map', 'prefix sum', 'array', 'binary'],
      },
      {
        id: 'count-and-say',
        title: 'Count and Say',
        leetcodeNumber: 38,
        difficulty: 'Medium' as Difficulty,
        description:
          'The count-and-say sequence is built iteratively. "1" is the first term. Each subsequent term describes the previous term by counting consecutive digits. For example, "1" is described as "one 1" which gives "11". Given n, return the nth term.',
        hasVisualization: true,
        tags: ['string', 'simulation', 'run-length encoding'],
      },
      {
        id: 'count-binary-substrings',
        title: 'Count Binary Substrings',
        leetcodeNumber: 696,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a binary string s, count the number of substrings that have equal numbers of consecutive 0s and 1s (like "01", "10", "0011", "1100"). Track group lengths of consecutive characters and count valid substrings at each group boundary.',
        hasVisualization: true,
        tags: ['string', 'two pointers', 'counting', 'groups'],
      },
      {
        id: 'count-number-of-bad-pairs',
        title: 'Count Number of Bad Pairs',
        leetcodeNumber: 2364,
        difficulty: 'Medium' as Difficulty,
        description:
          'A bad pair (i, j) where i < j satisfies j - i != nums[j] - nums[i]. Count all bad pairs. Key insight: rearrange to nums[j] - j != nums[i] - i. Use a hash map to count how many previous indices share the same (nums[i] - i) value. Good pairs minus total gives bad pairs.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'math', 'counting'],
      },
      {
        id: 'custom-sort-string',
        title: 'Custom Sort String',
        leetcodeNumber: 791,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string order and a string s, rearrange the characters of s so that they match the order in which characters appear in order. Characters of s not present in order can appear in any position. Count characters of s, then for each character in order output all occurrences first, then append remaining characters.',
        hasVisualization: true,
        tags: ['string', 'hash map', 'sorting', 'custom comparator'],
      },
      {
        id: 'defanging-ip-address',
        title: 'Defanging an IP Address',
        leetcodeNumber: 1108,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a valid IP address, return a defanged version where every dot "." is replaced with "[.]". This is used in security contexts to prevent accidental clicking on potentially malicious links.',
        hasVisualization: true,
        tags: ['string', 'replace'],
      },
      {
        id: 'destination-city',
        title: 'Destination City',
        leetcodeNumber: 1436,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a list of paths where paths[i] = [cityAi, cityBi], find the destination city: the city with no outgoing path. Store all source cities in a hash set, then iterate over destination cities and return the one not in the source set.',
        hasVisualization: true,
        tags: ['hash map', 'hash set', 'string', 'graph'],
      },
      {
        id: 'detect-capital',
        title: 'Detect Capital',
        leetcodeNumber: 520,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a word, check if its capital usage is correct. Capital usage is correct if: all letters are uppercase, all letters are lowercase, or only the first letter is uppercase. Return true if the capital usage is correct.',
        hasVisualization: true,
        tags: ['string', 'character classification'],
      },
      {
        id: 'equal-row-and-column-pairs',
        title: 'Equal Row and Column Pairs',
        leetcodeNumber: 2352,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count pairs (r, c) where row r equals column c in an n x n matrix. Serialize each row to a string key and store counts in a hash map. Then serialize each column and look up its count in the map. Sum of all column lookups gives the answer.',
        hasVisualization: true,
        tags: ['hash map', 'matrix', 'array'],
      },
      {
        id: 'find-all-anagrams-hash',
        title: 'Find All Anagrams in a String (Hash Map)',
        leetcodeNumber: 438,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find all starting indices of anagram substrings of pattern p in string s. Uses a sliding window with two frequency hash maps: one for p and one for the current window. When both maps match, an anagram is found. Runs in O(n) time.',
        hasVisualization: true,
        tags: ['hash map', 'sliding window', 'string', 'anagram'],
      },
      {
        id: 'find-players-with-zero-or-one-losses',
        title: 'Find Players With Zero or One Losses',
        leetcodeNumber: 2225,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given match results [winner, loser], find players who have never lost (0 losses) and players who have lost exactly once. Use a hash map tracking loss counts for all players. Players with no entry have 0 losses. Then filter and sort both groups.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'sorting'],
      },
      {
        id: 'find-the-difference',
        title: 'Find the Difference',
        leetcodeNumber: 389,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given two strings s and t where t is generated by shuffling s and adding one extra character, find and return the added character. Use a frequency map or XOR approach to identify the extra character.',
        hasVisualization: true,
        tags: ['hash map', 'bit manipulation', 'XOR', 'string'],
      },
      {
        id: 'four-sum-ii',
        title: '4Sum II',
        leetcodeNumber: 454,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given four integer arrays, count tuples (i, j, k, l) such that nums1[i] + nums2[j] + nums3[k] + nums4[l] equals zero. Uses a hash map to store sums of all pairs from the first two arrays, then checks complements from the second two arrays.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'four sum'],
      },
      {
        id: 'fraction-addition-subtraction',
        title: 'Fraction Addition and Subtraction',
        leetcodeNumber: 592,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string representing an expression of fractions, compute the result as a reduced fraction. Parse each fraction token, accumulate using a common denominator (LCM), and reduce the final numerator/denominator using GCD. Tracks each fraction in a list for step-by-step visualization.',
        hasVisualization: true,
        tags: ['hash map', 'math', 'string', 'gcd', 'fraction'],
      },
      {
        id: 'jewels-and-stones',
        title: 'Jewels and Stones',
        leetcodeNumber: 771,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string jewels representing types of jewels and a string stones representing the stones you have, count how many of your stones are also jewels. Each character in jewels is unique. Use a hash set for O(1) lookup.',
        hasVisualization: true,
        tags: ['hash map', 'hash set', 'string', 'counting'],
      },
      {
        id: 'license-key-formatting',
        title: 'License Key Formatting',
        leetcodeNumber: 482,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a license key string s and integer k, reformat the key such that each group contains exactly k characters, except the first group which may be shorter. Groups are separated by dashes and all letters are uppercased.',
        hasVisualization: true,
        tags: ['string', 'simulation'],
      },
      {
        id: 'longest-consecutive-sequence-ii',
        title: 'Longest Consecutive Sequence (Detailed)',
        leetcodeNumber: 128,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the length of the longest consecutive integer sequence in an unsorted array. Uses a hash set for O(1) lookups. For each number that starts a sequence (num-1 not in set), count consecutive numbers forward. Achieves O(n) overall time.',
        hasVisualization: true,
        tags: ['hash map', 'hash set', 'array', 'sequence'],
      },
      {
        id: 'longest-harmonious-subsequence',
        title: 'Longest Harmonious Subsequence',
        leetcodeNumber: 594,
        difficulty: 'Easy' as Difficulty,
        description:
          'A harmonious subsequence has max and min elements differing by exactly 1. Count frequencies of each number in a hash map, then for each number check if num+1 also exists. The harmonious subsequence length is freq[num] + freq[num+1]. Return the maximum such length.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'subsequence'],
      },
      {
        id: 'max-number-of-k-sum-pairs',
        title: 'Max Number of K-Sum Pairs',
        leetcodeNumber: 1679,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array and integer k, repeatedly remove pairs that sum to k. Maximize the number of operations. Use a hash map to count frequencies: for each number, check if its complement (k - num) exists in the map. If so, form a pair and decrement both counts.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'greedy', 'two sum'],
      },
      {
        id: 'minimum-index-sum-of-two-lists',
        title: 'Minimum Index Sum of Two Lists',
        leetcodeNumber: 599,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given two lists of restaurant preferences, find the common interests with the minimum index sum. Store the first list in a hash map (restaurant -> index), then for each item in the second list that is also in the map, compute the index sum and track the minimum.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'string'],
      },
      {
        id: 'most-common-word',
        title: 'Most Common Word',
        leetcodeNumber: 819,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a paragraph of text and a list of banned words, find the most frequently occurring word that is not banned. The answer is guaranteed to exist. Words are case-insensitive and only letters matter.',
        hasVisualization: true,
        tags: ['hash map', 'string', 'counting'],
      },
      {
        id: 'naming-a-company',
        title: 'Naming a Company',
        leetcodeNumber: 2306,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count distinct names formed by swapping the first letters of two ideas. Group ideas by suffix. For each pair of starting letters (a, b), count suffixes that appear in group[a] but not group[b] and vice versa. The contribution is 2 * (count_a_only) * (count_b_only).',
        hasVisualization: true,
        tags: ['hash map', 'hash set', 'string', 'counting'],
      },
      {
        id: 'number-of-atoms',
        title: 'Number of Atoms',
        leetcodeNumber: 726,
        difficulty: 'Hard' as Difficulty,
        description:
          'Parse a chemical formula string and count total atoms. Uses a stack of hash maps: when encountering "(", push a new map; when ")", pop and multiply by the following number, then merge into the top map. Element names and counts are accumulated recursively.',
        hasVisualization: true,
        tags: ['hash map', 'stack', 'string', 'parsing'],
      },
      {
        id: 'number-of-boomerangs',
        title: 'Number of Boomerangs',
        leetcodeNumber: 447,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count boomerang triplets (i, j, k) where distance(i,j) == distance(i,k). For each point as pivot, build a hash map of squared distances to all other points. For each distance d with count c, c*(c-1) ordered pairs (j,k) exist. Sum over all pivots and distances.',
        hasVisualization: true,
        tags: ['hash map', 'geometry', 'math'],
      },
      {
        id: 'relative-sort-array',
        title: 'Relative Sort Array',
        leetcodeNumber: 1122,
        difficulty: 'Easy' as Difficulty,
        description:
          'Sort arr1 such that elements appear in the order defined by arr2. Elements of arr1 not in arr2 appear at the end in ascending order. Use a hash map to record the index of each element in arr2, then sort arr1 with a custom comparator: elements in arr2 sorted by rank, rest sorted numerically.',
        hasVisualization: true,
        tags: ['hash map', 'sorting', 'array', 'custom sort'],
      },
      {
        id: 'repeated-dna-sequences-hash',
        title: 'Repeated DNA Sequences (Rolling Hash)',
        leetcodeNumber: 187,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find all 10-letter-long DNA sequences that appear more than once in a string. Uses a sliding window of length 10 and a hash map to count occurrences of each substring. When a substring is seen a second time, it is added to the result.',
        hasVisualization: true,
        tags: ['hash map', 'sliding window', 'string', 'DNA', 'rolling hash'],
      },
      {
        id: 'repeated-substring-pattern',
        title: 'Repeated Substring Pattern',
        leetcodeNumber: 459,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string s, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together. For example, "abcabc" is made of "abc" repeated twice.',
        hasVisualization: true,
        tags: ['string', 'pattern matching', 'KMP'],
      },
      {
        id: 'reverse-string-ii',
        title: 'Reverse String II',
        leetcodeNumber: 541,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string s and integer k, reverse the first k characters for every 2k characters. If fewer than k characters remain, reverse all. If between k and 2k remain, reverse the first k only.',
        hasVisualization: true,
        tags: ['string', 'two pointers', 'simulation'],
      },
      {
        id: 'robot-return-to-origin',
        title: 'Robot Return to Origin',
        leetcodeNumber: 657,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a sequence of moves for a robot starting at the origin (0,0), determine if the robot returns to the origin after completing all moves. Moves are U (up), D (down), L (left), R (right).',
        hasVisualization: true,
        tags: ['string', 'simulation', 'math'],
      },
      {
        id: 'sort-characters-by-frequency',
        title: 'Sort Characters By Frequency',
        leetcodeNumber: 451,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string, sort it in decreasing order of character frequency. Count each character, then sort character entries by count descending. Build the result by repeating each character by its count. If two characters have the same frequency, either order is acceptable.',
        hasVisualization: true,
        tags: ['hash map', 'sorting', 'string', 'bucket sort'],
      },
      {
        id: 'subarray-sum-equals-k-hash',
        title: 'Subarray Sum Equals K (Hash Map)',
        leetcodeNumber: 560,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of subarrays whose elements sum to k. Uses prefix sums stored in a hash map: for each index, check if (prefixSum - k) exists in the map, meaning a subarray ending here has sum k. Achieves O(n) time complexity.',
        hasVisualization: true,
        tags: ['hash map', 'prefix sum', 'subarray', 'counting'],
      },
      {
        id: 'subdomain-visit-count',
        title: 'Subdomain Visit Count',
        leetcodeNumber: 811,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a list of count-domain pairs, count visits to each subdomain. For each entry, split the domain by dots and accumulate the visit count to every suffix (subdomain level). Store counts in a hash map and return formatted results.',
        hasVisualization: true,
        tags: ['hash map', 'string', 'array'],
      },
      {
        id: 'sum-of-unique-elements',
        title: 'Sum of Unique Elements',
        leetcodeNumber: 1748,
        difficulty: 'Easy' as Difficulty,
        description:
          'Sum all elements that appear exactly once in the array. Build a frequency map of all elements, then iterate and sum only those with frequency equal to 1. Uses a hash map to count occurrences in O(n) time.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'counting'],
      },
      {
        id: 'text-justification',
        title: 'Text Justification',
        leetcodeNumber: 68,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array of words and a max width, format the text so each line has exactly maxWidth characters with fully justified text (except the last line which is left-justified). Extra spaces are distributed as evenly as possible, with extra spaces going to the leftmost slots.',
        hasVisualization: true,
        tags: ['string', 'greedy', 'simulation'],
      },
      {
        id: 'two-sum-ii-hash',
        title: 'Two Sum (Hash Map)',
        leetcodeNumber: 1,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array of integers and a target, return indices of the two numbers that add up to the target. Uses a hash map to store each number and its index, enabling O(1) complement lookup for an overall O(n) solution.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'two sum'],
      },
      {
        id: 'uncommon-words-from-two-sentences',
        title: 'Uncommon Words from Two Sentences',
        leetcodeNumber: 884,
        difficulty: 'Easy' as Difficulty,
        description:
          'A word is uncommon if it appears exactly once across both sentences combined. Split both sentences, combine all words, and count frequencies in a hash map. Return all words with a count of exactly 1.',
        hasVisualization: true,
        tags: ['hash map', 'string', 'counting'],
      },
      {
        id: 'unique-email-addresses',
        title: 'Unique Email Addresses',
        leetcodeNumber: 929,
        difficulty: 'Easy' as Difficulty,
        description:
          'Every email has a local name and domain. In the local name, dots are ignored and everything after a plus sign is ignored. Given a list of emails, return the number of unique addresses that actually receive mail.',
        hasVisualization: true,
        tags: ['hash map', 'hash set', 'string', 'simulation'],
      },
      {
        id: 'unique-number-of-occurrences',
        title: 'Unique Number of Occurrences',
        leetcodeNumber: 1207,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer array, return true if the number of occurrences of each value in the array is unique. Count frequencies with a hash map, then check if the frequency values themselves are all distinct by putting them in a set and comparing sizes.',
        hasVisualization: true,
        tags: ['hash map', 'hash set', 'array', 'counting'],
      },
    
      {
        id: 'check-if-n-and-its-double-exist',
        title: 'Check If N and Its Double Exist',
        leetcodeNumber: 1346,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array arr, check if there exist two indices i != j such that arr[i] == 2 * arr[j]. Use a hash set of seen values; for each element check if element*2 or element/2 (when even) is already in the set.',
        hasVisualization: true,
        tags: ['hash map', 'hash set', 'array', 'two sum variant'],
      },
      {
        id: 'count-largest-group',
        title: 'Count Largest Group',
        leetcodeNumber: 1399,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer n, group numbers from 1 to n by the sum of their digits. Return how many groups have the largest size. Use a hash map from digit-sum to count, then find how many groups match the maximum count.',
        hasVisualization: true,
        tags: ['hash map', 'math', 'string', 'counting'],
      },
      {
        id: 'count-number-of-distinct-integers-after-reverse',
        title: 'Count Distinct Integers After Reversing and Adding',
        leetcodeNumber: 2442,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums, add the reverse of each integer to the array, then count the distinct integers. Use a hash set to collect both originals and their reversed versions, then return the set size.',
        hasVisualization: true,
        tags: ['hash map', 'hash set', 'array', 'math'],
      },
      {
        id: 'count-number-of-pairs-with-absolute-difference-k',
        title: 'Count Number of Pairs With Absolute Difference K',
        leetcodeNumber: 2006,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer array nums and an integer k, return the number of pairs (i, j) where i < j and |nums[i] - nums[j]| == k. Use a hash map to store seen values; for each element check if element+k or element-k has been seen before.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'counting', 'absolute difference'],
      },
      {
        id: 'design-a-leaderboard',
        title: 'Design a Leaderboard',
        leetcodeNumber: 1244,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a leaderboard with three operations: addScore(playerId, score) adds score to player, top(K) returns the sum of top K scores, and reset(playerId) resets a player score to 0. Use a hash map from playerId to score, and sort for top K queries.',
        hasVisualization: true,
        tags: ['hash map', 'design', 'sorting', 'heap'],
      },
      {
        id: 'distribute-candies',
        title: 'Distribute Candies',
        leetcodeNumber: 575,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array of candy types, Alice can eat n/2 candies (half the total). Return the maximum number of different candy types she can eat. Use a hash set to count unique candy types, then the answer is min(uniqueTypes, n/2).',
        hasVisualization: true,
        tags: ['hash map', 'hash set', 'array', 'greedy'],
      },
      {
        id: 'find-common-characters',
        title: 'Find Common Characters',
        leetcodeNumber: 1002,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string array words, return an array of all characters that show up in all strings including duplicates. Use a frequency map for each word and take the element-wise minimum across all words. Each character in the result appears min-frequency times.',
        hasVisualization: true,
        tags: ['hash map', 'string', 'array', 'frequency'],
      },
      {
        id: 'find-words-that-can-be-formed',
        title: 'Find Words That Can Be Formed by Characters',
        leetcodeNumber: 1160,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array of strings words and a string chars, return the sum of lengths of all words in words that can be formed by characters from chars (each character used at most once per character count in chars). Build a frequency map of chars, then check each word against it.',
        hasVisualization: true,
        tags: ['hash map', 'string', 'array', 'frequency'],
      },
      {
        id: 'first-unique-character-ii',
        title: 'First Unique Character in a String',
        leetcodeNumber: 387,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string s, find the first non-repeating character and return its index. If it does not exist, return -1. Use a frequency map to count occurrences, then scan left to right for the first character with count 1.',
        hasVisualization: true,
        tags: ['hash map', 'string', 'frequency', 'array'],
      },
      {
        id: 'flip-columns-for-maximum-rows',
        title: 'Flip Columns For Maximum Number of Equal Rows',
        leetcodeNumber: 1072,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary matrix, you can flip any set of columns. Count the maximum number of rows that can have all equal values after some column flip. Two rows are equivalent if one is the bitwise complement of the other. Encode each row as a canonical pattern and count the most frequent pattern.',
        hasVisualization: true,
        tags: ['hash map', 'matrix', 'array', 'pattern matching'],
      },
      {
        id: 'group-the-people',
        title: 'Group the People Given the Group Size They Belong To',
        leetcodeNumber: 1282,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array groupSizes where groupSizes[i] is the required group size for person i, assign every person to exactly one group. Use a hash map from group size to list of pending people; whenever a list reaches the required size, flush it as a complete group.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'greedy'],
      },
      {
        id: 'integer-to-english-words',
        title: 'Integer to English Words',
        leetcodeNumber: 273,
        difficulty: 'Hard' as Difficulty,
        description:
          'Convert a non-negative integer to its English words representation. Map digits and teen words using lookup tables (hash maps), then recursively process groups of three digits (thousands, millions, billions) to build the final string.',
        hasVisualization: true,
        tags: ['hash map', 'string', 'math', 'recursion'],
      },
      {
        id: 'largest-unique-number',
        title: 'Largest Unique Number',
        leetcodeNumber: 1133,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer array A, return the largest integer that only occurs once. If no integer occurs once, return -1. Build a frequency map, then scan for the largest value with frequency exactly 1.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'frequency', 'sorting'],
      },
      {
        id: 'max-number-of-k-sum-pairs-hash',
        title: 'Max Number of K-Sum Pairs (Hash Map)',
        leetcodeNumber: 1679,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums and an integer k, find the maximum number of pairs (i, j) where i != j and nums[i] + nums[j] == k. Each element can only be used once. Use a frequency hash map: for each element, check if complement (k - element) exists, and if so, form a pair and decrement both counts.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'two sum', 'greedy'],
      },
      {
        id: 'maximum-equal-frequency',
        title: 'Maximum Equal Frequency',
        leetcodeNumber: 1224,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array nums, find the maximum length prefix of nums such that after deleting exactly one element, every remaining element appears the same number of times. Use two frequency maps: count[v] tracks how many times value v appears, and freq[c] tracks how many values appear exactly c times.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'frequency', 'prefix'],
      },
      {
        id: 'most-frequent-even-element',
        title: 'Most Frequent Even Element',
        leetcodeNumber: 2404,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer array nums, return the most frequent even element. If there is a tie, return the smallest one. If there are no even elements, return -1. Build a frequency map of even numbers only, then find the maximum frequency, choosing the smallest value on ties.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'frequency', 'sorting'],
      },
      {
        id: 'n-repeated-element',
        title: 'N-Repeated Element in Size 2N Array',
        leetcodeNumber: 961,
        difficulty: 'Easy' as Difficulty,
        description:
          'In a size 2N array, exactly one element is repeated N times and all other elements are distinct. Use a hash set to detect the first duplicate element seen during iteration, which must be the N-repeated element.',
        hasVisualization: true,
        tags: ['hash map', 'hash set', 'array', 'frequency'],
      },
      {
        id: 'number-of-equivalent-domino-pairs',
        title: 'Number of Equivalent Domino Pairs',
        leetcodeNumber: 1128,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a list of dominoes, a domino [a, b] is equivalent to [b, a]. Count the number of pairs (i, j) where i < j and domino i is equivalent to domino j. Normalize each domino so the smaller value comes first, then use a frequency map to count pairs.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'counting', 'math'],
      },
      {
        id: 'number-of-good-pairs',
        title: 'Number of Good Pairs',
        leetcodeNumber: 1512,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array nums, return the number of good pairs (i, j) where nums[i] == nums[j] and i < j. For each new element, the number of new good pairs equals how many times this element has been seen before. Track frequencies with a hash map.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'counting', 'math'],
      },
      {
        id: 'pairs-of-songs-with-total-divisible-by-60',
        title: 'Pairs of Songs With Total Durations Divisible by 60',
        leetcodeNumber: 1010,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a list of song durations, count pairs (i, j) where i < j and (time[i] + time[j]) % 60 == 0. This is analogous to Two Sum: for each song with remainder r = time[i] % 60, look for previously seen songs with remainder (60 - r) % 60.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'counting', 'two sum variant'],
      },
      {
        id: 'random-pick-index',
        title: 'Random Pick Index',
        leetcodeNumber: 398,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array with possible duplicates, randomly output the index of a given target number. Use reservoir sampling so that each valid index is equally likely to be chosen. The hash map variant pre-indexes all positions for O(1) picks.',
        hasVisualization: true,
        tags: ['hash map', 'reservoir sampling', 'random', 'array'],
      },
      {
        id: 'shortest-word-distance-iv',
        title: 'Shortest Word Distance',
        leetcodeNumber: 243,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array of strings wordsDict and two words word1 and word2, return the shortest distance between them in the list. Build a hash map from word to list of indices, then find the minimum difference between any index in word1 list and any index in word2 list using two-pointer merge.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'string', 'two pointers'],
      },
      {
        id: 'sum-of-unique-elements-ii',
        title: 'Sum of Unique Elements',
        leetcodeNumber: 1748,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer array nums, return the sum of all the unique elements of nums (elements that appear exactly once). Build a frequency map, then sum only the elements with a count of 1.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'frequency', 'sum'],
      },
      {
        id: 'tuple-with-same-product',
        title: 'Tuple with Same Product',
        leetcodeNumber: 1726,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array nums of distinct positive integers, count tuples (a, b, c, d) such that a * b == c * d where a, b, c, d are elements from nums and a != b != c != d. For every pair (i, j), store their product in a map. Each time a product is seen k times before, it contributes k * 8 new tuples.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'counting', 'math'],
      },
      {
        id: 'verifying-alien-dictionary',
        title: 'Verifying an Alien Dictionary',
        leetcodeNumber: 953,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a list of words sorted in an alien language order and a string order representing the alien alphabet, return true if the words are sorted lexicographically according to the alien order. Map each character to its rank, then compare adjacent words character by character.',
        hasVisualization: true,
        tags: ['hash map', 'string', 'array', 'sorting'],
      },
    
      {
        id: 'design-a-number-container-system',
        title: 'Design a Number Container System',
        leetcodeNumber: 2349,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a number container system that can insert or replace a number at an index, and find the smallest index for a given number. Use two hash maps: one from index to number, and one from number to sorted set of indices.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Heap', 'Ordered Set'],
      },
      {
        id: 'design-a-stack-with-increment',
        title: 'Design a Stack With Increment Operation',
        leetcodeNumber: 1381,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a stack that supports push, pop, and increment operations. The increment(k, val) operation increments the bottom k elements by val. Use a lazy increment array for O(1) increment.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Stack', 'Array'],
      },
      {
        id: 'design-circular-deque-ii',
        title: 'Design Circular Deque',
        leetcodeNumber: 641,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a circular double-ended queue (deque). Implement insertFront, insertLast, deleteFront, deleteLast, getFront, getRear, isEmpty, and isFull operations, all in O(1) time.',
        hasVisualization: true,
        tags: ['Queue', 'Design', 'Array', 'Deque'],
      },
      {
        id: 'design-circular-queue-ii',
        title: 'Design Circular Queue',
        leetcodeNumber: 622,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a circular queue data structure. A circular queue is a linear data structure where the operations are performed based on FIFO principle and the last position is connected back to the first position. Implement enQueue, deQueue, Front, Rear, isEmpty, and isFull.',
        hasVisualization: true,
        tags: ['Queue', 'Design', 'Array'],
      },
      {
        id: 'design-compressed-string-iterator',
        title: 'Design Compressed String Iterator',
        leetcodeNumber: 604,
        difficulty: 'Easy' as Difficulty,
        description:
          'Design a StringIterator for a compressed string like ',
        hasVisualization: true,
        tags: ['Design', 'String', 'Iterator'],
      },
      {
        id: 'design-front-middle-back-queue-ii',
        title: 'Design Front Middle Back Queue',
        leetcodeNumber: 1670,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a queue that supports push and pop operations from front, middle, and back. The middle is defined as floor(size/2) (0-indexed). Use two deques of roughly equal size to maintain O(1) or O(n/2) complexity.',
        hasVisualization: true,
        tags: ['Queue', 'Design', 'Deque', 'Two Pointers'],
      },
      {
        id: 'design-hashmap-ii',
        title: 'Design HashMap',
        leetcodeNumber: 706,
        difficulty: 'Easy' as Difficulty,
        description:
          'Design a HashMap without using any built-in hash table libraries. Implement put, get, and remove operations. Use an array of buckets with chaining to handle collisions.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Array'],
      },
      {
        id: 'design-hashset-ii',
        title: 'Design HashSet',
        leetcodeNumber: 705,
        difficulty: 'Easy' as Difficulty,
        description:
          'Design a HashSet without using any built-in hash set libraries. Implement add, remove, and contains operations. Use an array of buckets with chaining for collision handling.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Array'],
      },
      {
        id: 'design-hit-counter-ii',
        title: 'Design Hit Counter',
        leetcodeNumber: 362,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a hit counter which counts the number of hits received in the past 5 minutes (300 seconds). Implement hit(timestamp) and getHits(timestamp). Each timestamp is in seconds granularity.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Queue'],
      },
      {
        id: 'design-linked-list-ii',
        title: 'Design Linked List',
        leetcodeNumber: 707,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design your own linked list. Support get(index), addAtHead(val), addAtTail(val), addAtIndex(index, val), and deleteAtIndex(index). The linked list is 0-indexed.',
        hasVisualization: true,
        tags: ['Linked List', 'Design'],
      },
      {
        id: 'design-parking-system-ii',
        title: 'Design Parking System',
        leetcodeNumber: 1603,
        difficulty: 'Easy' as Difficulty,
        description:
          'Design a parking system for a parking lot with three kinds of parking spaces: big, medium, and small. Each has a fixed number of slots. Implement addCar(carType) which returns true if there is a space and false otherwise.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Simulation'],
      },
      {
        id: 'design-phone-directory',
        title: 'Design Phone Directory',
        leetcodeNumber: 379,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a Phone Directory which supports operations to get an available number, check if a number is available, and release a number. Use a set to track available numbers for O(1) operations.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Queue'],
      },
      {
        id: 'design-snake-game',
        title: 'Design Snake Game',
        leetcodeNumber: 353,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a Snake game on an m x n grid. The snake starts at (0,0) with length 1. Food appears at specific positions. Move the snake in U/D/L/R directions. Return score (foods eaten) or -1 if game over.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Queue', 'Simulation'],
      },
      {
        id: 'design-tic-tac-toe-ii',
        title: 'Design Tic-Tac-Toe',
        leetcodeNumber: 348,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a Tic-Tac-Toe game. Players alternate placing pieces on an n x n board. A player wins when they fill an entire row, column, or diagonal. Use row/column/diagonal counters for O(1) win check.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Array', 'Matrix'],
      },
      {
        id: 'design-twitter-ii',
        title: 'Design Twitter',
        leetcodeNumber: 355,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a simplified version of Twitter. Users can post tweets, follow/unfollow others, and retrieve the 10 most recent tweet IDs from their news feed (own tweets + followed users tweets).',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Heap'],
      },
      {
        id: 'design-underground-system-ii',
        title: 'Design Underground System',
        leetcodeNumber: 1396,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a system for the London Underground to track passenger check-ins and check-outs. Calculate the average travel time between any two stations using two hash maps: one for active passengers and one for route statistics.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'String'],
      },
      {
        id: 'exam-room',
        title: 'Exam Room',
        leetcodeNumber: 855,
        difficulty: 'Medium' as Difficulty,
        description:
          'Students take a seat to maximize the distance to the nearest person. seat() returns the seat that maximizes min distance. leave(p) makes seat p available. Use a sorted set of occupied seats to efficiently find the best seat.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Sorted Set', 'Ordered Set'],
      },
      {
        id: 'flatten-2d-vector-ii',
        title: 'Flatten 2D Vector II',
        leetcodeNumber: 251,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design an iterator to flatten a 2D vector. Use an outer index for the row and an inner index for the column. hasNext() advances past empty rows. next() returns the current element and advances. O(1) amortized per call.',
        hasVisualization: true,
        tags: ['Design', 'Iterator', 'Array', 'Two Pointers'],
      },
      {
        id: 'insert-delete-getrandom-ii',
        title: 'Insert Delete GetRandom O(1) - Duplicates allowed',
        leetcodeNumber: 381,
        difficulty: 'Hard' as Difficulty,
        description:
          'Design a data structure that supports insert, remove, and getRandom in O(1) average time, with duplicates allowed. Use an array for O(1) random access and a hash map from value to set of indices for O(1) lookup and removal.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Array', 'Random'],
      },
      {
        id: 'iterator-for-combination',
        title: 'Iterator for Combination',
        leetcodeNumber: 1286,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a CombinationIterator that generates all length-k combinations from a sorted character string in lexicographic order. Pre-generate all combinations using backtracking, store in a list, and iterate through them. O(C(n,k)) space and time for initialization.',
        hasVisualization: true,
        tags: ['Design', 'Iterator', 'Backtracking', 'String'],
      },
      {
        id: 'logger-rate-limiter-ii',
        title: 'Logger Rate Limiter II',
        leetcodeNumber: 359,
        difficulty: 'Easy' as Difficulty,
        description:
          'Design a logger that limits duplicate messages to once every 10 seconds. shouldPrintMessage(timestamp, message) returns true only if the message has not been printed in the past 10 seconds. Use a hash map to store the last print time for each message. O(1) per call.',
        hasVisualization: true,
        tags: ['Design', 'Hash Map'],
      },
      {
        id: 'moving-average-from-data-stream-ii',
        title: 'Moving Average from Data Stream II',
        leetcodeNumber: 346,
        difficulty: 'Easy' as Difficulty,
        description:
          'Design a MovingAverage class to compute the moving average of a stream of integers in a sliding window of size k. Use a fixed-size circular buffer (queue). When buffer is full, remove the oldest value before adding the new one. O(1) per insertion.',
        hasVisualization: true,
        tags: ['Design', 'Queue', 'Sliding Window', 'Array'],
      },
      {
        id: 'number-of-recent-calls-ii',
        title: 'Number of Recent Calls II',
        leetcodeNumber: 933,
        difficulty: 'Easy' as Difficulty,
        description:
          'Design a RecentCounter that counts recent requests in the past 3000ms. Each ping(t) adds a request at time t and returns the count of requests in [t-3000, t]. Use a queue: add t, then remove all timestamps older than t-3000. O(1) amortized per call.',
        hasVisualization: true,
        tags: ['Design', 'Queue', 'Sliding Window'],
      },
      {
        id: 'online-stock-span-design',
        title: 'Online Stock Span',
        leetcodeNumber: 901,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design an algorithm to collect daily price quotes and return the span (number of consecutive days the price was <= today, including today). Use a monotonic decreasing stack of (price, span) pairs for O(1) amortized time.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Stack', 'Monotonic Stack'],
      },
      {
        id: 'peeking-iterator-ii',
        title: 'Peeking Iterator II',
        leetcodeNumber: 284,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design an iterator that supports peek() in addition to next() and hasNext(). Cache the next value by calling next() eagerly. peek() returns the cached value without advancing. next() returns cached and fetches the next one. O(1) per operation.',
        hasVisualization: true,
        tags: ['Design', 'Iterator', 'Array'],
      },
      {
        id: 'random-pick-with-weight-ii',
        title: 'Random Pick with Weight',
        leetcodeNumber: 528,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of weights, implement pickIndex() to randomly pick an index with probability proportional to its weight. Build a prefix sum array and use binary search to find the target index in O(log n).',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Binary Search', 'Prefix Sum', 'Random'],
      },
      {
        id: 'rle-iterator-ii',
        title: 'RLE Iterator II',
        leetcodeNumber: 900,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design an RLE (Run Length Encoded) iterator. Input is an encoding where encoding[2i]=count and encoding[2i+1]=value. next(n) exhausts the next n elements and returns the last element, or -1 if none remain. Use a pointer and decrement counts. O(n/total) per call.',
        hasVisualization: true,
        tags: ['Design', 'Iterator', 'Array'],
      },
      {
        id: 'snapshot-array-ii',
        title: 'Snapshot Array',
        leetcodeNumber: 1146,
        difficulty: 'Medium' as Difficulty,
        description:
          'Implement a SnapshotArray that supports set(index, val), snap() which takes a snapshot and returns a snap_id, and get(index, snap_id) which returns the value at index at the time of the snapshot with that id. Use copy-on-write with sorted snap IDs per index.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Binary Search', 'Array'],
      },
      {
        id: 'stock-price-design',
        title: 'Stock Price Fluctuation',
        leetcodeNumber: 2034,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a class to track stock prices at different timestamps. Support update(timestamp, price), current(), maximum(), and minimum(). Use a hash map for timestamps and a sorted structure for min/max queries.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Heap', 'Sorted Set'],
      },
      {
        id: 'string-iterator',
        title: 'String Iterator',
        difficulty: 'Easy' as Difficulty,
        description:
          'Design a basic string iterator that supports next() to return the next character and hasNext() to check if more characters remain. Uses a single index pointer. O(1) per operation, O(n) space for the string.',
        hasVisualization: true,
        tags: ['Design', 'Iterator', 'String'],
      },
      {
        id: 'time-based-key-value-store-ii',
        title: 'Time Based Key-Value Store',
        leetcodeNumber: 981,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a time-based key-value store. Implement set(key, value, timestamp) and get(key, timestamp). get returns the value with the largest timestamp <= given timestamp for that key, or empty string if none exists.',
        hasVisualization: true,
        tags: ['Hash Map', 'Design', 'Binary Search', 'String'],
      },
      {
        id: 'zigzag-iterator-ii',
        title: 'Zigzag Iterator II',
        leetcodeNumber: 281,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a ZigzagIterator that interleaves elements from two lists alternately. Uses two pointers and a flag to track which list to draw from next. next() returns alternate elements from v1 and v2 until one is exhausted, then continues from the remaining list. O(1) per call.',
        hasVisualization: true,
        tags: ['Design', 'Iterator', 'Array', 'Two Pointers'],
      },
    ],
  },

  // ─── 03. Linked Lists ──────────────────────────────────────────────
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    icon: '⟶',
    color: 'text-violet-400',
    gradient: 'from-violet-500/20 to-violet-600/10',
    borderColor: 'border-violet-500/30',
    problems: [
      {
        id: 'linked-list-reversal',
        title: 'Linked List Reversal',
        difficulty: 'Easy',
        leetcodeNumber: 206,
        description:
          'Reverse a singly linked list by iteratively re-pointing each node to its predecessor.',
        hasVisualization: true,
        tags: ['linked-list', 'in-place'],
      },
      {
        id: 'remove-kth-last-node',
        title: 'Remove Kth Last Node',
        difficulty: 'Medium',
        leetcodeNumber: 19,
        description:
          'Remove the kth node from the end of a linked list using a two-pointer gap technique.',
        hasVisualization: true,
        tags: ['linked-list', 'two-pointers'],
      },
      {
        id: 'linked-list-intersection',
        title: 'Linked List Intersection',
        difficulty: 'Easy',
        leetcodeNumber: 160,
        description:
          'Find the node where two singly linked lists intersect by aligning their traversal lengths.',
        hasVisualization: true,
        tags: ['linked-list', 'two-pointers'],
      },
      {
        id: 'lru-cache',
        title: 'LRU Cache',
        difficulty: 'Medium',
        leetcodeNumber: 146,
        description:
          'Design a data structure that supports get and put operations in O(1) using a hash map and doubly linked list.',
        hasVisualization: true,
        tags: ['linked-list', 'hash-map', 'design'],
      },
      {
        id: 'palindromic-linked-list',
        title: 'Palindromic Linked List',
        difficulty: 'Easy',
        leetcodeNumber: 234,
        description:
          'Determine whether a singly linked list is a palindrome using O(1) extra space.',
        hasVisualization: true,
        tags: ['linked-list', 'two-pointers', 'palindrome'],
      },
      {
        id: 'flatten-multi-level-linked-list',
        title: 'Flatten Multi-Level Linked List',
        difficulty: 'Medium',
        leetcodeNumber: 430,
        description:
          'Flatten a doubly linked list where nodes may have child sublists into a single-level list.',
        hasVisualization: true,
        tags: ['linked-list', 'recursion', 'dfs'],
      },
      {
        id: 'add-two-numbers',
        title: 'Add Two Numbers',
        difficulty: 'Medium',
        leetcodeNumber: 2,
        description:
          'Two non-empty linked lists represent two non-negative integers in reverse order. Add the two numbers and return the sum as a linked list. Iterate both lists simultaneously, carrying over when the sum >= 10.',
        hasVisualization: true,
        tags: ['linked-list', 'math', 'carry', 'simulation'],
      },
      {
        id: 'copy-list-with-random-pointer',
        title: 'Copy List with Random Pointer',
        difficulty: 'Medium',
        leetcodeNumber: 138,
        description:
          'Deep copy a linked list where each node has a next pointer and a random pointer. Uses a hash map to map original nodes to their copies, then sets next and random pointers in a second pass.',
        hasVisualization: true,
        tags: ['linked-list', 'hash-map', 'deep-copy', 'two-pass'],
      },
      {
        id: 'delete-node-in-linked-list',
        title: 'Delete Node in a Linked List',
        difficulty: 'Medium',
        leetcodeNumber: 237,
        description:
          'Delete a node in a singly linked list given only access to that node (not the head). The trick: copy the next node\'s value into the current node, then skip the next node.',
        hasVisualization: true,
        tags: ['linked-list', 'trick', 'value-copy'],
      },
      {
        id: 'lfu-cache',
        title: 'LFU Cache',
        difficulty: 'Hard',
        leetcodeNumber: 460,
        description:
          'Least Frequently Used (LFU) Cache: evict the item with the lowest access frequency. Ties broken by least recent use (LRU among equals). Implemented with a key-value map, a key-frequency map, and a frequency-to-keys map (ordered by insertion). Track minimum frequency for O(1) eviction.',
        hasVisualization: true,
        tags: ['linked-list', 'hash-map', 'design'],
      },
      {
        id: 'merge-two-sorted-lists',
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        leetcodeNumber: 21,
        description:
          'Merge two sorted linked lists and return the merged list (sorted). Uses a dummy head node and a current pointer that appends the smaller of the two heads at each step.',
        hasVisualization: true,
        tags: ['linked-list', 'merge', 'two-pointers', 'sorting'],
      },
      {
        id: 'odd-even-linked-list',
        title: 'Odd Even Linked List',
        difficulty: 'Medium',
        leetcodeNumber: 328,
        description:
          'Regroup a linked list so all odd-indexed nodes come before even-indexed nodes (1-indexed). Uses two pointers: one for odd chain, one for even chain. Reconnect at the end.',
        hasVisualization: true,
        tags: ['linked-list', 'two-pointers', 'in-place', 'regrouping'],
      },
      {
        id: 'partition-list',
        title: 'Partition List',
        difficulty: 'Medium',
        leetcodeNumber: 86,
        description:
          'Given a linked list and a value x, partition the list so all nodes with values less than x come before nodes with values >= x. Maintain the original relative order within each partition.',
        hasVisualization: true,
        tags: ['linked-list', 'two-pointers', 'partition', 'stable-sort'],
      },
      {
        id: 'reverse-linked-list-ii',
        title: 'Reverse Linked List II',
        difficulty: 'Medium',
        leetcodeNumber: 92,
        description:
          'Reverse the nodes of a linked list from position left to position right in one pass. Uses a dummy head and pointer manipulation to extract the sublist, reverse it, and reconnect it.',
        hasVisualization: true,
        tags: ['linked-list', 'pointer-manipulation', 'in-place', 'partial-reverse'],
      },
      {
        id: 'reverse-nodes-in-k-group',
        title: 'Reverse Nodes in k-Group',
        difficulty: 'Hard',
        leetcodeNumber: 25,
        description:
          'Given a linked list, reverse nodes in groups of k. If the remaining nodes are fewer than k, leave them as-is. Uses a dummy head and a helper to check if k nodes remain before reversing each group.',
        hasVisualization: true,
        tags: ['linked-list', 'recursion', 'pointer-manipulation', 'hard'],
      },
      {
        id: 'rotate-list',
        title: 'Rotate List',
        difficulty: 'Medium',
        leetcodeNumber: 61,
        description:
          'Given a linked list, rotate the list to the right by k places. The key insight: after k rotations, the new head is at position (n - k % n). Form a circular list then break it at the right point.',
        hasVisualization: true,
        tags: ['linked-list', 'two-pointers', 'modular-arithmetic'],
      },
      {
        id: 'swap-nodes-in-pairs',
        title: 'Swap Nodes in Pairs',
        difficulty: 'Medium',
        leetcodeNumber: 24,
        description:
          'Given a linked list, swap every two adjacent nodes and return the head. Uses a dummy node and three pointers (prev, first, second) to rewire pairs without modifying node values.',
        hasVisualization: true,
        tags: ['linked-list', 'pointer-manipulation', 'dummy-node'],
      },
    
      {
        id: 'add-two-numbers-ii',
        title: 'Add Two Numbers II',
        leetcodeNumber: 445,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two non-empty linked lists representing two non-negative integers where digits are stored in most-significant-first order, add the two numbers and return the sum as a linked list. Use two stacks to reverse the order of digits, then add from least significant to most significant, carrying over as needed.',
        hasVisualization: true,
        tags: ['linked list', 'stack', 'math', 'carry'],
      },
      {
        id: 'all-o-one-data-structure',
        title: 'All O(1) Data Structure',
        leetcodeNumber: 432,
        difficulty: 'Hard' as Difficulty,
        description:
          'Design a data structure supporting inc(key), dec(key), getMaxKey(), and getMinKey() all in O(1). Use a doubly linked list of buckets sorted by count, combined with two hash maps: one from key to count, one from count to a bucket node. Each bucket stores all keys with the same count.',
        hasVisualization: true,
        tags: ['linked list', 'doubly linked list', 'hash map', 'design', 'O(1)'],
      },
      {
        id: 'convert-binary-number-in-linked-list',
        title: 'Convert Binary Number in a Linked List to Integer',
        leetcodeNumber: 1290,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given head of a linked list where each node contains a binary digit (0 or 1), return the decimal value of the binary number the list represents. Traverse from head to tail: for each bit, shift the current result left by 1 (multiply by 2) and add the current bit.',
        hasVisualization: true,
        tags: ['linked list', 'bit manipulation', 'math'],
      },
      {
        id: 'design-browser-history',
        title: 'Design Browser History',
        leetcodeNumber: 1472,
        difficulty: 'Medium' as Difficulty,
        description:
          'Implement a browser history with visit(url), back(steps), and forward(steps) operations. Use a doubly linked list where each node stores a URL and has prev/next pointers. The current pointer tracks the active page. back() moves current backward, forward() moves it forward, visit() creates a new node after current and discards forward history.',
        hasVisualization: true,
        tags: ['linked list', 'doubly linked list', 'design'],
      },
      {
        id: 'design-linked-list',
        title: 'Design Linked List',
        leetcodeNumber: 707,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a singly linked list with get(index), addAtHead(val), addAtTail(val), addAtIndex(index, val), and deleteAtIndex(index) operations. Use a dummy head node to simplify edge cases. Track the size to validate index bounds. Each operation traverses to the target position using a pointer.',
        hasVisualization: true,
        tags: ['linked list', 'design', 'data structure'],
      },
      {
        id: 'flatten-nested-list-iterator',
        title: 'Flatten Nested List Iterator',
        leetcodeNumber: 341,
        difficulty: 'Medium' as Difficulty,
        description:
          'Implement an iterator that flattens a nested list of integers. Each element is either an integer or a list containing integers or other lists. Use a stack initialized with the nested list in reverse order. hasNext() flattens the top of the stack until an integer is found. next() pops and returns that integer.',
        hasVisualization: true,
        tags: ['linked list', 'stack', 'design', 'iterator'],
      },
      {
        id: 'insertion-sort-list',
        title: 'Insertion Sort List',
        leetcodeNumber: 147,
        difficulty: 'Medium' as Difficulty,
        description:
          'Sort a linked list using insertion sort. Take each node from the unsorted portion and insert it into the correct position in the sorted portion. Use a dummy head to simplify insertion at the beginning. Time complexity O(n^2), space O(1).',
        hasVisualization: true,
        tags: ['linked list', 'sorting', 'insertion sort'],
      },
      {
        id: 'linked-list-components',
        title: 'Linked List Components',
        leetcodeNumber: 817,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a linked list and an array nums representing a subset of node values, return the number of connected components in nums. A connected component is a maximal consecutive sub-sequence of nodes in the list that are all in nums. Use a set for O(1) lookup: traverse the list and count runs of consecutive nodes in the subset.',
        hasVisualization: true,
        tags: ['linked list', 'hash set', 'connected components'],
      },
      {
        id: 'linked-list-cycle-ii',
        title: 'Linked List Cycle II',
        leetcodeNumber: 142,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null. Use Floyd cycle detection: first find the meeting point of slow and fast pointers, then reset one pointer to head and advance both one step at a time to find the cycle entry node.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'floyd cycle detection', 'fast and slow pointers'],
      },
      {
        id: 'linked-list-random-node',
        title: 'Linked List Random Node',
        leetcodeNumber: 382,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a singly linked list, return a random node value such that each node is equally likely to be chosen. Use reservoir sampling: traverse each node i (1-indexed) and with probability 1/i replace the chosen node with the current node. This gives uniform probability without knowing the list length in advance.',
        hasVisualization: true,
        tags: ['linked list', 'reservoir sampling', 'randomized', 'math'],
      },
      {
        id: 'lru-cache-ii',
        title: 'LRU Cache (Ordered Map Approach)',
        leetcodeNumber: 146,
        difficulty: 'Medium' as Difficulty,
        description:
          'Implement a Least Recently Used (LRU) cache with get(key) and put(key, value) in O(1). Use a doubly linked list to maintain usage order (most recent at tail, least recent at head) combined with a hash map for O(1) key lookup. On get or put, move the accessed node to the tail. On capacity overflow, evict the head node.',
        hasVisualization: true,
        tags: ['linked list', 'doubly linked list', 'hash map', 'design', 'LRU'],
      },
      {
        id: 'maximum-twin-sum-of-linked-list',
        title: 'Maximum Twin Sum of a Linked List',
        leetcodeNumber: 2130,
        difficulty: 'Medium' as Difficulty,
        description:
          'In a linked list of even length n, the twin of the ith node (0-indexed) is the (n-1-i)th node. The twin sum is the sum of a node and its twin. Find the maximum twin sum. Use slow/fast pointers to find the middle, reverse the second half, then pair up nodes from both halves.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'reverse'],
      },
      {
        id: 'merge-in-between-linked-lists',
        title: 'Merge In Between Linked Lists',
        leetcodeNumber: 1669,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two linked lists list1 and list2, and integers a and b, remove nodes from list1 from index a to index b (inclusive), and put list2 in their place. Find node at index a-1 (nodeA) and node at index b+1 (nodeB), then connect nodeA to list2 head and list2 tail to nodeB.',
        hasVisualization: true,
        tags: ['linked list', 'pointer manipulation'],
      },
      {
        id: 'merge-k-sorted-lists-divide-conquer',
        title: 'Merge K Sorted Lists (Divide and Conquer)',
        leetcodeNumber: 23,
        difficulty: 'Hard' as Difficulty,
        description:
          'Merge k sorted linked lists into one sorted linked list using divide and conquer. Repeatedly pair up and merge adjacent lists until only one remains. This reduces the problem from O(kN) to O(N log k) time. Each merge of two sorted lists takes O(n) using the two-pointer technique.',
        hasVisualization: true,
        tags: ['linked list', 'divide and conquer', 'merge sort', 'sorting'],
      },
      {
        id: 'middle-of-linked-list',
        title: 'Middle of the Linked List',
        leetcodeNumber: 876,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the head of a singly linked list, return the middle node. If there are two middle nodes (even length), return the second one. Use the fast and slow pointer technique: slow moves one step, fast moves two steps. When fast reaches the end, slow is at the middle.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'fast and slow pointers'],
      },
      {
        id: 'next-greater-node-in-linked-list',
        title: 'Next Greater Node In Linked List',
        leetcodeNumber: 1019,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a linked list, return an array of the next greater value for each node. For each node, the next greater value is the first node to the right with a strictly larger value. If no such node exists, output 0. Use a monotonic decreasing stack to solve in O(n).',
        hasVisualization: true,
        tags: ['linked list', 'stack', 'monotonic stack'],
      },
      {
        id: 'remove-duplicates-from-sorted-list-ii',
        title: 'Remove Duplicates from Sorted List II',
        leetcodeNumber: 82,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers from the original list. Use a dummy head and a prev pointer. When duplicates are found, skip all nodes with that value entirely.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'sorted', 'dummy node'],
      },
      {
        id: 'remove-duplicates-from-sorted-list',
        title: 'Remove Duplicates from Sorted List',
        leetcodeNumber: 83,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the head of a sorted linked list, delete all duplicates such that each element appears only once. Since the list is sorted, duplicates are always adjacent. Traverse with a single pointer and skip nodes whose value equals the next node value.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'sorted'],
      },
      {
        id: 'remove-linked-list-elements',
        title: 'Remove Linked List Elements',
        leetcodeNumber: 203,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the head of a linked list and an integer val, remove all nodes whose value equals val, then return the new head. Use a dummy node before the head to handle edge cases where the head itself needs to be removed. Traverse with a prev pointer and skip nodes that match the target value.',
        hasVisualization: true,
        tags: ['linked list', 'dummy node', 'traversal'],
      },
      {
        id: 'remove-nth-node-from-end-of-list',
        title: 'Remove Nth Node From End of List',
        leetcodeNumber: 19,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a linked list, remove the nth node from the end of the list and return its head. Two-pass approach: first count the total length, then traverse to position (length - n) and remove that node. A dummy node handles edge cases where the head is removed.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'dummy node'],
      },
      {
        id: 'remove-zero-sum-consecutive-nodes',
        title: 'Remove Zero Sum Consecutive Nodes from Linked List',
        leetcodeNumber: 1171,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a linked list, repeatedly delete consecutive sequences of nodes that sum to 0 until no such sequence exists. Use prefix sums: traverse the list tracking cumulative sums. When the same prefix sum is seen again, the nodes in between sum to zero and should be removed.',
        hasVisualization: true,
        tags: ['linked list', 'prefix sum', 'hash map'],
      },
      {
        id: 'reorder-list',
        title: 'Reorder List',
        leetcodeNumber: 143,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a singly linked list L0->L1->...->Ln, reorder it to L0->Ln->L1->Ln-1->... Three steps: find the middle using slow/fast pointers, reverse the second half, then merge the two halves by interleaving nodes.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'reverse', 'merge'],
      },
      {
        id: 'reverse-nodes-in-even-length-groups',
        title: 'Reverse Nodes in Even Length Groups',
        leetcodeNumber: 2074,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a linked list, the nodes are consecutively grouped into groups with lengths 1, 2, 3, 4, ... The last group may be shorter. Reverse the nodes in each group that has an even number of nodes. Traverse group by group, count actual nodes in each group, and reverse that group if its actual size is even.',
        hasVisualization: true,
        tags: ['linked list', 'reverse', 'grouping', 'simulation'],
      },
      {
        id: 'split-linked-list-in-parts',
        title: 'Split Linked List in Parts',
        leetcodeNumber: 725,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a linked list and an integer k, split the list into k consecutive parts. The length of each part should be as equal as possible. Parts earlier in the list should have more nodes than parts later (difference of at most 1). Empty parts are represented by null.',
        hasVisualization: true,
        tags: ['linked list', 'array', 'greedy'],
      },
      {
        id: 'swapping-nodes-in-linked-list',
        title: 'Swapping Nodes in a Linked List',
        leetcodeNumber: 1721,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a linked list and an integer k, swap the values of the kth node from the beginning and the kth node from the end. Find the kth node from the beginning directly. Then use two pointers: advance one pointer k steps, then advance both until the leading pointer reaches the end.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers'],
      },
    
      {
        id: 'add-two-numbers-reverse',
        title: 'Add Two Numbers (Reverse Order)',
        leetcodeNumber: 2,
        difficulty: 'Medium' as Difficulty,
        description:
          'Add two numbers represented as reversed linked lists (least significant digit first). Traverse both lists simultaneously, adding corresponding digits plus carry. Create new nodes for each digit of the result. Handle different lengths and final carry.',
        hasVisualization: true,
        tags: ['linked list', 'math', 'carry', 'addition'],
      },
      {
        id: 'clone-linked-list-with-next-random',
        title: 'Clone List with Next and Random Pointer (Three-Pass)',
        leetcodeNumber: 138,
        difficulty: 'Medium' as Difficulty,
        description:
          'Deep copy a linked list with next and random pointers using a three-pass O(1) space technique. Pass 1: interleave clones between originals (A->A*->B->B*). Pass 2: set random pointers on clones. Pass 3: separate the two lists by restoring original next pointers.',
        hasVisualization: true,
        tags: ['linked list', 'clone', 'random pointer', 'O(1) space'],
      },
      {
        id: 'convert-sorted-list-to-bst',
        title: 'Convert Sorted List to BST',
        leetcodeNumber: 109,
        difficulty: 'Medium' as Difficulty,
        description:
          'Convert a sorted linked list to a height-balanced binary search tree. Use slow/fast pointers to find the middle of the list as the root, then recursively build the left subtree from the left half and the right subtree from the right half.',
        hasVisualization: true,
        tags: ['linked list', 'tree', 'binary search tree', 'divide and conquer', 'recursion'],
      },
      {
        id: 'deep-copy-linked-list-with-random',
        title: 'Copy List with Random Pointer (Hash Map)',
        leetcodeNumber: 138,
        difficulty: 'Medium' as Difficulty,
        description:
          'Create a deep copy of a linked list where each node has a next and a random pointer. Use a hash map to map each original node to its copy. First pass creates all copies. Second pass assigns next and random pointers using the hash map.',
        hasVisualization: true,
        tags: ['linked list', 'hash map', 'deep copy', 'random pointer'],
      },
      {
        id: 'delete-the-middle-node',
        title: 'Delete the Middle Node of a Linked List',
        leetcodeNumber: 2095,
        difficulty: 'Medium' as Difficulty,
        description:
          'Delete the middle node of a linked list. For a list of length n, the middle is at index floor(n/2). Use slow and fast pointers where fast moves 2x faster, so when fast reaches the end, slow is at the node before the middle.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'middle node'],
      },
      {
        id: 'design-skiplist',
        title: 'Design Skiplist',
        leetcodeNumber: 1206,
        difficulty: 'Hard' as Difficulty,
        description:
          'Implement a skip list data structure without using built-in libraries. A skip list is a probabilistic data structure with multiple levels of sorted linked lists. Each element may appear on multiple levels with probability 0.5, enabling O(log n) average search, insert, and delete.',
        hasVisualization: true,
        tags: ['linked list', 'design', 'probabilistic', 'skip list'],
      },
      {
        id: 'design-text-editor',
        title: 'Design Text Editor',
        leetcodeNumber: 2296,
        difficulty: 'Hard' as Difficulty,
        description:
          'Design a text editor with a cursor using two stacks (or doubly linked list). Left stack holds characters before cursor, right stack holds characters after. addText appends to left stack. deleteText removes from left. cursorLeft/cursorRight moves characters between stacks.',
        hasVisualization: true,
        tags: ['linked list', 'stack', 'design', 'string', 'two stacks'],
      },
      {
        id: 'detect-and-remove-cycle',
        title: 'Detect and Remove Cycle in Linked List',
        leetcodeNumber: 142,
        difficulty: 'Medium' as Difficulty,
        description:
          'Detect if a linked list has a cycle and find where it starts, then remove it. Use Floyd cycle detection: slow and fast pointers meet inside the cycle. Reset one pointer to head; both advance one step at a time until they meet at the cycle start. Then remove the cycle.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'cycle detection', 'Floyd algorithm'],
      },
      {
        id: 'double-a-number-in-linked-list',
        title: 'Double a Number Represented as a Linked List',
        leetcodeNumber: 2816,
        difficulty: 'Medium' as Difficulty,
        description:
          'Double the value of a number stored in a linked list (most significant digit first). Reverse the list, double each digit while propagating carry, then reverse back. Alternatively, use a stack to process from least significant to most significant digit.',
        hasVisualization: true,
        tags: ['linked list', 'math', 'carry', 'reverse'],
      },
      {
        id: 'find-the-minimum-and-maximum-linked-list',
        title: 'Find Minimum and Maximum in Linked List',
        difficulty: 'Easy' as Difficulty,
        description:
          'Traverse a linked list once to find both the minimum and maximum values. Initialize min and max to the head value, then compare each subsequent node. Return both values after a single O(n) traversal with O(1) extra space.',
        hasVisualization: true,
        tags: ['linked list', 'traversal', 'min max'],
      },
      {
        id: 'flatten-sorted-linked-list',
        title: 'Flatten Sorted Multi-Level Linked List',
        difficulty: 'Medium' as Difficulty,
        description:
          'Flatten a multi-level sorted linked list where each node may have a child pointer to another sorted list. Use a min-heap to merge all sub-lists efficiently. The result is a single sorted linked list containing all elements from all levels.',
        hasVisualization: true,
        tags: ['linked list', 'heap', 'flatten', 'merge', 'multi-level'],
      },
      {
        id: 'linked-list-in-binary-tree',
        title: 'Linked List in Binary Tree',
        leetcodeNumber: 1367,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary tree root and a linked list head, return true if all elements of the linked list correspond to a downward path in the binary tree. Use DFS from every tree node, checking if the linked list matches a root-to-node path.',
        hasVisualization: true,
        tags: ['linked list', 'tree', 'dfs', 'recursion'],
      },
      {
        id: 'merge-k-sorted-lists-heap',
        title: 'Merge K Sorted Lists (Min-Heap)',
        leetcodeNumber: 23,
        difficulty: 'Hard' as Difficulty,
        description:
          'Merge k sorted linked lists using a min-heap (priority queue). Push the head of each list into the heap. Repeatedly extract the minimum, append it to the result, and push the next node from that list. Time complexity: O(n log k) where n is total nodes.',
        hasVisualization: true,
        tags: ['linked list', 'heap', 'priority queue', 'merge', 'sorting'],
      },
      {
        id: 'multiply-two-linked-lists',
        title: 'Multiply Two Numbers as Linked Lists',
        difficulty: 'Medium' as Difficulty,
        description:
          'Multiply two non-negative integers represented as linked lists (most significant digit first). Traverse each list to reconstruct the integers, multiply them, then convert the result back to a linked list. Handle edge case where either number is zero.',
        hasVisualization: true,
        tags: ['linked list', 'math', 'multiplication', 'number representation'],
      },
      {
        id: 'pairwise-swap-linked-list',
        title: 'Swap Nodes in Pairs',
        leetcodeNumber: 24,
        difficulty: 'Medium' as Difficulty,
        description:
          'Swap every two adjacent nodes in a linked list and return its head. Do not modify node values - swap the actual nodes. Use a sentinel dummy node and three pointers to rewire each pair. Process pairs iteratively until fewer than 2 nodes remain.',
        hasVisualization: true,
        tags: ['linked list', 'recursion', 'swap', 'pairs'],
      },
      {
        id: 'palindrome-linked-list-ii',
        title: 'Palindrome Linked List',
        leetcodeNumber: 234,
        difficulty: 'Easy' as Difficulty,
        description:
          'Check if a linked list is a palindrome in O(n) time and O(1) space. Find the middle using slow/fast pointers, reverse the second half in-place, compare both halves, then restore the list. This approach avoids using extra memory.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'palindrome', 'reverse'],
      },
      {
        id: 'plus-one-linked-list',
        title: 'Plus One Linked List',
        leetcodeNumber: 369,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a number represented as a linked list (most significant digit first), add one to the number. Find the rightmost non-9 digit, increment it, and set all digits to the right to 0. If all digits are 9, prepend a new node with value 1.',
        hasVisualization: true,
        tags: ['linked list', 'math', 'carry'],
      },
      {
        id: 'remove-nth-from-end-one-pass',
        title: 'Remove Nth Node from End (One Pass)',
        leetcodeNumber: 19,
        difficulty: 'Medium' as Difficulty,
        description:
          'Remove the nth node from the end of a linked list in a single pass using the gap technique. Use two pointers: advance the fast pointer n+1 steps ahead. Then move both pointers together until fast reaches null. The slow pointer will be at the node just before the target.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'one pass', 'gap technique'],
      },
      {
        id: 'reverse-linked-list-between',
        title: 'Reverse Linked List Between Positions',
        leetcodeNumber: 92,
        difficulty: 'Medium' as Difficulty,
        description:
          'Reverse a portion of a linked list from position left to right in one pass. Use a sentinel node, advance to position left-1, then repeatedly move the node right after the current sublist to just after the sentinel node position, effectively reversing the sublist.',
        hasVisualization: true,
        tags: ['linked list', 'reverse', 'in-place'],
      },
      {
        id: 'reverse-linked-list-recursive',
        title: 'Reverse Linked List (Recursive)',
        leetcodeNumber: 206,
        difficulty: 'Easy' as Difficulty,
        description:
          'Reverse a singly linked list using the recursive approach. The base case returns when head or head.next is null. For each node, recursively reverse the rest, then make head.next.next = head and head.next = null to flip the pointer.',
        hasVisualization: true,
        tags: ['linked list', 'recursion', 'reverse'],
      },
      {
        id: 'rotate-linked-list',
        title: 'Rotate List',
        leetcodeNumber: 61,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a linked list, rotate the list to the right by k places. The key insight is to find the new tail at position (n - k % n - 1) and reconnect the list. First compute the length, then use modulo to handle k larger than n.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'rotation'],
      },
      {
        id: 'segregate-even-odd-linked-list',
        title: 'Segregate Even and Odd Nodes in Linked List',
        difficulty: 'Easy' as Difficulty,
        description:
          'Rearrange a linked list so all even-valued nodes come before all odd-valued nodes, maintaining relative order within each group. Use two dummy heads to build even and odd sublists simultaneously, then connect them.',
        hasVisualization: true,
        tags: ['linked list', 'partitioning', 'two pointers'],
      },
      {
        id: 'sort-linked-list-ii',
        title: 'Sort List (Bottom-Up Merge Sort)',
        leetcodeNumber: 148,
        difficulty: 'Medium' as Difficulty,
        description:
          'Sort a linked list in O(n log n) time using constant space via bottom-up merge sort. Instead of top-down recursion, iteratively merge sublists of increasing size (1, 2, 4, 8...) until the entire list is sorted.',
        hasVisualization: true,
        tags: ['linked list', 'merge sort', 'divide and conquer', 'sorting'],
      },
      {
        id: 'spiral-matrix-linked-list',
        title: 'Spiral Matrix IV (from Linked List)',
        leetcodeNumber: 2326,
        difficulty: 'Medium' as Difficulty,
        description:
          'Fill an m x n matrix in spiral order using values from a linked list. Start at the top-left, move right, down, left, up (spiral pattern). When the list is exhausted, fill remaining cells with 0. Track direction changes using boundary variables.',
        hasVisualization: true,
        tags: ['linked list', 'matrix', 'spiral', 'simulation'],
      },
      {
        id: 'unzip-linked-list',
        title: 'Unzip Linked List (Odd/Even Separation)',
        difficulty: 'Medium' as Difficulty,
        description:
          'Separate a linked list into two parts: all nodes at odd indices followed by all nodes at even indices (1-indexed). Keep relative order within each group. Use two pointers advancing alternately to gather odd and even index nodes, then connect the two groups.',
        hasVisualization: true,
        tags: ['linked list', 'two pointers', 'reordering'],
      },
    ],
  },

  // ─── 04. Fast And Slow Pointers ─────────────────────────────────────
  {
    id: 'fast-and-slow-pointers',
    name: 'Fast And Slow Pointers',
    icon: '⏩',
    color: 'text-pink-400',
    gradient: 'from-pink-500/20 to-pink-600/10',
    borderColor: 'border-pink-500/30',
    problems: [
      {
        id: 'linked-list-loop',
        title: 'Linked List Loop',
        difficulty: 'Easy',
        leetcodeNumber: 141,
        description:
          'Detect whether a linked list contains a cycle using Floyd\'s tortoise and hare algorithm.',
        hasVisualization: true,
        tags: ['linked-list', 'fast-slow-pointers', 'cycle-detection'],
      },
      {
        id: 'linked-list-midpoint',
        title: 'Linked List Midpoint',
        difficulty: 'Easy',
        leetcodeNumber: 876,
        description:
          'Find the middle node of a linked list in a single pass using fast and slow pointers.',
        hasVisualization: true,
        tags: ['linked-list', 'fast-slow-pointers'],
      },
      {
        id: 'happy-number',
        title: 'Happy Number',
        difficulty: 'Easy',
        leetcodeNumber: 202,
        description:
          'Determine if a number eventually reaches 1 when repeatedly replacing it with the sum of the squares of its digits.',
        hasVisualization: true,
        tags: ['math', 'fast-slow-pointers', 'cycle-detection'],
      },
      {
        id: 'circular-array-loop',
        title: 'Circular Array Loop',
        difficulty: 'Medium',
        leetcodeNumber: 457,
        description:
          'Given a circular array, determine if a cycle exists. A cycle must be in the same direction and have length > 1. Uses fast and slow pointers starting from each index.',
        hasVisualization: true,
        tags: ['fast-and-slow-pointers', 'circular-array', 'cycle-detection'],
      },
      {
        id: 'find-duplicate-number',
        title: 'Find the Duplicate Number',
        difficulty: 'Medium',
        leetcodeNumber: 287,
        description:
          'Given an array of n+1 integers where each integer is between 1 and n, find the duplicate number using Floyd\'s cycle detection algorithm. Treat array values as pointers to next indices to create a linked list with a cycle.',
        hasVisualization: true,
        tags: ['fast-and-slow-pointers', 'floyd', ',-', ',-'],
      },
    ],
  },

  // ─── 05. Sliding Windows ───────────────────────────────────────────
  {
    id: 'sliding-windows',
    name: 'Sliding Windows',
    icon: '⊞',
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-amber-600/10',
    borderColor: 'border-amber-500/30',
    problems: [
      {
        id: 'substring-anagrams',
        title: 'Substring Anagrams',
        difficulty: 'Medium',
        leetcodeNumber: 438,
        description:
          'Find all start indices of anagrams of a pattern within a string using a sliding window with character counts.',
        hasVisualization: true,
        tags: ['sliding-window', 'string', 'hash-map'],
      },
      {
        id: 'longest-substring-with-unique-characters',
        title: 'Longest Substring With Unique Characters',
        difficulty: 'Medium',
        leetcodeNumber: 3,
        description:
          'Find the length of the longest substring without repeating characters using an expanding and shrinking window.',
        hasVisualization: true,
        tags: ['sliding-window', 'string', 'hash-set'],
      },
      {
        id: 'longest-uniform-substring-after-replacements',
        title: 'Longest Uniform Substring After Replacements',
        difficulty: 'Medium',
        leetcodeNumber: 424,
        description:
          'Find the longest substring of identical characters you can achieve with at most k character replacements.',
        hasVisualization: true,
        tags: ['sliding-window', 'string'],
      },
      {
        id: 'count-nice-subarrays',
        title: 'Count Number of Nice Subarrays',
        difficulty: 'Medium',
        leetcodeNumber: 1248,
        description:
          'Given an array of integers and k, return the number of nice subarrays — subarrays containing exactly k odd numbers. Uses the ',
        hasVisualization: true,
        tags: ['sliding-window', 'prefix-sum', 'two-pointers', 'counting'],
      },
      {
        id: 'fruit-into-baskets',
        title: 'Fruit Into Baskets',
        difficulty: 'Medium',
        leetcodeNumber: 904,
        description:
          'You have two baskets and can pick fruits from a row of trees. Each basket can only hold one type of fruit. Find the maximum number of fruits you can pick (longest subarray with at most 2 distinct values).',
        hasVisualization: true,
        tags: ['sliding-window', 'hash-map', 'two-pointers', 'at-most-k-distinct'],
      },
      {
        id: 'grumpy-bookstore-owner',
        title: 'Grumpy Bookstore Owner',
        difficulty: 'Medium',
        leetcodeNumber: 1052,
        description:
          'A bookstore owner can be grumpy some minutes. Customers only stay satisfied when the owner is not grumpy. The owner can use a technique to suppress grumpiness for k consecutive minutes. Find the maximum satisfied customers.',
        hasVisualization: true,
        tags: ['sliding-window', 'fixed-window', 'reedy', 'array'],
      },
      {
        id: 'max-consecutive-ones-iii',
        title: 'Max Consecutive Ones III',
        difficulty: 'Medium',
        leetcodeNumber: 1004,
        description:
          'Given a binary array and an integer k, return the maximum number of consecutive 1s in the array if you can flip at most k 0s. Uses a sliding window tracking the count of zeros in the current window.',
        hasVisualization: true,
        tags: ['sliding-window', 'binary-array', 'reedy'],
      },
      {
        id: 'minimum-size-subarray-sum',
        title: 'Minimum Size Subarray Sum',
        difficulty: 'Medium',
        leetcodeNumber: 209,
        description:
          'Given an array of positive integers and a target, return the minimal length of a contiguous subarray whose sum is greater than or equal to target. Uses a sliding window that expands right and shrinks left whenever the sum condition is met.',
        hasVisualization: true,
        tags: ['sliding-window', 'two-pointers', 'prefix-sum'],
      },
      {
        id: 'minimum-window-substring',
        title: 'Minimum Window Substring',
        difficulty: 'Hard',
        leetcodeNumber: 76,
        description:
          'Given two strings s and t, return the minimum window substring of s such that every character in t is included in the window. Uses a sliding window with character frequency maps to efficiently track whether the current window is valid.',
        hasVisualization: true,
        tags: ['sliding-window', 'hash-map', 'string', 'two-pointers'],
      },
      {
        id: 'permutation-in-string',
        title: 'Permutation in String',
        difficulty: 'Medium',
        leetcodeNumber: 567,
        description:
          'Given two strings s1 and s2, return true if s2 contains a permutation of s1. The window size is fixed at len(s1), and we slide it across s2 comparing character frequency maps.',
        hasVisualization: true,
        tags: ['sliding-window', 'hash-map', 'string', 'fixed-window'],
      },
      {
        id: 'repeated-dna-sequences',
        title: 'Repeated DNA Sequences',
        difficulty: 'Medium',
        leetcodeNumber: 187,
        description:
          'Given a DNA string, find all 10-letter-long substrings that appear more than once. Uses a fixed sliding window of size 10 and a hash set to track seen sequences.',
        hasVisualization: true,
        tags: ['sliding-window', 'hash-set', 'string', 'fixed-window'],
      },
    
      {
        id: 'binary-subarrays-with-sum',
        title: 'Binary Subarrays With Sum',
        leetcodeNumber: 930,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary array nums and an integer goal, return the number of non-empty subarrays with a sum equal to goal. Apply the sliding window identity: exactly(goal) = atMost(goal) - atMost(goal-1). The atMost function counts subarrays whose sum does not exceed a given limit by expanding right and shrinking left when the sum exceeds the limit.',
        hasVisualization: true,
        tags: ['sliding window', 'prefix sum', 'hash map', 'binary array'],
      },
      {
        id: 'count-number-of-nice-subarrays',
        title: 'Count Number of Nice Subarrays',
        leetcodeNumber: 1248,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of integers nums and an integer k, a subarray is nice if it contains exactly k odd numbers. Count all nice subarrays. Use the identity: exactly(k) = atMost(k) - atMost(k-1), where atMost(k) counts subarrays with at most k odd numbers using a sliding window.',
        hasVisualization: true,
        tags: ['sliding window', 'math', 'prefix sum', 'counting'],
      },
      {
        id: 'count-subarrays-with-fixed-bounds',
        title: 'Count Subarrays With Fixed Bounds',
        leetcodeNumber: 2444,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums and two integers minK and maxK, a fixed-bound subarray has minimum element equal to minK and maximum element equal to maxK. Count the number of such subarrays. Track the last positions of minK, maxK, and any out-of-bound element. For each right index, count valid starting positions.',
        hasVisualization: true,
        tags: ['sliding window', 'array', 'counting'],
      },
      {
        id: 'frequency-of-most-frequent-element',
        title: 'Frequency of the Most Frequent Element',
        leetcodeNumber: 1838,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums and an integer k, in one operation you may choose an index and increment nums[index] by 1. Return the maximum possible frequency of an element after performing at most k operations. Sort the array, then use a sliding window where the cost to make all elements equal to the rightmost is tracked. Shrink if cost exceeds k.',
        hasVisualization: true,
        tags: ['sliding window', 'sorting', 'greedy', 'prefix sum'],
      },
      {
        id: 'get-equal-substrings-within-budget',
        title: 'Get Equal Substrings Within Budget',
        leetcodeNumber: 1208,
        difficulty: 'Medium' as Difficulty,
        description:
          'You are given two strings s and t of the same length and an integer maxCost. You want to change s to t. Changing the i-th character of s to i-th character of t costs |s[i] - t[i]|. Return the maximum length of a substring of s that can be changed to be the same as the corresponding substring of t with a cost less than or equal to maxCost. Use a sliding window tracking total cost.',
        hasVisualization: true,
        tags: ['sliding window', 'string', 'binary search', 'prefix sum'],
      },
      {
        id: 'longest-nice-subarray',
        title: 'Longest Nice Subarray',
        leetcodeNumber: 2401,
        difficulty: 'Medium' as Difficulty,
        description:
          'A subarray is called "nice" if the bitwise AND of every pair of elements in different positions is 0. This means no two elements share any set bit. Use a sliding window tracking which bits are used. When adding a new element conflicts with used bits, shrink from the left by un-setting those bits.',
        hasVisualization: true,
        tags: ['sliding window', 'bit manipulation', 'array'],
      },
      {
        id: 'longest-repeating-character-replacement',
        title: 'Longest Repeating Character Replacement',
        leetcodeNumber: 424,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s and an integer k, find the length of the longest substring containing the same letter after replacing at most k characters. Track the count of the most frequent character in the window. If window size minus that count exceeds k, shrink the window from the left.',
        hasVisualization: true,
        tags: ['sliding window', 'string', 'hash map', 'frequency count'],
      },
      {
        id: 'longest-subarray-of-ones-after-deleting',
        title: 'Longest Subarray of 1s After Deleting One Element',
        leetcodeNumber: 1493,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary array nums, delete exactly one element and return the length of the longest non-empty subarray containing only 1s. Use a sliding window allowing at most one zero inside. When the window has more than one zero, shrink from the left. The answer is the window size minus one (for the deleted element).',
        hasVisualization: true,
        tags: ['sliding window', 'array', 'binary array'],
      },
      {
        id: 'longest-substring-with-at-most-k-distinct',
        title: 'Longest Substring with At Most K Distinct Characters',
        leetcodeNumber: 340,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s and an integer k, find the length of the longest substring that contains at most k distinct characters. Use a sliding window with a frequency map. When the number of distinct characters exceeds k, shrink from the left until back to k distinct characters.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'string', 'two pointers'],
      },
      {
        id: 'longest-substring-with-at-most-two-distinct',
        title: 'Longest Substring with At Most Two Distinct Characters',
        leetcodeNumber: 159,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s, find the length of the longest substring that contains at most 2 distinct characters. This is a special case of the k-distinct problem with k=2. Use a sliding window: expand right, and whenever more than 2 distinct characters appear, shrink from the left until back to 2 or fewer distinct characters.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'string', 'two pointers'],
      },
      {
        id: 'max-consecutive-ones',
        title: 'Max Consecutive Ones',
        leetcodeNumber: 485,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a binary array nums, return the maximum number of consecutive 1s in the array. Scan through the array tracking the current run of consecutive ones. Reset the counter when a 0 is encountered and update the global maximum after each element.',
        hasVisualization: true,
        tags: ['array', 'sliding window', 'greedy'],
      },
      {
        id: 'max-erasure-value',
        title: 'Maximum Erasure Value',
        leetcodeNumber: 1695,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of positive integers nums, you can erase a subarray containing unique elements and earn a score equal to its sum. Find the maximum score achievable. Use a sliding window with a set to track unique elements. When a duplicate is encountered, shrink from the left until the duplicate is removed. Track maximum window sum.',
        hasVisualization: true,
        tags: ['sliding window', 'hash set', 'array', 'unique elements'],
      },
      {
        id: 'max-number-of-vowels',
        title: 'Maximum Number of Vowels in a Substring of Given Length',
        leetcodeNumber: 1456,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s and an integer k, return the maximum number of vowel letters in any substring of s with length k. Use a fixed-size sliding window: count vowels in the first window of size k, then slide by adding the right character and removing the left character, updating the maximum at each step.',
        hasVisualization: true,
        tags: ['sliding window', 'string', 'fixed window'],
      },
      {
        id: 'max-points-from-cards',
        title: 'Maximum Points You Can Obtain from Cards',
        leetcodeNumber: 1423,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array cardPoints and an integer k, you can take cards from the beginning or end of the array. Return the maximum score from exactly k cards. Equivalently, find the minimum sum subarray of length n-k in the middle, then subtract from total. Use a sliding window of size n-k.',
        hasVisualization: true,
        tags: ['sliding window', 'array', 'prefix sum', 'greedy'],
      },
      {
        id: 'max-sum-of-two-non-overlapping-subarrays',
        title: 'Maximum Sum of Two Non-Overlapping Subarrays',
        leetcodeNumber: 1031,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums and two integers firstLen and secondLen, find the maximum sum of elements in two non-overlapping subarrays of lengths firstLen and secondLen. Consider two cases: the firstLen subarray appears before the secondLen subarray, and vice versa. Use prefix sums and track rolling maximum of each subarray as you slide.',
        hasVisualization: true,
        tags: ['sliding window', 'array', 'prefix sum', 'greedy'],
      },
      {
        id: 'max-value-of-equation',
        title: 'Max Value of Equation',
        leetcodeNumber: 1499,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array points sorted by x-coordinate and integer k, find the maximum value of yi + yj + |xi - xj| for pairs where |xi - xj| <= k. Since points are sorted and xi < xj, the expression becomes yj + xj + (yi - xi). Use a monotonic deque to track the maximum yi - xi for valid left points. For each j, check deque front validity, then update result and deque.',
        hasVisualization: true,
        tags: ['sliding window', 'deque', 'monotonic queue', 'greedy'],
      },
      {
        id: 'minimum-difference-between-largest-smallest',
        title: 'Minimum Difference Between Largest and Smallest Value in Three Moves',
        leetcodeNumber: 1509,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums, in one move you may choose one element and change it to any value. Return the minimum difference between the largest and smallest value in nums after performing at most three moves. Sort the array, then consider 4 scenarios: remove 3 from left, 2 from left and 1 from right, 1 from left and 2 from right, 3 from right.',
        hasVisualization: true,
        tags: ['sliding window', 'sorting', 'greedy', 'array'],
      },
      {
        id: 'minimum-operations-reduce-x-to-zero',
        title: 'Minimum Operations to Reduce X to Zero',
        leetcodeNumber: 1658,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums and integer x, in one operation you can remove either the leftmost or rightmost element from nums and subtract its value from x. Return the minimum number of operations to reduce x to exactly 0, or -1 if impossible. Equivalently, find the longest subarray in the middle with sum equal to total - x.',
        hasVisualization: true,
        tags: ['sliding window', 'array', 'prefix sum', 'hash map'],
      },
      {
        id: 'minimum-window-subsequence',
        title: 'Minimum Window Subsequence',
        leetcodeNumber: 727,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given strings s1 and s2, find the minimum length substring of s1 such that s2 is a subsequence of that substring. Use two passes: forward pass to find s2 as a subsequence ending at some position in s1, then backward pass from that position to find the tightest starting point. Repeat moving forward from the start position.',
        hasVisualization: true,
        tags: ['sliding window', 'string', 'two pointers', 'subsequence'],
      },
      {
        id: 'number-of-substrings-containing-all-three',
        title: 'Number of Substrings Containing All Three Characters',
        leetcodeNumber: 1358,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s consisting only of characters a, b, and c, return the number of substrings containing at least one occurrence of all three characters. Use a sliding window: expand right, and once all three are present, every extension of that right position with the current valid left forms a valid substring. Count valid starts.',
        hasVisualization: true,
        tags: ['sliding window', 'string', 'counting'],
      },
      {
        id: 'replace-substring-for-balanced-string',
        title: 'Replace the Substring for Balanced String',
        leetcodeNumber: 1234,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s containing only Q, W, E, R where each should appear exactly n/4 times (balanced). Find the minimum length substring to replace to make the string balanced. Use a sliding window: the characters outside the window must already have counts at most n/4. Shrink the window while the outside characters satisfy the balance condition.',
        hasVisualization: true,
        tags: ['sliding window', 'string', 'two pointers', 'frequency count'],
      },
      {
        id: 'shortest-subarray-with-sum-at-least-k',
        title: 'Shortest Subarray with Sum at Least K',
        leetcodeNumber: 862,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums and integer k, find the length of the shortest non-empty subarray with sum at least k. Because nums can have negative numbers, a simple sliding window fails. Use prefix sums with a monotonic deque: maintain an increasing deque of prefix sum indices. When prefix[right] - prefix[deque front] >= k, update the answer and pop from front.',
        hasVisualization: true,
        tags: ['sliding window', 'deque', 'prefix sum', 'monotonic queue'],
      },
      {
        id: 'sliding-window-median',
        title: 'Sliding Window Median',
        leetcodeNumber: 480,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array nums and integer k, find the median of each window of size k as it slides from left to right. Use two heaps (max-heap for lower half, min-heap for upper half) or a sorted structure. For each window of size k, compute median as middle element if k is odd, or average of two middle elements if k is even. Simulate by sorting each window for visualization.',
        hasVisualization: true,
        tags: ['sliding window', 'heap', 'sorting', 'median'],
      },
      {
        id: 'subarrays-with-k-different-integers',
        title: 'Subarrays with K Different Integers',
        leetcodeNumber: 992,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums and an integer k, return the number of subarrays with exactly k different integers. Use the identity: exactly(k) = atMost(k) - atMost(k-1), where atMost(k) counts subarrays with at most k distinct integers using a sliding window. Each valid right endpoint contributes right - left + 1 subarrays.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'counting', 'two pointers'],
      },
      {
        id: 'substring-with-concatenation',
        title: 'Substring with Concatenation of All Words',
        leetcodeNumber: 30,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a string s and an array of strings words (all same length), find all starting indices of substrings in s that is a concatenation of each word in words exactly once. Use a sliding window of size words.length * word.length, shifted by word length. Use hash maps to track required and current word counts.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'string', 'two pointers'],
      },
    
      {
        id: 'contains-duplicate-iii',
        title: 'Contains Duplicate III',
        leetcodeNumber: 220,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums and two integers k and t, return true if there are two distinct indices i and j in the array such that abs(nums[i] - nums[j]) <= t and abs(i - j) <= k. Use a sliding window of size k with a sorted bucket approach to check value proximity.',
        hasVisualization: true,
        tags: ['sliding window', 'bucket sort', 'ordered set', 'array'],
      },
      {
        id: 'count-complete-subarrays',
        title: 'Count Complete Subarrays in an Array',
        leetcodeNumber: 2799,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array nums, a subarray is complete if the number of distinct elements in the subarray equals the number of distinct elements in the whole array. Return the number of complete subarrays. Use sliding window to find the smallest window with all distinct elements, then count subarrays.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'array'],
      },
      {
        id: 'count-of-substrings-containing-every-vowel',
        title: 'Count of Substrings Containing Every Vowel and K Consonants II',
        leetcodeNumber: 3305,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string word and a non-negative integer k, return the total number of substrings of word that contain every vowel at least once and exactly k consonants. Use the formula: count(at_least_k) - count(at_least_k+1) to get exactly k consonants with all vowels present.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'string'],
      },
      {
        id: 'count-subarrays-where-max-appears-k-times',
        title: 'Count Subarrays Where Max Element Appears at Least K Times',
        leetcodeNumber: 2962,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums and a positive integer k, return the number of subarrays where the maximum element of nums appears at least k times in that subarray. Use a sliding window tracking occurrences of the global maximum.',
        hasVisualization: true,
        tags: ['sliding window', 'array'],
      },
      {
        id: 'diet-plan-performance',
        title: 'Diet Plan Performance',
        leetcodeNumber: 1176,
        difficulty: 'Easy' as Difficulty,
        description:
          'A dieter consumes calories[i] for the i-th day. For each k consecutive days, they earn +1 point if total > upper, -1 point if total < lower, and 0 otherwise. Return the total performance points. Use a fixed sliding window of size k to compute each segment sum.',
        hasVisualization: true,
        tags: ['sliding window', 'array'],
      },
      {
        id: 'find-longest-special-substring',
        title: 'Find Longest Special Substring That Occurs Thrice I',
        leetcodeNumber: 2981,
        difficulty: 'Medium' as Difficulty,
        description:
          'A special string consists of a single character repeated one or more times. Given a string s, return the length of the longest special substring that occurs at least 3 times. Use sliding window to find all runs of same characters, track frequency of each (char, length) pair.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'string'],
      },
      {
        id: 'find-the-power-of-k-size-subarrays',
        title: 'Find the Power of K-Size Subarrays I',
        leetcodeNumber: 3254,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array nums and integer k, find the power of each k-size subarray. The power of an array is the maximum element if consecutive and sorted, otherwise -1. Return an array of results for each k-size window.',
        hasVisualization: true,
        tags: ['sliding window', 'array'],
      },
      {
        id: 'grumpy-bookstore-owner-ii',
        title: 'Grumpy Bookstore Owner (Sliding Window Variant)',
        leetcodeNumber: 1052,
        difficulty: 'Medium' as Difficulty,
        description:
          'A bookstore owner has customers[i] customers on day i. The owner is grumpy[i] on some days. The owner can use a secret technique for minutes consecutive minutes to suppress grumpiness. Find the maximum customers who can be satisfied. Base satisfied + sliding window to find best extra gain window.',
        hasVisualization: true,
        tags: ['sliding window', 'array', 'greedy'],
      },
      {
        id: 'length-of-longest-subarray-with-at-most-k-frequency',
        title: 'Length of Longest Subarray With at Most K Frequency',
        leetcodeNumber: 2958,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums and an integer k, return the length of the longest subarray of nums where the frequency of each element is at most k. Use a sliding window with a frequency map, shrinking from the left when any element exceeds frequency k.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'array'],
      },
      {
        id: 'longest-continuous-subarray-with-absolute-diff',
        title: 'Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit',
        leetcodeNumber: 1438,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of integers nums and an integer limit, return the size of the longest non-empty subarray such that the absolute difference between any two elements is at most limit. Use a sliding window with two monotonic deques to track the maximum and minimum values in the current window.',
        hasVisualization: true,
        tags: ['sliding window', 'monotonic deque', 'array'],
      },
      {
        id: 'longest-substring-of-all-vowels',
        title: 'Longest Substring Of All Vowels in Order',
        leetcodeNumber: 1839,
        difficulty: 'Medium' as Difficulty,
        description:
          'A string is beautiful if it only contains vowels (a, e, i, o, u) and each vowel appears at least once, and it is alphabetically non-decreasing. Given a string word, return the length of the longest beautiful substring. Use sliding window tracking vowel count and current vowel.',
        hasVisualization: true,
        tags: ['sliding window', 'string'],
      },
      {
        id: 'max-number-of-k-sum-pairs-sliding',
        title: 'Max Number of K-Sum Pairs (Sliding Window Approach)',
        leetcodeNumber: 1679,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array nums and integer k, in one operation pick two numbers that sum to k and remove them. Return max operations. Sort the array then use two pointers (sliding window) converging from both ends: if sum equals k remove both and count, if sum < k advance left, else advance right.',
        hasVisualization: true,
        tags: ['sliding window', 'two pointers', 'sorting', 'array'],
      },
      {
        id: 'max-sum-of-almost-unique-subarray',
        title: 'Maximum Sum of Almost Unique Subarray',
        leetcodeNumber: 2841,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a 0-indexed integer array nums and integers m and k, find the maximum sum of a subarray of length k that contains at least m distinct elements. Use a sliding window of fixed size k with a frequency map tracking distinct element count.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'array'],
      },
      {
        id: 'maximum-average-subarray-ii',
        title: 'Maximum Average Subarray II',
        leetcodeNumber: 644,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums of n elements and integer k, find a contiguous subarray of length >= k that has the maximum average value. Use binary search on the answer combined with a sliding window technique. Check if there exists a subarray of length >= k with average >= mid.',
        hasVisualization: true,
        tags: ['sliding window', 'binary search', 'array'],
      },
      {
        id: 'maximum-beauty-of-an-array',
        title: 'Maximum Beauty of an Array After Applying Operation',
        leetcodeNumber: 2779,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a 0-indexed array nums and a non-negative integer k, perform operations to make elements equal within range [nums[i]-k, nums[i]+k]. The beauty is the length of the longest subsequence of equal values. Sort and use sliding window where the window is valid if max - min <= 2*k.',
        hasVisualization: true,
        tags: ['sliding window', 'sorting', 'array'],
      },
      {
        id: 'maximum-length-substring-with-two-occurrences',
        title: 'Maximum Length Substring With Two Occurrences',
        leetcodeNumber: 3090,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string s, return the maximum length of a substring such that it contains at most 2 occurrences of each character. Use a sliding window: expand right, and shrink left when any character appears more than 2 times.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'string'],
      },
      {
        id: 'maximum-sum-of-distinct-subarrays',
        title: 'Maximum Sum of Distinct Subarrays With Length K',
        leetcodeNumber: 2461,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums and an integer k, find the maximum subarray sum of all subarrays of nums that meet these conditions: the subarray has length k and all elements are distinct. Return 0 if no such subarray exists. Use a fixed sliding window with a frequency map.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'array'],
      },
      {
        id: 'minimum-length-of-string-after-operations',
        title: 'Minimum Length of String After Operations',
        leetcodeNumber: 3223,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s, repeatedly select any index i where there is at least one equal character to the left and right, then delete the closest such characters. Return the minimum length of the resulting string. For each character, if its count is odd keep 1, if even keep 2.',
        hasVisualization: true,
        tags: ['sliding window', 'hash map', 'string', 'greedy'],
      },
      {
        id: 'minimum-number-of-flips',
        title: 'Minimum Number of Flips to Make Binary String Alternating',
        leetcodeNumber: 1888,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary string s, you can perform two operations: remove the first character and append it to the end, or flip any character. Return the minimum number of flips needed to make s alternating. Use a sliding window on the doubled string to find the best alignment.',
        hasVisualization: true,
        tags: ['sliding window', 'string', 'greedy'],
      },
      {
        id: 'minimum-recolors-to-get-k-black',
        title: 'Minimum Recolors to Get K Consecutive Black Blocks',
        leetcodeNumber: 2379,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string blocks of B and W characters and an integer k, in one operation you can change a W to B. Return the minimum number of operations needed to have at least k consecutive black blocks. Use a fixed-size sliding window counting white blocks.',
        hasVisualization: true,
        tags: ['sliding window', 'string'],
      },
      {
        id: 'minimum-swaps-to-group-all-ones',
        title: 'Minimum Swaps to Group All 1s Together II',
        leetcodeNumber: 2134,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a circular binary array data, return the minimum number of swaps required to group all 1s in any location in the circular array. Count total 1s, then use a sliding window of that size to find the window with the maximum number of 1s already in place.',
        hasVisualization: true,
        tags: ['sliding window', 'array', 'circular', 'greedy'],
      },
      {
        id: 'number-of-smooth-descent-periods',
        title: 'Number of Smooth Descent Periods of a Stock',
        leetcodeNumber: 2110,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array prices, a smooth descent period is a contiguous subarray where each element is exactly 1 less than the previous. Count the total number of smooth descent periods (including single-element subarrays). Use sliding window tracking current run length.',
        hasVisualization: true,
        tags: ['sliding window', 'math', 'array'],
      },
      {
        id: 'number-of-substrings-with-only-ones',
        title: 'Number of Substrings With Only 1s',
        leetcodeNumber: 1513,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary string s, return the number of substrings with all characters equal to 1. Since the answer may be large, return it modulo 10^9+7. Track the current run of consecutive 1s: for each new 1, it extends all previous runs plus creates one new single-char substring.',
        hasVisualization: true,
        tags: ['sliding window', 'string', 'math'],
      },
      {
        id: 'subarray-product-less-than-k',
        title: 'Subarray Product Less Than K',
        leetcodeNumber: 713,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of integers nums and an integer k, return the number of contiguous subarrays where the product of all elements is strictly less than k. Use a sliding window where you expand right and shrink left when product >= k.',
        hasVisualization: true,
        tags: ['sliding window', 'array', 'two pointers'],
      },
      {
        id: 'take-k-characters-from-left-and-right',
        title: 'Take K of Each Character From Left and Right',
        leetcodeNumber: 2516,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s containing only a, b, c and an integer k, each minute take one character from the left or right end. Return the minimum number of minutes to have taken at least k of each character. Use sliding window to find the largest middle portion to skip.',
        hasVisualization: true,
        tags: ['sliding window', 'string', 'hash map'],
      },
    
      {
        id: 'binary-subarrays-with-sum-iii',
        title: 'Binary Subarrays with Sum III',
        leetcodeNumber: 930,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary array nums and an integer goal, return the number of non-empty subarrays with a sum equal to goal. Uses the prefix sum + hash map approach: for each position, count how many previous prefix sums equal (currentSum - goal), giving O(n) time and O(n) space.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Hash Map', 'Prefix Sum', 'Two Pointers'],
      },
      {
        id: 'count-of-range-sum-ii',
        title: 'Count of Range Sum II',
        leetcodeNumber: 327,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums and a range [lower, upper], return the number of range sums that lie in [lower, upper] inclusive. A range sum S(i, j) is defined as the sum of elements in nums between indices i and j. Uses merge sort on prefix sums for O(n log n) time.',
        hasVisualization: true,
        tags: ['Binary Indexed Tree', 'Merge Sort', 'Prefix Sum', 'Divide and Conquer'],
      },
      {
        id: 'count-of-smaller-ii',
        title: 'Count of Smaller Numbers After Self II',
        leetcodeNumber: 315,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums, return an array counts where counts[i] is the number of smaller elements to the right of nums[i]. Uses a modified merge sort that tracks indices to count inversions, achieving O(n log n) time complexity.',
        hasVisualization: true,
        tags: ['Merge Sort', 'Binary Indexed Tree', 'Divide and Conquer'],
      },
      {
        id: 'count-subarrays-with-fixed-bounds-ii',
        title: 'Count Subarrays with Fixed Bounds II',
        leetcodeNumber: 2444,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums and two integers minK and maxK, return the number of fixed-bound subarrays. A fixed-bound subarray must contain both minK and maxK as its minimum and maximum. Track the last position of minK, maxK, and any out-of-range element to compute the count efficiently.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Array', 'Queue'],
      },
      {
        id: 'fruits-into-baskets-iii',
        title: 'Fruits Into Baskets III',
        leetcodeNumber: 904,
        difficulty: 'Medium' as Difficulty,
        description:
          'You have two baskets, and each basket can carry any quantity of fruit but only one type. Given an array of fruit types, find the maximum number of fruits you can pick by starting from any tree and picking from consecutive trees (at most 2 distinct types). Classic sliding window with at most k=2 distinct elements.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Hash Map', 'Two Pointers', 'Array'],
      },
      {
        id: 'grumpy-bookstore-owner-iii',
        title: 'Grumpy Bookstore Owner III',
        leetcodeNumber: 1052,
        difficulty: 'Medium' as Difficulty,
        description:
          'A bookstore owner can suppress grumpiness for minutes consecutive minutes. Given customers[] and grumpy[], find the max customers satisfied. Base = sum of customers where owner is not grumpy. Bonus = max extra customers gained by the sliding window of size minutes where grumpy=1. Answer = base + max bonus.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Array', 'Greedy'],
      },
      {
        id: 'longest-nice-subarray-ii',
        title: 'Longest Nice Subarray II',
        leetcodeNumber: 2401,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of positive integers, find the longest subarray where the bitwise AND of every pair of adjacent elements is 0 (no bit is shared between any two elements). Use a sliding window and track used bits. When a new element shares bits with used bits, shrink the window from the left.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Bit Manipulation', 'Two Pointers'],
      },
      {
        id: 'longest-subarray-with-sum-k',
        title: 'Longest Subarray with Sum K',
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array and a target sum k, find the length of the longest subarray with sum exactly equal to k. Uses prefix sums with a hash map: for each prefix sum, check if (prefixSum - k) exists in the map. The first occurrence index is stored to maximize the length.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Hash Map', 'Sliding Window', 'Array'],
      },
      {
        id: 'maximum-erasure-value-ii',
        title: 'Maximum Erasure Value II',
        leetcodeNumber: 1695,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of positive integers nums, find the maximum sum of a subarray with all unique elements. When a duplicate is found, shrink the window from the left until the duplicate is removed. Track the maximum window sum seen.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Hash Set', 'Two Pointers', 'Array'],
      },
      {
        id: 'maximum-gap-ii',
        title: 'Maximum Gap II',
        leetcodeNumber: 164,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an unsorted array, find the maximum difference between successive elements in its sorted form. Must run in O(n) time and space. Uses bucket sort (radix sort variant): create n+1 buckets, place each element in a bucket, then check gaps between consecutive non-empty buckets.',
        hasVisualization: true,
        tags: ['Sorting', 'Bucket Sort', 'Radix Sort', 'Array'],
      },
      {
        id: 'maximum-points-from-cards-ii',
        title: 'Maximum Points from Cards II',
        leetcodeNumber: 1423,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array cardPoints and integer k, pick exactly k cards from either the left or right end to maximize total points. Insight: instead of choosing k cards from ends, find the minimum sum subarray of size n-k in the middle. The answer is totalSum minus that minimum subarray sum.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Prefix Sum', 'Array', 'Greedy'],
      },
      {
        id: 'maximum-product-subarray-ii',
        title: 'Maximum Product Subarray II',
        leetcodeNumber: 152,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums, find a contiguous subarray that has the largest product and return its product. Track both the maximum and minimum product ending at each position because a negative number can flip min to max. Uses dynamic programming with O(n) time and O(1) space.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Array', 'Greedy'],
      },
      {
        id: 'maximum-subarray-divide-conquer',
        title: 'Maximum Subarray (Divide and Conquer)',
        leetcodeNumber: 53,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the maximum sum subarray using divide and conquer. Split the array in half, recursively find the max subarray in each half, and find the max crossing subarray (spans both halves). The maximum of these three is the answer. Time complexity: O(n log n).',
        hasVisualization: true,
        tags: ['Divide and Conquer', 'Array', 'Dynamic Programming'],
      },
      {
        id: 'median-of-data-stream',
        title: 'Median of Data Stream',
        leetcodeNumber: 295,
        difficulty: 'Hard' as Difficulty,
        description:
          'Design a data structure that supports adding integers and finding the median at any time. Use two heaps: a max-heap for the lower half and a min-heap for the upper half. Keep them balanced so the median can be computed in O(1).',
        hasVisualization: true,
        tags: ['Heap', 'Two Pointers', 'Data Stream', 'Design'],
      },
      {
        id: 'minimum-operations-to-reduce-x-ii',
        title: 'Minimum Operations to Reduce X to Zero II',
        leetcodeNumber: 1658,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums and integer x, find the minimum number of operations to reduce x to exactly 0 by removing elements from the left or right ends. Instead of tracking removed elements, find the longest subarray with sum = totalSum - x. The answer is n minus that subarray length.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Hash Map', 'Two Pointers', 'Prefix Sum'],
      },
      {
        id: 'minimum-size-subarray-sum-advanced',
        title: 'Minimum Size Subarray Sum (Advanced)',
        leetcodeNumber: 209,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If no such subarray, return 0. Uses a sliding window: expand right, shrink left when sum >= target. Track minimum window length.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Two Pointers', 'Binary Search', 'Prefix Sum'],
      },
      {
        id: 'range-sum-query-2d-mutable',
        title: 'Range Sum Query 2D Mutable',
        leetcodeNumber: 308,
        difficulty: 'Hard' as Difficulty,
        description:
          'Design a data structure for a 2D matrix that supports update operations and range sum queries. Use a 2D Binary Indexed Tree (Fenwick Tree) for O(log m * log n) updates and queries. Each query asks for the sum of a rectangular submatrix.',
        hasVisualization: true,
        tags: ['Binary Indexed Tree', 'Segment Tree', 'Design', 'Matrix'],
      },
      {
        id: 'reverse-pairs-ii',
        title: 'Reverse Pairs II',
        leetcodeNumber: 493,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums, return the number of reverse pairs. A reverse pair is (i, j) where i < j and nums[i] > 2 * nums[j]. Uses modified merge sort to count pairs during the merge step in O(n log n) time.',
        hasVisualization: true,
        tags: ['Merge Sort', 'Binary Indexed Tree', 'Divide and Conquer'],
      },
      {
        id: 'shortest-subarray-with-sum-at-least-k-ii',
        title: 'Shortest Subarray with Sum at Least K II',
        leetcodeNumber: 862,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums (may contain negatives) and an integer k, return the length of the shortest non-empty subarray with a sum of at least k. If there is no such subarray, return -1. Uses prefix sums combined with a monotonic deque to achieve O(n) time.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Deque', 'Prefix Sum', 'Monotonic Queue'],
      },
      {
        id: 'skyline-problem-ii',
        title: 'Skyline Problem II',
        leetcodeNumber: 218,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a list of buildings represented as [left, right, height], return the skyline outline. The skyline is a list of key points [x, height] where the maximum height changes. Uses a max-heap to track active building heights as we sweep from left to right.',
        hasVisualization: true,
        tags: ['Heap', 'Divide and Conquer', 'Sweep Line', 'Sorted Set'],
      },
      {
        id: 'sliding-window-median-ii',
        title: 'Sliding Window Median II',
        leetcodeNumber: 480,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array nums and a window size k, find the median of each window as it slides from left to right. Use two heaps (max-heap for lower half, min-heap for upper half) and a lazy deletion map to efficiently maintain the sliding window.',
        hasVisualization: true,
        tags: ['Heap', 'Sliding Window', 'Two Pointers', 'Sorting'],
      },
      {
        id: 'subarray-product-less-than-k-ii',
        title: 'Subarray Product Less Than K II',
        leetcodeNumber: 713,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of positive integers nums and a positive integer k, return the number of contiguous subarrays where the product of all elements is strictly less than k. Uses a sliding window: expand right, shrink left when product >= k. Each valid right pointer adds (right - left + 1) new subarrays.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Two Pointers', 'Array'],
      },
      {
        id: 'subarrays-with-k-different-integers-ii',
        title: 'Subarrays with K Different Integers II',
        leetcodeNumber: 992,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums and an integer k, return the number of good subarrays (with exactly k different integers). Key insight: count(exactly k) = count(at most k) - count(at most k-1). Use two sliding windows with ',
        hasVisualization: true,
        tags: ['Sliding Window', 'Hash Map', 'Two Pointers', 'Array'],
      },
      {
        id: 'trapping-rain-water-3d',
        title: 'Trapping Rain Water 3D',
        leetcodeNumber: 407,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an m x n matrix of non-negative integers representing the height of each unit cell in a 2D elevation map, compute the volume of water it can trap after raining. Uses a min-heap (priority queue) to process cells from the boundary inward, tracking water level.',
        hasVisualization: true,
        tags: ['Heap', 'BFS', 'Matrix', 'Priority Queue'],
      },
    ],
  },

  // ─── 06. Binary Search ─────────────────────────────────────────────
  {
    id: 'binary-search',
    name: 'Binary Search',
    icon: '⟁',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-cyan-600/10',
    borderColor: 'border-cyan-500/30',
    problems: [
      {
        id: 'find-the-insertion-index',
        title: 'Find the Insertion Index',
        difficulty: 'Easy',
        leetcodeNumber: 35,
        description:
          'Find the index where a target should be inserted in a sorted array to maintain order.',
        hasVisualization: true,
        tags: ['binary-search', 'array'],
      },
      {
        id: 'first-and-last-occurrences',
        title: 'First and Last Occurrences',
        difficulty: 'Medium',
        leetcodeNumber: 34,
        description:
          'Find the first and last positions of a target value in a sorted array using two binary searches.',
        hasVisualization: true,
        tags: ['binary-search', 'array'],
      },
      {
        id: 'cutting-wood',
        title: 'Cutting Wood',
        difficulty: 'Medium',
        leetcodeNumber: 875,
        description:
          'Binary search on the answer to find the optimal cutting height that yields at least the required amount of wood.',
        hasVisualization: true,
        tags: ['binary-search', 'greedy'],
      },
      {
        id: 'find-target-in-rotated-sorted-array',
        title: 'Find Target in Rotated Sorted Array',
        difficulty: 'Medium',
        leetcodeNumber: 33,
        description:
          'Search for a target in a sorted array that has been rotated at an unknown pivot.',
        hasVisualization: true,
        tags: ['binary-search', 'array'],
      },
      {
        id: 'find-median-from-two-sorted-arrays',
        title: 'Find Median From Two Sorted Arrays',
        difficulty: 'Hard',
        leetcodeNumber: 4,
        description:
          'Find the median of two sorted arrays in O(log(min(m,n))) time by binary searching the partition point.',
        hasVisualization: true,
        tags: ['binary-search', 'array', 'divide-and-conquer'],
      },
      {
        id: 'matrix-search',
        title: 'Matrix Search',
        difficulty: 'Medium',
        leetcodeNumber: 74,
        description:
          'Search for a target in a row-sorted matrix by treating it as a virtual flattened sorted array.',
        hasVisualization: true,
        tags: ['binary-search', 'matrix'],
      },
      {
        id: 'local-maxima-in-array',
        title: 'Local Maxima in Array',
        difficulty: 'Medium',
        leetcodeNumber: 162,
        description:
          'Find a peak element in an array where neighbors are unequal using binary search on the gradient.',
        hasVisualization: true,
        tags: ['binary-search', 'array'],
      },
      {
        id: 'weighted-random-selection',
        title: 'Weighted Random Selection',
        difficulty: 'Medium',
        leetcodeNumber: 528,
        description:
          'Pick an index at random with probability proportional to its weight using prefix sums and binary search.',
        hasVisualization: true,
        tags: ['binary-search', 'prefix-sum', 'random'],
      },
      {
        id: 'capacity-to-ship-packages',
        title: 'Capacity to Ship Packages Within D Days',
        difficulty: 'Medium',
        leetcodeNumber: 1011,
        description:
          'Find the minimum ship capacity to ship all packages in at most d days. Binary search on the capacity: the minimum is max(weights) and the maximum is sum(weights). For each candidate capacity, greedily simulate shipping to check feasibility.',
        hasVisualization: true,
        tags: ['binary-search', 'reedy', 'array'],
      },
      {
        id: 'find-first-bad-version',
        title: 'First Bad Version',
        difficulty: 'Easy',
        leetcodeNumber: 278,
        description:
          'Given n versions [1, 2, ..., n], find the first bad version using a provided isBadVersion API. Once a version is bad all subsequent versions are bad. Binary search halves the search space each iteration, achieving O(log n) API calls.',
        hasVisualization: true,
        tags: ['binary-search', 'interactive', 'divide-and-conquer'],
      },
      {
        id: 'find-k-closest-elements',
        title: 'Find K Closest Elements',
        difficulty: 'Medium',
        leetcodeNumber: 658,
        description:
          'Find k closest elements to target x in a sorted array. Binary search for the left boundary of the window: compare the distance of arr[mid] and arr[mid+k] from x to decide whether to shift the window left or right. Returns a sorted window of size k.',
        hasVisualization: true,
        tags: ['binary-search', 'array', 'sorted', 'sliding-window'],
      },
      {
        id: 'find-minimum-rotated-sorted-array',
        title: 'Find Minimum in Rotated Sorted Array',
        difficulty: 'Medium',
        leetcodeNumber: 153,
        description:
          'Find the minimum element in a sorted array that has been rotated at an unknown pivot. Use binary search: if the left half is sorted, the minimum is either in the right half or at left; otherwise it is in the left half. Achieves O(log n) time.',
        hasVisualization: true,
        tags: ['binary-search', 'array', 'rotated', 'minimum'],
      },
      {
        id: 'magnetic-force-between-balls',
        title: 'Magnetic Force Between Two Balls',
        difficulty: 'Medium',
        leetcodeNumber: 1552,
        description:
          'Place m balls into baskets at given positions to maximize the minimum magnetic force (distance) between any two balls. Binary search on the answer: for each candidate minimum distance, greedily check if m balls can be placed. O(n log n + n log(max_dist)) time.',
        hasVisualization: true,
        tags: ['binary-search', 'reedy', 'sorting', 'array'],
      },
      {
        id: 'search-2d-matrix-ii',
        title: 'Search a 2D Matrix II',
        difficulty: 'Medium',
        leetcodeNumber: 240,
        description:
          'Search for a target in an m x n matrix where each row is sorted left-to-right and each column is sorted top-to-bottom. Start from the top-right corner and eliminate a row or column at each step, achieving O(m + n) time.',
        hasVisualization: true,
        tags: ['binary-search', 'matrix', 'two-pointers', 'divide-and-conquer'],
      },
      {
        id: 'single-element-sorted-array',
        title: 'Single Element in a Sorted Array',
        difficulty: 'Medium',
        leetcodeNumber: 540,
        description:
          'Find the single element in a sorted array where every other element appears exactly twice. Use binary search: at each mid, check the pairing to determine which side the single element is on. Works in O(log n) time and O(1) space.',
        hasVisualization: true,
        tags: ['binary-search', 'array', 'sorted', 'bit-manipulation'],
      },
      {
        id: 'split-array-largest-sum',
        title: 'Split Array Largest Sum',
        difficulty: 'Hard',
        leetcodeNumber: 410,
        description:
          'Split an array into k non-empty subarrays to minimize the largest subarray sum. Binary search on the answer: the range is [max(nums), sum(nums)]. For each candidate mid, check if it is feasible to split into at most k subarrays with each subarray sum <= mid.',
        hasVisualization: true,
        tags: ['binary-search', 'dynamic-programming', 'reedy', 'array'],
      },
      {
        id: 'sqrt-of-x',
        title: 'Sqrt(x)',
        difficulty: 'Easy',
        leetcodeNumber: 69,
        description:
          'Compute the integer square root of x (floor of the true square root) using binary search. The answer lies in [0, x]. At each mid, check if mid*mid <= x < (mid+1)*(mid+1). Achieves O(log x) time without using built-in sqrt functions.',
        hasVisualization: true,
        tags: ['binary-search', 'math', 'integer-square-root'],
      },
      {
        id: 'time-based-key-value-store',
        title: 'Time Based Key-Value Store',
        difficulty: 'Medium',
        leetcodeNumber: 981,
        description:
          'Design a key-value store that supports set(key, value, timestamp) and get(key, timestamp) operations. For get, return the value set at the largest timestamp <= the given timestamp. Binary search over the sorted list of timestamps for each key to achieve O(log n) lookup.',
        hasVisualization: true,
        tags: ['binary-search', 'hash-map', 'design', 'sorted'],
      },
    
      {
        id: 'arranging-coins',
        title: 'Arranging Coins',
        leetcodeNumber: 441,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given n coins, arrange them in a staircase shape where the k-th row has exactly k coins. Return the number of complete rows. Uses binary search on the number of rows: the total coins for k rows is k*(k+1)/2, so binary search finds the largest k where this is at most n.',
        hasVisualization: true,
        tags: ['binary search', 'math', 'staircase'],
      },
      {
        id: 'count-negative-numbers',
        title: 'Count Negative Numbers in a Sorted Matrix',
        leetcodeNumber: 1351,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an m x n matrix where rows and columns are sorted in non-increasing order, count the number of negative numbers. For each row, use binary search to find the first negative number and count negatives in that row. Total O(m log n) time.',
        hasVisualization: true,
        tags: ['binary search', 'matrix', 'sorting'],
      },
      {
        id: 'find-peak-element-ii',
        title: 'Find a Peak Element II',
        leetcodeNumber: 1901,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an m x n matrix where no two adjacent cells are equal, find any peak element where the element is strictly greater than its neighbors. Binary search on columns: for each mid column find the row maximum, then decide direction based on neighbors.',
        hasVisualization: true,
        tags: ['binary search', 'matrix', 'divide and conquer'],
      },
      {
        id: 'find-right-interval',
        title: 'Find Right Interval',
        leetcodeNumber: 436,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of intervals, for each interval find the index of the minimum interval whose start point is greater than or equal to the end point of the current interval. Sort interval start points, then for each interval use binary search to find the earliest start >= current end.',
        hasVisualization: true,
        tags: ['binary search', 'sorting', 'intervals'],
      },
      {
        id: 'find-smallest-letter-greater-than-target',
        title: 'Find Smallest Letter Greater Than Target',
        leetcodeNumber: 744,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a sorted array of lowercase English letters and a target letter, find the smallest letter in the array that is greater than the target. The letters wrap around, so if no letter is greater, return the first letter in the array.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'string'],
      },
      {
        id: 'find-target-indices-after-sorting',
        title: 'Find Target Indices After Sorting Array',
        leetcodeNumber: 2089,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer array and a target, sort the array and return the list of indices where the target appears. Use binary search to find the first and last occurrence of target in the sorted array, then generate the index list in O(log n) time.',
        hasVisualization: true,
        tags: ['binary search', 'sorting', 'array'],
      },
      {
        id: 'guess-number-higher-or-lower',
        title: 'Guess Number Higher or Lower',
        leetcodeNumber: 374,
        difficulty: 'Easy' as Difficulty,
        description:
          'A number guessing game where a secret number is picked. The guess API returns -1 if the guess is too high, 1 if too low, and 0 if correct. Binary search is used to find the secret number efficiently in O(log n) time.',
        hasVisualization: true,
        tags: ['binary search', 'interactive'],
      },
      {
        id: 'house-robber-iv',
        title: 'House Robber IV',
        leetcodeNumber: 2560,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given house values and a minimum number of houses k to rob, find the minimum possible maximum robbery (capability) such that the robber can steal from at least k houses without robbing two adjacent houses. Binary search on capability, greedily check feasibility.',
        hasVisualization: true,
        tags: ['binary search', 'greedy', 'dynamic programming'],
      },
      {
        id: 'koko-eating-bananas',
        title: 'Koko Eating Bananas',
        leetcodeNumber: 875,
        difficulty: 'Medium' as Difficulty,
        description:
          'Koko loves bananas. Given piles of bananas and h hours, find the minimum eating speed k such that all piles can be finished within h hours. Each hour Koko eats k bananas from one pile. Binary search on the speed, checking feasibility using ceil(pile/k) for each pile.',
        hasVisualization: true,
        tags: ['binary search', 'greedy', 'array'],
      },
      {
        id: 'kth-smallest-number-multiplication-table',
        title: 'Kth Smallest Number in Multiplication Table',
        leetcodeNumber: 668,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an m x n multiplication table and k, find the kth smallest number. Binary search on the value from 1 to m*n: for each candidate x, count how many entries in the table are <= x by summing min(x/i, n) for each row i from 1 to m.',
        hasVisualization: true,
        tags: ['binary search', 'math', 'matrix'],
      },
      {
        id: 'maximum-number-of-removable-characters',
        title: 'Maximum Number of Removable Characters',
        leetcodeNumber: 1898,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given strings s and p, and array removable of indices, find the maximum k such that p is still a subsequence of s after removing the first k indices from removable. Binary search on k: for each candidate remove those indices and check if p is a subsequence.',
        hasVisualization: true,
        tags: ['binary search', 'string', 'greedy'],
      },
      {
        id: 'median-of-two-sorted-arrays-ii',
        title: 'Median of Two Sorted Arrays (Merge Approach)',
        leetcodeNumber: 4,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the median of two sorted arrays using a merge-based approach. Merge the two arrays step by step until reaching the median position. For odd total length return the middle element; for even total length return the average of the two middle elements. O((m+n)) time.',
        hasVisualization: true,
        tags: ['binary search', 'merge', 'sorting', 'median'],
      },
      {
        id: 'minimize-max-distance-to-gas-station',
        title: 'Minimize Max Distance to Gas Station',
        leetcodeNumber: 774,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given sorted gas station positions and k additional stations to add, minimize the maximum distance between consecutive stations. Binary search on the answer (floating point): for each candidate max distance D, count how many additional stations are needed by dividing each gap by D.',
        hasVisualization: true,
        tags: ['binary search', 'greedy', 'math', 'floating point'],
      },
      {
        id: 'minimum-speed-to-arrive-on-time',
        title: 'Minimum Speed to Arrive on Time',
        leetcodeNumber: 1870,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given train ride distances and a total time limit, find the minimum integer speed so all trains can be completed in time. Trains run sequentially and each non-last train time is rounded up to the next integer. Binary search on speed from 1 to 10^7.',
        hasVisualization: true,
        tags: ['binary search', 'math', 'greedy'],
      },
      {
        id: 'minimum-time-to-complete-trips',
        title: 'Minimum Time to Complete Trips',
        leetcodeNumber: 2187,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given bus trip times and a required total number of trips, find the minimum time needed. Each bus independently completes floor(time/tripTime) trips. Binary search on the answer: check if a given time allows enough total trips across all buses.',
        hasVisualization: true,
        tags: ['binary search', 'greedy', 'math'],
      },
      {
        id: 'nth-magical-number',
        title: 'Nth Magical Number',
        leetcodeNumber: 878,
        difficulty: 'Hard' as Difficulty,
        description:
          'A magical number is a positive integer divisible by either a or b. Given n, a, b, find the nth magical number modulo 10^9+7. Binary search on the value: count magical numbers up to mid using inclusion-exclusion with LCM(a, b).',
        hasVisualization: true,
        tags: ['binary search', 'math', 'lcm', 'gcd'],
      },
      {
        id: 'peak-index-in-mountain-array',
        title: 'Peak Index in Mountain Array',
        leetcodeNumber: 852,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a mountain array where elements increase to a peak then decrease, find the index of the peak element. Binary search compares the mid element with its neighbor: if arr[mid] < arr[mid+1], the peak is to the right; otherwise it is at or to the left of mid.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'mountain array'],
      },
      {
        id: 'preimage-size-of-factorial-zeroes',
        title: 'Preimage Size of Factorial Zeroes Function',
        leetcodeNumber: 793,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given k, find how many non-negative integers n have exactly k trailing zeroes in n!. Trailing zeroes come from factors of 5. The count of zeroes for n! is sum of floor(n/5^i). Binary search finds the first n with >= k and >= k+1 zeroes, and the answer is their difference.',
        hasVisualization: true,
        tags: ['binary search', 'math', 'factorial'],
      },
      {
        id: 'random-pick-with-weight',
        title: 'Random Pick with Weight',
        leetcodeNumber: 528,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of weights, implement pickIndex() to randomly pick an index proportional to its weight. Build a prefix sum array, generate a random number in [1, total], then binary search the prefix sums to find the corresponding index.',
        hasVisualization: true,
        tags: ['binary search', 'prefix sum', 'random', 'math'],
      },
      {
        id: 'search-a-2d-matrix',
        title: 'Search a 2D Matrix',
        leetcodeNumber: 240,
        difficulty: 'Medium' as Difficulty,
        description:
          'Search for a target value in an m x n matrix where each row is sorted and each column is sorted. Start from the top-right corner: if the value equals target return true; if value is greater move left; if smaller move down. O(m + n) time.',
        hasVisualization: true,
        tags: ['binary search', 'matrix', 'two pointers'],
      },
      {
        id: 'search-in-sorted-array-of-unknown-size',
        title: 'Search in a Sorted Array of Unknown Size',
        leetcodeNumber: 702,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a sorted array accessible only via a get(index) API (returns a large number for out-of-bounds), find the target. First expand the search window exponentially until the right boundary exceeds the target, then apply standard binary search within that window.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'exponential search'],
      },
      {
        id: 'search-insert-position',
        title: 'Search Insert Position',
        leetcodeNumber: 35,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a sorted array and a target value, return the index if the target is found. If not found, return the index where it would be inserted to keep the array sorted. Uses binary search for O(log n) time complexity with step-by-step tracking.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'sorted'],
      },
      {
        id: 'special-array-with-x-elements',
        title: 'Special Array With X Elements Greater Than or Equal X',
        leetcodeNumber: 1608,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array of non-negative integers, find a number x such that exactly x elements in the array are greater than or equal to x. The array is not modified. Binary search on x from 0 to n, checking each candidate by counting elements >= x.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'counting'],
      },
      {
        id: 'successful-pairs-of-spells-and-potions',
        title: 'Successful Pairs of Spells and Potions',
        leetcodeNumber: 2300,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given spells and potions arrays and a success threshold, for each spell find how many potions create a successful pair where spell * potion >= success. Sort potions, then binary search to find the first potion that succeeds for each spell.',
        hasVisualization: true,
        tags: ['binary search', 'sorting', 'two pointers'],
      },
      {
        id: 'valid-perfect-square',
        title: 'Valid Perfect Square',
        leetcodeNumber: 367,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a positive integer num, return true if it is a perfect square without using built-in square root functions. Binary search checks if any integer mid in [1, num] satisfies mid*mid == num. Eliminates half the search space each iteration.',
        hasVisualization: true,
        tags: ['binary search', 'math'],
      },
    
      {
        id: 'aggressive-cows',
        title: 'Aggressive Cows',
        difficulty: 'Hard' as Difficulty,
        description:
          'Given stall positions and c cows, find the maximum possible minimum distance between any two cows. Binary search on the minimum distance: check if we can place c cows such that any two are at least that distance apart.',
        hasVisualization: true,
        tags: ['binary search', 'greedy', 'sorting', 'classic'],
      },
      {
        id: 'allocate-minimum-pages',
        title: 'Allocate Minimum Pages',
        difficulty: 'Medium' as Difficulty,
        description:
          'Given books with page counts and m students, allocate contiguous books to each student minimizing the maximum pages any student reads. Binary search on the answer (max pages): check if m students suffice for that page limit.',
        hasVisualization: true,
        tags: ['binary search', 'greedy', 'array', 'classic'],
      },
      {
        id: 'book-allocation-problem',
        title: 'Book Allocation Problem',
        difficulty: 'Medium' as Difficulty,
        description:
          'Variant of the book allocation problem: given n books and m students, allocate contiguous books so the student reading the most pages reads as few as possible. Demonstrates the binary search on answer pattern with a feasibility check function.',
        hasVisualization: true,
        tags: ['binary search', 'greedy', 'array', 'classic'],
      },
      {
        id: 'count-of-smaller-numbers-after-self',
        title: 'Count of Smaller Numbers After Self',
        leetcodeNumber: 315,
        difficulty: 'Hard' as Difficulty,
        description:
          'For each element in nums, count how many numbers to its right are smaller. Process from right to left maintaining a sorted list; use binary search to find the insertion position, which equals the count of smaller elements seen so far.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'divide and conquer', 'sorted list'],
      },
      {
        id: 'cutting-ribbons',
        title: 'Cutting Ribbons',
        leetcodeNumber: 1891,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given ribbons of various lengths and integer k, find the maximum length you can cut each ribbon into such that you get at least k pieces. Binary search on the ribbon length from 1 to max(ribbons).',
        hasVisualization: true,
        tags: ['binary search', 'array', 'greedy'],
      },
      {
        id: 'find-kth-smallest-pair-distance',
        title: 'Find K-th Smallest Pair Distance',
        leetcodeNumber: 719,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array, find the k-th smallest distance among all pairs. Sort the array, then binary search on the answer: count how many pairs have distance <= mid using a sliding window. Find the smallest distance where count >= k.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'sorting', 'sliding window', 'two pointers'],
      },
      {
        id: 'find-peak-element',
        title: 'Find Peak Element',
        leetcodeNumber: 162,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find a peak element (strictly greater than its neighbors) in O(log n). Binary search: if nums[mid] < nums[mid+1], the peak is to the right; otherwise it is at mid or to the left.',
        hasVisualization: true,
        tags: ['binary search', 'array'],
      },
      {
        id: 'h-index-ii',
        title: 'H-Index II',
        leetcodeNumber: 275,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given citations sorted in ascending order, find the researcher h-index: the maximum h such that the researcher has h papers each cited at least h times. Binary search on h in O(log n) time.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'sorted', 'h-index'],
      },
      {
        id: 'heaters',
        title: 'Heaters',
        leetcodeNumber: 475,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given positions of houses and heaters, find the minimum radius so every house is covered by at least one heater. Sort heaters, then binary search to find the closest heater for each house; the answer is the maximum of all minimum distances.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'sorting', 'greedy'],
      },
      {
        id: 'is-subsequence',
        title: 'Is Subsequence',
        leetcodeNumber: 392,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given strings s and t, determine if s is a subsequence of t. Use a two-pointer greedy approach: advance the s-pointer whenever characters match. Binary search variant: preprocess t character positions for efficient multi-query use.',
        hasVisualization: true,
        tags: ['binary search', 'two pointers', 'string', 'greedy'],
      },
      {
        id: 'longest-increasing-subsequence-bs',
        title: 'Longest Increasing Subsequence (Binary Search)',
        leetcodeNumber: 300,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the length of the longest strictly increasing subsequence using patience sorting with binary search. Maintain a tails array where tails[i] is the smallest tail element of any LIS of length i+1. Binary search to find where each new element fits.',
        hasVisualization: true,
        tags: ['binary search', 'dynamic programming', 'patience sorting', 'array'],
      },
      {
        id: 'maximum-running-time-of-n-computers',
        title: 'Maximum Running Time of N Computers',
        leetcodeNumber: 2141,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n computers and batteries with given capacities, find the maximum time T all n computers can run simultaneously. Binary search on T: check if total energy sufficient = min(battery, T) summed >= n*T.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'greedy'],
      },
      {
        id: 'maximum-value-at-given-index',
        title: 'Maximum Value at a Given Index in a Bounded Array',
        leetcodeNumber: 1802,
        difficulty: 'Medium' as Difficulty,
        description:
          'Build an array of n positive integers where the sum is at most maxSum, and maximize the value at index. Binary search on the peak value: for a given peak, compute the minimum sum needed and check if it fits within maxSum.',
        hasVisualization: true,
        tags: ['binary search', 'greedy', 'math'],
      },
      {
        id: 'minimum-limit-of-balls-in-bag',
        title: 'Minimum Limit of Balls in a Bag',
        leetcodeNumber: 1760,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given bags of balls and maxOperations splits, minimize the maximum number of balls in any bag. Binary search on the answer: for a given max bag size, count how many splits are needed and check if it is within maxOperations.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'greedy'],
      },
      {
        id: 'minimum-number-of-days-to-make-bouquets',
        title: 'Minimum Number of Days to Make m Bouquets',
        leetcodeNumber: 1482,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given bloom days for each flower, find the minimum number of days to make m bouquets of k adjacent flowers. Binary search on the answer (number of days): check if by day d we have enough groups of k consecutive bloomed flowers to form m bouquets.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'greedy'],
      },
      {
        id: 'missing-element-in-sorted-array',
        title: 'Missing Element in Sorted Array',
        leetcodeNumber: 1060,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a sorted array with no duplicates, find the k-th missing number. The number of missing integers before index i is nums[i] - nums[0] - i. Binary search for the leftmost position where missing count >= k.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'sorted'],
      },
      {
        id: 'online-election',
        title: 'Online Election',
        leetcodeNumber: 911,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given arrays of persons who voted at each time, answer queries about who is leading at time t. Precompute the leader at each vote time, then binary search for the largest time <= t to find the leader.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'design', 'precomputation'],
      },
      {
        id: 'painters-partition',
        title: 'Painters Partition Problem',
        difficulty: 'Hard' as Difficulty,
        description:
          'Given boards and k painters (each paints a contiguous segment), minimize the maximum time any painter spends. Binary search on the answer (max time): check if k painters can finish all boards within that time limit.',
        hasVisualization: true,
        tags: ['binary search', 'greedy', 'array', 'classic'],
      },
      {
        id: 'russian-doll-envelopes',
        title: 'Russian Doll Envelopes',
        leetcodeNumber: 354,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given envelopes with width and height, find the maximum number you can nest (each must be strictly larger in both dimensions). Sort by width ascending, height descending for same width, then find Longest Increasing Subsequence on heights using binary search (patience sorting).',
        hasVisualization: true,
        tags: ['binary search', 'dynamic programming', 'LIS', 'sorting'],
      },
      {
        id: 'search-in-rotated-sorted-array-ii',
        title: 'Search in Rotated Sorted Array II',
        leetcodeNumber: 81,
        difficulty: 'Medium' as Difficulty,
        description:
          'Search for a target in a rotated sorted array that may contain duplicates. When duplicates are present at both ends we cannot determine which half is sorted, so we shrink both pointers by one and continue binary search.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'rotated', 'duplicates'],
      },
      {
        id: 'single-element-in-sorted-array-bs',
        title: 'Single Element in a Sorted Array (Binary Search)',
        leetcodeNumber: 540,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the single non-duplicate element in a sorted array where every other element appears exactly twice. Binary search on even indices: if nums[mid] == nums[mid+1], the single element is to the right; otherwise it is at mid or to the left.',
        hasVisualization: true,
        tags: ['binary search', 'array', 'bit manipulation'],
      },
      {
        id: 'smallest-divisor-given-threshold',
        title: 'Find the Smallest Divisor Given a Threshold',
        leetcodeNumber: 1283,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the smallest divisor such that the sum of ceil(nums[i] / divisor) for all i is at most threshold. Binary search on the divisor from 1 to max(nums).',
        hasVisualization: true,
        tags: ['binary search', 'array', 'math'],
      },
      {
        id: 'snapshot-array',
        title: 'Snapshot Array',
        leetcodeNumber: 1146,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a SnapshotArray that supports set(index, val), snap(), and get(index, snap_id). Each index stores a list of (snap_id, val) pairs. For get queries, binary search the snap history to find the latest value at or before the given snap_id.',
        hasVisualization: true,
        tags: ['binary search', 'design', 'array'],
      },
      {
        id: 'split-array-largest-sum-bs',
        title: 'Split Array Largest Sum (Binary Search)',
        leetcodeNumber: 410,
        difficulty: 'Hard' as Difficulty,
        description:
          'Split an array into k non-empty subarrays to minimize the largest subarray sum. Binary search on the answer: find the minimum possible maximum subarray sum by checking feasibility using a greedy left-to-right scan.',
        hasVisualization: true,
        tags: ['binary search', 'greedy', 'array', 'dynamic programming'],
      },
      {
        id: 'sum-of-mutated-array-closest-to-target',
        title: 'Sum of Mutated Array Closest to Target',
        leetcodeNumber: 1300,
        difficulty: 'Medium' as Difficulty,
        description:
          'Choose a value such that when every element greater than this value is replaced by it, the array sum is as close as possible to the target. Binary search on the mutation value from 0 to max(arr).',
        hasVisualization: true,
        tags: ['binary search', 'array', 'sorting'],
      },
    ],
  },

  // ─── 07. Stacks ────────────────────────────────────────────────────
  {
    id: 'stacks',
    name: 'Stacks',
    icon: '▤',
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-orange-600/10',
    borderColor: 'border-orange-500/30',
    problems: [
      {
        id: 'valid-parentheses',
        title: 'Valid Parenthesis Expression',
        difficulty: 'Easy',
        leetcodeNumber: 20,
        description:
          'Determine if a string of brackets is valid by using a stack to match opening and closing pairs.',
        hasVisualization: true,
        tags: ['stack', 'string'],
      },
      {
        id: 'next-largest-number-to-the-right',
        title: 'Next Largest Number to the Right',
        difficulty: 'Medium',
        leetcodeNumber: 496,
        description:
          'For each element, find the next greater element to its right using a monotonic stack.',
        hasVisualization: true,
        tags: ['stack', 'array', 'monotonic-stack'],
      },
      {
        id: 'evaluate-expression',
        title: 'Evaluate Expression',
        difficulty: 'Hard',
        leetcodeNumber: 224,
        description:
          'Evaluate a mathematical expression string with parentheses, addition, and subtraction using a stack.',
        hasVisualization: true,
        tags: ['stack', 'string', 'math'],
      },
      {
        id: 'repeated-removal-of-adjacent-duplicates',
        title: 'Repeated Removal of Adjacent Duplicates',
        difficulty: 'Medium',
        leetcodeNumber: 1209,
        description:
          'Remove all adjacent groups of k duplicate characters repeatedly using a stack-based approach.',
        hasVisualization: true,
        tags: ['stack', 'string'],
      },
      {
        id: 'implement-queue-using-stacks',
        title: 'Implement Queue using Stacks',
        difficulty: 'Easy',
        leetcodeNumber: 232,
        description:
          'Implement a FIFO queue using only two LIFO stacks with amortized O(1) operations.',
        hasVisualization: true,
        tags: ['stack', 'queue', 'design'],
      },
      {
        id: 'maximums-of-sliding-window',
        title: 'Maximums of Sliding Window',
        difficulty: 'Hard',
        leetcodeNumber: 239,
        description:
          'Find the maximum value in each sliding window of size k using a monotonic deque.',
        hasVisualization: true,
        tags: ['stack', 'deque', 'sliding-window'],
      },
      {
        id: 'asteroid-collision',
        title: 'Asteroid Collision',
        difficulty: 'Medium',
        leetcodeNumber: 735,
        description:
          'Given an array of integers representing asteroids (positive = moving right, negative = moving left), simulate collisions. When a right-moving asteroid meets a left-moving one, the smaller explodes; equal sizes both explode. Use a stack to simulate this.',
        hasVisualization: true,
        tags: ['stack', 'array', 'simulation'],
      },
      {
        id: 'basic-calculator-ii',
        title: 'Basic Calculator II',
        difficulty: 'Medium',
        leetcodeNumber: 227,
        description:
          'Evaluate a string expression with +, -, *, / operators and non-negative integers (no parentheses). Use a stack: push values directly for + and -, apply * and / immediately with the stack top. Sum the stack for the result.',
        hasVisualization: true,
        tags: ['stack', 'string', 'math'],
      },
      {
        id: 'car-fleet',
        title: 'Car Fleet',
        difficulty: 'Medium',
        leetcodeNumber: 853,
        description:
          'Determine how many car fleets arrive at a target destination. Sort cars by position (descending). Compute each car\'s time-to-target. Use a stack: if the current car arrives after (or equal to) the car ahead, it forms a new fleet; otherwise it merges and inherits the slower time.',
        hasVisualization: true,
        tags: ['stack', 'array', 'sorting', 'greedy'],
      },
      {
        id: 'daily-temperatures',
        title: 'Daily Temperatures',
        difficulty: 'Medium',
        leetcodeNumber: 739,
        description:
          'Given an array of daily temperatures, return an array where each element is the number of days until a warmer temperature. Use a monotonic decreasing stack of indices. When a warmer temperature is found, pop all colder indices and compute the wait.',
        hasVisualization: true,
        tags: ['stack', 'array', 'monotonic-stack'],
      },
      {
        id: 'decode-string',
        title: 'Decode String',
        difficulty: 'Medium',
        leetcodeNumber: 394,
        description:
          'Decode an encoded string like ',
        hasVisualization: true,
        tags: ['stack', 'string', 'recursion'],
      },
      {
        id: 'design-circular-queue',
        title: 'Design Circular Queue',
        difficulty: 'Medium',
        leetcodeNumber: 622,
        description:
          'Implement a circular queue with fixed capacity using an array. Track head and tail pointers with modular arithmetic. enQueue adds at tail, deQueue removes from head. The circular design reuses freed space efficiently.',
        hasVisualization: true,
        tags: ['stack', 'queue', 'design', 'array'],
      },
      {
        id: 'design-hit-counter',
        title: 'Design Hit Counter',
        difficulty: 'Medium',
        leetcodeNumber: 362,
        description:
          'Design a hit counter that counts hits in the past 5 minutes (300 seconds). Use a queue to store hit timestamps. When getHits(t) is called, evict timestamps older than t-300 from the front of the queue, then return the queue size.',
        hasVisualization: true,
        tags: ['stack', 'queue', 'design', 'hash-map'],
      },
      {
        id: 'exclusive-time-of-functions',
        title: 'Exclusive Time of Functions',
        difficulty: 'Medium',
        leetcodeNumber: 636,
        description:
          'Given n functions and a list of call logs (id:start/end:timestamp), calculate the exclusive execution time of each function. Use a stack of active function IDs. When a new event occurs, update the current top function\'s time by the elapsed time since the last timestamp.',
        hasVisualization: true,
        tags: ['stack', 'array', 'string'],
      },
      {
        id: 'generate-parentheses',
        title: 'Generate Parentheses',
        difficulty: 'Medium',
        leetcodeNumber: 22,
        description:
          'Generate all combinations of well-formed parentheses for n pairs. Use a stack-based backtracking approach: maintain a current string (stack), adding ',
        hasVisualization: true,
        tags: ['stack', 'string', 'backtracking', 'recursion'],
      },
      {
        id: 'largest-rectangle-histogram',
        title: 'Largest Rectangle in Histogram',
        difficulty: 'Hard',
        leetcodeNumber: 84,
        description:
          'Find the largest rectangle area in a histogram. Use a monotonic increasing stack of indices. When a bar shorter than the stack top is encountered, pop and compute the area extending leftward from the popped index.',
        hasVisualization: true,
        tags: ['stack', 'array', 'monotonic-stack'],
      },
      {
        id: 'min-stack',
        title: 'Min Stack',
        difficulty: 'Medium',
        leetcodeNumber: 155,
        description:
          'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1). The key insight is to maintain a parallel ',
        hasVisualization: true,
        tags: ['stack', 'design'],
      },
      {
        id: 'moving-average-data-stream',
        title: 'Moving Average from Data Stream',
        difficulty: 'Easy',
        leetcodeNumber: 346,
        description:
          'Calculate the moving average of a data stream with a fixed window size. Use a queue to maintain the window: add new values to the back, remove from the front when the window exceeds the size. Track the running sum for O(1) average computation.',
        hasVisualization: true,
        tags: ['stack', 'queue', 'design', 'sliding-window'],
      },
      {
        id: 'next-greater-element-ii',
        title: 'Next Greater Element II',
        difficulty: 'Medium',
        leetcodeNumber: 503,
        description:
          'Find the next greater element for each element in a circular array. Iterate the array twice (2n) using modulo to simulate circularity. Use a monotonic decreasing stack of indices. When a greater element is found, pop and record the result.',
        hasVisualization: true,
        tags: ['stack', 'array', 'monotonic-stack'],
      },
      {
        id: 'number-of-recent-calls',
        title: 'Number of Recent Calls',
        difficulty: 'Easy',
        leetcodeNumber: 933,
        description:
          'Count the number of requests in the last 3000 milliseconds (inclusive). Use a queue: add each new timestamp to the back, then remove timestamps from the front that fall outside the [t-3000, t] window. The queue size is the answer.',
        hasVisualization: true,
        tags: ['stack', 'queue', 'design', 'sliding-window'],
      },
      {
        id: 'online-stock-span',
        title: 'Online Stock Span',
        difficulty: 'Medium',
        leetcodeNumber: 901,
        description:
          'Design a class that collects daily stock prices and returns the span — the number of consecutive days (including today) where the price was less than or equal to today\'s price. Use a monotonic stack storing (price, span) pairs.',
        hasVisualization: true,
        tags: ['stack', 'design', 'monotonic-stack'],
      },
      {
        id: 'remove-k-digits',
        title: 'Remove K Digits',
        difficulty: 'Medium',
        leetcodeNumber: 402,
        description:
          'Remove k digits from a number string to make the smallest possible number. Use a monotonic increasing stack: for each digit, pop from the stack while the top is larger than the current digit and k > 0. The stack gives the final digits. Handle leading zeros and remaining k removals.',
        hasVisualization: true,
        tags: ['stack', 'string', 'greedy', 'monotonic-stack'],
      },
      {
        id: 'reverse-polish-notation',
        title: 'Evaluate Reverse Polish Notation',
        difficulty: 'Medium',
        leetcodeNumber: 150,
        description:
          'Evaluate an expression in Reverse Polish Notation (postfix). Numbers are pushed onto the stack. When an operator is encountered, pop two operands, apply the operator, and push the result. The final stack value is the answer.',
        hasVisualization: true,
        tags: ['stack', 'array', 'math'],
      },
      {
        id: 'simplify-path',
        title: 'Simplify Path',
        difficulty: 'Medium',
        leetcodeNumber: 71,
        description:
          'Simplify a Unix file path by resolving ',
        hasVisualization: true,
        tags: ['stack', 'string'],
      },
      {
        id: 'task-scheduler',
        title: 'Task Scheduler',
        difficulty: 'Medium',
        leetcodeNumber: 621,
        description:
          'Find the minimum number of CPU intervals needed to execute all tasks with a cooldown n between same-task executions. The optimal formula: find the most frequent task count (maxFreq), compute intervals = max(tasks.length, (maxFreq-1)*(n+1) + maxFreqCount).',
        hasVisualization: true,
        tags: ['stack', 'array', 'greedy', 'hash-map'],
      },
      {
        id: 'validate-stack-sequences',
        title: 'Validate Stack Sequences',
        difficulty: 'Medium',
        leetcodeNumber: 946,
        description:
          'Given two sequences pushed and popped, return true if they could be the result of a push and pop sequence on an initially empty stack. Simulate: push elements one by one, and after each push, check if we can pop matching elements from the popped sequence.',
        hasVisualization: true,
        tags: ['stack', 'array', 'simulation'],
      },
    
      {
        id: 'backspace-string-compare-stack',
        title: 'Backspace String Compare (Stack)',
        leetcodeNumber: 844,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given two strings s and t, return true if they are equal when both are typed into empty text editors. The hash character represents a backspace. Use a stack to process each string: push regular characters, pop on backspace. Then compare the resulting stacks.',
        hasVisualization: true,
        tags: ['stack', 'string', 'two pointers', 'simulation'],
      },
      {
        id: 'build-array-with-stack-operations',
        title: 'Build an Array With Stack Operations',
        leetcodeNumber: 1441,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a target array and an integer n, the stream reads integers 1 to n in order. Using push and pop operations, build the target array. For each number in 1..n: always push. If it is not in target, also pop it. Return the sequence of operations.',
        hasVisualization: true,
        tags: ['stack', 'simulation', 'array'],
      },
      {
        id: 'check-if-word-is-valid-after-substitutions',
        title: 'Check If Word Is Valid After Substitutions',
        leetcodeNumber: 1003,
        difficulty: 'Medium' as Difficulty,
        description:
          'A string is valid if it can be formed by starting with an empty string and repeatedly inserting "abc" anywhere. Given a string, check if it is valid. Use a stack: push each character, and whenever the top three stack characters are "a","b","c" (in order), pop all three. The string is valid if the stack is empty at the end.',
        hasVisualization: true,
        tags: ['stack', 'string', 'simulation'],
      },
      {
        id: 'crawler-log-folder',
        title: 'Crawler Log Folder',
        leetcodeNumber: 1598,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a list of file system operations, find the minimum number of steps to return to the main folder. "../" moves up one directory (decrement depth, min 0), "./" stays in current directory, and any other string moves into a child folder (increment depth). Use a counter tracking current folder depth.',
        hasVisualization: true,
        tags: ['stack', 'simulation', 'file system', 'string'],
      },
      {
        id: 'decoded-string-at-index',
        title: 'Decoded String at Index',
        leetcodeNumber: 880,
        difficulty: 'Medium' as Difficulty,
        description:
          'An encoded string is built by reading characters left to right: letters are appended, digits d repeat the current string d times. Find the k-th character of the fully decoded string (1-indexed) without fully decoding it. Work backwards: compute the decoded length at each position, then trace back to find which character maps to position k.',
        hasVisualization: true,
        tags: ['stack', 'string', 'reverse traversal', 'math'],
      },
      {
        id: 'design-food-rating-system',
        title: 'Design a Food Rating System',
        leetcodeNumber: 2353,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a food rating system that stores food names, cuisines, and ratings. Support changing a food rating and querying the highest-rated food per cuisine. Use a heap per cuisine along with hash maps for food-to-rating and food-to-cuisine lookups. Use lazy deletion in the heap on stale entries.',
        hasVisualization: true,
        tags: ['heap', 'hash map', 'design', 'lazy deletion'],
      },
      {
        id: 'design-front-middle-back-queue',
        title: 'Design Front Middle Back Queue',
        leetcodeNumber: 1670,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a queue that supports pushFront, pushMiddle, pushBack, popFront, popMiddle, and popBack in O(1) time. Use two deques: a left half and a right half, keeping them balanced so that the right deque has at most one extra element. Rebalance after each operation.',
        hasVisualization: true,
        tags: ['design', 'deque', 'queue', 'simulation'],
      },
      {
        id: 'design-most-recently-used-queue',
        title: 'Design Most Recently Used Queue',
        leetcodeNumber: 1756,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a queue where fetch(k) returns the k-th element from the front (1-indexed), removes it from its position, and appends it to the end. Use a Fenwick tree for O(log n) position lookups, or simulate with an array for clarity. Each fetch moves the element to the back of the queue.',
        hasVisualization: true,
        tags: ['design', 'queue', 'fenwick tree', 'ordered set'],
      },
      {
        id: 'design-ordered-stream',
        title: 'Design an Ordered Stream',
        leetcodeNumber: 1656,
        difficulty: 'Easy' as Difficulty,
        description:
          'Design an ordered stream of n items. Each item has an id (1-indexed) and a value. When inserting at id i, store the value. Then advance a pointer ptr starting at 1: while data[ptr] is filled, collect it and move ptr forward. Return the collected chunk. Items arrive out of order but output is always in order.',
        hasVisualization: true,
        tags: ['design', 'array', 'simulation', 'stream'],
      },
      {
        id: 'design-parking-system',
        title: 'Design Parking System',
        leetcodeNumber: 1603,
        difficulty: 'Easy' as Difficulty,
        description:
          'Design a parking system for a parking lot with three sizes of parking spaces: big, medium, and small. Initialize with counts for each size. For each addCar call, check if a space of the given type is available. If yes, decrement the count and return true; otherwise return false.',
        hasVisualization: true,
        tags: ['design', 'simulation', 'array', 'counting'],
      },
      {
        id: 'design-twitter',
        title: 'Design Twitter',
        leetcodeNumber: 355,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a simplified Twitter where users can post tweets, follow/unfollow other users, and retrieve the 10 most recent tweets in their news feed. Use a global timestamp, a hash map for tweets per user, and a hash map for followees per user. The feed merges tweets using a max-heap on timestamps.',
        hasVisualization: true,
        tags: ['heap', 'hash map', 'design', 'linked list'],
      },
      {
        id: 'design-underground-system',
        title: 'Design Underground System',
        leetcodeNumber: 1396,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a system to track customer check-in and check-out times at metro stations, then answer queries about the average travel time between two stations. Use two hash maps: one for active trips (id -> station, time) and one for accumulated route data (route -> total time, count).',
        hasVisualization: true,
        tags: ['hash map', 'design', 'simulation', 'average'],
      },
      {
        id: 'evaluate-reverse-polish-notation-ii',
        title: 'Evaluate Reverse Polish Notation II',
        leetcodeNumber: 150,
        difficulty: 'Medium' as Difficulty,
        description:
          'Evaluate an expression given in Reverse Polish Notation (postfix). This variant supports additional operators including modulo and power. Operands are pushed onto a stack; when an operator is encountered, pop two operands, apply the operator, and push the result.',
        hasVisualization: true,
        tags: ['stack', 'math', 'postfix', 'expression evaluation'],
      },
      {
        id: 'flatten-nested-list',
        title: 'Flatten Nested List Iterator',
        leetcodeNumber: 341,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a nested list of integers, flatten it into a single list using a stack. Push all items from the end to the front. When processing, if the top is an integer output it; if it is a list, pop it and push its elements back onto the stack from end to front.',
        hasVisualization: true,
        tags: ['stack', 'design', 'iterator', 'nested structure'],
      },
      {
        id: 'implement-stack-using-queues',
        title: 'Implement Stack using Queues',
        leetcodeNumber: 225,
        difficulty: 'Easy' as Difficulty,
        description:
          'Implement a last-in-first-out stack using only two queues. The push operation enqueues the new element then rotates all previous elements behind it, so the front of the queue is always the top of the stack. Pop and top simply dequeue from the front.',
        hasVisualization: true,
        tags: ['queue', 'stack', 'design', 'simulation'],
      },
      {
        id: 'insert-delete-getrandom-duplicates',
        title: 'Insert Delete GetRandom O(1) - Duplicates Allowed',
        leetcodeNumber: 381,
        difficulty: 'Hard' as Difficulty,
        description:
          'Extend the O(1) insert/delete/getRandom set to allow duplicate values. The index map now stores a set of indices for each value. During removal, use any one index from the set, swap with the last element, and update both sets. getRandom picks uniformly across all elements including duplicates.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'design', 'randomized', 'duplicates'],
      },
      {
        id: 'insert-delete-getrandom',
        title: 'Insert Delete GetRandom O(1)',
        leetcodeNumber: 380,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a data structure that supports insert, delete, and getRandom in average O(1) time. Use an array for O(1) random access and a hash map to store each value\'s index. For deletion, swap the target with the last element, update the map, then pop the array end.',
        hasVisualization: true,
        tags: ['hash map', 'array', 'design', 'randomized'],
      },
      {
        id: 'largest-rectangle-in-histogram-ii',
        title: 'Largest Rectangle in Histogram (Alternative)',
        leetcodeNumber: 84,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array of bar heights in a histogram, find the largest rectangle area. This alternative monotonic stack approach appends a 0-height sentinel bar at the end. Maintain an increasing stack. When a shorter bar is seen, pop and compute area using the current index as the right boundary and the new stack top as the left boundary.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'array', 'histogram', 'math'],
      },
      {
        id: 'longest-valid-parentheses',
        title: 'Longest Valid Parentheses',
        leetcodeNumber: 32,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a string containing only parentheses, find the length of the longest valid (well-formed) parentheses substring. Use a stack initialized with -1 as a base index. Push indices of opening brackets; on closing brackets pop and compute length using current index minus new stack top.',
        hasVisualization: true,
        tags: ['stack', 'string', 'dynamic programming', 'parentheses'],
      },
      {
        id: 'make-the-string-great',
        title: 'Make The String Great',
        leetcodeNumber: 1544,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string, repeatedly remove adjacent pairs where one letter is lowercase and the other is the same letter uppercase. Return the resulting string after all such removals. Use a stack: for each character, check if it forms a bad pair with the stack top (same letter, different case), and pop if so, otherwise push.',
        hasVisualization: true,
        tags: ['stack', 'string', 'greedy'],
      },
      {
        id: 'max-nesting-depth-of-parentheses',
        title: 'Maximum Nesting Depth of Parentheses',
        leetcodeNumber: 1614,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a valid parenthesized string, find the maximum nesting depth. Track the current depth with a counter: increment on "(", decrement on ")", and record the maximum depth seen. Equivalently, use a stack and track its maximum size.',
        hasVisualization: true,
        tags: ['stack', 'string', 'depth', 'parentheses'],
      },
      {
        id: 'maximal-rectangle',
        title: 'Maximal Rectangle',
        leetcodeNumber: 85,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a binary matrix filled with 0s and 1s, find the largest rectangle containing only 1s. Build a histogram row by row: for each row, heights[j] is the count of consecutive 1s ending at that row in column j. Then apply the largest rectangle in histogram algorithm using a monotonic stack on each row.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'matrix', 'histogram', 'dynamic programming'],
      },
      {
        id: 'maximum-frequency-stack',
        title: 'Maximum Frequency Stack',
        leetcodeNumber: 895,
        difficulty: 'Hard' as Difficulty,
        description:
          'Design a stack-like data structure that pushes and pops the most frequent element. If there is a tie, pop the most recently added among the most frequent. Use a frequency map and a map from frequency to a stack of elements at that frequency level.',
        hasVisualization: true,
        tags: ['stack', 'hash map', 'design', 'frequency'],
      },
      {
        id: 'maximum-width-ramp',
        title: 'Maximum Width Ramp',
        leetcodeNumber: 962,
        difficulty: 'Medium' as Difficulty,
        description:
          'A ramp in an integer array nums is a pair (i, j) where i < j and nums[i] <= nums[j]. The width of such a ramp is j - i. Find the maximum width. Build a decreasing stack of candidate left boundaries, then scan from right to find the furthest left boundary where nums[i] <= nums[j].',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'array', 'greedy'],
      },
      {
        id: 'minimum-add-valid-parentheses',
        title: 'Minimum Add to Make Parentheses Valid',
        leetcodeNumber: 921,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a parentheses string, find the minimum number of parentheses to add to make it valid. Track unmatched "(" with an open counter and unmatched ")" with a close counter. The answer is open + close.',
        hasVisualization: true,
        tags: ['stack', 'greedy', 'string', 'counting'],
      },
      {
        id: 'minimum-cost-tree-from-leaf-values',
        title: 'Minimum Cost Tree from Leaf Values',
        leetcodeNumber: 1130,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of leaf values, build a binary tree where each non-leaf node value equals the product of its left and right subtree maximums. Minimize the sum of all non-leaf node values. Use a monotonic decreasing stack: when a leaf is smaller than its neighbors, multiply it with the smaller neighbor and add to the answer.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'greedy', 'dynamic programming', 'tree'],
      },
      {
        id: 'minimum-remove-valid-parentheses',
        title: 'Minimum Remove to Make Valid Parentheses',
        leetcodeNumber: 1249,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string with parentheses and letters, remove the minimum number of parentheses to make it valid. A valid string has no unmatched parentheses. Use a stack to track unmatched open parentheses and mark invalid ones for removal.',
        hasVisualization: true,
        tags: ['stack', 'string', 'greedy'],
      },
      {
        id: 'next-greater-element-i',
        title: 'Next Greater Element I',
        leetcodeNumber: 496,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given two arrays nums1 (a subset of nums2), for each element in nums1 find the next greater element in nums2. The next greater element is the first element to the right in nums2 that is strictly greater. Use a monotonic stack on nums2 to build a hash map of element to its next greater, then look up each nums1 element.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'hash map', 'array'],
      },
      {
        id: 'number-of-visible-people',
        title: 'Number of Visible People in a Queue',
        leetcodeNumber: 1944,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array of heights representing people standing in a queue, return an array where result[i] is the number of people that person i can see. Person i can see person j (j > i) if all people between them are shorter than both. Use a monotonic decreasing stack scanning from right to left.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'array', 'queue'],
      },
      {
        id: 'remove-all-adjacent-duplicates',
        title: 'Remove All Adjacent Duplicates In String',
        leetcodeNumber: 1047,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string s, repeatedly remove all adjacent pairs of duplicate characters until no more can be removed. Use a stack: push each character if it differs from the stack top, otherwise pop the top (both characters cancel out).',
        hasVisualization: true,
        tags: ['stack', 'string', 'greedy'],
      },
      {
        id: 'remove-duplicate-letters',
        title: 'Remove Duplicate Letters',
        leetcodeNumber: 316,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string, remove duplicate letters so that every letter appears exactly once. The result must be the smallest lexicographic order among all possible results. Use a greedy monotonic stack: if the current character is smaller than the stack top and the top appears again later, pop the top.',
        hasVisualization: true,
        tags: ['stack', 'greedy', 'string', 'monotonic stack', 'lexicographic'],
      },
      {
        id: 'score-of-parentheses',
        title: 'Score of Parentheses',
        leetcodeNumber: 856,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a balanced parentheses string, return its score. The scoring rules are: "()" has score 1, "AB" (concatenation) has score A+B, and "(A)" has score 2*A. Use a stack to track scores at each nesting level. On "(", push 0. On ")", pop and if value is 0 push 1, else push 2 * value.',
        hasVisualization: true,
        tags: ['stack', 'string', 'parentheses', 'scoring'],
      },
      {
        id: 'shortest-unsorted-continuous-subarray-stack',
        title: 'Shortest Unsorted Continuous Subarray (Stack)',
        leetcodeNumber: 581,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the length of the shortest contiguous subarray that, if sorted, makes the whole array sorted. Use two monotonic stacks: scan left to right with an increasing stack to find the leftmost out-of-order index, then scan right to left with a decreasing stack to find the rightmost out-of-order index.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'array', 'sorting'],
      },
      {
        id: 'stock-price-fluctuation',
        title: 'Stock Price Fluctuation',
        leetcodeNumber: 2034,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a data structure that tracks stock prices at timestamps. Support update(timestamp, price), current() returning the latest price, maximum() and minimum() returning global max/min. Use a hash map for timestamp-to-price and two sorted multisets (simulated) for max and min queries.',
        hasVisualization: true,
        tags: ['design', 'hash map', 'sorted set', 'data structure'],
      },
      {
        id: 'sum-of-subarray-minimums',
        title: 'Sum of Subarray Minimums',
        leetcodeNumber: 907,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array, find the sum of min(b) for every subarray b. Use a monotonic increasing stack to find for each element, how many subarrays have that element as their minimum. For each element arr[i], calculate left span (distance to previous smaller) and right span (distance to next smaller or equal), then add arr[i] * left * right.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'array', 'math', 'modulo'],
      },
      {
        id: 'sum-of-subarray-ranges',
        title: 'Sum of Subarray Ranges',
        leetcodeNumber: 2104,
        difficulty: 'Medium' as Difficulty,
        description:
          'The range of an array is the difference between its largest and smallest elements. Given an integer array, return the sum of all subarray ranges. This equals (sum of subarray maximums) minus (sum of subarray minimums). Use two monotonic stack passes to compute both sums efficiently.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'array', 'math'],
      },
      {
        id: 'tag-validator',
        title: 'Tag Validator',
        leetcodeNumber: 591,
        difficulty: 'Hard' as Difficulty,
        description:
          'Validate XML-like code snippets. A valid code must have a closed tag, the tag name must be uppercase with 1-9 characters, tags must be properly nested (use a stack), and CDATA sections are allowed. Parse the string character by character tracking open tags on a stack.',
        hasVisualization: true,
        tags: ['stack', 'string', 'parsing', 'xml', 'validation'],
      },
      {
        id: 'trapping-rain-water-stack',
        title: 'Trapping Rain Water (Stack)',
        leetcodeNumber: 42,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an elevation map where each bar has unit width, compute how much rain water can be trapped after raining. The stack approach maintains a monotonic decreasing stack of indices. When we find a bar taller than the top, we pop and calculate trapped water between the new bar and the remaining stack top.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'array', 'water trapping'],
      },
      {
        id: 'valid-parenthesis-string',
        title: 'Valid Parenthesis String',
        leetcodeNumber: 678,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string with "(", ")", and "*" characters (where "*" can be "(", ")", or empty), check if the string is valid. Use two counters: lo (minimum open count) and hi (maximum open count) to track the range of possible open parenthesis counts.',
        hasVisualization: true,
        tags: ['stack', 'greedy', 'string', 'two pointers'],
      },
    
      {
        id: '132-pattern',
        title: '132 Pattern',
        leetcodeNumber: 456,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of integers, find if there is a 132 pattern: indices i < j < k such that nums[i] < nums[k] < nums[j]. Use a monotonic stack traversing from right to left. Maintain a variable ',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'array'],
      },
      {
        id: 'basic-calculator-iii',
        title: 'Basic Calculator III',
        leetcodeNumber: 772,
        difficulty: 'Hard' as Difficulty,
        description:
          'Implement a basic calculator to evaluate a simple expression string containing digits, spaces, plus (+), minus (-), multiply (*), divide (/), and parentheses. Use a stack to handle operator precedence and nested parentheses. Multiplication and division are applied immediately while addition and subtraction are deferred to the stack.',
        hasVisualization: true,
        tags: ['stack', 'math', 'string', 'recursion'],
      },
      {
        id: 'binary-tree-inorder-iterative',
        title: 'Binary Tree Inorder Traversal (Iterative)',
        leetcodeNumber: 94,
        difficulty: 'Easy' as Difficulty,
        description:
          'Perform inorder traversal (left, root, right) of a binary tree iteratively using an explicit stack. Repeatedly push nodes to the left, then process a node, then move to the right child. This avoids recursion overhead and explicitly shows the call stack behavior.',
        hasVisualization: true,
        tags: ['stack', 'tree', 'binary tree', 'inorder', 'iterative'],
      },
      {
        id: 'binary-tree-postorder-iterative',
        title: 'Binary Tree Postorder Traversal (Iterative)',
        leetcodeNumber: 145,
        difficulty: 'Easy' as Difficulty,
        description:
          'Perform postorder traversal (left, right, root) of a binary tree iteratively using an explicit stack. The trick is to do a modified preorder (root, right, left) and then reverse the result. Alternatively, use two stacks. This gives the correct postorder sequence without recursion.',
        hasVisualization: true,
        tags: ['stack', 'tree', 'binary tree', 'postorder', 'iterative'],
      },
      {
        id: 'binary-tree-preorder-iterative',
        title: 'Binary Tree Preorder Traversal (Iterative)',
        leetcodeNumber: 144,
        difficulty: 'Easy' as Difficulty,
        description:
          'Perform preorder traversal (root, left, right) of a binary tree iteratively using an explicit stack. Push the right child first, then the left child so the left is processed first. Visit the node immediately upon popping it from the stack.',
        hasVisualization: true,
        tags: ['stack', 'tree', 'binary tree', 'preorder', 'iterative'],
      },
      {
        id: 'car-fleet-ii',
        title: 'Car Fleet II',
        leetcodeNumber: 1776,
        difficulty: 'Hard' as Difficulty,
        description:
          'There are n cars on an infinite one-lane highway. For each car i, given its position and speed, compute the time at which it collides with the next car fleet. A car catches up to the one in front if it is faster. Use a monotonic stack processing cars from right to left to efficiently determine collision times.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'math', 'array'],
      },
      {
        id: 'check-if-parentheses-can-be-valid',
        title: 'Check if a Parentheses String Can Be Valid',
        leetcodeNumber: 2116,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a parentheses string s and a locked string where 0 means the character can be changed and 1 means it is locked, determine if s can be made valid. Use two stacks: one for locked open parens indices and one for unlocked (flexible) indices. On a locked close paren, match with a locked open or a flexible. Finally match remaining locked opens with flexible positions to the right.',
        hasVisualization: true,
        tags: ['stack', 'string', 'greedy', 'parentheses'],
      },
      {
        id: 'clear-digits',
        title: 'Clear Digits',
        leetcodeNumber: 3174,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a string containing lowercase letters and digits, repeatedly remove the leftmost digit and its closest non-digit character to the left. Use a stack: push letters onto the stack, and when a digit is encountered pop the top letter (removing the pair). Return the remaining characters in the stack.',
        hasVisualization: true,
        tags: ['stack', 'string', 'simulation'],
      },
      {
        id: 'count-collisions-on-road',
        title: 'Count Collisions on a Road',
        leetcodeNumber: 2211,
        difficulty: 'Medium' as Difficulty,
        description:
          'There are n cars on an infinite road. Each car moves Left or Right or Stopped. When a right-moving car collides with a left-moving or stopped car, all involved cars stop. Count the total number of collisions. Key insight: all leading Left cars and trailing Right cars never collide. Trim them and count remaining non-stopped cars as collisions.',
        hasVisualization: true,
        tags: ['stack', 'string', 'simulation', 'counting'],
      },
      {
        id: 'evaluate-bracket-pairs',
        title: 'Evaluate the Bracket Pairs of a String',
        leetcodeNumber: 1807,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s with bracket expressions like ',
        hasVisualization: true,
        tags: ['stack', 'string', 'hash map'],
      },
      {
        id: 'exclusive-time-of-functions-ii',
        title: 'Exclusive Time of Functions',
        leetcodeNumber: 636,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n functions and a list of log entries (function id, start/end, timestamp), compute the exclusive time of each function. Use a stack to track the currently running function. When a new function starts, add elapsed time to the current top function, then push the new one. When a function ends, finalize its time and pop it.',
        hasVisualization: true,
        tags: ['stack', 'array', 'simulation'],
      },
      {
        id: 'maximum-nesting-depth',
        title: 'Maximum Nesting Depth of the Parentheses',
        leetcodeNumber: 1614,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a valid parentheses string (VPS), return the nesting depth - the maximum number of open parentheses at any point. Track depth with a counter: increment on open paren, decrement on close paren, and record the maximum depth seen. This can also be visualized with a stack showing open parens.',
        hasVisualization: true,
        tags: ['stack', 'string', 'parentheses'],
      },
      {
        id: 'maximum-score-from-removing-substrings',
        title: 'Maximum Score From Removing Substrings',
        leetcodeNumber: 1717,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s and two integers x and y, you can remove substring ',
        hasVisualization: true,
        tags: ['stack', 'greedy', 'string'],
      },
      {
        id: 'maximum-subarray-min-product',
        title: 'Maximum Subarray Min-Product',
        leetcodeNumber: 1856,
        difficulty: 'Medium' as Difficulty,
        description:
          'The min-product of an array is defined as the minimum value of the array multiplied by the sum of the array. Given an array of positive integers, find the maximum min-product of any non-empty subarray. Use a monotonic stack to find the previous and next smaller elements for each index, then compute the sum of the subarray where each element is the minimum.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'prefix sum', 'array'],
      },
      {
        id: 'minimum-add-to-make-parentheses-valid',
        title: 'Minimum Add to Make Parentheses Valid',
        leetcodeNumber: 921,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a parentheses string, return the minimum number of parentheses additions needed to make the string valid. Use a stack: push unmatched open parentheses, and for each close paren either pop a matching open or count an unmatched close. The answer is the number of unmatched closes plus the remaining unmatched opens in the stack.',
        hasVisualization: true,
        tags: ['stack', 'string', 'greedy', 'parentheses'],
      },
      {
        id: 'minimum-number-of-swaps-for-balanced',
        title: 'Minimum Number of Swaps to Make the String Balanced',
        leetcodeNumber: 1963,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string of brackets that is a permutation of a balanced string, find the minimum number of swaps to make it balanced. Use a stack to count unmatched open brackets. Cancel matched pairs. Each swap fixes two unmatched brackets (one misplaced open and one misplaced close), so the answer is ceil(unmatched_open / 2).',
        hasVisualization: true,
        tags: ['stack', 'string', 'greedy', 'two pointers'],
      },
      {
        id: 'next-greater-node-linked-list',
        title: 'Next Greater Node In Linked List',
        leetcodeNumber: 1019,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the head of a linked list, return an array of the next greater node values. For each node, find the first node to the right with a strictly greater value. If no such node exists, output 0. Convert the linked list to an array, then use a monotonic decreasing stack to find the next greater element for each index.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'linked list', 'array'],
      },
      {
        id: 'number-of-atoms-stack',
        title: 'Number of Atoms (Stack Parsing)',
        leetcodeNumber: 726,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a chemical formula string like ',
        hasVisualization: true,
        tags: ['stack', 'hash map', 'string', 'sorting'],
      },
      {
        id: 'parsing-a-boolean-expression',
        title: 'Parsing A Boolean Expression',
        leetcodeNumber: 1106,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a string expression representing a boolean expression, return the value. Expressions include t (true), f (false), !(expr) (NOT), &(expr1,expr2,...) (AND), |(expr1,expr2,...) (OR). Use a stack to evaluate: push operators and values, and when a closing paren is encountered, pop all values until the operator, evaluate, and push the result.',
        hasVisualization: true,
        tags: ['stack', 'string', 'recursion', 'parsing'],
      },
      {
        id: 'remove-outermost-parentheses',
        title: 'Remove Outermost Parentheses',
        leetcodeNumber: 1021,
        difficulty: 'Easy' as Difficulty,
        description:
          'A valid parentheses string is primitive if it is non-empty and cannot be split into two non-empty valid parentheses strings. Given a valid parentheses string, remove the outermost parentheses of every primitive part and return the result. Track depth with a counter: the outermost open paren has depth 0 before incrementing, and the outermost close paren reduces depth to 0.',
        hasVisualization: true,
        tags: ['stack', 'string', 'parentheses'],
      },
      {
        id: 'removing-stars-from-string',
        title: 'Removing Stars From a String',
        leetcodeNumber: 2390,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string with letters and stars (*), repeatedly remove the closest non-star character to the left of each star (and the star itself). Return the result after all stars are removed. Use a stack: push letters onto the stack, and when a star is encountered pop the top element (removing the preceding letter).',
        hasVisualization: true,
        tags: ['stack', 'string', 'simulation'],
      },
      {
        id: 'reverse-substrings-between-parentheses',
        title: 'Reverse Substrings Between Each Pair of Parentheses',
        leetcodeNumber: 1190,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string with lowercase letters and parentheses, reverse the substrings in each pair of matching parentheses. Process from the innermost parentheses outward. Use a stack of character arrays: push a new buffer on open paren, and on close paren pop the top buffer, reverse it, and append to the buffer below.',
        hasVisualization: true,
        tags: ['stack', 'string', 'parentheses'],
      },
      {
        id: 'robot-collisions',
        title: 'Robot Collisions',
        leetcodeNumber: 2751,
        difficulty: 'Hard' as Difficulty,
        description:
          'There are n robots on a number line. Each robot has a position, health, and direction (Left or Right). Robots moving toward each other collide: the one with less health is removed, the survivor loses 1 health. Equal health both are removed. Use a stack of right-moving robots. When a left-moving robot appears, resolve collisions with stack top until one side wins or the stack is exhausted.',
        hasVisualization: true,
        tags: ['stack', 'simulation', 'array', 'sorting'],
      },
      {
        id: 'smallest-subsequence-of-distinct-chars',
        title: 'Smallest Subsequence of Distinct Characters',
        leetcodeNumber: 1081,
        difficulty: 'Medium' as Difficulty,
        description:
          'Return the lexicographically smallest subsequence of a string that contains all its distinct characters exactly once. Use a monotonic stack with a greedy approach: for each character, pop the stack top if it is larger than the current character AND the top character appears again later in the string. Skip characters already in the stack.',
        hasVisualization: true,
        tags: ['stack', 'monotonic stack', 'greedy', 'string', 'hash map'],
      },
      {
        id: 'using-robot-to-print-smallest',
        title: 'Using a Robot to Print the Lexicographically Smallest String',
        leetcodeNumber: 2434,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s and a robot that can push characters to a stack or pop from the stack to paper, return the lexicographically smallest string achievable. Greedily pop from the stack to paper whenever the top of the stack is less than or equal to the minimum character remaining in s. Otherwise push the next character from s.',
        hasVisualization: true,
        tags: ['stack', 'greedy', 'string', 'hash map'],
      },
    
      {
        id: 'beautiful-towers',
        title: 'Beautiful Towers',
        leetcodeNumber: 2866,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given maxHeights[], assign heights to towers such that they form a mountain shape (non-decreasing then non-increasing) and each height <= maxHeights[i]. Maximize the sum. For each peak candidate, use monotonic stacks to compute max sum of left and right sides.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Array', 'Dynamic Programming'],
      },
      {
        id: 'buildings-with-ocean-view',
        title: 'Buildings With Ocean View',
        leetcodeNumber: 1762,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of building heights, find all buildings that have an ocean view (to the right). A building has an ocean view if all buildings to its right are shorter. Use a monotonic decreasing stack: traverse right-to-left, maintaining the maximum height seen.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Array', 'Greedy'],
      },
      {
        id: 'constrained-subsequence-sum',
        title: 'Constrained Subsequence Sum',
        leetcodeNumber: 1425,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array nums and integer k, return the maximum sum of a non-empty subsequence where for every consecutive pair (i, j) in the subsequence, i < j <= i+k. Use DP with a monotonic deque to maintain the max dp value in the window of size k.',
        hasVisualization: true,
        tags: ['Stack', 'Deque', 'Monotonic Queue', 'Dynamic Programming', 'Hard'],
      },
      {
        id: 'create-maximum-number',
        title: 'Create Maximum Number',
        leetcodeNumber: 321,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given two integer arrays nums1 and nums2 of lengths m and n, create the maximum number of length k by picking digits from both arrays while maintaining relative order. For each split i+j=k, use monotonic stack to find best i-digit subsequence from each array, then merge the two.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Greedy', 'Hard'],
      },
      {
        id: 'daily-temperatures-iii',
        title: 'Daily Temperatures III (Advanced)',
        leetcodeNumber: 739,
        difficulty: 'Medium' as Difficulty,
        description:
          'An advanced variant of Daily Temperatures: for each day find how many days until a warmer temperature, AND find the second next greater element. Extend the classic monotonic stack to track multiple future temperature records per day.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Array', 'Extended Variant'],
      },
      {
        id: 'final-prices-with-special-discount-ii',
        title: 'Final Prices With Special Discount II',
        leetcodeNumber: 1475,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given prices[], for each item find the final price after applying the discount: the first item to the right with price <= current price. This is the classic ',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Array'],
      },
      {
        id: 'jump-game-vi-deque',
        title: 'Jump Game VI (Deque)',
        leetcodeNumber: 1696,
        difficulty: 'Medium' as Difficulty,
        description:
          'You are given an array nums and integer k. Starting at index 0, in each jump you can move at most k indices forward. Maximize the score (sum of chosen elements). Uses a monotonic deque to maintain the maximum dp value in the window of size k.',
        hasVisualization: true,
        tags: ['Stack', 'Deque', 'Monotonic Queue', 'Dynamic Programming', 'Sliding Window'],
      },
      {
        id: 'longest-well-performing-interval',
        title: 'Longest Well-Performing Interval',
        leetcodeNumber: 1124,
        difficulty: 'Medium' as Difficulty,
        description:
          'A day is ',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Prefix Sum', 'Hash Map'],
      },
      {
        id: 'max-chunks-to-make-sorted-i',
        title: 'Max Chunks To Make Sorted I',
        leetcodeNumber: 769,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a permutation of [0..n-1], find the maximum number of chunks to sort independently. Since values are a permutation, a chunk boundary exists at index i if max(arr[0..i]) == i. Equivalently, use a monotonic stack approach tracking chunk maxima.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Array', 'Greedy'],
      },
      {
        id: 'max-chunks-to-make-sorted-ii',
        title: 'Max Chunks To Make Sorted II',
        leetcodeNumber: 768,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array that may contain duplicates, find the maximum number of chunks it can be divided into such that sorting each chunk individually results in the whole array being sorted. Use a monotonic stack: maintain the max of each chunk; merge chunks when the next element is smaller than the top chunk\\',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Array', 'Greedy', 'Hard'],
      },
      {
        id: 'maximum-sum-circular-subarray-ii',
        title: 'Maximum Sum Circular Subarray II',
        leetcodeNumber: 918,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the maximum subarray sum in a circular array. The answer is either: 1) max non-circular subarray sum (Kadane\\',
        hasVisualization: true,
        tags: ['Stack', 'Deque', 'Monotonic Queue', 'Dynamic Programming', 'Prefix Sum'],
      },
      {
        id: 'maximum-width-ramp-stack',
        title: 'Maximum Width Ramp (Stack)',
        leetcodeNumber: 962,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the maximum width of a ramp (i, j) where i < j and nums[i] <= nums[j]. Build a monotonic decreasing stack of candidate left indices, then scan right-to-left trying to match each element with the largest valid left index.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Array', 'Two Pointers'],
      },
      {
        id: 'next-greater-element-iii',
        title: 'Next Greater Element III',
        leetcodeNumber: 556,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a positive 32-bit integer n, find the smallest integer that is greater than n and has exactly the same digits. Use a monotonic stack approach on the digit array: find the rightmost digit that can be swapped with a larger digit to its right.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Math', 'String'],
      },
      {
        id: 'next-greater-element-iv',
        title: 'Next Greater Element IV',
        leetcodeNumber: 2454,
        difficulty: 'Hard' as Difficulty,
        description:
          'For each index i, find the second next greater element (the next greater element of the next greater element). Use two monotonic stacks: the first processes the array and the second tracks elements waiting for their second greater element.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Array', 'Hard'],
      },
      {
        id: 'number-of-visible-people-in-queue',
        title: 'Number of Visible People in a Queue',
        leetcodeNumber: 1944,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given heights of people in a queue, for each person count how many others they can see to their right. Person i can see person j if all people between i and j are shorter than min(heights[i], heights[j]). Use a monotonic decreasing stack scanning right-to-left.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Array', 'Hard'],
      },
      {
        id: 'odd-even-jump',
        title: 'Odd Even Jump',
        leetcodeNumber: 975,
        difficulty: 'Hard' as Difficulty,
        description:
          'From each index you can make odd-numbered jumps (to the next greater or equal value) or even-numbered jumps (to the next smaller or equal value). Starting at each index, can you reach the end? Uses a monotonic stack + sorted index maps to find valid next jumps.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Dynamic Programming', 'Hard'],
      },
      {
        id: 'remove-k-digits-ii',
        title: 'Remove K Digits II',
        leetcodeNumber: 402,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string num and integer k, remove k digits to make the smallest possible number. Uses a monotonic non-decreasing stack: for each digit, while the stack top is greater than current and we still have removals left, pop the stack.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Greedy', 'String'],
      },
      {
        id: 'stamping-the-grid',
        title: 'Stamping the Grid',
        leetcodeNumber: 2132,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a binary grid and stamp dimensions, determine if you can cover all 0s with stamps (stampHeight x stampWidth rectangles) without covering any 1s. Uses 2D prefix sums to check valid stamp placement, combined with a difference array to mark stamp coverage.',
        hasVisualization: true,
        tags: ['Stack', 'Array', 'Greedy', 'Prefix Sum', '2D Grid', 'Hard'],
      },
      {
        id: 'steps-to-make-array-non-decreasing',
        title: 'Steps to Make Array Non-Decreasing',
        leetcodeNumber: 2289,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array, in one step remove all elements that are strictly less than the element immediately to their left. Return the number of steps until the array is non-decreasing. Use a monotonic stack where each entry tracks how many steps it takes for that element to ',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Array', 'Simulation'],
      },
      {
        id: 'stock-spanner-ii',
        title: 'Stock Spanner II',
        leetcodeNumber: 901,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a StockSpanner class that collects daily price quotes and returns the span of the stock price for the current day. The span is the maximum number of consecutive days (starting from today and going backwards) for which the price was <= today\\',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Design', 'Online Algorithm'],
      },
      {
        id: 'sum-of-subarray-minimums-ii',
        title: 'Sum of Subarray Minimums II',
        leetcodeNumber: 907,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the sum of min(b) over every subarray b. For each element, use a monotonic stack to find how many subarrays it is the minimum of. Contribution = arr[i] * left_count * right_count. Return sum mod 1e9+7.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Array', 'Math'],
      },
      {
        id: 'sum-of-total-strength-of-wizards',
        title: 'Sum of Total Strength of Wizards',
        leetcodeNumber: 2281,
        difficulty: 'Hard' as Difficulty,
        description:
          'For each subarray, total strength = min(subarray) * sum(subarray). Return the sum over all subarrays. Use a monotonic stack to find, for each wizard, all subarrays where it is the minimum, combined with prefix sums of prefix sums for O(n) computation.',
        hasVisualization: true,
        tags: ['Stack', 'Monotonic Stack', 'Prefix Sum', 'Math', 'Hard'],
      },
    ],
  },

  // ─── 08. Heaps ─────────────────────────────────────────────────────
  {
    id: 'heaps',
    name: 'Heaps',
    icon: '△',
    color: 'text-rose-400',
    gradient: 'from-rose-500/20 to-rose-600/10',
    borderColor: 'border-rose-500/30',
    problems: [
      {
        id: 'k-most-frequent-strings',
        title: 'K Most Frequent Strings',
        difficulty: 'Medium',
        leetcodeNumber: 692,
        description:
          'Find the k most frequently occurring strings using a hash map and a min-heap of size k.',
        hasVisualization: true,
        tags: ['heap', 'hash-map', 'sorting'],
      },
      {
        id: 'combine-sorted-linked-lists',
        title: 'Combine Sorted Linked Lists',
        difficulty: 'Hard',
        leetcodeNumber: 23,
        description:
          'Merge k sorted linked lists into one sorted list using a min-heap to always pick the smallest head.',
        hasVisualization: true,
        tags: ['heap', 'linked-list', 'merge'],
      },
      {
        id: 'median-of-integer-stream',
        title: 'Median of Integer Stream',
        difficulty: 'Hard',
        leetcodeNumber: 295,
        description:
          'Find the median from a continuous data stream efficiently using a max-heap and min-heap.',
        hasVisualization: true,
        tags: ['heap', 'design', 'stream'],
      },
      {
        id: 'sort-k-sorted-array',
        title: 'Sort K-Sorted Array',
        difficulty: 'Medium',
        description:
          'Sort a nearly sorted array where each element is at most k positions from its final position using a min-heap.',
        hasVisualization: true,
        tags: ['heap', 'array', 'sorting'],
      },
      {
        id: 'find-k-pairs-smallest-sums',
        title: 'Find K Pairs with Smallest Sums',
        difficulty: 'Medium',
        leetcodeNumber: 373,
        description:
          'Given two sorted arrays nums1 and nums2, find the k pairs (u, v) with the smallest sums. Use a min-heap seeded with (nums1[i], nums2[0]) for all i. Pop the smallest pair; if the popped pair used nums2[j], push (nums1[i], nums2[j+1]) if valid.',
        hasVisualization: true,
        tags: ['heap', 'array', 'sorting'],
      },
      {
        id: 'furthest-building-you-can-reach',
        title: 'Furthest Building You Can Reach',
        difficulty: 'Medium',
        leetcodeNumber: 1642,
        description:
          'Given building heights, bricks, and ladders, find the furthest building reachable. Moving from building i to i+1: if height doesn\'t increase, move freely. If height increases by diff, you can use bricks or a ladder. Greedy: use a ladder on the largest climbs encountered so far (use a min-heap to track ladder climbs; if needed, swap smallest ladder-climb with bricks).',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'array'],
      },
      {
        id: 'kth-smallest-sorted-matrix',
        title: 'Kth Smallest Element in Sorted Matrix',
        difficulty: 'Medium',
        leetcodeNumber: 378,
        description:
          'Find the kth smallest element in an n×n matrix where each row and column is sorted in ascending order. Use a min-heap: push the first element of each row with its coordinates. Pop the minimum k times; each time push the next element in the same row if available.',
        hasVisualization: true,
        tags: ['heap', 'matrix', 'array'],
      },
      {
        id: 'last-stone-weight',
        title: 'Last Stone Weight',
        difficulty: 'Easy',
        leetcodeNumber: 1046,
        description:
          'You have stones with weights. Each turn, pick the two heaviest stones and smash them together. If equal, both are destroyed; if different, the smaller is destroyed and the larger loses the smaller stone\'s weight. Repeat until at most one stone remains. Use a max-heap to efficiently pick the two heaviest stones.',
        hasVisualization: true,
        tags: ['heap', 'array', 'simulation'],
      },
      {
        id: 'reorganize-string',
        title: 'Reorganize String',
        difficulty: 'Medium',
        leetcodeNumber: 767,
        description:
          'Rearrange characters of a string so no two adjacent characters are the same. Use a max-heap (priority queue) ordered by frequency. Repeatedly pick the most frequent character, append to result, then restore the previously picked character back to the heap.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'string'],
      },
    
      {
        id: 'find-k-closest-elements-ii',
        title: 'Find K Closest Elements (Heap Approach)',
        leetcodeNumber: 658,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a sorted array, an integer k, and a target x, find the k closest elements to x. Heap approach: use a max-heap of size k keyed by (distance, value). Push each element with its distance; if the heap exceeds size k, pop the farthest. The remaining k elements are the closest. Sort the result.',
        hasVisualization: true,
        tags: ['heap', 'binary search', 'two pointers', 'sorted array'],
      },
      {
        id: 'find-median-from-data-stream-ii',
        title: 'Find Median from Data Stream',
        leetcodeNumber: 295,
        difficulty: 'Hard' as Difficulty,
        description:
          'Maintain a running median as numbers are added to a stream. Use two heaps: a max-heap for the lower half and a min-heap for the upper half. After each insert, balance the heaps so they differ in size by at most 1. The median is the top of the larger heap or the average of both tops.',
        hasVisualization: true,
        tags: ['heap', 'two heaps', 'design', 'median', 'data stream'],
      },
      {
        id: 'ipo',
        title: 'IPO',
        leetcodeNumber: 502,
        difficulty: 'Hard' as Difficulty,
        description:
          'Maximize capital after at most k projects. Each project has a profit and a minimum capital requirement. Use two heaps: a min-heap sorted by capital requirement to track available projects, and a max-heap sorted by profit to pick the best available project. For each of the k rounds, unlock all affordable projects and greedily pick the highest-profit one.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'sorting', 'two heaps'],
      },
      {
        id: 'k-closest-points-to-origin',
        title: 'K Closest Points to Origin',
        leetcodeNumber: 973,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a list of points on a plane, find the k closest points to the origin (0,0). Use a max-heap of size k. For each point, compute its squared Euclidean distance (x^2 + y^2). Push to heap; if heap exceeds k, pop the farthest. The remaining k points are the answer. No need to sort the result.',
        hasVisualization: true,
        tags: ['heap', 'geometry', 'sorting', 'divide and conquer'],
      },
      {
        id: 'kth-largest-element-in-stream',
        title: 'Kth Largest Element in a Stream',
        leetcodeNumber: 703,
        difficulty: 'Easy' as Difficulty,
        description:
          'Design a class that finds the k-th largest element in a stream. Maintain a min-heap of size k. The k-th largest is always at the top of the heap. When adding a new number, push it to the heap and pop if the heap exceeds size k. The top then holds the k-th largest.',
        hasVisualization: true,
        tags: ['heap', 'priority queue', 'design', 'data stream'],
      },
      {
        id: 'minimum-cost-to-connect-sticks',
        title: 'Minimum Cost to Connect Sticks',
        leetcodeNumber: 1167,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given sticks of various lengths, you can connect any two sticks at a cost equal to their combined length. Find the minimum total cost to connect all sticks into one. Use a min-heap: repeatedly extract the two shortest sticks, combine them (adding cost), and push the combined stick back. This greedy approach minimizes cost.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'priority queue', 'huffman coding'],
      },
      {
        id: 'process-tasks-using-servers',
        title: 'Process Tasks Using Servers',
        leetcodeNumber: 1882,
        difficulty: 'Medium' as Difficulty,
        description:
          'Assign each task to the available server with the smallest weight (ties broken by smaller index). Tasks arrive at times 0, 1, 2, ... Use two min-heaps: one for free servers (weight, index) and one for busy servers (freeTime, weight, index). Before each task, release servers that have finished.',
        hasVisualization: true,
        tags: ['heap', 'priority queue', 'simulation', 'greedy'],
      },
      {
        id: 'seat-reservation-manager',
        title: 'Seat Reservation Manager',
        leetcodeNumber: 1845,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a system that manages seat reservations for n seats (labeled 1 to n). Reserve always returns the smallest available seat number, and unreserve releases a seat back to the pool. Use a min-heap initialized with all seat numbers. Reserve pops the minimum; unreserve pushes the seat back.',
        hasVisualization: true,
        tags: ['heap', 'priority queue', 'design', 'greedy'],
      },
      {
        id: 'smallest-range-covering-elements',
        title: 'Smallest Range Covering Elements from K Lists',
        leetcodeNumber: 632,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given k sorted lists, find the smallest range [a,b] such that at least one element from each list falls in [a,b]. Use a min-heap seeded with the first element from each list, tracking the current maximum. At each step, the range is [heap.min, currentMax]. Pop the minimum, advance its list pointer, update max, and record the best range.',
        hasVisualization: true,
        tags: ['heap', 'priority queue', 'sliding window', 'greedy'],
      },
      {
        id: 'super-ugly-number',
        title: 'Super Ugly Number',
        leetcodeNumber: 313,
        difficulty: 'Medium' as Difficulty,
        description:
          'A super ugly number has prime factors only from a given list of primes. Find the n-th super ugly number. Use a min-heap starting with 1. For each step, pop the minimum, then for each prime in the list multiply the popped value by that prime and push to the heap if not seen. Repeat n times.',
        hasVisualization: true,
        tags: ['heap', 'dynamic programming', 'math', 'prime factorization'],
      },
      {
        id: 'top-k-frequent-words',
        title: 'Top K Frequent Words',
        leetcodeNumber: 692,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of words and an integer k, return the k most frequent words sorted by frequency (descending). For words with the same frequency, sort alphabetically. Bucket sort approach: create buckets by frequency, then scan from highest to lowest, collecting words alphabetically until k words found.',
        hasVisualization: true,
        tags: ['heap', 'hash map', 'bucket sort', 'sorting', 'string'],
      },
      {
        id: 'ugly-number-ii',
        title: 'Ugly Number II',
        leetcodeNumber: 264,
        difficulty: 'Medium' as Difficulty,
        description:
          'An ugly number has only the prime factors 2, 3, and 5. Find the n-th ugly number. Use a min-heap starting with 1. At each step, pop the minimum, generate candidates by multiplying by 2, 3, and 5, and push unique candidates to the heap. Repeat n times to find the n-th ugly number.',
        hasVisualization: true,
        tags: ['heap', 'dynamic programming', 'math', 'ugly numbers'],
      },
    
      {
        id: 'construct-target-array-with-multiple-sums',
        title: 'Construct Target Array With Multiple Sums',
        leetcodeNumber: 1354,
        difficulty: 'Hard' as Difficulty,
        description:
          'Start with an array of ones. At each step, replace any element with the sum of the whole array. Given a target array, determine if it can be constructed. Work backwards: take the largest element and subtract the sum of the rest repeatedly using a max heap.',
        hasVisualization: true,
        tags: ['heap', 'array', 'simulation'],
      },
      {
        id: 'find-score-of-array-after-marking',
        title: 'Find Score of an Array After Marking Elements',
        leetcodeNumber: 2593,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array, repeatedly pick the smallest unmarked element, add it to the score, and mark it along with its neighbors (adjacent elements). Use a min heap storing (value, index) to always get the smallest unmarked element efficiently.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'array', 'simulation'],
      },
      {
        id: 'kth-largest-element-in-array',
        title: 'Kth Largest Element in an Array',
        leetcodeNumber: 215,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the kth largest element in an unsorted array. Use a min heap of size k: iterate through the array, maintaining a min heap of the k largest seen so far. The heap root is the kth largest element.',
        hasVisualization: true,
        tags: ['heap', 'quickselect', 'divide and conquer', 'array', 'sorting'],
      },
      {
        id: 'kth-smallest-element-sorted-matrix',
        title: 'Kth Smallest Element in a Sorted Matrix',
        leetcodeNumber: 378,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an n x n matrix where each row and column is sorted in ascending order, find the kth smallest element. Use a min heap that starts with the first column of the first row and expands right and down, popping k times.',
        hasVisualization: true,
        tags: ['heap', 'binary search', 'matrix', 'sorted'],
      },
      {
        id: 'maximum-average-pass-ratio',
        title: 'Maximum Average Pass Ratio',
        leetcodeNumber: 1792,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given classes where each class has a pass count and total count, and extra students who always pass, assign each extra student to the class that gains the maximum marginal increase in pass ratio. Use a max heap ordered by the gain of adding one student.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'math'],
      },
      {
        id: 'maximum-number-of-eaten-apples',
        title: 'Maximum Number of Eaten Apples',
        leetcodeNumber: 1705,
        difficulty: 'Medium' as Difficulty,
        description:
          'Each day i, an apple tree produces apples[i] apples that expire after days[i] days. Each day you can eat one apple. Use a min heap ordered by expiry date to always eat the apple expiring soonest (greedy to avoid waste).',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'simulation'],
      },
      {
        id: 'maximum-performance-of-team',
        title: 'Maximum Performance of a Team',
        leetcodeNumber: 1383,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n engineers with speed and efficiency arrays, select at most k engineers to maximize performance = sum(speeds) * min(efficiency). Sort by efficiency descending, sweep and use a min heap of size k on speeds to maintain the best team.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'sorting', 'array'],
      },
      {
        id: 'maximum-product-after-k-increments',
        title: 'Maximum Product After K Increments',
        leetcodeNumber: 2233,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array and k increments, each increment adds 1 to any element. Use a min heap to always increment the smallest element, which maximizes the final product. Return the product modulo 10^9+7.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'array', 'math'],
      },
      {
        id: 'maximum-star-sum-of-graph',
        title: 'Maximum Star Sum of a Graph',
        leetcodeNumber: 2497,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a graph with node values and edges, a star graph is a center node plus any subset of its neighbors. The star sum is the sum of values of selected nodes. For each node as center, greedily add neighbors with positive values using a max heap approach. Return the maximum star sum.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'graph', 'array'],
      },
      {
        id: 'maximum-subsequence-score',
        title: 'Maximum Subsequence Score',
        leetcodeNumber: 2542,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given arrays nums1 and nums2, pick k indices to maximize the sum of nums1 values multiplied by the minimum nums2 value among chosen indices. Sort by nums2 descending, then sweep using a min heap of size k on nums1 values.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'sorting', 'array'],
      },
      {
        id: 'meeting-rooms-iii',
        title: 'Meeting Rooms III',
        leetcodeNumber: 2402,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n rooms and a list of meetings with start and end times, assign each meeting to the room with the smallest index that is free. If no room is free, delay the meeting until the earliest room becomes available. Return the room that held the most meetings.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'sorting', 'simulation'],
      },
      {
        id: 'minimum-cost-to-connect-sticks-ii',
        title: 'Minimum Cost to Connect Sticks II (Huffman)',
        leetcodeNumber: 1167,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given sticks of various lengths, at each step connect two sticks into one at a cost equal to their sum. Find the minimum total cost to connect all sticks into one. This is a Huffman coding style problem: always merge the two shortest sticks using a min heap.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'huffman'],
      },
      {
        id: 'minimum-cost-to-hire-k-workers',
        title: 'Minimum Cost to Hire K Workers',
        leetcodeNumber: 857,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given workers with quality and wage arrays, hire exactly k workers such that the total cost is minimized. Each worker must be paid at least their minimum wage, and all workers must be paid in proportion to their quality. Sort by wage-to-quality ratio, then use a max heap to maintain k lowest-quality workers.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'sorting', 'math'],
      },
      {
        id: 'minimum-number-of-refueling-stops-heap',
        title: 'Minimum Number of Refueling Stops (Heap)',
        leetcodeNumber: 871,
        difficulty: 'Hard' as Difficulty,
        description:
          'A car starts at position 0 with startFuel. At each gas station you may refuel. Return the minimum number of refueling stops to reach target. Greedy: keep driving, accumulate stations passed, and when stuck use the largest available fuel from a max heap.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'dynamic programming'],
      },
      {
        id: 'minimum-operations-to-halve-sum',
        title: 'Minimum Operations to Halve Array Sum',
        leetcodeNumber: 2208,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of numbers, in each operation you can halve any element. Return the minimum number of operations needed to reduce the total sum by at least half. Use a max heap to always halve the current largest element.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'array'],
      },
      {
        id: 'number-of-orders-in-backlog',
        title: 'Number of Orders in the Backlog',
        leetcodeNumber: 1801,
        difficulty: 'Medium' as Difficulty,
        description:
          'Simulate a stock exchange backlog. Buy orders use a max heap (highest price first), sell orders use a min heap (lowest price first). Match overlapping buy and sell orders and return the total remaining backlog count modulo 10^9+7.',
        hasVisualization: true,
        tags: ['heap', 'simulation', 'design'],
      },
      {
        id: 'reorganize-string-heap',
        title: 'Reorganize String (Max Heap)',
        leetcodeNumber: 767,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s, rearrange the characters so that no two adjacent characters are the same. Use a max heap ordered by character frequency to always pick the most frequent character next. If it is impossible to rearrange, return an empty string.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'string', 'frequency'],
      },
      {
        id: 'single-threaded-cpu',
        title: 'Single-Threaded CPU',
        leetcodeNumber: 1834,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n tasks with enqueueTime and processingTime, simulate a single-threaded CPU that always picks the available task with the shortest processing time (breaking ties by smaller index). Use a min heap and sort tasks by enqueue time.',
        hasVisualization: true,
        tags: ['heap', 'sorting', 'simulation', 'greedy'],
      },
      {
        id: 'sliding-window-maximum-heap',
        title: 'Sliding Window Maximum (Heap)',
        leetcodeNumber: 239,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array nums and a window size k, return the maximum value in each sliding window. This heap approach uses a max heap storing (value, index) pairs and lazily removes stale entries (indices outside the window).',
        hasVisualization: true,
        tags: ['heap', 'sliding window', 'array', 'monotonic'],
      },
      {
        id: 'smallest-number-in-infinite-set',
        title: 'Smallest Number in Infinite Set',
        leetcodeNumber: 2336,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a data structure that initially contains all positive integers. Support popSmallest (remove and return the smallest) and addBack (add a number back if not present). Use a min heap for added-back numbers and a pointer for the infinite sequence.',
        hasVisualization: true,
        tags: ['heap', 'design', 'hash set'],
      },
      {
        id: 'stock-price-fluctuation-heap',
        title: 'Stock Price Fluctuation (Heap)',
        leetcodeNumber: 2034,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a stock price tracker that supports updating price at a timestamp, and querying the current price, maximum price, and minimum price. Use a hash map for timestamp -> price, and two heaps (max and min) with lazy deletion for max/min queries.',
        hasVisualization: true,
        tags: ['heap', 'design', 'hash map', 'lazy deletion'],
      },
      {
        id: 'task-scheduler-heap',
        title: 'Task Scheduler (Heap)',
        leetcodeNumber: 621,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given tasks and a cooldown n, schedule tasks such that the same task must be separated by at least n intervals. Use a max heap for task counts and a queue to hold tasks in cooldown. Return the minimum total time.',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'array', 'queue'],
      },
      {
        id: 'the-skyline-problem',
        title: 'The Skyline Problem',
        leetcodeNumber: 218,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a list of buildings as [left, right, height], compute the skyline outline as a list of [x, height] key points. Use a sweep line approach: create events for building starts and ends, then maintain a max heap of active building heights.',
        hasVisualization: true,
        tags: ['heap', 'sweep line', 'sorting', 'divide and conquer'],
      },
      {
        id: 'total-cost-to-hire-k-workers',
        title: 'Total Cost to Hire K Workers',
        leetcodeNumber: 2462,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a costs array, hire k workers with the lowest cost. In each hiring round, choose the cheapest among the first ',
        hasVisualization: true,
        tags: ['heap', 'greedy', 'two pointers', 'simulation'],
      },
      {
        id: 'trapping-rain-water-heap',
        title: 'Trapping Rain Water II (2D Heap BFS)',
        leetcodeNumber: 407,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a 2D elevation map, compute how much water can be trapped after raining. Use a BFS approach with a min heap: start from boundary cells, expand inward using the lowest boundary cell. Water trapped at each cell is max(0, minBoundary - height[r][c]).',
        hasVisualization: true,
        tags: ['heap', 'BFS', 'matrix', 'two pointers'],
      },
    ],
  },

  // ─── 09. Intervals ─────────────────────────────────────────────────
  {
    id: 'intervals',
    name: 'Intervals',
    icon: '⊢',
    color: 'text-teal-400',
    gradient: 'from-teal-500/20 to-teal-600/10',
    borderColor: 'border-teal-500/30',
    problems: [
      {
        id: 'merge-overlapping-intervals',
        title: 'Merge Overlapping Intervals',
        difficulty: 'Medium',
        leetcodeNumber: 56,
        description:
          'Merge all overlapping intervals by sorting and greedily extending the current interval.',
        hasVisualization: true,
        tags: ['intervals', 'sorting', 'greedy'],
      },
      {
        id: 'identify-all-interval-overlaps',
        title: 'Identify All Interval Overlaps',
        difficulty: 'Medium',
        leetcodeNumber: 986,
        description:
          'Find all overlapping segments between two sorted lists of intervals using a two-pointer approach.',
        hasVisualization: true,
        tags: ['intervals', 'two-pointers'],
      },
      {
        id: 'largest-overlap-of-intervals',
        title: 'Largest Overlap of Intervals',
        difficulty: 'Medium',
        leetcodeNumber: 253,
        description:
          'Determine the maximum number of intervals that overlap at any single point using a sweep line.',
        hasVisualization: true,
        tags: ['intervals', 'sorting', 'sweep-line'],
      },
      {
        id: 'insert-interval',
        title: 'Insert Interval',
        difficulty: 'Medium',
        leetcodeNumber: 57,
        description:
          'Given a sorted list of non-overlapping intervals and a new interval, insert the new interval and merge any overlapping intervals. Iterate through: add intervals that end before the new one starts, merge overlapping intervals by expanding the new interval, then add remaining intervals.',
        hasVisualization: true,
        tags: ['intervals', 'greedy', 'sorting'],
      },
      {
        id: 'meeting-rooms',
        title: 'Meeting Rooms',
        difficulty: 'Easy',
        leetcodeNumber: 252,
        description:
          'Given an array of meeting time intervals, determine if a person can attend all meetings. Sort by start time, then check if any meeting starts before the previous one ends. If any overlap exists, return false.',
        hasVisualization: true,
        tags: ['intervals', 'sorting'],
      },
      {
        id: 'meeting-rooms-ii',
        title: 'Meeting Rooms II',
        difficulty: 'Medium',
        leetcodeNumber: 253,
        description:
          'Find the minimum number of conference rooms required for all meetings. Sort intervals by start time. Use a min-heap of end times. For each meeting, if it starts after the earliest-ending room is free, reuse that room; otherwise allocate a new room.',
        hasVisualization: true,
        tags: ['intervals', 'heap', 'greedy', 'sorting'],
      },
      {
        id: 'minimum-number-of-arrows',
        title: 'Minimum Number of Arrows to Burst Balloons',
        difficulty: 'Medium',
        leetcodeNumber: 452,
        description:
          'Find the minimum number of arrows to burst all balloons on a 2D plane, where each balloon is represented by [xstart, xend]. Sort balloons by end coordinate. Shoot an arrow at the end of the first balloon, which bursts all overlapping balloons. Move to the next unbursted balloon.',
        hasVisualization: true,
        tags: ['intervals', 'greedy', 'sorting'],
      },
      {
        id: 'non-overlapping-intervals',
        title: 'Non-overlapping Intervals',
        difficulty: 'Medium',
        leetcodeNumber: 435,
        description:
          'Find the minimum number of intervals to remove to make the rest non-overlapping. Sort by end time (greedy), then keep intervals with the earliest end time. When an overlap is detected, remove the one with the later end (keep the earlier-ending one to leave room for future intervals).',
        hasVisualization: true,
        tags: ['intervals', 'greedy', 'sorting'],
      },
    ],
  },

  // ─── 10. Prefix Sums ───────────────────────────────────────────────
  {
    id: 'prefix-sums',
    name: 'Prefix Sums',
    icon: 'Σ',
    color: 'text-indigo-400',
    gradient: 'from-indigo-500/20 to-indigo-600/10',
    borderColor: 'border-indigo-500/30',
    problems: [
      {
        id: 'sum-between-range',
        title: 'Sum Between Range',
        difficulty: 'Easy',
        leetcodeNumber: 303,
        description:
          'Answer range sum queries in O(1) time after an O(n) prefix sum precomputation.',
        hasVisualization: true,
        tags: ['prefix-sum', 'array'],
      },
      {
        id: 'k-sum-subarrays',
        title: 'K-Sum Subarrays',
        difficulty: 'Medium',
        leetcodeNumber: 560,
        description:
          'Count the number of subarrays that sum to k using prefix sums and a hash map.',
        hasVisualization: true,
        tags: ['prefix-sum', 'hash-map', 'array'],
      },
      {
        id: 'product-array-without-current-element',
        title: 'Product Array Without Current Element',
        difficulty: 'Medium',
        leetcodeNumber: 238,
        description:
          'Compute an array where each element is the product of all other elements without using division.',
        hasVisualization: true,
        tags: ['prefix-sum', 'array'],
      },
      {
        id: 'contiguous-array',
        title: 'Contiguous Array',
        difficulty: 'Medium',
        leetcodeNumber: 525,
        description:
          'Find the maximum length subarray with equal number of 0s and 1s. Replace 0s with -1s and compute prefix sums. If the same prefix sum appears twice, the subarray between those indices has equal 0s and 1s. Track first occurrence of each prefix sum in a hash map.',
        hasVisualization: true,
        tags: ['prefix-sum', 'hash-map', 'array'],
      },
      {
        id: 'maximum-size-subarray-sum-k',
        title: 'Maximum Size Subarray Sum Equals K',
        difficulty: 'Medium',
        leetcodeNumber: 325,
        description:
          'Find the maximum length of a subarray that sums to k. Use prefix sums: for each index i with prefix sum S, if S-k was seen before at index j, then subarray [j+1..i] sums to k. Track the first occurrence of each prefix sum in a hash map to maximize the subarray length.',
        hasVisualization: true,
        tags: ['prefix-sum', 'hash-map', 'array'],
      },
      {
        id: 'find-pivot-index',
        title: 'Find Pivot Index',
        difficulty: 'Easy',
        leetcodeNumber: 724,
        description:
          'Find the pivot index where the sum of all elements to the left equals the sum of all elements to the right.',
        hasVisualization: true,
        tags: ['prefix-sum', 'array'],
      },
      {
        id: 'range-sum-query-2d',
        title: 'Range Sum Query 2D',
        difficulty: 'Medium',
        leetcodeNumber: 304,
        description:
          'Given a 2D matrix, handle multiple range sum queries for subrectangles efficiently. Precompute a 2D prefix sum table where prefix[i][j] is the sum of all elements in the rectangle from (0,0) to (i-1,j-1). Then each query is answered in O(1) using inclusion-exclusion.',
        hasVisualization: true,
        tags: ['prefix-sum', '2d-array', 'matrix', 'design'],
      },
    
      {
        id: 'binary-subarrays-with-sum-prefix',
        title: 'Binary Subarrays With Sum (Prefix Method)',
        leetcodeNumber: 930,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of non-empty subarrays of a binary array that sum to a target goal. Apply the prefix sum technique: maintain a frequency map of prefix sums. At each index, the count of valid subarrays ending here equals freq[prefixSum - goal]. This is the same approach as Subarray Sum Equals K applied to binary arrays.',
        hasVisualization: true,
        tags: ['prefix sum', 'hash map', 'binary array', 'sliding window'],
      },
      {
        id: 'continuous-subarray-sum',
        title: 'Continuous Subarray Sum',
        leetcodeNumber: 523,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums and an integer k, return true if nums has a continuous subarray of size at least 2 whose elements sum up to a multiple of k. Use a prefix sum modulo k: if two prefix sums have the same remainder mod k and are at least 2 indices apart, the subarray between them is divisible by k.',
        hasVisualization: true,
        tags: ['prefix sum', 'hash map', 'modulo', 'subarray'],
      },
      {
        id: 'count-of-range-sum',
        title: 'Count of Range Sum',
        leetcodeNumber: 327,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count the number of range sums that lie in [lower, upper]. Build prefix sums, then use merge sort to count pairs (i, j) where lower <= prefix[j] - prefix[i] <= upper. During the merge step, for each left half element, use two pointers to find how many right half elements satisfy the condition.',
        hasVisualization: true,
        tags: ['prefix sum', 'merge sort', 'divide and conquer', 'counting'],
      },
      {
        id: 'prefix-sum-array',
        title: 'Prefix Sum Array',
        difficulty: 'Easy' as Difficulty,
        description:
          'Build a prefix sum array where prefix[i] = sum of nums[0..i-1]. Once built, any subarray sum from index l to r can be computed in O(1) as prefix[r+1] - prefix[l]. This transforms O(n) range queries into O(1) after O(n) preprocessing.',
        hasVisualization: true,
        tags: ['prefix sum', 'array', 'range query'],
      },
      {
        id: 'subarray-sum-equals-k',
        title: 'Subarray Sum Equals K',
        leetcodeNumber: 560,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of continuous subarrays whose sum equals k. Use a prefix sum with a hash map: at each index i, compute prefix[i]. The number of subarrays ending at i with sum k equals the count of previous prefixes equal to prefix[i] - k. Store each prefix sum count in the map.',
        hasVisualization: true,
        tags: ['prefix sum', 'hash map', 'subarray', 'counting'],
      },
      {
        id: 'subarray-sums-divisible-by-k',
        title: 'Subarray Sums Divisible by K',
        leetcodeNumber: 974,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of non-empty subarrays whose sum is divisible by k. Use prefix sums mod k: two indices i and j give a subarray sum divisible by k if and only if prefix[i] % k == prefix[j] % k. Count pairs of equal remainders using a frequency map. Handle negative remainders by adding k before taking mod.',
        hasVisualization: true,
        tags: ['prefix sum', 'hash map', 'modulo', 'counting'],
      },
    
      {
        id: 'binary-subarrays-with-sum-ii',
        title: 'Binary Subarrays With Sum II',
        leetcodeNumber: 930,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count binary subarrays with sum exactly equal to goal. Use prefix sum with a frequency map: for each prefix sum, count how many times (prefixSum - goal) has appeared. A subarray [i..j] sums to goal iff prefixSum[j] - prefixSum[i-1] = goal. O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Hash Map', 'Array', 'Binary Array'],
      },
      {
        id: 'contiguous-array-ii',
        title: 'Contiguous Array II',
        leetcodeNumber: 525,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the maximum length subarray with an equal number of 0s and 1s. Replace 0 with -1, then the problem becomes finding the longest subarray with sum 0. Use a prefix sum + hash map: if prefix[i] was seen before at index j, subarray (j+1..i) has sum 0. O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Hash Map', 'Array'],
      },
      {
        id: 'count-nice-pairs',
        title: 'Count Nice Pairs in an Array',
        leetcodeNumber: 1814,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count pairs (i,j) where i < j and nums[i]+rev(nums[j]) == nums[j]+rev(nums[i]), equivalently nums[i]-rev(nums[i]) == nums[j]-rev(nums[j]). Compute diff[i]=nums[i]-rev(nums[i]) for each element, then count pairs with equal diff values using a frequency map. O(n*D) where D is digits.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Hash Map', 'Array', 'Math'],
      },
      {
        id: 'count-subarrays-with-score-less-than-k',
        title: 'Count Subarrays With Score Less Than K',
        leetcodeNumber: 2302,
        difficulty: 'Hard' as Difficulty,
        description:
          'The score of a subarray is defined as sum * length. Count subarrays with score < k. Use a sliding window: expand right, shrink left when score >= k. At each right position, all subarrays ending at right with left pointer in valid range contribute (right - left + 1) counts. O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Sliding Window', 'Array'],
      },
      {
        id: 'count-vowel-strings-in-ranges',
        title: 'Count Vowel Strings in Ranges',
        leetcodeNumber: 2559,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of words and queries [li, ri], for each query count words[li..ri] that start and end with a vowel. Build a prefix sum of ',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array', 'String'],
      },
      {
        id: 'find-pivot-index-iii',
        title: 'Find Pivot Index III',
        leetcodeNumber: 724,
        difficulty: 'Easy' as Difficulty,
        description:
          'Find the leftmost index where the sum of all elements to the left equals the sum of all elements to the right. Compute total sum, then scan left to right maintaining leftSum. At each index, rightSum = total - leftSum - nums[i]. If leftSum == rightSum, return the index.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array'],
      },
      {
        id: 'find-the-highest-altitude-ii',
        title: 'Find the Highest Altitude II',
        leetcodeNumber: 1732,
        difficulty: 'Easy' as Difficulty,
        description:
          'A biker goes on a road trip starting at altitude 0. Given the net gain array, find the highest altitude reached. Build a running altitude prefix sum starting at 0 and track the maximum. O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array'],
      },
      {
        id: 'k-radius-subarray-averages-ii',
        title: 'K Radius Subarray Averages II',
        leetcodeNumber: 2090,
        difficulty: 'Medium' as Difficulty,
        description:
          'For each index i, compute the average of nums[i-k..i+k] if that window exists, else -1. Build a prefix sum array, then for each valid index the window sum is prefix[i+k+1] - prefix[i-k] and the average is that divided by (2k+1). O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array', 'Sliding Window'],
      },
      {
        id: 'left-and-right-sum-differences',
        title: 'Left and Right Sum Differences',
        leetcodeNumber: 2574,
        difficulty: 'Easy' as Difficulty,
        description:
          'Return answer[i] = |leftSum[i] - rightSum[i]| where leftSum[i] is sum of nums[0..i-1] and rightSum[i] is sum of nums[i+1..n-1]. Build prefix sums from both directions, then compute differences. O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array'],
      },
      {
        id: 'make-sum-divisible-by-p',
        title: 'Make Sum Divisible by P',
        leetcodeNumber: 1590,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the smallest subarray to remove so the remaining sum is divisible by p. Compute total % p (target remainder). For each prefix sum mod p, check if a previous prefix sum equals (current - target + p) % p exists in a map. The gap length is the subarray to remove. O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Hash Map', 'Array'],
      },
      {
        id: 'max-sum-of-pair-equal-digit-sum',
        title: 'Max Sum of a Pair with Equal Sum of Digits',
        leetcodeNumber: 2342,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the maximum sum of nums[i] + nums[j] where i != j and digitSum(nums[i]) == digitSum(nums[j]). Group numbers by their digit sum using a hash map, keeping the largest two per group. O(n * D) where D is number of digits.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Hash Map', 'Array', 'Math'],
      },
      {
        id: 'maximum-size-subarray-sum-equals-k',
        title: 'Maximum Size Subarray Sum Equals k',
        leetcodeNumber: 325,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the maximum length of a subarray that sums to k. Use a prefix sum + hash map. Record the earliest index where each prefix sum occurs. For each index i, if (prefixSum - k) was seen at index j, subarray (j+1..i) sums to k with length i-j. O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Hash Map', 'Array'],
      },
      {
        id: 'maximum-sum-obtained-of-any-permutation',
        title: 'Maximum Sum Obtained of Any Permutation',
        leetcodeNumber: 1589,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given requests [start, end] on an array, maximize the total sum. Count how many times each index is requested using a difference array (range increment), then sort both the frequency array and nums array in descending order to greedily assign largest values to most-requested indices. O(n log n).',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Greedy', 'Sorting', 'Array'],
      },
      {
        id: 'minimum-average-difference',
        title: 'Minimum Average Difference',
        leetcodeNumber: 2256,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the index with minimum average difference: |avg(nums[0..i]) - avg(nums[i+1..n-1])|. Use a prefix sum to compute left sum in O(1), derive right sum from total. Handle edge case where right side is empty (i == n-1). O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array'],
      },
      {
        id: 'minimum-value-to-get-positive-step-ii',
        title: 'Minimum Value to Get Positive Step by Step Sum II',
        leetcodeNumber: 1413,
        difficulty: 'Easy' as Difficulty,
        description:
          'Find the minimum positive integer startValue such that the running sum (startValue + nums[0] + ... + nums[i]) is always >= 1. Compute the minimum prefix sum; startValue = max(1, 1 - minPrefixSum). O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array'],
      },
      {
        id: 'number-of-sub-arrays-with-odd-sum',
        title: 'Number of Sub-arrays With Odd Sum',
        leetcodeNumber: 1524,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count subarrays with an odd sum. Track counts of even and odd prefix sums. A subarray [i..j] has odd sum iff prefixSum[j] and prefixSum[i-1] have different parities. For each new prefix sum, add the count of prefix sums with opposite parity. O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array', 'Math'],
      },
      {
        id: 'number-of-subarrays-with-bounded-maximum',
        title: 'Number of Subarrays with Bounded Maximum',
        leetcodeNumber: 795,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count subarrays where the maximum element is in [left, right]. Use the inclusion-exclusion principle: count(max <= right) - count(max <= left-1). The helper f(bound) counts subarrays with max <= bound by resetting start on elements > bound. O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array', 'Counting'],
      },
      {
        id: 'number-of-ways-to-split-array-ii',
        title: 'Number of Ways to Split Array II',
        leetcodeNumber: 2270,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of valid split positions where leftSum >= rightSum. A valid split at index i means sum(nums[0..i]) >= sum(nums[i+1..n-1]). Build a prefix sum once, then scan for valid splits in O(n) time.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array'],
      },
      {
        id: 'product-of-array-except-self-ii',
        title: 'Product of Array Except Self II',
        leetcodeNumber: 238,
        difficulty: 'Medium' as Difficulty,
        description:
          'Return an array where output[i] is the product of all elements except nums[i], without using division and in O(n). Use a left-prefix product pass then a right-suffix product pass. Each output[i] = leftProduct[i] * rightProduct[i].',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array', 'Product'],
      },
      {
        id: 'range-sum-query-2d-ii',
        title: 'Range Sum Query 2D - Immutable II',
        leetcodeNumber: 304,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a 2D matrix, handle multiple sumRegion queries efficiently. Build a 2D prefix sum where prefix[i][j] is the sum of all elements in the sub-rectangle from (0,0) to (i-1,j-1). Use inclusion-exclusion to answer each query in O(1).',
        hasVisualization: true,
        tags: ['Prefix Sum', '2D Array', 'Matrix', 'Design'],
      },
      {
        id: 'range-sum-query-immutable-ii',
        title: 'Range Sum Query - Immutable II',
        leetcodeNumber: 303,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an immutable integer array, handle multiple range sum queries efficiently. Precompute a prefix sum array so each query is answered in O(1) time. prefix[i] stores the sum of nums[0..i-1], and sumRange(left, right) = prefix[right+1] - prefix[left].',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array', 'Design'],
      },
      {
        id: 'running-sum-of-1d-array-ii',
        title: 'Running Sum of 1D Array II',
        leetcodeNumber: 1480,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array nums, return a running sum array where runningSum[i] = sum(nums[0..i]). This is a simple in-place prefix sum: for each index from 1 onwards, add the previous element. O(n) time, O(1) extra space.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array'],
      },
      {
        id: 'subarray-sum-equals-k-ii',
        title: 'Subarray Sum Equals K II',
        leetcodeNumber: 560,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of contiguous subarrays whose sum equals k. Maintain a running prefix sum and a frequency map. For each index, check how many previous prefix sums equal (current - k); those subarrays end here and sum to k. O(n) time, O(n) space.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Hash Map', 'Array'],
      },
      {
        id: 'sum-of-absolute-differences',
        title: 'Sum of Absolute Differences in a Sorted Array',
        leetcodeNumber: 1685,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a sorted array, compute result[i] = sum of |nums[i] - nums[j]| for all j. For a sorted array at index i: left elements contribute i*nums[i] - leftSum, right elements contribute rightSum - (n-1-i)*nums[i]. Use prefix sums for O(n) computation.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array', 'Math'],
      },
      {
        id: 'ways-to-split-array-into-good-subarrays',
        title: 'Ways to Split Array Into Good Subarrays',
        leetcodeNumber: 2750,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of ways to split a binary array into subarrays each containing exactly one 1. Between every two consecutive 1s there are some 0s; the number of split positions between them equals (gap between 1s). Multiply all such gaps. Return answer mod 10^9+7.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Array', 'Math'],
      },
    ],
  },

  // ─── 11. Trees ─────────────────────────────────────────────────────
  {
    id: 'trees',
    name: 'Trees',
    icon: '⌥',
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-green-600/10',
    borderColor: 'border-green-500/30',
    problems: [
      {
        id: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        leetcodeNumber: 226,
        description:
          'Mirror a binary tree by recursively swapping each node\'s left and right children.',
        hasVisualization: true,
        tags: ['tree', 'recursion', 'dfs'],
      },
      {
        id: 'balanced-binary-tree-validation',
        title: 'Balanced Binary Tree Validation',
        difficulty: 'Easy',
        leetcodeNumber: 110,
        description:
          'Check whether a binary tree is height-balanced where subtree depths differ by at most one.',
        hasVisualization: true,
        tags: ['tree', 'recursion', 'dfs'],
      },
      {
        id: 'rightmost-nodes-of-binary-tree',
        title: 'Rightmost Nodes of Binary Tree',
        difficulty: 'Medium',
        leetcodeNumber: 199,
        description:
          'Return the values visible when looking at a binary tree from the right side using level-order traversal.',
        hasVisualization: true,
        tags: ['tree', 'bfs'],
      },
      {
        id: 'widest-binary-tree-level',
        title: 'Widest Binary Tree Level',
        difficulty: 'Medium',
        leetcodeNumber: 662,
        description:
          'Find the maximum width among all levels of a binary tree using indexed BFS.',
        hasVisualization: true,
        tags: ['tree', 'bfs'],
      },
      {
        id: 'bst-validation',
        title: 'BST Validation',
        difficulty: 'Medium',
        leetcodeNumber: 98,
        description:
          'Validate whether a binary tree satisfies binary search tree properties using range constraints.',
        hasVisualization: true,
        tags: ['tree', 'bst', 'dfs'],
      },
      {
        id: 'lowest-common-ancestor',
        title: 'Lowest Common Ancestor',
        difficulty: 'Medium',
        leetcodeNumber: 236,
        description:
          'Find the deepest node that is an ancestor of both given nodes in a binary tree.',
        hasVisualization: true,
        tags: ['tree', 'recursion', 'dfs'],
      },
      {
        id: 'build-binary-tree-from-preorder-inorder',
        title: 'Build Binary Tree From Preorder/Inorder',
        difficulty: 'Medium',
        leetcodeNumber: 105,
        description:
          'Reconstruct a binary tree given its preorder and inorder traversal sequences.',
        hasVisualization: true,
        tags: ['tree', 'recursion', 'divide-and-conquer'],
      },
      {
        id: 'max-sum-continuous-path',
        title: 'Max Sum Continuous Path',
        difficulty: 'Hard',
        leetcodeNumber: 124,
        description:
          'Find the path with the maximum sum in a binary tree where the path can start and end at any node.',
        hasVisualization: true,
        tags: ['tree', 'recursion', 'dfs', 'dynamic-programming'],
      },
      {
        id: 'binary-tree-symmetry',
        title: 'Binary Tree Symmetry',
        difficulty: 'Easy',
        leetcodeNumber: 101,
        description:
          'Check whether a binary tree is a mirror of itself around its center.',
        hasVisualization: true,
        tags: ['tree', 'recursion', 'bfs'],
      },
      {
        id: 'binary-tree-columns',
        title: 'Binary Tree Columns',
        difficulty: 'Hard',
        leetcodeNumber: 314,
        description:
          'Group binary tree nodes by their vertical column index using BFS and a column offset map.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'hash-map'],
      },
      {
        id: 'kth-smallest-in-bst',
        title: 'Kth Smallest in BST',
        difficulty: 'Medium',
        leetcodeNumber: 230,
        description:
          'Find the kth smallest element in a BST using an in-order traversal.',
        hasVisualization: true,
        tags: ['tree', 'bst', 'dfs'],
      },
      {
        id: 'serialize-deserialize-binary-tree',
        title: 'Serialize/Deserialize Binary Tree',
        difficulty: 'Hard',
        leetcodeNumber: 297,
        description:
          'Encode a binary tree to a string and decode it back using preorder traversal with null markers.',
        hasVisualization: true,
        tags: ['tree', 'design', 'string'],
      },
      {
        id: 'binary-tree-inorder-traversal',
        title: 'Binary Tree Inorder Traversal',
        difficulty: 'Easy',
        leetcodeNumber: 94,
        description:
          'Given the root of a binary tree, return the inorder traversal of its nodes\' values. Inorder traversal visits nodes in the order: left subtree, current node, right subtree. For a BST, this produces values in sorted order. We use recursive DFS.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'recursion'],
      },
      {
        id: 'binary-tree-level-order-traversal',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        leetcodeNumber: 102,
        description:
          'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level). We use BFS with a queue: enqueue the root, then for each node dequeued, enqueue its children and collect values per level.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'queue'],
      },
      {
        id: 'binary-tree-postorder-traversal',
        title: 'Binary Tree Postorder Traversal',
        difficulty: 'Easy',
        leetcodeNumber: 145,
        description:
          'Given the root of a binary tree, return the postorder traversal of its nodes\' values. Postorder traversal visits nodes in the order: left subtree, right subtree, then the current node (left → right → root). This is useful for deleting trees or evaluating expression trees.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'recursion'],
      },
      {
        id: 'binary-tree-preorder-traversal',
        title: 'Binary Tree Preorder Traversal',
        difficulty: 'Easy',
        leetcodeNumber: 144,
        description:
          'Given the root of a binary tree, return the preorder traversal of its nodes\' values. Preorder traversal visits the current node first, then recursively visits the left subtree, then the right subtree (root → left → right). This is useful for copying a tree or serializing its structure.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'recursion'],
      },
      {
        id: 'binary-tree-zigzag-traversal',
        title: 'Binary Tree Zigzag Level Order Traversal',
        difficulty: 'Medium',
        leetcodeNumber: 103,
        description:
          'Given the root of a binary tree, return the zigzag level order traversal of its nodes\' values. In zigzag traversal, odd levels go left-to-right and even levels go right-to-left (or vice versa). We use BFS and alternate the direction of each level.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'queue'],
      },
      {
        id: 'convert-sorted-array-to-bst',
        title: 'Convert Sorted Array to Binary Search Tree',
        difficulty: 'Easy',
        leetcodeNumber: 108,
        description:
          'Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree. A height-balanced BST is one where the depth of the two subtrees of every node never differs by more than one. We pick the middle element as the root and recursively do the same for left and right halves.',
        hasVisualization: true,
        tags: ['tree', 'binary-search', 'divide-and-conquer'],
      },
      {
        id: 'count-complete-tree-nodes',
        title: 'Count Complete Tree Nodes',
        difficulty: 'Medium',
        leetcodeNumber: 222,
        description:
          'Given the root of a complete binary tree, return the number of nodes. A complete binary tree has all levels fully filled except possibly the last, which is filled from left to right. The key insight: compute left height and right height. If equal, the left subtree is a perfect tree with 2^h - 1 nodes, so total = 2^h + count(right). Otherwise, the right subtree is perfect, so total = 2^(h-1) + count(left).',
        hasVisualization: true,
        tags: ['tree', 'binary-search', 'dfs'],
      },
      {
        id: 'delete-node-in-bst',
        title: 'Delete Node in a BST',
        difficulty: 'Medium',
        leetcodeNumber: 450,
        description:
          'Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference (possibly updated). There are three cases: (1) The node is a leaf — simply delete it. (2) The node has one child — replace with child. (3) The node has two children — replace with the in-order successor (smallest in right subtree), then delete the successor.',
        hasVisualization: true,
        tags: ['tree', 'bst', 'dfs', 'recursion'],
      },
      {
        id: 'diameter-of-binary-tree',
        title: 'Diameter of Binary Tree',
        difficulty: 'Easy',
        leetcodeNumber: 543,
        description:
          'Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes (measured in number of edges). This path may or may not pass through the root. We use DFS: at each node, the diameter candidate is leftHeight + rightHeight, and we track the global maximum.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'recursion'],
      },
      {
        id: 'flatten-binary-tree-to-list',
        title: 'Flatten Binary Tree to Linked List',
        difficulty: 'Medium',
        leetcodeNumber: 114,
        description:
          'Given the root of a binary tree, flatten it to a linked list in-place following preorder traversal. Each node\'s right pointer points to the next node in the flattened list; left pointers are all null. We use a recursive approach: flatten left and right subtrees, attach left subtree to the right of root, then attach the original right subtree at the end of the former left subtree.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'linked-list'],
      },
      {
        id: 'max-depth-binary-tree',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        leetcodeNumber: 104,
        description:
          'Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node. We use recursive DFS: the depth of each node is 1 + max(depth(left), depth(right)).',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'recursion'],
      },
      {
        id: 'merge-two-binary-trees',
        title: 'Merge Two Binary Trees',
        difficulty: 'Easy',
        leetcodeNumber: 617,
        description:
          'Given two binary trees root1 and root2, merge them into a new binary tree. The merge rule is: if two nodes overlap, sum their values; otherwise use the existing node. We use recursive DFS: at each position, if both nodes exist, sum them; if only one exists, use it; if neither exists, return null.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'recursion'],
      },
      {
        id: 'min-depth-binary-tree',
        title: 'Minimum Depth of Binary Tree',
        difficulty: 'Easy',
        leetcodeNumber: 111,
        description:
          'Given a binary tree, find its minimum depth. The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node. Note: a leaf is a node with no children. We use recursive DFS, being careful not to count a null child as a leaf.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'bfs', 'recursion'],
      },
      {
        id: 'path-sum',
        title: 'Path Sum',
        difficulty: 'Easy',
        leetcodeNumber: 112,
        description:
          'Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all values along the path equals targetSum. We use DFS, subtracting the current node\'s value from the target at each step and checking if a leaf is reached with remaining = 0.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'recursion'],
      },
      {
        id: 'path-sum-ii',
        title: 'Path Sum II',
        difficulty: 'Medium',
        leetcodeNumber: 113,
        description:
          'Given the root of a binary tree and an integer targetSum, return all root-to-leaf paths where the sum of values equals targetSum. We use DFS backtracking: at each node, subtract the value from the remaining sum and track the current path. When a leaf is reached and remaining is 0, add the path to results.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'backtracking'],
      },
      {
        id: 'populating-next-right-pointers',
        title: 'Populating Next Right Pointers in Each Node',
        difficulty: 'Medium',
        leetcodeNumber: 116,
        description:
          'Given a perfect binary tree, populate each node\'s next pointer to point to the next right node at the same level. If there is no next right node, the next pointer should be set to null. We process level by level using the already-connected nodes of the previous level as a "linked list" to find siblings and cousins.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'linked-list'],
      },
      {
        id: 'recover-binary-search-tree',
        title: 'Recover Binary Search Tree',
        difficulty: 'Medium',
        leetcodeNumber: 99,
        description:
          'You are given the root of a binary search tree (BST), where the values of exactly two nodes of the tree were swapped by mistake. Recover the tree without changing its structure. We use inorder traversal: in a valid BST inorder gives sorted values. When two nodes are swapped, there will be one or two ',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'inorder', 'bst'],
      },
      {
        id: 'same-tree',
        title: 'Same Tree',
        difficulty: 'Easy',
        leetcodeNumber: 100,
        description:
          'Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value. We recursively compare each corresponding pair of nodes.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'recursion'],
      },
      {
        id: 'subtree-of-another-tree',
        title: 'Subtree of Another Tree',
        difficulty: 'Easy',
        leetcodeNumber: 572,
        description:
          'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values as subRoot, and false otherwise. A subtree of root is a tree that consists of a node in root and all of this node\'s descendants. We use DFS: at each node of root, check if the tree rooted there is identical to subRoot.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'recursion'],
      },
      {
        id: 'sum-root-to-leaf-numbers',
        title: 'Sum Root to Leaf Numbers',
        difficulty: 'Medium',
        leetcodeNumber: 129,
        description:
          'Each root-to-leaf path in a binary tree represents a number (e.g., path 1→2→3 represents 123). Return the total sum of all root-to-leaf numbers. We use DFS, accumulating the current number by multiplying by 10 and adding each node\'s value, then summing at the leaves.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'math'],
      },
    
      {
        id: 'add-one-row-to-tree',
        title: 'Add One Row to Tree',
        leetcodeNumber: 623,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, insert a row of nodes with a given value at a given depth. The new nodes become the left/right children of existing nodes at depth-1, and push the original subtrees down. Use BFS to reach depth-1, then insert the new row.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'insertion', 'depth', 'level order'],
      },
      {
        id: 'all-nodes-distance-k',
        title: 'All Nodes Distance K in Binary Tree',
        leetcodeNumber: 863,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary tree, a target node, and an integer k, return all node values that are exactly distance k from the target. First, build a parent map using DFS. Then do BFS from the target node treating the tree as an undirected graph, stopping at distance k.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'dfs', 'parent map', 'distance k', 'graph traversal'],
      },
      {
        id: 'average-of-levels',
        title: 'Average of Levels in Binary Tree',
        leetcodeNumber: 637,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a binary tree, return the average value of the nodes on each level as an array. Use BFS level-order traversal: for each level compute the sum of all node values and divide by the count of nodes at that level.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'level order', 'average', 'sum'],
      },
      {
        id: 'balance-a-bst',
        title: 'Balance a Binary Search Tree',
        leetcodeNumber: 1382,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a BST, return a balanced BST with the same node values. Perform inorder traversal to get a sorted array, then recursively build a balanced BST by always picking the middle element as the root of each subtree.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'inorder', 'divide and conquer', 'balancing'],
      },
      {
        id: 'binary-search-tree-iterator',
        title: 'Binary Search Tree Iterator',
        leetcodeNumber: 173,
        difficulty: 'Medium' as Difficulty,
        description:
          'Implement a BST iterator that returns nodes in ascending order. Initialize with the BST root. next() returns the next smallest number. hasNext() returns whether there is a next number. Use an explicit stack to simulate inorder traversal without fully traversing upfront.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'stack', 'inorder', 'iterator', 'design'],
      },
      {
        id: 'binary-tree-paths',
        title: 'Binary Tree Paths',
        leetcodeNumber: 257,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a binary tree, return all root-to-leaf paths in any order. A leaf is a node with no children. Use DFS with backtracking: build the current path as you go deeper, and when you reach a leaf, record the path as a string.',
        hasVisualization: true,
        tags: ['tree', 'DFS', 'backtracking', 'path', 'leaf'],
      },
      {
        id: 'binary-tree-pruning',
        title: 'Binary Tree Pruning',
        leetcodeNumber: 814,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree where every node has value 0 or 1, prune the tree so that subtrees containing only 0s are removed. Use postorder DFS: recursively prune left and right subtrees first, then if a node has value 0 and both children are null, remove it.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'postorder', 'pruning', 'recursion'],
      },
      {
        id: 'binary-tree-right-side-view-ii',
        title: 'Binary Tree Right Side View (DFS Approach)',
        leetcodeNumber: 199,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary tree, return the values of the nodes you can see when standing on the right side. Using DFS: traverse right subtree before left, tracking depth. When visiting a depth for the first time, that node is visible from the right side. Add it to the result.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'right side view', 'depth tracking', 'recursion'],
      },
      {
        id: 'binary-tree-tilt',
        title: 'Binary Tree Tilt',
        leetcodeNumber: 563,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a binary tree, return the sum of every node\'s tilt. The tilt of a node is the absolute difference between the sum of all left subtree node values and the sum of all right subtree node values. Use postorder traversal to compute subtree sums bottom-up.',
        hasVisualization: true,
        tags: ['tree', 'postorder', 'tilt', 'recursion', 'subtree sum'],
      },
      {
        id: 'boundary-of-binary-tree',
        title: 'Boundary of Binary Tree',
        leetcodeNumber: 545,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary tree, return the values of its boundary in anti-clockwise direction starting from the root. The boundary includes: the left boundary (top-down, excluding leaves), all leaf nodes (left-to-right), and the right boundary (bottom-up, excluding leaves). Combine these three parts for the full boundary.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'boundary traversal', 'left boundary', 'right boundary', 'leaves'],
      },
      {
        id: 'check-completeness-of-binary-tree',
        title: 'Check Completeness of a Binary Tree',
        leetcodeNumber: 958,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, determine if it is a complete binary tree. In a complete binary tree, every level except possibly the last is completely filled, and all nodes in the last level are as far left as possible. Use BFS: once a null is encountered, no more non-null nodes should appear.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'completeness', 'level order', 'queue'],
      },
      {
        id: 'closest-binary-search-tree-value',
        title: 'Closest Binary Search Tree Value',
        leetcodeNumber: 270,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a BST and a target floating-point number, find the value in the BST that is closest to the target. Use BST properties to traverse toward the target, updating the closest value at each node.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'binary search', 'iterative'],
      },
      {
        id: 'construct-binary-tree-from-inorder-postorder',
        title: 'Construct Binary Tree from Inorder and Postorder Traversal',
        leetcodeNumber: 106,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two integer arrays representing the inorder and postorder traversal of a binary tree, reconstruct the tree. The last element of postorder is always the root. Find that root in inorder to determine left and right subtrees, then recurse.',
        hasVisualization: true,
        tags: ['tree', 'recursion', 'divide and conquer', 'hash map'],
      },
      {
        id: 'construct-bst-from-preorder',
        title: 'Construct Binary Search Tree from Preorder Traversal',
        leetcodeNumber: 1008,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of integers representing the preorder traversal of a BST, reconstruct the BST. The first element is always the root. Use BST property: elements less than root go left, elements greater go right. Recurse for each subtree.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'recursion', 'divide and conquer'],
      },
      {
        id: 'construct-string-from-binary-tree',
        title: 'Construct String from Binary Tree',
        leetcodeNumber: 606,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a binary tree, construct a string with parentheses representing the tree. Use preorder traversal. Omit empty parentheses pairs that do not affect the one-to-one mapping. If a node has no right child but has a left child, include the left parentheses. If a node has no left child but has a right child, include empty left parentheses.',
        hasVisualization: true,
        tags: ['tree', 'preorder', 'string', 'recursion', 'parentheses'],
      },
      {
        id: 'convert-bst-to-greater-tree',
        title: 'Convert BST to Greater Tree',
        leetcodeNumber: 538,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a BST, convert it to a Greater Sum Tree where each node value becomes the sum of all values greater than or equal to the original node value. Use reverse inorder traversal (right, root, left) while accumulating a running sum.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'inorder', 'reverse traversal', 'prefix sum'],
      },
      {
        id: 'count-good-nodes',
        title: 'Count Good Nodes in Binary Tree',
        leetcodeNumber: 1448,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary tree, count the number of "good" nodes. A node X is good if on the path from root to X there are no nodes with a value greater than X. Use DFS tracking the maximum value seen so far on the path from root to the current node.',
        hasVisualization: true,
        tags: ['tree', 'DFS', 'path', 'preorder', 'maximum tracking'],
      },
      {
        id: 'cousins-in-binary-tree',
        title: 'Cousins in Binary Tree',
        leetcodeNumber: 993,
        difficulty: 'Easy' as Difficulty,
        description:
          'Two nodes of a binary tree are cousins if they have the same depth but different parents. Given the root and two node values x and y, return true if they are cousins. Use BFS or DFS to find the depth and parent of each node, then compare.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'dfs', 'depth', 'parent tracking'],
      },
      {
        id: 'deepest-leaves-sum',
        title: 'Deepest Leaves Sum',
        leetcodeNumber: 1302,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return the sum of values of its deepest leaves. Use BFS level-order traversal: at each level, compute the sum of all nodes. The last level processed gives the sum of the deepest leaves. Alternatively, use DFS tracking max depth.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'dfs', 'deepest leaves', 'sum', 'level order'],
      },
      {
        id: 'distribute-coins-in-binary-tree',
        title: 'Distribute Coins in Binary Tree',
        leetcodeNumber: 979,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary tree with N nodes and N coins (each node has some coins), find the minimum number of moves to give every node exactly one coin. Use postorder DFS: each node returns its excess (coins - 1 + left excess + right excess). Moves = sum of absolute excess values from all subtrees.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'postorder', 'coin distribution', 'greedy'],
      },
      {
        id: 'even-odd-tree',
        title: 'Even Odd Tree',
        leetcodeNumber: 1609,
        difficulty: 'Medium' as Difficulty,
        description:
          'A binary tree is Even-Odd if: at even-indexed levels, all node values are odd and strictly increasing left to right; at odd-indexed levels, all node values are even and strictly decreasing left to right. Use BFS level-order to verify each level satisfies the conditions.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'level order', 'even-odd', 'validation'],
      },
      {
        id: 'find-bottom-left-tree-value',
        title: 'Find Bottom Left Tree Value',
        leetcodeNumber: 513,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return the leftmost value in the last row of the tree. Use BFS level-order traversal: process each level left to right, and the first node of the last level processed is the answer. Alternatively, use DFS tracking depth.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'level order', 'leftmost', 'bottom left'],
      },
      {
        id: 'find-largest-value-in-each-row',
        title: 'Find Largest Value in Each Tree Row',
        leetcodeNumber: 515,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return an array of the largest value in each row. Use DFS with depth tracking: maintain a result array and update result[depth] with the maximum value seen at each depth level during traversal.',
        hasVisualization: true,
        tags: ['tree', 'DFS', 'BFS', 'level order', 'row maximum'],
      },
      {
        id: 'find-mode-in-bst',
        title: 'Find Mode in Binary Search Tree',
        leetcodeNumber: 501,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a BST with possible duplicates, find all modes (most frequently occurring elements). Use inorder traversal which visits nodes in sorted order. Track current value, current count, and maximum count. When count exceeds max, update result.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'inorder', 'mode', 'frequency'],
      },
      {
        id: 'flip-equivalent-binary-trees',
        title: 'Flip Equivalent Binary Trees',
        leetcodeNumber: 951,
        difficulty: 'Medium' as Difficulty,
        description:
          'Two binary trees are flip equivalent if one can be obtained from the other by a series of flip operations (swapping left and right children of a node). Use DFS: at each node, try both without-flip (left matches left, right matches right) and with-flip (left matches right, right matches left) configurations.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'recursion', 'flip equivalence', 'symmetry'],
      },
      {
        id: 'house-robber-iii',
        title: 'House Robber III',
        leetcodeNumber: 337,
        difficulty: 'Medium' as Difficulty,
        description:
          'The thief has found a new place to rob: a binary tree neighborhood. Adjacent nodes (parent-child) cannot both be robbed. Find the maximum amount the thief can rob. Use postorder DP on tree: each node returns a pair [robThis, skipThis] where robThis = node.val + skip(left) + skip(right), skipThis = max(rob/skip left) + max(rob/skip right).',
        hasVisualization: true,
        tags: ['tree', 'dynamic programming', 'postorder', 'house robber', 'dp on tree'],
      },
      {
        id: 'increasing-order-search-tree',
        title: 'Increasing Order Search Tree',
        leetcodeNumber: 897,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a BST, rearrange the tree so that it forms an increasing-order chain with no left children. Perform inorder traversal to collect values in sorted order, then build a right-skewed tree from those values.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'inorder', 'linked list style'],
      },
      {
        id: 'insert-into-bst',
        title: 'Insert into a Binary Search Tree',
        leetcodeNumber: 701,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a BST and a value to insert, insert the value into the BST and return the updated root. Traverse left if the value is less than the current node, right if greater. Insert as a new leaf at the correct position.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'recursion', 'insertion'],
      },
      {
        id: 'largest-values-in-tree-rows',
        title: 'Find Largest Value in Each Tree Row',
        leetcodeNumber: 515,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return an array of the largest value in each row. Use BFS level-order traversal: for each level, track the maximum value among all nodes at that level and collect it into the result array.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'level order', 'maximum', 'row maximum'],
      },
      {
        id: 'leaf-similar-trees',
        title: 'Leaf-Similar Trees',
        leetcodeNumber: 872,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given two binary trees, check if their leaf value sequences are the same. The leaf value sequence is the sequence of leaf node values from left to right. Use DFS on each tree to collect leaves in order, then compare the two sequences.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'leaf sequence', 'comparison'],
      },
      {
        id: 'longest-zigzag-path',
        title: 'Longest ZigZag Path in a Binary Tree',
        leetcodeNumber: 1372,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return the length of the longest zigzag path. A zigzag path alternates between going left and right. At each node, track the maximum zigzag length if the last move was left or right. If we continue in the opposite direction, length increases by 1. If we reset direction, length restarts.',
        hasVisualization: true,
        tags: ['tree', 'DFS', 'dynamic programming', 'zigzag', 'path'],
      },
      {
        id: 'lowest-common-ancestor-bst',
        title: 'Lowest Common Ancestor of a Binary Search Tree',
        leetcodeNumber: 235,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a BST and two nodes p and q, find their lowest common ancestor. The LCA is the deepest node that has both p and q as descendants. Use BST property: if both values are less than the current node go left, if both are greater go right, otherwise the current node is the LCA.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'LCA', 'recursion', 'iterative'],
      },
      {
        id: 'maximum-binary-tree',
        title: 'Maximum Binary Tree',
        leetcodeNumber: 654,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array with no duplicates, build the maximum binary tree. The root is the maximum element. Recursively build the left subtree from elements to the left of the max, and the right subtree from elements to the right of the max.',
        hasVisualization: true,
        tags: ['tree', 'recursion', 'divide and conquer', 'array'],
      },
      {
        id: 'maximum-level-sum',
        title: 'Maximum Level Sum of a Binary Tree',
        leetcodeNumber: 1161,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return the smallest level number with the maximum sum. Use BFS level-order traversal to compute the sum of each level. Track the maximum sum and the corresponding level (return smallest level if tie).',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'level order', 'maximum sum', 'level sum'],
      },
      {
        id: 'maximum-width-of-binary-tree',
        title: 'Maximum Width of Binary Tree',
        leetcodeNumber: 662,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return the maximum width of the tree. The width of a level is defined as the length from the leftmost non-null node to the rightmost non-null node, including nulls in between. Assign index numbers to each node (left child = 2*i, right child = 2*i+1) and track min/max index per level using BFS.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'level order', 'index numbering', 'width'],
      },
      {
        id: 'minimum-absolute-difference-in-bst',
        title: 'Minimum Absolute Difference in BST',
        leetcodeNumber: 530,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a BST, return the minimum absolute difference between the values of any two different nodes. Use inorder traversal which produces sorted values. The minimum difference is always between adjacent values in the sorted order.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'inorder', 'difference', 'sorted'],
      },
      {
        id: 'most-frequent-subtree-sum',
        title: 'Most Frequent Subtree Sum',
        leetcodeNumber: 508,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return the most frequent subtree sum. The subtree sum of a node is defined as the sum of all node values in the subtree rooted at that node. Use postorder traversal to compute each subtree sum and track frequencies in a hash map.',
        hasVisualization: true,
        tags: ['tree', 'postorder', 'hash map', 'frequency', 'subtree sum'],
      },
      {
        id: 'n-ary-tree-level-order-traversal',
        title: 'N-ary Tree Level Order Traversal',
        leetcodeNumber: 429,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an n-ary tree, return the level order traversal of its node values as a list of lists. Use a queue (BFS) to process nodes level by level, collecting all children of each node into the next level queue.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'level order', 'n-ary tree', 'queue'],
      },
      {
        id: 'n-ary-tree-postorder-traversal',
        title: 'N-ary Tree Postorder Traversal',
        leetcodeNumber: 590,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an n-ary tree, return the postorder traversal of its node values. In postorder traversal, all children are visited recursively from left to right before the root node is visited. The root appears last in the output.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'postorder', 'n-ary tree', 'recursion'],
      },
      {
        id: 'n-ary-tree-preorder-traversal',
        title: 'N-ary Tree Preorder Traversal',
        leetcodeNumber: 589,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an n-ary tree, return the preorder traversal of its node values. In preorder traversal, the root is visited first, then all children are visited recursively from left to right. Can be done recursively or iteratively using a stack.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'preorder', 'n-ary tree', 'recursion', 'stack'],
      },
      {
        id: 'range-sum-of-bst',
        title: 'Range Sum of BST',
        leetcodeNumber: 938,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a BST and two integers lo and hi, return the sum of all node values in the inclusive range [lo, hi]. Use BST property to prune: skip left subtree if current value is at or below lo, skip right subtree if at or above hi.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'range query', 'DFS', 'pruning'],
      },
      {
        id: 'search-in-bst',
        title: 'Search in a Binary Search Tree',
        leetcodeNumber: 700,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a BST and a target value, find the node with that value and return the subtree rooted at it. Use the BST property: go left if target is less than current node, go right if greater. Return null if not found.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'search', 'recursion'],
      },
      {
        id: 'smallest-string-starting-from-leaf',
        title: 'Smallest String Starting From Leaf',
        leetcodeNumber: 988,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary tree where node values are 0-25 (representing a-z), find the lexicographically smallest string that starts at a leaf and ends at the root. Each path from leaf to root forms a string (leaf char first). Use DFS to explore all root-to-leaf paths, build leaf-to-root strings, and track the minimum.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'string', 'lexicographic', 'leaf to root'],
      },
      {
        id: 'sum-of-left-leaves',
        title: 'Sum of Left Leaves',
        leetcodeNumber: 404,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a binary tree, return the sum of all left leaves. A left leaf is a leaf node that is the left child of its parent. Use DFS and pass a flag indicating whether the current node is a left child.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'left leaves', 'recursion'],
      },
      {
        id: 'sum-of-root-to-leaf-binary-numbers',
        title: 'Sum of Root To Leaf Binary Numbers',
        leetcodeNumber: 1022,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a binary tree where each node has value 0 or 1, each root-to-leaf path represents a binary number. Return the sum of all these binary numbers. At each step, shift the current number left (multiply by 2) and add the current node value. At leaves, add the accumulated number to the result.',
        hasVisualization: true,
        tags: ['tree', 'DFS', 'binary', 'bit manipulation', 'path sum'],
      },
      {
        id: 'trim-bst',
        title: 'Trim a Binary Search Tree',
        leetcodeNumber: 669,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a BST and a range [lo, hi], trim the tree so all values are within [lo, hi]. If the root value is less than lo, the trimmed tree is the trimmed right subtree. If greater than hi, it is the trimmed left subtree. Otherwise trim both children.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'recursion', 'trimming'],
      },
      {
        id: 'two-sum-iv-input-is-bst',
        title: 'Two Sum IV - Input is a BST',
        leetcodeNumber: 653,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a BST and a target integer k, return true if there exist two elements in the BST such that their sum equals k. Perform inorder traversal to get a sorted array, then use two pointers to find the pair.',
        hasVisualization: true,
        tags: ['tree', 'BST', 'hash set', 'two pointers', 'inorder'],
      },
      {
        id: 'univalued-binary-tree',
        title: 'Univalued Binary Tree',
        leetcodeNumber: 965,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a binary tree, return true if the tree is univalued. A binary tree is univalued if every node in the tree has the same value. Use DFS to check every node against the root value.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'univalued', 'recursion'],
      },
      {
        id: 'validate-binary-tree-nodes',
        title: 'Validate Binary Tree Nodes',
        leetcodeNumber: 1361,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n nodes labeled 0 to n-1 and two arrays leftChild and rightChild representing tree structure, return true if and only if all the given nodes form exactly one valid binary tree. Check: exactly one root (no parent), no node has two parents, no cycles, and all nodes are connected.',
        hasVisualization: true,
        tags: ['tree', 'union find', 'graph', 'validation', 'BFS'],
      },
      {
        id: 'vertical-order-traversal',
        title: 'Vertical Order Traversal of a Binary Tree',
        leetcodeNumber: 987,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given the root of a binary tree, return the vertical order traversal. Each node is assigned a column (root=0, left child col-1, right child col+1) and row. For each column, sort nodes by row, then by value if same row. Uses DFS to collect (col, row, val) tuples then group and sort.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'sorting', 'coordinate system', 'hash map'],
      },
      {
        id: 'path-sum-iii',
        title: 'Path Sum III',
        leetcodeNumber: 437,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of paths in a binary tree that sum to a target value. The path does not need to start or end at the root. Uses prefix sum with DFS for O(n) time.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'prefix sum', 'hash map'],
      },
      {
        id: 'binary-tree-cameras',
        title: 'Binary Tree Cameras',
        leetcodeNumber: 968,
        difficulty: 'Hard' as Difficulty,
        description:
          'Place the minimum number of cameras on tree nodes so that every node is monitored. Uses a greedy bottom-up DFS with three states: uncovered, has camera, covered.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'greedy', 'dynamic programming'],
      },
      {
        id: 'flatten-binary-tree-linked-list',
        title: 'Flatten Binary Tree to Linked List (Morris)',
        leetcodeNumber: 114,
        difficulty: 'Medium' as Difficulty,
        description:
          'Flatten a binary tree in-place to a right-linked list following preorder traversal using Morris traversal technique.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'linked list', 'morris traversal'],
      },
      {
        id: 'populating-next-right-pointers-ii',
        title: 'Populating Next Right Pointers in Each Node II',
        leetcodeNumber: 117,
        difficulty: 'Medium' as Difficulty,
        description:
          'Populate each next pointer to point to the next right node at the same level for a general binary tree. Uses the established next pointers of the previous level with O(1) extra space.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'linked list', 'level order'],
      },
      {
        id: 'construct-quad-tree',
        title: 'Construct Quad Tree',
        leetcodeNumber: 427,
        difficulty: 'Medium' as Difficulty,
        description:
          'Build a quad tree from an n x n binary matrix by recursively splitting non-uniform regions into four quadrants using divide and conquer.',
        hasVisualization: true,
        tags: ['tree', 'divide and conquer', 'matrix', 'recursion'],
      },
      {
        id: 'step-by-step-directions-binary-tree',
        title: 'Step-By-Step Directions From a Binary Tree Node to Another',
        leetcodeNumber: 2096,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the shortest path directions (L, R, U) between two nodes in a binary tree by finding paths from root to each node and using their LCA.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'lca', 'string'],
      },
      {
        id: 'amount-of-time-for-binary-tree-infection',
        title: 'Amount of Time for Binary Tree to Be Infected',
        leetcodeNumber: 2385,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the number of minutes to infect an entire binary tree starting from a given node. Converts tree to undirected graph then uses BFS level-by-level.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'graph', 'dfs'],
      },
      {
        id: 'count-nodes-equal-to-average-subtree',
        title: 'Count Nodes Equal to Average of Subtree',
        leetcodeNumber: 2265,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count nodes where the node value equals the floor of the average of all values in its subtree. Uses post-order DFS to compute subtree sums and counts.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'post-order', 'average'],
      },
      {
        id: 'find-duplicate-subtrees',
        title: 'Find Duplicate Subtrees',
        leetcodeNumber: 652,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find all duplicate subtrees in a binary tree by serializing each subtree as a string via post-order DFS and tracking serializations in a hash map.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'hash map', 'serialization'],
      },
      {
        id: 'binary-tree-coloring-game',
        title: 'Binary Tree Coloring Game',
        leetcodeNumber: 1145,
        difficulty: 'Medium' as Difficulty,
        description:
          'Determine if the second player can guarantee winning a coloring game by picking adjacent to the first player node that controls the majority of nodes.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'greedy', 'math'],
      },
      {
        id: 'complete-binary-tree-inserter',
        title: 'Complete Binary Tree Inserter',
        leetcodeNumber: 919,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a data structure that inserts values into a complete binary tree maintaining level-order, finding the parent at index (size-1)//2 in a BFS array.',
        hasVisualization: true,
        tags: ['tree', 'bfs', 'design', 'array'],
      },
      {
        id: 'delete-leaves-with-given-value',
        title: 'Delete Leaves With a Given Value',
        leetcodeNumber: 1325,
        difficulty: 'Medium' as Difficulty,
        description:
          'Recursively delete all leaf nodes equal to a target value. After deletion, previously non-leaf nodes may become leaves and also need deleting. Uses post-order DFS.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'post-order', 'recursion'],
      },
      {
        id: 'longest-univalue-path',
        title: 'Longest Univalue Path',
        leetcodeNumber: 687,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the longest path in a binary tree where all adjacent nodes have the same value. Uses post-order DFS computing left and right arms of same-value nodes.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'post-order', 'path'],
      },
      {
        id: 'smallest-subtree-with-deepest-nodes',
        title: 'Smallest Subtree with all the Deepest Nodes',
        leetcodeNumber: 865,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the LCA of all deepest leaves in a binary tree using DFS that returns (node, depth) pairs. Equal depths indicate the current node is the LCA.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'lca', 'depth'],
      },
      {
        id: 'binary-tree-longest-consecutive-sequence',
        title: 'Binary Tree Longest Consecutive Sequence',
        leetcodeNumber: 298,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the longest consecutive downward path in a binary tree where each next node is exactly 1 greater than its parent. Uses DFS with streak tracking.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'consecutive', 'path'],
      },
      {
        id: 'flip-binary-tree-to-match-preorder',
        title: 'Flip Binary Tree To Match Preorder Traversal',
        leetcodeNumber: 971,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the minimum flips (swap children) to make the preorder traversal of a binary tree match a given voyage sequence. Uses greedy DFS.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'greedy', 'preorder'],
      },
      {
        id: 'sum-of-distances-in-tree',
        title: 'Sum of Distances in Tree',
        leetcodeNumber: 834,
        difficulty: 'Hard' as Difficulty,
        description:
          'Compute the sum of distances from each node to all other nodes in a tree using two DFS passes: first to compute subtree sizes, second to re-root for all nodes.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'rerooting', 'graph'],
      },
      {
        id: 'number-of-good-leaf-nodes-pairs',
        title: 'Number of Good Leaf Nodes Pairs',
        leetcodeNumber: 1530,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count pairs of leaf nodes with path distance at most a given threshold. Uses post-order DFS where each node returns a list of distances to leaf nodes in its subtree.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'post-order', 'leaf nodes'],
      },
      {
        id: 'path-sum-iv',
        title: 'Path Sum IV',
        leetcodeNumber: 666,
        difficulty: 'Medium' as Difficulty,
        description:
          'Compute the sum of all root-to-leaf path sums where the tree is encoded as 3-digit numbers (depth, position, value). Decode into a hash map then DFS.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'hash map', 'encoding'],
      },
      {
        id: 'binary-tree-maximum-path-sum',
        title: 'Binary Tree Maximum Path Sum',
        leetcodeNumber: 124,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the maximum path sum through any sequence of nodes in a binary tree. Post-order DFS computes max gain from each subtree (clamped at 0) and updates a global maximum.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'dynamic programming', 'post-order'],
      },
      {
        id: 'recover-binary-search-tree-swap',
        title: 'Recover Binary Search Tree (Swap)',
        leetcodeNumber: 99,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find and fix two nodes swapped in a BST by using in-order traversal. Violations in sorted order reveal the two swapped nodes which are then swapped back.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'inorder', 'bst'],
      },
      {
        id: 'count-complete-tree-nodes-ii',
        title: 'Count Complete Tree Nodes (Binary Search)',
        leetcodeNumber: 222,
        difficulty: 'Easy' as Difficulty,
        description:
          'Count nodes in a complete binary tree in O(log^2 n) time by comparing left-path and right-path heights. Equal heights indicate a perfect subtree with 2^h - 1 nodes.',
        hasVisualization: true,
        tags: ['tree', 'binary search', 'complete binary tree', 'math'],
      },
      {
        id: 'construct-binary-tree-from-string',
        title: 'Construct Binary Tree from String',
        leetcodeNumber: 536,
        difficulty: 'Medium' as Difficulty,
        description:
          'Build a binary tree from a string representation where each node is "val(left)(right)". Uses recursive descent parsing to handle integers and parentheses.',
        hasVisualization: true,
        tags: ['tree', 'recursion', 'string parsing', 'stack'],
      },
      {
        id: 'maximum-product-of-splitted-tree',
        title: 'Maximum Product of Splitted Binary Tree',
        leetcodeNumber: 1339,
        difficulty: 'Medium' as Difficulty,
        description:
          'Remove one edge to split a binary tree into two subtrees and maximize the product of their sums. Uses two DFS passes: first for total sum, second to evaluate each split.',
        hasVisualization: true,
        tags: ['tree', 'dfs', 'math', 'greedy'],
      },
      {
        id: 'operations-on-tree',
        title: 'Operations on Tree',
        leetcodeNumber: 1993,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design a tree data structure supporting lock, unlock, and upgrade operations. Upgrade locks a node and frees all locked descendants if no ancestor is locked.',
        hasVisualization: true,
        tags: ['tree', 'design', 'dfs', 'hash map'],
      },
    
      {
        id: 'all-possible-full-binary-trees',
        title: 'All Possible Full Binary Trees',
        leetcodeNumber: 894,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an odd integer n, return all structurally unique full binary trees with exactly n nodes. A full binary tree is one where every node has 0 or 2 children. We enumerate all ways to split n-1 nodes into left and right subtrees, recursing on each split.',
        hasVisualization: true,
        tags: ['Tree', 'Recursion', 'Dynamic Programming', 'Memoization'],
      },
      {
        id: 'average-of-levels-ii',
        title: 'Average of Levels in Binary Tree',
        leetcodeNumber: 637,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a binary tree, return the average value of the nodes on each level. Use BFS to process level by level, computing the average at each level.',
        hasVisualization: true,
        tags: ['Tree', 'BFS', 'Level Order'],
      },
      {
        id: 'balance-a-binary-search-tree-ii',
        title: 'Balance a Binary Search Tree II',
        leetcodeNumber: 1382,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a BST, convert it into a balanced BST. Perform an in-order traversal to get sorted values, then build a balanced BST using the sorted array by always choosing the middle element as the root.',
        hasVisualization: true,
        tags: ['Tree', 'BST', 'Divide and Conquer', 'In-order Traversal'],
      },
      {
        id: 'binary-tree-from-preorder-and-postorder',
        title: 'Construct Binary Tree from Preorder and Postorder',
        leetcodeNumber: 889,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given preorder and postorder traversal arrays, reconstruct a binary tree. The root is preorder[0]. The left subtree root is preorder[1]; find it in postorder to determine left subtree size, then recurse for both subtrees.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Divide and Conquer', 'Recursion'],
      },
      {
        id: 'binary-tree-level-order-ii',
        title: 'Binary Tree Level Order Traversal II',
        leetcodeNumber: 107,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return the bottom-up level order traversal of its nodes values (from leaves to root, left to right at each level). Use standard BFS and then reverse the result.',
        hasVisualization: true,
        tags: ['Tree', 'BFS', 'Level Order'],
      },
      {
        id: 'binary-tree-vertical-order-traversal-ii',
        title: 'Binary Tree Vertical Order Traversal II',
        leetcodeNumber: 314,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return the vertical order traversal of its nodes values. For each node at position (row, col), the left child has position (row+1, col-1) and the right child has position (row+1, col+1). The column index determines the order. Use BFS with column tracking.',
        hasVisualization: true,
        tags: ['Tree', 'BFS', 'Hash Map', 'Sorting'],
      },
      {
        id: 'block-placement-queries',
        title: 'Block Placement Queries',
        leetcodeNumber: 2940,
        difficulty: 'Hard' as Difficulty,
        description:
          'Process queries on a number line [0, inf]. Type 1: place an obstacle at x. Type 2: can we place a block of size sz ending at position x (i.e., does [x-sz+1, x] have no obstacle)? Use a sorted set of obstacle positions and binary search to check gaps.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Binary Search', 'Sorted Set', 'Design'],
      },
      {
        id: 'booking-concert-tickets',
        title: 'Booking Concert Tickets in Groups',
        leetcodeNumber: 2286,
        difficulty: 'Hard' as Difficulty,
        description:
          'A concert has n rows each with maxRow seats. Support gather(k, maxRow): find lowest row ≤ maxRow with k consecutive seats, book them. Support scatter(k, maxRow): book k seats across rows ≤ maxRow as early as possible. Uses segment tree for range max and prefix sum queries.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Binary Search', 'Design'],
      },
      {
        id: 'boundary-of-binary-tree-ii',
        title: 'Boundary of Binary Tree',
        leetcodeNumber: 545,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return the values of its boundary nodes in counter-clockwise order: root, left boundary (excluding leaves), leaves (left to right), right boundary (excluding leaves, bottom to top).',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Boundary Traversal'],
      },
      {
        id: 'construct-binary-search-tree-from-preorder',
        title: 'Construct BST from Preorder Traversal',
        leetcodeNumber: 1008,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a preorder traversal of a BST, reconstruct the BST. The first element is the root. Using BST bounds (min, max), place each preorder element in the correct position without needing the inorder.',
        hasVisualization: true,
        tags: ['Tree', 'BST', 'Preorder', 'Divide and Conquer'],
      },
      {
        id: 'construct-binary-tree-from-inorder-postorder-ii',
        title: 'Construct Binary Tree from Inorder & Postorder Traversal II',
        leetcodeNumber: 106,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given inorder and postorder traversal arrays, reconstruct the binary tree. The last element of postorder is always the root. Find that root in inorder to split left and right subtrees, then recurse.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Divide and Conquer'],
      },
      {
        id: 'construct-binary-tree-from-preorder-inorder-ii',
        title: 'Construct Binary Tree from Preorder & Inorder Traversal II',
        leetcodeNumber: 105,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given preorder and inorder traversal arrays, reconstruct the binary tree. The first element of preorder is always the root. Find that root in inorder to split left and right subtrees, then recurse.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Divide and Conquer', 'Hash Map'],
      },
      {
        id: 'convert-bst-to-greater-tree-ii',
        title: 'Convert BST to Greater Tree II',
        leetcodeNumber: 538,
        difficulty: 'Medium' as Difficulty,
        description:
          'Convert a BST so each node value becomes the original value plus the sum of all values greater than it in the BST. Use reverse in-order traversal (right → root → left) while accumulating a running sum.',
        hasVisualization: true,
        tags: ['Tree', 'BST', 'DFS', 'In-order Traversal', 'Reverse In-order'],
      },
      {
        id: 'count-good-nodes-ii',
        title: 'Count Good Nodes in Binary Tree',
        leetcodeNumber: 1448,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary tree, a node X is ',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Path Maximum'],
      },
      {
        id: 'count-good-triplets-in-array',
        title: 'Count Good Triplets in an Array',
        leetcodeNumber: 2179,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given two permutations nums1 and nums2 of [0,n-1], count triplets (x,y,z) such that x appears before y before z in both nums1 and nums2. Map values to their positions in nums1, then count inversions using a BIT on the reordered nums2 sequence.',
        hasVisualization: true,
        tags: ['Binary Indexed Tree', 'Merge Sort', 'Array', 'Permutation'],
      },
      {
        id: 'count-inversions-bit',
        title: 'Count Inversions (Binary Indexed Tree)',
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of inversions in an array: pairs (i,j) where i < j and arr[i] > arr[j]. Process elements left to right. For each element, query BIT for count of previously inserted elements > current element, then insert current. Uses coordinate compression.',
        hasVisualization: true,
        tags: ['Binary Indexed Tree', 'Merge Sort', 'Array', 'Classic'],
      },
      {
        id: 'count-of-range-sum-bit',
        title: 'Count of Range Sum (BIT / Fenwick Tree)',
        leetcodeNumber: 327,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count range sums in [lower, upper] using a Binary Indexed Tree (BIT). Compute prefix sums, coordinate compress them, then for each prefix[i] query the BIT for count of previous prefix[j] in [prefix[i]-upper, prefix[i]-lower].',
        hasVisualization: true,
        tags: ['Binary Indexed Tree', 'Prefix Sum', 'Coordinate Compression'],
      },
      {
        id: 'count-of-range-sum-segment',
        title: 'Count of Range Sum (Segment Tree)',
        leetcodeNumber: 327,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count the number of range sums that lie in [lower, upper]. Compute prefix sums, then for each prefix[i] count how many previous prefix[j] satisfy lower <= prefix[i] - prefix[j] <= upper. Use a segment tree on coordinate-compressed prefix sums.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Divide and Conquer', 'Prefix Sum', 'Merge Sort'],
      },
      {
        id: 'count-of-smaller-numbers-segment',
        title: 'Count of Smaller Numbers After Self (Segment Tree)',
        leetcodeNumber: 315,
        difficulty: 'Hard' as Difficulty,
        description:
          'For each element nums[i], count how many elements to its right are smaller. Process from right to left: query the segment tree for count of elements < nums[i], then insert nums[i]. Uses coordinate compression.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Binary Indexed Tree', 'Divide and Conquer', 'Merge Sort'],
      },
      {
        id: 'create-sorted-array-through-instructions',
        title: 'Create Sorted Array through Instructions',
        leetcodeNumber: 1649,
        difficulty: 'Hard' as Difficulty,
        description:
          'Insert each element of instructions into a sorted array. The cost to insert instructions[i] is min(count of elements < instructions[i], count of elements > instructions[i]) already in the array. Return total cost mod 1e9+7. Use a BIT for O(log n) counting.',
        hasVisualization: true,
        tags: ['Binary Indexed Tree', 'Segment Tree', 'Merge Sort', 'Array'],
      },
      {
        id: 'deepest-leaves-sum-ii',
        title: 'Deepest Leaves Sum',
        leetcodeNumber: 1302,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return the sum of values of its deepest leaves. Use BFS level by level — the sum of the last level gives the answer. Alternatively, use DFS tracking maximum depth.',
        hasVisualization: true,
        tags: ['Tree', 'BFS', 'DFS'],
      },
      {
        id: 'delete-node-in-bst-ii',
        title: 'Delete Node in a BST II',
        leetcodeNumber: 450,
        difficulty: 'Medium' as Difficulty,
        description:
          'Delete a node with a given key from a BST. Three cases: (1) node has no children — simply remove it; (2) node has one child — replace with that child; (3) node has two children — replace with in-order successor (smallest in right subtree), then delete successor.',
        hasVisualization: true,
        tags: ['Tree', 'BST', 'DFS', 'Recursion'],
      },
      {
        id: 'diameter-of-n-ary-tree',
        title: 'Diameter of N-ary Tree',
        leetcodeNumber: 1522,
        difficulty: 'Medium' as Difficulty,
        description:
          'The diameter of an N-ary tree is the length of the longest path between any two nodes. This path may or may not pass through the root. Use DFS: at each node, find the two longest child paths and update the global maximum.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Diameter'],
      },
      {
        id: 'falling-squares',
        title: 'Falling Squares',
        leetcodeNumber: 699,
        difficulty: 'Hard' as Difficulty,
        description:
          'Squares fall onto the X-axis. Each square [left, size] falls from the sky, lands on top of existing squares in its column range. After each drop, return the maximum height of all stacked squares. Uses a segment tree with lazy propagation for range-max queries.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Coordinate Compression', 'Array'],
      },
      {
        id: 'flip-equivalent-binary-trees-ii',
        title: 'Flip Equivalent Binary Trees II',
        leetcodeNumber: 951,
        difficulty: 'Medium' as Difficulty,
        description:
          'Two binary trees are flip equivalent if one can be transformed into the other by a series of flip operations (swapping left and right children at any node). Recursively check: either children match directly or are flipped.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Recursion', 'Flip Equivalence'],
      },
      {
        id: 'handling-sum-queries-after-update',
        title: 'Handling Sum Queries After Update',
        leetcodeNumber: 2569,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given two binary arrays nums1 and nums2, handle three query types: (1) flip nums1[l..r], (2) add sum(nums1)*p to nums2[l..r], (3) return sum of nums2. Use a segment tree with lazy propagation on nums1 for range flips and track the count of 1s.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Lazy Propagation', 'Array'],
      },
      {
        id: 'house-robber-iii-tree',
        title: 'House Robber III (Tree)',
        leetcodeNumber: 337,
        difficulty: 'Medium' as Difficulty,
        description:
          'The thief can rob houses arranged in a binary tree. Adjacent houses (directly connected) cannot both be robbed. Return the maximum amount that can be robbed. Use DFS returning a pair: (rob this node, skip this node). rob = node.val + skip(left) + skip(right). skip = max(rob/skip left) + max(rob/skip right).',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Dynamic Programming'],
      },
      {
        id: 'increasing-order-search-tree-ii',
        title: 'Increasing Order Search Tree II',
        leetcodeNumber: 897,
        difficulty: 'Easy' as Difficulty,
        description:
          'Rearrange a BST so the leftmost node becomes the root and every node has no left child and only a right child. Perform an in-order traversal to get sorted values, then rebuild as a right-skewed tree.',
        hasVisualization: true,
        tags: ['Tree', 'BST', 'DFS', 'In-order Traversal'],
      },
      {
        id: 'insert-into-a-bst-ii',
        title: 'Insert into a Binary Search Tree II',
        leetcodeNumber: 701,
        difficulty: 'Medium' as Difficulty,
        description:
          'Insert a value into a BST. Traverse the tree: if val < current node go left, else go right. When reaching a null position, insert the new node there. The BST property is maintained.',
        hasVisualization: true,
        tags: ['Tree', 'BST', 'DFS', 'Recursion', 'Insertion'],
      },
      {
        id: 'intervals-between-identical-elements',
        title: 'Intervals Between Identical Elements',
        leetcodeNumber: 2121,
        difficulty: 'Medium' as Difficulty,
        description:
          'For each index i, compute the sum of distances to all other indices with the same value. Group indices by value, then for each group use prefix sums: distance to left neighbors = i*left_count - sum_of_left_indices, distance to right neighbors = sum_of_right_indices - i*right_count.',
        hasVisualization: true,
        tags: ['Prefix Sum', 'Hash Map', 'Array'],
      },
      {
        id: 'invert-binary-tree-ii',
        title: 'Invert Binary Tree II',
        leetcodeNumber: 226,
        difficulty: 'Easy' as Difficulty,
        description:
          'Mirror a binary tree by swapping left and right children at every node. Use iterative BFS (level-order) to swap children level by level, contrasting with the recursive DFS approach.',
        hasVisualization: true,
        tags: ['Tree', 'BFS', 'Queue', 'Iterative', 'Mirror'],
      },
      {
        id: 'leaf-similar-trees-ii',
        title: 'Leaf-Similar Trees',
        leetcodeNumber: 872,
        difficulty: 'Easy' as Difficulty,
        description:
          'Two binary trees are leaf-similar if their leaf value sequences (left to right) are the same. Use DFS on each tree to collect the leaf sequence, then compare the two sequences.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Leaf Sequence'],
      },
      {
        id: 'longest-increasing-subsequence-bit',
        title: 'Longest Increasing Subsequence (BIT)',
        leetcodeNumber: 300,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the length of the longest strictly increasing subsequence. Use a BIT after coordinate compression: for each element x, query BIT for max LIS ending at values < x, set dp[x] = that max + 1, update BIT at rank(x) with dp[x].',
        hasVisualization: true,
        tags: ['Binary Indexed Tree', 'Dynamic Programming', 'Binary Search'],
      },
      {
        id: 'longest-path-with-different-characters',
        title: 'Longest Path With Different Adjacent Characters',
        leetcodeNumber: 2246,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a tree rooted at node 0 with n nodes labeled 0 to n-1, and a string s where s[i] is the character of node i, find the longest path where no two adjacent nodes have the same character. Use DFS: for each node, collect the two longest valid child paths and combine them.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'String'],
      },
      {
        id: 'longest-substring-with-at-most-k-distinct-segment',
        title: 'Longest Substring with At Most K Distinct Characters',
        leetcodeNumber: 340,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the length of the longest substring with at most k distinct characters. Use a sliding window with a frequency map: expand right pointer, when distinct chars exceed k shrink left pointer until within limit.',
        hasVisualization: true,
        tags: ['Sliding Window', 'Hash Map', 'String', 'Two Pointers'],
      },
      {
        id: 'max-sum-of-rectangle-no-larger-than-k',
        title: 'Max Sum of Rectangle No Larger Than K',
        leetcodeNumber: 363,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the maximum sum rectangle in a matrix that does not exceed k. Fix left and right column boundaries, compute row prefix sums between columns, then use a sorted set (or BIT) to find the maximum prefix sum ≤ current_prefix_sum - k.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Binary Search', 'Prefix Sum', 'Ordered Set'],
      },
      {
        id: 'maximum-binary-tree-ii',
        title: 'Maximum Binary Tree II',
        leetcodeNumber: 998,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a maximum binary tree and an integer val, insert val into the tree. A maximum binary tree means each node is greater than all nodes in its subtrees. Insert val as a new right subtree node if val is smaller than root; otherwise make root the left child of a new node with value val.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Recursion', 'Maximum Binary Tree'],
      },
      {
        id: 'maximum-depth-of-binary-tree-ii',
        title: 'Maximum Depth of Binary Tree',
        leetcodeNumber: 104,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from the root node down to the farthest leaf node. Use recursive DFS: depth of node = 1 + max(depth(left), depth(right)).',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Recursion'],
      },
      {
        id: 'maximum-depth-of-n-ary-tree',
        title: 'Maximum Depth of N-ary Tree',
        leetcodeNumber: 559,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of an N-ary tree, return its maximum depth — the number of nodes along the longest path from root to the farthest leaf. Represented as a binary tree for visualization (children stored left-to-right using left/right pointers).',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'BFS', 'Recursion'],
      },
      {
        id: 'merge-two-binary-trees-ii',
        title: 'Merge Two Binary Trees II',
        leetcodeNumber: 617,
        difficulty: 'Easy' as Difficulty,
        description:
          'Merge two binary trees by overlapping them. When two nodes overlap, sum their values. If only one node exists at a position, use that node. Recursively merge left and right subtrees.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Recursion', 'Merge'],
      },
      {
        id: 'minimum-depth-of-binary-tree-ii',
        title: 'Minimum Depth of Binary Tree',
        leetcodeNumber: 111,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a binary tree, return its minimum depth — the number of nodes along the shortest path from the root to the nearest leaf node. A leaf is a node with no children. Handle the case where one child is null (not a leaf path).',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'BFS'],
      },
      {
        id: 'my-calendar-segment',
        title: 'My Calendar I (Segment Tree)',
        leetcodeNumber: 729,
        difficulty: 'Medium' as Difficulty,
        description:
          'Implement a calendar that allows booking events [start, end) such that no two events overlap. Use a sorted interval list or segment tree. Return true if booking succeeds (no double booking), false otherwise.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Binary Search', 'Design', 'Ordered Set'],
      },
      {
        id: 'n-ary-tree-level-order',
        title: 'N-ary Tree Level Order Traversal',
        leetcodeNumber: 429,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an N-ary tree, return the level order traversal of its nodes values. Use BFS — at each level, collect all nodes and enqueue all their children. Visualized as a binary tree.',
        hasVisualization: true,
        tags: ['Tree', 'BFS', 'Level Order'],
      },
      {
        id: 'number-of-flowers-in-full-bloom',
        title: 'Number of Flowers in Full Bloom',
        leetcodeNumber: 2251,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given flower bloom intervals [start,end] and person arrival times, count how many flowers are blooming when each person arrives. Sort bloom starts and ends separately. For person at time t: blooms started = upper_bound(starts, t), blooms ended = upper_bound(ends, t-1). Answer = started - ended.',
        hasVisualization: true,
        tags: ['Binary Search', 'Prefix Sum', 'Sorting', 'Hash Map'],
      },
      {
        id: 'number-of-longest-increasing-bit',
        title: 'Number of Longest Increasing Subsequences (BIT)',
        leetcodeNumber: 673,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count the number of longest increasing subsequences. Use two BITs after coordinate compression: one tracks max LIS length ending at each rank, another tracks count of such subsequences. For each element, query both BITs, then update.',
        hasVisualization: true,
        tags: ['Binary Indexed Tree', 'Dynamic Programming', 'Segment Tree'],
      },
      {
        id: 'online-majority-element-in-subarray',
        title: 'Online Majority Element In Subarray',
        leetcodeNumber: 1157,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array, answer queries: is element threshold the majority (appears > (right-left+1)/2 times) in arr[left..right]? Preprocess by storing sorted indices for each value. For each query, binary search to count occurrences in range, then verify with Boyer-Moore.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Binary Search', 'Random', 'Design'],
      },
      {
        id: 'path-sum-all-paths',
        title: 'Path Sum II (All Paths)',
        leetcodeNumber: 113,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree and a target sum, return all root-to-leaf paths where the sum of node values equals targetSum. Use DFS with backtracking: explore each path, and when a leaf is reached with the remaining sum = 0, record the path.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Backtracking', 'Path Sum'],
      },
      {
        id: 'range-frequency-queries',
        title: 'Range Frequency Queries',
        leetcodeNumber: 2080,
        difficulty: 'Medium' as Difficulty,
        description:
          'Preprocess an array to answer queries: how many times does value appear in arr[left..right]? Store sorted indices for each value. For each query, binary search to find count in range in O(log n).',
        hasVisualization: true,
        tags: ['Binary Search', 'Hash Map', 'Array', 'Design'],
      },
      {
        id: 'range-module-segment',
        title: 'Range Module (Segment Tree with Lazy Propagation)',
        leetcodeNumber: 715,
        difficulty: 'Hard' as Difficulty,
        description:
          'Design a Range Module that tracks ranges of numbers. Support addRange(left, right), removeRange(left, right), and queryRange(left, right). Uses a segment tree with lazy propagation over a coordinate-compressed domain.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Lazy Propagation', 'Design', 'Ordered Set'],
      },
      {
        id: 'range-sum-query-mutable-ii',
        title: 'Range Sum Query - Mutable (Segment Tree)',
        leetcodeNumber: 307,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a mutable integer array, support two operations: update(index, val) and sumRange(left, right). Use a segment tree where each node stores the sum of a range. Build in O(n), update in O(log n), query in O(log n).',
        hasVisualization: true,
        tags: ['Segment Tree', 'Binary Indexed Tree', 'Array', 'Design'],
      },
      {
        id: 'rectangle-area-ii',
        title: 'Rectangle Area II',
        leetcodeNumber: 850,
        difficulty: 'Hard' as Difficulty,
        description:
          'Compute the total area covered by a set of axis-aligned rectangles, handling overlaps. Use a coordinate compression sweep line: sort all x-coordinates, for each vertical strip compute the active y-coverage using a segment tree or interval union.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Line Sweep', 'Coordinate Compression', 'Array'],
      },
      {
        id: 'reverse-pairs-segment',
        title: 'Reverse Pairs (Segment Tree)',
        leetcodeNumber: 493,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count reverse pairs (i, j) where i < j and nums[i] > 2 * nums[j]. Process from right to left: for each nums[i], query the BIT for count of elements already inserted that are < nums[i]/2, then insert nums[i]. Uses coordinate compression.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Binary Indexed Tree', 'Divide and Conquer', 'Merge Sort'],
      },
      {
        id: 'root-to-leaf-path-sum-ii',
        title: 'Path Sum (Root to Leaf)',
        leetcodeNumber: 112,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the root of a binary tree and a target sum, return true if there is a root-to-leaf path such that adding up all the values along the path equals targetSum. Use recursive DFS: subtract node value from target and check if any leaf gives remaining = 0.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Path Sum'],
      },
      {
        id: 'serialize-and-deserialize-binary-tree-ii',
        title: 'Serialize and Deserialize Binary Tree II',
        leetcodeNumber: 297,
        difficulty: 'Hard' as Difficulty,
        description:
          'Design an algorithm to serialize a binary tree to a string and deserialize it back using BFS (level-order). During serialization each level is recorded with null markers. Deserialization rebuilds by pairing each node with its children tokens.',
        hasVisualization: true,
        tags: ['Tree', 'BFS', 'Design', 'String'],
      },
      {
        id: 'serialize-and-deserialize-bst',
        title: 'Serialize and Deserialize BST',
        leetcodeNumber: 449,
        difficulty: 'Medium' as Difficulty,
        description:
          'Serialize a BST to a string using preorder traversal (no nulls needed — BST property lets us reconstruct). Deserialize by inserting values back in preorder sequence, using BST bounds to place each node correctly.',
        hasVisualization: true,
        tags: ['Tree', 'BST', 'Design', 'Preorder'],
      },
      {
        id: 'sliding-window-median-segment',
        title: 'Sliding Window Median',
        leetcodeNumber: 480,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the median of each sliding window of size k. Use a segment tree or two heaps. As the window slides, add the new element and remove the outgoing element, then query the median in O(log n) per step.',
        hasVisualization: true,
        tags: ['Segment Tree', 'Sliding Window', 'Heap', 'Two Pointers'],
      },
      {
        id: 'stamping-the-grid-segment',
        title: 'Stamping the Grid',
        leetcodeNumber: 2132,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a binary grid and stamp dimensions, determine if you can stamp the grid to fill all empty cells (0s) without covering occupied cells (1s). Use 2D prefix sums to check if a stamp placement is valid (no 1s in the region) and a 2D difference array to mark covered cells.',
        hasVisualization: true,
        tags: ['Prefix Sum', '2D Difference Array', 'Greedy', 'Array'],
      },
      {
        id: 'subtree-of-another-tree-ii',
        title: 'Subtree of Another Tree II',
        leetcodeNumber: 572,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and values as subRoot. At each node in root, check if the subtree rooted there is identical to subRoot.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Recursion', 'String Matching'],
      },
      {
        id: 'sum-root-to-leaf-numbers-ii',
        title: 'Sum Root to Leaf Numbers',
        leetcodeNumber: 129,
        difficulty: 'Medium' as Difficulty,
        description:
          'Each root-to-leaf path in the tree represents a number. For example, path 1->2->3 represents 123. Return the total sum of all root-to-leaf numbers. Use DFS, passing the accumulated number down: num = num*10 + node.val.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Math'],
      },
      {
        id: 'symmetric-tree-ii',
        title: 'Symmetric Tree II',
        leetcodeNumber: 101,
        difficulty: 'Easy' as Difficulty,
        description:
          'Check whether a binary tree is symmetric (mirror of itself) using an iterative BFS approach. Use a queue storing pairs of nodes that should be mirrors. For each pair, check values match and enqueue mirrored children.',
        hasVisualization: true,
        tags: ['Tree', 'BFS', 'Queue', 'Symmetry', 'Iterative'],
      },
      {
        id: 'tree-of-coprimes',
        title: 'Tree of Coprimes',
        leetcodeNumber: 1766,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a tree with node values, for each node find the closest ancestor (deepest) whose value is coprime with the node\\',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Math', 'GCD'],
      },
      {
        id: 'trim-a-binary-search-tree-ii',
        title: 'Trim a Binary Search Tree II',
        leetcodeNumber: 669,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a BST and bounds [low, high], trim the BST so all values lie within [low, high]. If a node value is less than low, its left subtree is also out of range — return trimmed right subtree. If greater than high, return trimmed left subtree. Otherwise trim both children.',
        hasVisualization: true,
        tags: ['Tree', 'BST', 'DFS', 'Recursion'],
      },
      {
        id: 'unique-binary-search-trees-ii',
        title: 'Unique Binary Search Trees II',
        leetcodeNumber: 95,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer n, generate all structurally unique BSTs that store values 1 to n. For each possible root r (1 to n), all values less than r form the left subtree and all values greater form the right subtree. Recurse and combine all left/right pairs.',
        hasVisualization: true,
        tags: ['Tree', 'BST', 'Dynamic Programming', 'Backtracking', 'Recursion'],
      },
      {
        id: 'unique-binary-search-trees-iii',
        title: 'Unique Binary Search Trees III (Count)',
        leetcodeNumber: 96,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer n, return the number of structurally unique BSTs storing values 1 to n (Catalan number). Use dynamic programming: dp[i] = sum of dp[j-1] * dp[i-j] for j from 1 to i, where j is the root.',
        hasVisualization: true,
        tags: ['Tree', 'BST', 'Dynamic Programming', 'Math', 'Catalan Number'],
      },
      {
        id: 'vertical-order-traversal-ii',
        title: 'Vertical Order Traversal of a Binary Tree',
        leetcodeNumber: 987,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given the root of a binary tree, return the vertical order traversal. For each node at (row, col), collect values sorted by (col, row, val). Nodes in the same position are sorted by value. Use DFS to collect (row, col, val) tuples, then sort and group by column.',
        hasVisualization: true,
        tags: ['Tree', 'DFS', 'Sorting', 'Hash Map'],
      },
      {
        id: 'zigzag-level-order-traversal-ii',
        title: 'Binary Tree Zigzag Level Order Traversal',
        leetcodeNumber: 103,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given the root of a binary tree, return the zigzag level order traversal of its nodes values. In zigzag order, odd levels go left-to-right and even levels go right-to-left. Use BFS level by level, reversing alternate levels.',
        hasVisualization: true,
        tags: ['Tree', 'BFS', 'Level Order'],
      },
    ],
  },

  // ─── 12. Tries ─────────────────────────────────────────────────────
  {
    id: 'tries',
    name: 'Tries',
    icon: 'T·',
    color: 'text-fuchsia-400',
    gradient: 'from-fuchsia-500/20 to-fuchsia-600/10',
    borderColor: 'border-fuchsia-500/30',
    problems: [
      {
        id: 'design-a-trie',
        title: 'Design a Trie',
        difficulty: 'Medium',
        leetcodeNumber: 208,
        description:
          'Implement a trie with insert, search, and startsWith operations for efficient prefix lookups.',
        hasVisualization: true,
        tags: ['trie', 'design', 'string'],
      },
      {
        id: 'insert-and-search-words-with-wildcards',
        title: 'Insert and Search Words with Wildcards',
        difficulty: 'Medium',
        leetcodeNumber: 211,
        description:
          'Design a data structure that supports adding words and searching with wildcard dot characters.',
        hasVisualization: true,
        tags: ['trie', 'design', 'string', 'backtracking'],
      },
      {
        id: 'find-all-words-on-a-board',
        title: 'Find All Words on a Board',
        difficulty: 'Hard',
        leetcodeNumber: 212,
        description:
          'Find all words from a dictionary that can be formed on a character board using a trie-guided DFS.',
        hasVisualization: true,
        tags: ['trie', 'backtracking', 'matrix'],
      },
      {
        id: 'implement-magic-dictionary',
        title: 'Implement Magic Dictionary',
        difficulty: 'Medium',
        leetcodeNumber: 676,
        description:
          'Design a data structure with buildDict and search operations. search(word) returns true if there is any string in the dictionary that differs from word by exactly one character. Build a trie from the dictionary, then DFS the trie while tracking how many characters differ. Allow exactly one mismatch.',
        hasVisualization: true,
        tags: ['trie', 'string', 'design'],
      },
      {
        id: 'longest-word-in-dictionary',
        title: 'Longest Word in Dictionary',
        difficulty: 'Medium',
        leetcodeNumber: 720,
        description:
          'Find the longest word in the dictionary that can be built one character at a time by other words in the dictionary. Insert all words into a trie. A word is valid if every prefix of length 1 through len-1 exists in the dictionary (every prefix node is marked as end of word). BFS/DFS through the trie to find the longest valid path.',
        hasVisualization: true,
        tags: ['trie', 'hash-map', 'string'],
      },
      {
        id: 'replace-words',
        title: 'Replace Words',
        difficulty: 'Medium',
        leetcodeNumber: 648,
        description:
          'Replace words in a sentence with their shortest root from a dictionary. Insert all roots into a trie. For each word in the sentence, traverse the trie to find the shortest matching root prefix. If found, replace the word with that root; otherwise keep the original word.',
        hasVisualization: true,
        tags: ['trie', 'string', 'hash-map'],
      },
      {
        id: 'search-suggestions-system',
        title: 'Search Suggestions System',
        difficulty: 'Medium',
        leetcodeNumber: 1268,
        description:
          'Given an array of products and a search word, return up to 3 lexicographically smallest product suggestions after each character typed. Sort products, then use a trie or binary search. For each prefix, collect at most 3 words that start with that prefix in sorted order.',
        hasVisualization: true,
        tags: ['trie', 'binary-search', 'string'],
      },
    
      {
        id: 'design-add-and-search-words',
        title: 'Design Add and Search Words Data Structure',
        leetcodeNumber: 211,
        difficulty: 'Medium' as Difficulty,
        description:
          'Implement a WordDictionary that supports addWord and search with wildcard "." which can match any character. Uses a trie for storage. The search function performs DFS: for regular characters it follows the trie node; for "." it recursively tries all child nodes. Each node tracks whether it marks a word end.',
        hasVisualization: true,
        tags: ['trie', 'dfs', 'backtracking', 'design'],
      },
      {
        id: 'map-sum-pairs',
        title: 'Map Sum Pairs',
        leetcodeNumber: 677,
        difficulty: 'Medium' as Difficulty,
        description:
          'Implement a MapSum class with insert and sum methods. insert(key, val) inserts a key-value pair. sum(prefix) returns the sum of all values whose keys have the given prefix. A trie is used where each node stores the cumulative prefix sum, updated on every insert. This allows O(prefix length) sum queries.',
        hasVisualization: true,
        tags: ['trie', 'hash map', 'prefix', 'design'],
      },
      {
        id: 'maximum-xor-with-trie',
        title: 'Maximum XOR of Two Numbers in an Array (Trie)',
        leetcodeNumber: 421,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the maximum XOR of any two numbers in an array. Build a binary trie where each number is inserted as a 32-bit binary string. To find max XOR for each number, greedily traverse the trie choosing the opposite bit (1 vs 0) at each level to maximize the XOR result. This gives O(n) query time after O(n) build.',
        hasVisualization: true,
        tags: ['trie', 'binary trie', 'bit manipulation', 'greedy'],
      },
      {
        id: 'palindrome-pairs',
        title: 'Palindrome Pairs',
        leetcodeNumber: 336,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a list of unique words, find all pairs of distinct indices (i, j) such that words[i] + words[j] is a palindrome. For each word, check: (1) its reverse exists in the map and (2) splitting the word at each position to see if one part is a palindrome and the other reversed is in the map. Uses a hash map for O(k) lookups.',
        hasVisualization: true,
        tags: ['trie', 'hash map', 'palindrome', 'string'],
      },
      {
        id: 'stream-of-characters',
        title: 'Stream of Characters',
        leetcodeNumber: 1032,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a list of words and a stream of characters, for each character in the stream determine if any suffix of the stream so far matches any word in the list. Insert all words reversed into a trie. As each character arrives, maintain a list of active trie nodes and advance them. A match occurs if any active node marks a word end.',
        hasVisualization: true,
        tags: ['trie', 'reverse trie', 'stream', 'suffix matching'],
      },
      {
        id: 'word-search-ii-trie',
        title: 'Word Search II (Trie)',
        leetcodeNumber: 212,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an m x n board and a list of words, find all words that exist in the board. Characters must be connected horizontally or vertically. Build a trie from the words, then DFS from each cell. At each DFS step, follow the trie; if a word end is reached, record it. Pruning: remove found words and dead trie branches for efficiency.',
        hasVisualization: true,
        tags: ['trie', 'dfs', 'backtracking', 'matrix'],
      },
    ],
  },

  // ─── 13. Graphs ────────────────────────────────────────────────────
  {
    id: 'graphs',
    name: 'Graphs',
    icon: '◇',
    color: 'text-sky-400',
    gradient: 'from-sky-500/20 to-sky-600/10',
    borderColor: 'border-sky-500/30',
    problems: [
      {
        id: 'graph-deep-copy',
        title: 'Graph Deep Copy',
        difficulty: 'Medium',
        leetcodeNumber: 133,
        description:
          'Create a deep copy of a connected undirected graph using BFS or DFS with a visited map.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'dfs', 'hash-map'],
      },
      {
        id: 'count-islands',
        title: 'Count Islands',
        difficulty: 'Medium',
        leetcodeNumber: 200,
        description:
          'Count the number of distinct islands in a 2D grid by flood-filling connected land cells.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'dfs', 'matrix'],
      },
      {
        id: 'matrix-infection',
        title: 'Matrix Infection',
        difficulty: 'Medium',
        leetcodeNumber: 994,
        description:
          'Determine how many rounds it takes for all cells to become infected using multi-source BFS.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'matrix'],
      },
      {
        id: 'bipartite-graph-validation',
        title: 'Bipartite Graph Validation',
        difficulty: 'Medium',
        leetcodeNumber: 785,
        description:
          'Check if a graph can be two-colored so no adjacent nodes share the same color.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'dfs'],
      },
      {
        id: 'longest-increasing-path',
        title: 'Longest Increasing Path',
        difficulty: 'Hard',
        leetcodeNumber: 329,
        description:
          'Find the longest strictly increasing path in a matrix using DFS with memoization.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'dynamic-programming', 'matrix'],
      },
      {
        id: 'shortest-transformation-sequence',
        title: 'Shortest Transformation Sequence',
        difficulty: 'Hard',
        leetcodeNumber: 127,
        description:
          'Find the shortest word ladder from begin to end word, changing one letter at a time, using BFS.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'string'],
      },
      {
        id: 'merging-communities',
        title: 'Merging Communities',
        difficulty: 'Medium',
        leetcodeNumber: 547,
        description:
          'Group connected nodes into communities using Union-Find with path compression and union by rank.',
        hasVisualization: true,
        tags: ['graph', 'union-find'],
      },
      {
        id: 'prerequisites',
        title: 'Prerequisites',
        difficulty: 'Medium',
        leetcodeNumber: 207,
        description:
          'Determine if all courses can be completed given prerequisite constraints using topological sort.',
        hasVisualization: true,
        tags: ['graph', 'topological-sort', 'dfs'],
      },
      {
        id: 'shortest-path',
        title: 'Shortest Path',
        difficulty: 'Medium',
        leetcodeNumber: 743,
        description:
          'Find the shortest paths from a source node to all other nodes using Dijkstra\'s algorithm.',
        hasVisualization: true,
        tags: ['graph', 'dijkstra', 'heap'],
      },
      {
        id: 'connect-the-dots',
        title: 'Connect the Dots',
        difficulty: 'Medium',
        leetcodeNumber: 1584,
        description:
          'Find the minimum cost to connect all points using a minimum spanning tree algorithm.',
        hasVisualization: true,
        tags: ['graph', 'mst', 'greedy'],
      },
      {
        id: 'accounts-merge',
        title: 'Accounts Merge',
        difficulty: 'Medium',
        leetcodeNumber: 721,
        description:
          'Given a list of accounts where each account has a name and list of emails, merge accounts that share a common email. Two accounts belong to the same person if they share any email. Uses Union-Find: union all emails within an account, then group by root.',
        hasVisualization: true,
        tags: ['graph', 'union-find', 'dfs', 'hash-map'],
      },
      {
        id: 'alien-dictionary',
        title: 'Alien Dictionary',
        difficulty: 'Hard',
        leetcodeNumber: 269,
        description:
          'Given a list of words sorted in an alien language, derive the order of characters in the alien alphabet. Compare adjacent words to find ordering constraints between characters, then topological sort the resulting DAG. Return ',
        hasVisualization: true,
        tags: ['graph', 'topological-sort', 'dfs', 'bfs'],
      },
      {
        id: 'all-paths-source-to-target',
        title: 'All Paths Source to Target',
        difficulty: 'Medium',
        leetcodeNumber: 797,
        description:
          'Given a DAG (Directed Acyclic Graph) with n nodes (0 to n-1), return all paths from node 0 to node n-1. Use DFS with backtracking: at each node, try all outgoing edges and record paths that reach the target.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'backtracking', 'dag'],
      },
      {
        id: 'cheapest-flights-k-stops',
        title: 'Cheapest Flights Within K Stops',
        difficulty: 'Medium',
        leetcodeNumber: 787,
        description:
          'Given n cities connected by flights [from, to, price] and k stops limit, find the cheapest price from src to dst with at most k stops. Uses Bellman-Ford modified to relax edges over k+1 iterations, limiting stops per relaxation round.',
        hasVisualization: true,
        tags: ['graph', 'bellman-ford', 'bfs', 'dynamic-programming'],
      },
      {
        id: 'course-schedule-ii',
        title: 'Course Schedule II',
        difficulty: 'Medium',
        leetcodeNumber: 210,
        description:
          'Given numCourses courses and prerequisites, return a valid ordering to take all courses (topological sort). If impossible due to a cycle, return an empty array. Uses Kahn\'s algorithm: repeatedly remove nodes with in-degree 0.',
        hasVisualization: true,
        tags: ['graph', 'topological-sort', 'bfs'],
      },
      {
        id: 'evaluate-division',
        title: 'Evaluate Division',
        difficulty: 'Medium',
        leetcodeNumber: 399,
        description:
          'Given equations like A/B = k and queries like C/D = ?, find each query result. Build a weighted directed graph where an edge A→B has weight k and B→A has weight 1/k. Answer each query using DFS/BFS from source to target, multiplying edge weights along the path.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'bfs', 'weighted-graph'],
      },
      {
        id: 'graph-valid-tree',
        title: 'Graph Valid Tree',
        difficulty: 'Medium',
        leetcodeNumber: 261,
        description:
          'Given n nodes and undirected edges, determine if they form a valid tree. A valid tree has exactly n-1 edges AND is fully connected (one connected component). Use Union-Find: if any edge connects nodes already in the same component, there is a cycle.',
        hasVisualization: true,
        tags: ['graph', 'union-find', 'dfs', 'bfs'],
      },
      {
        id: 'keys-and-rooms',
        title: 'Keys and Rooms',
        difficulty: 'Medium',
        leetcodeNumber: 841,
        description:
          'There are n rooms (0 to n-1). You start in room 0. Each room contains keys to other rooms. Can you visit all rooms? Use DFS/BFS: start from room 0, collect keys, unlock and visit new rooms. Return true if all rooms visited.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'bfs'],
      },
      {
        id: 'max-area-of-island',
        title: 'Max Area of Island',
        difficulty: 'Medium',
        leetcodeNumber: 695,
        description:
          'Given a binary matrix (1=land, 0=water), find the area of the largest island. An island is a group of connected 1s (4-directionally). Use DFS to flood-fill each island and count its cells, tracking the maximum.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'bfs', 'matrix'],
      },
      {
        id: 'minimum-height-trees',
        title: 'Minimum Height Trees',
        difficulty: 'Medium',
        leetcodeNumber: 310,
        description:
          'Given n nodes (0 to n-1) and undirected edges, find all roots such that the resulting tree has minimum height. The strategy is to iteratively trim leaves (degree-1 nodes) from the outside in, like peeling an onion. The remaining 1-2 nodes are the answer.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'topological-sort', 'tree'],
      },
      {
        id: 'number-of-closed-islands',
        title: 'Number of Closed Islands',
        difficulty: 'Medium',
        leetcodeNumber: 1254,
        description:
          'Given a binary matrix (0=land, 1=water), count islands that are completely surrounded by water (i.e., not touching the border). Strategy: first flood-fill all land connected to borders (mark as water), then count remaining land islands.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'bfs', 'matrix'],
      },
      {
        id: 'number-of-connected-components',
        title: 'Number of Connected Components in Graph',
        difficulty: 'Medium',
        leetcodeNumber: 323,
        description:
          'Given n nodes (0 to n-1) and undirected edges, count the number of connected components. Uses Union-Find: initially each node is its own component, then union connected nodes. The answer equals the number of distinct root nodes remaining.',
        hasVisualization: true,
        tags: ['graph', 'union-find', 'dfs', 'bfs'],
      },
      {
        id: 'open-the-lock',
        title: 'Open the Lock',
        difficulty: 'Medium',
        leetcodeNumber: 752,
        description:
          'A lock has 4 wheels each with digits 0-9. Starting at ',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'hash-set'],
      },
      {
        id: 'pacific-atlantic-water-flow',
        title: 'Pacific Atlantic Water Flow',
        difficulty: 'Medium',
        leetcodeNumber: 417,
        description:
          'Given an m x n matrix of heights, find all cells from which water can flow to both the Pacific ocean (top/left border) and the Atlantic ocean (bottom/right border). Water flows from high to equal or lower elevation. Use reverse BFS from each ocean border inward.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'dfs', 'matrix'],
      },
      {
        id: 'redundant-connection',
        title: 'Redundant Connection',
        difficulty: 'Medium',
        leetcodeNumber: 684,
        description:
          'Given a tree with n nodes (1-indexed) and one extra edge added, find the edge that creates a cycle. Process edges one by one using Union-Find: the first edge where both endpoints are already in the same component is the redundant edge.',
        hasVisualization: true,
        tags: ['graph', 'union-find', 'dfs'],
      },
      {
        id: 'shortest-path-binary-matrix',
        title: 'Shortest Path in Binary Matrix',
        difficulty: 'Medium',
        leetcodeNumber: 1091,
        description:
          'Given an n x n binary matrix, find the shortest clear path from top-left (0,0) to bottom-right (n-1,n-1). A clear path uses only 0 cells and can move in 8 directions. Uses BFS layer by layer — the first time we reach the destination gives the shortest distance.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'matrix', 'shortest-path'],
      },
      {
        id: 'snakes-and-ladders',
        title: 'Snakes and Ladders',
        difficulty: 'Medium',
        leetcodeNumber: 909,
        description:
          'Given an n x n board with snakes and ladders (-1=no special), find the minimum number of dice rolls to reach square n². Number squares 1..n² in Boustrophedon order (left-right, right-left alternating from bottom). BFS on the square numbers.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'matrix'],
      },
      {
        id: 'surrounded-regions',
        title: 'Surrounded Regions',
        difficulty: 'Medium',
        leetcodeNumber: 130,
        description:
          'Given a board of ',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'dfs', 'matrix'],
      },
      {
        id: 'walls-and-gates',
        title: 'Walls and Gates',
        difficulty: 'Medium',
        leetcodeNumber: 286,
        description:
          'Fill each empty room with its distance to the nearest gate. The grid has -1=wall, 0=gate, INF=empty room. Use multi-source BFS starting simultaneously from all gates. This guarantees each room gets the minimum distance in one pass.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'multi-source-bfs', 'matrix'],
      },
      {
        id: 'word-search',
        title: 'Word Search',
        difficulty: 'Medium',
        leetcodeNumber: 79,
        description:
          'Given an m x n board of characters and a word, return true if the word exists in the grid. The word must be constructed from letters of sequentially adjacent cells (horizontally or vertically). The same cell may not be used more than once. Uses DFS backtracking.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'backtracking', 'matrix'],
      },
      // ── Shortest Path, MST, Topo Sort, Union-Find ──
      {
        id: 'network-delay-time',
        title: 'Network Delay Time',
        difficulty: 'Medium',
        leetcodeNumber: 743,
        description:
          'Find how long it takes for all nodes to receive a signal from source k using Bellman-Ford edge relaxation.',
        hasVisualization: true,
        tags: ['bellman-ford', 'shortest path', 'graph'],
      },
      {
        id: 'bellman-ford-algorithm',
        title: 'Bellman-Ford Shortest Path',
        difficulty: 'Medium',
        description:
          'Classic Bellman-Ford: relax all edges V-1 times to find single-source shortest paths, even with negative weights.',
        hasVisualization: true,
        tags: ['bellman-ford', 'shortest path', 'graph'],
      },
      {
        id: 'floyd-warshall-algorithm',
        title: 'Floyd-Warshall All-Pairs Shortest Path',
        difficulty: 'Medium',
        description:
          'Compute shortest paths between all pairs of vertices using dynamic programming with intermediate vertex enumeration.',
        hasVisualization: true,
        tags: ['floyd-warshall', 'all-pairs shortest path', 'graph'],
      },
      {
        id: 'kruskals-algorithm',
        title: 'Kruskal MST Algorithm',
        difficulty: 'Medium',
        description:
          'Build a Minimum Spanning Tree by sorting edges by weight and greedily adding edges that do not form cycles using Union-Find.',
        hasVisualization: true,
        tags: ['kruskal', 'MST', 'union-find', 'greedy', 'graph'],
      },
      {
        id: 'prims-algorithm',
        title: 'Prim MST Algorithm',
        difficulty: 'Medium',
        description:
          'Grow a Minimum Spanning Tree vertex by vertex using a min-priority queue to always pick the cheapest cut edge.',
        hasVisualization: true,
        tags: ['prim', 'MST', 'priority queue', 'greedy', 'graph'],
      },
      {
        id: 'topological-sort-bfs',
        title: 'Topological Sort (Kahn BFS)',
        difficulty: 'Medium',
        description:
          'Perform topological ordering of a DAG using Kahn BFS: enqueue zero-in-degree nodes and repeatedly remove them.',
        hasVisualization: true,
        tags: ['topological sort', 'BFS', 'Kahn', 'DAG', 'graph'],
      },
      {
        id: 'topological-sort-dfs',
        title: 'Topological Sort (DFS)',
        difficulty: 'Medium',
        description:
          'Produce a topological order of a DAG using DFS post-order: after all descendants are visited, push the node to a stack.',
        hasVisualization: true,
        tags: ['topological sort', 'DFS', 'DAG', 'graph'],
      },
      {
        id: 'tarjans-strongly-connected',
        title: 'Tarjan Strongly Connected Components',
        difficulty: 'Hard',
        description:
          'Find all SCCs in a directed graph in O(V+E) using DFS with discovery time and low-link values.',
        hasVisualization: true,
        tags: ['tarjan', 'SCC', 'DFS', 'graph'],
      },
      {
        id: 'articulation-points',
        title: 'Articulation Points in Graph',
        difficulty: 'Hard',
        description:
          'Find all cut vertices in an undirected graph whose removal increases the number of connected components.',
        hasVisualization: true,
        tags: ['articulation points', 'DFS', 'low-link', 'graph'],
      },
      {
        id: 'bridges-in-graph',
        title: 'Bridges in Graph (Critical Connections)',
        difficulty: 'Hard',
        leetcodeNumber: 1192,
        description:
          'Find all bridge edges in an undirected graph using DFS with low-link values. An edge is a bridge if low[v] > disc[u].',
        hasVisualization: true,
        tags: ['bridges', 'critical connections', 'DFS', 'graph'],
      },
      {
        id: 'dijkstra-with-path',
        title: 'Dijkstra with Path Reconstruction',
        difficulty: 'Medium',
        description:
          'Dijkstra shortest-path algorithm augmented with a predecessor array to reconstruct the actual shortest path.',
        hasVisualization: true,
        tags: ['dijkstra', 'shortest path', 'priority queue', 'graph'],
      },
      {
        id: 'a-star-search',
        title: 'A* Pathfinding Algorithm',
        difficulty: 'Hard',
        description:
          'Informed search using f(n) = g(n) + h(n) with an admissible heuristic to find shortest paths faster than Dijkstra.',
        hasVisualization: true,
        tags: ['A*', 'heuristic search', 'shortest path', 'graph'],
      },
      {
        id: 'word-ladder-ii',
        title: 'Word Ladder II',
        difficulty: 'Hard',
        leetcodeNumber: 126,
        description:
          'Find all shortest transformation sequences between two words using BFS to build a shortest-path DAG and DFS to enumerate paths.',
        hasVisualization: true,
        tags: ['BFS', 'DFS', 'word ladder', 'shortest path', 'graph'],
      },
      {
        id: 'reconstruct-itinerary',
        title: 'Reconstruct Itinerary',
        difficulty: 'Hard',
        leetcodeNumber: 332,
        description:
          'Find the lexicographically smallest Eulerian path in a directed multigraph of airline tickets using Hierholzer algorithm.',
        hasVisualization: true,
        tags: ['Eulerian path', 'Hierholzer', 'DFS', 'graph'],
      },
      {
        id: 'min-cost-to-connect-all-points',
        title: 'Min Cost to Connect All Points',
        difficulty: 'Medium',
        leetcodeNumber: 1584,
        description:
          'Find the minimum cost MST on 2D points where edge weights are Manhattan distances, solved with Kruskal algorithm.',
        hasVisualization: true,
        tags: ['MST', 'Kruskal', 'union-find', 'Manhattan distance', 'graph'],
      },
      {
        id: 'checking-existence-of-edge-length-limited-paths',
        title: 'Edge Length Limited Paths',
        difficulty: 'Hard',
        leetcodeNumber: 1697,
        description:
          'Answer offline queries about path existence with edge weight limit using sorted edges and incremental Union-Find.',
        hasVisualization: true,
        tags: ['union-find', 'offline queries', 'sorting', 'graph'],
      },
      {
        id: 'count-unreachable-pairs',
        title: 'Count Unreachable Pairs of Nodes',
        difficulty: 'Medium',
        leetcodeNumber: 2316,
        description:
          'Count node pairs with no connecting path by finding connected components with Union-Find and multiplying component sizes.',
        hasVisualization: true,
        tags: ['union-find', 'connected components', 'counting', 'graph'],
      },
      {
        id: 'longest-cycle-in-graph',
        title: 'Longest Cycle in a Graph',
        difficulty: 'Hard',
        leetcodeNumber: 2360,
        description:
          'Find the longest cycle in a functional directed graph (each node has at most one outgoing edge) using visited-time tracking.',
        hasVisualization: true,
        tags: ['cycle detection', 'directed graph', 'DFS', 'graph'],
      },
      {
        id: 'shortest-path-with-alternating-colors',
        title: 'Shortest Path with Alternating Colors',
        difficulty: 'Medium',
        leetcodeNumber: 1129,
        description:
          'BFS on a state graph (node, lastColor) to find shortest paths that alternate between red and blue edges.',
        hasVisualization: true,
        tags: ['BFS', 'shortest path', 'state graph', 'graph'],
      },
      {
        id: 'parallel-courses',
        title: 'Parallel Courses',
        difficulty: 'Medium',
        leetcodeNumber: 1136,
        description:
          'Find the minimum semesters to complete all courses (unlimited per semester) using topological sort layer BFS.',
        hasVisualization: true,
        tags: ['topological sort', 'DAG', 'BFS', 'longest path', 'graph'],
      },
      {
        id: 'course-schedule-iv',
        title: 'Course Schedule IV',
        difficulty: 'Medium',
        leetcodeNumber: 1462,
        description:
          'Answer prerequisite reachability queries in O(1) each by precomputing transitive closure with Floyd-Warshall.',
        hasVisualization: true,
        tags: ['transitive closure', 'Floyd-Warshall', 'DAG', 'graph'],
      },
      {
        id: 'minimum-cost-to-make-valid-path',
        title: 'Minimum Cost to Make at Least One Valid Path in a Grid',
        difficulty: 'Hard',
        leetcodeNumber: 1368,
        description:
          'Find minimum direction-change cost for a grid path using 0-1 BFS: free moves go to deque front, costly moves to back.',
        hasVisualization: true,
        tags: ['0-1 BFS', 'deque', 'shortest path', 'grid', 'graph'],
      },
      {
        id: 'graph-coloring',
        title: 'Graph Coloring with Backtracking',
        difficulty: 'Medium',
        description:
          'Assign colors to graph vertices so no adjacent pair shares a color, using backtracking to explore all valid assignments.',
        hasVisualization: true,
        tags: ['graph coloring', 'backtracking', 'chromatic number', 'graph'],
      },
      {
        id: 'euler-circuit',
        title: 'Euler Circuit in Graph',
        difficulty: 'Hard',
        description:
          'Find an Eulerian circuit visiting every edge exactly once using Hierholzer algorithm on an even-degree undirected graph.',
        hasVisualization: true,
        tags: ['Euler circuit', 'Hierholzer', 'DFS', 'graph'],
      },
      {
        id: 'hamiltonian-path',
        title: 'Hamiltonian Path with Backtracking',
        difficulty: 'Hard',
        description:
          'Find a path visiting every vertex exactly once (NP-complete) using backtracking with visited set and path extension.',
        hasVisualization: true,
        tags: ['Hamiltonian path', 'backtracking', 'NP-complete', 'graph'],
      },
    
      {
        id: 'as-far-from-land-as-possible',
        title: 'As Far from Land as Possible',
        leetcodeNumber: 1162,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an n x n grid where 0 is water and 1 is land, find a water cell such that its Manhattan distance to the nearest land cell is maximized. Uses multi-source BFS starting from all land cells simultaneously, expanding outward. The last water cell reached has the maximum distance.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'multi-source bfs', 'shortest path', 'matrix'],
      },
      {
        id: 'clone-graph-ii',
        title: 'Clone Graph (BFS)',
        leetcodeNumber: 133,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Uses BFS to traverse all nodes and build clones level by level, mapping original nodes to their clones using a hash map.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'hash map', 'clone', 'deep copy'],
      },
      {
        id: 'count-sub-islands',
        title: 'Count Sub Islands',
        leetcodeNumber: 1905,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two binary grids grid1 and grid2, count the number of islands in grid2 that are sub-islands of grid1. An island in grid2 is a sub-island if every land cell in that island also corresponds to a land cell in grid1. Use DFS to traverse each island in grid2 and verify.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'island', 'matrix', 'sub-island'],
      },
      {
        id: 'course-schedule-iii',
        title: 'Course Schedule III',
        leetcodeNumber: 630,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a list of courses where each course has a duration and a deadline, return the maximum number of courses you can take. Uses a greedy approach: sort by deadline, then use a max-heap to greedily replace the longest course taken so far when adding a new course would exceed the deadline.',
        hasVisualization: true,
        tags: ['greedy', 'heap', 'priority queue', 'sorting', 'graph'],
      },
      {
        id: 'detonate-maximum-bombs',
        title: 'Detonate the Maximum Bombs',
        leetcodeNumber: 2101,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a list of bombs where each bomb is [x, y, radius], find the maximum number of bombs that can be detonated by triggering one bomb. When bomb A is detonated, it detonates bomb B if B is within A\'s blast radius. Build a directed graph and use BFS/DFS from each bomb to count reachable bombs.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'dfs', 'geometry', 'chain reaction'],
      },
      {
        id: 'find-center-of-star-graph',
        title: 'Find Center of Star Graph',
        leetcodeNumber: 1791,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a star graph with n nodes and n-1 edges, find the center node. In a star graph, the center node is connected to every other node. The center node appears in every edge, so simply check which node appears in both the first and second edge.',
        hasVisualization: true,
        tags: ['graph', 'degree', 'star graph', 'center'],
      },
      {
        id: 'find-eventual-safe-states',
        title: 'Find Eventual Safe States',
        leetcodeNumber: 802,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a directed graph, find all nodes that are eventually safe. A node is safe if every path starting from that node leads to a terminal node (a node with no outgoing edges). Nodes that are part of or lead to cycles are not safe. Use DFS with cycle detection (3-color marking: white=unvisited, gray=in-progress, black=safe).',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'cycle detection', 'topological sort', 'coloring'],
      },
      {
        id: 'find-if-path-exists',
        title: 'Find if Path Exists in Graph',
        leetcodeNumber: 1971,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an undirected graph with n nodes and a list of edges, determine whether a path exists between the source and destination. Uses BFS starting from the source and checks if the destination is reachable.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'dfs', 'union find', 'path'],
      },
      {
        id: 'find-the-town-judge',
        title: 'Find the Town Judge',
        leetcodeNumber: 997,
        difficulty: 'Easy' as Difficulty,
        description:
          'In a town of n people, the town judge trusts nobody but is trusted by everyone else. Given a list of trust pairs [a, b] meaning a trusts b, find the judge. Track in-degree (trusted by) and out-degree (trusts others). The judge has in-degree n-1 and out-degree 0.',
        hasVisualization: true,
        tags: ['graph', 'degree', 'in-degree', 'out-degree', 'hash map'],
      },
      {
        id: 'flood-fill',
        title: 'Flood Fill',
        leetcodeNumber: 733,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an image represented as a 2D grid of integers and a starting pixel, perform a flood fill. Change the color of the starting pixel and all adjacent connected pixels of the same original color to the new color. Uses DFS or BFS to traverse connected pixels.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'bfs', 'matrix', 'flood fill'],
      },
      {
        id: 'is-graph-bipartite-ii',
        title: 'Is Graph Bipartite? (BFS)',
        leetcodeNumber: 785,
        difficulty: 'Medium' as Difficulty,
        description:
          'Determine if a graph is bipartite using BFS coloring. A graph is bipartite if we can split its nodes into two groups such that every edge connects a node from one group to a node from the other. BFS assigns alternating colors (0 and 1) and checks for conflicts.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'bipartite', 'coloring'],
      },
      {
        id: 'island-perimeter',
        title: 'Island Perimeter',
        leetcodeNumber: 463,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a grid where 1 represents land and 0 represents water, calculate the perimeter of the island. For each land cell, it contributes 4 sides to the perimeter minus 2 for each shared side with another land cell. Iterate each cell and count contributions.',
        hasVisualization: true,
        tags: ['graph', 'matrix', 'grid', 'counting'],
      },
      {
        id: 'making-a-large-island',
        title: 'Making A Large Island',
        leetcodeNumber: 827,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an n x n binary grid, you may change at most one 0 to 1. Find the size of the largest island after this change. First label each island with a unique ID and compute island sizes using DFS. Then for each 0 cell, try flipping it and sum up the sizes of all distinct neighboring islands.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'union find', 'island', 'matrix'],
      },
      {
        id: 'minimum-number-of-vertices',
        title: 'Minimum Number of Vertices to Reach All Nodes',
        leetcodeNumber: 1557,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a directed acyclic graph (DAG) with n nodes and a list of directed edges, find the smallest set of vertices from which all nodes are reachable. Any node with in-degree 0 (no incoming edges) must be in the set because no other node can reach it.',
        hasVisualization: true,
        tags: ['graph', 'dag', 'in-degree', 'directed graph'],
      },
      {
        id: 'nearest-exit-from-entrance',
        title: 'Nearest Exit from Entrance in Maze',
        leetcodeNumber: 1926,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a maze represented as a grid where "." is empty and "+" is a wall, find the nearest exit from the entrance cell. An exit is any empty cell on the border that is not the entrance. Uses multi-source BFS to find the shortest path in terms of steps.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'shortest path', 'maze', 'grid'],
      },
      {
        id: 'number-of-enclaves',
        title: 'Number of Enclaves',
        leetcodeNumber: 1020,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary grid where 1 is land and 0 is water, count the number of land cells that cannot walk off the boundary of the grid. Use BFS/DFS from all boundary land cells to mark them as reachable. Any remaining land cells are enclaves.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'dfs', 'matrix', 'flood fill', 'boundary'],
      },
      {
        id: 'number-of-provinces',
        title: 'Number of Provinces',
        leetcodeNumber: 547,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an adjacency matrix representing friendships between n cities, find the number of provinces (connected components). Each province is a group of directly or indirectly connected cities. Uses DFS from each unvisited city to explore its entire connected component.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'union find', 'connected components', 'adjacency matrix'],
      },
      {
        id: 'path-with-minimum-effort',
        title: 'Path With Minimum Effort',
        leetcodeNumber: 1631,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a rows x cols grid of heights, find a path from top-left to bottom-right that minimizes the maximum absolute difference between consecutive cells (effort). Uses Dijkstra algorithm with a min-heap: track the minimum effort to reach each cell.',
        hasVisualization: true,
        tags: ['graph', 'dijkstra', 'heap', 'binary search', 'bfs', 'shortest path'],
      },
      {
        id: 'reorder-routes-to-make-all-paths-lead-to-city-zero',
        title: 'Reorder Routes to Make All Paths Lead to City Zero',
        leetcodeNumber: 1466,
        difficulty: 'Medium' as Difficulty,
        description:
          'There are n cities connected by directed edges. Find the minimum number of edges that need to be reversed so that every city can reach city 0. Use BFS from city 0: when traversing an original directed edge away from 0, that edge needs to be reversed (count +1). Reverse edges are free.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'dfs', 'directed graph', 'tree'],
      },
      {
        id: 'rotting-oranges',
        title: 'Rotting Oranges',
        leetcodeNumber: 994,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a grid where 0 is empty, 1 is a fresh orange, and 2 is a rotten orange, find the minimum minutes until no fresh orange remains. Each minute, any fresh orange adjacent to a rotten orange becomes rotten. Uses multi-source BFS from all initially rotten oranges simultaneously.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'multi-source bfs', 'matrix', 'simulation'],
      },
      {
        id: 'satisfiability-of-equality-equations',
        title: 'Satisfiability of Equality Equations',
        leetcodeNumber: 990,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a list of equations in the form "a==b" or "a!=b" where variables are single lowercase letters, determine if all equations can be satisfied simultaneously. Use Union-Find: first union all equality pairs, then verify no inequality pair has both sides in the same component.',
        hasVisualization: true,
        tags: ['graph', 'union find', 'disjoint set', 'string parsing'],
      },
      {
        id: 'shortest-bridge',
        title: 'Shortest Bridge',
        leetcodeNumber: 934,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary grid containing exactly two islands, find the minimum number of 0s that must be flipped to connect the two islands. Use DFS to find and mark the first island, then use multi-source BFS from all cells of the first island to reach the second island.',
        hasVisualization: true,
        tags: ['graph', 'bfs', 'dfs', 'matrix', 'shortest path', 'two islands'],
      },
      {
        id: 'similar-string-groups',
        title: 'Similar String Groups',
        leetcodeNumber: 839,
        difficulty: 'Hard' as Difficulty,
        description:
          'Two strings are similar if they are anagrams of each other and differ in at most 2 positions (swapping two letters). Given an array of strings (all anagrams), group them into similar-string groups using Union-Find. Count the number of groups.',
        hasVisualization: true,
        tags: ['graph', 'union find', 'string', 'anagram', 'grouping'],
      },
      {
        id: 'swim-in-rising-water',
        title: 'Swim in Rising Water',
        leetcodeNumber: 778,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an n x n grid where grid[i][j] represents the elevation at cell (i,j), find the minimum time T such that you can travel from top-left (0,0) to bottom-right (n-1,n-1). At time T you can swim to any cell with elevation at most T. Uses a min-heap (Dijkstra-style) tracking the maximum elevation on the path.',
        hasVisualization: true,
        tags: ['graph', 'heap', 'dijkstra', 'binary search', 'bfs', 'matrix'],
      },
      {
        id: 'time-needed-to-inform-all-employees',
        title: 'Time Needed to Inform All Employees',
        leetcodeNumber: 1376,
        difficulty: 'Medium' as Difficulty,
        description:
          'A company has n employees arranged in a tree hierarchy. The head of the company wants to inform all employees of an urgent piece of news. Each manager needs informTime[i] minutes to inform their direct subordinates. Find the total time needed to inform all employees using DFS on the tree.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'tree', 'bfs', 'recursion'],
      },
    
      {
        id: 'a-star-pathfinding',
        title: 'A* Pathfinding with Manhattan Heuristic',
        difficulty: 'Medium' as Difficulty,
        description:
          'A* uses a heuristic to guide Dijkstra toward the target. f(n) = g(n) + h(n) where g(n) is the cost from source and h(n) is the Manhattan distance estimate to the target. The heuristic makes A* faster than Dijkstra for grid-based pathfinding by exploring fewer nodes.',
        hasVisualization: true,
        tags: ['graph', 'A*', 'heuristic', 'shortest path', 'Manhattan distance', 'grid'],
      },
      {
        id: 'all-paths-from-source-to-target-dfs',
        title: 'All Paths From Source to Target (DFS)',
        leetcodeNumber: 797,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a directed acyclic graph (DAG), find all paths from node 0 to node n-1. DFS explores each path recursively, backtracking to explore alternatives. Since the graph is acyclic, no visited set is needed. Each time we reach n-1, we record the current path.',
        hasVisualization: true,
        tags: ['dfs', 'graph', 'backtracking', 'dag', 'all paths'],
      },
      {
        id: 'bellman-ford-negative-cycle',
        title: 'Bellman-Ford: Negative Cycle Detection',
        difficulty: 'Medium' as Difficulty,
        description:
          'Bellman-Ford computes single-source shortest paths and detects negative weight cycles. Relax all edges V-1 times. If any edge can still be relaxed after V-1 iterations, a negative cycle exists. Unlike Dijkstra, handles negative edge weights. Time complexity O(VE).',
        hasVisualization: true,
        tags: ['graph', 'bellman-ford', 'negative cycle', 'shortest path', 'dynamic programming'],
      },
      {
        id: 'bidirectional-bfs',
        title: 'Bidirectional BFS',
        difficulty: 'Medium' as Difficulty,
        description:
          'Bidirectional BFS runs simultaneous BFS from both the source and target. It expands the smaller frontier at each step. When the frontiers meet, the shortest path is found. This reduces the search space significantly compared to standard BFS - from O(b^d) to O(b^(d/2)).',
        hasVisualization: true,
        tags: ['graph', 'BFS', 'bidirectional', 'shortest path', 'optimization'],
      },
      {
        id: 'bricks-falling-when-hit',
        title: 'Bricks Falling When Hit',
        leetcodeNumber: 803,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a grid of bricks and a sequence of hits, determine how many bricks fall after each hit. A brick falls if it is no longer connected to the top row (directly or indirectly). Use reverse-time union find: process hits in reverse, adding bricks back and computing how many join the roof. The difference in roof-connected size gives bricks that fall (minus the re-added brick).',
        hasVisualization: true,
        tags: ['union find', 'graph', 'reverse thinking', 'grid'],
      },
      {
        id: 'bus-routes',
        title: 'Bus Routes',
        leetcodeNumber: 815,
        difficulty: 'Hard' as Difficulty,
        description:
          'You are given an array of bus routes where routes[i] contains stops of the i-th bus. You start at stop source and want to reach stop target. Return the minimum number of buses needed, or -1 if impossible. BFS treats each bus route as a node and stops as edges connecting routes.',
        hasVisualization: true,
        tags: ['bfs', 'graph', 'bus routes', 'shortest path'],
      },
      {
        id: 'cheapest-flights-k-stops-dp',
        title: 'Cheapest Flights Within K Stops (DP/Bellman-Ford)',
        leetcodeNumber: 787,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find cheapest flight from src to dst with at most k stops using Bellman-Ford DP. dp[i][v] = minimum cost to reach v using exactly i edges. Run k+1 Bellman-Ford iterations, where each iteration allows one more stop. Key: use a copy of the previous iteration to avoid using more than i edges.',
        hasVisualization: true,
        tags: ['graph', 'Bellman-Ford', 'dynamic programming', 'k stops', 'flights'],
      },
      {
        id: 'count-connected-components',
        title: 'Count Connected Components in an Undirected Graph',
        leetcodeNumber: 323,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n nodes (0 to n-1) and a list of undirected edges, count the number of connected components. Use union find: start with n components, and for each edge that connects two different components, union them and decrement the count. The final count is the number of connected components.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'connected components', 'dfs alternative'],
      },
      {
        id: 'count-servers-that-communicate',
        title: 'Count Servers that Communicate',
        leetcodeNumber: 1267,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a grid where 1 represents a server, two servers can communicate if they are in the same row or column. Count the number of servers that can communicate with at least one other server. Count servers per row and column; a server communicates if its row or column has more than one server.',
        hasVisualization: true,
        tags: ['graph', 'array', 'counting', 'row column'],
      },
      {
        id: 'couples-holding-hands',
        title: 'Couples Holding Hands',
        leetcodeNumber: 765,
        difficulty: 'Hard' as Difficulty,
        description:
          'N couples sit in 2N seats. Couple k consists of persons 2k and 2k+1. Find the minimum number of swaps so every couple is sitting together. Use union find on couples (person i belongs to couple i/2). For each adjacent pair, if they belong to different couples, union those couples. The answer is the number of merged pairs (unions performed).',
        hasVisualization: true,
        tags: ['union find', 'graph', 'greedy', 'cycle counting'],
      },
      {
        id: 'course-schedule-dfs',
        title: 'Course Schedule (DFS Cycle Detection)',
        leetcodeNumber: 207,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given numCourses and prerequisites (pairs [a,b] meaning b must be taken before a), determine if you can finish all courses. Build a directed graph and use DFS to detect cycles. A cycle means it is impossible to finish all courses. States: 0=unvisited, 1=in-progress, 2=done.',
        hasVisualization: true,
        tags: ['dfs', 'graph', 'cycle detection', 'topological sort'],
      },
      {
        id: 'cut-off-trees-for-golf',
        title: 'Cut Off Trees for Golf Event',
        leetcodeNumber: 675,
        difficulty: 'Hard' as Difficulty,
        description:
          'In a grid, trees have height > 1 and must be cut in order from shortest to tallest. Starting at (0,0), find the minimum total steps to cut all trees in order. Use BFS to find shortest path between consecutive trees. Sort trees by height and sum all BFS distances.',
        hasVisualization: true,
        tags: ['graph', 'BFS', 'grid', 'sorting', 'simulation'],
      },
      {
        id: 'design-graph-with-shortest-path',
        title: 'Design Graph With Shortest Path Calculator',
        leetcodeNumber: 2642,
        difficulty: 'Hard' as Difficulty,
        description:
          'Design a graph class that supports adding directed weighted edges and querying shortest paths. Each query uses Dijkstra algorithm on the current state of the graph. The graph supports dynamic edge addition with addEdge and shortest path queries with shortestPath.',
        hasVisualization: true,
        tags: ['graph', 'dijkstra', 'design', 'heap', 'shortest path'],
      },
      {
        id: 'dijkstra-shortest-path',
        title: 'Dijkstra Shortest Path (Classic)',
        difficulty: 'Medium' as Difficulty,
        description:
          'Classic Dijkstra algorithm for finding single-source shortest paths in a weighted graph with non-negative edge weights. Uses a min-heap (priority queue) to always process the closest unvisited node. Time complexity O((V+E) log V).',
        hasVisualization: true,
        tags: ['graph', 'dijkstra', 'shortest path', 'greedy', 'priority queue', 'classic'],
      },
      {
        id: 'earliest-moment-when-everyone-becomes-friends',
        title: 'Earliest Moment When Everyone Becomes Friends',
        leetcodeNumber: 1101,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a list of timestamped friendship logs [timestamp, personA, personB], find the earliest time at which every person knows every other person (directly or transitively). Sort logs by timestamp and use union find to merge friend groups. When only one component remains, return the current timestamp.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'sorting', 'connected components'],
      },
      {
        id: 'escape-the-spreading-fire',
        title: 'Escape the Spreading Fire',
        leetcodeNumber: 2258,
        difficulty: 'Hard' as Difficulty,
        description:
          'You are at top-left of a grid and fire starts at certain cells. Each minute, you move to adjacent cell, then fire spreads. Find the maximum time you can wait at start before moving to reach bottom-right safely. Binary search on wait time + BFS to check feasibility.',
        hasVisualization: true,
        tags: ['bfs', 'graph', 'binary search', 'multi-source bfs', 'grid'],
      },
      {
        id: 'evaluate-division-graph',
        title: 'Evaluate Division (Graph)',
        leetcodeNumber: 399,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given equations like A/B = k, evaluate division queries. Build a weighted directed graph where edge A->B has weight k and B->A has weight 1/k. For each query, DFS from the source to the target, multiplying edge weights along the path. Return -1 if no path exists.',
        hasVisualization: true,
        tags: ['dfs', 'graph', 'weighted graph', 'bfs'],
      },
      {
        id: 'find-all-groups-of-farmland',
        title: 'Find All Groups of Farmland',
        leetcodeNumber: 1992,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary matrix where 1 is farmland and 0 is forest, find all rectangular groups of farmland. Each group is guaranteed to be a rectangle. For each top-left corner (1 cell not preceded by farmland), expand right and down to find the bottom-right corner.',
        hasVisualization: true,
        tags: ['graph', 'dfs', 'grid', 'matrix', 'rectangle'],
      },
      {
        id: 'find-all-people-with-secret',
        title: 'Find All People With Secret',
        leetcodeNumber: 2092,
        difficulty: 'Hard' as Difficulty,
        description:
          'Person 0 has a secret at time 0. Meetings happen at various times where people share what they know. Find all people who eventually know the secret. Sort meetings by time. For each time group, union all meeting participants. Anyone connected to a person who knows the secret joins the secret-knowing group. Reset isolated people after each time group.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'sorting', 'bfs'],
      },
      {
        id: 'find-the-city-with-smallest-neighbors',
        title: 'Find the City With the Smallest Number of Neighbors at a Threshold Distance',
        leetcodeNumber: 1334,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n cities connected by weighted edges, find the city with the fewest reachable neighbors within a distance threshold. Uses Floyd-Warshall to compute all-pairs shortest paths, then counts reachable cities for each node. Return the city with the smallest count (highest index on tie).',
        hasVisualization: true,
        tags: ['graph', 'floyd-warshall', 'all-pairs shortest path', 'dynamic programming'],
      },
      {
        id: 'floyd-warshall-all-pairs',
        title: 'Floyd-Warshall: All Pairs Shortest Path',
        difficulty: 'Medium' as Difficulty,
        description:
          'Floyd-Warshall algorithm computes shortest paths between all pairs of nodes. For each intermediate node k, it checks if routing through k improves any path. Works with negative weights but not negative cycles. Time complexity O(V^3), space O(V^2).',
        hasVisualization: true,
        tags: ['graph', 'floyd-warshall', 'all-pairs shortest path', 'dynamic programming', 'classic'],
      },
      {
        id: 'friend-circles',
        title: 'Friend Circles (Number of Provinces)',
        leetcodeNumber: 547,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an n x n adjacency matrix isConnected where isConnected[i][j]=1 means person i and j are friends, count the total number of friend circles (connected components). Use union find to merge all directly connected people. The number of remaining components is the answer.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'connected components', 'adjacency matrix'],
      },
      {
        id: 'gcd-sort-of-an-array',
        title: 'GCD Sort of an Array',
        leetcodeNumber: 1998,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array, you can swap two elements if their GCD is greater than 1. Determine if the array can be sorted. Use union find: for each number, factor it and union all numbers sharing a prime factor. Then check if each element can reach its target sorted position within the same component.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'math', 'sorting', 'prime factors'],
      },
      {
        id: 'graph-connectivity-with-threshold',
        title: 'Graph Connectivity With Threshold',
        leetcodeNumber: 1627,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n cities (1 to n) and a threshold, two cities u and v are directly connected if they share a common factor greater than threshold. For each query [u, v], determine if they are in the same connected component. Use union find with factor enumeration: for each factor f from threshold+1 to n, union all multiples of f together.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'math', 'factor enumeration'],
      },
      {
        id: 'jump-game-iii',
        title: 'Jump Game III',
        leetcodeNumber: 1306,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of non-negative integers and a start index, you can jump from index i to i+arr[i] or i-arr[i]. Return true if you can reach any index with value 0. Use BFS or DFS to explore reachable indices, tracking visited to avoid cycles.',
        hasVisualization: true,
        tags: ['bfs', 'dfs', 'graph', 'array', 'jump game'],
      },
      {
        id: 'jump-game-iv',
        title: 'Jump Game IV',
        leetcodeNumber: 1345,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an integer array, you start at index 0 and can jump to i+1, i-1, or any index j where arr[i] == arr[j]. Find the minimum number of steps to reach the last index. BFS with a value-to-indices map enables teleportation jumps between same-value indices.',
        hasVisualization: true,
        tags: ['bfs', 'graph', 'jump game', 'hash map'],
      },
      {
        id: 'keys-and-rooms-dfs',
        title: 'Keys and Rooms (DFS)',
        leetcodeNumber: 841,
        difficulty: 'Medium' as Difficulty,
        description:
          'There are n rooms (0 to n-1). Room 0 is unlocked. Each room contains keys to other rooms. Can you visit all rooms? Model as a directed graph where room i has edges to rooms whose keys it contains. DFS from room 0 and check if all rooms are visited.',
        hasVisualization: true,
        tags: ['dfs', 'graph', 'room traversal'],
      },
      {
        id: 'largest-component-size-by-common-factor',
        title: 'Largest Component Size by Common Factor',
        leetcodeNumber: 952,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array of unique positive integers, two values are connected if they share a common factor greater than 1. Find the size of the largest connected component. Use union find: for each number, factor it and union the number with each of its prime factors. Then count the largest group.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'math', 'prime factors'],
      },
      {
        id: 'lexicographically-smallest-equivalent-string',
        title: 'Lexicographically Smallest Equivalent String',
        leetcodeNumber: 1061,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two strings s1 and s2 of equal length, characters at the same index are equivalent. Find the lexicographically smallest string equivalent to baseStr. Use union find on the 26 characters, always making the smaller character the root. For each character in baseStr, replace it with the root of its component.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'string', 'equivalence'],
      },
      {
        id: 'longest-consecutive-sequence-uf',
        title: 'Longest Consecutive Sequence (Union Find)',
        leetcodeNumber: 128,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the length of the longest consecutive sequence using Union Find. Store all numbers in a set. For each number, if num+1 exists, union them together. Track component sizes. The maximum component size is the answer. This achieves O(n * alpha(n)) time.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'hash set', 'consecutive'],
      },
      {
        id: 'loud-and-rich',
        title: 'Loud and Rich',
        leetcodeNumber: 851,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given richer[i] = [a, b] meaning a is richer than b, and quiet[i] = how quiet person i is, find for each person the least quiet person among all people at least as rich. Build a graph where richer means incoming edge, then DFS/topological order to propagate the quietest richer person.',
        hasVisualization: true,
        tags: ['dfs', 'graph', 'topological sort', 'memoization'],
      },
      {
        id: 'map-of-highest-peak',
        title: 'Map of Highest Peak',
        leetcodeNumber: 1765,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a matrix where 1 represents water cells (height must be 0) and 0 represents land, assign heights to maximize the highest peak. No two adjacent cells can differ by more than 1. Use multi-source BFS starting from all water cells simultaneously, expanding outward.',
        hasVisualization: true,
        tags: ['bfs', 'graph', 'grid', 'multi-source bfs', 'matrix'],
      },
      {
        id: 'maximum-number-of-fish',
        title: 'Maximum Number of Fish in a Grid',
        leetcodeNumber: 2658,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a grid where grid[r][c] is the number of fish in a water cell (>0) or a land cell (0), find the maximum number of fish you can catch in a connected water region. Use union find to group connected water cells, tracking total fish per component. The answer is the maximum fish in any component.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'grid', 'dfs'],
      },
      {
        id: 'minimize-hamming-distance-after-swap',
        title: 'Minimize Hamming Distance After Swap',
        leetcodeNumber: 1722,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two arrays source and target and a list of allowed swap pairs for source, find the minimum Hamming distance after optimally performing swaps. Indices connected by swaps form groups via union find. Within each group, greedily match available source values to target values to minimize mismatches.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'greedy', 'counting'],
      },
      {
        id: 'minimize-malware-spread',
        title: 'Minimize Malware Spread',
        leetcodeNumber: 924,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a network of nodes connected by edges, some initially infected with malware. Malware spreads to all connected nodes. Remove exactly one initial infected node to minimize final infected count. Use Union-Find or DFS to find connected components, then remove the infected node whose component is only infected by that one node.',
        hasVisualization: true,
        tags: ['graph', 'union find', 'dfs', 'connected components'],
      },
      {
        id: 'minimum-cost-to-make-valid-path-ii',
        title: 'Minimum Cost to Make at Least One Valid Path in a Grid II',
        leetcodeNumber: 1368,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a grid where each cell has a direction (right, left, down, up), find minimum cost to reach the bottom-right. Moving in the existing direction costs 0; changing direction costs 1. Uses 0-1 BFS (deque): edges with cost 0 go to front, edges with cost 1 go to back.',
        hasVisualization: true,
        tags: ['graph', '0-1 BFS', 'deque', 'grid', 'shortest path'],
      },
      {
        id: 'minimum-cost-to-reach-city-with-discounts',
        title: 'Minimum Cost to Reach City With Discounts',
        leetcodeNumber: 2093,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find minimum cost to travel from city 0 to city n-1 using at most k discounts. Each discount halves an edge cost. Uses Dijkstra with state (node, discountsUsed) as the state space. dist[node][d] = minimum cost to reach node using d discounts.',
        hasVisualization: true,
        tags: ['graph', 'dijkstra', 'state space', 'shortest path', 'discounts'],
      },
      {
        id: 'minimum-genetic-mutation',
        title: 'Minimum Genetic Mutation',
        leetcodeNumber: 433,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find minimum mutations to transform startGene into endGene using only valid gene strings from the bank. Each mutation changes exactly one character and the result must be in the bank. Uses BFS where each valid gene string is a node. Count BFS levels until endGene is reached.',
        hasVisualization: true,
        tags: ['graph', 'BFS', 'string transformation', 'gene mutation', 'shortest path'],
      },
      {
        id: 'minimum-jumps-to-reach-home',
        title: 'Minimum Jumps to Reach Home',
        leetcodeNumber: 1654,
        difficulty: 'Medium' as Difficulty,
        description:
          'A bug starts at position 0 and wants to reach position x. It can jump forward by a or backward by b, but cannot jump backward twice in a row or land on forbidden positions. Find the minimum jumps to reach x using BFS. State is (position, lastJumpWasBackward).',
        hasVisualization: true,
        tags: ['bfs', 'graph', 'state machine', 'shortest path'],
      },
      {
        id: 'minimum-knight-moves',
        title: 'Minimum Knight Moves',
        leetcodeNumber: 1197,
        difficulty: 'Medium' as Difficulty,
        description:
          'In an infinite chessboard, a knight starts at (0,0) and wants to reach (x,y). Find the minimum number of moves. BFS explores all reachable squares level by level, where each level represents one knight move. The trick is to mirror the problem to positive quadrant using symmetry.',
        hasVisualization: true,
        tags: ['bfs', 'graph', 'chess', 'shortest path'],
      },
      {
        id: 'minimum-moves-to-reach-target',
        title: 'Minimum Moves to Reach Target Score',
        leetcodeNumber: 780,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given target, find minimum operations to reach it from 1 using: double (x*2) or increment (x+1). Work backwards from target: if target is even, divide by 2 (was a double); if odd or maxDoubles exhausted, decrement. This greedy reverse approach avoids BFS state explosion.',
        hasVisualization: true,
        tags: ['graph', 'BFS', 'greedy', 'math', 'reverse thinking'],
      },
      {
        id: 'minimum-obstacle-removal',
        title: 'Minimum Obstacle Removal to Reach Corner',
        leetcodeNumber: 2290,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a 0-indexed m x n binary matrix where 0 is empty and 1 is an obstacle, find the minimum number of obstacles to remove to move from top-left to bottom-right. Use 0-1 BFS with a deque: empty cells have edge weight 0 (push front), obstacles have weight 1 (push back).',
        hasVisualization: true,
        tags: ['0-1 bfs', 'graph', 'grid', 'deque', 'shortest path'],
      },
      {
        id: 'minimum-time-to-visit-disappearing-nodes',
        title: 'Minimum Time to Visit Disappearing Nodes',
        leetcodeNumber: 3112,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the minimum time to reach each node from node 0, given that each node i disappears at time disappear[i]. You can only visit node i if you arrive strictly before disappear[i]. Uses Dijkstra but skips nodes that have disappeared.',
        hasVisualization: true,
        tags: ['graph', 'dijkstra', 'heap', 'time constraint', 'shortest path'],
      },
      {
        id: 'minimum-weighted-subgraph-with-required-paths',
        title: 'Minimum Weighted Subgraph With the Required Paths',
        leetcodeNumber: 2203,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a directed weighted graph, find the minimum weight subgraph containing paths from src1 to dest and from src2 to dest. Run Dijkstra from src1, src2 (forward), and dest (reversed graph). The answer is the minimum over all nodes v of dist1[v] + dist2[v] + distDest[v].',
        hasVisualization: true,
        tags: ['graph', 'dijkstra', 'shortest path', 'directed graph', 'hard'],
      },
      {
        id: 'most-stones-removed',
        title: 'Most Stones Removed with Same Row or Column',
        leetcodeNumber: 947,
        difficulty: 'Medium' as Difficulty,
        description:
          'Stones can be removed if they share a row or column with another stone. Find the maximum stones that can be removed. Use Union-Find: stones sharing a row or column are in the same connected component. Answer is total stones minus number of components (one stone must remain per component).',
        hasVisualization: true,
        tags: ['graph', 'union find', 'dfs', 'connected components'],
      },
      {
        id: 'multi-source-bfs',
        title: 'Multi-Source BFS',
        difficulty: 'Medium' as Difficulty,
        description:
          'Multi-source BFS starts simultaneously from multiple source nodes. All sources are enqueued at level 0, then BFS expands outward. This efficiently computes the minimum distance from any source to every node. Used in problems like walls and gates, rotting oranges, and distance to nearest land.',
        hasVisualization: true,
        tags: ['graph', 'BFS', 'multi-source', 'shortest distance', 'grid'],
      },
      {
        id: 'network-delay-time-dijkstra',
        title: 'Network Delay Time (Dijkstra Approach)',
        leetcodeNumber: 743,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the time for a signal sent from source k to reach all nodes. Uses Dijkstra algorithm to compute shortest paths from k. The answer is the maximum shortest path among all nodes. If any node is unreachable, return -1.',
        hasVisualization: true,
        tags: ['graph', 'dijkstra', 'shortest path', 'network', 'signal propagation'],
      },
      {
        id: 'number-of-closed-islands-bfs',
        title: 'Number of Closed Islands (BFS)',
        leetcodeNumber: 1254,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary grid where 0 is land and 1 is water, count the number of closed islands. A closed island is a group of 0 cells completely surrounded by 1 cells (not touching the border). BFS from each unvisited 0 cell, track if it reaches the border; if not, it is a closed island.',
        hasVisualization: true,
        tags: ['bfs', 'graph', 'grid', 'island counting'],
      },
      {
        id: 'number-of-distinct-islands',
        title: 'Number of Distinct Islands',
        leetcodeNumber: 694,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary grid where 1 is land, count the number of distinct islands. Two islands are the same if one can be translated (not rotated/reflected) to match the other. DFS traces each island shape as a path string, and a set of shape strings gives the count of distinct islands.',
        hasVisualization: true,
        tags: ['dfs', 'graph', 'grid', 'hashing', 'island'],
      },
      {
        id: 'number-of-good-paths',
        title: 'Number of Good Paths',
        leetcodeNumber: 2421,
        difficulty: 'Hard' as Difficulty,
        description:
          'A good path in a tree starts and ends at nodes with equal values and all intermediate nodes have values at most equal to the start/end value. Count all good paths. Sort nodes by value, then process them in increasing order. When adding a node, union it with adjacent nodes of equal or lesser value. Count pairs within each component that share the same maximum value.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'tree', 'sorting'],
      },
      {
        id: 'number-of-islands-union-find',
        title: 'Number of Islands (Union Find)',
        leetcodeNumber: 200,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of islands in a grid using Union Find. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. Initialize each land cell as its own component. Then union adjacent land cells. The number of components at the end equals the number of islands.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'grid', 'connected components'],
      },
      {
        id: 'number-of-operations-to-make-network-connected',
        title: 'Number of Operations to Make Network Connected',
        leetcodeNumber: 1319,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n computers and connections, find the minimum number of cable moves needed to connect all computers. If there are not enough cables (connections < n-1), return -1. Use union find to count components and extra edges. Extra edges can be used to bridge disconnected components.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'connected components'],
      },
      {
        id: 'number-of-restricted-paths',
        title: 'Number of Restricted Paths From First to Last Node',
        leetcodeNumber: 1786,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count restricted paths from node 1 to node n. A restricted path has strictly decreasing dist[node] to node n along the path. Run Dijkstra from node n to get distances, then use DP/DFS to count paths where dist[next] < dist[current]. Return count modulo 1e9+7.',
        hasVisualization: true,
        tags: ['graph', 'dijkstra', 'dynamic programming', 'counting paths', 'shortest path'],
      },
      {
        id: 'parallel-courses-ii',
        title: 'Parallel Courses II',
        leetcodeNumber: 1494,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the minimum number of semesters to complete all courses where you can take at most k courses per semester and prerequisites must be satisfied. Uses bitmask DP: dp[mask] = minimum semesters to complete the set of courses represented by mask. For each mask, find all available courses (prerequisites met) and try all subsets of size at most k.',
        hasVisualization: true,
        tags: ['graph', 'bitmask DP', 'topological sort', 'dynamic programming', 'hard'],
      },
      {
        id: 'path-compression-visualization',
        title: 'Path Compression Visualization',
        difficulty: 'Easy' as Difficulty,
        description:
          'Path compression is an optimization for union-find (disjoint set union). When calling find(x), instead of traversing a long chain each time, we flatten the tree by making all nodes on the path point directly to the root. This brings the amortized complexity close to O(1) per operation.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'path compression', 'optimization'],
      },
      {
        id: 'path-with-maximum-probability',
        title: 'Path with Maximum Probability',
        leetcodeNumber: 1514,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the path between start and end nodes with maximum probability. Uses a modified Dijkstra algorithm with a max-heap, where instead of minimizing distance we maximize the product of edge probabilities. The probability of a path is the product of all edge probabilities along it.',
        hasVisualization: true,
        tags: ['graph', 'dijkstra', 'heap', 'shortest path', 'probability'],
      },
      {
        id: 'rank-transform-of-matrix',
        title: 'Rank Transform of a Matrix',
        leetcodeNumber: 1632,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an m x n matrix, replace each element with its rank. Rank is determined by: equal elements in same row or column get same rank, rank starts at 1, and must be as small as possible while maintaining relative order. Use union find to group elements with equal values in same row/column, then assign ranks layer by layer from smallest value.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'sorting', 'matrix'],
      },
      {
        id: 'reachable-nodes-in-subdivided-graph',
        title: 'Reachable Nodes In Subdivided Graph',
        leetcodeNumber: 882,
        difficulty: 'Hard' as Difficulty,
        description:
          'Each edge (u, v, cnt) is subdivided by inserting cnt new nodes. Starting at node 0 with M moves, count how many original and inserted nodes are reachable. Uses Dijkstra to find the maximum moves remaining at each original node, then counts reachable inserted nodes per edge.',
        hasVisualization: true,
        tags: ['graph', 'dijkstra', 'heap', 'subdivided graph', 'modified shortest path'],
      },
      {
        id: 'redundant-connection-ii',
        title: 'Redundant Connection II',
        leetcodeNumber: 685,
        difficulty: 'Hard' as Difficulty,
        description:
          'In a directed graph with n nodes, one extra edge was added making some node have two parents or creating a cycle. Find the edge that can be removed to make the graph a valid rooted tree. Handle three cases: node with two parents and no cycle, cycle with no double-parent node, and both a double-parent node and a cycle.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'directed graph', 'tree'],
      },
      {
        id: 'regions-cut-by-slashes',
        title: 'Regions Cut by Slashes',
        leetcodeNumber: 959,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an n x n grid where each cell is ',
        hasVisualization: true,
        tags: ['union find', 'graph', 'grid', 'connected components'],
      },
      {
        id: 'remove-max-number-of-edges',
        title: 'Remove Max Number of Edges to Keep Graph Fully Traversable',
        leetcodeNumber: 1579,
        difficulty: 'Hard' as Difficulty,
        description:
          'Alice and Bob share a graph. Type 1 edges are for Alice only, type 2 for Bob only, type 3 for both. Find the maximum number of removable edges while keeping the graph fully traversable for both. Use two separate union-finds (Alice and Bob). Process type 3 edges first (shared), then type 1 and 2. Remove any edge that does not reduce components.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'greedy'],
      },
      {
        id: 'shortest-cycle-in-graph',
        title: 'Shortest Cycle in a Graph',
        leetcodeNumber: 2608,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the length of the shortest cycle in an undirected graph. For each node, run BFS to find the shortest cycle passing through it. When BFS finds an already-visited node at the same or adjacent level, a cycle is detected. The answer is the minimum cycle length found.',
        hasVisualization: true,
        tags: ['graph', 'BFS', 'cycle detection', 'undirected graph', 'shortest cycle'],
      },
      {
        id: 'shortest-distance-from-all-buildings',
        title: 'Shortest Distance from All Buildings',
        leetcodeNumber: 317,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find an empty land cell with minimum total distance to all buildings. BFS from each building, accumulating distances to empty cells. Track how many buildings can reach each cell. Only cells reachable from all buildings are valid candidates. Return minimum total distance.',
        hasVisualization: true,
        tags: ['graph', 'BFS', 'multi-source', 'grid', 'building distance'],
      },
      {
        id: 'shortest-path-in-grid-with-obstacles',
        title: 'Shortest Path in Grid with Obstacles Elimination',
        leetcodeNumber: 1293,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an m x n grid where 0 is empty and 1 is an obstacle, you can eliminate at most k obstacles. Find the shortest path from top-left to bottom-right, or -1 if impossible. BFS state is (row, col, remainingEliminations). Use the remaining k as part of visited state.',
        hasVisualization: true,
        tags: ['bfs', 'graph', 'grid', 'obstacle elimination', 'shortest path'],
      },
      {
        id: 'shortest-path-visiting-all-nodes',
        title: 'Shortest Path Visiting All Nodes',
        leetcodeNumber: 847,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an undirected graph, find the shortest path that visits every node. You may start from any node and revisit nodes and edges. BFS with bitmask state (node, visitedBitmask) tracks which nodes have been visited. The answer is found when bitmask equals all 1s.',
        hasVisualization: true,
        tags: ['bfs', 'graph', 'bitmask', 'shortest path', 'state compression'],
      },
      {
        id: 'shortest-path-with-alternating-colors-ii',
        title: 'Shortest Path with Alternating Colors II',
        leetcodeNumber: 1129,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find shortest paths from node 0 to all nodes using alternating red and blue edges. BFS state tracks (node, lastColor). Start with both colors possible from node 0. On each step, only traverse an edge of the opposite color from the last used.',
        hasVisualization: true,
        tags: ['graph', 'BFS', 'colored edges', 'alternating', 'state BFS'],
      },
      {
        id: 'smallest-string-with-swaps',
        title: 'Smallest String with Swaps',
        leetcodeNumber: 1202,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string and a list of index pairs that can be swapped any number of times, return the lexicographically smallest string after all possible swaps. Union find groups connected indices together, then sort characters within each group and place them back in sorted order at the group positions.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'string', 'sorting'],
      },
      {
        id: 'surrounded-regions-bfs',
        title: 'Surrounded Regions (BFS)',
        leetcodeNumber: 130,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an m x n board of X and O cells, capture all regions surrounded by X. A region is captured by flipping all O cells that are not connected to the border. BFS from all border O cells to mark safe cells, then flip remaining O cells to X.',
        hasVisualization: true,
        tags: ['bfs', 'graph', 'grid', 'connected components'],
      },
      {
        id: 'surrounded-regions-union-find',
        title: 'Surrounded Regions (Union Find)',
        leetcodeNumber: 130,
        difficulty: 'Medium' as Difficulty,
        description:
          'Capture all regions of ',
        hasVisualization: true,
        tags: ['union find', 'graph', 'grid', 'dfs alternative'],
      },
      {
        id: 'swim-in-rising-water-uf',
        title: 'Swim in Rising Water (Union Find)',
        leetcodeNumber: 778,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an n x n grid where grid[r][c] is the elevation at that cell, find the minimum time T such that there exists a path from (0,0) to (n-1,n-1) where all cells have elevation at most T. Use union find: sort all cells by elevation, then add them one by one. After adding each cell, union with adjacent already-added cells. Stop when (0,0) and (n-1,n-1) are connected.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'binary search', 'sorting'],
      },
      {
        id: 'the-maze-ii',
        title: 'The Maze II',
        leetcodeNumber: 505,
        difficulty: 'Medium' as Difficulty,
        description:
          'A ball rolls in a maze until hitting a wall. Find the shortest distance (in steps) from start to destination, or -1 if impossible. Use Dijkstra or BFS with distance tracking: from each stop point, roll in all directions and record the steps taken until hitting a wall.',
        hasVisualization: true,
        tags: ['bfs', 'dijkstra', 'graph', 'maze', 'shortest path'],
      },
      {
        id: 'the-maze',
        title: 'The Maze',
        leetcodeNumber: 490,
        difficulty: 'Medium' as Difficulty,
        description:
          'A ball rolls in a maze (0=empty, 1=wall) and does not stop until it hits a wall. Given start and destination, determine if the ball can stop at destination. BFS/DFS explores all positions where the ball can stop by rolling in each direction until hitting a wall.',
        hasVisualization: true,
        tags: ['bfs', 'dfs', 'graph', 'maze', 'simulation'],
      },
      {
        id: 'union-by-rank-visualization',
        title: 'Union by Rank Visualization',
        difficulty: 'Easy' as Difficulty,
        description:
          'Union by rank is an optimization for union-find. When merging two components, always attach the shorter tree under the taller tree (by rank). This keeps trees balanced and ensures find operations run in O(log n) worst case. Combined with path compression, it achieves near-constant amortized time.',
        hasVisualization: true,
        tags: ['union find', 'graph', 'union by rank', 'optimization'],
      },
      {
        id: 'word-ladder-bfs',
        title: 'Word Ladder (BFS)',
        leetcodeNumber: 127,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a beginWord, endWord, and wordList, find the length of the shortest transformation sequence from beginWord to endWord, changing one letter at a time where each intermediate word must be in the wordList. BFS explores all one-letter transformations level by level.',
        hasVisualization: true,
        tags: ['bfs', 'graph', 'string', 'word ladder', 'shortest path'],
      },
      {
        id: 'word-ladder-bidirectional',
        title: 'Word Ladder (Bidirectional BFS)',
        leetcodeNumber: 127,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find shortest transformation sequence from beginWord to endWord. Uses bidirectional BFS: expand simultaneously from both begin and end. At each step, expand the smaller frontier. When the two frontiers meet, compute the path length. This is significantly faster than standard BFS.',
        hasVisualization: true,
        tags: ['graph', 'BFS', 'bidirectional BFS', 'word transformation', 'string'],
      },
    
      {
        id: 'alien-dictionary-iii',
        title: 'Alien Dictionary',
        leetcodeNumber: 269,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a sorted list of words from an alien language, derive the order of characters in that language. Build a graph of character ordering constraints from adjacent words, then perform topological sort (Kahn\\',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS', 'String'],
      },
      {
        id: 'build-a-matrix-with-conditions',
        title: 'Build a Matrix with Conditions',
        leetcodeNumber: 2392,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given k and row/column conditions specifying relative ordering of integers 1..k, build a k×k matrix where each integer appears exactly once, satisfying all ordering constraints. Use topological sort to determine the row order and column order of each integer, then place them in the matrix.',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS', 'Matrix'],
      },
      {
        id: 'collect-coins-in-tree',
        title: 'Collect Coins in a Tree',
        leetcodeNumber: 2603,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a tree where each node has some coins, collect all coins using the minimum number of edges traversed. From any node you can collect coins within 2 hops. Strategy: (1) Trim all leaf nodes with 0 coins repeatedly (topological sort), (2) trim 2 more rounds, (3) answer is 2 * remaining edges.',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS', 'Tree'],
      },
      {
        id: 'coloring-a-border',
        title: 'Coloring A Border',
        leetcodeNumber: 1034,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a 2D grid, a starting cell (row, col) with original color, and a new color, find the connected component containing the start, then color only its border cells with the new color. Border cells are those on the grid edge or adjacent to a different-color cell.',
        hasVisualization: true,
        tags: ['Graph', 'DFS', 'BFS', 'Matrix'],
      },
      {
        id: 'connecting-cities-with-minimum-cost',
        title: 'Connecting Cities With Minimum Cost',
        leetcodeNumber: 1135,
        difficulty: 'Medium' as Difficulty,
        description:
          'There are N cities numbered 1 to N. Given connections where connections[i] = [city1, city2, cost], find the minimum cost to connect all cities. If impossible, return -1. Classic MST problem solved with Kruskal\\',
        hasVisualization: true,
        tags: ['Graph', 'MST', 'Union-Find', 'Kruskal'],
      },
      {
        id: 'count-visited-nodes-in-directed-graph',
        title: 'Count Visited Nodes in a Directed Graph',
        leetcodeNumber: 2876,
        difficulty: 'Hard' as Difficulty,
        description:
          'In a directed graph where each node has exactly one outgoing edge (edges[i] = j), starting from each node, count how many distinct nodes are visited before revisiting a node (entering a cycle). Use topological sort to process non-cycle nodes and cycle detection to handle cycle nodes.',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS', 'Cycle Detection'],
      },
      {
        id: 'count-ways-to-build-rooms',
        title: 'Count Ways to Build Rooms in an Ant Colony',
        leetcodeNumber: 1916,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a tree rooted at node 0 (prevRoom[i] is the parent of room i), count the number of valid topological orderings to build all rooms (each room must be built after its prevRoom). Use topological sort with combinatorics: multiply factorial of subtree sizes and divide by product of child subtree factorials.',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'Combinatorics', 'Tree'],
      },
      {
        id: 'critical-connections-in-network-ii',
        title: 'Critical Connections in a Network II',
        leetcodeNumber: 1192,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find all critical connections (bridges) in a network. A bridge is an edge whose removal increases the number of connected components. Uses Tarjan\\',
        hasVisualization: true,
        tags: ['Graph', 'DFS', 'Tarjan', 'Bridge Finding'],
      },
      {
        id: 'find-all-possible-recipes',
        title: 'Find All Possible Recipes from Given Supplies',
        leetcodeNumber: 2115,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given recipes with ingredient lists, and an initial set of supplies, determine which recipes can be made. Recipes can use other recipes as ingredients. Model as a DAG and use topological sort: ingredients with no dependencies (available supplies) start the process, and recipes become available as their ingredients are gathered.',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS', 'Hash Map'],
      },
      {
        id: 'find-critical-and-pseudo-critical-edges',
        title: 'Find Critical and Pseudo-Critical Edges in MST',
        leetcodeNumber: 1489,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find all critical edges (removing increases MST weight) and pseudo-critical edges (can appear in some MST but not all) in the MST of an undirected graph. Uses brute-force: for each edge, check MST without it and with it forced.',
        hasVisualization: true,
        tags: ['Graph', 'MST', 'Kruskal', 'Union-Find'],
      },
      {
        id: 'find-eventual-safe-states-ii',
        title: 'Find Eventual Safe States',
        leetcodeNumber: 802,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a directed graph, a node is ',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS', 'DFS'],
      },
      {
        id: 'flower-planting-with-no-adjacent',
        title: 'Flower Planting With No Adjacent',
        leetcodeNumber: 1042,
        difficulty: 'Medium' as Difficulty,
        description:
          'You have n gardens and paths between them. Plant one of 4 flower types in each garden so that no two adjacent gardens have the same flower type. Since each garden has at most 3 neighbors and we have 4 types, a greedy approach always works.',
        hasVisualization: true,
        tags: ['Graph', 'Greedy', 'Graph Coloring'],
      },
      {
        id: 'graph-valid-tree-ii',
        title: 'Graph Valid Tree II',
        leetcodeNumber: 261,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n nodes and a list of undirected edges, check if they form a valid tree. A valid tree must have exactly n-1 edges and be fully connected (no cycles, no disconnected components). Uses Union-Find.',
        hasVisualization: true,
        tags: ['Graph', 'Union-Find', 'DFS', 'Tree'],
      },
      {
        id: 'keys-and-rooms-ii',
        title: 'Keys and Rooms II',
        leetcodeNumber: 841,
        difficulty: 'Medium' as Difficulty,
        description:
          'There are n rooms numbered 0 to n-1. You start in room 0. Each room has a list of keys to other rooms. You can visit a room only if you have its key. Determine if you can visit all rooms. Classic DFS/BFS reachability from node 0.',
        hasVisualization: true,
        tags: ['Graph', 'DFS', 'BFS', 'Reachability'],
      },
      {
        id: 'largest-color-value-directed-graph',
        title: 'Largest Color Value in a Directed Graph',
        leetcodeNumber: 1857,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a directed graph where each node has a color (a-z), find the largest number of nodes with the same color on any valid path. Use topological sort with DP: for each node, maintain a count array of colors seen on paths ending at that node. Propagate maximums through the DAG.',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS', 'Dynamic Programming'],
      },
      {
        id: 'longest-increasing-path-matrix-ii',
        title: 'Longest Increasing Path in a Matrix',
        leetcodeNumber: 329,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the length of the longest increasing path in an m x n matrix, moving only up/down/left/right. Use DFS with memoization: for each cell, compute the longest path starting from it, caching results to avoid recomputation.',
        hasVisualization: true,
        tags: ['Matrix', 'DFS', 'Memoization', 'Dynamic Programming'],
      },
      {
        id: 'longest-path-in-dag',
        title: 'Longest Path in DAG',
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the longest path in a Directed Acyclic Graph (DAG). Use topological sort (Kahn\\',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'DAG', 'Dynamic Programming'],
      },
      {
        id: 'maximum-employees-to-be-invited',
        title: 'Maximum Employees to Be Invited to a Meeting',
        leetcodeNumber: 2127,
        difficulty: 'Hard' as Difficulty,
        description:
          'Each employee i wants to sit next to favorite[i]. Arrange them around a circular table such that each employee sits next to their favorite. Find the maximum number of employees that can be invited. Use topological sort to find chain lengths into cycles, then handle cycles of length 2 (mutual favorites) vs longer cycles separately.',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS', 'Cycle Detection'],
      },
      {
        id: 'min-cost-to-connect-all-sticks',
        title: 'Minimum Cost to Connect Sticks',
        leetcodeNumber: 1167,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of sticks, combine two sticks at cost = sum of their lengths. Find the minimum cost to combine all sticks into one. Use a min-heap: always pick the two shortest sticks to minimize cost at each step.',
        hasVisualization: true,
        tags: ['Graph', 'Heap', 'Greedy'],
      },
      {
        id: 'minimum-cost-to-connect-all-points-ii',
        title: 'Minimum Cost to Connect All Points II',
        leetcodeNumber: 1584,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of points where points[i] = [xi, yi], connect all points with minimum total cost. Cost between two points is their Manhattan distance. Uses Prim\\',
        hasVisualization: true,
        tags: ['Graph', 'MST', 'Prim', 'Manhattan Distance'],
      },
      {
        id: 'minimum-cost-to-make-at-least-one-valid-path',
        title: 'Minimum Cost to Make at Least One Valid Path in a Grid',
        leetcodeNumber: 1368,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a grid where each cell has a direction (1=right, 2=left, 3=down, 4=up), find the minimum cost to go from (0,0) to (m-1,n-1). Moving in the cell\\',
        hasVisualization: true,
        tags: ['Graph', 'BFS', 'Deque', '0-1 BFS', 'Shortest Path'],
      },
      {
        id: 'minimum-height-trees-ii',
        title: 'Minimum Height Trees',
        leetcodeNumber: 310,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an undirected tree with n nodes, find all roots that produce minimum height trees. The key insight: roots of minimum height trees are always the center node(s) of the tree (at most 2). Use a topological sort approach: repeatedly trim leaf nodes (degree 1) until 1 or 2 nodes remain. Those are the MHT roots.',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS', 'Tree'],
      },
      {
        id: 'minimum-number-of-vertices-to-reach-all',
        title: 'Minimum Number of Vertices to Reach All Nodes',
        leetcodeNumber: 1557,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a DAG, find the smallest set of vertices from which all nodes are reachable. The key insight: any node with in-degree > 0 can be reached from some other node, so it doesn\\',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'In-Degree'],
      },
      {
        id: 'minimum-spanning-tree-kruskal',
        title: 'Kruskal',
        difficulty: 'Medium' as Difficulty,
        description:
          'Kruskal',
        hasVisualization: true,
        tags: ['Graph', 'MST', 'Union-Find', 'Greedy', 'Sorting'],
      },
      {
        id: 'minimum-spanning-tree-prim',
        title: 'Prim',
        difficulty: 'Medium' as Difficulty,
        description:
          'Prim',
        hasVisualization: true,
        tags: ['Graph', 'MST', 'Greedy', 'Heap'],
      },
      {
        id: 'minimum-time-to-complete-all-tasks',
        title: 'Minimum Time to Complete All Tasks',
        leetcodeNumber: 2589,
        difficulty: 'Hard' as Difficulty,
        description:
          'A computer can run tasks with given durations and execution windows [start, end]. A task must run for exactly duration seconds within its [start, end] interval. Find the minimum total seconds the computer must be running. Use greedy: sort by end time, then for each task greedily reuse already-running seconds in its window and add new time at the end if needed.',
        hasVisualization: true,
        tags: ['Graph', 'Greedy', 'Topological Sort', 'Sorting'],
      },
      {
        id: 'network-delay-time-iii',
        title: 'Network Delay Time III',
        leetcodeNumber: 743,
        difficulty: 'Medium' as Difficulty,
        description:
          'You have a network of n nodes and weighted directed edges. Given source node k, find the minimum time for a signal to reach ALL nodes. If any node is unreachable, return -1. Uses Bellman-Ford algorithm instead of Dijkstra for variety.',
        hasVisualization: true,
        tags: ['Graph', 'Bellman-Ford', 'Shortest Path'],
      },
      {
        id: 'number-of-connected-components-ii',
        title: 'Number of Connected Components in Undirected Graph II',
        leetcodeNumber: 323,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n nodes (0 to n-1) and a list of undirected edges, count the number of connected components. Uses Union-Find with path compression and union by rank for O(α(n)) per operation.',
        hasVisualization: true,
        tags: ['Graph', 'Union-Find', 'DFS'],
      },
      {
        id: 'number-of-islands-matrix',
        title: 'Number of Islands (Matrix)',
        leetcodeNumber: 200,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of islands in a 2D grid of 1s (land) and 0s (water). An island is surrounded by water and is formed by connecting adjacent land cells horizontally or vertically. Use DFS/BFS to mark each connected component.',
        hasVisualization: true,
        tags: ['Matrix', 'DFS', 'BFS', 'Graph'],
      },
      {
        id: 'number-of-provinces-ii',
        title: 'Number of Provinces II',
        leetcodeNumber: 547,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an n x n adjacency matrix isConnected where isConnected[i][j] = 1 means city i and j are directly connected, find the number of provinces (connected components). Solved with DFS traversal instead of Union-Find.',
        hasVisualization: true,
        tags: ['Graph', 'DFS', 'Connected Components'],
      },
      {
        id: 'number-of-ways-to-reach-destination-ii',
        title: 'Number of Ways to Arrive at Destination',
        leetcodeNumber: 1976,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a graph of roads with travel times, find the number of ways to reach the destination from node 0 with the minimum travel time. Combine Dijkstra\\',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'Dijkstra', 'Dynamic Programming'],
      },
      {
        id: 'open-the-lock-ii',
        title: 'Open the Lock II',
        leetcodeNumber: 752,
        difficulty: 'Medium' as Difficulty,
        description:
          'A lock has 4 wheels (0-9). Start at ',
        hasVisualization: true,
        tags: ['Graph', 'BFS', 'Shortest Path'],
      },
      {
        id: 'optimize-water-distribution',
        title: 'Optimize Water Distribution in a Village',
        leetcodeNumber: 1168,
        difficulty: 'Hard' as Difficulty,
        description:
          'There are n houses and you can build a well in any house or lay pipes between houses. Find minimum cost to supply water to all houses. Trick: add virtual node 0 connected to each house with well cost, then run Kruskal\\',
        hasVisualization: true,
        tags: ['Graph', 'MST', 'Union-Find', 'Kruskal'],
      },
      {
        id: 'pacific-atlantic-waterflow-matrix',
        title: 'Pacific Atlantic Water Flow',
        leetcodeNumber: 417,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find all cells in an m x n matrix from which water can flow to both the Pacific ocean (top/left border) and Atlantic ocean (bottom/right border). BFS/DFS from each border inward, marking reachable cells, then return the intersection.',
        hasVisualization: true,
        tags: ['Matrix', 'BFS', 'DFS', 'Graph'],
      },
      {
        id: 'parallel-courses-iii',
        title: 'Parallel Courses III',
        leetcodeNumber: 2050,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n courses, prerequisite relations, and a time array for each course, find the minimum time to complete all courses. Courses can be taken in parallel if prerequisites are satisfied. Use topological sort with BFS: maintain the earliest start time for each course, and propagate through the DAG. The answer is the maximum completion time.',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS', 'Dynamic Programming'],
      },
      {
        id: 'possible-bipartition-ii',
        title: 'Possible Bipartition II',
        leetcodeNumber: 886,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n people (1 to n) and a list of dislike pairs, determine if we can split everyone into two groups such that no two people who dislike each other are in the same group. This is equivalent to checking if the dislikes graph is bipartite.',
        hasVisualization: true,
        tags: ['Graph', 'BFS', 'Bipartite', '2-Coloring'],
      },
      {
        id: 'reorder-routes-to-lead-to-city',
        title: 'Reorder Routes to Make All Paths Lead to the City Zero',
        leetcodeNumber: 1466,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a tree rooted at city 0 with directed roads, find the minimum number of edges that must be reversed so all cities can reach city 0. BFS from city 0: if an edge leads away from 0 (we traverse it in reverse), we must flip it, costing 1. Edges already pointing toward 0 cost 0.',
        hasVisualization: true,
        tags: ['Graph', 'BFS', 'Topological Sort', 'Tree'],
      },
      {
        id: 'rotting-oranges-ii',
        title: 'Rotting Oranges II',
        leetcodeNumber: 994,
        difficulty: 'Medium' as Difficulty,
        description:
          'In a grid: 0=empty, 1=fresh orange, 2=rotten orange. Every minute, rotten oranges spread rot to adjacent fresh oranges. Find minimum minutes until no fresh oranges remain, or -1 if impossible. Classic multi-source BFS.',
        hasVisualization: true,
        tags: ['Graph', 'BFS', 'Matrix', 'Multi-Source BFS'],
      },
      {
        id: 'sequence-reconstruction',
        title: 'Sequence Reconstruction',
        leetcodeNumber: 444,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a sequence nums (a permutation of 1..n) and a list of subsequences, determine if nums is the only shortest supersequence that can be reconstructed from the subsequences. Use topological sort: build an ordering graph from the subsequences and verify there is a unique topological order matching nums.',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS'],
      },
      {
        id: 'shortest-bridge-ii',
        title: 'Shortest Bridge II',
        leetcodeNumber: 934,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary matrix with exactly two islands (groups of 1s), find the minimum number of 0s to flip to connect them. Use DFS to mark the first island, then BFS expanding outward to reach the second island.',
        hasVisualization: true,
        tags: ['Graph', 'BFS', 'DFS', 'Matrix'],
      },
      {
        id: 'snakes-and-ladders-matrix',
        title: 'Snakes and Ladders',
        leetcodeNumber: 909,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the minimum number of moves to reach the last cell on an n x n snakes and ladders board. The board is numbered in Boustrophedon style (alternating left-to-right, right-to-left from bottom row). Use BFS from cell 1.',
        hasVisualization: true,
        tags: ['Matrix', 'BFS', 'Graph'],
      },
      {
        id: 'sort-items-by-groups-respecting-dependencies',
        title: 'Sort Items by Groups Respecting Dependencies',
        leetcodeNumber: 1203,
        difficulty: 'Hard' as Difficulty,
        description:
          'There are n items, each belonging to a group. Items have dependencies (DAG). Sort items such that: (1) items within a group are contiguous, (2) dependencies are respected. Solve with two-level topological sort: first sort items within groups, then sort groups, then combine.',
        hasVisualization: true,
        tags: ['Graph', 'Topological Sort', 'BFS'],
      },
      {
        id: 'surrounded-regions-ii',
        title: 'Surrounded Regions II',
        leetcodeNumber: 130,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a matrix of \\',
        hasVisualization: true,
        tags: ['Graph', 'DFS', 'BFS', 'Matrix'],
      },
      {
        id: 'word-ladder-iv',
        title: 'Word Ladder IV',
        leetcodeNumber: 127,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given beginWord, endWord, and a word list, find the length of the shortest transformation sequence from beginWord to endWord where each step changes exactly one letter and the intermediate word must be in the word list. Uses bidirectional BFS for efficiency.',
        hasVisualization: true,
        tags: ['Graph', 'BFS', 'Bidirectional BFS', 'String'],
      },
    ],
  },

  // ─── 14. Backtracking ──────────────────────────────────────────────
  {
    id: 'backtracking',
    name: 'Backtracking',
    icon: '↺',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-yellow-600/10',
    borderColor: 'border-yellow-500/30',
    problems: [
      {
        id: 'find-all-permutations',
        title: 'Find All Permutations',
        difficulty: 'Medium',
        leetcodeNumber: 46,
        description:
          'Generate all possible orderings of a list of distinct numbers by swapping and backtracking.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion'],
      },
      {
        id: 'find-all-subsets',
        title: 'Find All Subsets',
        difficulty: 'Medium',
        leetcodeNumber: 78,
        description:
          'Generate the power set of a list of distinct integers by including or excluding each element.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'bit-manipulation'],
      },
      {
        id: 'n-queens',
        title: 'N Queens',
        difficulty: 'Hard',
        leetcodeNumber: 51,
        description:
          'Place N queens on an NxN chessboard so that no two queens threaten each other using backtracking.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'constraint-satisfaction'],
      },
      {
        id: 'combinations-of-a-sum',
        title: 'Combinations of a Sum',
        difficulty: 'Medium',
        leetcodeNumber: 39,
        description:
          'Find all unique combinations of candidates that sum to a target, allowing repeated use of elements.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion'],
      },
      {
        id: 'phone-keypad-combinations',
        title: 'Phone Keypad Combinations',
        difficulty: 'Medium',
        leetcodeNumber: 17,
        description:
          'Map digit sequences to all possible letter combinations from a phone keypad.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'string'],
      },
      {
        id: 'combination-sum-ii',
        title: 'Combination Sum II',
        difficulty: 'Medium',
        leetcodeNumber: 40,
        description:
          'Given a collection of candidate numbers (may contain duplicates) and a target, find all unique combinations where the candidates sum to target. Each number may only be used once. Sort the candidates first, then use backtracking skipping duplicates at the same recursion level.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'array'],
      },
      {
        id: 'combination-sum-iii',
        title: 'Combination Sum III',
        difficulty: 'Medium',
        leetcodeNumber: 216,
        description:
          'Find all combinations of k numbers that sum to n, using only digits 1-9, with each digit used at most once. We use backtracking: try each digit from the last chosen digit + 1 up to 9, add it to the current path, and recurse. When the path has k elements and sums to n, record it.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'array'],
      },
      {
        id: 'palindrome-partitioning',
        title: 'Palindrome Partitioning',
        difficulty: 'Medium',
        leetcodeNumber: 131,
        description:
          'Given a string s, partition it such that every substring of the partition is a palindrome. Return all possible palindrome partitionings. We use backtracking: at each position try extending the current substring; if it is a palindrome, recurse on the remaining string and then backtrack.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'string'],
      },
      {
        id: 'permutations-ii',
        title: 'Permutations II',
        difficulty: 'Medium',
        leetcodeNumber: 47,
        description:
          'Given an array of numbers that may contain duplicates, return all unique permutations. Sort the array first, then use a ',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'array'],
      },
      {
        id: 'restore-ip-addresses',
        title: 'Restore IP Addresses',
        difficulty: 'Medium',
        leetcodeNumber: 93,
        description:
          'Given a string of digits, return all valid IPv4 addresses that can be formed by inserting dots. Each segment must be 0-255 with no leading zeros. Use backtracking: build 4 segments, each 1-3 digits long, and validate each segment before recursing.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'string'],
      },
      {
        id: 'subsets-with-duplicates',
        title: 'Subsets II',
        difficulty: 'Medium',
        leetcodeNumber: 90,
        description:
          'Given an integer array that may contain duplicates, return all possible unique subsets (the power set). Sort the array first, then use backtracking. To avoid duplicate subsets, skip an element at a given recursion level if it equals the previous element and the previous element was not skipped.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'array'],
      },
      {
        id: 'sudoku-solver',
        title: 'Sudoku Solver',
        difficulty: 'Hard',
        leetcodeNumber: 37,
        description:
          'Fill a 9x9 Sudoku board. Each row, column, and 3x3 box must contain digits 1-9 exactly once. Use backtracking: find an empty cell, try digits 1-9, check validity, recurse. If no digit works, backtrack to the previous cell.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'board'],
      },
    
      {
        id: 'additive-number',
        title: 'Additive Number',
        leetcodeNumber: 306,
        difficulty: 'Medium' as Difficulty,
        description:
          'An additive number is a string whose digits can form an additive sequence: each number equals the sum of the two preceding it (like Fibonacci). Given a string of digits, determine if it forms a valid additive number. Uses backtracking to try all possible first-two-number splits.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'math', 'recursion', 'big number'],
      },
      {
        id: 'beautiful-arrangement',
        title: 'Beautiful Arrangement',
        leetcodeNumber: 526,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n, count the number of beautiful arrangements of integers 1 to n. A beautiful arrangement satisfies: for each position i (1-indexed), either the value at position i is divisible by i, or i is divisible by the value. Uses backtracking to place numbers while checking the beautiful condition.',
        hasVisualization: true,
        tags: ['backtracking', 'array', 'recursion', 'permutation', 'counting'],
      },
      {
        id: 'combination-iterator',
        title: 'Iterator for Combinations',
        leetcodeNumber: 1286,
        difficulty: 'Medium' as Difficulty,
        description:
          'Design an iterator that returns combinations of k characters from a string of lowercase letters in lexicographic order. Pre-generates all combinations in sorted order using backtracking, then serves them one by one via next() calls. Demonstrates how backtracking can power iterator-based APIs.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'iterator', 'combination', 'design'],
      },
      {
        id: 'combination-sum',
        title: 'Combination Sum (Tree Visualization)',
        leetcodeNumber: 39,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of distinct integers and a target, find all unique combinations where the chosen numbers sum to target. Each number may be used unlimited times. Uses backtracking with a decision tree visualization showing which candidates are chosen at each level.',
        hasVisualization: true,
        tags: ['backtracking', 'array', 'combination', 'recursion', 'tree'],
      },
      {
        id: 'crossword-puzzle-solver',
        title: 'Crossword Puzzle Solver',
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a crossword grid with some letters pre-filled and some slots to fill, and a word list, determine if the words can be placed to fill all empty slots. Uses backtracking to place words horizontally and vertically, checking that placements are consistent with pre-filled letters and existing placements.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'constraint satisfaction', 'grid', 'recursion'],
      },
      {
        id: 'cryptarithmetic-solver',
        title: 'Cryptarithmetic Solver (SEND+MORE=MONEY)',
        difficulty: 'Hard' as Difficulty,
        description:
          'Solve cryptarithmetic puzzles where each letter represents a unique digit (0-9). The classic puzzle is SEND+MORE=MONEY. Uses constraint-based backtracking: assign digits to letters column by column from right to left, propagating carry values and pruning when a partial assignment cannot satisfy the equation.',
        hasVisualization: true,
        tags: ['backtracking', 'constraint satisfaction', 'permutation', 'math', 'puzzle'],
      },
      {
        id: 'generate-all-binary-strings',
        title: 'Generate All Binary Strings of Length N',
        difficulty: 'Easy' as Difficulty,
        description:
          'Generate all possible binary strings of length n using backtracking. At each position, try placing 0 or 1, then recurse. The total number of strings is 2^n. This is a foundational backtracking example showing how the technique works: choose, explore, unchoose.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'recursion', 'binary', 'enumeration'],
      },
      {
        id: 'generate-parentheses-ii',
        title: 'Generate Parentheses II (Pruning Variant)',
        leetcodeNumber: 22,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n pairs of parentheses, generate all combinations of well-formed parentheses using backtracking with aggressive pruning. This variant tracks open and close counts explicitly, pruning branches where close count exceeds open or either count exceeds n.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'recursion', 'pruning', 'parentheses'],
      },
      {
        id: 'gray-code',
        title: 'Gray Code',
        leetcodeNumber: 89,
        difficulty: 'Medium' as Difficulty,
        description:
          'An n-bit Gray code sequence is a sequence of 2^n integers where each successive pair differs by exactly one bit. Given n, return any valid n-bit Gray code sequence starting from 0. The mathematical formula is: Gray(i) = i XOR (i >> 1), generating the sequence directly.',
        hasVisualization: true,
        tags: ['backtracking', 'bit manipulation', 'math', 'sequence', 'xor'],
      },
      {
        id: 'increasing-subsequences',
        title: 'Non-decreasing Subsequences',
        leetcodeNumber: 491,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array, return all the different possible non-decreasing subsequences of the array with at least two elements. Uses backtracking with a set at each recursion level to avoid duplicates without sorting the array (since sorting would change the structure).',
        hasVisualization: true,
        tags: ['backtracking', 'array', 'hash set', 'recursion', 'subsequence'],
      },
      {
        id: 'knight-tour',
        title: 'Knight Tour Problem',
        difficulty: 'Hard' as Difficulty,
        description:
          'The Knight Tour problem finds a sequence of moves for a chess knight such that it visits every square on an N x N chessboard exactly once. Uses backtracking with the Warnsdorff heuristic (always move to the square with the fewest onward moves) to make the search efficient.',
        hasVisualization: true,
        tags: ['backtracking', 'chess', 'graph', 'heuristic', 'warnsdorff'],
      },
      {
        id: 'letter-case-permutation',
        title: 'Letter Case Permutation',
        leetcodeNumber: 784,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string, return all possible strings you can generate by changing each letter to either lowercase or uppercase. Digits remain unchanged. Uses backtracking to explore both cases for each letter character at each position.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'recursion', 'bit manipulation', 'permutation'],
      },
      {
        id: 'letter-combinations-of-phone-number-ii',
        title: 'Letter Combinations of a Phone Number II (Iterative)',
        leetcodeNumber: 17,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string containing digits from 2-9, return all possible letter combinations the number could represent using iterative BFS-style expansion rather than recursive DFS. Each digit maps to letters on a phone keypad. Build combinations level by level.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'iterative', 'bfs', 'phone keypad'],
      },
      {
        id: 'm-coloring-problem',
        title: 'M-Coloring Problem',
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an undirected graph and M colors, determine if the graph can be colored using at most M colors such that no two adjacent vertices share the same color. Uses backtracking to assign colors to vertices one at a time, checking that no adjacent vertex has the same color before proceeding.',
        hasVisualization: true,
        tags: ['backtracking', 'graph', 'coloring', 'recursion', 'constraint satisfaction'],
      },
      {
        id: 'matchsticks-to-square',
        title: 'Matchsticks to Square',
        leetcodeNumber: 473,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given matchsticks of various lengths, determine if they can form a perfect square where all 4 sides have equal length. Each matchstick must be used exactly once. Uses backtracking with pruning: sort descending to fail fast, skip duplicate bucket sums to avoid redundant branches.',
        hasVisualization: true,
        tags: ['backtracking', 'array', 'bit manipulation', 'sorting', 'pruning'],
      },
      {
        id: 'maximum-length-of-concatenated-string',
        title: 'Maximum Length of a Concatenated String with Unique Characters',
        leetcodeNumber: 1239,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of strings, find the maximum length of a concatenation of a subsequence of strings such that the concatenated string has unique characters. Uses backtracking with bitmask to efficiently track which characters are used and detect duplicates within individual strings.',
        hasVisualization: true,
        tags: ['backtracking', 'bit manipulation', 'string', 'bitmask', 'recursion'],
      },
      {
        id: 'partition-to-k-equal-sum-subsets',
        title: 'Partition to K Equal Sum Subsets',
        leetcodeNumber: 698,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array and a number k, determine if the array can be partitioned into k non-empty subsets whose sums are all equal. Uses backtracking to try placing each number into one of k buckets, pruning when a bucket would exceed the target sum.',
        hasVisualization: true,
        tags: ['backtracking', 'array', 'recursion', 'subset', 'partition'],
      },
      {
        id: 'permutation-with-spaces',
        title: 'Permutation of a String with Spaces',
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string, generate all permutations by inserting a space before each character (except the first). For a string of length n, this produces 2^(n-1) permutations. Uses backtracking to explore both choices at each position: include a space before the character or not.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'recursion', 'enumeration', 'permutation'],
      },
      {
        id: 'queens-attack-ii',
        title: 'Queens Attack II',
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a chessboard of size N, a queen position, and obstacles, count how many squares the queen can attack. The queen attacks in 8 directions but is blocked by obstacles. Uses backtracking-style directional exploration: for each of 8 directions, extend until blocked by an obstacle or board boundary.',
        hasVisualization: true,
        tags: ['backtracking', 'hash set', 'geometry', 'simulation', 'directions'],
      },
      {
        id: 'rat-in-a-maze',
        title: 'Rat in a Maze',
        difficulty: 'Medium' as Difficulty,
        description:
          'Classic backtracking problem: find all paths a rat can take from top-left (0,0) to bottom-right (N-1,N-1) of an N x N maze. Cells with value 1 are open, 0 are blocked. The rat can move in 4 directions (or sometimes 2). Uses DFS with backtracking and records all valid paths.',
        hasVisualization: true,
        tags: ['backtracking', 'matrix', 'dfs', 'path finding', 'recursion'],
      },
      {
        id: 'split-string-into-max-unique-substrings',
        title: 'Split a String Into the Max Number of Unique Substrings',
        leetcodeNumber: 1593,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s, return the maximum number of unique substrings that the string can be split into. All substrings must be non-empty, together they must reconstruct the original string, and all must be distinct. Uses backtracking with a set to track used substrings.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'hash set', 'recursion', 'greedy'],
      },
      {
        id: 'subset-sum-problem',
        title: 'Subset Sum Problem',
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a set of non-negative integers and a target sum, find all subsets that sum exactly to the target. Uses backtracking with sorting and pruning: if the current element exceeds the remaining target, all larger elements can be skipped. Records every subset that achieves the exact sum.',
        hasVisualization: true,
        tags: ['backtracking', 'array', 'recursion', 'subset', 'sum'],
      },
      {
        id: 'the-k-th-lexicographical-string',
        title: 'The k-th Lexicographical String of All Happy Strings',
        leetcodeNumber: 1415,
        difficulty: 'Hard' as Difficulty,
        description:
          'A happy string only uses characters a, b, c and no two consecutive characters are the same. Given n and k, find the k-th lexicographically smallest happy string of length n. Uses backtracking to generate happy strings in lexicographic order, stopping at the k-th one.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'recursion', 'lexicographic order', 'counting'],
      },
      {
        id: 'word-search-ii',
        title: 'Word Search II (Trie Optimization)',
        leetcodeNumber: 212,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a board of characters and a list of words, find all words that exist in the board. Characters can be used in adjacent cells (horizontal/vertical) but not reused in the same path. Uses a Trie to efficiently prune search paths and avoid redundant work.',
        hasVisualization: true,
        tags: ['backtracking', 'trie', 'matrix', 'dfs', 'word search'],
      },
      {
        id: 'word-search-single',
        title: 'Word Search (Detailed Step Tracking)',
        leetcodeNumber: 79,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an m x n grid of characters and a word, return true if the word exists in the grid. The word must be constructed from sequentially adjacent cells (horizontally or vertically). The same cell may not be used more than once. Tracks every DFS step and backtrack for full visualization.',
        hasVisualization: true,
        tags: ['backtracking', 'matrix', 'dfs', 'string', 'recursion'],
      },
    
      {
        id: 'ambiguous-coordinates',
        title: 'Ambiguous Coordinates',
        leetcodeNumber: 816,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s representing a sequence of digits with parentheses, we removed a comma. Return all valid representations by inserting one comma, then adding optional decimal points. A valid number has no extra leading zeros and no trailing zeros in the decimal part. Return all combinations as ',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'enumeration'],
      },
      {
        id: 'android-unlock-patterns',
        title: 'Android Unlock Patterns',
        leetcodeNumber: 351,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of valid Android unlock patterns using keys 1-9 that connect m to n keys. A pattern is invalid if it jumps over an unvisited key. Use backtracking: track visited keys and a skip table that defines which key must be visited when moving between two non-adjacent keys.',
        hasVisualization: true,
        tags: ['backtracking', 'dynamic programming', 'bitmask'],
      },
      {
        id: 'brace-expansion-ii',
        title: 'Brace Expansion II',
        leetcodeNumber: 1096,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an expression with nested braces representing unions and concatenations of sets, return all possible strings in the result in sorted order without duplicates. Braces group alternatives (union), adjacent groups concatenate (Cartesian product). Parse recursively and compute the resulting set.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'set', 'parsing'],
      },
      {
        id: 'brace-expansion',
        title: 'Brace Expansion',
        leetcodeNumber: 1087,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string expression of the form ',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'breadth-first search'],
      },
      {
        id: 'combination-sum-backtrack',
        title: 'Combination Sum (Backtracking)',
        leetcodeNumber: 39,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of distinct integers and a target, find all unique combinations that sum to the target. Each number may be used multiple times. Use backtracking: at each step either include the current candidate (and recurse with the same candidate) or skip to the next. Sort candidates first to enable early termination.',
        hasVisualization: true,
        tags: ['backtracking', 'array', 'recursion'],
      },
      {
        id: 'construct-smallest-number-from-di',
        title: 'Construct Smallest Number from DI String',
        leetcodeNumber: 2375,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a pattern string of ',
        hasVisualization: true,
        tags: ['backtracking', 'stack', 'greedy', 'string'],
      },
      {
        id: 'count-numbers-with-unique-digits',
        title: 'Count Numbers with Unique Digits',
        leetcodeNumber: 357,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer n, return the count of all numbers with unique digits x, where 0 <= x < 10^n. For each digit count k from 1 to n, compute the product of available choices: first digit has 9 choices (1-9), second has 9 (0-9 minus used), third has 8, and so on.',
        hasVisualization: true,
        tags: ['backtracking', 'math', 'dynamic programming', 'counting'],
      },
      {
        id: 'expression-add-operators',
        title: 'Expression Add Operators',
        leetcodeNumber: 282,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a string of digits and a target value, add binary operators +, -, or * between digits so that the expression evaluates to the target value. Return all valid expressions. Track the current evaluation and the last multiplication operand to handle operator precedence correctly.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'math', 'recursion'],
      },
      {
        id: 'factor-combinations',
        title: 'Factor Combinations',
        leetcodeNumber: 254,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a positive integer n, return all possible combinations of factors (greater than 1) whose product equals n. Each combination should be listed in non-decreasing order, and no combination should include 1 or n itself (unless n == 1). Use backtracking starting from factor 2 up to sqrt(n).',
        hasVisualization: true,
        tags: ['backtracking', 'math', 'recursion'],
      },
      {
        id: 'generalized-abbreviation',
        title: 'Generalized Abbreviation',
        leetcodeNumber: 320,
        difficulty: 'Medium' as Difficulty,
        description:
          'Generate all possible abbreviations of a word. A word can be abbreviated by replacing any contiguous group of letters with the count of those letters. For example ',
        hasVisualization: true,
        tags: ['backtracking', 'bit manipulation', 'string', 'recursion'],
      },
      {
        id: 'letter-combinations-of-phone-number',
        title: 'Letter Combinations of a Phone Number',
        leetcodeNumber: 17,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string containing digits 2-9, return all possible letter combinations that the number could represent on a phone keypad. Use backtracking: for each digit, iterate over its letters and recurse to the next digit, building combinations character by character.',
        hasVisualization: true,
        tags: ['backtracking', 'hash map', 'string', 'recursion'],
      },
      {
        id: 'letter-tiles-possibilities',
        title: 'Letter Tile Possibilities',
        leetcodeNumber: 1079,
        difficulty: 'Medium' as Difficulty,
        description:
          'You have a set of tiles, where each tile has one letter on it. Return the number of possible non-empty sequences of letters you can make using the letters printed on those tiles. Use backtracking with character frequency counts to enumerate all distinct sequences.',
        hasVisualization: true,
        tags: ['backtracking', 'hash map', 'counting', 'string'],
      },
      {
        id: 'n-queens-ii',
        title: 'N-Queens II',
        leetcodeNumber: 52,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count the number of distinct solutions to the N-Queens puzzle. Given an integer n, return the number of distinct solutions to the n-queens puzzle where n queens are placed on an n x n chessboard such that no two queens attack each other.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'bit manipulation'],
      },
      {
        id: 'number-of-squareful-arrays',
        title: 'Number of Squareful Arrays',
        leetcodeNumber: 996,
        difficulty: 'Hard' as Difficulty,
        description:
          'An array is squareful if the sum of every pair of adjacent elements is a perfect square. Given an integer array nums, return the number of permutations of nums that are squareful. Use backtracking with duplicate pruning: sort first, skip duplicates at the same position level.',
        hasVisualization: true,
        tags: ['backtracking', 'math', 'permutation', 'recursion'],
      },
      {
        id: 'palindrome-partitioning-bt',
        title: 'Palindrome Partitioning (Backtracking)',
        leetcodeNumber: 131,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s, partition it such that every substring of the partition is a palindrome. Return all possible palindrome partitionings. Use backtracking to explore all cut positions, checking each substring for palindrome validity before recursing.',
        hasVisualization: true,
        tags: ['backtracking', 'dynamic programming', 'string', 'palindrome'],
      },
      {
        id: 'path-with-maximum-gold',
        title: 'Path with Maximum Gold',
        leetcodeNumber: 1219,
        difficulty: 'Medium' as Difficulty,
        description:
          'In a gold mine grid, each cell contains some gold (0 means no gold/blocked). You can start at any non-zero cell and move up/down/left/right, but cannot revisit cells or enter zero cells. Find the path that collects the maximum amount of gold using DFS backtracking from every valid starting cell.',
        hasVisualization: true,
        tags: ['backtracking', 'dfs', 'matrix', 'recursion'],
      },
      {
        id: 'permutations-backtrack',
        title: 'Permutations (Backtracking)',
        leetcodeNumber: 46,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of distinct integers, return all possible permutations. Use backtracking with a used-array to track which elements are already in the current permutation. For each position, try every unused element, mark it used, recurse, then unmark to backtrack.',
        hasVisualization: true,
        tags: ['backtracking', 'array', 'recursion'],
      },
      {
        id: 'restore-ip-addresses-bt',
        title: 'Restore IP Addresses (Backtracking)',
        leetcodeNumber: 93,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string containing only digits, return all possible valid IP addresses that can be formed by inserting dots. A valid IP address consists of exactly four integers separated by dots, each between 0 and 255, with no leading zeros.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'recursion'],
      },
      {
        id: 'split-array-into-fibonacci-sequence',
        title: 'Split Array into Fibonacci Sequence',
        leetcodeNumber: 842,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string of digits, split it into a Fibonacci-like sequence of at least 3 numbers where each number is the sum of the two preceding ones. No number can have leading zeros (unless it is 0 itself) and must fit in a 32-bit signed integer. Use backtracking to try all valid splits.',
        hasVisualization: true,
        tags: ['backtracking', 'string', 'greedy', 'recursion'],
      },
      {
        id: 'strobogrammatic-number-ii',
        title: 'Strobogrammatic Number II',
        leetcodeNumber: 247,
        difficulty: 'Medium' as Difficulty,
        description:
          'A strobogrammatic number looks the same when rotated 180 degrees. Given an integer n, return all strobogrammatic numbers of length n. Build them from the outside in: pairs (0,0), (1,1), (6,9), (8,8), (9,6) wrap each inner result, with (0,0) disallowed at outermost level.',
        hasVisualization: true,
        tags: ['backtracking', 'recursion', 'math', 'string'],
      },
      {
        id: 'subsets-backtrack',
        title: 'Subsets (Backtracking)',
        leetcodeNumber: 78,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array of unique elements, return all possible subsets (the power set). Use backtracking: at each recursive call, record the current subset as a result (since every state is valid), then try adding each remaining element. Starting index prevents duplicates. Total: 2^n subsets.',
        hasVisualization: true,
        tags: ['backtracking', 'array', 'bit manipulation', 'recursion'],
      },
      {
        id: 'sudoku-solver-bt',
        title: 'Sudoku Solver (Backtracking)',
        leetcodeNumber: 37,
        difficulty: 'Hard' as Difficulty,
        description:
          'Solve a Sudoku puzzle by filling in the empty cells. A sudoku solution must satisfy all rules: each row, column, and 3x3 box must contain digits 1-9 without repetition. Uses backtracking to try each digit and backtrack on conflicts.',
        hasVisualization: true,
        tags: ['backtracking', 'hash set', 'matrix', 'constraint satisfaction'],
      },
      {
        id: 'unique-paths-iii-bt',
        title: 'Unique Paths III (Backtracking)',
        leetcodeNumber: 980,
        difficulty: 'Hard' as Difficulty,
        description:
          'On a 2D grid, find the number of paths from the starting square (value 1) to the ending square (value 2) that pass over every non-obstacle square exactly once. Squares with value -1 are obstacles. Use DFS backtracking, marking visited cells and counting valid complete paths.',
        hasVisualization: true,
        tags: ['backtracking', 'dfs', 'matrix', 'recursion'],
      },
      {
        id: 'verbal-arithmetic-puzzle',
        title: 'Verbal Arithmetic Puzzle',
        leetcodeNumber: 1307,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an equation of words (SEND + MORE = MONEY), determine if it can be solved by assigning digits 0-9 to each letter uniquely such that the equation holds. No word can have a leading zero. Use backtracking column by column from right to left, pruning invalid assignments early.',
        hasVisualization: true,
        tags: ['backtracking', 'math', 'hash map', 'constraint satisfaction'],
      },
      {
        id: 'word-break-ii',
        title: 'Word Break II',
        leetcodeNumber: 140,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a string s and a dictionary of words, add spaces to s to construct all possible sentences where each word is a valid dictionary word. Use backtracking with memoization: at each position try every prefix and recurse if the prefix is in the dictionary.',
        hasVisualization: true,
        tags: ['backtracking', 'dynamic programming', 'trie', 'memoization', 'string'],
      },
    
      {
        id: 'letter-case-permutation-ii',
        title: 'Letter Case Permutation II',
        leetcodeNumber: 784,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string, generate all possible strings by converting each letter to uppercase or lowercase. Digits remain unchanged. Use backtracking or BFS: at each character position, if it\\',
        hasVisualization: true,
        tags: ['Backtracking', 'String', 'Bit Manipulation'],
      },
      {
        id: 'word-search-matrix',
        title: 'Word Search',
        leetcodeNumber: 79,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an m x n character grid and a word, return true if the word exists in the grid. The word can be constructed from adjacent (horizontally or vertically) cells. Each cell may be used only once. Use DFS/backtracking.',
        hasVisualization: true,
        tags: ['Matrix', 'DFS', 'Backtracking'],
      },
    ],
  },

  // ─── 15. Dynamic Programming ───────────────────────────────────────
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    icon: '▦',
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-purple-600/10',
    borderColor: 'border-purple-500/30',
    problems: [
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        leetcodeNumber: 70,
        description:
          'Count the number of distinct ways to climb n stairs when you can take 1 or 2 steps at a time.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'fibonacci'],
      },
      {
        id: 'minimum-coin-combination',
        title: 'Minimum Coin Combination',
        difficulty: 'Medium',
        leetcodeNumber: 322,
        description:
          'Find the fewest coins needed to make a target amount using bottom-up dynamic programming.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'matrix-pathways',
        title: 'Matrix Pathways',
        difficulty: 'Medium',
        leetcodeNumber: 62,
        description:
          'Count the number of unique paths from top-left to bottom-right of a grid moving only right or down.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'matrix'],
      },
      {
        id: 'neighborhood-burglary',
        title: 'Neighborhood Burglary',
        difficulty: 'Medium',
        leetcodeNumber: 198,
        description:
          'Maximize the amount robbed from non-adjacent houses along a street using DP.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'longest-common-subsequence',
        title: 'Longest Common Subsequence',
        difficulty: 'Medium',
        leetcodeNumber: 1143,
        description:
          'Find the length of the longest subsequence common to two strings using a 2D DP table.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'string'],
      },
      {
        id: 'longest-palindrome-in-string',
        title: 'Longest Palindrome in String',
        difficulty: 'Medium',
        leetcodeNumber: 5,
        description:
          'Find the longest palindromic substring by expanding around each center or using DP.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'string', 'palindrome'],
      },
      {
        id: 'maximum-subarray-sum',
        title: 'Maximum Subarray Sum',
        difficulty: 'Medium',
        leetcodeNumber: 53,
        description:
          'Find the contiguous subarray with the largest sum using Kadane\'s algorithm.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array', 'greedy'],
      },
      {
        id: '0-1-knapsack',
        title: '0/1 Knapsack',
        difficulty: 'Medium',
        description:
          'Maximize the value of items packed into a weight-limited knapsack where each item is taken or left.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'largest-square-in-matrix',
        title: 'Largest Square in Matrix',
        difficulty: 'Medium',
        leetcodeNumber: 221,
        description:
          'Find the area of the largest square containing only ones in a binary matrix using DP.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'matrix'],
      },
      {
        id: 'best-time-buy-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        leetcodeNumber: 121,
        description:
          'Given prices on each day, find the maximum profit from one buy followed by one sell. Track the minimum price seen so far. For each day, compute potential profit (current price - min price) and update the maximum profit. O(n) time, O(1) space.',
        hasVisualization: true,
        tags: ['array', 'dynamic-programming', 'greedy'],
      },
      {
        id: 'burst-balloons',
        title: 'Burst Balloons',
        difficulty: 'Hard',
        leetcodeNumber: 312,
        description:
          'Given n balloons with numbers, burst them to maximize coins. Bursting balloon i yields nums[i-1]*nums[i]*nums[i+1] coins. Use interval DP: dp[i][j] = max coins from bursting balloons in (i,j) exclusive, where k is the last balloon burst.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'divide-and-conquer', 'array'],
      },
      {
        id: 'coin-change-ii',
        title: 'Coin Change II',
        difficulty: 'Medium',
        leetcodeNumber: 518,
        description:
          'Given an integer amount and an array of coin denominations, return the number of combinations that make up that amount. Order does not matter. dp[i] = number of combinations to make amount i. For each coin, dp[j] += dp[j - coin].',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'decode-ways',
        title: 'Decode Ways',
        difficulty: 'Medium',
        leetcodeNumber: 91,
        description:
          'A message containing letters A-Z can be encoded into numbers where A=1, B=2, ..., Z=26. Given a string of digits, count the number of ways to decode it. dp[i] = number of ways to decode the first i characters.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'string'],
      },
      {
        id: 'edit-distance',
        title: 'Edit Distance',
        difficulty: 'Hard',
        leetcodeNumber: 72,
        description:
          'Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) to convert word1 to word2. Uses a 2D DP table where dp[i][j] = min operations to convert word1[0..i-1] to word2[0..j-1].',
        hasVisualization: true,
        tags: ['dynamic-programming', 'string'],
      },
      {
        id: 'house-robber-ii',
        title: 'House Robber II',
        difficulty: 'Medium',
        leetcodeNumber: 213,
        description:
          'Houses are arranged in a circle — the first and last house are adjacent. You cannot rob adjacent houses. Find the maximum amount you can rob. Key insight: solve House Robber on two sub-arrays: nums[0..n-2] and nums[1..n-1], then take the max.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'interleaving-string',
        title: 'Interleaving String',
        difficulty: 'Medium',
        leetcodeNumber: 97,
        description:
          'Given strings s1, s2, and s3, determine if s3 is formed by interleaving s1 and s2. dp[i][j] = true if s3[0..i+j-1] can be formed by interleaving s1[0..i-1] and s2[0..j-1]. Flattened to 1D for visualization.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'string'],
      },
      {
        id: 'longest-increasing-subsequence',
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        leetcodeNumber: 300,
        description:
          'Given an integer array, return the length of the longest strictly increasing subsequence. dp[i] = length of longest increasing subsequence ending at index i. For each i, check all j < i where nums[j] < nums[i], and take the best.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array', 'binary-search'],
      },
      {
        id: 'longest-string-chain',
        title: 'Longest String Chain',
        difficulty: 'Medium',
        leetcodeNumber: 1048,
        description:
          'Given a list of words, find the longest chain where each word is a predecessor of the next (differs by one letter insertion). Sort words by length, then dp[word] = longest chain ending at that word. For each word, try removing each character to find a predecessor.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'hash-map', 'string'],
      },
      {
        id: 'minimum-cost-climbing-stairs',
        title: 'Min Cost Climbing Stairs',
        difficulty: 'Easy',
        leetcodeNumber: 746,
        description:
          'Given an array cost where cost[i] is the cost to step on stair i, find the minimum cost to reach the top. You can start at index 0 or 1 and climb 1 or 2 steps at a time. dp[i] = min cost to reach step i. dp[i] = cost[i] + min(dp[i-1], dp[i-2]).',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'minimum-path-sum',
        title: 'Minimum Path Sum',
        difficulty: 'Medium',
        leetcodeNumber: 64,
        description:
          'Given an m x n grid filled with non-negative numbers, find a path from the top-left to the bottom-right which minimizes the sum of all numbers along its path. You can only move right or down. dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).',
        hasVisualization: true,
        tags: ['dynamic-programming', 'matrix', 'array'],
      },
      {
        id: 'paint-house',
        title: 'Paint House',
        difficulty: 'Medium',
        leetcodeNumber: 256,
        description:
          'There are n houses and each can be painted Red, Blue, or Green. Adjacent houses must not have the same color. Given a cost matrix costs[i][j] = cost to paint house i with color j, find the minimum cost to paint all houses. dp[i][c] = min cost to paint houses 0..i with house i color c.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'partition-equal-subset-sum',
        title: 'Partition Equal Subset Sum',
        difficulty: 'Medium',
        leetcodeNumber: 416,
        description:
          'Given a non-empty array of positive integers, determine if the array can be partitioned into two subsets such that the sums are equal. This reduces to: can we find a subset summing to total/2? dp[j] = true if subset sum j is achievable.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'perfect-squares',
        title: 'Perfect Squares',
        difficulty: 'Medium',
        leetcodeNumber: 279,
        description:
          'Given an integer n, return the least number of perfect square numbers that sum to n. Perfect squares: 1, 4, 9, 16, ... dp[i] = min perfect squares summing to i. For each perfect square s <= i, dp[i] = min(dp[i], dp[i-s] + 1).',
        hasVisualization: true,
        tags: ['dynamic-programming', 'math', 'bfs'],
      },
      {
        id: 'regular-expression-matching',
        title: 'Regular Expression Matching',
        difficulty: 'Hard',
        leetcodeNumber: 10,
        description:
          'Given string s and pattern p with ',
        hasVisualization: true,
        tags: ['dynamic-programming', 'string', 'recursion'],
      },
      {
        id: 'stone-game',
        title: 'Stone Game',
        difficulty: 'Medium',
        leetcodeNumber: 877,
        description:
          'Alice and Bob take turns picking from either end of a row of piles. Alice goes first. The player with more stones wins. dp[i][j] = net stones the current player gains over the opponent from piles[i..j]. Alice wins if dp[0][n-1] > 0. (Alex always wins with even n piles.)',
        hasVisualization: true,
        tags: ['dynamic-programming', 'math', 'game-theory'],
      },
      {
        id: 'target-sum',
        title: 'Target Sum',
        difficulty: 'Medium',
        leetcodeNumber: 494,
        description:
          'Given an array of integers and a target, count the ways to assign ',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array', 'backtracking'],
      },
      {
        id: 'triangle-minimum-path-sum',
        title: 'Triangle Minimum Path Sum',
        difficulty: 'Medium',
        leetcodeNumber: 120,
        description:
          'Given a triangle array, find the minimum path sum from top to bottom. Each step you may move to adjacent numbers in the row below. Work bottom-up: dp[i] = min path sum starting at each position in row i. Final answer is dp[0][0].',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array'],
      },
      {
        id: 'unique-paths-with-obstacles',
        title: 'Unique Paths II',
        difficulty: 'Medium',
        leetcodeNumber: 63,
        description:
          'A robot starts at the top-left of an m x n grid with obstacles. It can only move right or down. Count the number of unique paths to the bottom-right corner, avoiding cells marked with 1 (obstacles). dp[i][j] = 0 if obstacle, else dp[i-1][j] + dp[i][j-1].',
        hasVisualization: true,
        tags: ['dynamic-programming', 'matrix', 'array'],
      },
      {
        id: 'wildcard-matching',
        title: 'Wildcard Matching',
        difficulty: 'Hard',
        leetcodeNumber: 44,
        description:
          'Given an input string s and a pattern p with ',
        hasVisualization: true,
        tags: ['dynamic-programming', 'string', 'greedy'],
      },
      {
        id: 'word-break',
        title: 'Word Break',
        difficulty: 'Medium',
        leetcodeNumber: 139,
        description:
          'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words. dp[i] = true if s[0..i-1] can be segmented using words in the dictionary.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'string', 'hash-map'],
      },
    
      {
        id: 'arithmetic-slices',
        title: 'Arithmetic Slices',
        leetcodeNumber: 413,
        difficulty: 'Medium' as Difficulty,
        description:
          'A sequence is arithmetic if it has at least 3 elements and consecutive differences are all equal. Given nums, return the count of arithmetic subarrays. DP: dp[i] is the number of new arithmetic subarrays ending at index i. If nums[i]-nums[i-1]==nums[i-1]-nums[i-2], then dp[i]=dp[i-1]+1.',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'math', 'sliding window'],
      },
      {
        id: 'best-team-with-no-conflicts',
        title: 'Best Team With No Conflicts',
        leetcodeNumber: 1626,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given arrays of scores and ages for players, form a team with maximum total score such that for any two players on the team, if one is older, their score must be at least as high (no conflicts). Sort players by age then score, and apply a Longest Increasing Subsequence-style DP on scores.',
        hasVisualization: true,
        tags: ['dynamic programming', 'sorting', 'LIS variant'],
      },
      {
        id: 'best-time-buy-sell-stock-iii',
        title: 'Best Time to Buy and Sell Stock III',
        leetcodeNumber: 123,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array prices, find the maximum profit from at most 2 transactions (each buy must occur before a sell). Track four states: buy1 (min cost after first buy), sell1 (max profit after first sell), buy2 (min cost of second buy accounting for profit), sell2 (max profit after second sell).',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'state machine', 'stock'],
      },
      {
        id: 'best-time-buy-sell-stock-iv',
        title: 'Best Time to Buy and Sell Stock IV',
        leetcodeNumber: 188,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given prices array and integer k, find the maximum profit with at most k transactions. If k >= n/2 (unlimited transactions), use greedy. Otherwise use DP with buy[j] and sell[j] arrays representing optimal states for each of the k transactions.',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'stock', 'state machine'],
      },
      {
        id: 'best-time-buy-sell-stock-with-cooldown',
        title: 'Best Time to Buy and Sell Stock with Cooldown',
        leetcodeNumber: 309,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given prices, find the maximum profit with unlimited transactions but a cooldown of 1 day after each sell (cannot buy on the next day). Use three states: held (holding stock), sold (just sold, in cooldown), and rest (not holding, not in cooldown).',
        hasVisualization: true,
        tags: ['dynamic programming', 'state machine', 'stock', 'cooldown'],
      },
      {
        id: 'best-time-buy-sell-stock-with-fee',
        title: 'Best Time to Buy and Sell Stock with Transaction Fee',
        leetcodeNumber: 714,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given prices array and a transaction fee, find the maximum profit with unlimited transactions. Each transaction incurs a fee subtracted when selling. Use two DP states: cash (max profit when not holding stock) and hold (max profit when holding stock). No cooldown period.',
        hasVisualization: true,
        tags: ['dynamic programming', 'greedy', 'stock', 'fee'],
      },
      {
        id: 'champagne-tower',
        title: 'Champagne Tower',
        leetcodeNumber: 799,
        difficulty: 'Medium' as Difficulty,
        description:
          'Glasses are stacked in a pyramid. Pour poured cups of champagne into the top. When a glass is full (>1 cup), excess overflows equally to the two glasses below. Find how full the glass at row r, column c is. Simulate row by row: track overflow and propagate down.',
        hasVisualization: true,
        tags: ['dynamic programming', 'simulation', 'array'],
      },
      {
        id: 'cherry-pickup',
        title: 'Cherry Pickup',
        leetcodeNumber: 741,
        difficulty: 'Hard' as Difficulty,
        description:
          'In an n x n grid, each cell has 0, 1 (cherry), or -1 (thorn). Collect maximum cherries going from top-left to bottom-right then back. This is equivalent to two simultaneous paths both going from top-left to bottom-right. Using 3D DP where dp[t][r1][r2] represents max cherries when both walkers are at step t with walker 1 at row r1 and walker 2 at row r2. Their columns are inferred as t-r1 and t-r2.',
        hasVisualization: true,
        tags: ['dp', 'matrix', 'two walkers', 'path'],
      },
      {
        id: 'coin-change-ways',
        title: 'Coin Change II - Number of Combinations',
        leetcodeNumber: 518,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array coins and an integer amount, return the number of combinations that make up the amount. You may use each coin an unlimited number of times. This is the classic unbounded knapsack counting variant. dp[i] = number of ways to make amount i. For each coin, we iterate through all amounts from coin to target and add dp[amount - coin] to dp[amount].',
        hasVisualization: true,
        tags: ['dp', 'unbounded knapsack', 'coin change', 'counting', 'combinations'],
      },
      {
        id: 'combination-sum-iv',
        title: 'Combination Sum IV',
        leetcodeNumber: 377,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of distinct positive integers nums and a target, return the number of ordered combinations (permutations) that sum to target. DP: dp[i] = sum of dp[i - num] for each num in nums where i >= num. Order matters so [1,2] and [2,1] count as different.',
        hasVisualization: true,
        tags: ['dynamic programming', 'combinatorics', 'permutation', 'unbounded knapsack'],
      },
      {
        id: 'count-different-palindromic-subsequences',
        title: 'Count Different Palindromic Subsequences',
        leetcodeNumber: 730,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a string s containing only characters "a", "b", "c", and "d", return the number of distinct palindromic subsequences in s modulo 10^9 + 7. The DP table dp[i][j] represents the count of distinct palindromic subsequences in s[i..j]. When s[i] equals s[j], we find the next and previous occurrences of that character inside the range to handle duplicates and avoid overcounting.',
        hasVisualization: true,
        tags: ['dp', 'string', 'palindrome', 'counting', 'modular arithmetic'],
      },
      {
        id: 'count-sorted-vowel-strings',
        title: 'Count Sorted Vowel Strings',
        leetcodeNumber: 1641,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of strings of length n consisting of vowels (a, e, i, o, u) in lexicographically sorted order. Uses DP where dp[i][j] = number of sorted strings of length i ending with the j-th vowel. Transition: dp[i][j] = sum of dp[i-1][k] for k <= j.',
        hasVisualization: true,
        tags: ['dynamic programming', 'math', 'combinatorics', 'string'],
      },
      {
        id: 'count-square-submatrices',
        title: 'Count Square Submatrices with All Ones',
        leetcodeNumber: 1277,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary matrix, return the number of square submatrices that contain all 1s. The key insight is that dp[i][j] represents the side length of the largest square whose bottom-right corner is at (i,j). This value also equals the number of squares that end at (i,j). The total count is the sum of all dp[i][j] values. When matrix[i][j] is 1, dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
        hasVisualization: true,
        tags: ['dp', 'matrix', 'square', 'counting'],
      },
      {
        id: 'count-vowels-permutation',
        title: 'Count Vowels Permutation',
        leetcodeNumber: 1220,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count strings of length n using only vowels (a, e, i, o, u) following these rules: after a, only e follows; after e, only a or i; after i, any vowel except i; after o, only i or u; after u, only a. Uses DP where dp[v] = number of valid strings of current length ending in vowel v.',
        hasVisualization: true,
        tags: ['dynamic programming', 'combinatorics', 'string'],
      },
      {
        id: 'counting-bits',
        title: 'Counting Bits',
        leetcodeNumber: 338,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer n, return an array ans of length n+1 such that ans[i] is the number of 1 bits in the binary representation of i. Uses DP: ans[i] = ans[i >> 1] + (i & 1). Each number has one fewer bit than half its value, plus a possible extra bit from the lowest position.',
        hasVisualization: true,
        tags: ['dynamic programming', 'bit manipulation', 'bottom-up'],
      },
      {
        id: 'counting-stairs-k-steps',
        title: 'Climbing Stairs with Up to K Steps',
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of distinct ways to climb n stairs when you can take between 1 and k steps at a time. This generalizes the classic climbing stairs problem. dp[i] = sum of dp[i-1] through dp[i-k] representing all possible last-step sizes.',
        hasVisualization: true,
        tags: ['dynamic programming', 'climbing stairs', 'combinatorics', 'generalization'],
      },
      {
        id: 'decode-ways-ii',
        title: 'Decode Ways II',
        leetcodeNumber: 639,
        difficulty: 'Hard' as Difficulty,
        description:
          'A message is decoded using letter-to-number mapping (A=1...Z=26). The character "*" can represent any digit 1-9. Given an encoded string s, return the number of ways to decode it modulo 10^9+7. Uses DP where each character can form a 1-digit or 2-digit code, accounting for wildcard expansions.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'wildcard', 'modular arithmetic'],
      },
      {
        id: 'delete-and-earn',
        title: 'Delete and Earn',
        leetcodeNumber: 740,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums, you can delete any number and earn nums[i] points. After deleting nums[i], all occurrences of nums[i]-1 and nums[i]+1 are also deleted. Return the maximum points you can earn. This reduces to a House Robber problem on a points-per-value array.',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'house robber variant'],
      },
      {
        id: 'distinct-subsequences',
        title: 'Distinct Subsequences',
        leetcodeNumber: 115,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given strings s and t, return the number of distinct subsequences of s which equals t. A DP table dp[i][j] counts the number of ways to form t[0..j-1] using s[0..i-1]. If characters match, we can either use s[i-1] (adding dp[i-1][j-1] ways) or skip it (adding dp[i-1][j] ways). If they do not match, we can only skip s[i-1].',
        hasVisualization: true,
        tags: ['dp', 'string', 'subsequence', 'counting'],
      },
      {
        id: 'domino-and-tromino-tiling',
        title: 'Domino and Tromino Tiling',
        leetcodeNumber: 790,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of ways to tile a 2 x n board using dominoes (2x1) and trominoes (L-shaped). The recurrence is dp[n] = 2*dp[n-1] + dp[n-3] for n >= 3. This accounts for placing a vertical domino, two horizontal dominoes, or two tromino configurations. Return result modulo 10^9+7.',
        hasVisualization: true,
        tags: ['dynamic programming', 'tiling', 'combinatorics', 'modular arithmetic'],
      },
      {
        id: 'dungeon-game',
        title: 'Dungeon Game',
        leetcodeNumber: 174,
        difficulty: 'Hard' as Difficulty,
        description:
          'A knight starts at the top-left of a dungeon grid and must reach the bottom-right to rescue the princess. Each cell contains a value (negative = demon damage, positive = health orb). Find the minimum initial health the knight needs to survive. We fill the DP table from bottom-right to top-left. dp[i][j] is the minimum health needed entering cell (i,j). At each cell, we need max(1, dp[next] - dungeon[i][j]).',
        hasVisualization: true,
        tags: ['dp', 'matrix', 'reverse dp', 'path'],
      },
      {
        id: 'egg-drop-problem',
        title: 'Super Egg Drop',
        leetcodeNumber: 887,
        difficulty: 'Hard' as Difficulty,
        description:
          'You have k eggs and a building with n floors. Find the minimum number of moves to determine the critical floor f such that an egg dropped from above f always breaks and from at or below never breaks. The DP approach here uses dp[m][k] = the maximum number of floors we can check with m moves and k eggs. We increment moves until dp[m][k] >= n.',
        hasVisualization: true,
        tags: ['dp', 'binary search', 'egg drop', 'decision making'],
      },
      {
        id: 'fibonacci-number',
        title: 'Fibonacci Number',
        leetcodeNumber: 509,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given n, return the nth Fibonacci number. F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1. Bottom-up DP fills a table iteratively, avoiding repeated subproblem computation.',
        hasVisualization: true,
        tags: ['dynamic programming', 'math', 'memoization', 'bottom-up'],
      },
      {
        id: 'freedom-trail',
        title: 'Freedom Trail',
        leetcodeNumber: 514,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a circular ring of characters and a key string, find the minimum number of steps (rotations + button presses) to spell the key. At each step, rotate the ring clockwise or counterclockwise to align a character with 12 o clock, then press the button. Uses DP where dp[i][j] = min steps to spell key[i..] when ring[j] is currently aligned.',
        hasVisualization: true,
        tags: ['dynamic programming', 'depth-first search', 'string'],
      },
      {
        id: 'frog-jump',
        title: 'Frog Jump',
        leetcodeNumber: 403,
        difficulty: 'Hard' as Difficulty,
        description:
          'A frog wants to cross a river by jumping on stones. If the frog made its last jump of k units, it may jump k-1, k, or k+1 units next. Determine if the frog can reach the last stone. Uses a hash map of sets: for each stone, track all possible jump sizes that can reach it.',
        hasVisualization: true,
        tags: ['dynamic programming', 'hash map', 'depth-first search'],
      },
      {
        id: 'integer-break',
        title: 'Integer Break',
        leetcodeNumber: 343,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer n, break it into the sum of at least two positive integers and maximize the product of those integers. For each value i, try splitting off each j from 1 to i-1 and take the best product between j*(i-j) and j*dp[i-j].',
        hasVisualization: true,
        tags: ['dynamic programming', 'math', 'optimization'],
      },
      {
        id: 'jump-game-ii',
        title: 'Jump Game II',
        leetcodeNumber: 45,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array nums where nums[i] is the maximum jump length from index i, return the minimum number of jumps to reach the last index. Greedy/DP approach: track current reach boundary and farthest reachable position, incrementing jumps whenever the boundary is crossed.',
        hasVisualization: true,
        tags: ['dynamic programming', 'greedy', 'array', 'BFS-like'],
      },
      {
        id: 'knight-dialer',
        title: 'Knight Dialer',
        leetcodeNumber: 935,
        difficulty: 'Medium' as Difficulty,
        description:
          'A chess knight starts on any digit of a phone keypad (0-9) and makes exactly n-1 knight moves. Count the distinct phone numbers that can be dialed. The keypad is 3x4 with digits 0-9 and * and # (knight cannot land on * or #). DP tracks counts per digit at each step.',
        hasVisualization: true,
        tags: ['dynamic programming', 'chess', 'combinatorics', 'modular arithmetic'],
      },
      {
        id: 'last-stone-weight-ii',
        title: 'Last Stone Weight II',
        leetcodeNumber: 1049,
        difficulty: 'Medium' as Difficulty,
        description:
          'Partition stones into two groups to minimize the absolute difference of their sums. Equivalent to finding the subset sum closest to total/2. Uses a boolean DP set: for each stone, update reachable sums. Answer is total - 2 * (best reachable sum <= total/2).',
        hasVisualization: true,
        tags: ['dynamic programming', 'subset sum', 'array', 'knapsack'],
      },
      {
        id: 'longest-arithmetic-subsequence-of-given-diff',
        title: 'Longest Arithmetic Subsequence of Given Difference',
        leetcodeNumber: 1218,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array arr and an integer difference, find the length of the longest subsequence in arr which is an arithmetic sequence where the difference between adjacent elements equals the given difference. Use a hash map dp where dp[v] = length of the longest arithmetic subsequence ending with value v. For each number, dp[num] = dp[num - difference] + 1.',
        hasVisualization: true,
        tags: ['dp', 'hash map', 'arithmetic', 'subsequence', 'greedy'],
      },
      {
        id: 'longest-arithmetic-subsequence',
        title: 'Longest Arithmetic Subsequence',
        leetcodeNumber: 1027,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums, return the length of the longest arithmetic subsequence in nums. An arithmetic sequence has equal differences between consecutive elements. For each pair (i, j) where i < j, compute the difference diff = nums[j] - nums[i]. Use dp[i] as a hash map where dp[i][diff] = length of the longest arithmetic subsequence ending at index i with common difference diff.',
        hasVisualization: true,
        tags: ['dp', 'hash map', 'arithmetic', 'subsequence'],
      },
      {
        id: 'longest-common-substring',
        title: 'Longest Common Substring',
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two strings, find the length (and content) of the longest common substring. Unlike subsequence, a substring must be contiguous. The DP table dp[i][j] represents the length of the longest common substring ending at s1[i-1] and s2[j-1]. When characters match we extend from dp[i-1][j-1]; when they do not match the streak resets to 0. We track the maximum seen value and the position to reconstruct the substring.',
        hasVisualization: true,
        tags: ['dp', 'string', 'substring', 'classic'],
      },
      {
        id: 'longest-ideal-subsequence',
        title: 'Longest Ideal Subsequence',
        leetcodeNumber: 2370,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the longest ideal subsequence of a string where consecutive characters differ by at most k in absolute ASCII value. Uses DP: for each character, look back at all 26 letters within distance k and take the best. dp[c] = longest ideal subsequence ending with character c.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'greedy'],
      },
      {
        id: 'longest-palindrome-by-concatenating-two-letter-words',
        title: 'Longest Palindrome by Concatenating Two-Letter Words',
        leetcodeNumber: 2131,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of two-letter words, form the longest palindrome by concatenating some of them. A pair like "ab" and "ba" can be placed symmetrically. Words like "aa" (palindromes themselves) can be placed in pairs, with at most one placed in the center. Count pairs greedily using a frequency map.',
        hasVisualization: true,
        tags: ['dynamic programming', 'greedy', 'hash map', 'string'],
      },
      {
        id: 'longest-palindromic-subsequence',
        title: 'Longest Palindromic Subsequence',
        leetcodeNumber: 516,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s, find the length of the longest palindromic subsequence in s. A subsequence is a sequence derived by deleting some or no characters without changing the relative order. The DP approach compares the string against its reverse: dp[i][j] is the length of the longest palindromic subsequence in s[i..j]. If characters match, extend by 2; otherwise take the max of two subproblems.',
        hasVisualization: true,
        tags: ['dp', 'string', 'palindrome', 'subsequence'],
      },
      {
        id: 'longest-path-with-different-adjacent-chars',
        title: 'Longest Path With Different Adjacent Characters',
        leetcodeNumber: 2246,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a tree rooted at node 0 with character labels on each node, find the longest path such that no two adjacent nodes have the same character. Uses DFS with DP: for each node, compute the longest chain going downward through children with different chars. The answer is the sum of the two longest such chains plus 1.',
        hasVisualization: true,
        tags: ['dynamic programming', 'tree', 'depth-first search', 'string'],
      },
      {
        id: 'longest-turbulent-subarray',
        title: 'Longest Turbulent Subarray',
        leetcodeNumber: 978,
        difficulty: 'Medium' as Difficulty,
        description:
          'A subarray is turbulent if the comparison sign strictly alternates between each adjacent pair. Given integer array arr, return the length of the maximum turbulent subarray. Track inc (ends with increase) and dec (ends with decrease) DP values to handle both alternating directions.',
        hasVisualization: true,
        tags: ['dynamic programming', 'sliding window', 'array'],
      },
      {
        id: 'matrix-chain-multiplication',
        title: 'Matrix Chain Multiplication',
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a chain of matrices, find the most efficient way to multiply them together. The DP table dp[i][j] represents the minimum number of scalar multiplications needed to compute the product of matrices from i to j. For each chain length, we try every possible split point k and pick the one minimizing total cost. The cost of multiplying A[i..k] by A[k+1..j] is dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1].',
        hasVisualization: true,
        tags: ['dp', 'matrix', 'interval dp', 'optimization'],
      },
      {
        id: 'maximal-rectangle-dp',
        title: 'Maximal Rectangle (DP Approach)',
        leetcodeNumber: 85,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a binary matrix of 0s and 1s, find the largest rectangle containing only 1s. The DP approach computes for each cell the height (consecutive 1s above including current row), left boundary (leftmost index of continuous 1s at this height), and right boundary. Area at each cell = (right - left) * height. We update these three DP arrays row by row.',
        hasVisualization: true,
        tags: ['dp', 'matrix', 'rectangle', 'histogram'],
      },
      {
        id: 'maximal-square-ii',
        title: 'Maximal Square (Tracking Approach)',
        leetcodeNumber: 221,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary matrix filled with 0s and 1s, find the largest square containing only 1s and return its area. This tracking approach uses a DP table where dp[i][j] represents the side length of the largest square whose bottom-right corner is at cell (i, j). For each cell containing 1, the value is 1 plus the minimum of the three neighboring DP values (top, left, top-left).',
        hasVisualization: true,
        tags: ['dp', 'matrix', 'square', '2d dp'],
      },
      {
        id: 'maximum-length-of-repeated-subarray',
        title: 'Maximum Length of Repeated Subarray',
        leetcodeNumber: 718,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two integer arrays nums1 and nums2, return the maximum length of a subarray that appears in both arrays. Uses a 2D DP table where dp[i][j] is the length of the longest common subarray ending at nums1[i-1] and nums2[j-1]. If elements match, extend from dp[i-1][j-1].',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', '2D DP', 'subarray'],
      },
      {
        id: 'maximum-profit-in-job-scheduling',
        title: 'Maximum Profit in Job Scheduling',
        leetcodeNumber: 1235,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n jobs with start times, end times, and profits, select non-overlapping jobs to maximize total profit. Sort jobs by end time, then use DP: dp[i] = max profit considering first i jobs. For each job, choose to take it (add its profit + best profit from jobs ending before it starts) or skip it.',
        hasVisualization: true,
        tags: ['dynamic programming', 'binary search', 'sorting', 'interval scheduling'],
      },
      {
        id: 'maximum-sum-circular-subarray',
        title: 'Maximum Sum Circular Subarray',
        leetcodeNumber: 918,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a circular integer array nums, return the maximum possible sum of a non-empty subarray. Key insight: the maximum circular subarray sum equals either the maximum subarray sum (Kadane) OR the total sum minus the minimum subarray sum (wrapping around). Handle the all-negative case specially.',
        hasVisualization: true,
        tags: ['dynamic programming', 'Kadane', 'circular array', 'divide and conquer'],
      },
      {
        id: 'min-cost-climbing-stairs-ii',
        title: 'Min Cost Climbing Stairs (Detailed)',
        leetcodeNumber: 746,
        difficulty: 'Easy' as Difficulty,
        description:
          'You are given an integer array cost where cost[i] is the cost of the ith step. Once you pay the cost you can climb one or two steps. You can start from index 0 or 1. Return the minimum cost to reach the top of the floor (beyond the last step). This detailed version tracks the optimal decision at each step.',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'bottom-up'],
      },
      {
        id: 'minimum-ascii-delete-sum',
        title: 'Minimum ASCII Delete Sum for Two Strings',
        leetcodeNumber: 712,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two strings s1 and s2, return the lowest ASCII sum of deleted characters to make both strings equal. A DP table is built where dp[i][j] represents the minimum delete sum to make s1[0..i-1] equal to s2[0..j-1]. When characters match, no deletion is needed; otherwise we pick the cheaper deletion from either string.',
        hasVisualization: true,
        tags: ['dp', 'string', 'lcs variant', 'ascii'],
      },
      {
        id: 'minimum-cost-for-tickets',
        title: 'Minimum Cost For Tickets',
        leetcodeNumber: 983,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given travel days and ticket costs for 1-day, 7-day, and 30-day passes, find the minimum cost to travel on all given days. Uses DP over each day of the year: dp[i] = min cost to cover travel through day i. On non-travel days, cost equals previous day. On travel days, pick the cheapest of the three passes.',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'greedy'],
      },
      {
        id: 'minimum-difficulty-of-job-schedule',
        title: 'Minimum Difficulty of a Job Schedule',
        leetcodeNumber: 1335,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n jobs with difficulties and d days, schedule at least one job per day. The difficulty of a day equals the hardest job done that day. Minimize the total difficulty across all days. Uses 2D DP: dp[day][i] = min difficulty using first i jobs over given number of days. Must complete jobs in order.',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'scheduling'],
      },
      {
        id: 'minimum-falling-path-sum',
        title: 'Minimum Falling Path Sum',
        leetcodeNumber: 931,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an n x n matrix, return the minimum sum of any falling path (one element per row, adjacent columns allowed). Process row by row: for each cell, dp[j] = matrix[row][j] + min(prev[j-1], prev[j], prev[j+1]). This is a 1D DP per row approach.',
        hasVisualization: true,
        tags: ['dynamic programming', 'matrix', 'path', '1D DP per row'],
      },
      {
        id: 'minimum-insertion-steps-to-make-palindrome',
        title: 'Minimum Insertion Steps to Make a String Palindrome',
        leetcodeNumber: 1312,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a string s, find the minimum number of characters to insert to make it a palindrome. Key insight: the minimum insertions equals n minus the length of the longest palindromic subsequence. The DP table dp[i][j] represents the minimum insertions needed to make s[i..j] a palindrome. If endpoints match, no insertion needed for them; otherwise take min of inserting at either end plus 1.',
        hasVisualization: true,
        tags: ['dp', 'string', 'palindrome', 'insertion'],
      },
      {
        id: 'minimum-number-of-refueling-stops',
        title: 'Minimum Number of Refueling Stops',
        leetcodeNumber: 871,
        difficulty: 'Hard' as Difficulty,
        description:
          'A car starts at position 0 with startFuel and must reach target. Gas stations are along the road with fuel amounts. Find the minimum number of stops to reach target. Greedy approach: always refuel at the highest-fuel station seen so far when you run out. Uses a max-heap of past stations.',
        hasVisualization: true,
        tags: ['dynamic programming', 'greedy', 'heap', 'priority queue'],
      },
      {
        id: 'minimum-score-triangulation',
        title: 'Minimum Score Triangulation of Polygon',
        leetcodeNumber: 1039,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a convex polygon with n vertices, triangulate it into n-2 triangles. The score of a triangulation is the sum of products of the values at the three vertices of each triangle. Find the minimum total score. This is an interval DP problem: dp[i][j] = minimum score to triangulate the sub-polygon from vertex i to j. For each vertex k between i and j, we pick it as the apex of the triangle (i, k, j) and recurse on both sub-polygons.',
        hasVisualization: true,
        tags: ['dp', 'interval dp', 'polygon', 'triangulation'],
      },
      {
        id: 'number-of-dice-rolls-with-target-sum',
        title: 'Number of Dice Rolls With Target Sum',
        leetcodeNumber: 1155,
        difficulty: 'Medium' as Difficulty,
        description:
          'You have n dice each with k faces (numbered 1 to k). Return the number of possible ways to roll the dice so the sum of the face-up numbers equals target. Result is modulo 10^9 + 7. The DP state dp[i][s] represents the number of ways to get sum s using i dice. For each die and each face value, we accumulate the previous counts: dp[i][s] = sum of dp[i-1][s-f] for f from 1 to k.',
        hasVisualization: true,
        tags: ['dp', 'counting', 'dice', 'modular arithmetic'],
      },
      {
        id: 'number-of-longest-increasing-subsequence',
        title: 'Number of Longest Increasing Subsequences',
        leetcodeNumber: 673,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array nums, return the number of longest increasing subsequences. Maintain two DP arrays: len[i] is the length of the LIS ending at index i, and cnt[i] is the count of such subsequences. If a longer LIS is found update len and reset cnt; if equal length, add to cnt.',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'LIS', 'counting'],
      },
      {
        id: 'number-of-music-playlists',
        title: 'Number of Music Playlists',
        leetcodeNumber: 920,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count playlists of length goal using n unique songs, where each song is played at least once and a song can only be replayed after k other songs have played. Uses DP: dp[i][j] = number of playlists of length i using exactly j unique songs. Transitions: add a new song (n-j+1 choices) or replay an old one (max(j-k, 0) choices). Answer is modulo 10^9+7.',
        hasVisualization: true,
        tags: ['dynamic programming', 'combinatorics', 'modular arithmetic'],
      },
      {
        id: 'number-of-ways-to-arrive-at-destination',
        title: 'Number of Ways to Arrive at Destination',
        leetcodeNumber: 1976,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of shortest paths from node 0 to node n-1 in a weighted undirected graph. Run Dijkstra to find shortest distances, then count paths using DP: ways[v] = sum of ways[u] for all edges u->v on a shortest path. Answer is modulo 10^9+7.',
        hasVisualization: true,
        tags: ['dynamic programming', 'dijkstra', 'graph', 'shortest path'],
      },
      {
        id: 'ones-and-zeroes',
        title: 'Ones and Zeroes',
        leetcodeNumber: 474,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of binary strings strs, and two integers m and n, return the size of the largest subset of strs such that there are at most m 0s and n 1s in the subset. This is a 2D 0/1 knapsack problem: dp[i][j] = largest subset using at most i zeros and j ones. For each string, count its zeros and ones, then update the DP table backwards to avoid using the same string twice.',
        hasVisualization: true,
        tags: ['dp', '2d knapsack', '0/1 knapsack', 'binary strings'],
      },
      {
        id: 'out-of-boundary-paths',
        title: 'Out of Boundary Paths',
        leetcodeNumber: 576,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an m x n grid, a ball starts at position (startRow, startCol). You can move the ball in one of the four directions. Find the number of paths that move the ball out of the boundary in exactly maxMove moves. The DP state dp[move][r][c] is the number of ways to be at cell (r,c) after exactly "move" moves. We sum contributions to neighbors each step, counting exits from the grid.',
        hasVisualization: true,
        tags: ['dp', 'matrix', 'path counting', 'modular arithmetic'],
      },
      {
        id: 'paint-fence',
        title: 'Paint Fence',
        leetcodeNumber: 276,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n fence posts and k colors, count the number of ways to paint them such that no more than 2 adjacent posts have the same color. Track two DP values: same (last two posts match) and diff (last two posts differ). At each step, diff = (k-1) * (same + diff), same = diff from previous step.',
        hasVisualization: true,
        tags: ['dynamic programming', 'combinatorics', 'counting'],
      },
      {
        id: 'paint-house-ii',
        title: 'Paint House II',
        leetcodeNumber: 265,
        difficulty: 'Hard' as Difficulty,
        description:
          'There are n houses in a row and k colors to paint them. The cost of painting each house with a certain color is given. No two adjacent houses may have the same color. Find the minimum cost to paint all houses. Uses DP with O(nk) time by tracking the minimum and second minimum from the previous row.',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'dp optimization'],
      },
      {
        id: 'palindromic-substrings',
        title: 'Palindromic Substrings',
        leetcodeNumber: 647,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string s, return the number of palindromic substrings in it. A substring is a contiguous sequence of characters within the string. The DP approach uses a 2D boolean table where dp[i][j] is true if s[i..j] is a palindrome. Single characters are always palindromes, pairs are palindromes when characters match, and longer substrings are palindromes when the endpoints match and the inner substring is a palindrome.',
        hasVisualization: true,
        tags: ['dp', 'string', 'palindrome', 'substring'],
      },
      {
        id: 'profitable-schemes',
        title: 'Profitable Schemes',
        leetcodeNumber: 879,
        difficulty: 'Hard' as Difficulty,
        description:
          'There are n gang members and a list of crimes. Each crime requires a certain number of members and generates a certain profit. Count the number of subsets of crimes (schemes) such that the total members used is at most n and the total profit is at least minProfit. The 3D DP approach: dp[k][members][profit] = number of ways using k crimes with at most "members" members and exactly "profit" profit. We cap profit at minProfit to avoid unbounded dimensions.',
        hasVisualization: true,
        tags: ['dp', '3d dp', 'knapsack', 'counting', 'modular arithmetic'],
      },
      {
        id: 'rod-cutting',
        title: 'Rod Cutting',
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a rod of length n and a table of prices for each length from 1 to n, find the maximum revenue obtainable by cutting the rod and selling the pieces. This is a classic unbounded knapsack problem. dp[i] represents the maximum revenue from a rod of length i. For each length i, we try all possible first cuts of length j and keep the one that yields maximum total revenue.',
        hasVisualization: true,
        tags: ['dp', 'unbounded knapsack', 'greedy comparison', 'optimization'],
      },
      {
        id: 'scramble-string',
        title: 'Scramble String',
        leetcodeNumber: 87,
        difficulty: 'Hard' as Difficulty,
        description:
          'We use a binary tree to scramble a string s1: pick a non-leaf node, optionally swap its two children, and recurse. Given two strings s1 and s2, determine if s2 is a scrambled version of s1. The 3D DP solution uses dp[len][i][j] = true if s2[j..j+len-1] is a scramble of s1[i..i+len-1]. For each split point k, check both the swapped and non-swapped cases.',
        hasVisualization: true,
        tags: ['dp', 'string', 'recursion', '3d dp'],
      },
      {
        id: 'shortest-common-supersequence',
        title: 'Shortest Common Supersequence',
        leetcodeNumber: 1092,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given two strings str1 and str2, return the shortest string that has both str1 and str2 as subsequences. The length of the shortest common supersequence (SCS) equals len(str1) + len(str2) - LCS(str1, str2). We first compute the LCS table, then backtrack to reconstruct the SCS string by including shared characters once and non-shared characters from both strings.',
        hasVisualization: true,
        tags: ['dp', 'string', 'lcs', 'supersequence'],
      },
      {
        id: 'strange-printer',
        title: 'Strange Printer',
        leetcodeNumber: 664,
        difficulty: 'Hard' as Difficulty,
        description:
          'A strange printer can only print a sequence of the same character in one turn and can start a new turn from any position. Find the minimum number of turns to print a given string. Uses interval DP where dp[i][j] = min turns to print s[i..j]. Key insight: if s[i]==s[k], we can merge turns.',
        hasVisualization: true,
        tags: ['dynamic programming', 'interval dp', 'string'],
      },
      {
        id: 'student-attendance-record-ii',
        title: 'Student Attendance Record II',
        leetcodeNumber: 552,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count the number of attendance records of length n that make a student eligible for an award. A record is eligible if it has at most one "A" (Absent) and no more than two consecutive "L" (Late). Uses DP with states tracking absences and trailing lates. Answer is modulo 10^9+7.',
        hasVisualization: true,
        tags: ['dynamic programming', 'combinatorics', 'modular arithmetic'],
      },
      {
        id: 'super-egg-drop',
        title: 'Super Egg Drop',
        leetcodeNumber: 887,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given k eggs and n floors, find the minimum number of moves to determine the critical floor with certainty. Optimized approach: dp[m][k] = max floors we can check with m moves and k eggs. We find the minimum m such that dp[m][k] >= n. This avoids the O(kn^2) naive DP and runs in O(k log n) time.',
        hasVisualization: true,
        tags: ['dynamic programming', 'binary search', 'math'],
      },
      {
        id: 'tallest-billboard-dp',
        title: 'Tallest Billboard (Meet in Middle)',
        leetcodeNumber: 956,
        difficulty: 'Hard' as Difficulty,
        description:
          'Alternative approach to the tallest billboard problem using meet-in-middle. Split the rods into two halves. For each half, enumerate all subsets: assign each rod to left support (+), right support (-), or neither (0). For each state, record the maximum sum of left+right. Then combine halves: for left state diff d and right state diff -d, the answer is leftMax[d] + rightMax[-d].',
        hasVisualization: true,
        tags: ['dynamic programming', 'meet in middle', 'subset enumeration'],
      },
      {
        id: 'tallest-billboard',
        title: 'Tallest Billboard',
        leetcodeNumber: 956,
        difficulty: 'Hard' as Difficulty,
        description:
          'You have a collection of steel rods. Weld some into two supports of equal height to hold a billboard. Find the largest possible height. Uses DP where dp[diff] = maximum height of the taller support when the difference between supports is "diff". For each rod, update states by adding it to taller, shorter, or neither support.',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'subset sum'],
      },
      {
        id: 'tribonacci-number',
        title: 'N-th Tribonacci Number',
        leetcodeNumber: 1137,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given n, return the nth Tribonacci number. T(0) = 0, T(1) = 1, T(2) = 1, and T(n) = T(n-1) + T(n-2) + T(n-3) for n >= 3. Bottom-up DP fills the table from left to right, each value depending on the three preceding values.',
        hasVisualization: true,
        tags: ['dynamic programming', 'math', 'bottom-up'],
      },
      {
        id: 'ugly-number-ii-dp',
        title: 'Ugly Number II (DP)',
        leetcodeNumber: 264,
        difficulty: 'Medium' as Difficulty,
        description:
          'An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given n, return the nth ugly number. Use three pointers p2, p3, p5 advancing through the DP array. At each step the next ugly number is the minimum of dp[p2]*2, dp[p3]*3, dp[p5]*5.',
        hasVisualization: true,
        tags: ['dynamic programming', 'math', 'heap alternative', 'three pointers'],
      },
      {
        id: 'uncrossed-lines',
        title: 'Uncrossed Lines',
        leetcodeNumber: 1035,
        difficulty: 'Medium' as Difficulty,
        description:
          'Connect equal numbers in two arrays with lines that do not cross. The maximum number of non-crossing connections is exactly the Longest Common Subsequence (LCS) of the two arrays. Uses standard 2D DP: dp[i][j] = LCS of nums1[0..i] and nums2[0..j].',
        hasVisualization: true,
        tags: ['dynamic programming', 'LCS', 'array'],
      },
      {
        id: 'video-stitching',
        title: 'Video Stitching',
        leetcodeNumber: 1024,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given video clips and a target duration T, find the minimum number of clips needed to cover [0, T]. Uses a greedy interval covering approach: at each step, among all clips that start at or before the current coverage end, pick the one that extends coverage the furthest.',
        hasVisualization: true,
        tags: ['dynamic programming', 'greedy', 'interval', 'array'],
      },
      {
        id: 'where-will-ball-fall',
        title: 'Where Will the Ball Fall',
        leetcodeNumber: 1706,
        difficulty: 'Medium' as Difficulty,
        description:
          'A 2D grid has deflectors: 1 means deflect right-down and -1 means deflect left-down. Drop a ball from each column and determine where it exits at the bottom, or -1 if it gets stuck. Simulate each ball: if deflectors form a V-shape or hit a wall, the ball is stuck. Track column position row by row.',
        hasVisualization: true,
        tags: ['dynamic programming', 'simulation', 'array', 'matrix'],
      },
      {
        id: 'wiggle-subsequence',
        title: 'Wiggle Subsequence',
        leetcodeNumber: 376,
        difficulty: 'Medium' as Difficulty,
        description:
          'A wiggle sequence is one where differences between successive numbers strictly alternate between positive and negative. Given nums, return the length of the longest wiggle subsequence. Track two DP values: up (ends with upward wiggle) and down (ends with downward wiggle).',
        hasVisualization: true,
        tags: ['dynamic programming', 'greedy', 'array'],
      },
    
      {
        id: 'allocate-mailboxes',
        title: 'Allocate Mailboxes',
        leetcodeNumber: 1478,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given house positions and k mailboxes, place mailboxes to minimize total distance from each house to its nearest mailbox. The optimal mailbox for a group of houses is the median house. Uses interval DP: cost[i][j] = min distance placing one mailbox for houses i..j (place at median).',
        hasVisualization: true,
        tags: ['dynamic programming', 'math', 'sorting', 'median'],
      },
      {
        id: 'best-team-no-conflicts-dp',
        title: 'Best Team With No Conflicts (DP)',
        leetcodeNumber: 1626,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given scores and ages of players, find the highest score team with no conflicts (no younger player has higher score than older). Sort by age then score, then apply LIS-style DP where dp[i] = max score selecting players up to i where player i is included.',
        hasVisualization: true,
        tags: ['dynamic programming', 'sorting', 'lis', 'greedy'],
      },
      {
        id: 'bomb-enemy',
        title: 'Bomb Enemy',
        leetcodeNumber: 361,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a 2D grid with W (walls), E (enemies), and 0 (empty cells), find the empty cell where placing one bomb kills the most enemies. A bomb kills all enemies in the same row and column until blocked by a wall. Use DP to precompute row counts (reset on walls) and column counts.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'counting'],
      },
      {
        id: 'boolean-evaluation',
        title: 'Boolean Evaluation',
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a boolean expression string with symbols (0,1) and operators (&,|,^), count the number of ways to parenthesize the expression so it evaluates to true. Uses interval DP: dp[i][j][true/false] = number of ways the sub-expression from symbol i to symbol j evaluates to true/false.',
        hasVisualization: true,
        tags: ['dynamic programming', 'interval dp', 'string', 'combinatorics'],
      },
      {
        id: 'burst-balloons-dp',
        title: 'Burst Balloons (DP)',
        leetcodeNumber: 312,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n balloons each with a number, burst all balloons to maximize coins. Bursting balloon i gives nums[i-1]*nums[i]*nums[i+1] coins. Uses interval DP: dp[i][j] = max coins from bursting all balloons between i and j (exclusive). Think of k as the LAST balloon to burst in the range.',
        hasVisualization: true,
        tags: ['dynamic programming', 'interval dp', 'divide and conquer'],
      },
      {
        id: 'can-i-win',
        title: 'Can I Win',
        leetcodeNumber: 464,
        difficulty: 'Medium' as Difficulty,
        description:
          'Two players take turns choosing integers from 1 to maxChoosable without replacement. The player who reaches or exceeds desiredTotal first wins. Uses bitmask DP to track which numbers have been chosen. memo[mask] = whether current player wins with the given set of used numbers.',
        hasVisualization: true,
        tags: ['dynamic programming', 'bitmask', 'game theory', 'memoization'],
      },
      {
        id: 'cherry-pickup-dp',
        title: 'Cherry Pickup (DP)',
        leetcodeNumber: 741,
        difficulty: 'Hard' as Difficulty,
        description:
          'In an n x n grid with cherries (1), empty cells (0), and thorns (-1), find the max cherries you can collect going from (0,0) to (n-1,n-1) and back. Equivalent to two simultaneous paths from (0,0) to (n-1,n-1). Uses 3D DP on the step count t and two column positions c1,c2.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'two paths', 'dp 3d'],
      },
      {
        id: 'cherry-pickup-ii',
        title: 'Cherry Pickup II',
        leetcodeNumber: 1463,
        difficulty: 'Hard' as Difficulty,
        description:
          'Two robots start at the top-left and top-right corners of a grid. They move down one row at a time, each moving to one of three columns (left, same, right). Collect cherries from cells they visit; if both land on the same cell, count cherries only once. Find the maximum cherries collected by both robots together.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', '3d dp', 'simulation'],
      },
      {
        id: 'count-different-palindromic-subsequences-dp',
        title: 'Count Different Palindromic Subsequences (DP)',
        leetcodeNumber: 730,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a string s containing only a, b, c, d, count the number of distinct non-empty palindromic subsequences. The result should be returned modulo 10^9 + 7. Uses interval DP where dp[i][j] is the count of distinct palindromic subsequences in s[i..j].',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'palindrome', 'interval dp'],
      },
      {
        id: 'count-paths-in-matrix',
        title: 'Count All Paths in Grid',
        difficulty: 'Medium' as Difficulty,
        description:
          'Count all paths from top-left to bottom-right of a grid, moving only right or down. This classic DP problem fills a table where dp[r][c] equals the number of ways to reach cell (r,c) from the top-left corner. The answer is dp[rows-1][cols-1].',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'combinatorics', 'classic'],
      },
      {
        id: 'count-square-submatrices-dp',
        title: 'Count Square Submatrices with All Ones (DP)',
        leetcodeNumber: 1277,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the total number of square submatrices that contain all ones. Use DP where dp[r][c] represents the side length of the largest square whose bottom-right corner is (r,c). A cell with value 1 contributes dp[r][c] to the total count (one square of each size from 1 to dp[r][c]).',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'matrix', 'squares', 'counting'],
      },
      {
        id: 'count-submatrices-with-all-ones',
        title: 'Count Submatrices With All Ones',
        leetcodeNumber: 1504,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary matrix, count the number of submatrices that contain all ones. For each cell, compute the number of consecutive 1s ending at that cell going upward (height), then for each row sweep left to count valid rectangles using a histogram approach.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'matrix', 'counting'],
      },
      {
        id: 'count-the-repetitions',
        title: 'Count the Repetitions',
        leetcodeNumber: 466,
        difficulty: 'Hard' as Difficulty,
        description:
          'Define str = [s, n] as string s repeated n times. Find the maximum m such that [s2, m] can be obtained from [s1, n1] by deleting characters. Simulate matching s2 in n1 copies of s1 and detect cycles to avoid full simulation.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'simulation', 'cycle detection'],
      },
      {
        id: 'delete-operation-for-two-strings',
        title: 'Delete Operation for Two Strings',
        leetcodeNumber: 583,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two strings word1 and word2, return the minimum number of steps required to make word1 and word2 the same. In each step you can delete exactly one character in either string. The answer equals len(word1) + len(word2) - 2 * LCS(word1, word2).',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'lcs'],
      },
      {
        id: 'distinct-subsequences-dp',
        title: 'Distinct Subsequences (DP)',
        leetcodeNumber: 115,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given strings s and t, return the number of distinct subsequences of s that equal t. dp[i][j] = number of ways to form t[0..j-1] from s[0..i-1]. When s[i-1]==t[j-1], we can use or skip the match: dp[i][j] = dp[i-1][j-1] + dp[i-1][j].',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'subsequence', 'counting'],
      },
      {
        id: 'dungeon-game-dp',
        title: 'Dungeon Game (DP)',
        leetcodeNumber: 174,
        difficulty: 'Hard' as Difficulty,
        description:
          'A knight must rescue a princess in a dungeon grid. Each room has a value (negative = demon damage, positive = magic orb health). Find the minimum initial health the knight needs to reach bottom-right alive (health always >= 1). Solve bottom-up DP from the princess room back to the start.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'backward dp', 'optimization'],
      },
      {
        id: 'edit-distance-dp',
        title: 'Edit Distance (DP Visualization)',
        leetcodeNumber: 72,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) to convert word1 to word2. Classic 2D DP: dp[i][j] = min edits to convert word1[0..i-1] to word2[0..j-1]. When characters match, no new cost; otherwise take 1 + min of insert/delete/replace.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'edit distance', 'levenshtein'],
      },
      {
        id: 'encode-string-with-shortest-length',
        title: 'Encode String with Shortest Length',
        leetcodeNumber: 471,
        difficulty: 'Hard' as Difficulty,
        description:
          'Encode a string to its shortest representation using the format k[encoded_string] where encoded_string is repeated k times. Uses interval DP: dp[i][j] = shortest encoding of s[i..j]. For each substring, try all splits and check if the string has a repeating pattern.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'interval dp', 'encoding'],
      },
      {
        id: 'flip-game-ii',
        title: 'Flip Game II',
        leetcodeNumber: 294,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string of + and - characters, two players take turns flipping ',
        hasVisualization: true,
        tags: ['dynamic programming', 'game theory', 'memoization', 'backtracking'],
      },
      {
        id: 'freedom-trail-dp',
        title: 'Freedom Trail (DP)',
        leetcodeNumber: 514,
        difficulty: 'Hard' as Difficulty,
        description:
          'A ring displays characters and you rotate it to align with a key pointer, then press to spell a keyword character by character. Find the minimum steps (rotations + button presses). Uses DP: dp[i][j] = min steps to spell key[i..] when ring is currently at position j. Precompute positions of each character.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'bfs', 'greedy'],
      },
      {
        id: 'gold-mine-problem',
        title: 'Gold Mine Problem',
        difficulty: 'Medium' as Difficulty,
        description:
          'A miner starts at any cell in the first column and can move right, right-up, or right-down at each step. Find the maximum gold that can be collected. Use DP processed column by column: dp[r][c] = max gold collectible when standing at (r,c). The answer is the maximum in the last column.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'classic', 'path'],
      },
      {
        id: 'guess-number-higher-or-lower-ii',
        title: 'Guess Number Higher or Lower II',
        leetcodeNumber: 375,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the minimum amount of money needed to guarantee a win in the number guessing game from 1 to n. If you guess wrong you pay the guess amount. dp[i][j] = min cost to guarantee finding the number in range [i,j]. For each pivot k, you pay k plus the worst case of the two sides.',
        hasVisualization: true,
        tags: ['dynamic programming', 'game theory', 'minimax', 'interval dp'],
      },
      {
        id: 'interleaving-string-dp',
        title: 'Interleaving String (DP)',
        leetcodeNumber: 97,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given strings s1, s2, s3, determine whether s3 is formed by interleaving s1 and s2. dp[i][j] = true if s3[0..i+j-1] can be formed by interleaving s1[0..i-1] and s2[0..j-1]. Transition uses last char from s1 or s2.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'interleaving'],
      },
      {
        id: 'knight-probability-in-chessboard',
        title: 'Knight Probability in Chessboard',
        leetcodeNumber: 688,
        difficulty: 'Medium' as Difficulty,
        description:
          'A knight starts at (row, col) on an n x n chessboard and makes exactly k moves. At each step it has 8 possible knight moves, each equally likely. Find the probability that it stays on the board after all k moves. Use DP where dp[r][c] = probability of being at (r,c) after some number of moves.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'probability', 'chess'],
      },
      {
        id: 'largest-plus-sign',
        title: 'Largest Plus Sign',
        leetcodeNumber: 764,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an n x n grid of 1s with some cells marked as 0s (mines), find the largest plus sign made of 1s. A plus sign of order k means a center cell with k-1 cells extending in all four directions. Use DP to precompute the consecutive 1s in each of the four directions, then take the minimum at each center.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'prefix sum'],
      },
      {
        id: 'longest-arithmetic-subsequence-dp',
        title: 'Longest Arithmetic Subsequence (DP)',
        leetcodeNumber: 1027,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the length of the longest arithmetic subsequence in an array. dp[i] is a map from difference d to the length of longest arithmetic subsequence ending at index i with common difference d. For each pair (j, i), update dp[i][nums[i]-nums[j]] = dp[j][diff] + 1.',
        hasVisualization: true,
        tags: ['dynamic programming', 'hash map', 'array', 'arithmetic'],
      },
      {
        id: 'longest-chunked-palindrome-decomposition',
        title: 'Longest Chunked Palindrome Decomposition',
        leetcodeNumber: 1147,
        difficulty: 'Hard' as Difficulty,
        description:
          'Return the largest possible k such that a string s can be split into k non-empty substrings s1, s2, ..., sk where si == s(k+1-i) for all i. Use a greedy two-pointer approach: match prefixes and suffixes greedily, incrementing the chunk count for each matching pair.',
        hasVisualization: true,
        tags: ['dynamic programming', 'greedy', 'string', 'two pointers', 'recursion'],
      },
      {
        id: 'longest-common-subsequence-dp',
        title: 'Longest Common Subsequence (DP)',
        leetcodeNumber: 1143,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the length of the longest common subsequence (LCS) of two strings. dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]. When characters match, extend the diagonal; otherwise take the max of skipping one character from either string.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'lcs', 'classic'],
      },
      {
        id: 'longest-increasing-path-dp',
        title: 'Longest Increasing Path in a Matrix (DFS + Memo)',
        leetcodeNumber: 329,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the length of the longest strictly increasing path in a matrix, moving up/down/left/right. Use DFS with memoization: memo[r][c] stores the length of the longest increasing path starting at (r,c). Each cell is computed once, giving O(mn) time. No visited set needed since the path is strictly increasing.',
        hasVisualization: true,
        tags: ['dynamic programming', 'dfs', 'memoization', 'grid', 'topological sort'],
      },
      {
        id: 'longest-increasing-subsequence-dp',
        title: 'Longest Increasing Subsequence (DP O(n^2))',
        leetcodeNumber: 300,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the length of the longest strictly increasing subsequence. O(n^2) DP approach: dp[i] = length of LIS ending at index i. For each i, check all j < i: if nums[j] < nums[i], dp[i] = max(dp[i], dp[j]+1). Answer is max(dp).',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'lis', 'subsequence'],
      },
      {
        id: 'longest-palindromic-subsequence-dp',
        title: 'Longest Palindromic Subsequence (DP)',
        leetcodeNumber: 516,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the length of the longest palindromic subsequence in a string. dp[i][j] = LPS length in s[i..j]. If s[i]==s[j], dp[i][j] = dp[i+1][j-1] + 2. Otherwise dp[i][j] = max(dp[i+1][j], dp[i][j-1]). Fill diagonally from smaller to larger intervals.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'palindrome', 'interval dp'],
      },
      {
        id: 'longest-string-chain-dp',
        title: 'Longest String Chain (DP)',
        leetcodeNumber: 1048,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a list of words, find the longest chain where each word is a predecessor of the next (differs by exactly one inserted character). Sort by length, then for each word try removing each character and check if the result is in the chain.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'hash map', 'sorting'],
      },
      {
        id: 'make-string-subsequence-cyclic',
        title: 'Make String a Subsequence Using Cyclic Increments',
        leetcodeNumber: 2825,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two strings str1 and str2, check if str2 can be made a subsequence of str1 by applying at most one cyclic increment operation on each character of str1 (a->b, b->c, ..., z->a). Use two pointers to greedily match characters, allowing one-step cyclic advance.',
        hasVisualization: true,
        tags: ['two pointers', 'string', 'greedy', 'subsequence'],
      },
      {
        id: 'max-dot-product-of-two-subsequences',
        title: 'Max Dot Product of Two Subsequences',
        leetcodeNumber: 1458,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given two arrays nums1 and nums2, find the maximum dot product between non-empty subsequences of equal length. dp[i][j] = max dot product using subsequences ending at nums1[i-1] and nums2[j-1]. At each cell, either include both elements or skip one.',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'subsequence', 'dot product'],
      },
      {
        id: 'maximal-square-dp',
        title: 'Maximal Square (DP)',
        leetcodeNumber: 221,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the largest square containing only 1s in a binary matrix and return its area. Use DP where dp[r][c] = side length of the largest square whose bottom-right corner is at (r,c). The recurrence is: dp[r][c] = min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) + 1 when matrix[r][c] = 1.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'matrix', 'squares'],
      },
      {
        id: 'maximum-deletions-on-string',
        title: 'Maximum Deletions on a String',
        leetcodeNumber: 2430,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a string s, you can delete s[0..k-1] if s[0..k-1] == s[k..2k-1]. Maximize total operations. Uses DP: dp[i] = max operations starting at index i. Precompute LCP table to check prefix match in O(1).',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'lcp', 'prefix'],
      },
      {
        id: 'maximum-height-by-stacking-cuboids',
        title: 'Maximum Height by Stacking Cuboids',
        leetcodeNumber: 1691,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n cuboids, you can rotate each. Stack cuboids so each next one fits within the one below (all dimensions <=). Maximize total height. Key insight: sort each cuboid dimensions, then sort cuboids, then apply LIS-style DP.',
        hasVisualization: true,
        tags: ['dynamic programming', 'sorting', 'lis', '3d'],
      },
      {
        id: 'maximum-length-of-pair-chain',
        title: 'Maximum Length of Pair Chain',
        leetcodeNumber: 646,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n pairs of numbers, find the longest chain. A chain [a,b] -> [c,d] is valid only if b < c. Sort pairs by end value, then apply greedy or DP. The greedy approach: always pick the pair with smallest end that connects.',
        hasVisualization: true,
        tags: ['dynamic programming', 'greedy', 'sorting', 'intervals'],
      },
      {
        id: 'maximum-non-negative-product',
        title: 'Maximum Non-Negative Product in a Matrix',
        leetcodeNumber: 1594,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the path from top-left to bottom-right of a matrix (moving only right or down) with the maximum non-negative product. Track both max and min products at each cell because a negative times a negative can become a positive maximum. Return -1 if no non-negative product path exists.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'product', 'math'],
      },
      {
        id: 'maximum-number-of-points-with-cost',
        title: 'Maximum Number of Points with Cost',
        leetcodeNumber: 1937,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an m x n matrix of points, pick one cell per row to maximize total score. The score for picking cell (r,c) is points[r][c] minus the absolute column difference from the previous row pick. Use DP with left-right pass optimization to avoid O(n^2) inner loop.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'optimization'],
      },
      {
        id: 'maximum-profit-job-scheduling-dp',
        title: 'Maximum Profit in Job Scheduling (DP)',
        leetcodeNumber: 1235,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n jobs with startTime, endTime, profit, find max profit scheduling non-overlapping jobs. Sort by endTime. dp[i] = max profit considering first i jobs. For each job, binary search for latest non-overlapping job, then take max of skip or include.',
        hasVisualization: true,
        tags: ['dynamic programming', 'binary search', 'sorting', 'interval scheduling'],
      },
      {
        id: 'maximum-value-of-a-string-dp',
        title: 'Maximum Value of a String in an Array',
        leetcodeNumber: 2498,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array of strings, find the maximum ',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'parsing', 'easy'],
      },
      {
        id: 'min-cost-path-grid',
        title: 'Minimum Cost Path in Grid (Right/Down/Diagonal)',
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the minimum cost path from top-left to bottom-right of a grid, where at each step you can move right, down, or diagonally. This extends the basic min-path problem to include diagonal moves. dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]).',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'path', 'classic', 'diagonal'],
      },
      {
        id: 'minimum-ascii-delete-sum-dp',
        title: 'Minimum ASCII Delete Sum for Two Strings (DP)',
        leetcodeNumber: 712,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two strings s1 and s2, find the lowest ASCII sum of deleted characters to make them equal. dp[i][j] = min ASCII delete cost to make s1[0..i-1] == s2[0..j-1]. When chars match, no deletion; otherwise pick the cheaper deletion.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'ascii', 'delete'],
      },
      {
        id: 'minimum-cost-homecoming',
        title: 'Minimum Cost Homecoming of a Robot in a Grid',
        leetcodeNumber: 2087,
        difficulty: 'Medium' as Difficulty,
        description:
          'A robot is at position (startRow, startCol) on a grid. Moving through row r costs rowCosts[r] and moving through column c costs colCosts[c]. Find the minimum total cost to return home at (homeRow, homeCol). The optimal strategy is to move greedily: always move in the direction of home, paying each row/col cost exactly once.',
        hasVisualization: true,
        tags: ['dynamic programming', 'greedy', 'grid', 'path cost'],
      },
      {
        id: 'minimum-cost-to-merge-stones',
        title: 'Minimum Cost to Merge Stones',
        leetcodeNumber: 1000,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n piles of stones and an integer k, merge k consecutive piles at a time. The cost is the sum of those k piles. Find the minimum cost to merge all piles into one. If impossible, return -1. Uses interval DP with prefix sums.',
        hasVisualization: true,
        tags: ['dynamic programming', 'interval dp', 'prefix sum', 'divide and conquer'],
      },
      {
        id: 'minimum-falling-path-sum-dp',
        title: 'Minimum Falling Path Sum (DP)',
        leetcodeNumber: 931,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an n x n matrix, find the minimum sum of a falling path. A falling path starts at any element in the first row, and moves to an adjacent element in the row below (diagonally left, straight down, or diagonally right). Use DP building from row 1 downward, tracking the running minimum at each cell.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'falling path', 'optimization'],
      },
      {
        id: 'minimum-operations-to-make-subsequence',
        title: 'Minimum Operations to Make a Subsequence',
        leetcodeNumber: 1713,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given target (distinct elements) and arr, find minimum insertions to make target a subsequence of arr. Equivalent to: len(target) - LCS(target, arr). Since target has distinct elements, map target positions then find LIS in arr positions (O(n log n)).',
        hasVisualization: true,
        tags: ['dynamic programming', 'lis', 'binary search', 'subsequence'],
      },
      {
        id: 'minimum-path-sum-dp',
        title: 'Minimum Path Sum (DP)',
        leetcodeNumber: 64,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the path from top-left to bottom-right of a grid with the minimum sum of values. You can only move right or down. Use DP where dp[r][c] = minimum cost to reach cell (r,c). First row and column have only one way to reach them; interior cells take the minimum of coming from above or left.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'path', 'optimization'],
      },
      {
        id: 'minimum-score-triangulation-dp',
        title: 'Minimum Score Triangulation of Polygon (DP)',
        leetcodeNumber: 1039,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a convex polygon with n vertices, triangulate it into n-2 triangles. Each triangle score is the product of its three vertex values. Find the minimum total score. Uses interval DP: dp[i][j] = min score to triangulate the sub-polygon from vertex i to j. Try each vertex k as the triangle apex.',
        hasVisualization: true,
        tags: ['dynamic programming', 'interval dp', 'math', 'geometry'],
      },
      {
        id: 'number-of-longest-increasing-subsequence-dp',
        title: 'Number of Longest Increasing Subsequences (DP)',
        leetcodeNumber: 673,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of distinct longest increasing subsequences. dp[i] = LIS length ending at index i. count[i] = number of LIS of that length ending at i. If extending from j gives same length, add counts; if longer, reset count.',
        hasVisualization: true,
        tags: ['dynamic programming', 'array', 'lis', 'counting'],
      },
      {
        id: 'number-of-paths-with-max-score-dp',
        title: 'Number of Paths with Max Score (DP)',
        leetcodeNumber: 1301,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a board with digits, S (start), E (end), and X (obstacles), find the maximum score of a path from S (bottom-right) to E (top-left) moving up, left, or diagonally. Also count the number of paths achieving that maximum. Use DP tracking both max score and path count simultaneously.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'counting', 'path', 'hard'],
      },
      {
        id: 'number-of-ways-to-paint-n3-grid',
        title: 'Number of Ways to Paint N x 3 Grid',
        leetcodeNumber: 1411,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count the number of ways to color an n x 3 grid with 3 colors such that no two adjacent cells (horizontally or vertically) share the same color. Uses pattern-based DP: each row can be one of two pattern types - ABA (e.g. 1-2-1) or ABC (e.g. 1-2-3). Track how patterns transition between rows.',
        hasVisualization: true,
        tags: ['dynamic programming', 'state compression', 'combinatorics', 'math'],
      },
      {
        id: 'optimal-account-balancing',
        title: 'Optimal Account Balancing',
        leetcodeNumber: 465,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a list of transactions, find the minimum number of transactions to settle all debts. Compute net balance for each person. Those with positive balances are owed money, negative balances owe money. Use backtracking/bitmask DP to find the minimum number of transfers between creditors and debtors.',
        hasVisualization: true,
        tags: ['dynamic programming', 'bitmask', 'backtracking', 'greedy'],
      },
      {
        id: 'paint-house-iii',
        title: 'Paint House III',
        leetcodeNumber: 1473,
        difficulty: 'Hard' as Difficulty,
        description:
          'Paint n houses with k colors to form exactly target neighborhoods. Some houses are already painted (value > 0). Minimize total cost. State: dp[i][j][t] = min cost to paint houses 0..i where house i has color j and there are t neighborhoods. Uses 3D DP with transitions across colors.',
        hasVisualization: true,
        tags: ['dynamic programming', '3d dp', 'grid', 'optimization'],
      },
      {
        id: 'palindrome-partitioning-iii',
        title: 'Palindrome Partitioning III',
        leetcodeNumber: 1278,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given string s and integer k, partition s into exactly k non-empty substrings. The cost to make a substring a palindrome is the number of characters to change. Return the minimum total cost. Uses 2D DP: cost[i][j] = min changes to make s[i..j] a palindrome, then dp[i][j] = min cost for first i chars in j parts.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'palindrome', 'partition'],
      },
      {
        id: 'palindromic-substrings-dp',
        title: 'Palindromic Substrings (DP)',
        leetcodeNumber: 647,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count all palindromic substrings in a string. dp[i][j] = true if s[i..j] is a palindrome. A substring is palindromic if s[i]==s[j] and dp[i+1][j-1] is true (or length <= 2). Fill from shorter to longer substrings.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'palindrome', 'counting'],
      },
      {
        id: 'predict-the-winner',
        title: 'Predict the Winner',
        leetcodeNumber: 486,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of scores, two players take turns picking from either end. The player with the higher total score wins. Determine if the first player can guarantee a win or tie. dp[i][j] = score advantage the current player can achieve over the array slice from i to j.',
        hasVisualization: true,
        tags: ['dynamic programming', 'game theory', 'minimax', 'interval dp'],
      },
      {
        id: 'regular-expression-matching-dp',
        title: 'Regular Expression Matching (DP)',
        leetcodeNumber: 10,
        difficulty: 'Hard' as Difficulty,
        description:
          'Implement regular expression matching with ',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'regex', 'recursion'],
      },
      {
        id: 'remove-boxes',
        title: 'Remove Boxes',
        leetcodeNumber: 546,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given boxes with colored labels, remove groups of same-colored boxes. Removing k consecutive same-colored boxes gives k*k points. Find the maximum points. Uses 3D DP: dp[l][r][k] = max points from boxes[l..r] with k boxes same color as boxes[l] appended on the left.',
        hasVisualization: true,
        tags: ['dynamic programming', 'interval dp', 'memoization'],
      },
      {
        id: 'russian-doll-envelopes-dp',
        title: 'Russian Doll Envelopes (DP)',
        leetcodeNumber: 354,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given envelopes [w, h], find max number that can be nested (each strictly smaller in both dimensions). Sort by width ascending, height descending (to break ties). Then find LIS on heights only. Sorting trick prevents using two same-width envelopes.',
        hasVisualization: true,
        tags: ['dynamic programming', 'sorting', 'lis', 'binary search'],
      },
      {
        id: 'scramble-string-dp',
        title: 'Scramble String (DP)',
        leetcodeNumber: 87,
        difficulty: 'Hard' as Difficulty,
        description:
          'A string can be scrambled by splitting it into two parts at any point, optionally swapping them, and recursively applying this to each part. Determine if t is a scrambled version of s. Uses 3D DP with memoization: dp[i][j][k] = whether s[i..i+k-1] can scramble into t[j..j+k-1].',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'recursion', 'memoization'],
      },
      {
        id: 'shortest-common-supersequence-dp',
        title: 'Shortest Common Supersequence (DP)',
        leetcodeNumber: 1092,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given two strings str1 and str2, find the shortest string that has both as subsequences. Build LCS with DP, then reconstruct the supersequence by merging both strings along the LCS path.',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'lcs', 'reconstruction'],
      },
      {
        id: 'stone-game-ii',
        title: 'Stone Game II',
        leetcodeNumber: 1140,
        difficulty: 'Medium' as Difficulty,
        description:
          'Alice and Bob take turns picking stones from piles. On each turn the player can take all piles from piles[i] to piles[i+2M-1], then M updates to max(M, X) where X is the number of piles taken. Alice goes first. Both play optimally. Return the max stones Alice can get. Uses suffix sums and DP with minimax.',
        hasVisualization: true,
        tags: ['dynamic programming', 'game theory', 'minimax', 'suffix sum'],
      },
      {
        id: 'stone-game-iii',
        title: 'Stone Game III',
        leetcodeNumber: 1406,
        difficulty: 'Hard' as Difficulty,
        description:
          'Alice and Bob take turns picking 1, 2, or 3 stones from the front of a row of piles. The person who collects the most total stones wins. Alice goes first. Both play optimally. Return ',
        hasVisualization: true,
        tags: ['dynamic programming', 'game theory', 'minimax'],
      },
      {
        id: 'stone-game-iv',
        title: 'Stone Game IV',
        leetcodeNumber: 1510,
        difficulty: 'Hard' as Difficulty,
        description:
          'Alice and Bob take turns removing a perfect square number of stones from a pile. The player who cannot make a move loses. Alice goes first. Determine if Alice can guarantee a win. dp[i] = true if the current player wins with i stones remaining.',
        hasVisualization: true,
        tags: ['dynamic programming', 'game theory', 'math', 'perfect squares'],
      },
      {
        id: 'strange-printer-dp',
        title: 'Strange Printer (DP)',
        leetcodeNumber: 664,
        difficulty: 'Hard' as Difficulty,
        description:
          'A strange printer can print a sequence of same characters in one turn, and can overwrite previous prints. Find minimum turns to print the string s. Uses interval DP: dp[i][j] = min turns to print s[i..j]. Key insight: if s[j] == s[k] for some k in [i,j), we can extend the print to cover both positions.',
        hasVisualization: true,
        tags: ['dynamic programming', 'interval dp', 'string'],
      },
      {
        id: 'toss-strange-coins',
        title: 'Toss Strange Coins',
        leetcodeNumber: 1230,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n coins where coin i has probability prob[i] of landing heads, find the probability that exactly target coins land heads. Uses DP: dp[i][j] = probability of exactly j heads after tossing the first i coins. Transition: dp[i][j] = dp[i-1][j-1]*prob[i] + dp[i-1][j]*(1-prob[i]).',
        hasVisualization: true,
        tags: ['dynamic programming', 'probability', 'math'],
      },
      {
        id: 'triangle-minimum-path-dp',
        title: 'Triangle Minimum Path Sum (DP)',
        leetcodeNumber: 120,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a triangular array of numbers, find the minimum path sum from top to bottom. At each row, you can move to an adjacent number in the row below. Use bottom-up DP: start from the second-to-last row and add the minimum of the two adjacent values below. The answer is triangle[0][0].',
        hasVisualization: true,
        tags: ['dynamic programming', 'triangle', 'path', 'bottom-up'],
      },
      {
        id: 'unique-paths-dp',
        title: 'Unique Paths (DP)',
        leetcodeNumber: 62,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of unique paths from top-left to bottom-right of an m x n grid, moving only right or down. Classic DP: dp[r][c] = number of ways to reach (r,c). First row and column are all 1. Interior cells = sum of cell above and cell to the left.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'combinatorics', 'classic dp'],
      },
      {
        id: 'unique-paths-ii-dp',
        title: 'Unique Paths II - With Obstacles (DP)',
        leetcodeNumber: 63,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count unique paths from top-left to bottom-right of a grid with obstacles. A cell with value 1 is an obstacle. If start or end is blocked, return 0. dp[r][c] = number of paths to reach (r,c); if cell is obstacle, dp[r][c] = 0. Otherwise sum from above and left.',
        hasVisualization: true,
        tags: ['dynamic programming', 'grid', 'obstacle', 'combinatorics'],
      },
      {
        id: 'unique-paths-iii',
        title: 'Unique Paths III',
        leetcodeNumber: 980,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a grid with a start cell, end cell, empty cells, and obstacle cells, count the number of paths from start to end that walk over every non-obstacle cell exactly once. Uses DFS with bitmask memoization to track which cells have been visited.',
        hasVisualization: true,
        tags: ['dynamic programming', 'backtracking', 'bitmask', 'grid', 'dfs'],
      },
      {
        id: 'ways-to-make-fair-array',
        title: 'Ways to Make a Fair Array',
        leetcodeNumber: 1664,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of integers, count the number of indices where removing that element makes the resulting array fair. A fair array has equal sum of elements at even and odd indices. Use prefix sums of even/odd indexed elements to efficiently compute balance after each removal.',
        hasVisualization: true,
        tags: ['dynamic programming', 'prefix sum', 'array', 'counting'],
      },
      {
        id: 'wildcard-matching-dp',
        title: 'Wildcard Matching (DP)',
        leetcodeNumber: 44,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given string s and pattern p with ',
        hasVisualization: true,
        tags: ['dynamic programming', 'string', 'wildcard', 'greedy'],
      },
      {
        id: 'zuma-game',
        title: 'Zuma Game',
        leetcodeNumber: 488,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a board string and hand balls, find the minimum balls to insert to clear the board. Groups of 3+ same-colored balls are removed automatically (chain reactions can occur). Uses DFS/memoization to try inserting hand balls at each valid position in the board.',
        hasVisualization: true,
        tags: ['dynamic programming', 'dfs', 'memoization', 'string', 'simulation'],
      },
    
      {
        id: 'all-possible-full-binary-trees-dp',
        title: 'All Possible Full Binary Trees',
        leetcodeNumber: 894,
        difficulty: 'Medium' as Difficulty,
        description:
          'A full binary tree has every node with either 0 or 2 children. Given n (odd number), return all possible full binary trees with n nodes. Use recursive DP with memoization: for each odd left size l (1, 3, 5, ..., n-2), combine all trees of size l for left subtree with all trees of size n-l-1 for right subtree.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'Recursion', 'Memoization'],
      },
      {
        id: 'assignment-problem-hungarian',
        title: 'Assignment Problem (Hungarian Algorithm)',
        difficulty: 'Hard' as Difficulty,
        description:
          'Assign n workers to n jobs to minimize total cost using the Hungarian Algorithm (bitmask DP). dp[mask] = minimum cost to assign workers 0..popcount(mask)-1 to jobs indicated by mask. Time: O(n^2 * 2^n).',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Assignment Problem', 'Optimization', 'Bit Manipulation'],
      },
      {
        id: 'beautiful-arrangement-ii',
        title: 'Beautiful Arrangement II',
        leetcodeNumber: 667,
        difficulty: 'Medium' as Difficulty,
        description:
          'Construct an array using integers 1 to n such that there are exactly k distinct absolute differences between adjacent elements. Use a greedy interleaving strategy: first k+1 elements alternate max/min to create k distinct diffs, then fill remaining in sorted order.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Array', 'Greedy', 'Construction'],
      },
      {
        id: 'best-time-to-buy-sell-stock-cooldown-ii',
        title: 'Best Time to Buy and Sell Stock with Cooldown',
        leetcodeNumber: 309,
        difficulty: 'Medium' as Difficulty,
        description:
          'After selling stock, you must wait one cooldown day before buying again. State machine DP: held = max profit holding stock, sold = max profit just sold (in cooldown), rest = max profit in rest state. Transitions: held = max(held, rest - price), sold = held + price, rest = max(rest, sold).',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'State Machine'],
      },
      {
        id: 'best-time-to-buy-sell-stock-fee-ii',
        title: 'Best Time to Buy and Sell Stock with Transaction Fee',
        leetcodeNumber: 714,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find max profit buying and selling stocks with a transaction fee paid on each sale. Unlimited transactions allowed. State machine DP: cash = max profit not holding stock, hold = max profit holding stock. cash = max(cash, hold + price - fee), hold = max(hold, cash - price).',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'State Machine', 'Greedy'],
      },
      {
        id: 'best-time-to-buy-sell-stock-iv',
        title: 'Best Time to Buy and Sell Stock IV',
        leetcodeNumber: 188,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array of stock prices and at most k transactions, find the maximum profit. State machine DP: for each transaction, track the max profit when holding or not holding stock. dp[t][0] = max profit with t transactions not holding, dp[t][1] = max profit holding.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'State Machine', 'Greedy'],
      },
      {
        id: 'binary-lifting',
        title: 'Binary Lifting (LCA)',
        difficulty: 'Hard' as Difficulty,
        description:
          'Binary Lifting is a technique for O(log n) LCA (Lowest Common Ancestor) queries after O(n log n) preprocessing. For each node v, precompute ancestor[v][j] = the 2^j-th ancestor of v. LCA(u, v): first bring u and v to same depth, then simultaneously jump both in decreasing powers of 2 until they diverge; the parent of that divergence point is the LCA.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'LCA', 'Binary Lifting', 'Advanced'],
      },
      {
        id: 'binary-tree-cameras-dp',
        title: 'Binary Tree Cameras',
        leetcodeNumber: 968,
        difficulty: 'Hard' as Difficulty,
        description:
          'Place cameras on tree nodes to monitor every node. A camera at node v monitors v, its parent, and its children. Minimize the number of cameras. Use DP with three states per node: 0 = not covered, 1 = has camera, 2 = covered (no camera). Post-order DFS: leaves return 0 (not covered), forcing parent to place a camera.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'Greedy', 'DFS'],
      },
      {
        id: 'can-i-win-bitmask',
        title: 'Can I Win (Bitmask DP)',
        leetcodeNumber: 464,
        difficulty: 'Medium' as Difficulty,
        description:
          'Two players alternately choose integers from 1 to maxChoosableInteger. The player who causes the cumulative total to reach or exceed desiredTotal wins. Uses bitmask DP where each bit indicates if that number has been chosen.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Game Theory', 'Minimax', 'Bit Manipulation'],
      },
      {
        id: 'centroid-decomposition',
        title: 'Centroid Decomposition',
        difficulty: 'Hard' as Difficulty,
        description:
          'Centroid Decomposition decomposes a tree recursively. The centroid of a tree is the node whose removal results in all subtrees having size <= n/2. By recursively finding centroids, we build a centroid tree of height O(log n). This enables efficient O(n log n) solutions for path problems: any path passes through the centroid of some decomposed subtree.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'Centroid Decomposition', 'Advanced'],
      },
      {
        id: 'count-number-of-maximum-bitwise-or',
        title: 'Count Number of Maximum Bitwise-OR Subsets',
        leetcodeNumber: 2044,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array, find the maximum possible bitwise OR of a subset, then count how many subsets achieve that maximum. The maximum OR is the OR of all elements. Uses bitmask DP or enumeration over all 2^n subsets.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Array', 'Backtracking'],
      },
      {
        id: 'count-subtrees-with-max-distance',
        title: 'Count Subtrees with Max Distance Between Cities',
        leetcodeNumber: 1617,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n cities forming a tree, for each possible diameter d (1 to n-1), count how many subtrees have exactly d as their maximum distance between any two nodes. Enumerate all 2^n subsets, and for each connected subset compute the diameter using BFS/DFS. The diameter of a tree equals the sum of the two longest branches from any internal node.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'BFS', 'Bitmask', 'Hard'],
      },
      {
        id: 'decode-ways-ii-dp',
        title: 'Decode Ways II',
        leetcodeNumber: 639,
        difficulty: 'Hard' as Difficulty,
        description:
          'Count ways to decode a string containing digits and ',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'String', 'State Machine'],
      },
      {
        id: 'diameter-of-tree-dp',
        title: 'Diameter of Binary Tree (Tree DP)',
        leetcodeNumber: 543,
        difficulty: 'Medium' as Difficulty,
        description:
          'The diameter of a binary tree is the length of the longest path between any two nodes (not necessarily through root). Use tree DP: for each node, compute the height of its left and right subtrees. The diameter through this node = leftHeight + rightHeight. Track the global maximum across all nodes.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS', 'Diameter'],
      },
      {
        id: 'distribute-coins-dp',
        title: 'Distribute Coins in Binary Tree',
        leetcodeNumber: 979,
        difficulty: 'Medium' as Difficulty,
        description:
          'Each node in a binary tree has some coins; total coins equals total nodes. In each move, you can move one coin between adjacent nodes. Return the minimum number of moves. Post-order DFS: for each node, compute the excess coins (node.val + leftFlow + rightFlow - 1). Each unit of excess/deficit requires one move to flow through the edge to parent.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS', 'Recursion'],
      },
      {
        id: 'distribute-repeating-integers',
        title: 'Distribute Repeating Integers',
        leetcodeNumber: 1655,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array of integers and customer quantity requirements, determine if all customers can be satisfied. Uses bitmask DP over customer subsets where dp[mask] = minimum number of distinct integers needed to satisfy customers in mask.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Backtracking', 'Bit Manipulation'],
      },
      {
        id: 'domino-and-tromino-tiling-ii',
        title: 'Domino and Tromino Tiling',
        leetcodeNumber: 790,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count ways to tile a 2×n board using dominoes (1×2) and trominoes (L-shaped 2×2 minus one corner). DP recurrence: dp[n] = 2*dp[n-1] + dp[n-3]. Answer modulo 10^9+7.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'State Machine', 'Tiling'],
      },
      {
        id: 'dungeon-game-matrix',
        title: 'Dungeon Game',
        leetcodeNumber: 174,
        difficulty: 'Hard' as Difficulty,
        description:
          'A knight starts at top-left and must reach the princess at bottom-right of a dungeon grid (negative=demon, positive=magic). Find the minimum initial health needed to survive. Use DP from bottom-right: dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]).',
        hasVisualization: true,
        tags: ['Matrix', 'Dynamic Programming'],
      },
      {
        id: 'euler-tour-technique',
        title: 'Euler Tour Technique',
        difficulty: 'Medium' as Difficulty,
        description:
          'The Euler Tour of a tree visits each node multiple times: once when entering and once after each child is processed. This ',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'Euler Tour', 'LCA'],
      },
      {
        id: 'fair-distribution-of-cookies',
        title: 'Fair Distribution of Cookies',
        leetcodeNumber: 2305,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given cookie bags and k children, distribute all bags to minimize the maximum cookies any child receives (unfairness). Uses bitmask DP: subSum[mask]=total cookies in bags of mask, dp[i][mask]=min unfairness distributing bags in mask to i children.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Backtracking', 'Bit Manipulation'],
      },
      {
        id: 'find-minimum-time-to-finish-jobs',
        title: 'Find Minimum Time to Finish All Jobs',
        leetcodeNumber: 1723,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given jobs and k workers, assign all jobs to workers to minimize the maximum working time of any worker. Uses bitmask DP: precompute subset sums, then dp[i][mask] = min max-time using i workers to handle jobs in mask.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Binary Search', 'Backtracking'],
      },
      {
        id: 'flip-game-bitmask',
        title: 'Flip Game II (Bitmask DP)',
        leetcodeNumber: 294,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a game string of + and -, players alternate flipping ',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Game Theory', 'Minimax', 'Bit Manipulation'],
      },
      {
        id: 'frog-jump-ii',
        title: 'Frog Jump II',
        leetcodeNumber: 2498,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given sorted stone positions, a frog must jump forward and back exactly once touching each stone. Minimize the maximum jump length. Greedy insight: skip every other stone on the way forward (take stones 0, 2, 4, ...) and pick up the rest on the way back. The answer is max gap between every other stone.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Greedy', 'Binary Search'],
      },
      {
        id: 'heavy-light-decomposition',
        title: 'Heavy-Light Decomposition',
        difficulty: 'Hard' as Difficulty,
        description:
          'Heavy-Light Decomposition (HLD) decomposes a tree into chains, allowing path queries to be answered efficiently using a segment tree or other data structure. Each node has a ',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'Heavy-Light Decomposition', 'Advanced'],
      },
      {
        id: 'house-robber-iii-dp',
        title: 'House Robber III',
        leetcodeNumber: 337,
        difficulty: 'Medium' as Difficulty,
        description:
          'The thief has found a new place to rob: a binary tree neighborhood. Each node stores money. The constraint is that adjacent nodes (parent-child) cannot both be robbed. Use tree DP: for each node, compute two values — max money if this node is robbed, and max money if it is not robbed. The answer is the max of these two at the root.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS', 'Recursion'],
      },
      {
        id: 'jump-game-dp',
        title: 'Jump Game (DP Approach)',
        leetcodeNumber: 55,
        difficulty: 'Medium' as Difficulty,
        description:
          'Determine if you can reach the last index from the first index. Each element gives maximum jump length. DP approach: dp[i] = true if index i is reachable. dp[i] = true if exists j < i where dp[j] && j + nums[j] >= i. Space-optimized: track furthest reachable index.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Greedy', 'Array'],
      },
      {
        id: 'knight-dialer-ii',
        title: 'Knight Dialer',
        leetcodeNumber: 935,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count distinct phone numbers of length n a knight can dial starting from any digit (0-9) on a phone keypad. Knight moves follow chess rules. dp[i][d] = ways to form numbers of length i ending at digit d. Transition via knight jumps.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'State Machine', 'Graph'],
      },
      {
        id: 'longest-path-different-colors-dp',
        title: 'Longest Path with Different Adjacent Colors',
        leetcodeNumber: 2246,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a tree (not necessarily binary) with colored nodes, find the longest path where no two adjacent nodes share the same color. Use tree DP: for each node, compute the longest downward path with a different color from the current node. The answer is updated as the sum of the two longest valid paths through each node.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS', 'Graph'],
      },
      {
        id: 'lowest-common-ancestor-dp',
        title: 'Lowest Common Ancestor (DP)',
        leetcodeNumber: 1483,
        difficulty: 'Medium' as Difficulty,
        description:
          'Preprocess a binary tree so that LCA queries and k-th ancestor queries can be answered efficiently. Using DP: dp[node][j] = 2^j-th ancestor of node. For LCA(u, v): first equalize depths using binary lifting, then simultaneously move both nodes up. This DP-based approach answers each query in O(log n) after O(n log n) preprocessing.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'LCA', 'Binary Lifting'],
      },
      {
        id: 'maximal-square-matrix',
        title: 'Maximal Square',
        leetcodeNumber: 221,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the largest square containing only 1s in a binary matrix and return its area. Use DP: dp[i][j] = side length of the largest square whose bottom-right corner is at (i,j). dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1 when matrix[i][j]==',
        hasVisualization: true,
        tags: ['Matrix', 'Dynamic Programming'],
      },
      {
        id: 'maximize-score-after-n-operations',
        title: 'Maximize Score After N Operations',
        leetcodeNumber: 1799,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given 2n integers, perform n operations. In operation k, choose 2 elements, score += k * gcd(a, b), remove them. Maximize total score. Uses bitmask DP: dp[mask] = max score using elements in mask (popcount must be even).',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Math', 'Bit Manipulation'],
      },
      {
        id: 'maximum-compatibility-score-sum',
        title: 'Maximum Compatibility Score Sum',
        leetcodeNumber: 1947,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given student and mentor answer arrays, assign each student to exactly one mentor to maximize the total compatibility score. Compatibility = number of matching answers. Uses bitmask DP over mentor assignments.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Array'],
      },
      {
        id: 'maximum-independent-set-tree',
        title: 'Maximum Independent Set on Tree',
        difficulty: 'Hard' as Difficulty,
        description:
          'An independent set is a set of vertices with no two adjacent. Find the maximum independent set on a tree. Tree DP: dp[v][0] = max IS size in subtree of v when v is NOT selected; dp[v][1] = max IS size when v IS selected. Transition: if v selected, no children can be selected. If v not selected, each child can be selected or not.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS', 'Independent Set'],
      },
      {
        id: 'maximum-product-path-tree',
        title: 'Maximum Product of Splitted Binary Tree',
        leetcodeNumber: 1339,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary tree, remove one edge to split it into two subtrees. Return the maximum product of their subtree sums modulo 1e9+7. First compute the total sum. Then for each possible split (each node\\',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS'],
      },
      {
        id: 'maximum-profit-in-job-scheduling-ii',
        title: 'Maximum Profit in Job Scheduling',
        leetcodeNumber: 1235,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given jobs with start, end, and profit, find maximum profit scheduling non-overlapping jobs. Sort by end time. dp[i] = max profit considering first i jobs. For each job, binary search for last non-overlapping job, then dp[i] = max(dp[i-1], dp[lastNonOverlap] + profit[i]).',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Binary Search', 'Interval Scheduling'],
      },
      {
        id: 'maximum-students-taking-exam',
        title: 'Maximum Students Taking Exam',
        leetcodeNumber: 1349,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a classroom grid where some seats are broken, find the maximum number of students that can take exam without cheating. Students cannot sit adjacent (left/right) or diagonally adjacent to another student. Uses bitmask DP row by row.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Matrix'],
      },
      {
        id: 'minimum-cost-to-cut-rod',
        title: 'Minimum Cost to Cut a Stick',
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a rod of length n and cut positions, find the minimum cost to make all cuts. Cost of a cut = length of the segment being cut. DP on intervals: dp[i][j] = min cost to make all cuts between cut[i] and cut[j]. dp[i][j] = min over k of dp[i][k] + dp[k][j] + (cuts[j] - cuts[i]).',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Interval DP'],
      },
      {
        id: 'minimum-cost-to-make-array-equal',
        title: 'Minimum Cost to Make Array Equal',
        leetcodeNumber: 2448,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given arrays nums and cost, find a target value x minimizing sum(cost[i] * |nums[i] - x|). The optimal x is the weighted median of nums with weights cost. Use prefix sums on sorted (value, cost) pairs to compute cost at each candidate target efficiently.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Binary Search', 'Prefix Sum', 'Weighted Median'],
      },
      {
        id: 'minimum-cost-to-split-array',
        title: 'Minimum Cost to Split an Array',
        leetcodeNumber: 2547,
        difficulty: 'Hard' as Difficulty,
        description:
          'Split array into subarrays where cost = k * (number of splits) + sum of trimmed subarray costs. Trimmed cost of a subarray = count of elements that appear more than once. dp[i] = min cost to split nums[0..i-1]. For each split point, compute trimmed cost using frequency counting.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Hash Map', 'Counting'],
      },
      {
        id: 'minimum-cost-to-visit-every-node',
        title: 'Minimum Cost to Visit Every Node (TSP Variant)',
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the minimum cost path that visits every node in a weighted graph starting from node 0. This is the Travelling Salesman Problem solved with bitmask DP: dp[mask][i] = minimum cost to have visited nodes in mask, currently at node i.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'TSP', 'Graph', 'Bit Manipulation'],
      },
      {
        id: 'minimum-difficulty-of-job-schedule-ii',
        title: 'Minimum Difficulty of a Job Schedule',
        leetcodeNumber: 1335,
        difficulty: 'Hard' as Difficulty,
        description:
          'Schedule n jobs over d days such that each day completes at least one job in order. Day difficulty = max job difficulty that day. Minimize total difficulty. dp[i][j] = min difficulty completing first j jobs in i days. For each day boundary k, dp[i][j] = min(dp[i-1][k] + max(jobs[k..j-1])).',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'State Machine', 'Scheduling'],
      },
      {
        id: 'minimum-number-of-work-sessions',
        title: 'Minimum Number of Work Sessions to Finish the Tasks',
        leetcodeNumber: 1986,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given tasks with durations and a session length limit, find the minimum number of work sessions to complete all tasks. Tasks can be split across sessions but not split within. Uses bitmask DP: dp[mask] = minimum sessions and remaining time in last session.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Backtracking', 'Bit Manipulation'],
      },
      {
        id: 'minimum-path-sum-matrix',
        title: 'Minimum Path Sum',
        leetcodeNumber: 64,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an m x n grid filled with non-negative numbers, find a path from top-left to bottom-right that minimizes the sum of all numbers along the path. You can only move right or down. Use DP: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).',
        hasVisualization: true,
        tags: ['Matrix', 'Dynamic Programming'],
      },
      {
        id: 'minimum-total-distance-traveled',
        title: 'Minimum Total Distance Traveled',
        leetcodeNumber: 2463,
        difficulty: 'Hard' as Difficulty,
        description:
          'Assign robots to factories to minimize total travel distance. Each factory[i] has a position and limited capacity. Sort both by position. dp[i][j] = min total distance assigning first i robots to first j factories. Transition: assign k consecutive robots to factory j.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Sorting', 'Assignment'],
      },
      {
        id: 'minimum-white-tiles',
        title: 'Minimum White Tiles After Covering With Carpets',
        leetcodeNumber: 2209,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a floor string of ',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Prefix Sum', 'Greedy'],
      },
      {
        id: 'minimum-xor-sum-of-two-arrays',
        title: 'Minimum XOR Sum of Two Arrays',
        leetcodeNumber: 1879,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given two arrays nums1 and nums2, rearrange nums2 to minimize sum of XOR of corresponding elements. Uses bitmask DP: dp[mask] = minimum XOR sum when pairing first popcount(mask) elements of nums1 with elements of nums2 indicated by mask.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Array'],
      },
      {
        id: 'number-of-dice-rolls-with-target-ii',
        title: 'Number of Dice Rolls With Target Sum',
        leetcodeNumber: 1155,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count ways to roll n dice each with k faces (1..k) so that the sum equals target. dp[i][s] = ways to achieve sum s using i dice. dp[i][s] = sum of dp[i-1][s-f] for f in 1..k. Answer modulo 10^9+7.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Combinatorics'],
      },
      {
        id: 'number-of-good-leaf-pairs-dp',
        title: 'Number of Good Leaf Node Pairs',
        leetcodeNumber: 1530,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary tree and integer distance, count pairs of leaf nodes whose shortest path distance is <= distance. Use tree DP: each dfs call returns an array of distances from current node to all leaves in its subtree. At each node, combine left and right leaf distance arrays, count pairs with sum <= distance, and return shifted-up distances.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS', 'Recursion'],
      },
      {
        id: 'number-of-ways-to-wear-hats',
        title: 'Number of Ways to Wear Different Hats',
        leetcodeNumber: 1434,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given n people and 40 hat types where each person has a list of favorite hats, count the number of ways to assign a different hat to each person such that each person gets a hat they like. Uses bitmask DP over people assignments for each hat.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation'],
      },
      {
        id: 'out-of-boundary-paths-dp',
        title: 'Out of Boundary Paths',
        leetcodeNumber: 576,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count paths for a ball starting at (startRow, startCol) in an m×n grid to move out of bounds in exactly maxMove moves. dp[move][r][c] = ways to exit in exactly (remaining) moves from (r,c). Sum contributions from all border-crossing moves.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'BFS', 'State Machine'],
      },
      {
        id: 'paint-fence-dp',
        title: 'Paint Fence',
        leetcodeNumber: 276,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count ways to paint n fence posts with k colors so that at most 2 adjacent posts have the same color. DP: same[i] = ways last two posts are same color, diff[i] = ways last two posts differ. same[i] = diff[i-1], diff[i] = (same[i-1] + diff[i-1]) * (k-1).',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'State Machine', 'Combinatorics'],
      },
      {
        id: 'paint-house-dp',
        title: 'Paint House',
        leetcodeNumber: 256,
        difficulty: 'Medium' as Difficulty,
        description:
          'Paint n houses with 3 colors (Red, Blue, Green) such that no two adjacent houses have the same color. Minimize total cost. dp[i][c] = min cost to paint house i with color c, considering no same-color constraint with house i-1.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'State Machine'],
      },
      {
        id: 'paint-house-ii-dp',
        title: 'Paint House II',
        leetcodeNumber: 265,
        difficulty: 'Hard' as Difficulty,
        description:
          'Paint n houses with k colors such that no two adjacent houses have the same color. Minimize total cost. Optimized O(nk) DP: track the best and second-best costs from previous house to avoid O(k^2) transitions.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'State Machine'],
      },
      {
        id: 'parallel-courses-bitmask',
        title: 'Parallel Courses (Bitmask DP)',
        leetcodeNumber: 1136,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given course prerequisites as a DAG, find the minimum number of semesters to complete all courses. Each semester you can take any subset of courses whose prerequisites are met. Uses bitmask DP where dp[mask] = minimum semesters to complete courses in mask.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Topological Sort', 'Graph', 'Bit Manipulation'],
      },
      {
        id: 'people-whose-list-of-favorite-companies',
        title: 'People Whose List of Favorite Companies is Not a Subset',
        leetcodeNumber: 1452,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find all people whose favorite company list is not a subset of any other person',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'String', 'Set'],
      },
      {
        id: 'pizza-with-3n-slices',
        title: 'Pizza With 3n Slices',
        leetcodeNumber: 1388,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given 3n pizza slices in a circle, Alice picks first, then Bob picks adjacent, then Charlie picks adjacent. You (Alice) want to maximize your total. Equivalent to: pick n non-adjacent elements from a circular array to maximize sum. DP on two linear subarrays (house robber on circle).',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Greedy', 'House Robber'],
      },
      {
        id: 're-rooting-technique',
        title: 'Re-Rooting Technique',
        difficulty: 'Hard' as Difficulty,
        description:
          'Re-rooting (or rerooting) is a tree DP technique that computes, for each node, the answer if that node were the root. First DFS computes values rooted at node 0 (subtree sizes, distances). Second DFS propagates to children: when we move the root from parent to child, we can update the child\\',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS', 'Graph', 'Advanced'],
      },
      {
        id: 'shortest-path-to-get-all-keys',
        title: 'Shortest Path to Get All Keys',
        leetcodeNumber: 864,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a grid with keys (a-f) and locks (A-F), find the shortest path to collect all keys. State is (row, col, keyMask). Uses BFS with bitmask state where each bit represents a collected key.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'BFS', 'Graph', 'Bit Manipulation'],
      },
      {
        id: 'smallest-sufficient-team',
        title: 'Smallest Sufficient Team',
        leetcodeNumber: 1125,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the smallest team of people such that the team covers all required skills. Each person has a subset of skills. Uses bitmask DP where dp[mask] = minimum people needed to cover the skills in mask.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Array'],
      },
      {
        id: 'special-permutations',
        title: 'Special Permutations',
        leetcodeNumber: 2741,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count permutations of nums where every adjacent pair (nums[i], nums[i+1]) satisfies: nums[i] % nums[i+1] == 0 or nums[i+1] % nums[i] == 0. Uses bitmask DP: dp[mask][i] = number of ways to arrange elements in mask ending with nums[i].',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Array'],
      },
      {
        id: 'stickers-to-spell-word',
        title: 'Stickers to Spell Word',
        leetcodeNumber: 691,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given sticker strings and a target word, find the minimum number of stickers to spell the target. Uses bitmask DP where each bit represents whether a character in target has been covered. dp[mask] = min stickers to cover characters indicated by mask.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'BFS', 'Bit Manipulation'],
      },
      {
        id: 'sum-of-distances-dp',
        title: 'Sum of Distances in Tree',
        leetcodeNumber: 834,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an undirected tree with n nodes, return an array where answer[i] is the sum of distances from node i to all other nodes. Solve in O(n) with two DFS passes: first pass computes subtree sizes and distances from root; second pass uses re-rooting to compute distances for all nodes.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS', 'Graph'],
      },
      {
        id: 'traveling-salesman-problem',
        title: 'Traveling Salesman Problem (TSP)',
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the shortest route that visits every city exactly once and returns to the starting city. Classic TSP solved with bitmask DP (Held-Karp algorithm): dp[mask][i] = minimum distance to visit cities in mask, ending at city i, starting from city 0.',
        hasVisualization: true,
        tags: ['Dynamic Programming', 'Bitmask', 'TSP', 'Graph', 'Held-Karp', 'Bit Manipulation'],
      },
      {
        id: 'tree-coloring-problem',
        title: 'Tree Coloring Problem',
        difficulty: 'Medium' as Difficulty,
        description:
          'Color a binary tree with k colors such that no two adjacent nodes (parent-child) share the same color. Use tree DP: dp[node][c] = minimum cost to color the subtree rooted at node with color c. For each node and color, sum the minimum cost of each child using any color different from c. Classic application of tree DP with state transitions.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'Coloring', 'DFS'],
      },
      {
        id: 'tree-dp-basics',
        title: 'Tree DP Basics',
        difficulty: 'Medium' as Difficulty,
        description:
          'Tree DP (Dynamic Programming on Trees) is a fundamental technique where we compute DP states for each node based on its children\\',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS', 'Tutorial'],
      },
      {
        id: 'tree-isomorphism',
        title: 'Tree Isomorphism',
        difficulty: 'Hard' as Difficulty,
        description:
          'Two trees are isomorphic if one can be transformed into the other by renaming vertices. Canonical form algorithm: recursively compute a canonical string for each subtree by sorting children\\',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'Hashing', 'Canonical Form'],
      },
      {
        id: 'tree-knapsack',
        title: 'Tree Knapsack (Dependent Knapsack)',
        difficulty: 'Hard' as Difficulty,
        description:
          'Tree Knapsack (also called Dependent Knapsack) generalizes 0/1 knapsack to a tree structure: selecting a node requires selecting its parent. Given a tree where each node has a weight and value, and a budget W, maximize total value subject to total weight <= W and the dependency constraint. Use tree DP: dp[v][j] = max value using exactly j weight in subtree of v.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'Knapsack', 'DFS'],
      },
      {
        id: 'tree-path-queries',
        title: 'Tree Path Queries',
        difficulty: 'Medium' as Difficulty,
        description:
          'Answer path queries on a tree efficiently. Given a binary tree and multiple queries asking for path sum or path max between two nodes, precompute using tree DP: depth[], parent[], subtree sums, and path sums from root. LCA (Lowest Common Ancestor) enables O(log n) query answering. This visualization shows precomputation of path sums using tree DP.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS', 'LCA', 'Path Queries'],
      },
      {
        id: 'unique-binary-search-trees-dp',
        title: 'Unique Binary Search Trees',
        leetcodeNumber: 96,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n, return the number of structurally unique BSTs that store values 1..n. This is the nth Catalan number. Use DP: dp[i] = number of unique BSTs with i nodes. For each root k (1..i), dp[i] += dp[k-1] * dp[i-k] because there are dp[k-1] left subtrees and dp[i-k] right subtrees.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'Math', 'BST'],
      },
      {
        id: 'unique-paths-matrix',
        title: 'Unique Paths',
        leetcodeNumber: 62,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of unique paths from the top-left to the bottom-right corner of an m x n grid, moving only right or down. Use DP: dp[i][j] = dp[i-1][j] + dp[i][j-1]. All cells in the first row and column have exactly 1 path.',
        hasVisualization: true,
        tags: ['Matrix', 'Dynamic Programming', 'Math'],
      },
      {
        id: 'vertex-cover-tree',
        title: 'Minimum Vertex Cover on Tree',
        difficulty: 'Hard' as Difficulty,
        description:
          'A vertex cover is a set of vertices such that every edge has at least one endpoint in the set. Find the minimum vertex cover on a tree. Tree DP: dp[v][0] = min cover of subtree v where v is NOT in cover; dp[v][1] = min cover where v IS in cover. Transition: if v not in cover, all children must be in cover. If v in cover, each child can be in or not.',
        hasVisualization: true,
        tags: ['Tree', 'Dynamic Programming', 'DFS', 'Graph Theory'],
      },
    ],
  },

  // ─── 16. Greedy ────────────────────────────────────────────────────
  {
    id: 'greedy',
    name: 'Greedy',
    icon: '▸',
    color: 'text-lime-400',
    gradient: 'from-lime-500/20 to-lime-600/10',
    borderColor: 'border-lime-500/30',
    problems: [
      {
        id: 'jump-to-the-end',
        title: 'Jump to the End',
        difficulty: 'Medium',
        leetcodeNumber: 55,
        description:
          'Determine if you can reach the last index of an array by greedily tracking the farthest reachable position.',
        hasVisualization: true,
        tags: ['greedy', 'array'],
      },
      {
        id: 'gas-stations',
        title: 'Gas Stations',
        difficulty: 'Medium',
        leetcodeNumber: 134,
        description:
          'Find the starting gas station index for a circular tour where you never run out of fuel.',
        hasVisualization: true,
        tags: ['greedy', 'array'],
      },
      {
        id: 'candies',
        title: 'Candies',
        difficulty: 'Hard',
        leetcodeNumber: 135,
        description:
          'Distribute minimum candies to children in a line so each child with a higher rating gets more than neighbors.',
        hasVisualization: true,
        tags: ['greedy', 'array'],
      },
      {
        id: 'activity-selection',
        title: 'Activity Selection',
        difficulty: 'Medium',
        description:
          'Given n activities each with a start and end time, select the maximum number of non-overlapping activities. Greedy approach: sort by finish time, always pick the activity that finishes earliest and does not conflict with the last selected activity.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'interval'],
      },
      {
        id: 'assign-cookies',
        title: 'Assign Cookies',
        difficulty: 'Easy',
        leetcodeNumber: 455,
        description:
          'You want to give cookies to children to maximize the number of content children. Child i needs greed[i] units. Cookie j has size s[j]. Assign at most one cookie per child. Greedy: sort both arrays, use two pointers. Try to satisfy the least greedy child first with the smallest sufficient cookie.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'two-pointers'],
      },
      {
        id: 'best-time-buy-sell-stock-ii',
        title: 'Best Time to Buy and Sell Stock II',
        difficulty: 'Medium',
        leetcodeNumber: 122,
        description:
          'Maximize profit from multiple buy-sell transactions (can hold at most one share). Greedy insight: capture every upward price movement. If tomorrow\'s price is higher than today\'s, buy today and sell tomorrow (equivalently, add the positive difference to profit). O(n) time.',
        hasVisualization: true,
        tags: ['array', 'greedy', 'dynamic-programming'],
      },
      {
        id: 'fractional-knapsack',
        title: 'Fractional Knapsack',
        difficulty: 'Medium',
        description:
          'Given items each with a weight and value, and a knapsack of capacity W, maximize total value. Unlike 0/1 knapsack, you can take fractional amounts. Greedy: sort items by value-per-weight ratio descending, and greedily take as much as possible of each item.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'array'],
      },
      {
        id: 'job-sequencing',
        title: 'Job Sequencing with Deadlines',
        difficulty: 'Medium',
        description:
          'Given jobs each with a deadline and profit, schedule at most one job per time slot to maximize total profit. All jobs take 1 unit of time. Greedy: sort jobs by profit descending. For each job, assign it to the latest available slot at or before its deadline.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'array'],
      },
      {
        id: 'lemonade-change',
        title: 'Lemonade Change',
        difficulty: 'Easy',
        leetcodeNumber: 860,
        description:
          'At a lemonade stand each lemonade costs $5. Customers pay with $5, $10, or $20 bills. Return true if you can give every customer correct change. Greedy: when making $15 change for a $20, prefer to give a $10+$5 (keep fewer large bills), fall back to three $5s.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'simulation'],
      },
      {
        id: 'maximum-units-on-truck',
        title: 'Maximum Units on a Truck',
        difficulty: 'Easy',
        leetcodeNumber: 1710,
        description:
          'Given box types where each has a quantity and units-per-box, and a truck with a capacity (max number of boxes), maximize total units loaded. Greedy: sort box types by units-per-box descending. Load as many boxes of the highest-unit type as possible before moving to the next type.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'array'],
      },
      {
        id: 'minimum-platforms',
        title: 'Minimum Platforms',
        difficulty: 'Medium',
        description:
          'Find the minimum number of railway platforms needed so no train has to wait. Sort arrival and departure arrays. Use two pointers: if the next event is an arrival, increment platforms needed; if departure, decrement. Track the maximum simultaneously needed platforms.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'interval'],
      },
      {
        id: 'partition-labels',
        title: 'Partition Labels',
        difficulty: 'Medium',
        leetcodeNumber: 763,
        description:
          'Partition a string into as many parts as possible so that each letter appears in at most one part. Greedy: first record the last occurrence of each character. Then sweep the string: extend the current partition end to the last occurrence of the current character. When i reaches the partition end, record a partition.',
        hasVisualization: true,
        tags: ['greedy', 'string', 'two-pointers'],
      },
    
      {
        id: 'advantage-shuffle',
        title: 'Advantage Shuffle',
        leetcodeNumber: 870,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given arrays nums1 and nums2, rearrange nums1 to maximize the number of positions where nums1[i] > nums2[i]. Greedy: sort nums1; for each nums2 element (largest first), if the largest remaining nums1 element beats it, assign it; otherwise assign the smallest (sacrifice it).',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'two pointers', 'array'],
      },
      {
        id: 'bag-of-tokens',
        title: 'Bag of Tokens',
        leetcodeNumber: 948,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given token values and initial power, maximize your score. Play a token face-up (spend power equal to token, gain 1 score) or face-down (spend 1 score, gain power equal to token). Greedily play the cheapest token face-up when possible, or play the most expensive face-down when score > 0.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'two pointers', 'array'],
      },
      {
        id: 'boats-to-save-people-ii',
        title: 'Boats to Save People (Detailed)',
        leetcodeNumber: 881,
        difficulty: 'Medium' as Difficulty,
        description:
          'Each boat carries at most 2 people with weight limit. Greedy: sort people by weight. Use two pointers. Try to pair the heaviest person with the lightest; if they exceed the limit, the heaviest goes alone. Count total boats used, tracking each pairing decision.',
        hasVisualization: true,
        tags: ['greedy', 'two pointers', 'sorting', 'array'],
      },
      {
        id: 'broken-calculator',
        title: 'Broken Calculator',
        leetcodeNumber: 991,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given startValue and target, use a broken calculator that can only double the displayed number or subtract 1. Find the minimum number of operations to reach target from startValue. Work backwards from target: if target > startValue, halve it (if even) or add 1 (if odd); else subtract.',
        hasVisualization: true,
        tags: ['greedy', 'math'],
      },
      {
        id: 'can-jump-to-end',
        title: 'Jump Game III',
        leetcodeNumber: 1306,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array and a start index, from index i you can jump to i+arr[i] or i-arr[i]. Determine if you can reach any index with value 0. Use BFS/DFS to explore all reachable indices. Greedy: track visited indices to avoid revisiting.',
        hasVisualization: true,
        tags: ['greedy', 'BFS', 'DFS', 'array', 'graph'],
      },
      {
        id: 'candy-crush',
        title: 'Candy Crush Simulation',
        leetcodeNumber: 723,
        difficulty: 'Medium' as Difficulty,
        description:
          'Simulate a simplified 1D candy crush: given an array of candy types, repeatedly remove groups of 3 or more consecutive identical candies, then compact remaining candies leftward. Repeat until no more removals are possible.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'simulation', 'two pointers'],
      },
      {
        id: 'car-pooling',
        title: 'Car Pooling',
        leetcodeNumber: 1094,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given trips [numPassengers, from, to] and car capacity, determine if all trips can be completed. Use a difference array (bucket sort by stop) to track net passenger changes at each location. At each point check if capacity is exceeded.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'sorting', 'prefix sum'],
      },
      {
        id: 'course-schedule-greedy',
        title: 'Course Schedule III (Greedy)',
        leetcodeNumber: 630,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given courses [duration, deadline], find the maximum number of courses you can take. Greedy: sort by deadline. Use a max-heap of durations taken so far. For each course, if it fits add it; if it does not fit but is shorter than the longest taken course, swap to improve future options.',
        hasVisualization: true,
        tags: ['greedy', 'heap', 'sorting', 'array'],
      },
      {
        id: 'gas-station-ii',
        title: 'Gas Station (Detailed Tracking)',
        leetcodeNumber: 134,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given gas[i] (gas at station i) and cost[i] (gas to reach next station), find the starting station index to complete a circular route, or -1 if impossible. Greedy: if total gas >= total cost a solution exists. Track running tank; when it goes negative, reset start to next station.',
        hasVisualization: true,
        tags: ['greedy', 'array'],
      },
      {
        id: 'hand-of-straights',
        title: 'Hand of Straights',
        leetcodeNumber: 846,
        difficulty: 'Medium' as Difficulty,
        description:
          'Determine if a hand of cards can be rearranged into groups of groupSize consecutive cards. Greedy: sort the unique card values. For each smallest remaining card, try to form a consecutive group of groupSize starting from it. Fail if any required next card is missing.',
        hasVisualization: true,
        tags: ['greedy', 'hash map', 'sorting', 'array'],
      },
      {
        id: 'increasing-triplet-subsequence',
        title: 'Increasing Triplet Subsequence',
        leetcodeNumber: 334,
        difficulty: 'Medium' as Difficulty,
        description:
          'Determine if there exist indices i < j < k such that nums[i] < nums[j] < nums[k]. Greedy: maintain the smallest first element (first) and smallest second element (second). If any number exceeds second, a triplet exists.',
        hasVisualization: true,
        tags: ['greedy', 'array'],
      },
      {
        id: 'jump-game-greedy',
        title: 'Jump Game (Greedy)',
        leetcodeNumber: 55,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array where each element represents the maximum jump length from that position, determine if you can reach the last index. The greedy approach tracks the farthest reachable index as we iterate, stopping early if the current position is unreachable.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'dynamic programming'],
      },
      {
        id: 'longest-happy-string',
        title: 'Longest Happy String',
        leetcodeNumber: 1405,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given counts a, b, c for characters "a", "b", "c", construct the longest string using at most a "a"s, b "b"s, c "c"s such that no three consecutive characters are the same. Greedy: always pick the character with the highest remaining count, unless it would create three in a row; in that case pick the second highest.',
        hasVisualization: true,
        tags: ['greedy', 'heap', 'string'],
      },
      {
        id: 'maximum-ice-cream-bars',
        title: 'Maximum Ice Cream Bars',
        leetcodeNumber: 1833,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given ice cream bar costs and a budget of coins, find the maximum number of bars that can be bought. Greedy: sort costs in ascending order and greedily buy the cheapest bars first until the budget runs out.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'array'],
      },
      {
        id: 'maximum-number-of-events',
        title: 'Maximum Number of Events That Can Be Attended',
        leetcodeNumber: 1353,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given events [startDay, endDay], attend at most one event per day to maximize the number attended. Greedy: on each day, among all events that have started and not yet ended, attend the one ending soonest (min-heap by end day). This prevents missing events with tight deadlines.',
        hasVisualization: true,
        tags: ['greedy', 'heap', 'sorting', 'array'],
      },
      {
        id: 'minimum-cost-to-move-chips',
        title: 'Minimum Cost to Move Chips to Same Position',
        leetcodeNumber: 1217,
        difficulty: 'Easy' as Difficulty,
        description:
          'Chips can be moved 2 positions for free, or 1 position for cost 1. So all chips at even positions can meet at any even position for free, and same for odd. The answer is the minimum of: count of chips at odd positions vs count at even positions.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'math'],
      },
      {
        id: 'minimum-deletions-to-make-character-frequencies-unique',
        title: 'Minimum Deletions to Make Character Frequencies Unique',
        leetcodeNumber: 1647,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string, find the minimum number of character deletions so that no two distinct characters have the same frequency. Sort frequencies descending; if a frequency is already taken, reduce it by 1 (and repeat until it finds a free slot or reaches 0).',
        hasVisualization: true,
        tags: ['greedy', 'hash map', 'sorting', 'string'],
      },
      {
        id: 'minimum-number-of-arrows-ii',
        title: 'Minimum Number of Arrows to Burst Balloons (Detailed)',
        leetcodeNumber: 452,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given balloons as [xstart, xend] intervals on a horizontal axis, find the minimum number of arrows shot vertically to burst all balloons. Greedy: sort by end coordinate. Shoot an arrow at the first balloon end; it bursts all overlapping balloons. Repeat for remaining.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'intervals', 'array'],
      },
      {
        id: 'minimum-number-of-platforms',
        title: 'Minimum Number of Platforms',
        difficulty: 'Medium' as Difficulty,
        description:
          'Given arrival and departure times of trains, find the minimum number of platforms required so no train waits. Sort both arrays, then use a two-pointer greedy: when a train arrives before another departs, add a platform; when a train departs, free a platform.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'two pointers', 'array'],
      },
      {
        id: 'minimum-rounds-to-complete-tasks',
        title: 'Minimum Rounds to Complete All Tasks',
        leetcodeNumber: 2244,
        difficulty: 'Medium' as Difficulty,
        description:
          'Each round you can complete 2 or 3 tasks of the same difficulty. Given task difficulties, find the minimum number of rounds to complete all tasks, or -1 if impossible. Greedy: for each difficulty group of size n, use as many rounds of 3 as possible (n // 3), and handle the remainder with 1 or 2 extra rounds.',
        hasVisualization: true,
        tags: ['greedy', 'hash map', 'array', 'math'],
      },
      {
        id: 'queue-reconstruction-by-height',
        title: 'Queue Reconstruction by Height',
        leetcodeNumber: 406,
        difficulty: 'Medium' as Difficulty,
        description:
          'Each person is described by [height, k] where k is the number of people in front with height >= theirs. Sort by height descending (ties broken by k ascending), then insert each person at position k. Taller people are placed first so insertions remain valid.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'sorting'],
      },
      {
        id: 'reduce-array-size-to-half',
        title: 'Reduce Array Size to The Half',
        leetcodeNumber: 1338,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array, find the minimum number of unique integers to remove such that at least half of the array elements are removed. Greedy: sort element frequencies in descending order and keep removing the most frequent element until we have removed at least half the array.',
        hasVisualization: true,
        tags: ['greedy', 'hash map', 'sorting', 'array'],
      },
      {
        id: 'split-array-into-consecutive-subsequences',
        title: 'Split Array into Consecutive Subsequences',
        leetcodeNumber: 659,
        difficulty: 'Medium' as Difficulty,
        description:
          'Determine if a sorted array can be split into subsequences of length 3 or more, each consisting of consecutive integers. Greedily: for each number, prefer appending it to an existing subsequence ending at num-1; if none exists, try starting a new one (num, num+1, num+2).',
        hasVisualization: true,
        tags: ['greedy', 'hash map', 'array', 'sorting'],
      },
      {
        id: 'task-scheduler-ii',
        title: 'Task Scheduler (Greedy Approach)',
        leetcodeNumber: 621,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a list of CPU tasks and a cooldown period n, find the minimum number of intervals to finish all tasks. The greedy insight is that the answer depends on the most frequent task. Fill idle slots with other tasks or idle time.',
        hasVisualization: true,
        tags: ['greedy', 'hash map', 'array', 'sorting'],
      },
      {
        id: 'two-city-scheduling',
        title: 'Two City Scheduling',
        leetcodeNumber: 1029,
        difficulty: 'Medium' as Difficulty,
        description:
          'A company must send n people to city A and n people to city B. Given costs[i] = [costA, costB] for each person, minimize total cost. Greedily: sort by the difference (costA - costB) and send the first n people to city A (those who most prefer A), and the rest to city B.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'array'],
      },
    
      {
        id: 'assign-cookies-greedy',
        title: 'Assign Cookies (Greedy)',
        leetcodeNumber: 455,
        difficulty: 'Easy' as Difficulty,
        description:
          'Each child i has a greed factor g[i] and each cookie j has size s[j]. A cookie satisfies a child if s[j] >= g[i]. Maximize the number of content children. Greedy: sort both arrays and use two pointers to greedily match the smallest sufficient cookie to the least greedy child.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'two pointers'],
      },
      {
        id: 'best-time-to-buy-sell-greedy',
        title: 'Best Time to Buy and Sell Stock II (Unlimited Transactions)',
        leetcodeNumber: 122,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given daily stock prices, you can buy and sell on any day but can hold at most one stock at a time. Maximize total profit with any number of transactions. Greedy insight: collect profit from every upward price movement. If prices[i] > prices[i-1], add that difference to profit.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'dynamic programming'],
      },
      {
        id: 'candy-distribution',
        title: 'Candy Distribution',
        leetcodeNumber: 135,
        difficulty: 'Hard' as Difficulty,
        description:
          'There are n children standing in a line. Each child is assigned a rating value. Distribute candies such that each child has at least one candy, and children with a higher rating than their neighbors get more candies. Find the minimum total candies needed. The greedy approach uses two passes: left-to-right to satisfy left neighbors, then right-to-left to satisfy right neighbors.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'two passes'],
      },
      {
        id: 'earliest-possible-day-of-full-bloom',
        title: 'Earliest Possible Day of Full Bloom',
        leetcodeNumber: 2136,
        difficulty: 'Hard' as Difficulty,
        description:
          'You have n flower seeds. Each seed i takes plantTime[i] days to plant and growTime[i] days to grow after planting. You can plant only one seed per day. Find the earliest possible day when all flowers are in full bloom. The greedy key insight: sort seeds by growTime in descending order - seeds that take longer to grow should be planted first.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'scheduling'],
      },
      {
        id: 'gas-station-greedy',
        title: 'Gas Station (Greedy)',
        leetcodeNumber: 134,
        difficulty: 'Medium' as Difficulty,
        description:
          'There are n gas stations in a circle. The i-th station has gas[i] fuel and costs cost[i] to travel to the next. Find the starting station index where you can complete the circuit, or -1 if impossible. Greedy: if total gas >= total cost, a solution exists. Track the running tank; when it goes negative, reset start to the next station.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'circular'],
      },
      {
        id: 'jump-game-greedy-iii',
        title: 'Jump Game (Greedy - Can Reach End)',
        leetcodeNumber: 55,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of non-negative integers representing jump lengths, determine if you can reach the last index from index 0. Greedy approach: track the farthest index reachable. If at any point the current index exceeds the farthest reachable, return false. Otherwise return true.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'dynamic programming'],
      },
      {
        id: 'lemonade-change-greedy',
        title: 'Lemonade Change (Greedy)',
        leetcodeNumber: 860,
        difficulty: 'Easy' as Difficulty,
        description:
          'At a lemonade stand, each cup costs $5. Customers pay with $5, $10, or $20 bills. Give correct change to every customer. Return true if you can give correct change to all customers. Greedy: for a $20 bill, prefer to give $10+$5 change over $5+$5+$5, since $10 bills are less versatile.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'simulation'],
      },
      {
        id: 'maximum-bags-with-full-capacity',
        title: 'Maximum Bags With Full Capacity of Rocks',
        leetcodeNumber: 2279,
        difficulty: 'Medium' as Difficulty,
        description:
          'There are n bags where the i-th bag has a capacity and currently holds some rocks. You have additionalRocks to distribute. Maximize the number of bags that are completely full. Greedy approach: sort bags by remaining capacity (capacity - rocks) ascending and greedily fill the easiest bags first.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'array'],
      },
      {
        id: 'maximum-element-after-decreasing-rearranging',
        title: 'Maximum Value After Insertion',
        leetcodeNumber: 1846,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of positive integers, you may: rearrange elements in any order, and replace any element with a smaller or equal value. Find the maximum possible value of the last element. Greedy: sort ascending, then for each position i (1-indexed), set arr[i] = min(arr[i], i). The answer is the last element.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'array'],
      },
      {
        id: 'maximum-length-of-subarray-with-positive-product',
        title: 'Maximum Length of Subarray With Positive Product',
        leetcodeNumber: 1567,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of integers, find the maximum length of a subarray with a positive product. Greedy: track two lengths - pos (length of longest subarray ending here with positive product) and neg (length with negative product). When encountering a positive number, both extend; negative number swaps pos and neg; zero resets both.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'dynamic programming'],
      },
      {
        id: 'maximum-total-beauty-of-gardens',
        title: 'Maximum Total Beauty of the Gardens',
        leetcodeNumber: 2234,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given flower gardens with current counts, a target, full points, partial points, and newFlowers budget, maximize total beauty. Full gardens give full points, incomplete gardens give partial * min flower count among incomplete. Greedy: sort, use prefix sums to efficiently compute optimal split between how many gardens to complete vs maximize the minimum of the rest.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'binary search', 'prefix sum'],
      },
      {
        id: 'meeting-rooms-greedy',
        title: 'Meeting Rooms (Can Attend All)',
        leetcodeNumber: 252,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array of meeting time intervals where intervals[i] = [start, end], determine if a person can attend all meetings. Sort by start time and check if any meeting starts before the previous one ends.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'intervals'],
      },
      {
        id: 'minimize-maximum-of-array',
        title: 'Minimize Maximum of Array',
        leetcodeNumber: 2439,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of non-negative integers, you can perform operations: choose index i > 0 and decrease nums[i] by 1, increase nums[i-1] by 1. Find the minimum possible maximum value after any number of operations. The greedy insight is that the optimal answer for prefix [0..i] is ceil(prefixSum[i] / (i+1)), and we take the max over all prefixes.',
        hasVisualization: true,
        tags: ['greedy', 'prefix sum', 'math', 'array'],
      },
      {
        id: 'minimum-adjacent-swaps-kth-smallest',
        title: 'Minimum Adjacent Swaps to Reach the Kth Smallest Number',
        leetcodeNumber: 1850,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a number string and integer k, find the minimum adjacent swaps needed to reach the kth smallest numeric permutation greater than the current number. Step 1: find the kth next permutation greedily. Step 2: count adjacent swaps to transform the original into the target digit sequence.',
        hasVisualization: true,
        tags: ['greedy', 'string', 'permutation', 'two pointers'],
      },
      {
        id: 'minimum-number-of-arrows-greedy',
        title: 'Minimum Number of Arrows to Burst Balloons (Greedy)',
        leetcodeNumber: 452,
        difficulty: 'Medium' as Difficulty,
        description:
          'Balloons are spread along a horizontal axis with their horizontal diameters given by [xstart, xend]. An arrow shot at position x bursts all balloons with xstart <= x <= xend. Find the minimum number of arrows needed. Greedy: sort by end position, shoot at the end of each balloon, which may burst multiple overlapping ones.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'intervals'],
      },
      {
        id: 'minimum-number-of-groups',
        title: 'Divide Intervals Into Minimum Number of Groups',
        leetcodeNumber: 2406,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given intervals, partition them into groups where no two intervals in the same group overlap. Find the minimum number of groups needed. This equals the maximum number of overlapping intervals at any point, which can be found by sorting events (start/end) and sweeping with a counter.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'sweep line', 'intervals'],
      },
      {
        id: 'minimum-number-of-taps',
        title: 'Minimum Number of Taps to Open to Water a Garden',
        leetcodeNumber: 1326,
        difficulty: 'Hard' as Difficulty,
        description:
          'There is a one-dimensional garden from 0 to n. There are n+1 taps located at positions 0 through n. Given an array ranges where ranges[i] means the tap at position i can water the area [i-ranges[i], i+ranges[i]], find the minimum number of taps to open to water the entire garden. Uses a greedy interval-covering approach similar to Jump Game II.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'interval', 'dynamic programming'],
      },
      {
        id: 'minimum-operations-binary-array',
        title: 'Minimum Operations to Make Binary Array Elements Equal to One I',
        leetcodeNumber: 3191,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a binary array, in one operation you can flip 3 consecutive elements. Find the minimum number of operations to make all elements 1, or return -1 if impossible. Greedy approach: scan left to right and whenever we find a 0, flip the next 3 elements. If a 0 remains in the last 2 positions, it is impossible.',
        hasVisualization: true,
        tags: ['greedy', 'array', 'sliding window', 'binary'],
      },
      {
        id: 'monotone-increasing-digits',
        title: 'Monotone Increasing Digits',
        leetcodeNumber: 738,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer n, find the largest number <= n whose digits are non-decreasing (monotone increasing). Greedy: scan right to left. When digits[i-1] > digits[i], decrement digits[i-1] and mark position i and beyond as 9.',
        hasVisualization: true,
        tags: ['greedy', 'string', 'math'],
      },
      {
        id: 'non-overlapping-intervals-greedy',
        title: 'Non-overlapping Intervals (Greedy)',
        leetcodeNumber: 435,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array of intervals, find the minimum number of intervals to remove to make the rest non-overlapping. Greedy: sort by end time, greedily keep intervals that finish earliest. When an overlap is found, remove the one with the later end time (i.e., keep the current one and skip the new overlapping one).',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'intervals'],
      },
      {
        id: 'put-marbles-in-bags',
        title: 'Put Marbles in Bags',
        leetcodeNumber: 2551,
        difficulty: 'Hard' as Difficulty,
        description:
          'You have k bags and n marbles with weights. Distribute marbles into k non-empty groups (contiguous subarrays). The score of each bag is the sum of the first and last marble weights. Find the difference between maximum and minimum scores. Key insight: each split point i contributes weights[i] + weights[i+1] to the score. Pick the k-1 largest split costs for max and smallest for min.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'array'],
      },
      {
        id: 'reducing-dishes',
        title: 'Reducing Dishes',
        leetcodeNumber: 1402,
        difficulty: 'Hard' as Difficulty,
        description:
          'A chef has n dishes with satisfaction levels. Cooking a dish at time t contributes satisfaction[i] * t to the like-time coefficient. You can cook any subset in any order. Maximize the total like-time coefficient. Greedy: sort descending, then greedily add dishes from the front as long as the running suffix sum is positive.',
        hasVisualization: true,
        tags: ['greedy', 'sorting', 'suffix sum'],
      },
      {
        id: 'remove-k-digits-greedy',
        title: 'Remove K Digits (Greedy Monotonic Stack)',
        leetcodeNumber: 402,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a non-negative integer as a string and integer k, remove k digits to produce the smallest possible number. Greedy: use a monotone increasing stack. When a digit is greater than the next digit, remove it (use k). Strip leading zeros from result.',
        hasVisualization: true,
        tags: ['greedy', 'stack', 'monotonic stack', 'string'],
      },
      {
        id: 'valid-parenthesis-string-greedy',
        title: 'Valid Parenthesis String (Greedy Low/High)',
        leetcodeNumber: 678,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a string with ',
        hasVisualization: true,
        tags: ['greedy', 'string', 'dynamic programming'],
      },
      {
        id: 'wildcard-matching-greedy',
        title: 'Wildcard Matching (Greedy)',
        leetcodeNumber: 44,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a string s and a pattern p with wildcards ',
        hasVisualization: true,
        tags: ['greedy', 'string', 'dynamic programming', 'two pointers'],
      },
    ],
  },

  // ─── 17. Sort And Search ───────────────────────────────────────────
  {
    id: 'sort-and-search',
    name: 'Sort And Search',
    icon: '⇅',
    color: 'text-red-400',
    gradient: 'from-red-500/20 to-red-600/10',
    borderColor: 'border-red-500/30',
    problems: [
      {
        id: 'sort-linked-list',
        title: 'Sort Linked List',
        difficulty: 'Medium',
        leetcodeNumber: 148,
        description:
          'Sort a linked list in O(n log n) time using merge sort with slow-fast pointer splitting.',
        hasVisualization: true,
        tags: ['sorting', 'linked-list', 'merge-sort'],
      },
      {
        id: 'sort-array',
        title: 'Sort Array',
        difficulty: 'Medium',
        leetcodeNumber: 912,
        description:
          'Implement an efficient sorting algorithm such as merge sort or quicksort for an integer array.',
        hasVisualization: true,
        tags: ['sorting', 'array', 'divide-and-conquer'],
      },
      {
        id: 'kth-largest-integer',
        title: 'Kth Largest Integer',
        difficulty: 'Medium',
        leetcodeNumber: 215,
        description:
          'Find the kth largest element using quickselect for average O(n) time without full sorting.',
        hasVisualization: true,
        tags: ['sorting', 'array', 'quickselect'],
      },
      {
        id: 'dutch-national-flag',
        title: 'Dutch National Flag',
        difficulty: 'Medium',
        leetcodeNumber: 75,
        description:
          'Sort an array of 0s, 1s, and 2s in-place in a single pass using three-way partitioning.',
        hasVisualization: true,
        tags: ['sorting', 'array', 'two-pointers'],
      },
      {
        id: 'bubble-sort-visualization',
        title: 'Bubble Sort',
        difficulty: 'Easy',
        description:
          'Repeatedly compare adjacent pairs and swap them if out of order. After each full pass, the largest unsorted element ',
        hasVisualization: true,
        tags: ['sorting', 'bubble', 'in-place', 'stable', 'comparison'],
      },
      {
        id: 'counting-sort-visualization',
        title: 'Counting Sort',
        difficulty: 'Easy',
        description:
          'Sort integers by counting occurrences of each value. Compute a count array, accumulate prefix sums to get positions, then place each element at its correct index. O(n + k) time and space where k is the range of values. Non-comparison based sorting.',
        hasVisualization: true,
        tags: ['sorting', 'counting', 'non-comparison', 'linear-time', 'integer'],
      },
      {
        id: 'heap-sort-visualization',
        title: 'Heap Sort',
        difficulty: 'Medium',
        description:
          'Build a max-heap from the array in O(n) time, then repeatedly extract the maximum element (root) and place it at the end of the array. Each extraction is O(log n), giving O(n log n) total. In-place with O(1) extra space.',
        hasVisualization: true,
        tags: ['sorting', 'heap', 'max-heap', 'in-place', 'comparison'],
      },
      {
        id: 'insertion-sort-visualization',
        title: 'Insertion Sort',
        difficulty: 'Easy',
        description:
          'Build a sorted portion of the array one element at a time. For each element, shift all larger elements in the sorted portion one position right, then insert the current element into its correct position. O(n^2) worst case, O(n) best case (already sorted).',
        hasVisualization: true,
        tags: ['sorting', 'insertion', 'in-place', 'stable'],
      },
      {
        id: 'largest-number-from-array',
        title: 'Largest Number',
        difficulty: 'Medium',
        leetcodeNumber: 179,
        description:
          'Arrange non-negative integers to form the largest possible number. Key insight: compare two numbers a and b by checking whether concatenation ',
        hasVisualization: true,
        tags: ['sorting', 'reedy', 'custom-comparator', 'string', 'number'],
      },
      {
        id: 'merge-sort-visualization',
        title: 'Merge Sort',
        difficulty: 'Medium',
        description:
          'Divide-and-conquer sorting algorithm. Recursively split the array into halves until single elements remain, then merge sorted halves back together by comparing and placing elements in order. Achieves O(n log n) time and O(n) space.',
        hasVisualization: true,
        tags: ['sorting', 'divide-and-conquer', 'merge', 'recursion'],
      },
      {
        id: 'quick-sort-visualization',
        title: 'Quick Sort',
        difficulty: 'Medium',
        description:
          'Partition-based sorting algorithm. Select a pivot element, partition the array so all elements smaller than the pivot are on its left and all larger are on its right, then recursively sort each partition. Average O(n log n) time, O(log n) space.',
        hasVisualization: true,
        tags: ['sorting', 'divide-and-conquer', 'partition', 'pivot', 'recursion'],
      },
      {
        id: 'radix-sort-visualization',
        title: 'Radix Sort',
        difficulty: 'Medium',
        description:
          'Non-comparison integer sort. Process digits from least significant to most significant (LSD). For each digit position, use counting sort as a stable subroutine to group elements by that digit. O(d*(n+k)) time where d is digits, k=10. Handles integers without comparisons.',
        hasVisualization: true,
        tags: ['sorting', 'radix', 'non-comparison', 'lsd', 'digit', 'counting-sort'],
      },
      {
        id: 'selection-sort-visualization',
        title: 'Selection Sort',
        difficulty: 'Easy',
        description:
          'Find the minimum element from the unsorted portion and swap it with the first unsorted element. Repeat for each position. O(n^2) comparisons but only O(n) swaps — useful when writes are expensive. Not stable in the standard implementation.',
        hasVisualization: true,
        tags: ['sorting', 'selection', 'in-place', 'minimum', 'comparison'],
      },
      {
        id: 'wiggle-sort-ii',
        title: 'Wiggle Sort II',
        difficulty: 'Medium',
        leetcodeNumber: 324,
        description:
          'Reorder array so that nums[0] < nums[1] > nums[2] < nums[3]... Sort the array, then interleave: place the larger half at odd positions (descending) and the smaller half at even positions (descending). This ensures strict inequalities even with duplicates.',
        hasVisualization: true,
        tags: ['sorting', 'wiggle', 'interleave', 'array', 'median'],
      },
    
      {
        id: 'bucket-sort-visualization',
        title: 'Bucket Sort Visualization',
        difficulty: 'Medium' as Difficulty,
        description:
          'Bucket sort distributes elements into a number of buckets, sorts each bucket individually (typically with insertion sort), then concatenates. Works well when input is uniformly distributed over a range. Time complexity is O(n + k) average case. Each element is placed in bucket floor(val / bucketSize). Good for floating-point values in [0, 1].',
        hasVisualization: true,
        tags: ['sorting', 'bucket', 'distribution sort', 'counting'],
      },
      {
        id: 'pancake-sorting',
        title: 'Pancake Sorting',
        leetcodeNumber: 969,
        difficulty: 'Medium' as Difficulty,
        description:
          'Sort an array using only pancake flips. A pancake flip of k reverses the first k elements of the array. To sort: find the largest unsorted element, flip it to the front (if not already there), then flip it to its correct position at the end of the unsorted region. Repeat for decreasing subarray sizes. Produces at most 2*(n-1) flips.',
        hasVisualization: true,
        tags: ['sorting', 'greedy', 'simulation', 'array'],
      },
      {
        id: 'shell-sort-visualization',
        title: 'Shell Sort Visualization',
        difficulty: 'Medium' as Difficulty,
        description:
          'Shell sort is a generalization of insertion sort. It starts by sorting elements far apart from each other and progressively reducing the gap. Common gap sequence: n/2, n/4, ..., 1. For each gap, perform an insertion sort on elements spaced "gap" apart. When gap=1, this is a standard insertion sort on a nearly-sorted array.',
        hasVisualization: true,
        tags: ['sorting', 'insertion sort', 'gap sequence', 'in-place'],
      },
      {
        id: 'sort-an-array-merge-sort',
        title: 'Sort an Array (Merge Sort)',
        leetcodeNumber: 912,
        difficulty: 'Medium' as Difficulty,
        description:
          'Sort an array using merge sort. Divide the array in half recursively until subarrays have one element, then merge sorted halves back together. At each merge step, compare elements from the left and right halves and place the smaller one. Time: O(n log n), Space: O(n). Stable sort with predictable performance.',
        hasVisualization: true,
        tags: ['sorting', 'merge sort', 'divide and conquer', 'recursion'],
      },
      {
        id: 'three-way-partition',
        title: 'Three-Way Partition (Dutch National Flag)',
        difficulty: 'Medium' as Difficulty,
        description:
          'The three-way partition (Dutch National Flag problem by Dijkstra) partitions an array into three groups: elements less than pivot, elements equal to pivot, and elements greater than pivot. Uses three pointers: low, mid, and high. Efficiently handles arrays with many duplicates, improving quicksort to O(n log n) even with repeated elements.',
        hasVisualization: true,
        tags: ['sorting', 'quicksort', 'partition', 'dutch national flag', 'three pointers'],
      },
      {
        id: 'tim-sort-visualization',
        title: 'TimSort Visualization',
        difficulty: 'Hard' as Difficulty,
        description:
          'TimSort is a hybrid sorting algorithm derived from merge sort and insertion sort. It divides the array into small "runs" (typically 32-64 elements) and sorts each with insertion sort, then merges the runs using merge sort. Designed for real-world data that often has naturally ordered subsequences. Used in Python and Java built-in sort.',
        hasVisualization: true,
        tags: ['sorting', 'merge sort', 'insertion sort', 'hybrid', 'adaptive'],
      },
    
      {
        id: 'custom-sort-string-iii',
        title: 'Custom Sort String III',
        leetcodeNumber: 791,
        difficulty: 'Medium' as Difficulty,
        description:
          'LC 791: Reorder string s so characters appear in the same relative order as in string order. Characters not in order can be placed anywhere. Use a frequency map and build the result.',
        hasVisualization: true,
        tags: ['Sorting', 'Hash Map', 'String', 'Greedy'],
      },
      {
        id: 'find-first-and-last-position-ii',
        title: 'Find First and Last Position II',
        leetcodeNumber: 34,
        difficulty: 'Medium' as Difficulty,
        description:
          'LC 34: Find the starting and ending position of a target in a sorted array. Run binary search twice: once biased left (first occurrence), once biased right (last occurrence). O(log n).',
        hasVisualization: true,
        tags: ['Binary Search', 'Array', 'Sorting'],
      },
      {
        id: 'find-minimum-in-rotated-sorted-array-ii-search',
        title: 'Find Minimum in Rotated Sorted Array II',
        leetcodeNumber: 154,
        difficulty: 'Hard' as Difficulty,
        description:
          'LC 154: Find minimum in a rotated sorted array that may contain duplicates. Binary search with duplicate handling: when nums[mid]==nums[hi], shrink hi by 1. Worst case O(n).',
        hasVisualization: true,
        tags: ['Binary Search', 'Array', 'Divide and Conquer', 'Sorting', 'Duplicates'],
      },
      {
        id: 'insertion-sort-ii',
        title: 'Insertion Sort II',
        difficulty: 'Easy' as Difficulty,
        description:
          'Insertion sort variant: build a sorted subarray by repeatedly picking the next element and inserting it into its correct position via backward shifting. Time: O(n²), Space: O(1).',
        hasVisualization: true,
        tags: ['Sorting', 'Insertion Sort', 'In-place', 'Stable'],
      },
      {
        id: 'kth-largest-element-ii',
        title: 'Kth Largest Element II',
        leetcodeNumber: 215,
        difficulty: 'Medium' as Difficulty,
        description:
          'LC 215: Find the kth largest element in an unsorted array. Uses Quickselect for average O(n) time. Partition around a pivot and recurse on the relevant side.',
        hasVisualization: true,
        tags: ['Sorting', 'Array', 'Quickselect', 'Divide and Conquer', 'Heap'],
      },
      {
        id: 'kth-smallest-element-in-bst-ii',
        title: 'Kth Smallest Element in BST II',
        leetcodeNumber: 230,
        difficulty: 'Medium' as Difficulty,
        description:
          'LC 230: Find the kth smallest element in a BST. Inorder traversal of BST visits nodes in ascending order. Simulate inorder traversal and return the kth visited node.',
        hasVisualization: true,
        tags: ['Binary Search', 'Tree', 'Depth-First Search', 'BST', 'Sorting'],
      },
      {
        id: 'pancake-sorting-ii',
        title: 'Pancake Sorting II',
        leetcodeNumber: 969,
        difficulty: 'Medium' as Difficulty,
        description:
          'LC 969: Sort array using pancake flips. A k-flip reverses the first k elements. For each pass, find the max in unsorted portion, flip it to front, then flip to correct position.',
        hasVisualization: true,
        tags: ['Sorting', 'Array', 'Two Pointers', 'Greedy'],
      },
      {
        id: 'peak-index-in-mountain-array-ii',
        title: 'Peak Index in Mountain Array II',
        leetcodeNumber: 852,
        difficulty: 'Medium' as Difficulty,
        description:
          'LC 852: Find the peak index in a mountain array. Binary search: if arr[mid] < arr[mid+1] then peak is to the right, else peak is at or to the left. O(log n).',
        hasVisualization: true,
        tags: ['Binary Search', 'Array', 'Sorting', 'Mountain Array'],
      },
      {
        id: 'relative-sort-array-ii',
        title: 'Relative Sort Array II',
        leetcodeNumber: 1122,
        difficulty: 'Easy' as Difficulty,
        description:
          'LC 1122: Sort arr1 such that elements appear in the same relative order as arr2. Elements not in arr2 appear at end sorted in ascending order.',
        hasVisualization: true,
        tags: ['Sorting', 'Array', 'Hash Map', 'Custom Sort'],
      },
      {
        id: 'search-a-2d-matrix-ii-search',
        title: 'Search a 2D Matrix II',
        leetcodeNumber: 240,
        difficulty: 'Medium' as Difficulty,
        description:
          'LC 240: Search in an m×n matrix where each row and column is sorted. Start from top-right: if target < current, move left; if target > current, move down. O(m+n).',
        hasVisualization: true,
        tags: ['Binary Search', 'Array', 'Divide and Conquer', 'Matrix', 'Sorting'],
      },
      {
        id: 'selection-sort-ii',
        title: 'Selection Sort II',
        difficulty: 'Easy' as Difficulty,
        description:
          'Selection sort variant: repeatedly find the minimum element from the unsorted portion and place it at the beginning. Time: O(n²), Space: O(1). Minimizes swaps.',
        hasVisualization: true,
        tags: ['Sorting', 'Selection Sort', 'In-place', 'Comparison'],
      },
      {
        id: 'sort-an-array',
        title: 'Sort an Array',
        leetcodeNumber: 912,
        difficulty: 'Medium' as Difficulty,
        description:
          'LC 912: Sort an array of integers in ascending order. Uses heap sort for O(n log n) time and O(1) space without the built-in sort function.',
        hasVisualization: true,
        tags: ['Sorting', 'Array', 'Heap Sort', 'Divide and Conquer'],
      },
      {
        id: 'sort-array-by-increasing-frequency-ii',
        title: 'Sort Array by Increasing Frequency II',
        leetcodeNumber: 1636,
        difficulty: 'Easy' as Difficulty,
        description:
          'LC 1636: Sort the array such that elements with lower frequency come first. Break ties by sorting elements with higher value first.',
        hasVisualization: true,
        tags: ['Sorting', 'Array', 'Hash Map', 'Custom Sort'],
      },
      {
        id: 'sort-list-ii',
        title: 'Sort List II',
        leetcodeNumber: 148,
        difficulty: 'Medium' as Difficulty,
        description:
          'LC 148: Sort a linked list in O(n log n) time and O(1) space. Uses bottom-up merge sort to avoid recursion stack. Find sublist sizes of 1, 2, 4, 8... and merge pairs.',
        hasVisualization: true,
        tags: ['Sorting', 'Linked List', 'Merge Sort', 'Bottom-up'],
      },
      {
        id: 'top-k-frequent-elements-ii',
        title: 'Top K Frequent Elements II',
        leetcodeNumber: 347,
        difficulty: 'Medium' as Difficulty,
        description:
          'LC 347: Return the k most frequent elements. Uses bucket sort by frequency. Build frequency map, place in buckets indexed by frequency, scan from highest bucket.',
        hasVisualization: true,
        tags: ['Sorting', 'Hash Map', 'Bucket Sort', 'Heap', 'Top K'],
      },
    ],
  },

  // ─── 18. Bit Manipulation ──────────────────────────────────────────
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    icon: '⊕',
    color: 'text-slate-400',
    gradient: 'from-slate-500/20 to-slate-600/10',
    borderColor: 'border-slate-500/30',
    problems: [
      {
        id: 'hamming-weights-of-integers',
        title: 'Hamming Weights of Integers',
        difficulty: 'Easy',
        leetcodeNumber: 338,
        description:
          'Count the number of 1-bits for every integer from 0 to n using DP on the least significant bit.',
        hasVisualization: true,
        tags: ['bit-manipulation', 'dynamic-programming'],
      },
      {
        id: 'lonely-integer',
        title: 'Lonely Integer',
        difficulty: 'Easy',
        leetcodeNumber: 136,
        description:
          'Find the single element that appears only once in an array where every other element appears twice using XOR.',
        hasVisualization: true,
        tags: ['bit-manipulation', 'array'],
      },
      {
        id: 'swap-odd-and-even-bits',
        title: 'Swap Odd and Even Bits',
        difficulty: 'Easy',
        description:
          'Swap all odd-positioned bits with even-positioned bits in an integer using bit masks and shifts.',
        hasVisualization: true,
        tags: ['bit-manipulation'],
      },
      {
        id: 'bitwise-and-of-range',
        title: 'Bitwise AND of Numbers Range',
        difficulty: 'Medium',
        leetcodeNumber: 201,
        description:
          'Find the bitwise AND of all numbers in the range [m, n]. Key insight: any bit that differs between m and n will become 0 in the AND result (because some number in the range will have it as 0). Find the common prefix of m and n in binary by right-shifting both until they are equal, then shift back left.',
        hasVisualization: true,
        tags: ['bit-manipulation', 'math'],
      },
      {
        id: 'missing-number',
        title: 'Missing Number',
        difficulty: 'Easy',
        leetcodeNumber: 268,
        description:
          'Find the missing number in an array containing n distinct numbers from 0 to n. Use XOR: XOR all array values with all indices 0..n. Since every number appears twice except the missing one, everything cancels out leaving the missing number. This works because a XOR a = 0 and a XOR 0 = a.',
        hasVisualization: true,
        tags: ['bit-manipulation', 'array', 'math'],
      },
      {
        id: 'number-of-1-bits',
        title: 'Number of 1 Bits',
        difficulty: 'Easy',
        leetcodeNumber: 191,
        description:
          'Count the number of 1 bits (Hamming weight) in an unsigned integer. Use Brian Kernighan\'s trick: n & (n-1) clears the lowest set bit. Count how many times we can do this until n becomes 0. Alternatively, check each bit with n & 1 and right-shift.',
        hasVisualization: true,
        tags: ['bit-manipulation', 'math'],
      },
      {
        id: 'power-of-two',
        title: 'Power of Two',
        difficulty: 'Easy',
        leetcodeNumber: 231,
        description:
          'Check if an integer n is a power of 2 using bit manipulation. A power of 2 has exactly one 1-bit. The trick: n & (n-1) clears the lowest set bit. If n > 0 and n & (n-1) == 0, then n has exactly one set bit, so it is a power of 2.',
        hasVisualization: true,
        tags: ['bit-manipulation', 'math'],
      },
      {
        id: 'reverse-bits',
        title: 'Reverse Bits',
        difficulty: 'Easy',
        leetcodeNumber: 190,
        description:
          'Reverse the bits of a 32-bit unsigned integer. Iterate 32 times: shift result left by 1, take the LSB of n with n & 1, add it to result, then shift n right by 1. After 32 iterations the bits are fully reversed.',
        hasVisualization: true,
        tags: ['bit-manipulation', 'math'],
      },
      {
        id: 'single-number-ii',
        title: 'Single Number II',
        difficulty: 'Medium',
        leetcodeNumber: 137,
        description:
          'Find the element that appears exactly once when all others appear exactly three times. For each bit position, count how many numbers have that bit set. The count mod 3 gives the bit of the unique number. We use two bitmasks (ones and twos) to track counts mod 3: ones = bits seen once, twos = bits seen twice.',
        hasVisualization: true,
        tags: ['bit-manipulation', 'array'],
      },
      {
        id: 'sum-of-two-integers',
        title: 'Sum of Two Integers',
        difficulty: 'Medium',
        leetcodeNumber: 371,
        description:
          'Add two integers without using + or - operators. XOR gives the sum without carries. AND shifted left gives the carry bits. Repeat until no carry remains. This simulates binary addition: XOR adds bit pairs, AND+shift propagates carries.',
        hasVisualization: true,
        tags: ['bit-manipulation', 'math'],
      },
    
      {
        id: 'binary-watch',
        title: 'Binary Watch',
        leetcodeNumber: 401,
        difficulty: 'Easy' as Difficulty,
        description:
          'A binary watch has 4 LEDs for hours (0-11) and 6 LEDs for minutes (0-59). Given the number of LEDs that are currently on, return all possible times. Iterate over all hour and minute combinations, counting set bits with popcount, and collect matches.',
        hasVisualization: true,
        tags: ['bit manipulation', 'backtracking', 'enumeration'],
      },
      {
        id: 'complement-of-base-10-integer',
        title: 'Complement of Base 10 Integer',
        leetcodeNumber: 1009,
        difficulty: 'Easy' as Difficulty,
        description:
          'The complement of an integer flips all bits in its binary representation. Given a positive integer n, return its complement. Create a bitmask with all 1s of the same bit length as n, then XOR n with the mask to flip all bits.',
        hasVisualization: true,
        tags: ['bit manipulation', 'math'],
      },
      {
        id: 'counting-bits-ii',
        title: 'Counting Bits',
        leetcodeNumber: 338,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer n, return an array ans of length n+1 where ans[i] is the number of 1 bits in the binary representation of i. Uses the recurrence: dp[i] = dp[i >> 1] + (i & 1), which shifts right and checks the last bit.',
        hasVisualization: true,
        tags: ['bit manipulation', 'dynamic programming', 'array'],
      },
      {
        id: 'decode-xored-array',
        title: 'Decode XORed Array',
        leetcodeNumber: 1720,
        difficulty: 'Easy' as Difficulty,
        description:
          'An encoded array was built by XOR-ing adjacent elements: encoded[i] = arr[i] XOR arr[i+1]. Given encoded and the first element of arr, decode it. Since encoded[i] XOR arr[i] = arr[i+1], recover each subsequent element by XOR-ing the encoded value with the previous decoded element.',
        hasVisualization: true,
        tags: ['bit manipulation', 'array'],
      },
      {
        id: 'maximum-xor-of-two-numbers',
        title: 'Maximum XOR of Two Numbers in an Array',
        leetcodeNumber: 421,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array, return the maximum XOR of any two elements. Build the answer greedily bit by bit from the most significant bit. For each bit position, check if there exist two numbers whose XOR has that bit set by inserting prefixes into a hash set and checking complements.',
        hasVisualization: true,
        tags: ['bit manipulation', 'trie', 'hash set', 'greedy'],
      },
      {
        id: 'single-number-general',
        title: 'Single Number (General k)',
        difficulty: 'Medium' as Difficulty,
        description:
          'In an array where every element appears k times except one element that appears once, find that single element. For each bit position, count how many numbers have that bit set. The count modulo k gives the bit of the single number. Works for any k.',
        hasVisualization: true,
        tags: ['bit manipulation', 'array', 'math'],
      },
      {
        id: 'single-number-iii',
        title: 'Single Number III',
        leetcodeNumber: 260,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array where exactly two elements appear only once and all others appear exactly twice, find the two single numbers. XOR all numbers to get xor of the two singles, then use the lowest set bit to partition numbers into two groups, each containing one unique number.',
        hasVisualization: true,
        tags: ['bit manipulation', 'xor', 'array'],
      },
      {
        id: 'total-hamming-distance',
        title: 'Total Hamming Distance',
        leetcodeNumber: 477,
        difficulty: 'Medium' as Difficulty,
        description:
          'The Hamming distance between two integers is the number of positions where corresponding bits differ. Given an integer array, return the sum of Hamming distances between all pairs. For each bit position, count numbers with that bit set (ones) and unset (zeros). Contribution = ones * zeros.',
        hasVisualization: true,
        tags: ['bit manipulation', 'array', 'math'],
      },
      {
        id: 'utf-8-validation',
        title: 'UTF-8 Validation',
        leetcodeNumber: 393,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer array representing bytes of data, determine whether it is a valid UTF-8 encoding. A UTF-8 character can be 1-4 bytes. Leading byte patterns: 0xxxxxxx (1-byte), 110xxxxx (2-byte), 1110xxxx (3-byte), 11110xxx (4-byte). Continuation bytes must match 10xxxxxx.',
        hasVisualization: true,
        tags: ['bit manipulation', 'array'],
      },
      {
        id: 'xor-queries-of-subarray',
        title: 'XOR Queries of a Subarray',
        leetcodeNumber: 1310,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array and a list of queries [left, right], return the XOR of elements from index left to right for each query. Build a prefix XOR array where prefix[i] = arr[0] XOR ... XOR arr[i-1]. Answer each query in O(1) using XOR property: query(l, r) = prefix[r+1] XOR prefix[l].',
        hasVisualization: true,
        tags: ['bit manipulation', 'prefix sum', 'array'],
      },
    
      {
        id: 'binary-number-with-alternating-bits',
        title: 'Binary Number with Alternating Bits',
        leetcodeNumber: 693,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a positive integer n, check if it has alternating bits (adjacent bits are always different). XOR n with (n >> 1): the result should be all 1s. Check that result & (result + 1) == 0, which is true only when result is a sequence of all 1s (like 0111...1).',
        hasVisualization: true,
        tags: ['bit manipulation'],
      },
      {
        id: 'bitwise-and-range-ii',
        title: 'Bitwise AND of Numbers Range',
        leetcodeNumber: 201,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given two integers left and right representing a range [left, right], return the bitwise AND of all numbers in that range. Key insight: the AND of a range keeps only the common prefix of left and right in binary. Repeatedly right-shift both until equal, then shift back.',
        hasVisualization: true,
        tags: ['bit manipulation', 'math'],
      },
      {
        id: 'count-triplets-that-can-form-two-arrays',
        title: 'Count Triplets That Can Form Two Arrays of Equal XOR',
        leetcodeNumber: 1442,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given array arr, count triplets (i, j, k) where 0<=i<j<=k<n and a XOR b == 0, where a = arr[i]^...^arr[j-1] and b = arr[j]^...^arr[k]. Since a^b=0 means a==b, and the XOR of the entire range [i,k] must be 0. For each pair (i,k) where XOR([i..k])==0, there are (k-i) valid j values.',
        hasVisualization: true,
        tags: ['bit manipulation', 'xor', 'array'],
      },
      {
        id: 'decode-xored-permutation',
        title: 'Decode XORed Permutation',
        leetcodeNumber: 1734,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given encoded array where encoded[i] = perm[i] XOR perm[i+1] and perm is a permutation of [1..n], recover perm. Key: XOR all of 1..n to get totalXor. Use encoded[i] for even i to find perm[0] = totalXor XOR (encoded[1] XOR encoded[3] XOR ...). Then decode the rest.',
        hasVisualization: true,
        tags: ['bit manipulation', 'xor', 'array'],
      },
      {
        id: 'find-xor-beauty',
        title: 'Find XOR Beauty of Array',
        leetcodeNumber: 2527,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an array nums, the XOR beauty is defined as XOR of all ',
        hasVisualization: true,
        tags: ['bit manipulation', 'math', 'xor'],
      },
      {
        id: 'gray-code-ii',
        title: 'Gray Code',
        leetcodeNumber: 89,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given n, return the n-bit Gray code sequence: a list of 2^n integers where each consecutive pair differs by exactly one bit. Formula: gray(i) = i XOR (i >> 1). This directly converts a binary index to its Gray code without iterative construction.',
        hasVisualization: true,
        tags: ['bit manipulation', 'math'],
      },
      {
        id: 'hamming-distance-ii',
        title: 'Hamming Distance',
        leetcodeNumber: 461,
        difficulty: 'Easy' as Difficulty,
        description:
          'The Hamming distance between two integers is the number of bit positions where they differ. Compute x XOR y (which has 1s exactly where x and y differ), then count the number of 1 bits (popcount) in the result.',
        hasVisualization: true,
        tags: ['bit manipulation'],
      },
      {
        id: 'maximum-xor-after-operations',
        title: 'Maximum XOR After Operations',
        leetcodeNumber: 2317,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given nums array, you can apply operations: choose i, then replace nums[i] with nums[i] AND (nums[i] XOR x) for any x >= 0. You can clear any subset of bits in any element. The maximum XOR of any subarray is the OR of all elements, because we can always zero out bits to achieve any subset XOR up to the OR of all elements.',
        hasVisualization: true,
        tags: ['bit manipulation', 'math', 'xor'],
      },
      {
        id: 'maximum-xor-for-each-query',
        title: 'Maximum XOR for Each Query',
        leetcodeNumber: 1829,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a sorted array nums and maximumBit, for each query find k (0 <= k < 2^maximumBit) such that XOR of all nums XOR k is maximized. The optimal k is the bitwise NOT of the current prefix XOR masked to maximumBit bits. Process queries from right to left, removing the last element each time.',
        hasVisualization: true,
        tags: ['bit manipulation', 'prefix xor', 'array'],
      },
      {
        id: 'minimum-flips-to-make-a-or-b-equal-c',
        title: 'Minimum Flips to Make a OR b Equal to c',
        leetcodeNumber: 1318,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given a, b, c, find minimum bit flips in a or b so that a OR b == c. For each bit: if c-bit is 0, both a-bit and b-bit must be 0 (cost = count of 1s in a and b at that position). If c-bit is 1, at least one of a-bit or b-bit must be 1 (cost = 1 if both are 0).',
        hasVisualization: true,
        tags: ['bit manipulation', 'greedy'],
      },
      {
        id: 'missing-number-bit',
        title: 'Missing Number (Bit Approach)',
        leetcodeNumber: 268,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array nums containing n distinct numbers in range [0, n], find the missing number using XOR. XOR all indices 0..n with all elements. Pairs cancel out, leaving only the missing number. This is an elegant O(n) time, O(1) space solution.',
        hasVisualization: true,
        tags: ['bit manipulation', 'array', 'xor'],
      },
      {
        id: 'number-complement',
        title: 'Number Complement',
        leetcodeNumber: 476,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a positive integer num, return its complement. The complement flips all bits in its binary representation. Find the mask with all 1s of the same length as num (e.g., 5=101 → mask=111=7), then complement = mask XOR num.',
        hasVisualization: true,
        tags: ['bit manipulation'],
      },
      {
        id: 'number-of-1-bits-ii',
        title: 'Number of 1 Bits (Hamming Weight)',
        leetcodeNumber: 191,
        difficulty: 'Easy' as Difficulty,
        description:
          'Count the number of set bits (1s) in the binary representation of a positive integer (Hamming weight). Use Brian Kernighan\\',
        hasVisualization: true,
        tags: ['bit manipulation'],
      },
      {
        id: 'power-of-four-ii',
        title: 'Power of Four',
        leetcodeNumber: 342,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer n, return true if it is a power of four. Powers of four are powers of two whose single set bit is at an even position (0, 2, 4, ...). Use the mask 0x55555555 which has 1s at even bit positions. Check: n > 0, n & (n-1) == 0 (power of two), and n & 0x55555555 != 0 (bit at even position).',
        hasVisualization: true,
        tags: ['bit manipulation', 'math'],
      },
      {
        id: 'power-of-two-ii',
        title: 'Power of Two',
        leetcodeNumber: 231,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer n, return true if it is a power of two. A power of two has exactly one bit set in its binary representation. Use the trick: n > 0 && (n & (n-1)) === 0. n-1 flips the trailing bits, so n & (n-1) clears the lowest set bit. If n is a power of two, this gives 0.',
        hasVisualization: true,
        tags: ['bit manipulation', 'math'],
      },
      {
        id: 'prime-number-of-set-bits',
        title: 'Prime Number of Set Bits in Binary Representation',
        leetcodeNumber: 762,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a range [left, right], count integers whose number of set bits is prime. For each number, count its 1-bits, then check if that count is prime. Numbers in range have at most 20 bits, so only need to check primes up to 20: {2, 3, 5, 7, 11, 13, 17, 19}.',
        hasVisualization: true,
        tags: ['bit manipulation', 'math'],
      },
      {
        id: 'reverse-bits-ii',
        title: 'Reverse Bits',
        leetcodeNumber: 190,
        difficulty: 'Easy' as Difficulty,
        description:
          'Reverse the bits of a 32-bit unsigned integer. Process each bit from LSB to MSB: extract the lowest bit of n (n & 1), shift it into the result from the MSB side (result |= bit << (31 - i)), then shift n right.',
        hasVisualization: true,
        tags: ['bit manipulation'],
      },
      {
        id: 'sort-integers-by-number-of-bits',
        title: 'Sort Integers by The Number of 1 Bits',
        leetcodeNumber: 1356,
        difficulty: 'Easy' as Difficulty,
        description:
          'Sort an array in ascending order by the number of 1 bits in each element\\',
        hasVisualization: true,
        tags: ['bit manipulation', 'sorting'],
      },
    ],
  },

  // ─── 19. Math And Geometry ─────────────────────────────────────────
  {
    id: 'math-and-geometry',
    name: 'Math And Geometry',
    icon: '∠',
    color: 'text-stone-400',
    gradient: 'from-stone-500/20 to-stone-600/10',
    borderColor: 'border-stone-500/30',
    problems: [
      {
        id: 'spiral-traversal',
        title: 'Spiral Traversal',
        difficulty: 'Medium',
        leetcodeNumber: 54,
        description:
          'Traverse a matrix in spiral order by peeling off the outermost layer in each iteration.',
        hasVisualization: true,
        tags: ['matrix', 'simulation'],
      },
      {
        id: 'reverse-32-bit-integer',
        title: 'Reverse 32-Bit Integer',
        difficulty: 'Medium',
        leetcodeNumber: 7,
        description:
          'Reverse the digits of a signed 32-bit integer, returning 0 if the result overflows.',
        hasVisualization: true,
        tags: ['math'],
      },
      {
        id: 'maximum-collinear-points',
        title: 'Maximum Collinear Points',
        difficulty: 'Hard',
        leetcodeNumber: 149,
        description:
          'Find the maximum number of points that lie on the same straight line using slope grouping.',
        hasVisualization: true,
        tags: ['math', 'geometry', 'hash-map'],
      },
      {
        id: 'the-josephus-problem',
        title: 'The Josephus Problem',
        difficulty: 'Medium',
        description:
          'Find the survivor position when every kth person is eliminated in a circle using the Josephus recurrence.',
        hasVisualization: true,
        tags: ['math', 'recursion'],
      },
      {
        id: 'triangle-numbers',
        title: 'Triangle Numbers',
        difficulty: 'Easy',
        leetcodeNumber: 118,
        description:
          'Generate the first n rows of Pascal\'s triangle where each entry is the sum of the two above it.',
        hasVisualization: true,
        tags: ['math', 'array', 'dynamic-programming'],
      },
      {
        id: 'add-binary',
        title: 'Add Binary',
        difficulty: 'Easy',
        leetcodeNumber: 67,
        description:
          'Given two binary strings a and b, return their sum as a binary string. Use two pointers starting from the right ends of both strings, add bit by bit with a carry, and prepend each resulting bit to the output. Time complexity O(max(n, m)).',
        hasVisualization: true,
        tags: ['math', 'string', 'bit-manipulation'],
      },
      {
        id: 'excel-sheet-column-number',
        title: 'Excel Sheet Column Number',
        difficulty: 'Easy',
        leetcodeNumber: 171,
        description:
          'Convert an Excel column title (like ',
        hasVisualization: true,
        tags: ['math', 'string'],
      },
      {
        id: 'factorial-trailing-zeros',
        title: 'Factorial Trailing Zeros',
        difficulty: 'Medium',
        leetcodeNumber: 172,
        description:
          'Count the number of trailing zeros in n!. Trailing zeros come from factors of 10 = 2 × 5. Since factors of 2 are always more than factors of 5, we only count how many times 5 divides into n!. Count multiples of 5, 25, 125, ... using n/5 + n/25 + n/125 + ... in O(log n) time.',
        hasVisualization: true,
        tags: ['math'],
      },
      {
        id: 'integer-to-roman',
        title: 'Integer to Roman',
        difficulty: 'Medium',
        leetcodeNumber: 12,
        description:
          'Convert an integer to a Roman numeral string. Use a lookup table of values and symbols ordered from largest to smallest. Greedily subtract the largest possible value at each step, appending the corresponding symbol. Works for numbers 1 to 3999.',
        hasVisualization: true,
        tags: ['math', 'string', 'greedy'],
      },
      {
        id: 'multiply-strings',
        title: 'Multiply Strings',
        difficulty: 'Medium',
        leetcodeNumber: 43,
        description:
          'Multiply two non-negative integers represented as strings without using BigInteger or built-in multiplication. Use grade-school multiplication: each digit of num1 multiplied by each digit of num2 is accumulated in an output array where pos[i+j] and pos[i+j+1] correspond to the product of nums1[i] and nums2[j]. O(m*n) time.',
        hasVisualization: true,
        tags: ['math', 'string', 'array'],
      },
      {
        id: 'plus-one',
        title: 'Plus One',
        difficulty: 'Easy',
        leetcodeNumber: 66,
        description:
          'Given a number represented as an array of digits, increment it by one and return the result as an array. Traverse from the rightmost digit: if it is less than 9, increment and return. Otherwise set it to 0 and carry over. If all digits were 9, prepend a 1.',
        hasVisualization: true,
        tags: ['array', 'math'],
      },
      {
        id: 'power-x-n',
        title: 'Pow(x, n)',
        difficulty: 'Medium',
        leetcodeNumber: 50,
        description:
          'Implement pow(x, n) which calculates x raised to the power n. Fast exponentiation (binary exponentiation) halves the exponent at each step: if n is even, pow(x,n) = pow(x*x, n/2); if n is odd, multiply an extra x. This runs in O(log n) time instead of O(n).',
        hasVisualization: true,
        tags: ['math', 'recursion', 'divide-and-conquer'],
      },
      {
        id: 'roman-to-integer',
        title: 'Roman to Integer',
        difficulty: 'Easy',
        leetcodeNumber: 13,
        description:
          'Convert a Roman numeral string to an integer. Roman numerals use symbols I=1, V=5, X=10, L=50, C=100, D=500, M=1000. If a smaller value appears before a larger one (e.g. IV=4, IX=9), subtract it. Otherwise add it. Traverse left to right comparing each symbol with the next.',
        hasVisualization: true,
        tags: ['math', 'string', 'hash-map'],
      },
      {
        id: 'rotate-image',
        title: 'Rotate Image',
        difficulty: 'Medium',
        leetcodeNumber: 48,
        description:
          'Given an n x n 2D matrix, rotate it 90 degrees clockwise in-place. The trick is to first transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row. Both steps together achieve a 90-degree clockwise rotation.',
        hasVisualization: true,
        tags: ['matrix', 'math', 'in-place'],
      },
      {
        id: 'string-to-integer-atoi',
        title: 'String to Integer (atoi)',
        difficulty: 'Medium',
        leetcodeNumber: 8,
        description:
          'Implement the atoi function: skip leading whitespace, read optional sign (+/-), then read digits until a non-digit is found. Clamp the result to the 32-bit integer range [-2^31, 2^31-1]. Handle edge cases like no digits, leading zeros, and overflow.',
        hasVisualization: true,
        tags: ['string', 'math'],
      },
    
      {
        id: 'base-7',
        title: 'Base 7',
        leetcodeNumber: 504,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer num, return a string of its base 7 representation. Repeatedly divide by 7 and collect remainders. The remainders read in reverse order form the base-7 number. Handle negative numbers and zero as special cases.',
        hasVisualization: true,
        tags: ['math', 'string'],
      },
      {
        id: 'basic-calculator-i',
        title: 'Basic Calculator',
        leetcodeNumber: 224,
        difficulty: 'Hard' as Difficulty,
        description:
          'Implement a basic calculator to evaluate a simple expression string containing digits, spaces, plus (+), minus (-), and parentheses. Use a stack to save the running result and sign when entering parentheses. Process each character, applying the current sign to build up the result.',
        hasVisualization: true,
        tags: ['math', 'stack', 'string'],
      },
      {
        id: 'consecutive-numbers-sum',
        title: 'Consecutive Numbers Sum',
        leetcodeNumber: 829,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a positive integer n, return the number of ways to express n as a sum of consecutive positive integers. For k consecutive integers starting at m: n = k*m + k*(k-1)/2, so m = (n - k*(k-1)/2) / k. Iterate k from 1 while k*(k+1)/2 < n; count valid (positive integer) m values.',
        hasVisualization: true,
        tags: ['math', 'enumeration'],
      },
      {
        id: 'count-primes',
        title: 'Count Primes',
        leetcodeNumber: 204,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of prime numbers strictly less than n. Uses the Sieve of Eratosthenes: start with all numbers marked as prime, then for each prime p starting from 2, mark all multiples of p (starting at p*p) as composite. Count remaining primes.',
        hasVisualization: true,
        tags: ['math', 'sieve', 'array'],
      },
      {
        id: 'fizzbuzz',
        title: 'FizzBuzz',
        leetcodeNumber: 412,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer n, return a string array where each element is "FizzBuzz" if divisible by both 3 and 5, "Fizz" if divisible by 3, "Buzz" if divisible by 5, or the string representation of the number otherwise. Classic modulo problem.',
        hasVisualization: true,
        tags: ['math', 'string', 'simulation'],
      },
      {
        id: 'fraction-to-recurring-decimal',
        title: 'Fraction to Recurring Decimal',
        leetcodeNumber: 166,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given numerator and denominator, return the fraction as a string. If the fractional part is repeating, enclose the repeating part in parentheses. Perform long division while tracking remainders in a hash map. When a remainder repeats, the portion from that point onwards is the repeating part.',
        hasVisualization: true,
        tags: ['math', 'hash map', 'long division'],
      },
      {
        id: 'gcd-of-strings',
        title: 'Greatest Common Divisor of Strings',
        leetcodeNumber: 1071,
        difficulty: 'Easy' as Difficulty,
        description:
          'For two strings str1 and str2, we say t divides s if s = t + t + ... (t concatenated). Return the largest string t that divides both str1 and str2. First check if str1 + str2 == str2 + str1 (necessary condition). If so, the GCD string has length equal to the GCD of the two string lengths.',
        hasVisualization: true,
        tags: ['math', 'string', 'gcd'],
      },
      {
        id: 'happy-number-ii',
        title: 'Happy Number',
        leetcodeNumber: 202,
        difficulty: 'Easy' as Difficulty,
        description:
          'A happy number is defined by: starting with any positive integer, replace it by the sum of squares of its digits. Repeat until it equals 1 (happy) or loops endlessly (unhappy, always reaching 4). Use a set to detect cycles or use Floyd cycle detection.',
        hasVisualization: true,
        tags: ['math', 'hash set', 'cycle detection'],
      },
      {
        id: 'maximum-swap',
        title: 'Maximum Swap',
        leetcodeNumber: 670,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer, swap two digits at most once to get the maximum valued number. Store the last occurrence index of each digit (0-9). Then from left to right, for each digit, check if a larger digit (9 down to current+1) appears later. If so, swap them and return the result.',
        hasVisualization: true,
        tags: ['math', 'array', 'greedy'],
      },
      {
        id: 'nth-digit',
        title: 'Nth Digit',
        leetcodeNumber: 400,
        difficulty: 'Medium' as Difficulty,
        description:
          'In the infinite sequence 1, 2, 3, 4, ..., 9, 10, 11, ..., find the nth digit. First determine how many digits each range of numbers contributes (1-digit numbers contribute 9, 2-digit contribute 180, etc.). Find which range contains the nth digit, then pinpoint the exact number and digit within it.',
        hasVisualization: true,
        tags: ['math', 'binary search'],
      },
      {
        id: 'palindrome-number',
        title: 'Palindrome Number',
        leetcodeNumber: 9,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer x, return true if x is a palindrome (reads the same forwards and backwards). Negative numbers are not palindromes. Solve without converting to a string by reversing the second half of the number.',
        hasVisualization: true,
        tags: ['math', 'number theory'],
      },
      {
        id: 'reachable-nodes-from-subdivisions',
        title: 'Reachable Nodes In Subdivided Graph',
        leetcodeNumber: 882,
        difficulty: 'Hard' as Difficulty,
        description:
          'An undirected graph has n nodes. Each edge (u, v, cnt) is subdivided with cnt new nodes. Given moves, find how many original and new nodes can be reached from node 0 using at most moves steps. Use Dijkstra to find shortest distances, then count reachable original nodes and new subdivision nodes on used edges.',
        hasVisualization: true,
        tags: ['math', 'graph', 'dijkstra', 'shortest path'],
      },
      {
        id: 'reaching-points',
        title: 'Reaching Points',
        leetcodeNumber: 780,
        difficulty: 'Hard' as Difficulty,
        description:
          'Starting from (sx, sy), you can transform to (x+y, y) or (x, x+y). Determine if (tx, ty) is reachable from (sx, sy). Work backwards: from (tx, ty), if tx > ty, the previous state was (tx-ty, ty), but we can do this in bulk using modulo. Stop when tx < sx or ty < sy.',
        hasVisualization: true,
        tags: ['math', 'modulo', 'backward reasoning'],
      },
      {
        id: 'self-dividing-numbers',
        title: 'Self Dividing Numbers',
        leetcodeNumber: 728,
        difficulty: 'Easy' as Difficulty,
        description:
          'A self-dividing number is one that is divisible by every digit it contains. It cannot contain the digit 0. Given a range [left, right], return all self-dividing numbers in that range. Check each digit of each number for divisibility.',
        hasVisualization: true,
        tags: ['math', 'enumeration'],
      },
      {
        id: 'valid-number',
        title: 'Valid Number',
        leetcodeNumber: 65,
        difficulty: 'Hard' as Difficulty,
        description:
          'Determine if a string is a valid number. A valid number can be an integer or decimal, optionally followed by an exponent (e or E). Track flags: seenDigit (any digit seen), seenDot (decimal point seen), seenE (exponent seen). After e/E, reset seenDigit and disallow another dot.',
        hasVisualization: true,
        tags: ['math', 'string', 'state machine'],
      },
      {
        id: 'water-and-jug-problem',
        title: 'Water and Jug Problem',
        leetcodeNumber: 365,
        difficulty: 'Medium' as Difficulty,
        description:
          'You have two jugs of capacities x and y. Determine if it is possible to measure exactly target liters using these jugs. By Bezout theorem, we can measure any amount that is a multiple of GCD(x, y). So the answer is: target is reachable if target <= x + y and target % GCD(x, y) == 0.',
        hasVisualization: true,
        tags: ['math', 'gcd', 'depth-first search'],
      },
    
      {
        id: 'add-digits',
        title: 'Add Digits',
        leetcodeNumber: 258,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer num, repeatedly add all its digits until the result has only one digit, and return it. The O(1) solution uses the digital root formula: 0 if num=0, 9 if num%9==0, else num%9.',
        hasVisualization: true,
        tags: ['math', 'digital root', 'number theory'],
      },
      {
        id: 'angle-between-hands-of-clock',
        title: 'Angle Between Hands of a Clock',
        leetcodeNumber: 1344,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given hour and minutes, return the smaller angle between the clock hands. The minute hand moves 6 degrees/minute. The hour hand moves 0.5 degrees/minute. Compute both angles and return the smaller (max 180 degrees).',
        hasVisualization: true,
        tags: ['math', 'geometry'],
      },
      {
        id: 'bell-numbers-visualization',
        title: 'Bell Numbers Visualization',
        difficulty: 'Medium' as Difficulty,
        description:
          'Compute Bell numbers B(n) — the total number of partitions of a set of n elements — using the Bell triangle (Aitken\\',
        hasVisualization: true,
        tags: ['Math', 'Combinatorics', 'Bell Numbers', 'Set Partitions'],
      },
      {
        id: 'catalan-number-visualization',
        title: 'Catalan Number Visualization',
        difficulty: 'Medium' as Difficulty,
        description:
          'Compute the nth Catalan number using the recurrence C(n) = sum of C(i)*C(n-1-i) for i=0..n-1. Catalan numbers count balanced parentheses, binary trees, and more.',
        hasVisualization: true,
        tags: ['Math', 'Combinatorics', 'DP', 'Catalan'],
      },
      {
        id: 'check-if-point-is-reachable',
        title: 'Check if Point is Reachable',
        leetcodeNumber: 2543,
        difficulty: 'Hard' as Difficulty,
        description:
          'Starting from (1,1), can you reach (targetX, targetY) using two operations: (x,y)->(x+y,y) or (x,y)->(x,x+y)? Working backwards: if max > min, subtract min from max (reverse of addition). This is like GCD. Point is reachable iff targetX and targetY share gcd that is a power of 2 (since we start at (1,1)).',
        hasVisualization: true,
        tags: ['math', 'number theory', 'gcd'],
      },
      {
        id: 'chinese-remainder-theorem',
        title: 'Chinese Remainder Theorem',
        difficulty: 'Hard' as Difficulty,
        description:
          'Solve a system of simultaneous congruences x ≡ r_i (mod m_i) where the moduli are pairwise coprime, using the CRT construction.',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'CRT', 'Modular Arithmetic'],
      },
      {
        id: 'convex-hull',
        title: 'Convex Hull',
        leetcodeNumber: 587,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given a set of points, find the convex hull - the smallest convex polygon containing all points. Uses Andrew\\',
        hasVisualization: true,
        tags: ['math', 'geometry', 'convex hull', 'sorting'],
      },
      {
        id: 'count-primes-ii',
        title: 'Count Primes',
        leetcodeNumber: 204,
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of prime numbers strictly less than n. Uses the Sieve of Eratosthenes: mark all multiples of each prime as composite, starting from 2. The remaining unmarked numbers are prime.',
        hasVisualization: true,
        tags: ['math', 'sieve of eratosthenes', 'array'],
      },
      {
        id: 'derangements-visualization',
        title: 'Derangements Visualization',
        difficulty: 'Medium' as Difficulty,
        description:
          'Count derangements D(n) — permutations where no element appears in its original position. Recurrence: D(n) = (n-1)*(D(n-1) + D(n-2)).',
        hasVisualization: true,
        tags: ['Math', 'Combinatorics', 'Derangements', 'DP'],
      },
      {
        id: 'divisor-function',
        title: 'Divisor Function σ(n)',
        difficulty: 'Easy' as Difficulty,
        description:
          'Compute σ(n) — the sum of all divisors of n — and τ(n) — the count of divisors. Enumerate divisors up to √n and add both d and n/d.',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'Divisors'],
      },
      {
        id: 'erect-the-fence',
        title: 'Erect the Fence',
        leetcodeNumber: 587,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given tree positions, find all trees on the perimeter of the convex hull (the minimum fence). Uses Andrew\\',
        hasVisualization: true,
        tags: ['math', 'geometry', 'convex hull', 'sorting'],
      },
      {
        id: 'eulers-totient-function',
        title: 'Euler',
        difficulty: 'Medium' as Difficulty,
        description:
          'Compute φ(n) — the count of integers from 1 to n that are coprime to n. Uses prime factorization: φ(n) = n * ∏(1 - 1/p) for each prime factor p of n.',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'Euler', 'Totient'],
      },
      {
        id: 'excel-sheet-column-title',
        title: 'Excel Sheet Column Title',
        leetcodeNumber: 168,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an integer column number, return its corresponding Excel sheet column title. This is the reverse of base-26 conversion: repeatedly take (n-1) mod 26 to get the character, then divide by 26. Note: must use (n-1) since A=1 not 0.',
        hasVisualization: true,
        tags: ['math', 'string'],
      },
      {
        id: 'extended-euclidean-algorithm',
        title: 'Extended Euclidean Algorithm',
        difficulty: 'Medium' as Difficulty,
        description:
          'Find integers x, y such that ax + by = gcd(a,b) using the extended Euclidean algorithm. Back-substitutes quotients to find Bezout coefficients.',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'GCD', 'Extended GCD'],
      },
      {
        id: 'factorial-trailing-zeroes-ii',
        title: 'Factorial Trailing Zeroes',
        leetcodeNumber: 172,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given an integer n, return the number of trailing zeroes in n!. Trailing zeroes come from factors of 10 = 2 * 5. Since there are always more factors of 2, we only count factors of 5: n/5 + n/25 + n/125 + ...',
        hasVisualization: true,
        tags: ['math'],
      },
      {
        id: 'fibonacci-matrix-exponentiation',
        title: 'Fibonacci via Matrix Exponentiation',
        difficulty: 'Medium' as Difficulty,
        description:
          'Compute F(n) in O(log n) using matrix exponentiation: [[1,1],[1,0]]^n gives [[F(n+1), F(n)],[F(n), F(n-1)]].',
        hasVisualization: true,
        tags: ['Math', 'Matrix', 'Fibonacci', 'Fast Power'],
      },
      {
        id: 'fizzbuzz-ii',
        title: 'FizzBuzz II',
        leetcodeNumber: 412,
        difficulty: 'Easy' as Difficulty,
        description:
          'For each number from 1 to n, output ',
        hasVisualization: true,
        tags: ['Math', 'Simulation', 'String'],
      },
      {
        id: 'gcd-lcm-visualization',
        title: 'GCD & LCM Visualization',
        difficulty: 'Easy' as Difficulty,
        description:
          'Compute GCD using the Euclidean algorithm and LCM using the formula lcm(a,b) = a*b/gcd(a,b). Visualize each division step.',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'GCD', 'LCM'],
      },
      {
        id: 'generating-functions-basics',
        title: 'Generating Functions Basics',
        difficulty: 'Hard' as Difficulty,
        description:
          'Use ordinary generating functions (OGF) to count integer compositions. The OGF for each part is 1/(1-x) and multiplying polynomials gives the number of ways to form each sum.',
        hasVisualization: true,
        tags: ['Math', 'Combinatorics', 'Generating Functions', 'Polynomial'],
      },
      {
        id: 'inclusion-exclusion-principle',
        title: 'Inclusion-Exclusion Principle',
        difficulty: 'Medium' as Difficulty,
        description:
          'Count integers from 1 to n divisible by at least one of the given divisors using inclusion-exclusion: |A∪B∪C| = |A|+|B|+|C| - |A∩B| - ... + |A∩B∩C|.',
        hasVisualization: true,
        tags: ['Math', 'Combinatorics', 'Inclusion-Exclusion'],
      },
      {
        id: 'integer-to-roman-ii',
        title: 'Integer to Roman',
        leetcodeNumber: 12,
        difficulty: 'Medium' as Difficulty,
        description:
          'Convert an integer to a Roman numeral. Use a greedy approach with a table of values and symbols (including subtractive combinations like IV, IX). Repeatedly subtract the largest possible value and append the corresponding symbol.',
        hasVisualization: true,
        tags: ['math', 'string', 'greedy'],
      },
      {
        id: 'josephus-problem-ii',
        title: 'Josephus Problem II',
        difficulty: 'Medium' as Difficulty,
        description:
          'n people stand in a circle. Every k-th person is eliminated. Find the position of the last survivor. Solved with the recurrence J(1)=0, J(n)=(J(n-1)+k) mod n.',
        hasVisualization: true,
        tags: ['Math', 'Combinatorics', 'Josephus', 'Recursion'],
      },
      {
        id: 'largest-triangle-area',
        title: 'Largest Triangle Area',
        leetcodeNumber: 812,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given an array of points in the XY plane, find and return the maximum area of a triangle formed by any 3 of the points. Use the shoelace formula for triangle area: |x1(y2-y3) + x2(y3-y1) + x3(y1-y2)| / 2.',
        hasVisualization: true,
        tags: ['math', 'geometry', 'brute force'],
      },
      {
        id: 'max-points-on-a-line-ii',
        title: 'Max Points on a Line',
        leetcodeNumber: 149,
        difficulty: 'Hard' as Difficulty,
        description:
          'Given an array of points, find the maximum number of points that lie on the same straight line. For each point, compute the slope to every other point using a hash map of reduced fractions (gcd normalization). The line through point i with most others gives the answer.',
        hasVisualization: true,
        tags: ['math', 'geometry', 'hash map', 'gcd'],
      },
      {
        id: 'minimum-area-rectangle',
        title: 'Minimum Area Rectangle',
        leetcodeNumber: 939,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given points in the XY plane aligned to axes, find the minimum area rectangle that can be formed. For each pair of points as diagonal, check if the other two corners exist in a point set. Area = |dx| * |dy|.',
        hasVisualization: true,
        tags: ['math', 'geometry', 'hash set', 'array'],
      },
      {
        id: 'mobius-function',
        title: 'Möbius Function μ(n)',
        difficulty: 'Hard' as Difficulty,
        description:
          'Compute the Möbius function μ(n): μ(1)=1, μ(n)=0 if n has a squared prime factor, μ(n)=(-1)^k if n is a product of k distinct primes. Uses a sieve.',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'Möbius', 'Sieve'],
      },
      {
        id: 'modular-exponentiation',
        title: 'Modular Exponentiation',
        difficulty: 'Medium' as Difficulty,
        description:
          'Compute base^exp mod m efficiently using fast exponentiation (square-and-multiply). Reduces O(exp) multiplications to O(log exp).',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'Modular Arithmetic'],
      },
      {
        id: 'modular-inverse',
        title: 'Modular Inverse',
        difficulty: 'Medium' as Difficulty,
        description:
          'Find x such that a*x ≡ 1 (mod m) using the extended Euclidean algorithm. A modular inverse exists iff gcd(a,m)=1.',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'Modular Arithmetic', 'Extended GCD'],
      },
      {
        id: 'nCr-pascals-triangle',
        title: 'nCr - Combinations via Pascals Triangle',
        difficulty: 'Easy' as Difficulty,
        description:
          'Compute C(n,r) using Pascals Triangle approach.',
        hasVisualization: true,
        tags: ['Math', 'Combinatorics', 'Pascal', 'DP'],
      },
      {
        id: 'nim-game-ii',
        title: 'Nim Game II (LC 292)',
        leetcodeNumber: 292,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given n stones, two players alternately remove 1, 2, or 3 stones. The player who takes the last stone wins. You can win iff n mod 4 != 0.',
        hasVisualization: true,
        tags: ['Math', 'Game Theory', 'Nim'],
      },
      {
        id: 'number-of-divisors-sieve',
        title: 'Number of Divisors Sieve',
        difficulty: 'Medium' as Difficulty,
        description:
          'Compute τ(i) — the number of divisors — for every i from 1 to n using a sieve. For each i, increment the divisor count for all its multiples.',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'Divisors', 'Sieve'],
      },
      {
        id: 'partition-function',
        title: 'Integer Partition Function',
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of ways to write n as an unordered sum of positive integers (integer partitions) using DP. p(n) = number of partitions of n.',
        hasVisualization: true,
        tags: ['Math', 'Combinatorics', 'DP', 'Integer Partitions'],
      },
      {
        id: 'permutation-sequence-ii',
        title: 'Permutation Sequence II',
        leetcodeNumber: 60,
        difficulty: 'Hard' as Difficulty,
        description:
          'Find the k-th permutation of numbers 1 to n in lexicographic order without generating all permutations. Use factorial number system: at each position, determine which digit goes there by dividing k by (n-1)!. Greedily pick the (k/(n-1)!)-th remaining digit. O(n²) time.',
        hasVisualization: true,
        tags: ['Math', 'Recursion', 'String'],
      },
      {
        id: 'phi-function-sieve',
        title: 'Euler',
        difficulty: 'Medium' as Difficulty,
        description:
          'Compute Euler\\',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'Euler Totient', 'Sieve'],
      },
      {
        id: 'pow-x-n-ii',
        title: 'Pow(x, n)',
        leetcodeNumber: 50,
        difficulty: 'Medium' as Difficulty,
        description:
          'Implement pow(x, n), which calculates x raised to the power n. Uses fast exponentiation (binary exponentiation): repeatedly square x and halve n, multiplying into result when n is odd. Handles negative exponents by inverting x.',
        hasVisualization: true,
        tags: ['math', 'recursion', 'binary exponentiation', 'divide and conquer'],
      },
      {
        id: 'prime-factorization-visualization',
        title: 'Prime Factorization',
        difficulty: 'Easy' as Difficulty,
        description:
          'Find the prime factorization of n by trial division. Divide out each prime factor starting from 2 until n becomes 1.',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'Prime Factors'],
      },
      {
        id: 'probability-of-fair-coin',
        title: 'Probability of Fair Coin',
        difficulty: 'Easy' as Difficulty,
        description:
          'Simulate flipping a fair coin n times. Track the running count of heads/tails and show how the empirical probability converges to 0.5 as n grows.',
        hasVisualization: true,
        tags: ['Math', 'Probability', 'Simulation'],
      },
      {
        id: 'robot-bounded-in-circle',
        title: 'Robot Bounded in Circle',
        leetcodeNumber: 1041,
        difficulty: 'Medium' as Difficulty,
        description:
          'A robot follows instructions on an infinite plane. After one cycle, if the robot is back at origin OR not facing north, it will be bounded in a circle. Simulate one cycle and check the two conditions.',
        hasVisualization: true,
        tags: ['math', 'simulation', 'geometry'],
      },
      {
        id: 'roman-to-integer-ii',
        title: 'Roman to Integer',
        leetcodeNumber: 13,
        difficulty: 'Easy' as Difficulty,
        description:
          'Convert a Roman numeral string to an integer. Scan left to right: if the current symbol is less than the next, subtract it; otherwise add it. Special cases include IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.',
        hasVisualization: true,
        tags: ['math', 'string', 'hash map'],
      },
      {
        id: 'sieve-of-eratosthenes-ii',
        title: 'Sieve of Eratosthenes II',
        difficulty: 'Medium' as Difficulty,
        description:
          'Find all prime numbers up to n using the Sieve of Eratosthenes. Mark multiples of each prime as composite, leaving only primes unmarked.',
        hasVisualization: true,
        tags: ['Math', 'Number Theory', 'Prime'],
      },
      {
        id: 'sqrt-x-ii',
        title: 'Sqrt(x)',
        leetcodeNumber: 69,
        difficulty: 'Easy' as Difficulty,
        description:
          'Given a non-negative integer x, return the square root of x rounded down to the nearest integer. Uses binary search between 0 and x to find the largest integer whose square is <= x.',
        hasVisualization: true,
        tags: ['math', 'binary search'],
      },
      {
        id: 'stars-and-bars-combinatorics',
        title: 'Stars and Bars Combinatorics',
        difficulty: 'Medium' as Difficulty,
        description:
          'Count the number of ways to distribute n identical items into k distinct bins using the stars-and-bars formula: C(n+k-1, k-1). Visualize the formula and enumerate small cases.',
        hasVisualization: true,
        tags: ['Math', 'Combinatorics', 'Stars and Bars'],
      },
      {
        id: 'stirling-numbers',
        title: 'Stirling Numbers (Second Kind)',
        difficulty: 'Hard' as Difficulty,
        description:
          'Compute Stirling numbers of the second kind S(n,k) — the number of ways to partition n objects into k non-empty subsets. Recurrence: S(n,k) = k*S(n-1,k) + S(n-1,k-1).',
        hasVisualization: true,
        tags: ['Math', 'Combinatorics', 'Stirling', 'DP'],
      },
      {
        id: 'ugly-number-iii',
        title: 'Ugly Number III',
        leetcodeNumber: 1201,
        difficulty: 'Medium' as Difficulty,
        description:
          'Find the nth positive integer that is divisible by a, b, or c. Uses binary search on the answer combined with inclusion-exclusion principle: count(x) = x/a + x/b + x/c - x/lcm(a,b) - x/lcm(b,c) - x/lcm(a,c) + x/lcm(a,b,c).',
        hasVisualization: true,
        tags: ['math', 'binary search', 'inclusion-exclusion', 'lcm', 'gcd'],
      },
      {
        id: 'valid-square',
        title: 'Valid Square',
        leetcodeNumber: 593,
        difficulty: 'Medium' as Difficulty,
        description:
          'Given 4 points, determine if they form a valid square. A valid square has 4 equal sides and 2 equal diagonals (longer than sides). Compute all 6 pairwise distances squared and check: exactly 2 distinct values where smaller appears 4 times (sides) and larger appears 2 times (diagonals).',
        hasVisualization: true,
        tags: ['math', 'geometry'],
      },
    ],
  },

  // ─── Array Manipulation & Rearrangement ─────────────────────────────
  {
    id: 'array-manipulation-rearrangement',
    name: 'Array Manipulation & Rearrangement',
    icon: '⟺',
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-orange-600/10',
    borderColor: 'border-orange-500/30',
    problems: [
      {
        id: 'maximum-product-subarray',
        title: 'Maximum Product Subarray',
        difficulty: 'Medium',
        leetcodeNumber: 152,
        description:
          'Find the contiguous subarray with the largest product. Track both max and min products at each position because two negatives can yield a positive maximum.',
        hasVisualization: true,
        tags: ['dynamic-programming', 'array', 'subarray', 'product'],
      },
      {
        id: 'contains-duplicate-ii',
        title: 'Contains Duplicate II',
        difficulty: 'Easy',
        leetcodeNumber: 219,
        description:
          'Check if an array contains two distinct indices i and j such that nums[i] equals nums[j] and the absolute difference of i and j is at most k.',
        hasVisualization: true,
        tags: ['hash-map', 'array', 'sliding-window'],
      },
      {
        id: 'summary-ranges',
        title: 'Summary Ranges',
        difficulty: 'Easy',
        leetcodeNumber: 228,
        description:
          'Return the smallest sorted list of ranges that cover all numbers in a sorted unique integer array. A range covers all integers in the inclusive interval.',
        hasVisualization: true,
        tags: ['array', 'ranges', 'sorted'],
      },
      {
        id: 'pascal-triangle-ii',
        title: "Pascal's Triangle II",
        difficulty: 'Easy',
        leetcodeNumber: 119,
        description:
          'Return the kth (0-indexed) row of Pascal triangle. Each element is the sum of the two elements directly above it. Compute in-place by updating right to left.',
        hasVisualization: true,
        tags: ['array', 'dynamic-programming', 'math'],
      },
      {
        id: 'set-matrix-zeroes',
        title: 'Set Matrix Zeroes',
        difficulty: 'Medium',
        leetcodeNumber: 73,
        description:
          'If an element in an m x n integer matrix is 0, set its entire row and column to 0. Use the first row and first column as markers for O(1) extra space.',
        hasVisualization: true,
        tags: ['array', 'matrix', 'in-place'],
      },
      {
        id: 'find-disappeared-numbers',
        title: 'Find All Numbers Disappeared in an Array',
        difficulty: 'Easy',
        leetcodeNumber: 448,
        description:
          'Given an array of n integers where values are in [1,n], find all integers in [1,n] that do not appear. Use in-place negation as a visited marker.',
        hasVisualization: true,
        tags: ['array', 'hash-table', 'in-place'],
      },
      {
        id: 'third-maximum-number',
        title: 'Third Maximum Number',
        difficulty: 'Easy',
        leetcodeNumber: 414,
        description:
          'Find the third distinct maximum number in an array. If it does not exist, return the maximum. Track the top three distinct values in a single pass.',
        hasVisualization: true,
        tags: ['array', 'sorting', 'greedy'],
      },
      {
        id: 'array-partition',
        title: 'Array Partition',
        difficulty: 'Easy',
        leetcodeNumber: 561,
        description:
          'Given 2n integers, group them into n pairs to maximize the sum of the minimum of each pair. Sort the array and sum every other element starting at index 0.',
        hasVisualization: true,
        tags: ['array', 'sorting', 'greedy'],
      },
      {
        id: 'reshape-matrix',
        title: 'Reshape the Matrix',
        difficulty: 'Easy',
        leetcodeNumber: 566,
        description:
          'Reshape an m x n matrix into an r x c matrix while preserving row-major order. If the total elements differ, return the original matrix.',
        hasVisualization: true,
        tags: ['array', 'matrix', 'simulation'],
      },
      {
        id: 'can-place-flowers',
        title: 'Can Place Flowers',
        difficulty: 'Easy',
        leetcodeNumber: 605,
        description:
          'Determine if n flowers can be planted in a flowerbed without any two flowers being adjacent. Greedily plant whenever a position and its neighbors are all empty.',
        hasVisualization: true,
        tags: ['array', 'greedy'],
      },
      {
        id: 'maximum-average-subarray',
        title: 'Maximum Average Subarray I',
        difficulty: 'Easy',
        leetcodeNumber: 643,
        description:
          'Find the contiguous subarray of length k with the maximum average using a sliding window technique.',
        hasVisualization: true,
        tags: ['sliding-window', 'array', 'subarray'],
      },
      {
        id: 'shortest-unsorted-subarray',
        title: 'Shortest Unsorted Continuous Subarray',
        difficulty: 'Medium',
        leetcodeNumber: 581,
        description:
          'Find the shortest subarray that when sorted makes the entire array sorted. Track the running max left-to-right and running min right-to-left to locate boundaries.',
        hasVisualization: true,
        tags: ['array', 'sorting', 'two-pointers'],
      },
      {
        id: 'non-decreasing-array',
        title: 'Non-decreasing Array',
        difficulty: 'Medium',
        leetcodeNumber: 665,
        description:
          'Check if an array can become non-decreasing by modifying at most one element. When a violation is found, decide greedily whether to lower the previous or raise the current element.',
        hasVisualization: true,
        tags: ['array', 'greedy'],
      },
      {
        id: 'toeplitz-matrix',
        title: 'Toeplitz Matrix',
        difficulty: 'Easy',
        leetcodeNumber: 766,
        description:
          'A matrix is Toeplitz if every diagonal from top-left to bottom-right has the same element. Check each cell against its upper-left neighbor.',
        hasVisualization: true,
        tags: ['array', 'matrix'],
      },
      {
        id: 'monotonic-array',
        title: 'Monotonic Array',
        difficulty: 'Easy',
        leetcodeNumber: 896,
        description:
          'Determine if an array is monotonic (entirely non-increasing or non-decreasing) in a single pass using two boolean flags updated simultaneously.',
        hasVisualization: true,
        tags: ['array', 'monotonic'],
      },
      {
        id: 'sort-array-by-parity',
        title: 'Sort Array By Parity',
        difficulty: 'Easy',
        leetcodeNumber: 905,
        description:
          'Move all even integers to the beginning and all odd integers to the end using two in-place pointers converging from both ends.',
        hasVisualization: true,
        tags: ['two-pointers', 'array', 'in-place'],
      },
      {
        id: 'valid-mountain-array',
        title: 'Valid Mountain Array',
        difficulty: 'Easy',
        leetcodeNumber: 941,
        description:
          'Check if an array is mountain-shaped: strictly increasing to a peak (not first or last element) then strictly decreasing. Use a single index walk.',
        hasVisualization: true,
        tags: ['array', 'two-pointers'],
      },
      {
        id: 'k-diff-pairs',
        title: 'K-diff Pairs in an Array',
        difficulty: 'Medium',
        leetcodeNumber: 532,
        description:
          'Count unique k-diff pairs in an array where a pair has absolute difference equal to k. Use a frequency map and check for each key whether key+k also exists.',
        hasVisualization: true,
        tags: ['hash-map', 'array', 'two-pointers'],
      },
      {
        id: 'find-all-duplicates',
        title: 'Find All Duplicates in an Array',
        difficulty: 'Medium',
        leetcodeNumber: 442,
        description:
          'Find all elements appearing twice in an array where values are in [1,n]. Use the in-place negation trick: if the element at abs(num)-1 is already negative, num is a duplicate.',
        hasVisualization: true,
        tags: ['array', 'hash-table', 'in-place'],
      },
      {
        id: 'max-chunks-to-sort',
        title: 'Max Chunks To Make Sorted',
        difficulty: 'Medium',
        leetcodeNumber: 769,
        description:
          'Given a permutation of [0,n-1], find the maximum number of chunks that can be independently sorted to produce the full sorted array. A chunk ends where the running max equals the current index.',
        hasVisualization: true,
        tags: ['array', 'greedy', 'sorting'],
      },
      {
        id: 'image-smoother',
        title: 'Image Smoother',
        difficulty: 'Easy',
        leetcodeNumber: 661,
        description:
          'Apply a mean filter to an image matrix: replace each cell with the floor of the average of itself and all valid neighbors within distance 1.',
        hasVisualization: true,
        tags: ['array', 'matrix', 'simulation'],
      },
      {
        id: 'transpose-matrix',
        title: 'Transpose Matrix',
        difficulty: 'Easy',
        leetcodeNumber: 867,
        description:
          'Return the transpose of a 2D integer matrix by swapping rows and columns: element at [i][j] moves to [j][i].',
        hasVisualization: true,
        tags: ['array', 'matrix', 'simulation'],
      },
      {
        id: 'first-missing-positive',
        title: 'First Missing Positive',
        difficulty: 'Hard',
        leetcodeNumber: 41,
        description:
          'Find the smallest missing positive integer in O(n) time and O(1) space. Use cyclic sort to place each value in its correct index, then scan for the first mismatch.',
        hasVisualization: true,
        tags: ['array', 'hash-table', 'cyclic-sort'],
      },
      {
        id: 'max-product-three-numbers',
        title: 'Maximum Product of Three Numbers',
        difficulty: 'Easy',
        leetcodeNumber: 628,
        description:
          'Find the maximum product of three numbers in an integer array. After sorting, compare the product of the top three vs the two smallest and the largest.',
        hasVisualization: true,
        tags: ['array', 'sorting', 'math', 'greedy'],
      },
      {
        id: 'duplicate-zeros',
        title: 'Duplicate Zeros',
        difficulty: 'Easy',
        leetcodeNumber: 1089,
        description:
          'Duplicate each zero in a fixed-length array in-place, shifting remaining elements right and discarding elements beyond the original length. Use a two-pass right-to-left approach.',
        hasVisualization: true,
        tags: ['array', 'two-pointers', 'in-place'],
      },
    ],
  },
];

// ─── Interview Recommended Problems ──────────────────────────────────────────
// Classic problems frequently asked in coding interviews (Blind 75 + essentials)

const INTERVIEW_RECOMMENDED_IDS = new Set([
  'pair-sum-sorted',
  'triplet-sum',
  'is-palindrome-valid',
  'largest-container',
  'trapping-rain-water',
  'pair-sum-unsorted',
  'contains-duplicate',
  'group-anagrams',
  'top-k-frequent-elements',
  'valid-anagram',
  'longest-chain-of-consecutive-numbers',
  'encode-decode-strings',
  'linked-list-reversal',
  'remove-kth-last-node',
  'merge-two-sorted-lists',
  'lru-cache',
  'add-two-numbers',
  'copy-list-with-random-pointer',
  'reverse-nodes-in-k-group',
  'linked-list-loop',
  'find-duplicate-number',
  'happy-number',
  'longest-substring-with-unique-characters',
  'minimum-window-substring',
  'permutation-in-string',
  'find-the-insertion-index',
  'find-target-in-rotated-sorted-array',
  'find-median-from-two-sorted-arrays',
  'find-minimum-rotated-sorted-array',
  'time-based-key-value-store',
  'matrix-search',
  'valid-parentheses',
  'daily-temperatures',
  'min-stack',
  'largest-rectangle-histogram',
  'generate-parentheses',
  'reverse-polish-notation',
  'decode-string',
  'k-most-frequent-strings',
  'combine-sorted-linked-lists',
  'median-of-integer-stream',
  'last-stone-weight',
  'merge-overlapping-intervals',
  'insert-interval',
  'meeting-rooms-ii',
  'non-overlapping-intervals',
  'product-array-without-current-element',
  'k-sum-subarrays',
  'invert-binary-tree',
  'max-depth-binary-tree',
  'same-tree',
  'subtree-of-another-tree',
  'bst-validation',
  'lowest-common-ancestor',
  'binary-tree-level-order-traversal',
  'serialize-deserialize-binary-tree',
  'kth-smallest-in-bst',
  'diameter-of-binary-tree',
  'build-binary-tree-from-preorder-inorder',
  'balanced-binary-tree-validation',
  'binary-tree-zigzag-traversal',
  'path-sum',
  'design-a-trie',
  'insert-and-search-words-with-wildcards',
  'graph-deep-copy',
  'count-islands',
  'prerequisites',
  'pacific-atlantic-water-flow',
  'word-search',
  'number-of-connected-components',
  'graph-valid-tree',
  'find-all-permutations',
  'find-all-subsets',
  'combinations-of-a-sum',
  'phone-keypad-combinations',
  'climbing-stairs',
  'minimum-coin-combination',
  'longest-common-subsequence',
  'longest-palindrome-in-string',
  'maximum-subarray-sum',
  'best-time-buy-sell-stock',
  'decode-ways',
  'word-break',
  'longest-increasing-subsequence',
  'edit-distance',
  'neighborhood-burglary',
  'house-robber-ii',
  'unique-paths-with-obstacles',
  'partition-equal-subset-sum',
  'target-sum',
  'jump-to-the-end',
  'partition-labels',
  'kth-largest-integer',
  'lonely-integer',
  'hamming-weights-of-integers',
  'missing-number',
  'reverse-bits',
  'number-of-1-bits',
  'sum-of-two-integers',
  'spiral-traversal',
  'rotate-image',
  'spiral-matrix-ii',
  'diagonal-traverse',
  'set-mismatch',
  'merge-sorted-array',
  'next-permutation',
  'rotate-image-ii',
  'set-matrix-zeroes-ii',
  'game-of-life-ii',
  'sort-colors-ii',
  'remove-duplicates-from-sorted-array-ii',
  'container-with-most-water-ii',
  'trapping-rain-water-two-pointer',
  'three-sum-with-multiplicity',
  'count-complete-subarrays',
  'minimum-swaps-to-group-all-ones',
  'fruits-into-baskets-iii',
  'subarrays-with-k-different-integers-ii',
  'count-subarrays-with-fixed-bounds-ii',
  'search-in-rotated-sorted-array-ii',
  'find-kth-smallest-pair-distance',
  'smallest-divisor-given-threshold',
  'minimum-number-of-days-to-make-bouquets',
  'aggressive-cows',
  'allocate-minimum-pages',
  'kth-largest-element-ii',
  'median-of-two-sorted-arrays-ii',
  'pairs-of-songs-with-total-divisible-by-60',
  'verifying-alien-dictionary',
  'design-hashmap-ii',
  'sort-linked-list-ii',
  'convert-sorted-list-to-bst',
  'basic-calculator-iii',
  'car-fleet-ii',
  'daily-temperatures-iii',
  'largest-rectangle-in-histogram-ii',
  'trapping-rain-water-stack',
  'remove-k-digits-ii',
  'meeting-rooms-iii',
  'maximum-subsequence-score',
  'total-cost-to-hire-k-workers',
  'maximum-performance-of-team',
  'the-skyline-problem',
  'sliding-window-median-ii',
  'median-of-data-stream',
  'subarray-sum-equals-k-ii',
  'contiguous-array-ii',
  'product-of-array-except-self-ii',
  'make-sum-divisible-by-p',
  'path-sum-iii',
  'binary-tree-cameras',
  'amount-of-time-for-binary-tree-infection',
  'find-duplicate-subtrees',
  'sum-of-distances-in-tree',
  'construct-binary-tree-from-preorder-inorder-ii',
  'serialize-and-deserialize-binary-tree-ii',
  'house-robber-iii-tree',
  'distribute-coins-in-binary-tree',
  'count-good-nodes-ii',
  'word-break-trie',
  'search-suggestions-system-trie',
  'design-search-autocomplete-system',
  'bus-routes',
  'jump-game-iii',
  'shortest-path-in-grid-with-obstacles',
  'shortest-path-visiting-all-nodes',
  'network-delay-time-iii',
  'path-with-maximum-probability',
  'design-graph-with-shortest-path',
  'course-schedule-iii',
  'course-schedule-iv',
  'alien-dictionary-iii',
  'minimum-height-trees-ii',
  'reorder-routes-to-lead-to-city',
  'rotting-oranges-ii',
  'open-the-lock-ii',
  'snakes-and-ladders',
  'word-ladder-iv',
  'making-a-large-island',
  'shortest-bridge-ii',
  'is-graph-bipartite-ii',
  'redundant-connection-ii',
  'number-of-operations-to-make-network-connected',
  'smallest-string-with-swaps',
  'minimum-spanning-tree-kruskal',
  'minimum-spanning-tree-prim',
  'critical-connections-in-network-ii',
  'unique-paths-iii',
  'cherry-pickup-ii',
  'stone-game-ii',
  'predict-the-winner',
  'best-time-to-buy-sell-stock-iv',
  'best-time-to-buy-sell-stock-cooldown-ii',
  'paint-house-dp',
  'decode-ways-ii-dp',
  'knight-dialer-ii',
  'maximum-profit-in-job-scheduling-ii',
  'partition-to-k-equal-sum-subsets',
  'shortest-path-to-get-all-keys',
  'traveling-salesman-problem',
  'n-queens-ii',
  'sudoku-solver-bt',
  'palindrome-partitioning-bt',
  'expression-add-operators',
  'word-break-ii',
  'path-with-maximum-gold',
  'candy-distribution',
  'minimum-number-of-taps',
  'earliest-possible-day-of-full-bloom',
  'single-number-iii',
  'counting-bits-ii',
  'merge-sort-visualization',
  'quick-sort-visualization',
  'wiggle-sort-ii',
  'kth-smallest-element-in-bst-ii',
  'merge-intervals-iii',
  'insert-interval-iii',
  'meeting-rooms-iv',
  'employee-free-time',
  'data-stream-as-disjoint-intervals',
  'range-sum-query-mutable-ii',
  'count-of-smaller-numbers-segment',
  'kmp-pattern-matching',
  'rabin-karp-search',
  'longest-duplicate-substring',
  'design-twitter-ii',
  'design-tic-tac-toe-ii',
  'time-based-key-value-store-ii',
  'insert-delete-getrandom-ii',
  'random-pick-with-weight-ii',
  'exam-room',
  'pow-x-n-ii',
  'count-primes-ii',
  'robot-bounded-in-circle',
  'max-points-on-a-line-ii',
  'angle-between-hands-of-clock',
]);

// Enrich problems with interview recommendation flag
CATEGORIES.forEach(cat =>
  cat.problems.forEach(p => {
    if (INTERVIEW_RECOMMENDED_IDS.has(p.id)) {
      p.isInterviewRecommended = true;
    }
  })
);

// ─── Helper Functions ─────────────────────────────────────────────────

/**
 * Returns a flat array of all problems across every category.
 */
export function getAllProblems(): ProblemInfo[] {
  return CATEGORIES.flatMap((category) => category.problems);
}

/**
 * Finds a category by its slug/id.
 */
export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((category) => category.id === slug);
}

/**
 * Finds a problem by its id across all categories.
 */
export function getProblemById(id: string): ProblemInfo | undefined {
  return getAllProblems().find((problem) => problem.id === id);
}

/**
 * Returns the category that contains the given problem id.
 */
export function getCategoryForProblem(problemId: string): CategoryInfo | undefined {
  return CATEGORIES.find((category) =>
    category.problems.some((problem) => problem.id === problemId)
  );
}
