export default class Navbar {
    constructor() {
        this.render();
    }

    render() {
        const path = window.location.pathname;
        const page = path.split("/").pop() || "index.html";

        const links = [
            { name: "Sorting", href: "index.html", icon: "fa-sort" },
            { name: "Graphs", href: "graphs.html", icon: "fa-project-diagram" },
            { name: "Trees", href: "trees.html", icon: "fa-tree" },
            { name: "DP", href: "dp.html", icon: "fa-table" },
            { name: "Race", href: "race.html", icon: "fa-flag-checkered" },
            { name: "Analyzer", href: "analyzer.html", icon: "fa-chart-line" },
            { name: "Theory", href: "theory.html", icon: "fa-book" },
            { name: "Quiz", href: "quiz.html", icon: "fa-question-circle" }
        ];

        // Ensure Dark Mode class exists if previously set in localStorage
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        const navHtml = `
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white shadow-md">AV</div>
                <h1 class="text-xl font-bold tracking-wide hidden lg:block text-gray-900 dark:text-white">Algo<span class="text-blue-600 dark:text-blue-400">Visualizer</span></h1>
            </div>
            <div class="flex items-center gap-1 md:gap-3 overflow-x-auto flex-1 justify-center px-4 no-scrollbar">
                ${links.map(link => `
                    <a href="${link.href}" class="flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium whitespace-nowrap ${page === link.href ? 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'}">
                        <i class="fas ${link.icon}"></i>
                        <span class="hidden md:inline">${link.name}</span>
                    </a>
                `).join('')}
            </div>
            <div class="flex items-center gap-4">
                <button id="theme-toggle" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
                    <i id="theme-icon" class="fas ${document.documentElement.classList.contains('dark') ? 'fa-sun text-yellow-400' : 'fa-moon text-indigo-500'} text-lg"></i>
                </button>
                 <a href="https://github.com/erenyeager101" target="_blank" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <i class="fab fa-github text-xl"></i>
                </a>
            </div>
        `;

        const nav = document.createElement('nav');
        nav.className = "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 shadow-sm z-50 sticky top-0 transition-colors duration-300";
        nav.innerHTML = navHtml;

        document.body.prepend(nav);

        // Theme Toggle Logic
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');

        themeToggleBtn.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.theme = 'light';
                themeIcon.className = 'fas fa-moon text-indigo-500 text-lg';
            } else {
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
                themeIcon.className = 'fas fa-sun text-yellow-400 text-lg';
            }
        });
    }
}
