import SortAlgorithm from './SortAlgorithm.js';

export default class MergeSort extends SortAlgorithm {
    constructor() {
        super();
        this.name = "Merge Sort";
        this.complexity = {
            time: { worst: "O(n log n)", avg: "O(n log n)" },
            space: "O(n)"
        };
        this.description = "Merge Sort is a divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.";
        this.code = `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`;
    }

    generateTrace(array) {
        const trace = [];
        const arr = [...array];
        const n = arr.length;
        const sortedIndices = []; // Merge sort doesn't have a simple "sorted so far" set until end of merges.
        const callStack = ['mergeSort(arr)'];

        trace.push(this.createStep('start', [], arr, [], 'Starting Merge Sort', { n }, [1], callStack));

        this.mergeSortHelper(arr, 0, n - 1, trace, callStack);

        // All sorted at end
        for(let i=0; i<n; i++) sortedIndices.push(i);
        trace.push(this.createStep('finish', [], arr, sortedIndices, 'Sorting Complete', {}, [7], callStack));

        return trace;
    }

    mergeSortHelper(arr, left, right, trace, callStack) {
        if (left >= right) {
            trace.push(this.createStep('highlight', [left], arr, [], `Base case reached at index ${left}`, { left, right }, [2], callStack));
            return;
        }

        const mid = Math.floor((left + right) / 2);

        trace.push(this.createStep('highlight', [mid], arr, [], `Splitting at index ${mid}`, { left, right, mid }, [3], callStack));

        callStack.push(`mergeSort(leftHalf)`);
        trace.push(this.createStep('highlight', [], arr, [], `Sorting left half`, { left, right, mid }, [4], callStack));
        this.mergeSortHelper(arr, left, mid, trace, callStack);
        callStack.pop();

        callStack.push(`mergeSort(rightHalf)`);
        trace.push(this.createStep('highlight', [], arr, [], `Sorting right half`, { left, right, mid }, [5], callStack));
        this.mergeSortHelper(arr, mid + 1, right, trace, callStack);
        callStack.pop();

        callStack.push(`merge(leftHalf, rightHalf)`);
        this.merge(arr, left, mid, right, trace, callStack);
        callStack.pop();
    }

    merge(arr, left, mid, right, trace, callStack) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        trace.push(this.createStep('highlight', [], arr, [], `Merging range [${left}...${mid}] and [${mid+1}...${right}]`, { left, mid, right }, [6], callStack));

        while (i < leftArr.length && j < rightArr.length) {
            trace.push(this.createStep('compare', [left + i, mid + 1 + j], arr, [], `Comparing ${leftArr[i]} and ${rightArr[j]}`, { left, mid, right, i, j, k }, [6], callStack));

            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                trace.push(this.createStep('overwrite', [k], arr, [], `Overwriting index ${k} with ${leftArr[i]}`, { left, mid, right, i, j, k }, [6], callStack));
                i++;
            } else {
                arr[k] = rightArr[j];
                trace.push(this.createStep('overwrite', [k], arr, [], `Overwriting index ${k} with ${rightArr[j]}`, { left, mid, right, i, j, k }, [6], callStack));
                j++;
            }
            k++;
        }

        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            trace.push(this.createStep('overwrite', [k], arr, [], `Overwriting index ${k} with remaining ${leftArr[i]}`, { left, mid, right, i, j, k }, [6], callStack));
            i++;
            k++;
        }

        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            trace.push(this.createStep('overwrite', [k], arr, [], `Overwriting index ${k} with remaining ${rightArr[j]}`, { left, mid, right, i, j, k }, [6], callStack));
            j++;
            k++;
        }
    }
}
