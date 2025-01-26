const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Download route
app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!ytdl.validateURL(url)) {
        return res.status(400).send('Invalid YouTube URL');
    }

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, ''); // Sanitize title
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
        ytdl(url, { format: 'mp4' }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error downloading video');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});