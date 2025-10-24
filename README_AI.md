# Project Structure Documentation

This is a **Vite + Foundry Template** project that combines:

- **Frontend**: React + TypeScript + Vite
- **Smart Contracts**: Foundry (Ethereum development framework)

---

## 📁 Root Directory Structure

```
template/
│
├── 🎨 FRONTEND (Vite + React)
│   ├── src/                          # React application source code
│   │   ├── App.tsx                   # Main App component
│   │   ├── App.css                   # App styles
│   │   ├── main.tsx                  # Application entry point
│   │   ├── index.css                 # Global styles
│   │   └── assets/                   # Static assets (images, icons)
│   │       └── react.svg
│   │
│   ├── public/                       # Public static files served directly
│   │   └── vite.svg
│   │
│   ├── index.html                    # HTML entry point
│   ├── vite.config.ts                # Vite build tool configuration
│   ├── package.json                  # NPM dependencies and scripts
│   ├── tsconfig.json                 # TypeScript configuration (base)
│   ├── tsconfig.app.json             # TypeScript config for app code
│   ├── tsconfig.node.json            # TypeScript config for Node/build tools
│   ├── eslint.config.js              # ESLint linting configuration
│   └── bun.lock                      # Bun package manager lock file
│
├── ⛓️ SMART CONTRACTS (Foundry)
│   └── forge/                        # Foundry project root
│       │
│       ├── src/                      # Smart contract source code
│       │   └── Counter.sol           # Example Counter contract
│       │
│       ├── script/                   # Deployment and interaction scripts
│       │   └── Counter.s.sol         # Counter deployment script
│       │
│       ├── test/                     # Smart contract tests
│       │   └── Counter.t.sol         # Counter contract tests
│       │
│       ├── lib/                      # External dependencies (git submodules)
│       │   └── forge-std/            # Foundry Standard Library (testing utilities)
│       │       ├── src/              # Standard library source
│       │       │   ├── Test.sol      # Base test contract
│       │       │   ├── Script.sol    # Base script contract
│       │       │   ├── console.sol   # Console logging
│       │       │   ├── Vm.sol        # Cheatcodes interface
│       │       │   └── interfaces/   # Standard interfaces (ERC20, ERC721, etc.)
│       │       └── test/             # Standard library tests
│       │
│       ├── out/                      # Compiled contract artifacts (build output)
│       │   ├── Counter.sol/
│       │   │   └── Counter.json      # Compiled Counter contract (ABI, bytecode)
│       │   └── build-info/           # Detailed build information
│       │
│       ├── cache/                    # Build cache for faster compilation
│       │   └── solidity-files-cache.json
│       │
│       ├── logs/                     # Deployment and script execution logs
│       │   └── counter_deployment.log
│       │
│       ├── addresses.json            # Deployed contract addresses by network
│       ├── foundry.toml              # Foundry configuration (RPC URLs, compiler settings)
│       ├── foundry.lock              # Foundry dependencies lock file
│       ├── Makefile                  # Make commands for common Foundry operations
│       └── README.md                 # Foundry project documentation
│
├── 🔗 INTEGRATION
│   └── contract_addresses.ts         # TypeScript file importing contract addresses
│                                      # (bridges forge/addresses.json to frontend)
│
└── 📚 DOCUMENTATION
    ├── README.md                     # Main project README (human-readable)
    └── README_AI.md                  # This file (AI-readable structure guide)
```
