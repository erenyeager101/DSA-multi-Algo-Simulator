import SortAlgorithm from './SortAlgorithm.js';

export default class HeapSort extends SortAlgorithm {
    constructor() {
        super();
        this.name = "Heap Sort";
        this.complexity = {
            time: { worst: "O(n log n)", avg: "O(n log n)" },
            space: "O(1)"
        };
        this.description = "Heap sort is a comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place the maximum element at the end. We repeat the same process for remaining element.";
        this.code = `function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    let temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    heapify(arr, i, 0);
  }
}
function heapify(arr, n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest != i) {
    let swap = arr[i];
    arr[i] = arr[largest];
    arr[largest] = swap;
    heapify(arr, n, largest);
  }
}`;
    }

    generateTrace(array) {
        const trace = [];
        const arr = [...array];
        const n = arr.length;
        const sortedIndices = [];
        const callStack = ['heapSort(arr)'];

        trace.push(this.createStep('start', [], arr, sortedIndices, 'Starting Heap Sort', { n }, [1, 2], callStack));

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapify(arr, n, i, trace, sortedIndices, callStack);
        }

        for (let i = n - 1; i > 0; i--) {
            trace.push(this.createStep('highlight', [0, i], arr, sortedIndices, `Swapping root with end of heap`, { n, i }, [6, 7, 8], callStack));
            this.swap(arr, 0, i);
            trace.push(this.createStep('swap', [0, i], arr, sortedIndices, `Swapped`, { n, i }, [6, 7, 8], callStack));

            sortedIndices.push(i);
            trace.push(this.createStep('sorted', [i], arr, sortedIndices, `Element at ${i} is sorted`, { n, i }, [9], callStack));

            this.heapify(arr, i, 0, trace, sortedIndices, callStack);
        }

        sortedIndices.push(0);
        trace.push(this.createStep('finish', [], arr, sortedIndices, 'Sorting Complete', { n }, [10], callStack));

        return trace;
    }

    heapify(arr, n, i, trace, sortedIndices, callStack) {
        callStack.push(`heapify(arr, ${n}, ${i})`);
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;

        trace.push(this.createStep('highlight', [i], arr, sortedIndices, `Heapifying at index ${i}`, { n, i, largest, l, r }, [13, 14, 15], callStack));

        if (l < n) {
            trace.push(this.createStep('compare', [l, largest], arr, sortedIndices, `Comparing left child`, { n, i, largest, l }, [16], callStack));
            if (arr[l] > arr[largest]) largest = l;
        }

        if (r < n) {
            trace.push(this.createStep('compare', [r, largest], arr, sortedIndices, `Comparing right child`, { n, i, largest, r }, [17], callStack));
            if (arr[r] > arr[largest]) largest = r;
        }

        if (largest != i) {
            trace.push(this.createStep('highlight', [i, largest], arr, sortedIndices, `Swapping with largest child`, { n, i, largest }, [19, 20, 21], callStack));
            this.swap(arr, i, largest);
            trace.push(this.createStep('swap', [i, largest], arr, sortedIndices, `Swapped`, { n, i, largest }, [19, 20, 21], callStack));
            this.heapify(arr, n, largest, trace, sortedIndices, callStack);
        }
        callStack.pop();
    }
}
