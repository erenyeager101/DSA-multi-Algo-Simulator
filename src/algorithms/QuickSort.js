import SortAlgorithm from './SortAlgorithm.js';

export default class QuickSort extends SortAlgorithm {
    constructor() {
        super();
        this.name = "Quick Sort";
        this.complexity = {
            time: { worst: "O(n²)", avg: "O(n log n)" },
            space: "O(log n)"
        };
        this.description = "Quick Sort is a divide and conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot.";
        this.code = `function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}`;
    }

    generateTrace(array) {
        const trace = [];
        const arr = [...array];
        const n = arr.length;
        const sortedIndices = [];

        trace.push(this.createStep('start', [], arr, [], 'Starting Quick Sort'));

        this.quickSortHelper(arr, 0, n - 1, trace, sortedIndices);

        for(let i=0; i<n; i++) if(!sortedIndices.includes(i)) sortedIndices.push(i);
        trace.push(this.createStep('finish', [], arr, sortedIndices, 'Sorting Complete'));
        return trace;
    }

    quickSortHelper(arr, low, high, trace, sortedIndices) {
        if (low < high) {
            const pi = this.partition(arr, low, high, trace);

            // pi is now sorted
            if (!sortedIndices.includes(pi)) sortedIndices.push(pi);
            trace.push(this.createStep('sorted', [pi], arr, sortedIndices, `Pivot ${arr[pi]} is in correct position`));

            this.quickSortHelper(arr, low, pi - 1, trace, sortedIndices);
            this.quickSortHelper(arr, pi + 1, high, trace, sortedIndices);
        } else if (low === high) {
             if (!sortedIndices.includes(low)) sortedIndices.push(low);
        }
    }

    partition(arr, low, high, trace) {
        const pivot = arr[high];
        trace.push(this.createStep('highlight', [high], arr, [], `Pivot selected: ${pivot}`));

        let i = (low - 1);

        for (let j = low; j < high; j++) {
            trace.push(this.createStep('compare', [j, high], arr, [], `Comparing ${arr[j]} with pivot ${pivot}`));

            if (arr[j] < pivot) {
                i++;
                this.swap(arr, i, j);
                trace.push(this.createStep('swap', [i, j], arr, [], `Swapping ${arr[i]} and ${arr[j]}`));
            }
        }
        this.swap(arr, i + 1, high);
        trace.push(this.createStep('swap', [i + 1, high], arr, [], `Moving pivot to correct position`));
        return i + 1;
    }
}
