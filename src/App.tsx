import './App.css'
import {TransactionChart} from "./components/TransactionChart";
import {useEffect, useState} from "react";
import {getExchangeSymbols} from "./api/getExchangeSymbols";
import {Autocomplete, TextField} from "@mui/material";

function App() {
  const [symbols, setExchangeSymbols] = useState<Array<string>>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>();
  useEffect(() => {
    const getSymbols = async () => {
      const smbls = await getExchangeSymbols();
      setExchangeSymbols(smbls);
    }
    getSymbols();
  }, []);
  return (
      <>
        <Autocomplete
            onChange={(_, value) => setSelectedSymbol(value!)}
            disablePortal
            options={symbols}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Select currency pair" />}
        />
      <TransactionChart symbol={selectedSymbol || 'BTCUSDT'}/>
        </>
  )
}

export default App
