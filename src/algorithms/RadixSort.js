import SortAlgorithm from './SortAlgorithm.js';

export default class RadixSort extends SortAlgorithm {
    constructor() {
        super();
        this.name = "Radix Sort";
        this.complexity = {
            time: { worst: "O(nk)", avg: "O(nk)" },
            space: "O(n+k)"
        };
        this.description = "Radix sort is a non-comparative sorting algorithm. It avoids comparison by creating and distributing elements into buckets according to their radix. For elements with more than one significant digit, this bucketing process is repeated for each digit.";
        this.code = `function radixSort(arr) {
  let max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10)
    countSort(arr, exp);
}
function countSort(arr, exp) {
  let output = new Array(arr.length);
  let count = new Array(10).fill(0);
  for (let i = 0; i < arr.length; i++)
    count[Math.floor(arr[i] / exp) % 10]++;
  for (let i = 1; i < 10; i++)
    count[i] += count[i - 1];
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
    count[Math.floor(arr[i] / exp) % 10]--;
  }
  for (let i = 0; i < arr.length; i++)
    arr[i] = output[i];
}`;
    }

    generateTrace(array) {
        const trace = [];
        const arr = [...array];
        const n = arr.length;
        const sortedIndices = [];
        const callStack = ['radixSort(arr)'];

        trace.push(this.createStep('start', [], arr, sortedIndices, 'Starting Radix Sort', { n }, [1, 2], callStack));

        let max = Math.max(...arr);

        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            this.countSort(arr, exp, trace, sortedIndices, callStack);
        }

        for(let i=0; i<n; i++) sortedIndices.push(i);
        trace.push(this.createStep('finish', [], arr, sortedIndices, 'Sorting Complete', { n }, [4], callStack));

        return trace;
    }

    countSort(arr, exp, trace, sortedIndices, callStack) {
        callStack.push(`countSort(arr, ${exp})`);
        let n = arr.length;
        let output = new Array(n);
        let count = new Array(10).fill(0);

        trace.push(this.createStep('highlight', [], arr, sortedIndices, `Counting for exp ${exp}`, { exp }, [8, 9], callStack));

        for (let i = 0; i < n; i++) {
            trace.push(this.createStep('highlight', [i], arr, sortedIndices, `Counting element ${arr[i]}`, { exp, i }, [10], callStack));
            count[Math.floor(arr[i] / exp) % 10]++;
        }

        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (let i = n - 1; i >= 0; i--) {
            let index = Math.floor(arr[i] / exp) % 10;
            output[count[index] - 1] = arr[i];
            count[index]--;
        }

        for (let i = 0; i < n; i++) {
            arr[i] = output[i];
            trace.push(this.createStep('overwrite', [i], arr, sortedIndices, `Updating array index ${i} to ${output[i]}`, { exp, i, val: output[i] }, [18], callStack));
        }

        callStack.pop();
    }
}
