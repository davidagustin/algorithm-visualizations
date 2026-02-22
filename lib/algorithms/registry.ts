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
  // Two Pointers
  'pair-sum-sorted', 'triplet-sum', 'is-palindrome-valid', 'largest-container', 'trapping-rain-water',
  // Hash Maps
  'pair-sum-unsorted', 'contains-duplicate', 'group-anagrams', 'top-k-frequent-elements',
  'valid-anagram', 'longest-chain-of-consecutive-numbers', 'encode-decode-strings',
  // Linked Lists
  'linked-list-reversal', 'remove-kth-last-node', 'merge-two-sorted-lists', 'lru-cache',
  'add-two-numbers', 'copy-list-with-random-pointer', 'reverse-nodes-in-k-group',
  // Fast & Slow Pointers
  'linked-list-loop', 'find-duplicate-number', 'happy-number',
  // Sliding Windows
  'longest-substring-with-unique-characters', 'minimum-window-substring', 'permutation-in-string',
  // Binary Search
  'find-the-insertion-index', 'find-target-in-rotated-sorted-array', 'find-median-from-two-sorted-arrays',
  'find-minimum-rotated-sorted-array', 'time-based-key-value-store', 'matrix-search',
  // Stacks
  'valid-parentheses', 'daily-temperatures', 'min-stack', 'largest-rectangle-histogram',
  'generate-parentheses', 'reverse-polish-notation', 'decode-string',
  // Heaps
  'k-most-frequent-strings', 'combine-sorted-linked-lists', 'median-of-integer-stream',
  'last-stone-weight',
  // Intervals
  'merge-overlapping-intervals', 'insert-interval', 'meeting-rooms-ii', 'non-overlapping-intervals',
  // Prefix Sums
  'product-array-without-current-element', 'k-sum-subarrays',
  // Trees
  'invert-binary-tree', 'max-depth-binary-tree', 'same-tree', 'subtree-of-another-tree',
  'bst-validation', 'lowest-common-ancestor', 'binary-tree-level-order-traversal',
  'serialize-deserialize-binary-tree', 'kth-smallest-in-bst', 'diameter-of-binary-tree',
  'build-binary-tree-from-preorder-inorder', 'balanced-binary-tree-validation',
  'binary-tree-zigzag-traversal', 'path-sum',
  // Tries
  'design-a-trie', 'insert-and-search-words-with-wildcards',
  // Graphs
  'graph-deep-copy', 'count-islands', 'prerequisites', 'pacific-atlantic-water-flow',
  'word-search', 'number-of-connected-components', 'graph-valid-tree',
  // Backtracking
  'find-all-permutations', 'find-all-subsets', 'combinations-of-a-sum', 'phone-keypad-combinations',
  // Dynamic Programming
  'climbing-stairs', 'minimum-coin-combination', 'longest-common-subsequence',
  'longest-palindrome-in-string', 'maximum-subarray-sum', 'best-time-buy-sell-stock',
  'decode-ways', 'word-break', 'longest-increasing-subsequence', 'edit-distance',
  'neighborhood-burglary', 'house-robber-ii', 'unique-paths-with-obstacles',
  'partition-equal-subset-sum', 'target-sum',
  // Greedy
  'jump-to-the-end', 'partition-labels',
  // Sort & Search
  'kth-largest-integer',
  // Bit Manipulation
  'lonely-integer', 'hamming-weights-of-integers', 'missing-number', 'reverse-bits',
  'number-of-1-bits', 'sum-of-two-integers',
  // Math & Geometry
  'spiral-traversal', 'rotate-image',
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
