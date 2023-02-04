import { useState, useMemo, createContext } from "react";

import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const Constants = require("../lib/constants");

const connectionEndpoint =
  process.env.REACT_APP_CUSTOM_ENDPOINT || clusterApiUrl("mainnet-beta");
// --> default works, just really slow and lots of 429 (too many requests)

const connection = new Connection(connectionEndpoint);

//logging transactions
const getTransferTransaction = (tokenData, transaction, instruction) => {
    if (instruction.parsed.type === "transfer")
    {
      const { authority, source, destination, amount } = instruction.parsed.info
      const date = new Date(transaction.blockTime*1000);
      console.log(`${date.toUTCString()} -- Transfer(${amount}) from ${authority}::${source} => ${destination}`);
      return {
          token: tokenData.mint,
          authority: authority,
          source: source,
          destination: destination,
          amount: amount,
          date: date,
          signature: transaction.signature,
          type: "transfer"
      };
    }
    else if (instruction.parsed.type === "transferChecked")
    {
        const { authority, source, destination, tokenAmount } = instruction.parsed.info
        const date = new Date(transaction.blockTime*1000);
        console.log(`${date.toUTCString()} -- TransferChecked(${tokenAmount.amount}) from ${authority}::${source} => ${destination}`)
        return {
          token: tokenData.mint,
          authority: authority,
          source: source,
          destination: destination,
          amount: tokenAmount.amount,
          date: date,
          signature: transaction.signature,
          type: "transfer_checked"
        };
    }
  
    return null;
  }
  
  const getBlacksmithTransaction = (tokenData, transaction, instruction) => {
    if (instruction.programId.equals(TOKEN_PROGRAM_ID))
    {    
      if (instruction.parsed.type === "transfer")
      {
          const { authority, source, destination, amount } = instruction.parsed.info
          const date = new Date(transaction.blockTime*1000);
          console.log(`${date.toUTCString()} -- Blacksmith Transfer(${amount}) from ${authority}::${source} => ${destination}`)
          return {
            token: tokenData.mint,
            authority: authority,
            source: source,
            destination: destination,
            amount: amount,
            date: date,
            signature: transaction.signature,
            type: "blacksmith_transfer"
        };
      }
    }
  }
  
  const getSoulfoxTransaction = (tokenData, transaction, instruction) => {
    if (instruction.programId.equals(TOKEN_PROGRAM_ID))
    {    
      if (instruction.parsed.type === "transfer")
      {
          const { authority, source, destination, amount } = instruction.parsed.info
          const date = new Date(transaction.blockTime*1000);
          console.log(`${date.toUTCString()} -- Soulofox Transfer(${amount}) from ${authority}::${source} => ${destination}`)
          return {
            token: tokenData.mint,
            authority: authority,
            source: source,
            destination: destination,
            amount: amount,
            date: date,
            signature: transaction.signature,
            type: "soulofox_transfer"
        };
      }
    }
  }
  
  // we need to search for transactions for each token then merge them into a big list that can be sorted by time
  const getTransactions = async (lootItem, allTransactions, setTransactions) => {
  
    let results = [];
  
    // grab all transactions for this tokenAddress
    // would be nice to cache this somewhere and search new transactions only
    // https://www.quicknode.com/docs/solana/getSignaturesForAddress
    
    // "Returns confirmed signatures for transactions involving an address 
    // backwards in time from the provided signature or most recent confirmed block."
  
    // let transactions = await connection.getSignaturesForAddress(
    //   lootItem.tokenAddress,
    //   {
    //     until: lastRecordedTransactionSignatureForToken
    //   }
    // );
  
    let transactions = await connection.getSignaturesForAddress(lootItem.tokenAddress);
  
    for (const transaction of transactions)
    {
      // has this transaction already been logged?
      // this could happen if multiple tokens are transferred in a single transaction
      // (like by the blacksmith)
      if (allTransactions.findIndex(x => x.signature === transaction.signature) > 0)
      {
          continue;
      }
  
      const parsedTransaction = await connection.getParsedTransaction(transaction.signature);
      for (let i = 0; i < parsedTransaction.transaction.message.instructions.length; i++)
      {
        let instruction = parsedTransaction.transaction.message.instructions[i];
        try {
          if (instruction.parsed)
          {
            if (instruction.programId.equals(TOKEN_PROGRAM_ID))
            {
              // handle token transfers
              const transactionEntry = getTransferTransaction(lootItem, transaction, instruction);
              if (transactionEntry)
              {
                results.push(transactionEntry);
              }
            }
            else if (instruction.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID))
            {
                //ignore creates
            }
            else
            {                                
                console.log("unknown program:", instruction.programId.toString())
                //could possibly check inner to see if there are any transfers in there?
            }
          }
          else //no parsed info
          {
            if (instruction.programId.equals(Constants.BLACKSMITH_PROGRAM))
            {
              // handle blacksmith interactions (the inner instructions will contain the transfers)
              const innerInstructions = parsedTransaction.meta.innerInstructions[i];
              for (let j=0; j<innerInstructions.instructions.length; j++)
              {
                  let innerInstruction = innerInstructions.instructions[j];
                  const transactionEntry = getBlacksmithTransaction(lootItem, transaction, innerInstruction);
                  if (transactionEntry)
                  {
                    results.push(transactionEntry);
                  }
              }
            }
            else if (instruction.programId.equals(Constants.SOULOFOX_PROGRAM))
            {
              // handle soulofox interactions (the inner instructions will contain the transfers)
              const innerInstructions = parsedTransaction.meta.innerInstructions[i];
              for (let j=0; j<innerInstructions.instructions.length; j++)
              {
                let innerInstruction = innerInstructions.instructions[j];
                const transactionEntry = getSoulfoxTransaction(lootItem, transaction, innerInstruction);
                if (transactionEntry)
                {
                  results.push(transactionEntry);
                }
              }
            }
            else
            {
              console.log("unknown program:", instruction.programId.toString())
            }
          }
        }
        catch(ex)
        {
          console.log(ex);
          console.log(instruction);
          console.log("programId:", instruction.programId.toString());
          console.log(transaction.signature);
        }
      }
    }
  
    //update the state
    allTransactions = allTransactions.concat(results);
    setTransactions(allTransactions);
  
  }
  // gets transactions for a token one at a time
  const getTransactionsQueued = (() => {
    let pending = Promise.resolve();
    
    const run = async (lootItem, transactions, setTransactions) => {
      try {
        await pending;
      } finally {
        return getTransactions(lootItem, transactions, setTransactions);
      }
    }
    // update pending promise so that next task could await for it
    return (lootItem, transactions, setTransactions) => (pending = run(lootItem, transactions, setTransactions))
  })()


const useLootTransactions = (token) => {
  const [transactions, setTransactions] = useState([]);

  useMemo(() =>{

    const fetch = async() => {
      const results = []
      await getTransactionsQueued(lootItem, results, setTransactions);
    }

    fetch();

  }, [token]);

  return [transactions]

};

export default useLootTransactions;
