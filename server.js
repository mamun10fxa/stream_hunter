const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/download', (req, res) => {
    // Extract data from the request
    const { videoUrl, audioUrl, title, videoBitrate, audioBitrate } = req.body;

    // Simulate processing and creating a download URL
    // Replace this with your actual processing logic
    setTimeout(() => {
        // Example download URL
        const downloadUrl = `/output/${title}.mp4`;

        // Respond with success
        res.json({ success: true, downloadUrl: downloadUrl });
    }, 5000); // Simulate processing time
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
