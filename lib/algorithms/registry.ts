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
