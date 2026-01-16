import BubbleSort from '../algorithms/BubbleSort.js';
import SelectionSort from '../algorithms/SelectionSort.js';
import InsertionSort from '../algorithms/InsertionSort.js';
import MergeSort from '../algorithms/MergeSort.js';
import QuickSort from '../algorithms/QuickSort.js';
import SortVisualizer from '../visualizer/SortVisualizer.js';

class RaceController {
    constructor() {
        this.size = 50;
        this.array = [];
        this.visualizer1 = new SortVisualizer(document.getElementById('canvas1'));
        this.visualizer2 = new SortVisualizer(document.getElementById('canvas2'));

        this.algo1 = new BubbleSort();
        this.algo2 = new QuickSort();

        this.trace1 = [];
        this.trace2 = [];

        this.dom = {
            select1: document.getElementById('algo1-select'),
            select2: document.getElementById('algo2-select'),
            sizeInput: document.getElementById('race-size'),
            startBtn: document.getElementById('start-race-btn'),
            resetBtn: document.getElementById('reset-race-btn'),
            label1: document.getElementById('label-algo1'),
            label2: document.getElementById('label-algo2'),
            stats1C: document.getElementById('stats1-comp'),
            stats1S: document.getElementById('stats1-swap'),
            stats2C: document.getElementById('stats2-comp'),
            stats2S: document.getElementById('stats2-swap'),
            winner1: document.getElementById('winner1'),
            winner2: document.getElementById('winner2'),
        };

        this.init();
    }

    init() {
        this.setupListeners();
        this.reset();
    }

    setupListeners() {
        this.dom.select1.addEventListener('change', (e) => {
            this.algo1 = this.getAlgoInstance(e.target.value);
            this.dom.label1.textContent = this.algo1.name;
            this.reset();
        });

        this.dom.select2.addEventListener('change', (e) => {
            this.algo2 = this.getAlgoInstance(e.target.value);
            this.dom.label2.textContent = this.algo2.name;
            this.reset();
        });

        this.dom.sizeInput.addEventListener('input', (e) => {
            this.size = parseInt(e.target.value);
            this.reset();
        });

        this.dom.startBtn.addEventListener('click', () => this.startRace());
        this.dom.resetBtn.addEventListener('click', () => this.reset());
    }

    getAlgoInstance(name) {
        switch(name) {
            case 'bubble': return new BubbleSort();
            case 'selection': return new SelectionSort();
            case 'insertion': return new InsertionSort();
            case 'merge': return new MergeSort();
            case 'quick': return new QuickSort();
            default: return new BubbleSort();
        }
    }

    reset() {
        // Generate common array
        this.array = Array.from({length: this.size}, () => Math.floor(Math.random() * 100) + 5);

        this.visualizer1.draw(this.array);
        this.visualizer2.draw(this.array);

        this.dom.stats1C.textContent = '0';
        this.dom.stats1S.textContent = '0';
        this.dom.stats2C.textContent = '0';
        this.dom.stats2S.textContent = '0';

        this.dom.winner1.classList.add('hidden');
        this.dom.winner2.classList.add('hidden');

        this.dom.startBtn.disabled = false;
        this.dom.startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    startRace() {
        this.dom.startBtn.disabled = true;
        this.dom.startBtn.classList.add('opacity-50', 'cursor-not-allowed');

        // Generate traces
        this.trace1 = this.algo1.generateTrace(this.array);
        this.trace2 = this.algo2.generateTrace(this.array);

        let idx1 = 0;
        let idx2 = 0;
        let finished1 = false;
        let finished2 = false;

        let c1 = 0, s1 = 0, c2 = 0, s2 = 0;

        const raceLoop = () => {
            if (finished1 && finished2) return;

            // Advance Algo 1
            if (!finished1) {
                if (idx1 < this.trace1.length) {
                    const step = this.trace1[idx1];
                    this.visualizer1.draw(step.array, step);
                    if(step.type === 'compare') c1++;
                    if(step.type === 'swap') s1++;
                    idx1++;
                } else {
                    finished1 = true;
                    if (!finished2) this.declareWinner(1);
                }
            }

            // Advance Algo 2
            if (!finished2) {
                if (idx2 < this.trace2.length) {
                    const step = this.trace2[idx2];
                    this.visualizer2.draw(step.array, step);
                    if(step.type === 'compare') c2++;
                    if(step.type === 'swap') s2++;
                    idx2++;
                } else {
                    finished2 = true;
                    if (!finished1) this.declareWinner(2);
                }
            }

            this.dom.stats1C.textContent = c1;
            this.dom.stats1S.textContent = s1;
            this.dom.stats2C.textContent = c2;
            this.dom.stats2S.textContent = s2;

            requestAnimationFrame(raceLoop);
        };

        raceLoop();
    }

    declareWinner(id) {
        if (id === 1) {
            this.dom.winner1.classList.remove('hidden');
        } else {
            this.dom.winner2.classList.remove('hidden');
        }
    }
}

export default RaceController;
