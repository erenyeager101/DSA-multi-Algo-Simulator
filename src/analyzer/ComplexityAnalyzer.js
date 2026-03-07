import AIService from '../services/AIService.js';

export default class ComplexityAnalyzer {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.chart = null;
    }

    /**
     * Analyzes the user code.
     * @param {string} userCode The function body as string.
     * @param {string} lang The language to use (javascript, python, java, cpp)
     */
    async analyze(userCode, lang = 'javascript') {
        const sizes = [100, 500, 1000, 2000, 4000];
        const times = [];

        // For JavaScript, run locally to avoid API limits and for speed.
        if (lang === 'javascript') {
            try {
                // To support full function syntax rather than just the body, we eval it
                // We wrap it in an IIFE returning the solve function.
                let funcString = userCode + `\n; return typeof solve === 'function' ? solve : null;`;
                let getFunc = new Function(funcString);
                let solveFunc = getFunc();

                if (!solveFunc) return { error: "Could not find a function named 'solve'." };

                for (let n of sizes) {
                    let input = Array.from({length: n}, () => Math.floor(Math.random() * 10000));
                    const start = performance.now();
                    solveFunc(input);
                    const end = performance.now();
                    times.push(end - start);
                }

                this.plot(sizes.slice(0, times.length), times);
                const complexity = this.fitCurve(sizes.slice(0, times.length), times);
                return { complexity, type: 'local' };
            } catch (e) {
                return { error: `JavaScript Execution Error: ${e.message}` };
            }
        } else {
            // For Python, Java, C++, we send to Gemini API for static analysis
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
            try {
                const analysisText = await AIService.optimizeCode(userCode);

                // Extremely simple parser to extract predicted Big O from Gemini's response
                // Gemini will be instructed to return it in a specific format in AIService.
                const match = analysisText.match(/Complexity:\s*(O\([^\)]+\))/i);
                const complexity = match ? match[1] : "Check Explanation";

                return { complexity, type: 'ai', explanation: analysisText };
            } catch(e) {
                return { error: `AI Analysis Error: ${e.message}` };
            }
        }
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
