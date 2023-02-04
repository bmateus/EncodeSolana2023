import { useGuildSagaLootData } from "../hooks/useGuildSagaLootData";
import { Grid } from "@mui/material";
import LootItem from "./LootItem";

const LootList = () => {
  const { loot } = useGuildSagaLootData();

  if (loot && loot.length > 0) {
    const items = loot.map((item) => (
      <LootItem key={item.tokenAddress} itemData={item} />
    ));

    return (
      <Grid container spacing={2}>
        {items}
      </Grid>
    );
  }
};

export default LootList;
