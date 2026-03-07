import SortAlgorithm from './SortAlgorithm.js';

export default class SelectionSort extends SortAlgorithm {
    constructor() {
        super();
        this.name = "Selection Sort";
        this.complexity = {
            time: { worst: "O(n²)", avg: "O(n²)" },
            space: "O(1)"
        };
        this.description = "Selection Sort divides the input list into two parts: the sublist of items already sorted and the sublist of items remaining to be sorted that occupy the rest of the list. It proceeds by finding the smallest element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element, and moving the sublist boundaries one element to the right.";
        this.code = `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    if (min != i) {
      let temp = arr[i];
      arr[i] = arr[min];
      arr[min] = temp;
    }
  }
  return arr;
}`;
    }

    generateTrace(array) {
        const trace = [];
        const arr = [...array];
        const n = arr.length;
        const sortedIndices = [];
        const callStack = ['selectionSort(arr)'];

        trace.push(this.createStep('start', [], arr, sortedIndices, 'Starting Selection Sort', { n }, [1, 2], callStack));

        for (let i = 0; i < n; i++) {
            let min = i;
            // Highlight starting minimum
            trace.push(this.createStep('compare', [min], arr, sortedIndices, `Current minimum is at index ${min}`, { n, i, min }, [3, 4], callStack));

            for (let j = i + 1; j < n; j++) {
                trace.push(this.createStep('compare', [min, j], arr, sortedIndices, `Comparing index ${j} with minimum at ${min}`, { n, i, min, j }, [5, 6], callStack));
                if (arr[j] < arr[min]) {
                    min = j;
                    trace.push(this.createStep('compare', [min], arr, sortedIndices, `New minimum found at index ${min}`, { n, i, min, j }, [7], callStack));
                }
            }

            if (min !== i) {
                trace.push(this.createStep('highlight', [i, min], arr, sortedIndices, `Swapping minimum at ${min} with ${i}`, { n, i, min }, [10], callStack));
                this.swap(arr, i, min);
                trace.push(this.createStep('swap', [i, min], arr, sortedIndices, `Swapping complete`, { n, i, min, temp: arr[i] }, [11, 12, 13], callStack));
            }

            sortedIndices.push(i);
            trace.push(this.createStep('sorted', [i], arr, sortedIndices, `Element at ${i} is sorted`, { n, i }, [3], callStack));
        }

        trace.push(this.createStep('finish', [], arr, sortedIndices, 'Sorting Complete', { n }, [16], callStack));
        return trace;
    }
}
