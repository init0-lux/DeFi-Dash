# 🚀 DeFi Dashboard

> **MCP-Enabled Multi-Chain DeFi Dashboard for Aya AI Hackathon**

A unified dashboard that aggregates wallet balances, DeFi positions, and yield opportunities across multiple blockchains, exposing all functionality via MCP (Model Context Protocol) for seamless AI integration.

![DeFi Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## ✨ Features

- **🔗 Multi-Chain Support** - Ethereum, Polygon, Base, Arbitrum
- **�� Real-Time Balances** - Native tokens and ERC-20 balances
- **�� DeFi Positions** - Aave, Uniswap, Compound integrations
- **📈 Yield Opportunities** - Risk-scored yield farming options
- **🤖 AI-Ready** - MCP server for AI agent integration
- **🎨 Modern UI** - Clean, responsive dashboard with shadcn/ui
- **⚡ Real-Time Data** - Live price feeds and position updates


## 🛠️ Tech Stack

### Backend
- **FastMCP** - MCP server framework
- **Python 3.8+** - Core logic
- **Web3.py** - Blockchain interactions
- **httpx** - Async HTTP client

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling

### APIs & Services
- **Infura/Alchemy** - Ethereum RPC
- **CoinGecko** - Price feeds
- **DeFi Llama** - Yield data
- **Aave/Uniswap** - Protocol data

## �� Quick Start

### 1. Clone & Setup
```bash
git clone <repository-url>
cd defi_dash
```

### 2. Backend Setup
```bash
cd mcp_server
pip install -r requirements.txt
python dashboard_server.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access Dashboard
Open [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### For Users
1. **Enter Wallet Addresses** - Paste comma-separated addresses
2. **Click Random Addresses** - Use demo addresses for testing
3. **Fetch Data** - Click buttons to load portfolio, positions, yields
4. **View Results** - Real-time data in clean tables and cards

### For AI Agents
```bash
# Initialize MCP session
curl -X POST http://localhost:8000/mcp/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc": "2.0", "method": "initialize", "id": 1, "params": {...}}'

# Get portfolio summary
curl -X POST http://localhost:8000/mcp/ \
  -H "mcp-session-id: <session-id>" \
  -d '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "get_portfolio_summary", "arguments": {"wallet_addresses": ["0x..."]}}, "id": 2}'
```

## 🔧 MCP Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `get_token_balance` | Get token balances | `wallet_address`, `chain` |
| `get_portfolio_summary` | Aggregate portfolio | `wallet_addresses` |
| `get_defi_positions` | DeFi positions | `wallet_address` |
| `get_yield_opportunities` | Yield farming | `wallet_address`, `amount` |
| `get_token_prices` | Price feeds | `tokens` |
| `execute_simple_swap` | Swap simulation | `from_token`, `to_token`, `amount` |

## 🎯 Project Goals

- **Unified Experience** - One dashboard for all DeFi operations
- **AI Integration** - Seamless MCP tool access for AI agents
- **Multi-Chain** - Support for major L1/L2 networks
- **Real-Time Data** - Live blockchain and DeFi protocol data
- **Enterprise Ready** - Production-grade code and architecture

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Built for the Aya AI Hackathon** 🎉  
*Empowering AI agents to interact with DeFi protocols*
