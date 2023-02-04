import { useState, useEffect, createContext, useContext } from "react";

import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

import { TOKEN_PROGRAM_ID, getMint } from "@solana/spl-token";

import getTransactions from "../services/lootTransactions";

const Constants = require("../lib/constants");

const connectionEndpoint =
  process.env.REACT_APP_CUSTOM_ENDPOINT || clusterApiUrl("mainnet-beta");
// --> default works, just really slow and lots of 429 (too many requests)

const connection = new Connection(connectionEndpoint);

const MINT_CACHE = "MINT_CACHE";
let MintCache = {};
try {
  const data = localStorage.getItem(MINT_CACHE);
  if (data) MintCache = JSON.parse(data);
} catch (ex) {
  console.log(ex);
}

// determine if the mint authority is GSLoot
// would be nice to cache this
const isGuildSagaLootToken = async (tokenMint) => {
  const cachedResult = MintCache[tokenMint];

  //console.log("cachedResult for", tokenMint, cachedResult);

  if (cachedResult != null) return cachedResult;

  console.log("isGuildSagaLoot cache miss", tokenMint);

  const tokenMintPK = new PublicKey(tokenMint);
  //console.log("getMint:", tokenMint);
  const mint = await getMint(connection, tokenMintPK);
  const v =
    mint.mintAuthority && mint.mintAuthority.equals(Constants.GUILD_SAGA_LOOT);
  MintCache[tokenMint] = v;
  try {
    localStorage.setItem(MINT_CACHE, JSON.stringify(MintCache));
  } catch (ex) {
    MintCache = {};
  }
  return v;
};

// filters GSLoot tokens from a set of tokens
const filterTokens = async (tokens, setLoot, setProgress) => {
  let filteredTokens = [];
  //let transactions = [];
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    //console.log("Checking Token:", i, token.mint);
    setProgress?.(`Checking token ${token.mint}`);

    if (await isGuildSagaLootToken(token.mint)) {
      filteredTokens.push(token);
      setLoot(filteredTokens); //as each token is processed we update the state

      // kick off the task to grab the transactions for a token
      // and coallesce them together in the state's transactions
      // there is probably a better way to do this, but ¯\_(ツ)_/¯
      // this could take a long time depending on the number of tokens
      // in a user's wallet and how many transactions there have been
      // would def benefit from some kind of caching in a DB
      //getTransactionsQueued(token, transactions, setTransactions);
    }
  }
  setProgress?.("");

  return filteredTokens;
};

// get all the GSLoot in a wallet
const getLoot = async (walletPK, setLoot, setProgress) => {
  const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    walletPK,
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  console.log("parsedTokenAccounts:", parsedTokenAccounts);

  const tokens = parsedTokenAccounts.value.map((value) => {
    return {
      tokenAddress: value.pubkey,
      mint: value.account.data.parsed.info.mint,
      amount: value.account.data.parsed.info.tokenAmount.amount,
    };
  });

  return await filterTokens(tokens, setLoot, setProgress);

};

export const GuildSagaLootDataContext = createContext({
  wallet: "",
  setWallet: () => {},
  loot: [],
  transactions: [],
  progress: () => {},
});

const GuildSagaLootDataProvider = ({ children }) => {
  const [wallet, setWallet] = useState("");
  const [loot, setLoot] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [progress, setProgress] = useState("");

  useEffect(() => {
    async function fetch() {
      if (wallet && wallet !== "") {
        console.log("fetching:", wallet);
        const walletPK = new PublicKey(wallet);
        setLoot([]);
        const lootResult = await getLoot(walletPK, setLoot, setProgress);

        console.log("Finished getting all loot tokens");
        //now get transactions
        const transactionResult = await getTransactions(lootResult, setProgress);
        setTransactions(transactionResult);

        console.log("Finished getting all transactions");
        setProgress("");
      }
    }

    fetch();
  }, [wallet, setLoot, setProgress]);

  return (
    <GuildSagaLootDataContext.Provider
      value={{
        wallet,
        setWallet,
        loot,
        transactions,
        progress,
      }}
    >
      {children}
    </GuildSagaLootDataContext.Provider>
  );
};

const useGuildSagaLootData = () => {
  const context = useContext(GuildSagaLootDataContext);
  if (context === undefined) {
    throw new Error(
      "useGuildSagaLootData must be used within a GuildSagaLootDataProvider"
    );
  }
  return context;
};

export { useGuildSagaLootData, GuildSagaLootDataProvider };
