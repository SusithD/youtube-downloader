const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to yt-dlp.exe
const ytDlpPath = path.join(__dirname, 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp.exe');

// Directory to save downloaded files
const downloadsDir = path.join(__dirname, 'downloads');

// Ensure the downloads directory exists
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

// Download route
app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('Invalid YouTube URL');
    }

    try {
        // Generate a unique filename
        const output = path.join(downloadsDir, '%(title)s.%(ext)s');
        const command = `"${ytDlpPath}" "${url}" -o "${output}" -f mp4`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error downloading video');
            }

            // Extract the actual file path from the output
            const filePath = stdout.match(/Destination: (.*)/)?.[1];
            if (!filePath || !fs.existsSync(filePath)) {
                return res.status(500).send('File not found');
            }

            // Send the file for download
            res.download(filePath, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error sending file');
                }

                // Optionally delete the file after download
                fs.unlinkSync(filePath);
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error downloading video');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});