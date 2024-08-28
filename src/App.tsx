import './App.css'
import {TransactionChart} from "./components/TransactionChart";
import {useEffect, useState} from "react";
import {getExchangeSymbols} from "./api/getExchangeSymbols";

function App() {
  const [symbols, setExchangeSymbols] = useState<Array<string>>();
  useEffect(() => {
    const getSymbols = async () => {
      const smbls = await getExchangeSymbols();
      setExchangeSymbols(smbls);
    }
    getSymbols();
  })
  return (
      <TransactionChart symbol="BTCUSDT"/>
  )
}

export default App
