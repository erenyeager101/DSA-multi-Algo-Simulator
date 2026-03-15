import SortAlgorithm from './SortAlgorithm.js';

export default class ReverseArray extends SortAlgorithm {
    constructor() {
        super();
        this.name = "Reverse Array";
        this.complexity = {
            time: { worst: "O(n)", avg: "O(n)" },
            space: "O(1)"
        };
        this.description = "Reverses the array in-place using the two pointers approach. One pointer starts at the beginning, the other at the end. They swap elements and move towards the center until they meet.";
        this.code = `function reverseArray(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    let temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
  }
  return arr;
}`;
    }

    generateTrace(array) {
        const trace = [];
        const arr = [...array];
        const n = arr.length;
        const sortedIndices = [];
        const callStack = ['reverseArray(arr)'];

        trace.push(this.createStep('start', [], arr, sortedIndices, 'Starting Two Pointers Array Reversal', { n }, [1, 2], callStack));

        let left = 0;
        let right = n - 1;

        while (left < right) {
            trace.push(this.createStep('highlight', [left, right], arr, sortedIndices, `Pointers at left=${left}, right=${right}`, { left, right }, [4], callStack));

            this.swap(arr, left, right);
            trace.push(this.createStep('swap', [left, right], arr, sortedIndices, `Swapped elements at ${left} and ${right}`, { left, right, temp: arr[left] }, [5, 6, 7], callStack));

            sortedIndices.push(left);
            sortedIndices.push(right);

            left++;
            right--;
        }

        if (left === right) sortedIndices.push(left); // middle element

        trace.push(this.createStep('finish', [], arr, sortedIndices, 'Array Reversal Complete', { n, left, right }, [11], callStack));

        return trace;
    }
}
