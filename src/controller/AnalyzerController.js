import ComplexityAnalyzer from '../analyzer/ComplexityAnalyzer.js';
import SecurityUtils from '../services/SecurityUtils.js';

export default class AnalyzerController {
    constructor() {
        this.analyzer = new ComplexityAnalyzer('analyzer-canvas');

        this.dom = {
            code: document.getElementById('analyzer-code'),
            analyzeBtn: document.getElementById('analyze-btn'),
            prediction: document.getElementById('predicted-complexity'),
            languageSelect: document.getElementById('language-select'),
            logs: document.getElementById('execution-logs')
        };

        this.examples = {
            javascript: `// JavaScript Example: Linear Search (O(n))
// Your function MUST be named 'solve' and accept an array 'arr'
function solve(arr) {
  for(let i=0; i<arr.length; i++) {
    if(arr[i] === -1) return i;
  }
  return -1;
}`,
            python: `# Python Example: Linear Search (O(n))
# Your function MUST be named 'solve' and accept an array 'arr'
def solve(arr):
    for i in range(len(arr)):
        if arr[i] == -1:
            return i
    return -1`,
            java: `// Java Example: Linear Search (O(n))
// Your class MUST contain a static method named 'solve' that takes an int[]
public class Solution {
    public static int solve(int[] arr) {
        for(int i=0; i<arr.length; i++) {
            if(arr[i] == -1) return i;
        }
        return -1;
    }
}`,
            cpp: `// C++ Example: Linear Search (O(n))
// Your code MUST contain a function named 'solve' that takes a std::vector<int>
#include <vector>

int solve(std::vector<int>& arr) {
    for(int i=0; i<arr.size(); i++) {
        if(arr[i] == -1) return i;
    }
    return -1;
}`
        };

        this.init();
    }

    init() {
        this.dom.analyzeBtn.addEventListener('click', () => this.analyze());

        this.dom.languageSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            this.dom.code.value = this.examples[lang];
        });
    }

    logError(msg) {
        this.dom.logs.classList.remove('hidden');
        this.dom.logs.textContent = msg;
    }

    clearLogs() {
        this.dom.logs.classList.add('hidden');
        this.dom.logs.textContent = '';
    }

    async analyze() {
        const code = this.dom.code.value;
        const lang = this.dom.languageSelect.value;

        this.clearLogs();
        this.dom.analyzeBtn.disabled = true;

        if (lang === 'javascript') {
            this.dom.analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Running locally...';
        } else {
            this.dom.analyzeBtn.innerHTML = '<i class="fas fa-robot fa-spin mr-2"></i>Analyzing with Gemini AI...';
            // Clear graph area
            const ctx = document.getElementById('analyzer-canvas').getContext('2d');
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        try {
            await new Promise(r => setTimeout(r, 100)); // UI refresh

            this.dom.prediction.textContent = `Prediction: Running...`;
            const result = await this.analyzer.analyze(code, lang);

            if (result.error) {
                this.logError(result.error);
                this.dom.prediction.textContent = `Prediction: Failed`;
            } else {
                this.dom.prediction.textContent = `Prediction: ${result.complexity}`;
                if (result.type === 'ai') {
                    // Show explanation in logs
                    this.dom.logs.classList.remove('hidden');
                    // Escape HTML first, then apply simple bold formatting
                    const escaped = SecurityUtils.escapeHTML(result.explanation);
                    this.dom.logs.innerHTML = escaped.replace(/\*\*(.*?)\*\*/g, '<b class="text-white">$1</b>');
                } else {
                    this.dom.logs.classList.add('hidden');
                }
            }

        } catch (error) {
            this.logError("Execution failed. Check your syntax or API connectivity.");
            console.error(error);
        } finally {
            this.dom.analyzeBtn.disabled = false;
            this.dom.analyzeBtn.innerHTML = '<i class="fas fa-chart-line mr-2"></i>Analyze Complexity';
        }
    }
}
