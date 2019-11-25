# gitlab-bot

- Check every five minutes items below:

- Get oldest merge request status open; 

- If down vote is greater than 0 then close Merge Request;

- If the last pipeline failed then close Merge Request;

- If approvals required then accept Merge Request;

# How to use

open .env and fill your:
- Gitlab URL
- Private Token
- Project ID or namespace

# Build

npm install

# Run

npm start
