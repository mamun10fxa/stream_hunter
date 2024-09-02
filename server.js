const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file when accessing the root route "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle the download POST request
app.post('/download', (req, res) => {
    const { videoUrl, audioUrl, title, videoBitrate, audioBitrate } = req.body;

    const tempDir = path.join(__dirname, 'temp');
    const outputDir = path.join(__dirname, 'output');

    // Ensure directories exist
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const downloadCommand = `
        ffmpeg -i "${videoUrl}" -b:v ${videoBitrate} -c copy -y "${tempDir}/${title}.video.ts" &&
        ffmpeg -i "${audioUrl}" -b:a ${audioBitrate} -c copy -y "${tempDir}/${title}.audio.ts" &&
        ffmpeg -i "${tempDir}/${title}.video.ts" -i "${tempDir}/${title}.audio.ts" -c:v copy -c:a copy -y "${outputDir}/${title}.mp4" &&
        rm "${tempDir}/${title}.video.ts" "${tempDir}/${title}.audio.ts"
    `;

    exec(downloadCommand, (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json({ fileUrl: `/output/${title}.mp4` });
    });
});

// Start the server on port 3001 (or any port you choose)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
