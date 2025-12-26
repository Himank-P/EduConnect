const fs = require('fs');
const path = require('path');

exports.readData = (fileName, dataKey = null) => {
    return (req, res) => {
        const dataPath = path.join(__dirname, '../data', fileName);
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading ${fileName}:`, err);
                return res.status(500).json({ error: `Failed to read data from ${fileName}` });
            }
            try {
                let jsonData = JSON.parse(data);
                if (dataKey) {
                    const keys = dataKey.split('.');
                    let result = jsonData;
                    for (const key of keys) {
                        result = result[key];
                        if (result === undefined) return res.status(404).json({ error: "Data key not found." });
                    }
                    return res.status(200).json(result);
                }
                return res.status(200).json(jsonData);
            } catch (parseErr) {
                console.error(`Error parsing ${fileName}:`, parseErr);
                return res.status(500).json({ error: `Failed to parse data from ${fileName}` });
            }
        });
    };
};

