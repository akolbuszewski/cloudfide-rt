import {useEffect, useState} from "react";
import {getBinanceTradesList, TradeData} from "../api/getBinanceTradesList";

export const useBinanceTradeData = (symbol: string) => {
    const [tradeData, setTradeData] = useState<Array<TradeData>>();
    useEffect(() =>{
        const getTradeData = async () => {
            const data = await getBinanceTradesList(symbol);
            setTradeData(data);
        };
        getTradeData();

        // todo: setInterval
    }, [symbol]);

    return tradeData;
}