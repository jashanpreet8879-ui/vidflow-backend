const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

app.get('/api/trending', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/videos`, {
            params: {
                part: 'snippet,statistics',
                chart: 'mostPopular',
                regionCode: 'IN',
                maxResults: 20,
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
        const response = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                maxResults: 20,
                q: q,
                type: 'video',
                key: YOUTUBE_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
