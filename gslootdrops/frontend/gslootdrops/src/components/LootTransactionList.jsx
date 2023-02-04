import { useState, useEffect } from "react";
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Typography } from "@mui/material";
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
        <Table sx={{ minWidth: 800, tableLayout:"fixed" }} aria-label="loot-transaction-table">
            <TableHead>
                <TableRow>
                    <TableCell sx={{ width:"140px"}}>
                        <Typography sx={{ p:1, fontFamily:"Roboto"}}>
                            Date
                        </Typography>
                    </TableCell>
                    <TableCell sx={{ width:"160px", textAlign:"center"}}>
                        <Typography sx={{ p:1, fontFamily:"Roboto"}}>
                            Transaction
                        </Typography>
                    </TableCell>
                    <TableCell sx={{ width:"80px", textAlign:"center"}}>
                        <Typography sx={{ p:1, fontFamily:"Roboto"}}>
                            Loot
                        </Typography>
                    </TableCell>
                    <TableCell sx={{ width:"80px", textAlign:"center"}}>
                        <Typography sx={{ p:1, fontFamily:"Roboto"}}>
                            Amount
                        </Typography>
                    </TableCell>
                    <TableCell sx={{ width:"160px"}}>
                        <Typography sx={{ p:1, fontFamily:"Roboto"}}>
                            From
                        </Typography>    
                    </TableCell>
                    <TableCell sx={{ width:"160px"}}>
                        <Typography sx={{ p:1, fontFamily:"Roboto"}}>
                            To
                        </Typography>
                    </TableCell>
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
