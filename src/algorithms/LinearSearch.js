import SortAlgorithm from './SortAlgorithm.js';

export default class LinearSearch extends SortAlgorithm {
    constructor() {
        super();
        this.name = "Linear Search";
        this.complexity = {
            time: { worst: "O(n)", avg: "O(n)" },
            space: "O(1)"
        };
        this.description = "Linear search is a very simple search algorithm. In this type of search, a sequential search is made over all items one by one. Every item is checked and if a match is found then that particular item is returned, otherwise the search continues till the end of the data collection.";
        this.code = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`;
    }

    generateTrace(array) {
        const trace = [];
        const arr = [...array];
        const n = arr.length;
        const sortedIndices = [];
        const callStack = ['linearSearch(arr, target)'];

        // Pick a random target from the array to guarantee finding it, or occasionally miss.
        const target = arr[Math.floor(Math.random() * n)];

        trace.push(this.createStep('start', [], arr, sortedIndices, \`Starting Linear Search for target: \${target}\`, { n, target }, [1, 2], callStack));

        let found = false;
        for (let i = 0; i < n; i++) {
            trace.push(this.createStep('compare', [i], arr, sortedIndices, \`Checking index \${i}\`, { n, i, target }, [3], callStack));

            if (arr[i] === target) {
                sortedIndices.push(i); // Using sorted color (green) to highlight found target
                trace.push(this.createStep('sorted', [i], arr, sortedIndices, \`Target \${target} found at index \${i}!\`, { n, i, target }, [4], callStack));
                found = true;
                break;
            }
        }

        if (!found) {
            trace.push(this.createStep('finish', [], arr, sortedIndices, \`Target \${target} not found.\`, { n, target }, [7], callStack));
        }

        return trace;
    }
}
