import {useEffect, useState} from "react";
import {getBinanceTradesList, TradeData} from "../api/getBinanceTradesList";
import SocketClient from "../lib/socketClient";

const streamName = 'btcusdt@trade';

const socketClient = new SocketClient(`ws/${streamName}`, 'wss://stream.binance.com:9443/');
socketClient.setHandler('trade', (params: any) => {
    const current = +new Date;
    const TvsNow = current - params.T;
    const EvsNow = current - params.E;
    const EvsT = params.E - params.T;
    console.log(`[Spot ${streamName}] current:${current} delta TvsNow: ${TvsNow}, EvsNow: ${EvsNow}, EvsT: ${EvsT}`);
});

export const useBinanceTradeData = (symbol: string) => {
    const [tradeData, setTradeData] = useState<Array<TradeData>>([]);
    useEffect(() =>{
        const getTradeData = async () => {
            const data = await getBinanceTradesList(symbol);
            setTradeData(dt =>  [...dt, ...data]);
        };
        getTradeData();

        //const interval = setInterval(getTradeData, 100);
    }, [symbol]);

    return tradeData;
}