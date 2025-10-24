export const directoryStructure = `
template/
├── forge/                         # Foundry smart contract development
│   ├── abi/                       # Generated ABIs (auto-created by Makefile)
│   │   └── Counter.json
│   ├── addresses.json             # Deployed contract addresses on Fiber EVM
│   ├── broadcast/                 # Deployment transaction history
│   ├── foundry.lock
│   ├── foundry.toml               # Foundry configuration
│   ├── lib/                       # Foundry dependencies
│   │   └── forge-std/
│   ├── Makefile                   # Use this to deploy contracts (e.g., 'make deploy-counter')
│   ├── out/                       # Compiled contract artifacts
│   ├── README.md
│   ├── script/                    # Deployment scripts - create new ones based on Counter.s.sol
│   │   └── Counter.s.sol
│   ├── src/                       # Write your smart contracts here
│   │   └── Counter.sol
│   └── test/                      # Contract tests
│       └── Counter.t.sol
├── src/                           # Frontend React app
│   ├── App.tsx                    # Main app component
│   ├── assets/
│   │   └── react.svg
│   ├── components/                # React components
│   │   └── Counter.tsx            # Example Component: Read this file to know how to Read/write contracts, watch events
│   ├── config.ts                  # Wagmi/Viem configuration
│   ├── contract_addresses.ts      # Import contract addresses here for frontend
│   ├── global.css
│   ├── hooks/                     # Custom React hooks
│   ├── main.tsx
│   └── utils/
│       └── signers.ts             # Default signer for transactions (always use this)
├── public/
│   └── vite.svg
├── node_modules/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json                   # Scripts: npm run build, npm run dev
├── README.md
├── directory-structure.ts                   # READ THIS FIRST - Directory structure
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
`;

export default directoryStructure;
