import {FC} from "react";
import {useBinanceTradeData} from "../hooks/useBinanceTradeData";
import ReactEcharts from 'echarts-for-react'
export interface TransactionChartProps {
    symbol: string;
}
export const TransactionChart: FC<TransactionChartProps> = ({symbol}) => {
    const tradeData = useBinanceTradeData('BTCUSDT')
    if(!tradeData){
        return null;
    }

    const {min, max} = tradeData.reduce(({min, max}, dt) => {
        const price = parseInt(dt.price)
        if( min > price) {
            min = parseInt(dt.price)
        } else if (max < price){
            max = price;
        }
        return {min ,max};
    }, {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY})

    const getOption = () => ({
        title: {
            text: `${symbol} Transaction Data`,
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
            },
        },
        xAxis: {
            type: 'category',
            data: tradeData.map(item => new Date(item.time).toLocaleString()), // X-axis data (time)
        },
        yAxis: {
            min: min * 0.9999,
            max: max * 1.0001,
            type: 'value',
        },
        series: [
            {
                name: 'Price',
                type: 'line',
                data: tradeData.map(item => item.price),
                smooth: true,
                lineStyle: {
                    color: '#5470C6',
                },
            },
        ],
    });



    return (
        <ReactEcharts
            option={getOption()} // Pass the option to the chart
            style={{ height: '400px', width: '500px' }} // Chart dimensions
            notMerge={true} // To ensure that the data updates correctly
            lazyUpdate={true} // Performance optimization for updating the chart
            theme={'light'} // Theme for the chart
        />
    );
}