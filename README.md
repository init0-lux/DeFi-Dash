# 🚀 DeFi Dashboard

> **MCP-Enabled Multi-Chain DeFi Dashboard for Aya AI Hackathon**

## 📞 Contact Information
- **Primary Contact:** Ojaswi Om
- **Telegram Handle:** @ab_init0
- **Team:** Solo

## 🎯 Project Overview
**Project Title:** MCP-Enabled DeFi Dashboard

**One-Sentence Elevator Pitch:** One dashboard to manage your DeFi, across chains, powered by AI. no code, no tabs, just results.

## 📖 Project Description

The MCP-Enabled DeFi Dashboard represents a comprehensive solution for unified cryptocurrency portfolio management and DeFi protocol interaction across multiple blockchain networks. This project addresses the critical pain point of fragmented DeFi experiences by providing a single, cohesive interface that aggregates wallet balances, tracks DeFi positions, identifies yield opportunities, and simulates token swaps across Ethereum, Polygon, Base, and Arbitrum networks.

At its core, the system leverages the Model Context Protocol (MCP) to create a bridge between traditional web interfaces and AI agent capabilities, enabling seamless integration with AI assistants like Aya. The backend utilizes FastMCP to expose DeFi functionality as JSON-RPC tools, allowing AI agents to programmatically access portfolio data, execute complex DeFi operations, and provide intelligent financial recommendations.

The frontend is built with Next.js and TypeScript, featuring a modern, responsive design using shadcn/ui components. The architecture implements a proxy pattern to handle CORS issues while maintaining clean separation between the presentation layer and blockchain interactions. Real-time data integration connects to multiple APIs including CoinGecko for price feeds, DeFi Llama for yield opportunities, and direct blockchain RPC endpoints for balance queries.

The system supports comprehensive DeFi protocol integration including Aave for lending positions, Uniswap for liquidity provision, and Compound for yield farming. Each tool within the MCP server is designed with enterprise-grade error handling, proper session management, and extensible architecture to accommodate future protocol additions. The dashboard provides users with actionable insights through risk-scored yield opportunities, real-time portfolio valuation, and cross-chain position tracking.

This project demonstrates the potential for AI-driven DeFi management by creating an interface that serves both human users and AI agents through the same underlying infrastructure, ultimately reducing the complexity of multi-chain DeFi operations while maintaining the flexibility required for sophisticated financial strategies.

## 🛠️ Installation Steps

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd defi_dash

# Install Python dependencies
cd mcp_server
pip install fastmcp web3 httpx

# Start MCP server
python dashboard_server.py
```

### Frontend Setup
```bash
# Install Node.js dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Access Application
- Frontend: http://localhost:3000
- MCP Server: http://localhost:8000

## 🔧 Environment Variables

### Backend (.env in mcp_server/)
```bash
# MCP Server Configuration
MCP_SERVER_PORT=8000

# Blockchain RPC Endpoints (Optional - for real data)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
POLYGON_RPC_URL=https://polygon-rpc.com
BASE_RPC_URL=https://mainnet.base.org
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc

# API Keys (Optional - for enhanced features)
COINGECKO_API_KEY=your_coingecko_api_key
DEFILLAMA_API_KEY=your_defillama_api_key
```

### Frontend (.env.local in frontend/)
```bash
# MCP Server URL (defaults to proxy)
NEXT_PUBLIC_MCP_URL=http://localhost:8000/mcp/

# Optional: Direct MCP server URL (if not using proxy)
NEXT_PUBLIC_MCP_DIRECT_URL=http://localhost:8000/mcp/
```

## 📖 Usage Examples

### Web Dashboard Usage
1. **Enter Wallet Addresses**: Paste comma-separated wallet addresses
2. **Use Demo Addresses**: Click random address boxes for testing
3. **Fetch Portfolio**: Click "Portfolio" to get multi-chain balances
4. **View Positions**: Click "Positions" to see DeFi protocol positions
5. **Explore Yields**: Click "Yields" to find yield farming opportunities
6. **Check Prices**: Click "Prices" for real-time token prices

### AI Agent Integration
```bash
# Initialize MCP session
curl -X POST http://localhost:8000/mcp/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "id": 1,
    "params": {
      "protocolVersion": "2025-06-18",
      "capabilities": {},
      "clientInfo": {"name": "ai-agent", "version": "1.0.0"}
    }
  }'

# Get portfolio summary
curl -X POST http://localhost:8000/mcp/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "get_portfolio_summary",
      "arguments": {
        "wallet_addresses": ["0x1234567890abcdef1234567890abcdef12345678"]
      }
    },
    "id": 2
  }'

# Get DeFi positions
curl -X POST http://localhost:8000/mcp/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "mcp-session-id: <session-id>" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "get_defi_positions",
      "arguments": {
        "wallet_address": "0x1234567890abcdef1234567890abcdef12345678"
      }
    },
    "id": 3
  }'
```

### Available MCP Tools
| Tool | Description | Parameters |
|------|-------------|------------|
| `get_token_balance` | Get token balances for a wallet | `wallet_address`, `chain` |
| `get_portfolio_summary` | Aggregate portfolio across chains | `wallet_addresses` |
| `get_defi_positions` | Get DeFi protocol positions | `wallet_address` |
| `get_yield_opportunities` | Find yield farming opportunities | `wallet_address`, `amount` |
| `get_token_prices` | Get real-time token prices | `tokens` |
| `execute_simple_swap` | Simulate token swap | `from_token`, `to_token`, `amount`, `wallet_address` |

## ⚠️ Known Issues

1. **CORS Issues**: The frontend uses a proxy to avoid CORS problems with the MCP server. If direct connection is needed, configure CORS headers in the backend.

2. **Session Management**: MCP sessions may timeout after extended periods. The frontend automatically reinitializes sessions when needed.

3. **Stubbed Data**: Current implementation uses stubbed data for demonstration. Real blockchain integration requires API keys and RPC endpoints.

4. **Network Dependencies**: Real-time data depends on external APIs (CoinGecko, DeFi Llama). Network issues may affect data freshness.

5. **Wallet Validation**: Input validation for wallet addresses is basic. Invalid addresses may cause errors.

6. **Performance**: Large portfolios with many addresses may experience slower loading times.

## 🏗️ Architecture
