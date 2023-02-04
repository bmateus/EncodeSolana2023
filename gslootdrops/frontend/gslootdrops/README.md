# Overview

This is a project for the (Encode Solana Hackathon 2023)[https://www.encode.club/encode-solana-hackathon] 

This is my first Solana Hackathon; I have done some hackathons on Ethereum in the past and have been curious to learn more on how Solana works, so this was a good opportunity to do that.

One of the great things about Web3 is the openness of the data; Anyone can contribute tools to a project that they are interested in to solve problems for that projects community. This project aims to do that for a feature of a Solana project that I am interested in.

# What is Guild Saga?

Guild Saga is a game project that has been building on Solana. 
One of the game modes is "World Mode". In world mode you can send your Hero NFTs on quests (staking) and after a period of time, there is a chance that they can return with loot items (These are SFTs that are airdropped). 

You can learn more about it here: [Guild Saga Whitepaper](https://docs.guildsaga.com/)

# What problems is this tool trying to address?

- The [Phantom](https://phantom.app/) wallet app (probably the most popular Solana based wallet) will notify of airdrops as a push notification on the mobile app - sometimes. Not sure why, but it is a bit flakey when it comes to this. When this fails it is hard to know what was airdropped.

- There is a discord channel in the [Guild Saga Discord](https://discord.gg/guildsaga) server dedicated to these loot drops where the community shares and discusses what they received. Many users also have spreadsheets that keep track of what they received each week. 

- As the loot is an SFT, there is limited support in many tools for this. It would be nice if there was a way to take your inventory of loot items and apply different sets of filters to them, e.g. by different attributes such as rarity, and type, as well as date range they were received, and also current amount of each item in circulation at the moment

# How will this tool address these issues?

- Scan the users wallet for loot items and display the results in a way that can be shared with others;

- Filter the inventory by different criteria

- Show a list of transactions pertaining to each loot item in a user's wallet

- There are a couple additional ways a user can interact with these SFTs: there is a blacksmith feature that can combine loot to craft new items, and there is a store where they can be traded [soulofox](https://app.soulofox.com/item-store/guild-saga/guild-saga-loot)... it would be good if we could see these transactions as well

# How it works / Implementation notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) as a SPA (single page application). 

This project does not require a wallet as there are no transactions that need to be signed; all that is required is a wallet address.

When a wallet address is provided, a bunch of RPC calls need to be made to get the data. This can potentially result in rate limiting (429 errors) if the requests happen too fast and often, so it takes a while to fetch the data required. Results may vary depending on the RPC endpoint. I used a custom [Alchemy](https://www.alchemy.com/) RPC; Using the default might perform worse. You can specify an RPC with the CUSTOM_ENDPOINT in the .env file

Caching blockchain data: There is a bunch of data caching that can be performed to improve the performance of the data retrieval. This was initially planned to be a web service where a database could be utilized to handle the caching, but for the sake of time and complexity, was implemented as local browser caching. 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

