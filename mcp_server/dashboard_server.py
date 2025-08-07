from fastmcp import FastMCP
import os
from typing import List, Dict

mcp = FastMCP("DeFi_Dashboard_Server")

SUPPORTED_CHAINS = {
    "ethereum": {
        "native": "ETH",
        "tokens": ["ETH", "USDC"],
    },
    "polygon": {
        "native": "MATIC",
        "tokens": ["MATIC", "USDC"],
    },
    "base": {
        "native": "ETH",
        "tokens": ["ETH", "USDC"],
    },
    "arbitrum": {
        "native": "ETH",
        "tokens": ["ETH", "USDC"],
    },
}

# Stubbed balances for demo purposes
STUB_BALANCES = {
    "ethereum": {"ETH": "2.5", "USDC": "1250.0"},
    "polygon": {"MATIC": "1000.0", "USDC": "500.0"},
    "base": {"ETH": "0.8", "USDC": "200.0"},
    "arbitrum": {"ETH": "1.2", "USDC": "300.0"},
}

def _get_token_balance(wallet_address: str, chain: str = "ethereum") -> Dict[str, str]:
    """Return native and USDC balances of a wallet address on a specific chain (stubbed)."""
    chain = chain.lower()
    if chain not in SUPPORTED_CHAINS:
        return {"error": f"Unsupported chain. Supported: {', '.join(SUPPORTED_CHAINS.keys())}"}
    # In real implementation, fetch from RPC or API using wallet_address
    return STUB_BALANCES[chain]

get_token_balance = mcp.tool()(_get_token_balance)

@mcp.tool()
def get_portfolio_summary(wallet_addresses: List[str]) -> Dict:
    """Aggregate balances across all supported chains for each wallet (stubbed)."""
    total_usd = 0.0
    positions = []
    chains = list(SUPPORTED_CHAINS.keys())
    # Stubbed prices for demo
    PRICES = {"ETH": 3000, "USDC": 1, "MATIC": 1.5}
    print(wallet_addresses)
    for addr in wallet_addresses:
        chain_balances = {}
        usd_value = 0.0
        for chain in chains:
            bal = _get_token_balance(addr, chain)
            chain_balances[chain] = bal
            # Calculate USD value (stubbed)
            for token, amount in bal.items():
                if token in PRICES:
                    usd_value += float(amount) * PRICES[token]
        positions.append({
            "address": addr,
            "balances": chain_balances,
            "usd_value": f"{usd_value:.2f}"
        })
        total_usd += usd_value
    return {
        "total_portfolio_value": f"{total_usd:.2f}",
        "positions": positions,
        "chains": chains
    }

@mcp.tool()
def get_defi_positions(wallet_address: str) -> Dict:
    """Return detailed DeFi positions for a wallet (stubbed)."""
    return {
        "total_positions": 2,
        "protocols": ["Aave", "Uniswap"],
        "positions": [
            {
                "protocol": "Aave",
                "type": "lending",
                "asset": "USDC",
                "amount": "500.0",
                "apy": "3.2"
            },
            {
                "protocol": "Uniswap",
                "type": "lp",
                "pair": "ETH/USDC",
                "amount": "1.0 ETH + 1800 USDC",
                "apy": "7.1"
            }
        ]
    }

@mcp.tool()
def get_yield_opportunities(wallet_address: str, amount: float) -> list:
    """Return a sorted list of top yield opportunities (stubbed)."""
    return [
        {"protocol": "Aave", "apy": "3.2", "risk_score": 2.1, "estimated_monthly": 1.33 * amount},
        {"protocol": "Uniswap", "apy": "7.1", "risk_score": 3.5, "estimated_monthly": 2.95 * amount},
        {"protocol": "Compound", "apy": "2.8", "risk_score": 1.9, "estimated_monthly": 1.12 * amount}
    ]

@mcp.tool()
def execute_simple_swap(from_token: str, to_token: str, amount: str, wallet_address: str) -> Dict:
    """Simulate a token swap and return swap preview (stubbed)."""
    return {
        "status": "success",
        "from": {"token": from_token, "amount": amount},
        "to": {"token": to_token, "amount": str(float(amount) * 0.98)},
        "gas_estimate": "0.002 ETH",
        "transaction_hash": "0xdeadbeef...stubbed"
    }

@mcp.tool()
def get_token_prices(tokens: list) -> Dict[str, dict]:
    """Return current USD prices for tokens (stubbed)."""
    prices = {"ETH": {"usd": 3000.0}, "USDC": {"usd": 1.0}, "MATIC": {"usd": 1.5}}
    return {token: prices.get(token, {"usd": 0.0}) for token in tokens}

if __name__ == "__main__":
    port = int(os.getenv("MCP_SERVER_PORT", "8000"))
    mcp.run(transport="http", host="0.0.0.0", port=port)
