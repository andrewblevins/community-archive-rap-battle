document.addEventListener('DOMContentLoaded', async () => {
    const user1Dropdown = document.getElementById('user1-dropdown');
    const user2Dropdown = document.getElementById('user2-dropdown');
    const generateBtn = document.getElementById('generate-btn');
    const loader = document.getElementById('loader');
    const rapLyrics = document.getElementById('rap-lyrics');
    const generateAudioBtn = document.getElementById('generate-audio-btn');
    const audioInstructions = document.getElementById('audio-instructions');

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
            option1.textContent = `@${user.username}`;
            user1Dropdown.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = user.account_id;
            option2.textContent = `@${user.username}`;
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

        const user1Name = user1Dropdown.options[user1Dropdown.selectedIndex].text;
        const user2Name = user2Dropdown.options[user2Dropdown.selectedIndex].text;

        generateBtn.disabled = true;
        loader.classList.remove('hidden');
        loader.textContent = 'Generating rap BATTLE. Who will DESTROy who??';

        try {
            const tweets1 = await fetch(`/api/tweets?userId=${user1Id}&limit=50`).then(res => res.json());
            console.log('Tweets for User 1:', tweets1);

            const tweets2 = await fetch(`/api/tweets?userId=${user2Id}&limit=50`).then(res => res.json());
            console.log('Tweets for User 2:', tweets2);

            // Concatenate tweets into a single string for each user
            const tweets1Text = tweets1.map(tweet => `- ${tweet.full_text}`).join('\n');
            const tweets2Text = tweets2.map(tweet => `- ${tweet.full_text}`).join('\n');

            const prompt = `Create a rap battle between two Twitter users based on their tweets. Focus on their main ideas and differences. Use their words and phrases directly when possible.\n\n${user1Name} Tweets:\n${tweets1Text}\n\n${user2Name} Tweets:\n${tweets2Text}`;

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

            displayRapLyrics(content, user1Name, user2Name);
        } catch (error) {
            console.error('Error generating rap:', error);
            alert('Failed to generate rap. Please try again later.');
        } finally {
            generateBtn.disabled = false;
            loader.classList.add('hidden');
        }
    }

    // Display rap lyrics with styling
    function displayRapLyrics(lyricsArray, user1Name, user2Name) {
        rapLyrics.innerHTML = ''; // Clear any existing content

        // Concatenate all text fields into a single string
        const lyrics = lyricsArray.map(item => item.text).join('\n');

        // Replace placeholders with actual usernames
        const updatedLyrics = lyrics.replace(/User 1/g, user1Name).replace(/User 2/g, user2Name);

        // Split the concatenated string into lines
        const lines = updatedLyrics.split('\n');

        lines.forEach(line => {
            const span = document.createElement('span');
            span.textContent = line;
            
            // Add a class based on the user (optional, if you want to style differently)
            if (line.includes(`[Verse 1: ${user1Name}]`) || line.includes(`[Verse 3: ${user1Name}]`)) {
                span.classList.add('user1');
            } else if (line.includes(`[Verse 2: ${user2Name}]`) || line.includes(`[Verse 4: ${user2Name}]`)) {
                span.classList.add('user2');
            } else {
                span.classList.add('both'); // For shared lines or outros
            }

            rapLyrics.appendChild(span);
            rapLyrics.appendChild(document.createElement('br')); // Add a line break
        });

        rapLyrics.classList.remove('hidden');
        generateAudioBtn.classList.remove('hidden');
        audioInstructions.classList.remove('hidden');
    }

    generateBtn.addEventListener('click', generateRap);

    generateAudioBtn.addEventListener('click', () => {
        window.open('https://suno.com/create', '_blank');
    });

    // Initial fetch of users
    fetchUsers();
}); 