"use client";
import { useState, useCallback, useMemo } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Skeleton } from "../components/ui/skeleton";

// Types
interface PortfolioPosition {
  address: string;
  balances: Record<string, Record<string, string>>;
  usd_value: string;
}

interface PortfolioSummary {
  total_portfolio_value: string;
  positions: PortfolioPosition[];
  chains: string[];
}

interface DeFiPosition {
  protocol: string;
  type: string;
  asset?: string;
  pair?: string;
  amount: string;
  apy: string;
}

interface DeFiPositions {
  total_positions: number;
  protocols: string[];
  positions: DeFiPosition[];
}

interface YieldOpportunity {
  protocol: string;
  apy: string;
  risk_score: number;
  estimated_monthly: number;
}

interface TokenPrice {
  usd: number;
}

interface TokenPrices {
  [token: string]: TokenPrice;
}

interface MCPResponse<T> {
  jsonrpc: string;
  id: number;
  result?: {
    structuredContent?: T;
    content?: T;
  } | T;
  error?: {
    code: number;
    message: string;
  };
}

// Constants
const MCP_URL = "/api/mcp-proxy";
const RANDOM_ADDRESSES = Array.from({ length: 5 }, () => 
  "0x" + Array.from({ length: 40 }, () => 
    "abcdef0123456789"[Math.floor(Math.random() * 16)]
  ).join("")
);

// MCP Client
class MCPClient {
  private sessionId: string | null = null;

  async initialize(): Promise<string> {
    const response = await fetch(MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "initialize",
        id: 1,
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "nextjs-frontend", version: "1.0.0" },
        },
      }),
    });

    const sessionId = response.headers.get("mcp-session-id");
    if (!sessionId) {
      throw new Error("Failed to initialize MCP session");
    }

    await fetch(MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "mcp-session-id": sessionId,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "notifications/initialized",
        params: {},
        id: 2,
      }),
    });

    this.sessionId = sessionId;
    return sessionId;
  }

  async callTool<T>(toolName: string, args: Record<string, any>): Promise<T> {
    if (!this.sessionId) {
      await this.initialize();
    }

    const response = await fetch(MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "mcp-session-id": this.sessionId!,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: toolName,
          arguments: args,
        },
        id: Date.now(),
      }),
    });

    const result: MCPResponse<T> = await response.json();
    
    if (result.error) {
      throw new Error(`MCP Error: ${result.error.message}`);
    }

    const data = result.result?.structuredContent || result.result?.content || result.result;
    if (!data) {
      throw new Error("No data received from MCP server");
    }

    return data as T;
  }
}

