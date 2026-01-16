import BubbleSort from '../algorithms/BubbleSort.js';
import SortVisualizer from '../visualizer/SortVisualizer.js';

class Controller {
    constructor() {
        // State
        this.array = [];
        this.size = 30;
        this.speed = 50;
        this.isPlaying = false;
        this.currentStep = 0;
        this.trace = [];
        this.algorithm = new BubbleSort(); // Default
        this.visualizer = new SortVisualizer(document.getElementById('visualizer-canvas'));
        this.timer = null;

        // DOM Elements
        this.elements = {
            sizeSlider: document.getElementById('size-slider'),
            sizeValue: document.getElementById('size-value'),
            speedSlider: document.getElementById('speed-slider'),
            speedValue: document.getElementById('speed-value'),
            algoSelect: document.getElementById('algorithm-select'),
            randomizeBtn: document.getElementById('randomize-btn'),
            startBtn: document.getElementById('start-btn'),
            resetBtn: document.getElementById('reset-btn'),
            prevBtn: document.getElementById('prev-step-btn'),
            nextBtn: document.getElementById('next-step-btn'),
            playPauseBtn: document.getElementById('play-pause-btn'),
            progressSlider: document.getElementById('progress-slider'),
            statsComparisons: document.getElementById('stats-comparisons'),
            statsSwaps: document.getElementById('stats-swaps'),
            statsState: document.getElementById('stats-state'),
            compTimeWorst: document.getElementById('comp-time-worst'),
            compTimeAvg: document.getElementById('comp-time-avg'),
            compSpace: document.getElementById('comp-space'),
            codeDisplay: document.getElementById('code-display'),
            algoDesc: document.getElementById('algo-desc'),
            toggleCodeBtn: document.getElementById('toggle-code-btn'),
            codePanel: document.getElementById('code-panel'),
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAlgorithmInfo();
        this.generateArray();
    }

    setupEventListeners() {
        // Sliders
        this.elements.sizeSlider.addEventListener('input', (e) => {
            this.size = parseInt(e.target.value);
            this.elements.sizeValue.textContent = this.size;
            this.reset();
        });

        this.elements.speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            this.elements.speedValue.textContent = `${this.speed}x`;
            if (this.isPlaying) {
                this.pause();
                this.play(); // Restart with new speed
            }
        });

        // Algorithm Select
        this.elements.algoSelect.addEventListener('change', (e) => {
            const algoName = e.target.value;
            if (algoName === 'bubble') {
                this.algorithm = new BubbleSort();
            }
            // Add other algos here
            this.updateAlgorithmInfo();
            this.reset();
        });

        // Buttons
        this.elements.randomizeBtn.addEventListener('click', () => this.reset());

        this.elements.startBtn.addEventListener('click', () => {
            if (this.currentStep === 0) {
                 this.startVisualization();
            } else if (this.currentStep >= this.trace.length - 1) {
                this.reset();
                this.startVisualization();
            } else {
                this.togglePlay();
            }
        });

        this.elements.resetBtn.addEventListener('click', () => this.reset());

        this.elements.playPauseBtn.addEventListener('click', () => this.togglePlay());

        this.elements.prevBtn.addEventListener('click', () => {
            this.pause();
            this.step(-1);
        });

        this.elements.nextBtn.addEventListener('click', () => {
            this.pause();
            this.step(1);
        });

        this.elements.progressSlider.addEventListener('input', (e) => {
            this.pause();
            const step = parseInt(e.target.value);
            this.goToStep(step);
        });

