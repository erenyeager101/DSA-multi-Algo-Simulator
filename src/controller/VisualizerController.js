import BubbleSort from '../algorithms/BubbleSort.js';
import SelectionSort from '../algorithms/SelectionSort.js';
import InsertionSort from '../algorithms/InsertionSort.js';
import MergeSort from '../algorithms/MergeSort.js';
import QuickSort from '../algorithms/QuickSort.js';
import SortVisualizer from '../visualizer/SortVisualizer.js';
import AIService from '../services/AIService.js';

class VisualizerController {
    constructor() {
        // State
        this.array = [];
        this.size = 30;
        this.speed = 50;
        this.isPlaying = false;
        this.currentStep = 0;
        this.trace = [];
        this.algorithm = new BubbleSort();
        this.visualizer = new SortVisualizer(document.getElementById('visualizer-canvas'));
        this.timer = null;

        // DOM
        this.dom = {
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
            codeDisplay: document.getElementById('code-display'),
            algoDesc: document.getElementById('algo-desc'),
            toggleCodeBtn: document.getElementById('toggle-code-btn'),
            codePanel: document.getElementById('code-panel'),
            // AI
            aiExplainBtn: document.getElementById('ai-explain-btn'),
            aiModal: document.getElementById('ai-modal'),
            closeAiModal: document.getElementById('close-ai-modal'),
            aiContent: document.getElementById('ai-content'),
        };

        this.init();
    }

    init() {
        this.setupListeners();
        this.updateAlgorithmInfo();
        this.generateArray();
    }

    setupListeners() {
        this.dom.sizeSlider.addEventListener('input', (e) => {
            this.size = parseInt(e.target.value);
            this.dom.sizeValue.textContent = this.size;
            this.reset();
        });

        this.dom.speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            this.dom.speedValue.textContent = `${this.speed}x`;
            if (this.isPlaying) {
                this.pause();
                this.play();
            }
        });

        this.dom.algoSelect.addEventListener('change', (e) => {
            this.setAlgorithm(e.target.value);
        });

        this.dom.randomizeBtn.addEventListener('click', () => this.reset());

        this.dom.startBtn.addEventListener('click', () => {
             if (this.currentStep === 0) {
                 this.start();
             } else if (this.currentStep >= this.trace.length - 1) {
                 this.reset();
                 this.start();
             } else {
                 this.togglePlay();
             }
        });

        this.dom.resetBtn.addEventListener('click', () => this.reset());

        this.dom.playPauseBtn.addEventListener('click', () => this.togglePlay());

        this.dom.prevBtn.addEventListener('click', () => {
            this.pause();
            this.step(-1);
        });

        this.dom.nextBtn.addEventListener('click', () => {
            this.pause();
            this.step(1);
        });

        this.dom.progressSlider.addEventListener('input', (e) => {
            this.pause();
            this.goToStep(parseInt(e.target.value));
        });

        this.dom.toggleCodeBtn.addEventListener('click', () => {
             this.dom.codePanel.classList.toggle('translate-x-full');
             this.dom.codePanel.classList.toggle('md:translate-x-full');
             this.dom.codePanel.classList.toggle('md:translate-x-0');
        });

        // AI
        this.dom.aiExplainBtn.addEventListener('click', () => this.explainCurrentStep());
        this.dom.closeAiModal.addEventListener('click', () => {
            this.dom.aiModal.classList.add('hidden');
        });
        this.dom.aiModal.addEventListener('click', (e) => {
             if(e.target === this.dom.aiModal) this.dom.aiModal.classList.add('hidden');
        });
    }

    setAlgorithm(name) {
        switch(name) {
            case 'bubble': this.algorithm = new BubbleSort(); break;
            case 'selection': this.algorithm = new SelectionSort(); break;
            case 'insertion': this.algorithm = new InsertionSort(); break;
            case 'merge': this.algorithm = new MergeSort(); break;
            case 'quick': this.algorithm = new QuickSort(); break;
            default: this.algorithm = new BubbleSort();
        }
        this.updateAlgorithmInfo();
        this.reset();
    }

    updateAlgorithmInfo() {
        this.dom.codeDisplay.textContent = this.algorithm.code;
        this.dom.algoDesc.textContent = this.algorithm.description;
    }

    generateArray() {
        this.array = Array.from({length: this.size}, () => Math.floor(Math.random() * 100) + 5);
        this.trace = [];
        this.currentStep = 0;
        this.visualizer.draw(this.array);
        this.updateStats(0, 0, 'Idle');
        this.dom.progressSlider.disabled = true;
    }

    reset() {
        this.pause();
        this.generateArray();
        this.dom.startBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Run';
        this.dom.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    start() {
        this.trace = this.algorithm.generateTrace(this.array);
        this.dom.progressSlider.max = this.trace.length - 1;
        this.dom.progressSlider.disabled = false;
        this.play();
        this.dom.startBtn.innerHTML = '<i class="fas fa-pause mr-2"></i>Pause';
    }

    togglePlay() {
        if (this.isPlaying) this.pause();
        else {
             if (this.trace.length === 0) this.start();
             else this.play();
        }
    }

    play() {
        this.isPlaying = true;
        this.dom.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.dom.startBtn.innerHTML = '<i class="fas fa-pause mr-2"></i>Pause';

        const stepLoop = () => {
            if (!this.isPlaying) return;
            if (this.currentStep < this.trace.length - 1) {
                this.step(1);
                const delay = 1000 / (this.speed * 0.5);
                this.timer = setTimeout(stepLoop, delay);
            } else {
                this.pause();
                this.dom.startBtn.innerHTML = '<i class="fas fa-redo mr-2"></i>Restart';
            }
        };
        stepLoop();
    }

    pause() {
        this.isPlaying = false;
        clearTimeout(this.timer);
        this.dom.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (this.currentStep < this.trace.length - 1 && this.trace.length > 0) {
             this.dom.startBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Resume';
        }
    }

    step(dir) {
        const next = this.currentStep + dir;
        this.goToStep(next);
    }

    goToStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < this.trace.length) {
            this.currentStep = stepIndex;
            const step = this.trace[this.currentStep];
            this.visualizer.draw(step.array, step);
            this.updateStatsFromTrace(this.currentStep);
            this.dom.progressSlider.value = this.currentStep;
        }
    }

    updateStatsFromTrace(index) {
        // Simple counter
        let c = 0, s = 0;
        for(let i=0; i<=index; i++) {
            if(this.trace[i].type === 'compare') c++;
            if(this.trace[i].type === 'swap') s++;
        }
        this.updateStats(c, s, this.trace[index].description);
    }

    updateStats(c, s, state) {
        this.dom.statsComparisons.textContent = c;
        this.dom.statsSwaps.textContent = s;
        this.dom.statsState.textContent = state;
    }

    async explainCurrentStep() {
        if (this.trace.length === 0) {
            alert("Please run the algorithm first.");
            return;
        }

        this.pause();
        this.dom.aiModal.classList.remove('hidden');
        this.dom.aiContent.innerHTML = '<i class="fas fa-circle-notch fa-spin text-2xl text-purple-500"></i><span class="ml-2">Analyzing context...</span>';

        const step = this.trace[this.currentStep];
        const explanation = await AIService.explainStep(
            this.algorithm.name,
            step.description,
            step.array,
            step.indices
        );

        // Simple markdown parsing
        const formatted = explanation.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        this.dom.aiContent.innerHTML = formatted;
    }
}

export default VisualizerController;