// Dashboard Component
export default function Dashboard() {
  const [wallets, setWallets] = useState("");
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [positions, setPositions] = useState<DeFiPositions | null>(null);
  const [yields, setYields] = useState<YieldOpportunity[] | null>(null);
  const [prices, setPrices] = useState<TokenPrices | null>(null);

  const mcpClient = useMemo(() => new MCPClient(), []);

  const handleError = useCallback((error: unknown, operation: string) => {
    const message = error instanceof Error ? error.message : `Failed to ${operation}`;
    setError(message);
  }, []);

  const handleFetchData = useCallback(async <T>(
    operation: string,
    toolName: string,
    args: Record<string, any>,
    setter: (data: T) => void
  ) => {
    setLoading(operation);
    setError("");
    
    try {
      const data = await mcpClient.callTool<T>(toolName, args);
      setter(data);
    } catch (error) {
      handleError(error, operation);
    } finally {
      setLoading("");
    }
  }, [mcpClient, handleError]);

  const handleFetchPortfolio = useCallback(() => {
    const walletAddresses = wallets.split(",").map(w => w.trim()).filter(Boolean);
    if (walletAddresses.length === 0) return;
    
    handleFetchData(
      "portfolio",
      "get_portfolio_summary",
      { wallet_addresses: walletAddresses },
      setPortfolio
    );
  }, [wallets, handleFetchData]);

  const handleFetchPositions = useCallback(() => {
    const firstWallet = wallets.split(",")[0]?.trim();
    if (!firstWallet) return;
    
    handleFetchData(
      "positions",
      "get_defi_positions",
      { wallet_address: firstWallet },
      setPositions
    );
  }, [wallets, handleFetchData]);

  const handleFetchYields = useCallback(() => {
    const firstWallet = wallets.split(",")[0]?.trim();
    if (!firstWallet) return;
    
    handleFetchData(
      "yields",
      "get_yield_opportunities",
      { wallet_address: firstWallet, amount: 1000 },
      setYields
    );
  }, [wallets, handleFetchData]);

  const handleFetchPrices = useCallback(() => {
    handleFetchData(
      "prices",
      "get_token_prices",
      { tokens: ["ETH", "USDC", "MATIC"] },
      setPrices
    );
  }, [handleFetchData]);

  const handleAddressBoxClick = useCallback((address: string) => {
    setSelectedAddresses(prev => {
      const newSelected = prev.includes(address)
        ? prev.filter(addr => addr !== address)
        : [...prev, address];
      setWallets(newSelected.join(", "));
      return newSelected;
    });
  }, []);

  const handleWalletInputChange = useCallback((value: string) => {
    setWallets(value);
    setSelectedAddresses([]);
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 flex flex-col gap-8">
      <Card className="p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2">DeFi Dashboard</h1>
        <div className="flex gap-2 items-end">
          <Input
            placeholder="Enter wallet address(es), comma separated"
            value={wallets}
            onChange={e => handleWalletInputChange(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleFetchPortfolio} disabled={!wallets}>
            Portfolio
          </Button>
          <Button onClick={handleFetchPositions} disabled={!wallets}>
            Positions
          </Button>
          <Button onClick={handleFetchYields} disabled={!wallets}>
            Yields
          </Button>
          <Button onClick={handleFetchPrices}>
            Prices
          </Button>
        </div>
        
        <div className="flex gap-2 mt-2 flex-wrap">
          {RANDOM_ADDRESSES.map(address => (
            <button
              key={address}
              type="button"
              onClick={() => handleAddressBoxClick(address)}
              className={`px-3 py-1 rounded-md border text-xs font-mono transition-colors ${
                selectedAddresses.includes(address)
                  ? "bg-gray-900 text-white border-gray-700"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {address}
            </button>
          ))}
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </Card>

      {/* Portfolio Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
        {loading === "portfolio" ? (
          <Skeleton className="h-24 w-full" />
        ) : portfolio ? (
          <div>
            <div className="mb-2">
              Total Value: <span className="font-mono">${portfolio.total_portfolio_value}</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>Balances</TableHead>
                  <TableHead>USD Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.positions.map((position) =>
                  Object.entries(position.balances).map(([chain, balances]) => (
                    <TableRow key={`${position.address}-${chain}`}>
                      <TableCell className="font-mono text-xs">
                        {position.address}
                      </TableCell>
                      <TableCell>{chain}</TableCell>
                      <TableCell>
                        {Object.entries(balances).map(([token, amount]) => (
                          <span key={token} className="mr-2">
                            {token}: {amount}
                          </span>
                        ))}
                      </TableCell>
                      <TableCell>${parseFloat(position.usd_value).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-muted-foreground">No data</div>
        )}
      </Card>

      {/* DeFi Positions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">DeFi Positions</h2>
        {loading === "positions" ? (
          <Skeleton className="h-24 w-full" />
        ) : positions ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Asset/Pair</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>APY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.positions.map((position, index) => (
                <TableRow key={index}>
                  <TableCell>{position.protocol}</TableCell>
                  <TableCell>{position.type}</TableCell>
                  <TableCell>{position.asset || position.pair}</TableCell>
                  <TableCell>{position.amount}</TableCell>
                  <TableCell>{position.apy}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-muted-foreground">No data</div>
        )}
      </Card>

      {/* Yield Opportunities */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Yield Opportunities</h2>
        {loading === "yields" ? (
          <Skeleton className="h-24 w-full" />
        ) : yields ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocol</TableHead>
                <TableHead>APY</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Est. Monthly</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yields.map((yield_opp, index) => (
                <TableRow key={index}>
                  <TableCell>{yield_opp.protocol}</TableCell>
                  <TableCell>{yield_opp.apy}%</TableCell>
                  <TableCell>{yield_opp.risk_score}</TableCell>
                  <TableCell>${yield_opp.estimated_monthly.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-muted-foreground">No data</div>
        )}
      </Card>

      {/* Token Prices */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Token Prices</h2>
        {loading === "prices" ? (
          <Skeleton className="h-12 w-full" />
        ) : prices ? (
          <div className="flex gap-6">
            {Object.entries(prices).map(([token, price]) => (
              <div key={token} className="flex flex-col items-center">
                <span className="font-mono text-lg">{token}</span>
                <span className="text-xl font-bold">${price.usd}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">No data</div>
        )}
      </Card>
    </div>
  );
}
