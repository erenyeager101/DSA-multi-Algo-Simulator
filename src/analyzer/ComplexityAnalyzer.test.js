import test from 'node:test';
import assert from 'node:assert/strict';
import ComplexityAnalyzer from './ComplexityAnalyzer.js';

test('ComplexityAnalyzer.fitCurve', async (t) => {
    const analyzer = new ComplexityAnalyzer('test-canvas');

    await t.test('should return "Insufficient Data" if times length < 3', () => {
        assert.strictEqual(analyzer.fitCurve([100, 200], [1, 2]), "Insufficient Data");
    });

    await t.test('should return "Fast (Constant/Linear)" if times are non-positive', () => {
        assert.strictEqual(analyzer.fitCurve([100, 200, 300], [1, 0, 5]), "Fast (Constant/Linear)");
        assert.strictEqual(analyzer.fitCurve([100, 200, 300], [1, 5, 0]), "Fast (Constant/Linear)");
        assert.strictEqual(analyzer.fitCurve([100, 200, 300], [1, -1, 5]), "Fast (Constant/Linear)");
    });

    await t.test('should identify O(1) - Constant complexity', () => {
        // ratioN = 2, ratioT = 1.1 => logRatio ≈ 0.137 < 0.2
        const sizes = [1000, 2000, 4000];
        const times = [10, 10, 11];
        assert.strictEqual(analyzer.fitCurve(sizes, times), "O(1) - Constant");
    });

    await t.test('should identify O(n) - Linear complexity', () => {
        // ratioN = 2, ratioT = 2 => logRatio = 1 < 1.3
        const sizes = [1000, 2000, 4000];
        const times = [5, 10, 20];
        assert.strictEqual(analyzer.fitCurve(sizes, times), "O(n) - Linear");
    });

    await t.test('should identify O(n log n) - Linearithmic complexity', () => {
        // ratioN = 2, ratioT = 2.8 => logRatio ≈ 1.485 < 1.6
        const sizes = [1000, 2000, 4000];
        const times = [10, 10, 28];
        assert.strictEqual(analyzer.fitCurve(sizes, times), "O(n log n) - Linearithmic");
    });

    await t.test('should identify O(n²) - Quadratic complexity', () => {
        // ratioN = 2, ratioT = 4 => logRatio = 2 < 2.5
        const sizes = [1000, 2000, 4000];
        const times = [10, 10, 40];
        assert.strictEqual(analyzer.fitCurve(sizes, times), "O(n²) - Quadratic");
    });

    await t.test('should identify O(n³) or higher complexity', () => {
        // ratioN = 2, ratioT = 8 => logRatio = 3 >= 2.5
        const sizes = [1000, 2000, 4000];
        const times = [10, 10, 80];
        assert.strictEqual(analyzer.fitCurve(sizes, times), "O(n³) or higher");
    });
});
