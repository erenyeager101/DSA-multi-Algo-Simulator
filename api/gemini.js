// Vercel serverless function — proxies requests to Gemini API.
// The API key never leaves the server, so it is not visible in the browser.
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // These names keep NEXT_PUBLIC_ for compatibility with already-configured Vercel secrets.
    // Because this is not a Next.js app the prefix has no "expose to browser" effect;
    // the values are only ever read here on the server.
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const API_URL = process.env.NEXT_PUBLIC_GEMINI_URL_KEY;

    if (!API_KEY || !API_URL) {
        return res.status(500).json({ error: 'Server is missing Gemini API configuration.' });
    }

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'A "prompt" string is required in the request body.' });
    }

    try {
        const geminiRes = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await geminiRes.json();

        if (data.error) {
            console.error('Gemini API error:', data.error);
            return res.status(502).json({ error: data.error.message || 'Gemini API returned an error.' });
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            return res.status(502).json({ error: 'Unexpected response structure from Gemini API.' });
        }

        return res.status(200).json({ text });
    } catch (err) {
        console.error('Proxy fetch error:', err);
        return res.status(502).json({ error: 'Failed to reach Gemini API.' });
    }
}
