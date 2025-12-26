const fs = require('fs');
const path = require('path');

exports.getContacts = (req, res) => {
    const { role } = req.params;
    const dataPath = path.join(__dirname, '../data/messagingContacts.json');

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading messaging contacts:", err);
            return res.status(500).json({ error: "Failed to read messaging contacts." });
        }
        try {
            const contacts = JSON.parse(data);
            let contactsToSend = [];

            if (role === 'student') {
                contactsToSend = contacts.teachers.concat(contacts.students); 
            } else if (role === 'teacher') {
                contactsToSend = contacts.teachers.concat(contacts.students);
            } else if (role === 'school') {
                contactsToSend = [...contacts.teachers, ...contacts.students];
            }
            
            res.status(200).json(contactsToSend);
        } catch (parseErr) {
            console.error("Error parsing messaging contacts:", parseErr);
            res.status(500).json({ error: "Failed to parse messaging contacts." });
        }
    });
};

