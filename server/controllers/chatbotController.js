const fs = require('fs');
const path = require('path');

exports.handleChat = async (req, res) => {
    const groqApiKey = process.env.GROQ_API_KEY;
    const { messages } = req.body;

    if (!groqApiKey) {
        return res.status(500).json({ error: 'Groq API key is not configured on the server.' });
    }
    if (!messages) {
        return res.status(400).json({ error: 'No messages provided in the request.' });
    }

    const systemPrompt = "You are a friendly and helpful assistant for EduConnect, an ERP platform for educational institutions. Your name is Eddy. Keep your answers concise and focused on helping students with common questions about the platform, academics, and campus life.";

    try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages
                ],
            }),
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.json();
            throw new Error(errorData.error.message || "Failed to get a response from the AI.");
        }

        const result = await groqResponse.json();
        res.json({ reply: result.choices[0].message.content });

    } catch (error) {
        console.error('Error in /api/chatbot:', error);
        res.status(500).json({ error: error.message || 'An error occurred while fetching the chat response.' });
    }
};
