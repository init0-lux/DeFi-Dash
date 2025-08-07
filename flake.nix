{
    description = "MCP-enabled DeFi Dashboard development environment";

    inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
        flake-utils.url = "github:numtide/flake-utils";
    };

    outputs = { self, nixpkgs, flake-utils }:
        flake-utils.lib.eachDefaultSystem (system:
            let
                pkgs = import nixpkgs { inherit system; };

                pythonPackages = ps: with ps; [
                    httpx
                    python-dotenv
                    fastapi
                    fastmcp
                    uvicorn
                    requests
                    aiofiles
                    pydantic
                    typing-extensions
                    pip
                ];

                pythonEnv = pkgs.python3.withPackages pythonPackages;
            in
            {
                devShells.default = pkgs.mkShell {
                    buildInputs = with pkgs; [
                        nodejs_20
                        pythonEnv
                        git
                        curl
                        jq
                        ripgrep
                        fd
                        direnv

                        # Additional Node Packages
                        nodePackages.typescript
                        nodePackages.npm
                        nodePackages.yarn
                    ];

                    shellHook = ''
                        echo "🚀 MCP DeFi Dashboard Development Environment"
                        echo "📦 Node.js $(node --version)"
                        echo "📦 Python $(python --version)"
                        echo "📦 npm $(npm --version)"
                        echo ""
                        echo "💡 Run 'npm create next-app@latest' to start the frontend"
                        echo "💡 FastMCP available for MCP server development"
                        echo ""

                        # Set environment variables
                        export NODE_ENV=development
                        export PYTHONPATH="$PWD/mcp_server:$PYTHONPATH"

                        # Create project directories if they don't exist
                        mkdir -p mcp_server
                        mkdir -p frontend

                        # Install FastMCP if not already installed
                        if ! python -c "import fastmcp" 2>/dev/null; then
                          echo "Installing FastMCP..."
                          pip install --user fastmcp
                        fi
                      '';

                      # Environment variables
                      PROJECT_NAME = "defi-dashboard";
                      MCP_SERVER_PORT = "8000";
                      NEXT_PORT = "3000";
                };
            });
}
