import SortAlgorithm from './SortAlgorithm.js';

export default class BubbleSort extends SortAlgorithm {
    constructor() {
        super();
        this.name = "Bubble Sort";
        this.complexity = {
            time: { worst: "O(n²)", avg: "O(n²)" },
            space: "O(1)"
        };
        this.description = "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.";
        this.code = `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`;
    }

    generateTrace(array) {
        const trace = [];
        const arr = [...array]; // Work on a copy
        const n = arr.length;
        const sortedIndices = [];

        const callStack = ['bubbleSort(arr)'];

        // Initial State
        trace.push(this.createStep('start', [], arr, sortedIndices, 'Starting Bubble Sort', { n }, [1, 2], callStack));

        for (let i = 0; i < n; i++) {
            let swapped = false;
            trace.push(this.createStep('highlight', [], arr, sortedIndices, `Starting pass ${i}`, { n, i, swapped }, [3], callStack));

            for (let j = 0; j < n - i - 1; j++) {
                // Compare
                trace.push(this.createStep('compare', [j, j + 1], arr, sortedIndices, `Comparing indices ${j} and ${j+1}`, { n, i, j, swapped }, [4, 5], callStack));

                if (arr[j] > arr[j + 1]) {
                    // Swap
                    this.swap(arr, j, j + 1);
                    swapped = true;
                    trace.push(this.createStep('swap', [j, j + 1], arr, sortedIndices, `Swapping indices ${j} and ${j+1}`, { n, i, j, temp: arr[j], swapped }, [6, 7, 8], callStack));
                }
            }

            // Mark end of pass as sorted
            sortedIndices.push(n - 1 - i);
            trace.push(this.createStep('sorted', [n - 1 - i], arr, sortedIndices, `Element at ${n - 1 - i} is sorted`, { n, i, swapped }, [3], callStack));

            // Optimization: if no swaps, array is sorted
            if (!swapped) {
                 // Mark remaining as sorted
                 const sortedSet = new Set(sortedIndices);
                 for(let k = 0; k < n - 1 - i; k++) {
                     if (!sortedSet.has(k)) sortedIndices.push(k);
                 }
                 trace.push(this.createStep('sorted', [], arr, sortedIndices, 'Early termination: Array is sorted', { n, i, swapped }, [12], callStack));
                 break;
            }
        }

        // Final State
        trace.push(this.createStep('finish', [], arr, sortedIndices, 'Sorting Complete', { n }, [12], callStack));

        return trace;
    }
}
