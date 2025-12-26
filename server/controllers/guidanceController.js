const fs = require('fs');
const path = require('path');

exports.getGuidance = async (req, res) => {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
        return res.status(500).json({ error: 'API key is not configured on the server.' });
    }

    const studentProfilePath = path.join(__dirname, '../data/studentProfileData.json');

    fs.readFile(studentProfilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error("Error reading student profile data file:", err);
            return res.status(500).json({ error: "Failed to read student profile data." });
        }

        const fullProfile = JSON.parse(data);
        const analysisData = {
            grades: fullProfile.grades,
            extracurriculars: fullProfile.extracurriculars,
            interests: fullProfile.interests
        };
        
        const systemPrompt = `You are an expert career counselor for high school students in India. Based on the provided JSON data of a student's performance and interests, generate a detailed career analysis. Your response must be in Markdown format and strictly follow this structure:
### Top 3 Career Suggestions
- **Career 1:** [Name of career]. [1-2 sentence explanation why it's a good fit].
- **Career 2:** [Name of career]. [1-2 sentence explanation why it's a good fit].
- **Career 3:** [Name of career]. [1-2 sentence explanation why it's a good fit].
### Roadmap for Top Choice
- **Recommended Subjects:** [List of subjects].
- **Key Entrance Exams:** [List of exams like JEE, BITSAT, etc.].
- **Potential Colleges:** [List of 2-3 aspirational colleges].
- **Skills to Develop:** [List of skills like programming languages, soft skills, etc.].`;
        
        const userPrompt = JSON.stringify(analysisData);
        
        try {
            const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${groqApiKey}`,
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [ { role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt } ],
                }),
            });

            if (!groqResponse.ok) {
                const errorData = await groqResponse.json();
                console.error('Groq API Error:', errorData);
                throw new Error(errorData.error.message);
            }
            
            const result = await groqResponse.json();
            const analysisText = result.choices[0].message.content;
            res.json({ analysis: analysisText });

        } catch (error) {
            console.error('Error in /api/guidance:', error);
            res.status(500).json({ error: error.message || 'An error occurred while fetching the analysis.' });
        }
    });
};

