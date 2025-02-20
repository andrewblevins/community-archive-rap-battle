document.addEventListener('DOMContentLoaded', async () => {
    const user1Dropdown = document.getElementById('user1-dropdown');
    const user2Dropdown = document.getElementById('user2-dropdown');
    const generateBtn = document.getElementById('generate-btn');
    const loader = document.getElementById('loader');
    const rapLyrics = document.getElementById('rap-lyrics');

    // Fetch users and populate dropdowns
    async function fetchUsers() {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch users');
            }

            populateDropdowns(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to load users. Please try again later.');
        }
    }

    // Populate dropdowns with user data
    function populateDropdowns(users) {
        users.forEach(user => {
            const option1 = document.createElement('option');
            option1.value = user.account_id;
            option1.textContent = user.username;
            user1Dropdown.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = user.account_id;
            option2.textContent = user.username;
            user2Dropdown.appendChild(option2);
        });

        generateBtn.disabled = false;
    }

    // Fetch tweets and generate rap lyrics
    async function generateRap() {
        const user1Id = user1Dropdown.value;
        const user2Id = user2Dropdown.value;

        if (!user1Id || !user2Id) {
            alert('Please select two users.');
            return;
        }

        generateBtn.disabled = true;
        loader.classList.remove('hidden');
        loader.textContent = 'Generating rap BATTLE. Who will DESTROy who??';

        try {
            const tweets1 = await fetch(`/api/tweets?userId=${user1Id}&limit=50`).then(res => res.json());
            console.log('Tweets for User 1:', tweets1);

            const tweets2 = await fetch(`/api/tweets?userId=${user2Id}&limit=50`).then(res => res.json());
            console.log('Tweets for User 2:', tweets2);

            // Concatenate tweets into a single string for each user
            const tweets1Text = tweets1.map(tweet => tweet.full_text).join('\n');
            const tweets2Text = tweets2.map(tweet => tweet.full_text).join('\n');

            const prompt = `Here are archives of two twitter accounts. User 1: ${tweets1Text} User 2: ${tweets2Text}. Please write lyrics for a rap battle expressing their main worldview and ideas, focusing on the disagreements or differences in emphasis. Be creative and punchy, get to the heart of who both people are. Use the same words and turns of phrase that they use in their tweets, directly quoting when possible.`;

            const requestBody = { prompt };
            console.log('Data sent to Claude API:', requestBody);

            const response = await fetch('/api/claude', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const responseData = await response.json();
            console.log('Claude API response data:', responseData);

            const { content } = responseData;
            if (!content || content.length === 0) {
                throw new Error('Lyrics not found in response');
            }

            // Assuming content is an array of objects with a 'text' field
            const lyrics = content.map(item => item.text);
            displayRapLyrics(lyrics, user1Id, user2Id);
        } catch (error) {
            console.error('Error generating rap:', error);
            alert('Failed to generate rap. Please try again later.');
        } finally {
            generateBtn.disabled = false;
            loader.classList.add('hidden');
        }
    }

    // Display rap lyrics with styling
    function displayRapLyrics(lyrics, user1Id, user2Id) {
        rapLyrics.innerHTML = '';
        lyrics.forEach(line => {
            const span = document.createElement('span');
            span.textContent = line.text;
            span.classList.add(line.userId === user1Id ? 'user1' : 'user2');
            rapLyrics.appendChild(span);
            rapLyrics.appendChild(document.createElement('br'));
        });
        rapLyrics.classList.remove('hidden');
    }

    generateBtn.addEventListener('click', generateRap);

    // Initial fetch of users
    fetchUsers();
}); 