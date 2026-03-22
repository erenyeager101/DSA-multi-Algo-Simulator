import SortAlgorithm from '../src/algorithms/SortAlgorithm.js';
import assert from 'node:assert';
import { test, describe, beforeEach } from 'node:test';

describe('SortAlgorithm', () => {
    let sortAlgo;

    beforeEach(() => {
        sortAlgo = new SortAlgorithm();
    });

    test('createStep should return a correctly formatted step object', () => {
        const type = 'compare';
        const indices = [0, 1];
        const array = [3, 1, 2];
        const sortedIndices = [];
        const description = 'Comparing 3 and 1';
        const variables = { i: 0, j: 1 };
        const lineNumbers = [10];
        const callStack = ['bubbleSort'];

        const step = sortAlgo.createStep(
            type,
            indices,
            array,
            sortedIndices,
            description,
            variables,
            lineNumbers,
            callStack
        );

        assert.deepStrictEqual(step, {
            type: 'compare',
            indices: [0, 1],
            array: [3, 1, 2],
            sortedIndices: [],
            description: 'Comparing 3 and 1',
            variables: { i: 0, j: 1 },
            lineNumbers: [10],
            callStack: ['bubbleSort']
        });
    });

    test('createStep should create a snapshot of the array', () => {
        const array = [1, 2, 3];
        const step = sortAlgo.createStep('test', [], array);

        // Modify original array
        array[0] = 99;

        // Step array should remain unchanged
        assert.deepStrictEqual(step.array, [1, 2, 3]);
        assert.notStrictEqual(step.array, array);
    });

    test('createStep should create a snapshot of sortedIndices', () => {
        const sortedIndices = [0];
        const step = sortAlgo.createStep('test', [], [1, 2], sortedIndices);

        sortedIndices.push(1);

        assert.deepStrictEqual(step.sortedIndices, [0]);
        assert.notStrictEqual(step.sortedIndices, sortedIndices);
    });

    test('createStep should create a snapshot of variables', () => {
        const variables = { a: 1 };
        const step = sortAlgo.createStep('test', [], [1], [], '', variables);

        variables.a = 2;

        assert.deepStrictEqual(step.variables, { a: 1 });
        assert.notStrictEqual(step.variables, variables);
    });

    test('createStep should use default values for optional parameters', () => {
        const step = sortAlgo.createStep('highlight', [5], [10, 20]);

        assert.deepStrictEqual(step, {
            type: 'highlight',
            indices: [5],
            array: [10, 20],
            sortedIndices: [],
            description: '',
            variables: {},
            lineNumbers: [],
            callStack: []
        });
    });
});
