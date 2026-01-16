export default class SortAlgorithm {
    constructor() {
        this.name = "Sort Algorithm";
        this.complexity = {
            time: { worst: "O(n²)", avg: "O(n²)" },
            space: "O(1)"
        };
        this.code = `// Base Sort Class`;
        this.description = "Base class for sorting algorithms.";
    }

    /**
     * Generates a trace of the sorting execution.
     * @param {number[]} array The input array to sort.
     * @returns {object[]} Trace of steps.
     */
    generateTrace(array) {
        throw new Error("generateTrace method must be implemented");
    }

    /**
     * Helper to create a trace step.
     */
    createStep(type, indices, array, sortedIndices = [], description = "") {
        return {
            type, // 'compare', 'swap', 'overwrite', 'highlight', 'sorted'
            indices,
            array: [...array], // Snapshot
            sortedIndices: [...sortedIndices],
            description
        };
    }

    swap(array, i, j) {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
