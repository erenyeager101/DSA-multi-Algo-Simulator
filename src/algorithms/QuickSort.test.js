import test from 'node:test';
import assert from 'node:assert/strict';
import QuickSort from './QuickSort.js';

test('QuickSort', async (t) => {
    let sorter;

    t.beforeEach(() => {
        sorter = new QuickSort();
    });

    await t.test('constructor()', async (t) => {
        await t.test('should set the correct name', () => {
            assert.strictEqual(sorter.name, "Quick Sort");
        });

        await t.test('should set the correct complexity', () => {
            assert.deepEqual(sorter.complexity, {
                time: { worst: "O(n²)", avg: "O(n log n)" },
                space: "O(log n)"
            });
        });
    });

    await t.test('generateTrace()', async (t) => {
        await t.test('should correctly sort an unsorted array', () => {
            const arr = [5, 3, 8, 4, 2];
            const trace = sorter.generateTrace(arr);

            // Get the final array from the last step
            const finalStep = trace[trace.length - 1];
            assert.strictEqual(finalStep.type, 'finish');
            assert.deepEqual(finalStep.array, [2, 3, 4, 5, 8]);
        });

        await t.test('should handle an already sorted array', () => {
            const arr = [1, 2, 3, 4, 5];
            const trace = sorter.generateTrace(arr);

            const finalStep = trace[trace.length - 1];
            assert.strictEqual(finalStep.type, 'finish');
            assert.deepEqual(finalStep.array, [1, 2, 3, 4, 5]);
        });

        await t.test('should handle a reverse sorted array', () => {
            const arr = [5, 4, 3, 2, 1];
            const trace = sorter.generateTrace(arr);

            const finalStep = trace[trace.length - 1];
            assert.strictEqual(finalStep.type, 'finish');
            assert.deepEqual(finalStep.array, [1, 2, 3, 4, 5]);
        });

        await t.test('should handle an array with duplicate elements', () => {
            const arr = [4, 2, 4, 1, 4];
            const trace = sorter.generateTrace(arr);

            const finalStep = trace[trace.length - 1];
            assert.strictEqual(finalStep.type, 'finish');
            assert.deepEqual(finalStep.array, [1, 2, 4, 4, 4]);
        });

        await t.test('should handle a single-element array', () => {
            const arr = [42];
            const trace = sorter.generateTrace(arr);

            const finalStep = trace[trace.length - 1];
            assert.strictEqual(finalStep.type, 'finish');
            assert.deepEqual(finalStep.array, [42]);
        });

        await t.test('should handle an empty array', () => {
            const arr = [];
            const trace = sorter.generateTrace(arr);

            const finalStep = trace[trace.length - 1];
            assert.strictEqual(finalStep.type, 'finish');
            assert.deepEqual(finalStep.array, []);
        });

        await t.test('should correctly populate sortedIndices in the final step', () => {
            const arr = [3, 1, 2];
            const trace = sorter.generateTrace(arr);
            const finalStep = trace[trace.length - 1];

            assert.deepEqual(finalStep.sortedIndices.sort((a,b) => a - b), [0, 1, 2]);
        });
    });
});
