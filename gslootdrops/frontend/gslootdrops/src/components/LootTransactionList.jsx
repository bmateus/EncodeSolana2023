import { useState, useEffect } from "react";
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useGuildSagaLootData } from "../hooks/useGuildSagaLootData";
import LootTransaction from "./LootTransaction";

const LootTransactionList = () => {

    const [sorted, setSorted] = useState([])

    const { transactions } = useGuildSagaLootData();

    //console.log("transactions:", transactions);

    useEffect(()=>{
        setSorted(transactions.sort((x,y) => x.date - y.date));
    },[transactions]);

  if (sorted && sorted.length > 0) {
    const items = sorted.map((item, idx) => (
      <LootTransaction key={idx} itemData={item} />
    ));

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label="loot-transaction-table">
            <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Transaction Type</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {items}
            </TableBody>

      </Table>
      </TableContainer>
    );
  }
};

export default LootTransactionList;
