const express = require('express');
const { exec } = require('youtube-dl-exec');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Download route
app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('Invalid YouTube URL');
    }

    try {
        const output = await exec(url, {
            output: '%(title)s.%(ext)s',
            format: 'mp4',
        });

        res.download(output);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error downloading video');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});