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
        const callStack = ['quickSort(arr)'];

        trace.push(this.createStep('start', [], arr, [], 'Starting Quick Sort', { low: 0, high: n-1 }, [1], callStack));

        this.quickSortHelper(arr, 0, n - 1, trace, sortedIndices, callStack);

        for(let i=0; i<n; i++) if(!sortedIndices.includes(i)) sortedIndices.push(i);
        trace.push(this.createStep('finish', [], arr, sortedIndices, 'Sorting Complete', {}, [], callStack));
        return trace;
    }

    quickSortHelper(arr, low, high, trace, sortedIndices, callStack) {
        if (low < high) {
            trace.push(this.createStep('highlight', [], arr, sortedIndices, `Condition low < high met`, { low, high }, [2], callStack));

            callStack.push(`partition(arr, ${low}, ${high})`);
            const pi = this.partition(arr, low, high, trace, callStack);
            callStack.pop();

            // pi is now sorted
            if (!sortedIndices.includes(pi)) sortedIndices.push(pi);
            trace.push(this.createStep('sorted', [pi], arr, sortedIndices, `Pivot ${arr[pi]} is in correct position`, { low, high, pi }, [3], callStack));

            callStack.push(`quickSort(arr, ${low}, ${pi - 1})`);
            trace.push(this.createStep('highlight', [], arr, sortedIndices, `Sorting left of pivot`, { low, high, pi }, [4], callStack));
            this.quickSortHelper(arr, low, pi - 1, trace, sortedIndices, callStack);
            callStack.pop();

            callStack.push(`quickSort(arr, ${pi + 1}, ${high})`);
            trace.push(this.createStep('highlight', [], arr, sortedIndices, `Sorting right of pivot`, { low, high, pi }, [5], callStack));
            this.quickSortHelper(arr, pi + 1, high, trace, sortedIndices, callStack);
            callStack.pop();
        } else if (low === high) {
             if (!sortedIndices.includes(low)) sortedIndices.push(low);
        }
    }

    partition(arr, low, high, trace, callStack) {
        const pivot = arr[high];
        trace.push(this.createStep('highlight', [high], arr, [], `Pivot selected: ${pivot}`, { low, high, pivot }, [3], callStack));

        let i = (low - 1);

        for (let j = low; j < high; j++) {
            trace.push(this.createStep('compare', [j, high], arr, [], `Comparing ${arr[j]} with pivot ${pivot}`, { low, high, pivot, i, j }, [3], callStack));

            if (arr[j] < pivot) {
                i++;
                this.swap(arr, i, j);
                trace.push(this.createStep('swap', [i, j], arr, [], `Swapping ${arr[i]} and ${arr[j]}`, { low, high, pivot, i, j, temp: arr[i] }, [3], callStack));
            }
        }
        this.swap(arr, i + 1, high);
        trace.push(this.createStep('swap', [i + 1, high], arr, [], `Moving pivot to correct position`, { low, high, pivot, i }, [3], callStack));
        return i + 1;
    }
}
