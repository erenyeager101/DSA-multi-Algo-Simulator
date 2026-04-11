import test from 'node:test';
import assert from 'node:assert/strict';
import BubbleSort from './BubbleSort.js';

test('BubbleSort', async (t) => {
    let sorter;

    t.beforeEach(() => {
        sorter = new BubbleSort();
    });

    await t.test('Initialization', () => {
        assert.equal(sorter.name, 'Bubble Sort');
        assert.deepEqual(sorter.complexity, {
            time: { worst: 'O(n²)', avg: 'O(n²)' },
            space: 'O(1)'
        });
        assert.ok(sorter.description.length > 0);
        assert.ok(sorter.code.length > 0);
    });

    await t.test('generateTrace()', async (t) => {
        await t.test('should handle empty array', () => {
            const trace = sorter.generateTrace([]);
            // start, finish steps
            assert.ok(trace.length >= 2);
            assert.deepEqual(trace[trace.length - 1].array, []);
        });

        await t.test('should handle single element array', () => {
            const trace = sorter.generateTrace([1]);
            // start, pass 0 highlight, pass 0 sorted, early termination, finish
            assert.ok(trace.length >= 4);
            assert.deepEqual(trace[trace.length - 1].array, [1]);
        });

        await t.test('should sort a standard array and generate correct steps', () => {
            const input = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
            const sorted = [...input].sort((a, b) => a - b);

            const trace = sorter.generateTrace(input);
            const finalState = trace[trace.length - 1];

            assert.equal(finalState.type, 'finish');
            assert.deepEqual(finalState.array, sorted);

            // Verify step types exist
            const stepTypes = new Set(trace.map(step => step.type));
            assert.ok(stepTypes.has('start'));
            assert.ok(stepTypes.has('highlight'));
            assert.ok(stepTypes.has('compare'));
            assert.ok(stepTypes.has('swap'));
            assert.ok(stepTypes.has('sorted'));
            assert.ok(stepTypes.has('finish'));
        });

        await t.test('should sort an already sorted array (early termination)', () => {
            const input = [1, 2, 3, 4, 5];
            const trace = sorter.generateTrace(input);

            const finalState = trace[trace.length - 1];
            assert.deepEqual(finalState.array, [1, 2, 3, 4, 5]);

            // Should not contain any swap steps
            const swapSteps = trace.filter(step => step.type === 'swap');
            assert.equal(swapSteps.length, 0);

            // Should terminate early
            const earlyTerminationStep = trace.find(step => step.description.includes('Early termination'));
            assert.ok(earlyTerminationStep !== undefined, 'Expected early termination step');

            // Should have very few steps compared to worst case
            assert.ok(trace.length < 20); // Just a quick bound
        });

        await t.test('should sort a reverse sorted array (worst case)', () => {
            const input = [5, 4, 3, 2, 1];
            const trace = sorter.generateTrace(input);

            const finalState = trace[trace.length - 1];
            assert.deepEqual(finalState.array, [1, 2, 3, 4, 5]);

            // Should contain many swap steps
            const swapSteps = trace.filter(step => step.type === 'swap');
            // For array of length 5 reverse sorted, there are 4+3+2+1 = 10 swaps
            assert.equal(swapSteps.length, 10);

            // In this specific implementation, early termination triggers on the last iteration
            // when i = n - 1, since the inner loop condition j < n - i - 1 becomes j < 0
            // and no swaps happen. We just ensure all 10 swaps happen before that.
        });
    });
});
