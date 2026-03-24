// Mock document object for renderCode
global.document = {
    createElement: (tag) => {
        return {
            tagName: tag,
            className: '',
            textContent: '',
            innerHTML: '',
            children: [],
            classList: {
                add: function(...args) {
                    if (!this.classes) this.classes = [];
                    this.classes.push(...args);
                }
            },
            appendChild: function(child) {
                this.children.push(child);
            },
            scrollIntoView: function() {}
        };
    }
};

const code = `
function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}
`.repeat(100); // Repeat to make it long for benchmarking

const activeLines = [];
for (let i = 1; i <= 1000; i += 2) {
    activeLines.push(i);
}

// Function with Array includes
function renderCodeArray(code, activeLines) {
    const lines = code.split('\n');
    const result = [];
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const lineEl = document.createElement('div');

        const numEl = document.createElement('span');
        const codeEl = document.createElement('span');

        let highlighted = line
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        highlighted = highlighted
            .replace(/(function|let|const|var|if|else|while|for|return)\b/g, '<span class="text-pink-400">$1</span>')
            .replace(/(\b\d+\b)(?![^<]*>)/g, '<span class="text-orange-400">$1</span>')
            .replace(/([\[\]\{\}\(\)])/g, '<span class="text-yellow-200">$1</span>');

        codeEl.innerHTML = highlighted;

        if (activeLines.includes(lineNum)) {
            lineEl.classList.add('bg-blue-900/50', 'border-l-2', 'border-blue-400');
        } else {
            lineEl.classList.add('border-l-2', 'border-transparent');
        }

        lineEl.appendChild(numEl);
        lineEl.appendChild(codeEl);
        result.push(lineEl);
    });
    return result;
}

// Function with Set has
function renderCodeSet(code, activeLines) {
    const lines = code.split('\n');
    const result = [];
    const activeLinesSet = new Set(activeLines);
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const lineEl = document.createElement('div');

        const numEl = document.createElement('span');
        const codeEl = document.createElement('span');

        let highlighted = line
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
        result.push(lineEl);
    });
    return result;
}

// Warmup
for (let i = 0; i < 10; i++) {
    renderCodeArray(code, activeLines);
    renderCodeSet(code, activeLines);
}

const ITERATIONS = 1000;

console.time('renderCode (Array includes)');
for (let i = 0; i < ITERATIONS; i++) {
    renderCodeArray(code, activeLines);
}
console.timeEnd('renderCode (Array includes)');

console.time('renderCode (Set has)');
for (let i = 0; i < ITERATIONS; i++) {
    renderCodeSet(code, activeLines);
}
console.timeEnd('renderCode (Set has)');

// Assert correctness
const arrayRes = renderCodeArray(code, activeLines);
const setRes = renderCodeSet(code, activeLines);
let isSame = true;
for(let i = 0; i < arrayRes.length; i++) {
    if (JSON.stringify(arrayRes[i].classList.classes) !== JSON.stringify(setRes[i].classList.classes)) {
        isSame = false;
        break;
    }
}
console.log('Test output is identical:', isSame);
