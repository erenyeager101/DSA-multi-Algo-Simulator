// Note: In a production environment, this key should be proxied through a backend to prevent exposure.
// Since this is a pure frontend demo as requested, we use it directly.
const API_KEY = "AIzaSyCDLQSvxOUbUaG2hIGiVZH5aRRPjF9j0rI";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export default class AIService {
    static async generateContent(prompt) {
        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error("AI Service Error:", data.error);
                return "Error generating AI response. Please check console.";
            }

            return data.candidates[0].content.parts[0].text;
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
            You are a Senior Software Engineer specializing in Algorithms.
            Analyze the following JavaScript code for Time and Space Complexity.
            Then, suggest specific optimizations or alternative algorithms if better ones exist for general cases.

            Code:
            \`\`\`javascript
            ${code}
            \`\`\`

            Format the response as:
            1. **Complexity Analysis**: Time & Space.
            2. **Feedback**: What is good/bad.
            3. **Optimization**: Concrete suggestions or refactored code block.
        `;
        return await this.generateContent(prompt);
    }
}
