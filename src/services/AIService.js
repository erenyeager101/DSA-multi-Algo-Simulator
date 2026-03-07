// Requests are routed through the /api/gemini serverless function so that
// the Gemini API key is never exposed to the browser.

export default class AIService {
    static async generateContent(prompt) {
        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                console.error("AI Service Error:", data.error);
                return "Error generating AI response. Please check console.";
            }

            return data.text;
        } catch (error) {
            console.error("AI Network Error:", error);
            return "Network error connecting to AI Service.";
        }
    }

    static async explainStep(algorithmName, stepDescription, arrayState, currentIndices) {
        const prompt = `
            You are an expert Computer Science tutor.
            Explain the current step of the ${algorithmName} algorithm simply.

            Context:
            - Step: "${stepDescription}"
            - Current Array Portion: ${JSON.stringify(arrayState.slice(0, 15))}... (truncated)
            - Active Indices: ${JSON.stringify(currentIndices)}

            Provide a 1-2 sentence intuitive explanation of why this step is happening and what it achieves locally.
            Do not use complex jargon without explanation. Keep it brief and encouraging.
        `;
        return await this.generateContent(prompt);
    }

    static async optimizeCode(code) {
        const prompt = `
            You are an expert Computer Science Professor and algorithmic analyst.
            Analyze the following code for Time Complexity. You MUST output the predicted worst-case Time Complexity in the exact format:
            "Complexity: O(N)" or "Complexity: O(N log N)", etc., on its own line so the frontend can easily parse it.

            Then, provide a brief (1-3 paragraph) explanation of why that is the case, describing the loops, recursion, or method calls that dictate the performance.

            Code to analyze:
            \`\`\`
            ${code}
            \`\`\`
        `;
        return await this.generateContent(prompt);
    }
}
