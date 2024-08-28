import {BinanceSocketData} from "../hooks/useBinanceTradeData";
import {TradeData} from "../api/getBinanceTradesList";

export const mapToTradeData = (socketData: BinanceSocketData): TradeData =>  ({
    id: socketData.a,
    price: socketData.p,
    qty: socketData.q,
    time: socketData.T,
})