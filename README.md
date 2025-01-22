# Web3 based Digital NFT MarketPlace for Artisans and Collectors

## Technology Stack & Tools
- [Solidity](https://docs.soliditylang.org/en/latest/) (Writing Smart Contract)
- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) (React & Testing)
- [Ethers](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ipfs](https://ipfs.io/) (Metadata storage)
- [React routers](https://v5.reactrouter.com/) (Navigational components)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), should work with any node version below 16.5.0
- Install [Hardhat](https://hardhat.org/)


## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
$ cd Galerie
// Please delete the yarn.lock file
```
### 3. Install Dependencies:
```
// Also after deleting yarn.lock run this command 
if yarn 
$ yarn cache clean

if npm 
$ npm cache clean

$ npm install or yarn 

//if you face installing problems 
execute,  $yarn add --force  or $npm install --force
if that didn't work, try
$yarn add --legacy-peer-deps or $npm install --legacy-peer-deps

//if you face network issues
execute,  $yarn install --network-timeout 1000000
          
```
### 4. Set up Environment Varibles 
```
Create a ev file .env , which will look like this:

REACT_APP_PINATA_API_KEY = 432a7605d4c8w9euisjwfji
REACT_APP_PINATA_SECRET_API_KEY = b5184aa54e3c9ec622acdfcd284woijiwgra1a2fd4930d276e581
INFURA_PROJECT_ID = cd1f4810ijfeijiwef9weuwe


SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/cd1f4810hahuchush

PRIVATE_KEY=d6dfd18647049c7a116c12d64426a26b5af2ade667c921a8b151ddd694c6cc6f

PINATA_API_KEY=43wahef4c8b28d7dbd

INFURA_KEY=cd1f481035af4328329b7589667d7e9

ETHERSCAN_API_KEY=B87PYRH9ursejigN1EXN7EY

//These are example credentials you need to obtain your own particular keys from respective providers
```

### 5. Boot up local development blockchain
```
$ cd Galerie
$ npx hardhat node
```
- It's necessary to bootup the local blockchain network before setting up your metmask Network configurations for Hardhat! 

### 6. Download Metamask Browser Extension
- Ensure you correctly setup the Extension according to step 7 for proper working of the application

### 7. Connect development blockchain accounts to Metamask Browser Extension
- Copy private key of the addresses from the terminal
- Click on the account dropdown of Metamaks on top and you can select other accounts if you have one
- Click on Add account or hardware wallet and select Import Account and then enter that private key in the input box
- You have to navigate into Metamask account and connect your Metamask to hardhat blockchain, network 127.0.0.1:8545.
- If you have not added hardhat to the list of networks on your Metamask, open up a browser, click the fox icon, then click the top center dropdown button that lists all the available networksform should pop up then click add networks. A . For the "Network Name" field enter "Hardhat". For the "New RPC URL" field enter "http://127.0.0.1:8545". For the chain ID enter "31337". Then click save.  


### 8. Migrate Smart Contracts
`npx hardhat run src/backend/scripts/deploy.js --network https://galerie-one.vercel.app`

### 9. Run Tests
`$ npx hardhat test`
- Don't worry if tests fails, it won't affect the main workflow


### 10. Launch Frontend
`$ npm run start`

To test as a telegram mini app, install cloudflare extension on VSCode and start it to obtain public accessible URL , use that URL to setup the telegram mini app through
bot.js file or through botfather.

Also we have deployed our smart contracts on sepolia testnet so
the marketplace and other functionalities would work on this testnet or on default hardhat network.

Hopefully your telegram mini app should start without any errors! 

Check out our telegram mini app: [Click here!](https://t.me/Galeries_Telegram_Mini_App_Bot) 
//If you are accessing app through telegram please note that sometimes connecting to wallet and making transactions will be
tough and time-consuming , so patience is a key here!

Watch Step-by-Step Tutorial Video:https://drive.google.com/drive/u/0/mobile/folders/19tcZjHNz3QY9lKXSrqGEa3N8MBXoesuo?usp=sharing

