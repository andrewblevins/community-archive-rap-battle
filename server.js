import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, // Ensure this is set in your .env file
});

// Middleware to parse JSON
app.use(express.json({ limit: '1mb' }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to handle Claude API request
app.post('/api/claude', async (req, res) => {
    const { tweets1, tweets2 } = req.body;
    const prompt = `Here are archives of two twitter accounts. Please write lyrics for a rap battle expressing their main worldview and ideas, focusing on the disagreements or differences in emphasis. Be creative and punchy, get to the heart of who both people are. Use the same words and turns of phrase that they use in they tweets, directly quoting when possible.`;

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
        });

        console.log('Claude API response:', msg);
        res.json(msg);
    } catch (error) {
        console.error('Error calling Claude API:', error);
        res.status(500).json({ error: 'Failed to generate rap lyrics' });
    }
});

// Route to fetch users
app.get('/api/users', async (req, res) => {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/account`, {
            method: 'GET',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            res.json(data);
        } else {
            throw new Error(data.message || 'Failed to fetch users');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to load users' });
    }
});

// Route to fetch tweets for a specific user
app.get('/api/tweets', async (req, res) => {
    const { userId, limit } = req.query;

    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/tweets?account_id=eq.${userId}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            res.json(data);
        } else {
            throw new Error(data.message || 'Failed to fetch tweets');
        }
    } catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).json({ error: 'Failed to load tweets' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    console.log('Supabase Key:', process.env.SUPABASE_ANON_KEY);
}); 