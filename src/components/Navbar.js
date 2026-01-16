export default class Navbar {
    constructor() {
        this.render();
    }

    render() {
        const path = window.location.pathname;
        const page = path.split("/").pop() || "index.html";

        const links = [
            { name: "Visualizer", href: "index.html", icon: "fa-eye" },
            { name: "Race Mode", href: "race.html", icon: "fa-flag-checkered" },
            { name: "Analyzer", href: "analyzer.html", icon: "fa-chart-line" },
            { name: "Theory", href: "theory.html", icon: "fa-book" },
            { name: "Legacy", href: "legacy_index.html", icon: "fa-history" }
        ];

        const navHtml = `
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center font-bold text-white">AV</div>
                <h1 class="text-xl font-bold tracking-wide hidden md:block">AlgoVisualizer <span class="text-xs text-blue-400 font-normal">v2.0</span></h1>
            </div>
            <div class="flex items-center gap-1 md:gap-4 overflow-x-auto">
                ${links.map(link => `
                    <a href="${link.href}" class="flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${page === link.href ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}">
                        <i class="fas ${link.icon}"></i>
                        <span class="hidden md:inline">${link.name}</span>
                    </a>
                `).join('')}
            </div>
            <div class="flex items-center gap-4">
                 <a href="https://github.com/erenyeager101" target="_blank" class="text-gray-400 hover:text-white transition-colors">
                    <i class="fab fa-github text-xl"></i>
                </a>
            </div>
        `;

        const nav = document.createElement('nav');
        nav.className = "bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-6 shadow-md z-50 sticky top-0";
        nav.innerHTML = navHtml;

        document.body.prepend(nav);
    }
}
