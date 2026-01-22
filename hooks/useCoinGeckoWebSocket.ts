'use client';

import { useMemo, useRef, useState, useEffect } from 'react';

// Cache with TTL to avoid repeated requests
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 300000; // 5 minutes - respect rate limits
const rateLimitResetTime = new Map<string, number>(); // Track when we can retry

const getCachedOrFetch = async (url: string, signal?: AbortSignal) => {
    const now = Date.now();
    const cached = apiCache.get(url);
    
    // Return cached data if still valid
    if (cached && (now - cached.timestamp) < CACHE_TTL_MS) {
        return cached.data;
    }
    
    // Check if we're currently rate limited
    const resetTime = rateLimitResetTime.get(url);
    if (resetTime && now < resetTime) {
        if (cached) {
            // Return stale cache if we're rate limited
            return cached.data;
        }
        throw new Error('Rate limited - please try again later');
    }
    
    try {
        const response = await fetch(url, { signal });
        
        // Handle rate limiting (429)
        if (response.status === 429) {
            // Set retry time to 60 seconds from now
            rateLimitResetTime.set(url, now + 60000);
            
            if (cached) {
                // Return stale cache if available
                return cached.data;
            }
            throw new Error('API rate limited (429)');
        }
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        // Cache the result and clear rate limit
        apiCache.set(url, { data, timestamp: now });
        rateLimitResetTime.delete(url);
        return data;
    } catch (error) {
        throw error;
    }
};

export const useCoinGeckoWebSocket = ({ coinId, poolId, liveInterval }: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {

    const [price, setPrice] = useState<ExtendedPriceData | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const timerRef = useRef<number | null>(null);
    const lastPollRef = useRef<number>(0);

    useEffect(() => {
        if (!coinId) return;

        let aborted = false;
        const controller = new AbortController();

        const poll = async () => {
            // Prevent overlapping requests - ensure at least 10 seconds between polls
            const now = Date.now();
            if (now - lastPollRef.current < 10000) {
                return;
            }
            lastPollRef.current = now;

            try {
                // 1) price + market data
                const marketsUrl =
                    `/api/coingecko/coins/markets?vs_currency=usd&ids=${encodeURIComponent(coinId)}`;

                // 2) OHLC（返回数组：[timestamp, open, high, low, close]）
                const ohlcUrl =
                    `/api/coingecko/coins/${encodeURIComponent(coinId)}/ohlc?vs_currency=usd&days=1`;

                // 3) market_chart（用来模拟"最近价格点"当 trades）
                const chartUrl =
                    `/api/coingecko/coins/${encodeURIComponent(coinId)}/market_chart?vs_currency=usd&days=1`;
                
                const [marketsJson, ohlcJson, chartJson] = await Promise.all([
                    getCachedOrFetch(marketsUrl, controller.signal),
                    getCachedOrFetch(ohlcUrl, controller.signal),
                    getCachedOrFetch(chartUrl, controller.signal),
                ]);

                // Verify responses are valid
                if (!Array.isArray(marketsJson)) throw new Error('Invalid markets response');
                if (!Array.isArray(ohlcJson)) throw new Error('Invalid ohlc response');
                if (!chartJson?.prices) throw new Error('Invalid chart response');

                if (aborted) return;

                const m = marketsJson?.[0];
                if (m) {
                    setPrice({
                        usd: m.current_price ?? 0,
                        coin: coinId,
                        price: m.current_price ?? 0,
                        change24h: m.price_change_percentage_24h ?? 0,
                        marketCap: m.market_cap ?? 0,
                        volume24h: m.total_volume ?? 0,
                        timestamp: Date.now(),
                    });
                } else {
                    setPrice(null);
                }

                // 取最新一根 OHLC
                const lastCandle = ohlcJson?.[ohlcJson.length - 1];
                if (lastCandle?.length >= 5) {
                    setOhlcv([
                        Number(lastCandle[0]),
                        Number(lastCandle[1]),
                        Number(lastCandle[2]),
                        Number(lastCandle[3]),
                        Number(lastCandle[4]),
                    ]);
                } else {
                    setOhlcv(null);
                }

                // 用 prices 点位模拟“最近交易”（仅替代方案）
                const prices: [number, number][] = chartJson?.prices ?? [];
                const recent = prices.slice(-7).reverse();

                setTrades(
                    recent.map(([t, p]) => ({
                        price: p,
                        value: p,        // 这里没法得到真实成交额，只能占位
                        timestamp: t,
                        type: 'unknown', // 无法判断 buy/sell
                        amount: 0,
                    }))
                );

                setIsConnected(true);
            } catch (e) {
                if (!aborted) {
                    setIsConnected(false);
                }
            }
        };

        // IMPORTANT: Don't poll immediately on mount to avoid rate limiting
        // The server-side data fetched on page load is sufficient
        // Only poll after a long delay, and at a very infrequent interval
        
        let hasInitialData = false;
        
        const pollTimer = setTimeout(() => {
            // Only start polling if component is still mounted
            if (!aborted) {
                hasInitialData = true;
                poll();
            }
        }, 15000); // Wait 15 seconds before first poll

        // Set up VERY infrequent polling interval (5 minutes)
        // The CoinGecko demo API has strict rate limits
        const intervalMs = 300000; // 5 minutes between polls
        timerRef.current = window.setInterval(() => {
            if (hasInitialData && !aborted) {
                poll();
            }
        }, intervalMs) as unknown as number;

        return () => {
            aborted = true;
            controller.abort();
            clearTimeout(pollTimer);
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [coinId, liveInterval]);

    return {
        price,
        trades,
        ohlcv,
        isConnected,
    };
};

