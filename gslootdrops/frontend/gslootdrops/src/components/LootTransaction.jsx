import { TableRow, TableCell, Typography, Button } from "@mui/material";
import { useGuildSagaLootData } from "../hooks/useGuildSagaLootData";
import useLootMetadata from "../hooks/useLootMetadata";
import LootItem from "./LootItem";

const Constants = require("../lib/constants");

const ShortenAddress = (address) =>
{
    return address.slice(0, 4) + "..." + address.slice(-4);
}

const OpenLinkInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
};

const LootTransaction = ({ itemData }) => {

    //console.log("LootTransactionMenuItem:", itemData);
    const {wallet} = useGuildSagaLootData();
    const [metadata] = useLootMetadata(itemData.token);

    let transaction = itemData.type;    
    let from = itemData.authority;
    let to = "???";

    if (itemData.authority === Constants.GUILD_SAGA_LOOT.toString())
    {
        from = "Guild Saga";
        if (itemData.type === "transfer")
        {
            transaction = "Airdrop";
        }
        to = ShortenAddress(wallet);
    }
    else if (itemData.authority === Constants.PRIZE_WALLET.toString())
    {
        from = "Prizes";
        if ( (itemData.type === "transfer") || (itemData.type === "transfer_checked"))
        {
            transaction = "Transfer";
        }
        to = ShortenAddress(wallet);
    }
    else if (itemData.type === "blacksmith_transfer")
    {
        transaction = "Blacksmith";
        if (itemData.authority === wallet)
        {
            from = ShortenAddress(wallet);
            to = "Blacksmith";
        }
        if (itemData.authority === Constants.BLACKSMITH_WALLET.toString())
        {
            from = "Blacksmith";
            to = ShortenAddress(wallet);
        }
    }
    else if (itemData.type === "soulofox_transfer")
    {
        transaction = "Soulofox";
        from = ShortenAddress(itemData.authority);
        to = ShortenAddress(itemData.destination); //todo: get owner
    }
    else
    {
        from = ShortenAddress(itemData.authority);
        to = ShortenAddress(itemData.destination);
    }

    return (
        <TableRow>
            <TableCell>
                <Typography sx={{ p:1,  fontFamily:"Roboto"}} variant="body1">
                    {itemData.date.toLocaleDateString()}<br/>
                    {itemData.date.toLocaleTimeString()}
                </Typography>
            </TableCell>
            <TableCell sx={{ textAlign:"center"}}>
                <Button onClick={() => OpenLinkInNewTab(`https://solana.fm/tx/${itemData.signature}`)}>
                    <Typography sx={{ p:1, fontFamily:"Roboto"}}>
                        {transaction}
                    </Typography>
                </Button>
            </TableCell>
            <TableCell sx={{ textAlign:"center"}}>
                <LootItem itemData={{ mint: itemData.token }}/>
            </TableCell>
            <TableCell sx={{ textAlign:"center"}}>
                <Typography sx={{ p:1,  fontFamily:"Roboto"}} variant="body1">
                    {itemData.amount}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography sx={{ p:1,  fontFamily:"Roboto"}} variant="body1">
                    {from}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography sx={{ p:1,  fontFamily:"Roboto"}} variant="body1">
                    {to}
                </Typography>
            </TableCell>
        </TableRow>
    );
}  


export default LootTransaction;