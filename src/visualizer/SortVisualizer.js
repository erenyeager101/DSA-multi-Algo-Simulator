export default class SortVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        // Make canvas responsive
        const parent = this.canvas.parentElement;
        if (parent) {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight;
        }
    }

    /**
     * Renders the current state of the array.
     * @param {number[]} array The array to render.
     * @param {object} step The current step object (from trace).
     */
    draw(array, step = null) {
        if (!array) return;

        // Ensure dimensions are correct
        if (this.canvas.width === 0 || this.canvas.height === 0) {
            this.resize();
        }

        const width = this.canvas.width;
        const height = this.canvas.height;
        const ctx = this.ctx;
        const n = array.length;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate bar dimensions
        const barWidth = (width / n) * 0.8; // 80% width, 20% gap
        const gap = (width / n) * 0.2;
        const xStart = gap / 2;

        // Find max value for scaling
        const maxVal = Math.max(...array, 10); // Avoid div by zero

        array.forEach((value, i) => {
            const barHeight = (value / maxVal) * (height * 0.9);
            const x = xStart + i * (barWidth + gap);
            const y = height - barHeight;

            // Determine color
            let color = '#60a5fa'; // Default Blue (Tailwind blue-400)

            if (step) {
                // Check if sorted first (lowest priority overrides default, but high priority overrides sorted?)
                // Usually sorted is permanent green.
                if (step.sortedIndices && step.sortedIndices.includes(i)) {
                    color = '#4ade80'; // Green (Tailwind green-400)
                }

                // Active operations override sorted color (e.g. if we are comparing sorted elements for some reason, though bubble sort doesn't usually)
                if (step.type === 'compare' && step.indices.includes(i)) {
                    color = '#facc15'; // Yellow (Tailwind yellow-400)
                } else if (step.type === 'swap' && step.indices.includes(i)) {
                    color = '#f87171'; // Red (Tailwind red-400)
                }
            }

            // Draw Bar
            ctx.fillStyle = color;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw Value (if few elements)
            if (n < 40) {
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(value, x + barWidth / 2, y - 5);
            }
        });
    }
}
