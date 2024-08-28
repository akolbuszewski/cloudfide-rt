import {useEffect, useRef, useState} from "react";
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
    const [errors, setErrors] = useState<Array<string>>([]);
    const socketRef = useRef<SocketClient>();

    useEffect(() => {
        socketRef.current?.removeHandler(symbol);

        const streamName = `${symbol.toLowerCase()}@trade`;

        socketRef.current = new SocketClient(`ws/${streamName}`, 'wss://stream.binance.com:9443/', (e) => setErrors((errs => [...errs, e])));

        const getTradeData = async () => {
            try {
                const data = await getBinanceTradesList(symbol);
                setTradeData(data);
                socketRef.current?.setHandler(symbol, (params: BinanceSocketData) => {
                    setTradeData((td) => [...td, mapToTradeData(params)])
                });
            } catch (e) {
                //tutaj moglibysmy bardziej przyjrzec sie jakie blędy lecą
                setErrors(errs => [...errs, (e as Error).message]);
            }
        };
        getTradeData();
        return () => {
            socketRef.current?.removeHandler(symbol);
        }
    }, [symbol]);

    return {tradeData, errors};
}