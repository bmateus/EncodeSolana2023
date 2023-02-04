import { useGuildSagaLootData } from "../hooks/useGuildSagaLootData";
import { Box } from "@mui/material";

const ProgressText = () => {
  const { progress } = useGuildSagaLootData();
  return <Box sx={{ color:"white"}}>{progress}</Box>;
};

export default ProgressText;
