import { Separator } from '@radix-ui/react-separator'
import CandlestickChart from '@/components/CandlestickChart'
import React from 'react'
import CoinHeader from './CoinHeader'

const LiveDataWrapper = ({ coinId, coinOHLCData, poolId, coin, children }: LiveDataProps) => {
    return (
        <section id="live-data-wrapper">
            <CoinHeader name={coin.name} image={coin.image.large}
                livePrice={coin.market_data.current_price.usd}
                livePriceChangePercentage24h={coin.market_data.price_change_percentage_24h_in_currency.usd}
                priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
                priceChange24h={coin.market_data.price_change_24h_in_currency.usd} />
            <Separator className='divider' />
            <div className="trend">
                <CandlestickChart coinId={coinId} data={coinOHLCData} >
                    <h4> Trend Overview</h4>
                </CandlestickChart>
            </div>
            <Separator className='divider' />

        </section>
    )
}

export default LiveDataWrapper