export default class SecurityUtils {
    /**
     * Escapes special characters for use in HTML to prevent XSS.
     * @param {string} str The string to escape.
     * @returns {string} The escaped string.
     */
    static escapeHTML(str) {
        if (!str) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return str.replace(/[&<>"']/g, (m) => map[m]);
    }
}
