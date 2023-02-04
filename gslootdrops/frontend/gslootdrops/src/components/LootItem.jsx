import { useState } from "react";
import { Grid, Typography } from "@mui/material";
import useLootMetadata from "../hooks/useLootMetadata";
import { Popover, Container, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

const LootItem = ({ itemData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [metadata] = useLootMetadata(itemData.mint);

  if (!metadata)
    return (<CircularProgress />);

  const [itemQuality] = metadata.json.attributes?.filter(x => x.trait_type === "Item Quality").map(x => x.value);
  const [itemType] = metadata.json.attributes?.filter(x => x.trait_type === "Type").map(x => x.value);
  const [itemSlot] = metadata.json.attributes?.filter(x => x.trait_type === "Slot").map(x => x.value);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handlePopoverClose = (event) => {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);

  let textColor = "grey"
  if (itemQuality === "Uncommon")
  {
    textColor = '#1eff00';
  }
  else if (itemQuality === "Rare")
  {
    textColor = '#0070dd';
  }
  else if (itemQuality === "Epic")
  {
    textColor = '#a335ee';
  }
  else if (itemQuality === "Unique")
  {
    textColor = '#ff0000';
  }
  else if (itemQuality === "Ancient")
  {
    textColor = '#ff8000';
  }

  if (metadata.json) {
    return (
      <Grid item>
        <img
          src={metadata.json.image}
          alt={metadata.json.name}
          width={64}
          height={64}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        />

        <Popover
          id="mouse-over-popover"
          sx={{ 
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
          >
            <Box maxWidth={400}  
              sx={{
                color: "lightgray",
                backgroundColor: 'rgba(52, 52, 152, 0.95)',
                borderWidth: 4,
                borderStyle: "groove",
                borderColor: "lightgray",
                fontFamily: "RhymeExtended",
              }}>
              <Box sx={{backgroundColor:"#111155"}}>
                <Typography variant="h5" color={textColor}  sx={{ p:1 }}>{metadata.json.name} x {itemData.amount}</Typography>
              </Box>
              <Typography sx={{ p:1 }}>{metadata.json.description.replaceAll('\\n', '\n')}</Typography>
              <Typography sx={{ p:1 }}>{itemType}</Typography>
            </Box>
          </Popover>

      </Grid>

    );
  }

  return <Grid item><div className="lds-spinner"/></Grid>;
};

export default LootItem;
