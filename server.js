import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to handle Claude API request
app.post('/api/claude', async (req, res) => {
    const { tweets1, tweets2 } = req.body;
    const prompt = `Here are archives of two twitter accounts. Please write lyrics for a rap battle expressing their main worldview and ideas, focusing on the disagreements or differences in emphasis. Be creative and punchy, get to the heart of who both people are. Use the same words and turns of phrase that they use in they tweets, directly quoting when possible.`;

    try {
        const response = await fetch('CLAUDE_API_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`
            },
            body: JSON.stringify({ prompt, tweets1, tweets2 })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error calling Claude API:', error);
        res.status(500).json({ error: 'Failed to generate rap lyrics' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 