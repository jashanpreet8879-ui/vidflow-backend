const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Render.com assigns a dynamic port via the PORT environment variable.
const PORT = process.env.PORT || 10000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Add a simple health check endpoint that Render looks for
app.get('/api/health', (req, res) => {
    res.status(200).send('OK');
});

// Root endpoint just in case Render tries to ping '/'
app.get('/', (req, res) => {
    res.status(200).send('VidFlow Backend is Running!');
});

app.get('/api/trending', async (req, res) => {
    try {
        const pageToken = req.query.pageToken;
        const response = await axios.get(`${BASE_URL}/videos`, {
            params: {
                part: 'snippet,statistics',
                chart: 'mostPopular',
                regionCode: 'IN',
                maxResults: 20,
                pageToken: pageToken,
                key: YOUTUBE_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch trending videos' });
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const q = req.query.q;
        const pageToken = req.query.pageToken;
        const response = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                maxResults: 20,
                q: q,
                type: 'video',
                pageToken: pageToken,
                key: YOUTUBE_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

// IMPORTANT: Bind to 0.0.0.0 instead of default localhost to allow external connections on Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
