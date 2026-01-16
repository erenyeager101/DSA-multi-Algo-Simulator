import SortAlgorithm from './SortAlgorithm.js';

export default class InsertionSort extends SortAlgorithm {
    constructor() {
        super();
        this.name = "Insertion Sort";
        this.complexity = {
            time: { worst: "O(n²)", avg: "O(n²)" },
            space: "O(1)"
        };
        this.description = "Insertion Sort iterates, consuming one input element each repetition, and growing a sorted output list. At each iteration, insertion sort removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there.";
        this.code = `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`;
    }

    generateTrace(array) {
        const trace = [];
        const arr = [...array];
        const n = arr.length;
        // Insertion sort "grows" the sorted section from the left, but unlike bubble/selection,
        // elements in 0..i are sorted relative to each other, but not necessarily in final position
        // until the end. We will mark them as sorted for visualization purposes though.
        let sortedIndices = [0];

        trace.push(this.createStep('start', [], arr, sortedIndices, 'Starting Insertion Sort'));

        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;

            trace.push(this.createStep('highlight', [i], arr, sortedIndices, `Selecting key at index ${i} (${key})`));

            while (j >= 0 && arr[j] > key) {
                trace.push(this.createStep('compare', [j, j + 1], arr, sortedIndices, `Comparing ${arr[j]} > ${key}`));

                arr[j + 1] = arr[j]; // Shift
                trace.push(this.createStep('overwrite', [j + 1], arr, sortedIndices, `Shifting ${arr[j]} to index ${j+1}`));

                j = j - 1;
            }

            arr[j + 1] = key;
            trace.push(this.createStep('overwrite', [j + 1], arr, sortedIndices, `Inserted key ${key} at index ${j+1}`));

            // Add i to sorted list (and anything before it is technically sorted relative to it)
            if (!sortedIndices.includes(i)) sortedIndices.push(i);
        }

        // Finalize sorted
        sortedIndices = Array.from({length: n}, (_, i) => i);
        trace.push(this.createStep('finish', [], arr, sortedIndices, 'Sorting Complete'));
        return trace;
    }
}
