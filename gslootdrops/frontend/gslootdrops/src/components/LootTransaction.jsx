import { TableRow, TableCell } from "@mui/material";
import useLootMetadata from "../hooks/useLootMetadata";

const LootTransaction = ({ itemData }) => {

    //console.log("LootTransactionMenuItem:", itemData);
    const [metadata] = useLootMetadata(itemData.token);

    return (
        <TableRow>
            <TableCell>{itemData.date.toString()}</TableCell>
            <TableCell>{itemData.type}</TableCell>
            <TableCell>{metadata?.name ?? "???"}</TableCell>
            <TableCell>{itemData.amount}</TableCell>
            <TableCell>{itemData.authority}</TableCell>
            <TableCell>{itemData.destination}</TableCell>
        </TableRow>
    );
}  


export default LootTransaction;