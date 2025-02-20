#!/usr/bin/env python
import json
import sys

def extract_tweets(json_file):
    with open(json_file, 'r') as f:
        data = json.load(f)
    
    # Extract tweets array
    tweets = data.get('tweets', [])
    
    # Print each tweet's full text, skipping retweets and replies
    for tweet_obj in tweets:
        if 'tweet' in tweet_obj and 'full_text' in tweet_obj['tweet']:
            text = tweet_obj['tweet']['full_text']
            # Skip if it starts with RT @ or starts with @
            if not text.startswith('RT @') and not text.startswith('@'):
                print(text)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python scrape.py <json_file>")
        sys.exit(1)
    
    json_file = sys.argv[1]
    extract_tweets(json_file)