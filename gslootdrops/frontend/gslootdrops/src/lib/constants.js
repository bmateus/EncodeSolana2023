const { PublicKey } = require("@solana/web3.js");

const GGEM_TOKEN_NAME = "GGEM";

const GGEM_TOKEN = new PublicKey("GGEMxCsqM74URiXdY46VcaSW73a4yfHfJKrJrUmDVpEF");

const GUILD_SAGA_LOOT = new PublicKey("LooTFMTfuu3CtENwhPuu3E4sdZwcGq1XyBQtTn3ZXuB");

const TEAM_WALLET = new PublicKey("3wm457nkem9D1jEeqnLss9Zx9w88zx7u9jQCwokKuTcq"); // maybe?

const PRIZE_WALLET = new PublicKey("BYrDNnrYqhtiZKRUh17NcuJKhbj15cuXjorRvT6wK7PW");

const BLACKSMITH_WALLET = new PublicKey("4yP7R2gXhNUiTTfXoaLpCNfBmM59h8q4SUXpa1rpenYt"); //maybe?

const BLACKSMITH_PROGRAM = new PublicKey("23fHk6AiuKysT9AM5CDQMjFH8ohtuxYkGZUzMEU9xgUY");

const SOULOFOX_PROGRAM = new PublicKey("SFoxdRJbbPSuNSB9U8MdcRWdoT3ik6xSxUU1WQqADVB");

export {
    GGEM_TOKEN_NAME,
    GGEM_TOKEN,
    GUILD_SAGA_LOOT,
    TEAM_WALLET,
    PRIZE_WALLET,
    BLACKSMITH_WALLET,
    BLACKSMITH_PROGRAM,
    SOULOFOX_PROGRAM
}