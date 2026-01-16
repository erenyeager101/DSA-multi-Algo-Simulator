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

        trace.push(this.createStep('start', [], arr, [], 'Starting Merge Sort'));

        this.mergeSortHelper(arr, 0, n - 1, trace);

        // All sorted at end
        for(let i=0; i<n; i++) sortedIndices.push(i);
        trace.push(this.createStep('finish', [], arr, sortedIndices, 'Sorting Complete'));

        return trace;
    }

    mergeSortHelper(arr, left, right, trace) {
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);

        trace.push(this.createStep('highlight', [mid], arr, [], `Splitting at index ${mid}`));

        this.mergeSortHelper(arr, left, mid, trace);
        this.mergeSortHelper(arr, mid + 1, right, trace);

        this.merge(arr, left, mid, right, trace);
    }

    merge(arr, left, mid, right, trace) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        trace.push(this.createStep('highlight', [], arr, [], `Merging range [${left}...${mid}] and [${mid+1}...${right}]`));

        while (i < leftArr.length && j < rightArr.length) {
            trace.push(this.createStep('compare', [left + i, mid + 1 + j], arr, [], `Comparing ${leftArr[i]} and ${rightArr[j]}`));

            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                trace.push(this.createStep('overwrite', [k], arr, [], `Overwriting index ${k} with ${leftArr[i]}`));
                i++;
            } else {
                arr[k] = rightArr[j];
                trace.push(this.createStep('overwrite', [k], arr, [], `Overwriting index ${k} with ${rightArr[j]}`));
                j++;
            }
            k++;
        }

        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            trace.push(this.createStep('overwrite', [k], arr, [], `Overwriting index ${k} with remaining ${leftArr[i]}`));
            i++;
            k++;
        }

        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            trace.push(this.createStep('overwrite', [k], arr, [], `Overwriting index ${k} with remaining ${rightArr[j]}`));
            j++;
            k++;
        }
    }
}
