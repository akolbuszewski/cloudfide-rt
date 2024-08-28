import axios from "axios";

export async function getExchangeSymbols(): Promise<Array<string>>{
    const res = await axios.get<{symbols: Array<{symbol: string}>}>('https://api.binance.com/api/v3/exchangeInfo');
    return res.data.symbols.map(s => s.symbol);
}