# Twitter Rap Battle Generator

This project is an app that generates rap battles between two Twitter users based on their tweets, drawing on tweets uploaded to the [Community Archive](https://www.community-archive.org/).

Created during the 2025 Community Archive Hackathon at [Fractal Tech](https://fractaltechhub.com/). 

Currently running on Priya's private Claude credits -- support the project by Venmoing @Priya-Ghose.

## Features

- Fetches user data and tweets from the [Community Archive](https://www.community-archive.org/).
- Generates rap lyrics using the Claude API.
- Displays the rap battle with styled text for each user.

## TODO 

- [ ] Find way to connect more directly with Suno (no API but unofficial one here: https://github.com/gcui-art/suno-api?tab=readme-ov-file)
- [ ] Ability to search through dropdown menus more easily
- [ ] Cool loading graphics while generating is happening
- [ ] Give more precise error messages (e.g. is it failing because low money in Claude account?)
- [ ] Ability to vote on who wins the rap battle
- [ ] Use community data to detect current beefs and auto-generate raps
- [ ] Twitter bot that tweets out all generated raps
- [ ] Update UI so it displays both people's profile pics
- [ ] Add logging and/or uptime bot and/or real time posts to Discord channel every time someone creates a rap

## Authors

- [Andrew](https://x.com/andrew0blevins)
- [Priya](https://x.com/Prigoose)
- [Ivan](https://x.com/IvanVendrov)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Installation

To set up the Twitter Rap Battle Generator locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/andrewblevins/community-archive-rap-battle.git
   cd community-archive-rap-battle
   ```

2. **Install dependencies:**

   Make sure you have [Node.js](https://nodejs.org/) installed. Then, run:

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   CLAUDE_API_KEY=your_claude_api_key
   ```

   Replace `your_supabase_url`, `your_supabase_anon_key`, and `your_claude_api_key` with your actual Supabase and Claude API credentials.

4. **Run the application:**

   Start the server with:

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

5. **Access the application:**

   Open your web browser and navigate to `http://localhost:3000` to start using the Twitter Rap Battle Generator.

6. **Contributing:**

   Please do! Fork the repository and create a pull request with your changes. See the TODO list above for ideas or add your own.
