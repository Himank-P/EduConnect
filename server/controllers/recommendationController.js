const fs = require('fs').promises;
const path = require('path');

const readJson = (filePath) => {
    return fs.readFile(path.join(__dirname, '../data', filePath), 'utf8').then(JSON.parse);
};

exports.getRecommendations = async (req, res) => {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) return res.status(500).json({ error: 'API key is not configured.' });

    try {
        const studentProfile = await readJson('studentProfileData.json');
        const campusEvents = studentProfile.campusLife; 
        const analysisData = {
            student: {
                grades: studentProfile.grades,
                extracurriculars: studentProfile.extracurriculars,
                interests: studentProfile.interests
            },
            events: campusEvents
        };

        const systemPrompt = `You are a Student Engagement Advisor AI. Your task is to analyze a student's profile (grades, interests, clubs) and a list of available campus events.
        
        Your Goal: Recommend events that are highly relevant to the student's specific profile. For example, if they are in the 'Robotics Club', recommend the 'Hackathon'. If they have 'Physics' grades, recommend the 'Guest Lecture on Quantum Mechanics'.
        
        Your output MUST be a single, valid JSON object and nothing else. Do not include any text or markdown. The JSON object must have a single key "recommendedIds" which is an array of the event IDs that you recommend.
        
        Example Response:
        {
          "recommendedIds": ["1", "3"]
        }`;
        
        const userPrompt = JSON.stringify(analysisData);
        
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqApiKey}` },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [ { role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt } ],
                response_format: { type: "json_object" }
            }),
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.json();
            throw new Error(errorData.error.message);
        }

        const result = await groqResponse.json();
        const recommendedData = JSON.parse(result.choices[0].message.content);
        const recommendedIds = new Set(recommendedData.recommendedIds || []);

        const recommendedEvents = campusEvents.filter(event => recommendedIds.has(event.id.toString()));
        
        res.status(200).json(recommendedEvents);

    } catch (error) {
        console.error('Error in /api/student/recommendations:', error);
        res.status(500).json({ error: error.message || 'An error occurred.' });
    }
};
