// if needed can be changed to be taken from .env file
import axios from "axios";

const TRADES_URL = 'https://api.binance.com/api/v3/trades';

export interface TradeData {
    id: number;
    price: string;
    qty: string;
    time: number;
    isBuyerMaker: boolean;
    isBestMatch: boolean;
}
export async function getBinanceTradesList(symbol: string) {
    const res = await axios.get<Array<TradeData>>(TRADES_URL, {params: { symbol }});
    return res.data;
}