import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (!url) {
            alert('Please enter a valid YouTube URL');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/download?url=${url}`, {
                responseType: 'blob',
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', 'video.mp4');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            alert('Error downloading video');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>YouTube Video Downloader</h1>
            <input
                type="text"
                placeholder="Enter YouTube URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button onClick={handleDownload} disabled={loading}>
                {loading ? 'Downloading...' : 'Download'}
            </button>
        </div>
    );
}

export default App;