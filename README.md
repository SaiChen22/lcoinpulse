# CoinPulse - Cryptocurrency Market Intelligence Platform

A modern, real-time cryptocurrency market tracking platform built with Next.js 16, React 19, and TypeScript. CoinPulse provides live market data, detailed coin analytics, interactive charts, and portfolio tracking using the CoinGecko API.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square&logo=tailwind-css)

## 🎯 Features

- **Live Market Data**: Real-time cryptocurrency prices and market information
- **Detailed Coin Analytics**: Comprehensive coin details including market cap, volume, and historical data
- **Interactive Charts**: Lightweight, high-performance candlestick charts using `lightweight-charts`
- **Market Categories**: Browse cryptocurrencies by category
- **Trending Coins**: Discover trending coins with real-time price changes
- **Coin Converter**: Convert between cryptocurrencies and fiat currencies
- **Responsive Design**: Mobile-first UI built with Tailwind CSS
- **Rate Limit Handling**: Smart caching and retry mechanisms for API reliability
- **Server-Side Rendering**: Fast initial page loads with Next.js SSR
- **Streaming Data**: Real-time updates via WebSocket connections

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm, pnpm, or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lcoinpulse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# CoinGecko API Configuration
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3/
COINGECKO_API_KEY=your_api_key_here

# WebSocket Configuration (public, safe to expose)
NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL=wss://stream.coingecko.com/v1
NEXT_PUBLIC_COINGECKO_API_KEY=your_public_api_key_here
```

Get your free API key from [CoinGecko](https://www.coingecko.com/en/api).

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
lcoinpulse/
├── app/
│   ├── coins/
│   │   └── [id]/
│   │       └── page.tsx          # Coin details page with live data
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page with market overview
├── components/
│   ├── home/
│   │   ├── Categories.tsx        # Market categories component
│   │   ├── CoinOverView.tsx      # Market overview statistics
│   │   ├── TrendingCoins.tsx     # Trending cryptocurrencies
│   │   └── fallback.tsx          # Suspense fallback UI
│   ├── ui/                       # Reusable UI components (Radix UI)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── pagination.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   └── table.tsx
│   ├── CandlestickChart.tsx      # Interactive candlestick chart
│   ├── CoinHeader.tsx            # Coin detail header
│   ├── Converter.tsx             # Crypto-to-fiat converter
│   ├── DataTable.tsx             # Reusable data table
│   ├── Header.tsx                # Navigation header
│   ├── LiveDataWrapper.tsx       # Real-time data container
│   └── CoinPagination.tsx        # Pagination controls
├── hooks/
│   └── useCoinGeckoWebSocket.ts  # WebSocket streaming hook with caching
├── lib/
│   ├── coingecko.actions.ts      # Server actions for API calls
│   └── utils.ts                  # Utility functions
├── public/
│   └── assets/                   # Static assets
├── constants.ts                  # Application constants
├── type.d.ts                     # TypeScript type definitions
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 16**: Server-side rendering and static generation
- **React 19**: UI component library
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Headless component primitives
- **Lucide React**: Beautiful icon library

### Data Visualization
- **lightweight-charts**: High-performance financial charting

### API & Data
- **CoinGecko API**: Real-time cryptocurrency data
- **WebSocket**: Live price streaming

### Development
- **ESLint**: Code quality and linting
- **PostCSS 4**: CSS processing with Tailwind

## 📊 Key Components

### CandlestickChart
Interactive candlestick chart component with multiple time periods (daily, weekly, monthly, etc.)

**Location**: `components/CandlestickChart.tsx`

### LiveDataWrapper
Real-time data streaming container that polls the CoinGecko API with intelligent rate-limit handling.

**Location**: `components/LiveDataWrapper.tsx`

**Features**:
- 5-minute cache TTL to minimize API requests
- Automatic 60-second backoff on rate limits (429)
- Graceful fallback to cached data when rate-limited
- 5-minute polling interval (minimum)

### Converter
Currency converter component for converting between cryptocurrencies and fiat currencies.

**Location**: `components/Converter.tsx`

## 🔌 API Integration

### Server Actions
All API calls are handled through server actions for security and performance:

- `fetcher<T>()`: Generic fetch wrapper with error handling
- `getPools()`: Fetch DeFi pool data
- Query string handling with `query-string`

**Location**: `lib/coingecko.actions.ts`

### WebSocket Hook
Custom React hook for real-time cryptocurrency data with intelligent caching:

```typescript
const { price, trades, ohlcv, isConnected } = useCoinGeckoWebSocket({
  coinId: 'bitcoin',
  poolId: 'pool-id',
  liveInterval: '1m'
});
```

**Location**: `hooks/useCoinGeckoWebSocket.ts`

## ⚡ Performance Optimizations

1. **Rate Limit Handling**: Smart cache with 5-minute TTL and automatic retry with exponential backoff
2. **Server-Side Rendering**: Fast initial page loads with Next.js SSR
3. **Image Optimization**: Next.js Image component for automatic optimization
4. **Code Splitting**: Automatic code splitting with Next.js
5. **Lazy Loading**: Suspense boundaries for progressive content loading
6. **Minimal Dependencies**: Lightweight UI library and charting library

## 🔐 Security Considerations

- **Environment Variables**: API keys stored securely in `.env.local`
- **Server Actions**: Sensitive operations run on the server only
- **Link Security**: External links include `rel="noopener noreferrer"`
- **URL Encoding**: Proper encoding of user input in API routes
- **Type Safety**: TypeScript prevents many runtime errors

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `COINGECKO_BASE_URL` | CoinGecko API base URL | Yes |
| `COINGECKO_API_KEY` | CoinGecko API key (private) | Yes |
| `NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL` | WebSocket URL (public) | No |
| `NEXT_PUBLIC_COINGECKO_API_KEY` | Public API key | No |

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit your changes: `git commit -m 'Add amazing feature'`
3. Push to the branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### API Rate Limiting (429 Errors)

The application implements intelligent rate-limit handling:

- **Automatic Caching**: 5-minute cache TTL for all API responses
- **Smart Backoff**: Automatic 60-second wait on rate limits
- **Graceful Degradation**: Falls back to cached data when rate-limited

If you continue to experience rate limits:

1. Upgrade your CoinGecko API plan
2. Reduce polling frequency by modifying the `liveInterval` prop
3. Check your API key in `.env.local`

### Build Errors

If you encounter build errors:

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules .next
npm install
npm run build
```

### Port Already in Use

If port 3000 is already in use:

```bash
npm run dev -- -p 3001
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CoinGecko API Documentation](https://www.coingecko.com/en/api/documentation)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)

## 🎉 Acknowledgments

- [CoinGecko](https://www.coingecko.com) for the cryptocurrency data API
- [Vercel](https://vercel.com) for Next.js
- [Radix UI](https://www.radix-ui.com) for accessible component primitives
- [Tailwind Labs](https://tailwindlabs.com) for Tailwind CSS

---

Made with ❤️ by the CoinPulse team
