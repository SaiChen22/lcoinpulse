'use client'
import { getCandlestickConfig, getChartConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from '@/constants'
import { CandlestickSeries, IChartApi, ISeriesApi } from 'lightweight-charts'
import { fetcher } from '@/lib/coingecko.actions'
import React, { useEffect } from 'react'

import { createChart } from 'lightweight-charts'
import { convertOHLCData } from '@/lib/utils'

const CandlestickChart = ({ children, data, coinId, height = 360, initialPeriod = 'daily'}: CandlestickChartProps) => {
	const chartContainerRef = React.useRef<HTMLDivElement | null>(null)
	const chartRef = React.useRef<IChartApi>(null)
	const candleSeriesRef = React.useRef<ISeriesApi<'Candlestick'>>(null)

	const [period, setPeriod] = React.useState<Period>(initialPeriod)
	const [ohlcData, setOhlcData] = React.useState<OHLCData[]>(data ?? [])
	const [loading, setLoading] = React.useState(false)
	const [isPending, startTransition] = React.useTransition()

	const fetchOhlcData = async (selectedPeriod: Period) => {
		try {
			setLoading(true)
			const { days, interval } = PERIOD_CONFIG[selectedPeriod];

			const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
				vs_currency: 'usd',
				days,
				precision: 'full',
			})

			setOhlcData(newData ?? []);
		}
		catch (error) {
			console.error('Error fetching OHLC data:', error);
		}
		finally {
			setLoading(false)
		}
	}

	const handlePeriodChange = (newPeriod: Period) => {
		if (newPeriod === period) return;

		startTransition(async () => {
			setPeriod(newPeriod);
			await fetchOhlcData(newPeriod);
		})
	}

	useEffect(() => {
		const container = chartContainerRef.current;
		if (!container) return;

		const showTime = ['daily', 'weekly', 'monthly'].includes(period);
		const chart = createChart(container, {
			...getChartConfig(height, showTime),
			width: container.clientWidth,
		});

		const series = chart.addSeries(CandlestickSeries, getCandlestickConfig())
		series.setData(convertOHLCData(ohlcData));
		chart.timeScale().fitContent();

		chartRef.current = chart;
		candleSeriesRef.current = series;

		const observer = new ResizeObserver((entries) => {
			if (entries.length === 0) return;
			chart.applyOptions({ width: entries[0].contentRect.width })
		});

		observer.observe(container);

		return () => {
			observer.unobserve(container);
			observer.disconnect();
			chart.remove();

			chartRef.current = null;
			candleSeriesRef.current = null;
		}

	}, [height, period])

	useEffect(() => {
		if (!chartRef.current || !candleSeriesRef.current) return;

		const showTime = ['daily', 'weekly', 'monthly'].includes(period);
		chartRef.current.timeScale().applyOptions({ timeVisible: showTime });

	}, [period])

	useEffect(() => {
		if (!candleSeriesRef.current) return;

		const converted = convertOHLCData(ohlcData)
		candleSeriesRef.current.setData(converted);
		chartRef.current?.timeScale().fitContent();

	}, [ohlcData])


	return (
		<div id="candlestick-chart">
			<div className='chart-header'>
				<div className='flex-1'>
					{children}
				</div>

				<div className='button-group'>
					<span className='text-sm mx-2 font-medium text-purple-100/50'>
						Period:
					</span>
					{
						PERIOD_BUTTONS.map(({ value, label }) => (
							<button key={value} className={period === value ? 'config-button-active' : 'config-button'}
								onClick={() => handlePeriodChange(value)} disabled={loading}>{label}</button>

						))
					}
				</div>
			</div>
			<div ref={chartContainerRef} className='chart' style={{ height }} />

		</div>

	)
}

export default CandlestickChart