export default class ComplexityAnalyzer {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.chart = null;
    }

    /**
     * Runs the user code with varying input sizes and plots the result.
     * @param {string} userCode The function body as string. It must accept 'arr' or 'n'.
     */
    async analyze(userCode) {
        const sizes = [10, 50, 100, 200, 500, 1000, 2000, 5000];
        const times = [];
        const ops = []; // if we can count ops, otherwise just time

        // Safe-ish evaluation: we create a Function from string
        // The user code is expected to be the body of a function that takes 'n' or 'arr'.
        // If it takes 'arr', we generate a random array of size n.
        // If it takes 'n', we just pass n.

        let func;
        try {
            // We'll wrap it to detect if it expects arr or n
            // Heuristic: check if string contains 'arr'
            if (userCode.includes('arr')) {
                func = new Function('arr', userCode);
            } else {
                func = new Function('n', userCode);
            }
        } catch (e) {
            alert("Error parsing code: " + e.message);
            return;
        }

        for (let n of sizes) {
            let input;
            if (userCode.includes('arr')) {
                input = Array.from({length: n}, () => Math.floor(Math.random() * 10000));
            } else {
                input = n;
            }

            const start = performance.now();
            try {
                func(input);
            } catch (e) {
                console.error("Runtime error", e);
                break; // Stop if error
            }
            const end = performance.now();
            times.push(end - start);
        }

        this.plot(sizes.slice(0, times.length), times);
        return this.fitCurve(sizes.slice(0, times.length), times);
    }

    plot(sizes, times) {
        const ctx = document.getElementById(this.canvasId).getContext('2d');

        if (this.chart) {
            this.chart.destroy();
        }

        // We need Chart.js loaded globally
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sizes,
                datasets: [{
                    label: 'Execution Time (ms)',
                    data: times,
                    borderColor: '#3b82f6', // blue-500
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Time Complexity Analysis',
                        color: '#9ca3af'
                    },
                    legend: {
                        labels: { color: '#9ca3af' }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Input Size (N)', color: '#6b7280' },
                        ticks: { color: '#9ca3af' },
                        grid: { color: '#374151' }
                    },
                    y: {
                        title: { display: true, text: 'Time (ms)', color: '#6b7280' },
                        ticks: { color: '#9ca3af' },
                        grid: { color: '#374151' }
                    }
                }
            }
        });
    }

    fitCurve(sizes, times) {
        // Very basic heuristic
        // Check for Linear (Time / N is const), Quadratic (Time / N^2 is const)
        // We'll just look at the last point vs middle point ratios roughly
        if (times.length < 3) return "Insufficient Data";

        const n1 = sizes[sizes.length - 2];
        const t1 = times[times.length - 2];
        const n2 = sizes[sizes.length - 1];
        const t2 = times[times.length - 1];

        if (t1 <= 0 || t2 <= 0) return "Fast (Constant/Linear)";

        const ratioN = n2 / n1;
        const ratioT = t2 / t1;

        // If N doubles (ratioN=2)
        // Linear: T doubles (ratioT=2)
        // Quad: T quadruples (ratioT=4)
        // Log-Linear: T slightly more than doubles

        const logRatio = Math.log(ratioT) / Math.log(ratioN);

        if (logRatio < 0.2) return "O(1) - Constant";
        if (logRatio < 1.3) return "O(n) - Linear";
        if (logRatio < 1.6) return "O(n log n) - Linearithmic";
        if (logRatio < 2.5) return "O(n²) - Quadratic";
        return "O(n³) or higher";
    }
}
