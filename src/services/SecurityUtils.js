export default class SecurityUtils {
    /**
     * Safely escapes HTML entities in a string.
     * @param {string} str The string to escape.
     * @returns {string} The escaped string.
     */
    static escapeHTML(str) {
        if (!str) return '';
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    }
}
