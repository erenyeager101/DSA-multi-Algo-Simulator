import test from 'node:test';
import assert from 'node:assert/strict';
import SortAlgorithm from './SortAlgorithm.js';

test('SortAlgorithm', async (t) => {
    await t.test('swap()', async (t) => {
        const sorter = new SortAlgorithm();

        await t.test('should correctly swap two elements at given indices', () => {
            const arr = [10, 20, 30, 40];
            sorter.swap(arr, 1, 2);
            assert.deepEqual(arr, [10, 30, 20, 40]);
        });

        await t.test('should handle swapping the same index', () => {
            const arr = [1, 2, 3];
            sorter.swap(arr, 1, 1);
            assert.deepEqual(arr, [1, 2, 3]);
        });

        await t.test('should swap strings correctly', () => {
            const arr = ['apple', 'banana', 'cherry'];
            sorter.swap(arr, 0, 2);
            assert.deepEqual(arr, ['cherry', 'banana', 'apple']);
        });

        await t.test('should swap object references correctly', () => {
            const obj1 = { id: 1 };
            const obj2 = { id: 2 };
            const arr = [obj1, obj2];
            sorter.swap(arr, 0, 1);
            assert.deepEqual(arr, [obj2, obj1]);
            assert.strictEqual(arr[0], obj2);
            assert.strictEqual(arr[1], obj1);
        });

        await t.test('should handle swapping with out-of-bounds indices (undefined)', () => {
            const arr = [1, 2];
            sorter.swap(arr, 0, 5);
            // array[5] is undefined, so arr[0] becomes undefined, and arr[5] becomes 1
            // JavaScript arrays are sparse. Length should become 6.
            assert.equal(arr[0], undefined);
            assert.equal(arr[1], 2);
            assert.equal(arr[5], 1);
            assert.equal(arr.length, 6);
        });
    });
});
