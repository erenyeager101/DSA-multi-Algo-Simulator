export default class ComplexityAnalyzer {
    constructor(canvasId) {
        this.canvasId = canvasId;
        this.chart = null;
    }

    /**
     * Runs the user code with varying input sizes and plots the result.
     * @param {string} userCode The function body as string. It must contain 'solve'.
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
            } catch (e) {
                return { error: `JavaScript Execution Error: ${e.message}` };
            }
        } else {
            // Execute via Piston API
            const result = await this.executeViaPiston(userCode, lang, sizes);
            if (result.error) return result;
            times.push(...result.times);
        }

        this.plot(sizes.slice(0, times.length), times);
        const complexity = this.fitCurve(sizes.slice(0, times.length), times);
        return { complexity };
    }

    async executeViaPiston(userCode, lang, sizes) {
        // Map our language names to Piston's runtime names
        const langMap = {
            python: { language: 'python', version: '3.10.0' },
            java: { language: 'java', version: '15.0.2' },
            cpp: { language: 'cpp', version: '10.2.0' }
        };

        const config = langMap[lang];
        if (!config) return { error: `Unsupported language: ${lang}` };

        // We generate a wrapper code that builds the arrays, calls solve(), and prints the time for each size.
        let wrapperCode = '';
        if (lang === 'python') {
            wrapperCode = `
import time
import random

${userCode}

sizes = [${sizes.join(',')}]
for n in sizes:
    arr = [random.randint(0, 10000) for _ in range(n)]
    start = time.perf_counter()
    solve(arr)
    end = time.perf_counter()
    print((end - start) * 1000) # Print in milliseconds
`;
        } else if (lang === 'java') {
            wrapperCode = `
import java.util.Random;

${userCode.replace(/public class \w+/, "class Solution")}

public class Main {
    public static void main(String[] args) {
        int[] sizes = {${sizes.join(',')}};
        Random rand = new Random();
        for (int n : sizes) {
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) arr[i] = rand.nextInt(10000);

            long start = System.nanoTime();
            Solution.solve(arr);
            long end = System.nanoTime();

            System.out.println((end - start) / 1000000.0);
        }
    }
}
`;
        } else if (lang === 'cpp') {
            wrapperCode = `
#include <iostream>
#include <vector>
#include <chrono>
#include <random>

${userCode}

int main() {
    std::vector<int> sizes = {${sizes.join(',')}};
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 10000);

    for (int n : sizes) {
        std::vector<int> arr(n);
        for (int i = 0; i < n; i++) arr[i] = dis(gen);

        auto start = std::chrono::high_resolution_clock::now();
        solve(arr);
        auto end = std::chrono::high_resolution_clock::now();

        std::chrono::duration<double, std::milli> duration = end - start;
        std::cout << duration.count() << std::endl;
    }
    return 0;
}
`;
        }

        try {
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: config.language,
                    version: config.version,
                    files: [{ content: wrapperCode }]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                return { error: `Piston API Error: ${data.message || response.statusText}` };
            }

            if (data.compile && data.compile.code !== 0) {
                return { error: `Compilation Error:\n${data.compile.output}` };
            }

            if (data.run.code !== 0) {
                return { error: `Runtime Error:\n${data.run.output}` };
            }

            // Parse output
            const times = data.run.output.trim().split('\n').map(parseFloat);

            if (times.some(isNaN)) {
                 return { error: `Execution Output Error. Expected times, got:\n${data.run.output}` };
            }

            return { times };
        } catch (error) {
            return { error: `Network error reaching execution API: ${error.message}` };
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
