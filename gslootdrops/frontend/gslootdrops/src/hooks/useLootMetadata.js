import { useState, useEffect } from "react";

import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

import {
  Metaplex,
} from "@metaplex-foundation/js";

const connectionEndpoint =
  process.env.REACT_APP_CUSTOM_ENDPOINT || clusterApiUrl("mainnet-beta");
// --> default works, just really slow and lots of 429 (too many requests)

const connection = new Connection(connectionEndpoint);

const metaplex = new Metaplex(connection);

const LOOT_CACHE = "LOOT_CACHE";
let LootMetadataCache = {};
try {
  const data = localStorage.getItem(LOOT_CACHE);
  if (data)
    LootMetadataCache = JSON.parse(data);
}
catch (ex)
{
  console.log(ex);
}

// get metadata for a loot token
// queues up the requests one at a time so we don't get 429's
const getLootMetadata = (() =>
{
  let pending = Promise.resolve();
  
  const run = async (mintAddress) => {

    try {
      await pending;
    } finally {
      //console.log("getting metadata:", mintAddress);
      const result =  metaplex.nfts().findByMint({
        mintAddress: new PublicKey(mintAddress)
      });
      return result;
    }
  }
  // update pending promise so that next task could await for it
  return (mintAddress) => (pending = run(mintAddress))
})();


const useLootMetadata = (mintAddress) =>
{
    const [metadata, setMetadata] = useState(null);

    useEffect(() =>{

        const fetch = async () => {

            const cachedResult = LootMetadataCache[mintAddress]
            if (cachedResult)
            {
              setMetadata(cachedResult);
            }
            else
            {
              console.log("metadata: cache miss", mintAddress);
              const result = await getLootMetadata(mintAddress);
              setMetadata(result);

              LootMetadataCache[mintAddress] = result;
              try {
                localStorage.setItem(LOOT_CACHE, JSON.stringify(LootMetadataCache));
              }
              catch(ex)
              {
                LootMetadataCache = {};
              }

            }
        }

        fetch();

    }, [mintAddress]);

    return [metadata];

}

export default useLootMetadata;