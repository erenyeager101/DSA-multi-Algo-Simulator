import ComplexityAnalyzer from '../analyzer/ComplexityAnalyzer.js';
import AIService from '../services/AIService.js';

export default class AnalyzerController {
    constructor() {
        this.analyzer = new ComplexityAnalyzer('analyzer-canvas');

        this.dom = {
            code: document.getElementById('analyzer-code'),
            analyzeBtn: document.getElementById('analyze-btn'),
            aiBtn: document.getElementById('ai-optimize-btn'),
            prediction: document.getElementById('predicted-complexity'),
            aiPanel: document.getElementById('ai-suggestions'),
            aiContent: document.getElementById('ai-suggestions-content'),
        };

        this.init();
    }

    init() {
        this.dom.analyzeBtn.addEventListener('click', () => this.analyze());
        this.dom.aiBtn.addEventListener('click', () => this.optimize());
    }

    async analyze() {
        const code = this.dom.code.value;
        this.dom.analyzeBtn.disabled = true;
        this.dom.analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Running...';

        try {
            await new Promise(r => setTimeout(r, 100)); // UI refresh
            const complexity = await this.analyzer.analyze(code);
            this.dom.prediction.textContent = `Prediction: ${complexity}`;
        } catch (error) {
            alert("Error analyzing code. Check console.");
            console.error(error);
        } finally {
            this.dom.analyzeBtn.disabled = false;
            this.dom.analyzeBtn.innerHTML = '<i class="fas fa-chart-line mr-2"></i>Analyze';
        }
    }

    async optimize() {
        const code = this.dom.code.value;
        this.dom.aiBtn.disabled = true;
        this.dom.aiBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Thinking...';
        this.dom.aiPanel.classList.remove('hidden');
        this.dom.aiContent.textContent = "Analyzing code with AI...";

        try {
            const suggestion = await AIService.optimizeCode(code);
            this.dom.aiContent.textContent = suggestion;
        } catch (error) {
            this.dom.aiContent.textContent = "AI Service Error.";
        } finally {
            this.dom.aiBtn.disabled = false;
            this.dom.aiBtn.innerHTML = '<i class="fas fa-magic mr-2"></i>AI Optimize';
        }
    }
}
