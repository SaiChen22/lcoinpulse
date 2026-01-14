import React from 'react'
import { fetcher } from '@/lib/coingecko.actions'
import { cn, formatCurrency } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import DataTable from '@/components/DataTable'

const TrendingCoins = async () => {
    const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>('/search/trending', undefined, 300);
    const columns: DataTableColumn<TrendingCoin>[] = [
        {
            header: 'Name',
            cellClassName: 'name-cell',
            cell: (coin) => {
                const item = coin.item
                return (
                    <Link href={`/coins/${item.id}`} >
                        <Image src={item.large} alt={item.name} width={36} height={36} />
                        <p> {item.name}</p>
                    </Link>
                )
            },
        },
        {
            header: '24h Change',
            cellClassName: 'change-cell',
            cell: (coin) => {
                const item = coin?.item;
                const pct = item?.data?.price_change_percentage_24h?.usd;
                
                if (pct === null || pct === undefined) {
                    return <div className="price-change">—</div>;
                }
                
                const isTrendingUp = pct > 0;
                return (
                    <div className={cn('price-change', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
                        <p>
                            {pct.toFixed(2)}%
                            {isTrendingUp ? (
                                <TrendingUp width={16} height={16} />
                            ) :
                                <TrendingDown width={16} height={16} />
                            }
                        </p>
                    </div>
                )
            }
        },
        {
            header: 'Price',
            cellClassName: 'price-cell',
            cell: (coin) => {
                const price = coin?.item?.data?.price;
                if (price === null || price === undefined || isNaN(price)) {
                    return '-';
                }
                return formatCurrency(price);
            }
        },

    ]

    return (
        <div id='trending-coins'>
            <p>Trending Coins</p>
            <DataTable
                columns={columns}
                data={trendingCoins.coins.slice(0, 6)|| []}
                rowKey={(coin) => coin.item.id}
                tableClassName='trending-coins-table'
                headerCellClassName='py-3!'
                bodyCellClassName='py-2'
            />
        </div>
    )
}

export default TrendingCoins