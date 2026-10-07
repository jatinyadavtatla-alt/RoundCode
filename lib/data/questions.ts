export interface ProblemDetail {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  expectedComplexity: {
    time: string;
    space: string;
  };
  starterCode: {
    cpp: string;
    java: string;
    python: string;
    javascript: string;
  };
  leetcodeUrl?: string;
}

export const QUESTIONS_DATA: Record<string, ProblemDetail> = {
  "1": {
    id: "1",
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    expectedComplexity: {
      time: "O(N)",
      space: "O(N)",
    },
    starterCode: {
      cpp: `#include <vector>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Write your solution here\n        \n    }\n};`,
      java: `import java.util.HashMap;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        pass\n`,
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Write your solution here\n  \n}\n`,
    },
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
  },
  "2": {
    id: "2",
    title: "Valid Parentheses",
    topic: "Stack",
    difficulty: "Easy",
    description:
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    examples: [
      {
        input: 's = "()"',
        output: "true",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "(]"',
        output: "false",
      },
    ],
    expectedComplexity: {
      time: "O(N)",
      space: "O(N)",
    },
    starterCode: {
      cpp: `#include <string>\n#include <stack>\n\nclass Solution {\npublic:\n    bool isValid(std::string s) {\n        // Write your solution here\n        \n    }\n};`,
      java: `import java.util.Stack;\n\nclass Solution {\n    public boolean isValid(String s) {\n        // Write your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your solution here\n        pass\n`,
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n  // Write your solution here\n  \n}\n`,
    },
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
  },
  "3": {
    id: "3",
    title: "Reverse Linked List",
    topic: "Linked List",
    difficulty: "Easy",
    description:
      "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
      },
    ],
    expectedComplexity: {
      time: "O(N)",
      space: "O(1)",
    },
    starterCode: {
      cpp: `/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(nullptr) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your solution here\n        \n    }\n};`,
      java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your solution here\n        pass\n`,
      javascript: `function reverseList(head) {\n  // Write your solution here\n  \n}\n`,
    },
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
  },
  "4": {
    id: "4",
    title: "Longest Substring Without Repeating Characters",
    topic: "Strings",
    difficulty: "Medium",
    description:
      "Given a string `s`, find the length of the longest substring without repeating characters.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.',
      },
    ],
    expectedComplexity: {
      time: "O(N)",
      space: "O(min(N, M))",
    },
    starterCode: {
      cpp: `#include <string>\n#include <unordered_set>\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(std::string s) {\n        // Write your solution here\n        \n    }\n};`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your solution here\n        pass\n`,
      javascript: `function lengthOfLongestSubstring(s) {\n  // Write your solution here\n  \n}\n`,
    },
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
  "5": {
    id: "5",
    title: "Binary Tree Level Order Traversal",
    topic: "Trees",
    difficulty: "Medium",
    description:
      "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000",
    ],
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
      },
    ],
    expectedComplexity: {
      time: "O(N)",
      space: "O(N)",
    },
    starterCode: {
      cpp: `#include <vector>\n#include <queue>\n\nclass Solution {\npublic:\n    std::vector<std::vector<int>> levelOrder(TreeNode* root) {\n        // Write your solution here\n        \n    }\n};`,
      java: `class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Write your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:\n        # Write your solution here\n        pass\n`,
      javascript: `function levelOrder(root) {\n  // Write your solution here\n  \n}\n`,
    },
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
  },
  "6": {
    id: "6",
    title: "Coin Change",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    description:
      "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4",
    ],
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1",
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
      },
    ],
    expectedComplexity: {
      time: "O(amount * coins.length)",
      space: "O(amount)",
    },
    starterCode: {
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    int coinChange(std::vector<int>& coins, int amount) {\n        // Write your solution here\n        \n    }\n};`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        # Write your solution here\n        pass\n`,
      javascript: `function coinChange(coins, amount) {\n  // Write your solution here\n  \n}\n`,
    },
    leetcodeUrl: "https://leetcode.com/problems/coin-change/",
  },
  "7": {
    id: "7",
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium",
    description:
      "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'.",
    ],
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: "1",
      },
    ],
    expectedComplexity: {
      time: "O(M * N)",
      space: "O(M * N)",
    },
    starterCode: {
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    int numIslands(std::vector<std::vector<char>>& grid) {\n        // Write your solution here\n        \n    }\n};`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        # Write your solution here\n        pass\n`,
      javascript: `function numIslands(grid) {\n  // Write your solution here\n  \n}\n`,
    },
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
  },
  "8": {
    id: "8",
    title: "LRU Cache",
    topic: "Linked List",
    difficulty: "Medium",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n* `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.\n* `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n* `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.",
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls will be made to get and put.",
    ],
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
      },
    ],
    expectedComplexity: {
      time: "O(1) per operation",
      space: "O(capacity)",
    },
    starterCode: {
      cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {\n        \n    }\n    \n    int get(int key) {\n        \n    }\n    \n    void put(int key, int value) {\n        \n    }\n};`,
      java: `class LRUCache {\n    public LRUCache(int capacity) {\n        \n    }\n    \n    public int get(int key) {\n        \n    }\n    \n    public void put(int key, int value) {\n        \n    }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass\n`,
      javascript: `class LRUCache {\n  constructor(capacity) {\n    \n  }\n  get(key) {\n    \n  }\n  put(key, value) {\n    \n  }\n}\n`,
    },
    leetcodeUrl: "https://leetcode.com/problems/lru-cache/",
  },
  "9": {
    id: "9",
    title: "Trapping Rain Water",
    topic: "Arrays",
    difficulty: "Hard",
    description:
      "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5",
    ],
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
      },
    ],
    expectedComplexity: {
      time: "O(N)",
      space: "O(1)",
    },
    starterCode: {
      cpp: `#include <vector>\n\nclass Solution {\npublic:\n    int trap(std::vector<int>& height) {\n        // Write your solution here\n        \n    }\n};`,
      java: `class Solution {\n    public int trap(int[] height) {\n        // Write your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def trap(self, height: list[int]) -> int:\n        # Write your solution here\n        pass\n`,
      javascript: `function trap(height) {\n  // Write your solution here\n  \n}\n`,
    },
    leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/",
  },
  "10": {
    id: "10",
    title: "Merge k Sorted Lists",
    topic: "Heap",
    difficulty: "Hard",
    description:
      "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
      "lists[i] is sorted in ascending order.",
    ],
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
      },
    ],
    expectedComplexity: {
      time: "O(N log k)",
      space: "O(k)",
    },
    starterCode: {
      cpp: `class Solution {\npublic:\n    ListNode* mergeKLists(std::vector<ListNode*>& lists) {\n        // Write your solution here\n        \n    }\n};`,
      java: `class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def mergeKLists(self, lists: list[Optional[ListNode]]) -> Optional[ListNode]:\n        # Write your solution here\n        pass\n`,
      javascript: `function mergeKLists(lists) {\n  // Write your solution here\n  \n}\n`,
    },
    leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/",
  },
};
