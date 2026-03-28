import SortAlgorithm from '../src/algorithms/SortAlgorithm.js';

describe('SortAlgorithm', () => {
    let sortAlgo;

    beforeEach(() => {
        sortAlgo = new SortAlgorithm();
    });

    test('should initialize with default properties', () => {
        expect(sortAlgo.name).toBe("Sort Algorithm");
        expect(sortAlgo.complexity).toEqual({
            time: { worst: "O(n²)", avg: "O(n²)" },
            space: "O(1)"
        });
        expect(sortAlgo.code).toBe("// Base Sort Class");
        expect(sortAlgo.description).toBe("Base class for sorting algorithms.");
    });

    test('generateTrace should throw an error', () => {
        expect(() => {
            sortAlgo.generateTrace([1, 2, 3]);
        }).toThrow("generateTrace method must be implemented");
    });

    test('createStep should return a correctly formatted object', () => {
        const type = 'compare';
        const indices = [0, 1];
        const array = [3, 1, 2];
        const sortedIndices = [2];
        const description = "Comparing 3 and 1";
        const variables = { i: 0, j: 1 };
        const lineNumbers = [1, 2];
        const callStack = ['main'];

        const step = sortAlgo.createStep(type, indices, array, sortedIndices, description, variables, lineNumbers, callStack);

        expect(step.type).toBe(type);
        expect(step.indices).toBe(indices);
        expect(step.array).toEqual(array);
        expect(step.array).not.toBe(array); // Ensure it's a copy
        expect(step.sortedIndices).toEqual(sortedIndices);
        expect(step.sortedIndices).not.toBe(sortedIndices); // Ensure it's a copy
        expect(step.description).toBe(description);
        expect(step.variables).toEqual(variables);
        expect(step.variables).not.toBe(variables); // Ensure it's a copy
        expect(step.lineNumbers).toEqual(lineNumbers);
        expect(step.lineNumbers).not.toBe(lineNumbers); // Ensure it's a copy
        expect(step.callStack).toEqual(callStack);
        expect(step.callStack).not.toBe(callStack); // Ensure it's a copy
    });

    test('createStep should handle default parameters', () => {
        const type = 'swap';
        const indices = [0, 1];
        const array = [1, 3, 2];

        const step = sortAlgo.createStep(type, indices, array);

        expect(step.type).toBe(type);
        expect(step.indices).toBe(indices);
        expect(step.array).toEqual(array);
        expect(step.sortedIndices).toEqual([]);
        expect(step.description).toBe("");
        expect(step.variables).toEqual({});
        expect(step.lineNumbers).toEqual([]);
        expect(step.callStack).toEqual([]);
    });

    test('swap should correctly swap two elements in an array', () => {
        const array = [1, 2, 3, 4];
        sortAlgo.swap(array, 1, 3);
        expect(array).toEqual([1, 4, 3, 2]);
    });

    test('swap should handle swapping an element with itself', () => {
        const array = [1, 2, 3, 4];
        sortAlgo.swap(array, 2, 2);
        expect(array).toEqual([1, 2, 3, 4]);
    });
});
