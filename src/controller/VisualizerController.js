import BubbleSort from '../algorithms/BubbleSort.js';
import SelectionSort from '../algorithms/SelectionSort.js';
import InsertionSort from '../algorithms/InsertionSort.js';
import MergeSort from '../algorithms/MergeSort.js';
import QuickSort from '../algorithms/QuickSort.js';
import HeapSort from '../algorithms/HeapSort.js';
import RadixSort from '../algorithms/RadixSort.js';
import LinearSearch from '../algorithms/LinearSearch.js';
import BinarySearch from '../algorithms/BinarySearch.js';
import ReverseArray from '../algorithms/ReverseArray.js';
import SortVisualizer from '../visualizer/SortVisualizer.js';

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
            // Visual Debugger
            variablesDisplay: document.getElementById('variables-display'),
            callstackDisplay: document.getElementById('callstack-display'),
            // Complexity
            complexityTime: document.getElementById('complexity-time'),
            complexitySpace: document.getElementById('complexity-space')
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
    }

    setAlgorithm(name) {
        switch(name) {
            case 'bubble': this.algorithm = new BubbleSort(); break;
            case 'selection': this.algorithm = new SelectionSort(); break;
            case 'insertion': this.algorithm = new InsertionSort(); break;
            case 'merge': this.algorithm = new MergeSort(); break;
            case 'quick': this.algorithm = new QuickSort(); break;
            case 'heap': this.algorithm = new HeapSort(); break;
            case 'radix': this.algorithm = new RadixSort(); break;
            case 'linear': this.algorithm = new LinearSearch(); break;
            case 'binary': this.algorithm = new BinarySearch(); break;
            case 'reverse': this.algorithm = new ReverseArray(); break;
            default: this.algorithm = new BubbleSort();
        }
        this.updateAlgorithmInfo();
        this.reset();
    }

    updateAlgorithmInfo() {
        this.renderCode(this.algorithm.code, []);
        this.dom.algoDesc.textContent = this.algorithm.description;
        if (this.dom.complexityTime && this.algorithm.complexity) {
            this.dom.complexityTime.textContent = this.algorithm.complexity.time.worst || this.algorithm.complexity.time.avg;
            this.dom.complexitySpace.textContent = this.algorithm.complexity.space;
        }
    }

    renderCode(code, activeLines = []) {
        const lines = code.split('\n');
        this.dom.codeDisplay.innerHTML = '';
        const activeLinesSet = new Set(activeLines);
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            const lineEl = document.createElement('div');
            lineEl.className = 'flex group font-mono text-xs';

            const numEl = document.createElement('span');
            numEl.className = 'text-gray-600 mr-4 select-none w-4 text-right';
            numEl.textContent = lineNum;

            const codeEl = document.createElement('span');
            codeEl.className = 'whitespace-pre';
            // Simple syntax highlighting classes
            // We need to be careful with replace, replacing numbers before we add our own spans.
            let highlighted = line
                .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Escape HTML

            highlighted = highlighted
                .replace(/(function|let|const|var|if|else|while|for|return)\b/g, '<span class="text-pink-400">$1</span>')
                .replace(/(\b\d+\b)(?![^<]*>)/g, '<span class="text-orange-400">$1</span>')
                .replace(/([\[\]\{\}\(\)])/g, '<span class="text-yellow-200">$1</span>');

            codeEl.innerHTML = highlighted;

            if (activeLinesSet.has(lineNum)) {
                lineEl.classList.add('bg-blue-900/50', 'border-l-2', 'border-blue-400');
            } else {
                lineEl.classList.add('border-l-2', 'border-transparent');
            }

            lineEl.appendChild(numEl);
            lineEl.appendChild(codeEl);
            this.dom.codeDisplay.appendChild(lineEl);

            if (activeLinesSet.has(lineNum)) {
                lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
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

        // Save progress
        let viewed = JSON.parse(localStorage.getItem('viewedAlgorithms') || '[]');
        if (!viewed.includes(this.algorithm.name)) {
            viewed.push(this.algorithm.name);
            localStorage.setItem('viewedAlgorithms', JSON.stringify(viewed));
        }
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

            // Visual Debugger Update
            if (step.lineNumbers) {
                this.renderCode(this.algorithm.code, step.lineNumbers);
            }
            if (step.variables) {
                this.renderVariables(step.variables);
            }
            if (step.callStack) {
                this.renderCallStack(step.callStack);
            }
        }
    }

    renderVariables(variables) {
        this.dom.variablesDisplay.innerHTML = '';
        if (Object.keys(variables).length === 0) {
            this.dom.variablesDisplay.innerHTML = '<span class="text-gray-600 italic">No local variables</span>';
            return;
        }
        for (const [key, value] of Object.entries(variables)) {
            const row = document.createElement('div');
            row.className = 'flex justify-between border-b border-gray-800 py-1';

            const nameEl = document.createElement('span');
            nameEl.className = 'text-blue-400 font-bold';
            nameEl.textContent = key;

            const valEl = document.createElement('span');
            valEl.className = 'text-green-400';
            valEl.textContent = typeof value === 'object' ? JSON.stringify(value) : value;

            row.appendChild(nameEl);
            row.appendChild(valEl);
            this.dom.variablesDisplay.appendChild(row);
        }
    }

    renderCallStack(stack) {
        this.dom.callstackDisplay.innerHTML = '';
        if (stack.length === 0) {
            this.dom.callstackDisplay.innerHTML = '<span class="text-gray-600 italic">Stack empty</span>';
            return;
        }
        [...stack].reverse().forEach((frame, i) => {
            const el = document.createElement('div');
            el.className = `py-1 truncate ${i === 0 ? 'text-blue-300 font-bold' : 'text-gray-500'}`;
            el.textContent = frame;
            this.dom.callstackDisplay.appendChild(el);
        });
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
}

export default VisualizerController;
