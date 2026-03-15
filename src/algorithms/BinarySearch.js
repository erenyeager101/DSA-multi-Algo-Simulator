import SortAlgorithm from './SortAlgorithm.js';

export default class BinarySearch extends SortAlgorithm {
    constructor() {
        super();
        this.name = "Binary Search";
        this.complexity = {
            time: { worst: "O(log n)", avg: "O(log n)" },
            space: "O(1)"
        };
        this.description = "Binary Search is a search algorithm that finds the position of a target value within a sorted array. It compares the target value to the middle element of the array. If they are not equal, the half in which the target cannot lie is eliminated and the search continues on the remaining half.";
        this.code = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`;
    }

    generateTrace(array) {
        const trace = [];
        // Binary search requires a sorted array. We must sort it first.
        const arr = [...array].sort((a, b) => a - b);
        const n = arr.length;
        const callStack = ['binarySearch(arr, target)'];
        const sortedIndices = []; // To highlight the found target

        // Pick a target from the array to guarantee finding it
        const target = arr[Math.floor(Math.random() * n)];

        trace.push(this.createStep('start', [], arr, [], `Starting Binary Search for target: ${target}. Array sorted.`, { n, target }, [1, 2], callStack));

        let left = 0;
        let right = n - 1;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            trace.push(this.createStep('highlight', [left, right], arr, sortedIndices, `Current range [${left}, ${right}], mid = ${mid}`, { left, right, mid, target }, [4, 5], callStack));

            trace.push(this.createStep('compare', [mid], arr, sortedIndices, `Comparing mid element ${arr[mid]} with target ${target}`, { left, right, mid, target }, [6], callStack));

            if (arr[mid] === target) {
                sortedIndices.push(mid);
                trace.push(this.createStep('sorted', [mid], arr, sortedIndices, `Target ${target} found at index ${mid}!`, { left, right, mid, target }, [6], callStack));
                return trace;
            } else if (arr[mid] < target) {
                left = mid + 1;
                trace.push(this.createStep('highlight', [left], arr, sortedIndices, `Target is greater. Moving left bound to ${left}`, { left, right, mid, target }, [7], callStack));
            } else {
                right = mid - 1;
                trace.push(this.createStep('highlight', [right], arr, sortedIndices, `Target is smaller. Moving right bound to ${right}`, { left, right, mid, target }, [8], callStack));
            }
        }

        trace.push(this.createStep('finish', [], arr, sortedIndices, `Target ${target} not found.`, { n, target }, [10], callStack));

        return trace;
    }
}