        this.elements.toggleCodeBtn.addEventListener('click', () => {
             this.elements.codePanel.classList.toggle('translate-x-full');
             this.elements.codePanel.classList.toggle('md:translate-x-0'); // Toggle visibility on mobile/desktop appropriately
             // Actually, the transform logic in HTML was: translate-x-full md:translate-x-0
             // So on desktop it's visible by default.
             // Let's just toggle a class that hides/shows.
             // Simpler: just toggle 'hidden' on the panel or slide logic.
             // Given the classes: `translate-x-full md:translate-x-0`.
             // If I want to hide it on desktop, I need to add `md:translate-x-full`.
             this.elements.codePanel.classList.toggle('translate-x-full');
             this.elements.codePanel.classList.toggle('md:translate-x-full');
             this.elements.codePanel.classList.toggle('md:translate-x-0');
        });
    }

    updateAlgorithmInfo() {
        this.elements.compTimeWorst.textContent = this.algorithm.complexity.time.worst;
        this.elements.compTimeAvg.textContent = this.algorithm.complexity.time.avg;
        this.elements.compSpace.textContent = this.algorithm.complexity.space;
        this.elements.codeDisplay.textContent = this.algorithm.code;
        this.elements.algoDesc.textContent = this.algorithm.description;
    }

    generateArray() {
        this.array = [];
        for (let i = 0; i < this.size; i++) {
            this.array.push(Math.floor(Math.random() * 100) + 5);
        }
        this.trace = [];
        this.currentStep = 0;
        this.visualizer.draw(this.array);
        this.updateStats(0, 0, 'Idle');
        this.updateProgress();
    }

    reset() {
        this.pause();
        this.generateArray();
        this.elements.startBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Run';
        this.elements.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    startVisualization() {
        this.trace = this.algorithm.generateTrace(this.array);
        this.elements.progressSlider.max = this.trace.length - 1;
        this.play();
        this.elements.startBtn.innerHTML = '<i class="fas fa-pause mr-2"></i>Pause';
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            if (this.trace.length === 0) {
                this.startVisualization();
            } else {
                this.play();
            }
        }
    }

    play() {
        this.isPlaying = true;
        this.elements.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.elements.startBtn.innerHTML = '<i class="fas fa-pause mr-2"></i>Pause';

        const stepLoop = () => {
            if (!this.isPlaying) return;

            if (this.currentStep < this.trace.length - 1) {
                this.step(1);

                // Calculate delay
                // Speed 1-100. Delay: 1000ms - 10ms
                // Formula: 1000 / speed seems ok. 1000/1=1000, 1000/100=10.
                const delay = 1000 / (this.speed * 0.5); // Adjust multiplier for feel

                this.timer = setTimeout(stepLoop, delay);
            } else {
                this.pause();
                this.elements.startBtn.innerHTML = '<i class="fas fa-redo mr-2"></i>Restart';
            }
        };

        stepLoop();
    }

    pause() {
        this.isPlaying = false;
        clearTimeout(this.timer);
        this.elements.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (this.currentStep < this.trace.length - 1) {
             this.elements.startBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Resume';
        }
    }

    step(direction) {
        const newStep = this.currentStep + direction;
        if (newStep >= 0 && newStep < this.trace.length) {
            this.currentStep = newStep;
            this.renderStep();
        }
    }

    goToStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < this.trace.length) {
            this.currentStep = stepIndex;
            this.renderStep();
        }
    }

    renderStep() {
        const step = this.trace[this.currentStep];
        this.visualizer.draw(step.array, step);
        this.updateStatsFromTrace(this.currentStep);
        this.updateProgress();
    }

    updateStatsFromTrace(stepIndex) {
        // To get accurate total comparisons/swaps up to this point, we need to count them
        // or store cumulative stats in the trace.
        // Storing in trace is better for performance than iterating every time.
        // But iterating is easier to implement right now if I didn't store it.
        // Let's iterate for now (trace length is usually < 1000 for N=100 so it's fast enough).

        let comparisons = 0;
        let swaps = 0;

        for (let i = 0; i <= stepIndex; i++) {
            const s = this.trace[i];
            if (s.type === 'compare') comparisons++;
            if (s.type === 'swap') swaps++;
        }

        const currentStepObj = this.trace[stepIndex];
        this.updateStats(comparisons, swaps, currentStepObj.description);
    }

    updateStats(comp, swaps, state) {
        this.elements.statsComparisons.textContent = comp;
        this.elements.statsSwaps.textContent = swaps;
        this.elements.statsState.textContent = state;
    }

    updateProgress() {
        this.elements.progressSlider.value = this.currentStep;
        // Update slider max if trace exists
        if (this.trace.length > 0) {
             this.elements.progressSlider.max = this.trace.length - 1;
             this.elements.progressSlider.disabled = false;
        } else {
            this.elements.progressSlider.disabled = true;
        }
    }
}

export default Controller;
