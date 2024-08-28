import {useEffect, useState} from "react";
import {getBinanceTradesList, TradeData} from "../api/getBinanceTradesList";
import SocketClient from "../lib/socketClient";
import {mapToTradeData} from "../lib/mapToTradeData";



export interface BinanceSocketData {
    "e": string;    // Event type
    "E": number; // Event time
    "s": symbol;      // Symbol
    "a": number;         // Aggregate trade ID
    "p": string;       // Price
    "q": string;        // Quantity
    "f": number;           // First trade ID
    "l": 105,           // Last trade ID
    "T": number; // Trade time
    "m": boolean;          // Is the buyer the market maker?
    "M": boolean;       // Ignore
}

export const useBinanceTradeData = (symbol: string) => {
    const [tradeData, setTradeData] = useState<Array<TradeData>>([]);
    useEffect(() =>{
        const streamName = `${symbol.toLowerCase()}@trade`;

        const socketClient = new SocketClient(`ws/${streamName}`, 'wss://stream.binance.com:9443/');

        const getTradeData = async () => {
            const data = await getBinanceTradesList(symbol);
            setTradeData(data);
            socketClient.setHandler(symbol, (params: BinanceSocketData) => {
                setTradeData((td) => [...td, mapToTradeData(params)])
            });
        };
        getTradeData();
        () => {
            socketClient.removeHandler(symbol);
        }
        //const interval = setInterval(getTradeData, 100);
    }, [symbol]);

    return tradeData;
}