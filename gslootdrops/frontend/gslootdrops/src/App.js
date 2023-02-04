import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./App.css";
import { useGuildSagaLootData } from "./hooks/useGuildSagaLootData";
import LootList from "./components/LootList";
import LootTransactionList from "./components/LootTransactionList";
import SearchBarHeader from "./components/SearchBarHeader";
import { Container } from "@mui/material";
import ProgressText from "./components/ProgressText";
import { Box } from "@mui/material";
import { BottomNavigation } from "@mui/material";
import { BottomNavigationAction } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { BorderAllRounded } from "@mui/icons-material";

function App() {
  const [value, setValue] = useState(0);
  const [params] = useSearchParams();
  const { setWallet } = useGuildSagaLootData();

  useEffect(() => {
    console.log("setting wallet:", params.get("address"));
    setWallet(params.get("address"));
  }, []);

  return (
    <div className="App">
      <SearchBarHeader />
      <ProgressText />
      {value === 0 && (
        <Container maxWidth="md" sx={{ 
            padding: "32px",
            //backgroundColor: "green",
            marginTop: "32px",
            marginBottom: "32px",
            //borderRadius: 8
          }}>
          {<LootList />}
        </Container>
      )}
      {value === 1 && (
      <Container sx={{ 
          padding: "32px",
          //marginTop: "32px",
          //marginBottom: "32px",
          //borderRadius: 8,
        }}>
        {<LootTransactionList />}
      </Container>
      )}
      

      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          console.log("change!", newValue)
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Items" icon={<SearchIcon />} />
        <BottomNavigationAction label="Transactions" icon={<SearchIcon />} />
      </BottomNavigation>
    </div>
  );
}

export default App;
