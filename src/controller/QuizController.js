export default class QuizController {
    constructor() {
        this.questions = [
            {
                question: "What is the worst-case time complexity of Quick Sort?",
                options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
                answer: 1
            },
            {
                question: "Which of the following sorting algorithms is NOT stable by default?",
                options: ["Merge Sort", "Insertion Sort", "Bubble Sort", "Quick Sort"],
                answer: 3
            },
            {
                question: "What data structure is used to implement a Breadth-First Search (BFS)?",
                options: ["Stack", "Queue", "Priority Queue", "Linked List"],
                answer: 1
            },
            {
                question: "In a Binary Search Tree (BST), the in-order traversal yields elements in what order?",
                options: ["Descending order", "Random order", "Ascending order", "Level-order"],
                answer: 2
            },
            {
                question: "What is the space complexity of an iterative Binary Search?",
                options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
                answer: 0
            },
            {
                question: "Which algorithm uses the divide and conquer paradigm?",
                options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Linear Search"],
                answer: 1
            },
            {
                question: "What is the best-case time complexity of Bubble Sort?",
                options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
                answer: 2
            }
        ];

        // Shuffle questions
        this.questions = this.questions.sort(() => Math.random() - 0.5).slice(0, 5); // Take 5 random questions

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answered = false;

        this.dom = {
            questionText: document.getElementById('question-text'),
            optionsContainer: document.getElementById('options-container'),
            nextBtn: document.getElementById('next-btn'),
            feedbackText: document.getElementById('feedback-text'),
            currentNum: document.getElementById('current-question-num'),
            totalNum: document.getElementById('total-questions-num'),
            progressBar: document.getElementById('progress-bar'),
            resultOverlay: document.getElementById('result-overlay'),
            finalScore: document.getElementById('final-score'),
            finalTotal: document.getElementById('final-total'),
            restartBtn: document.getElementById('restart-btn')
        };

        this.init();
    }

    init() {
        this.dom.totalNum.textContent = this.questions.length;
        this.dom.finalTotal.textContent = this.questions.length;

        this.dom.nextBtn.addEventListener('click', () => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.questions.length) {
                this.loadQuestion();
            } else {
                this.showResult();
            }
        });

        this.dom.restartBtn.addEventListener('click', () => {
            location.reload();
        });

        this.loadQuestion();
    }

    loadQuestion() {
        this.answered = false;
        const q = this.questions[this.currentQuestionIndex];

        this.dom.currentNum.textContent = this.currentQuestionIndex + 1;
        this.dom.progressBar.style.width = `${((this.currentQuestionIndex + 1) / this.questions.length) * 100}%`;

        this.dom.questionText.textContent = q.question;
        this.dom.optionsContainer.innerHTML = '';
        this.dom.feedbackText.textContent = '';
        this.dom.nextBtn.classList.add('hidden');

        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all font-medium';
            btn.textContent = opt;
            btn.addEventListener('click', () => this.handleAnswer(index, btn));
            this.dom.optionsContainer.appendChild(btn);
        });
    }

    handleAnswer(selectedIndex, btnElement) {
        if (this.answered) return;
        this.answered = true;

        const q = this.questions[this.currentQuestionIndex];
        const buttons = this.dom.optionsContainer.querySelectorAll('button');

        // Disable all buttons
        buttons.forEach(btn => {
            btn.classList.add('opacity-75', 'cursor-not-allowed');
            btn.classList.remove('hover:border-blue-500', 'hover:bg-blue-50', 'dark:hover:border-blue-400', 'dark:hover:bg-gray-700');
        });

        if (selectedIndex === q.answer) {
            this.score++;
            btnElement.classList.replace('border-gray-200', 'border-green-500');
            btnElement.classList.replace('dark:border-gray-700', 'dark:border-green-500');
            btnElement.classList.replace('bg-white', 'bg-green-50');
            btnElement.classList.replace('dark:bg-gray-800', 'dark:bg-green-900/30');
            btnElement.classList.add('text-green-700', 'dark:text-green-400');
            this.dom.feedbackText.textContent = 'Correct!';
            this.dom.feedbackText.className = 'text-sm font-bold text-green-600 dark:text-green-400';
        } else {
            btnElement.classList.replace('border-gray-200', 'border-red-500');
            btnElement.classList.replace('dark:border-gray-700', 'dark:border-red-500');
            btnElement.classList.replace('bg-white', 'bg-red-50');
            btnElement.classList.replace('dark:bg-gray-800', 'dark:bg-red-900/30');
            btnElement.classList.add('text-red-700', 'dark:text-red-400');
            this.dom.feedbackText.textContent = 'Incorrect.';
            this.dom.feedbackText.className = 'text-sm font-bold text-red-600 dark:text-red-400';

            // Highlight correct answer
            const correctBtn = buttons[q.answer];
            correctBtn.classList.replace('border-gray-200', 'border-green-500');
            correctBtn.classList.replace('dark:border-gray-700', 'dark:border-green-500');
        }

        this.dom.nextBtn.classList.remove('hidden');
    }

    showResult() {
        this.dom.finalScore.textContent = this.score;
        this.dom.resultOverlay.classList.remove('hidden');

        // Save progress
        let maxScore = parseInt(localStorage.getItem('quizMaxScore') || '0');
        if (this.score > maxScore) {
            localStorage.setItem('quizMaxScore', this.score);
        }
    }
}
