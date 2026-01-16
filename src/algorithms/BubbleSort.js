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

        // Initial State
        trace.push(this.createStep('start', [], arr, sortedIndices, 'Starting Bubble Sort'));

        for (let i = 0; i < n; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                // Compare
                trace.push(this.createStep('compare', [j, j + 1], arr, sortedIndices, `Comparing indices ${j} and ${j+1}`));

                if (arr[j] > arr[j + 1]) {
                    // Swap
                    this.swap(arr, j, j + 1);
                    swapped = true;
                    trace.push(this.createStep('swap', [j, j + 1], arr, sortedIndices, `Swapping indices ${j} and ${j+1}`));
                }
            }

            // Mark end of pass as sorted
            sortedIndices.push(n - 1 - i);
            trace.push(this.createStep('sorted', [n - 1 - i], arr, sortedIndices, `Element at ${n - 1 - i} is sorted`));

            // Optimization: if no swaps, array is sorted
            if (!swapped) {
                 // Mark remaining as sorted
                 for(let k = 0; k < n - 1 - i; k++) {
                     if (!sortedIndices.includes(k)) sortedIndices.push(k);
                 }
                 trace.push(this.createStep('sorted', [], arr, sortedIndices, 'Early termination: Array is sorted'));
                 break;
            }
        }

        // Final State
        trace.push(this.createStep('finish', [], arr, sortedIndices, 'Sorting Complete'));

        return trace;
    }
}
