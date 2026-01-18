import Categories from '@/components/home/Categories'
import CoinOverView from '@/components/home/CoinOverView'
import TrendingCoins from '@/components/home/TrendingCoins'
import { CategoriesFallback, CoinOverviewFallback, TrendingCoinsFallback } from '@/components/home/fallback'
import { Suspense } from 'react'

const Page = async () => {

	return (
		<main className="main-container">
			<section className="home-grid">
				<Suspense fallback={<CoinOverviewFallback />}>
					<CoinOverView />
				</Suspense>

				<Suspense fallback={<TrendingCoinsFallback />}>
					<TrendingCoins />
				</Suspense>


			</section>

			<section className='w-full mt-7 space-y-4'>
				<Suspense fallback={<CategoriesFallback />}>
					<Categories />
				</Suspense>
			</section>
		</main>
	)
}

export default Page