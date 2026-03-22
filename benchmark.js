
// benchmark.js
const traceSize = 10000;
const trace = [];
for (let i = 0; i < traceSize; i++) {
    const type = Math.random() > 0.5 ? 'compare' : (Math.random() > 0.5 ? 'swap' : 'highlight');
    trace.push({ type, description: 'Step ' + i });
}

function updateStatsFromTrace_OLD(stepIndex) {
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i <= stepIndex; i++) {
        const s = trace[i];
        if (s.type === 'compare') comparisons++;
        if (s.type === 'swap') swaps++;
    }
    return { comparisons, swaps };
}

console.log(`Benchmarking with trace size: ${traceSize}`);

console.time('Full Playback (OLD) - simulating rendering each step');
for (let i = 0; i < traceSize; i++) {
    updateStatsFromTrace_OLD(i);
}
console.timeEnd('Full Playback (OLD) - simulating rendering each step');

// Optimization: Pre-pass
const prePassStart = performance.now();
let comparisons = 0;
let swaps = 0;
trace.forEach((step) => {
    if (step.type === 'compare') comparisons++;
    if (step.type === 'swap') swaps++;
    step.cumulativeComparisons = comparisons;
    step.cumulativeSwaps = swaps;
});
const prePassEnd = performance.now();
console.log(`Pre-pass took: ${(prePassEnd - prePassStart).toFixed(4)}ms`);

function updateStatsFromTrace_NEW(stepIndex) {
    const step = trace[stepIndex];
    return { comparisons: step.cumulativeComparisons, swaps: step.cumulativeSwaps };
}

console.time('Full Playback (NEW) - simulating rendering each step');
for (let i = 0; i < traceSize; i++) {
    updateStatsFromTrace_NEW(i);
}
console.timeEnd('Full Playback (NEW) - simulating rendering each step');

// Test random access (like dragging a slider)
const randomIndices = Array.from({length: 1000}, () => Math.floor(Math.random() * traceSize));

console.time('Random Access (OLD) - 1000 jumps');
for (const idx of randomIndices) {
    updateStatsFromTrace_OLD(idx);
}
console.timeEnd('Random Access (OLD) - 1000 jumps');

console.time('Random Access (NEW) - 1000 jumps');
for (const idx of randomIndices) {
    updateStatsFromTrace_NEW(idx);
}
console.timeEnd('Random Access (NEW) - 1000 jumps');
