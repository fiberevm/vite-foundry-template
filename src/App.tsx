import { useAccount } from "wagmi";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Account } from "./components/Account";
import { WalletOptions } from "./components/WalletOptions";
import { Counter } from "./components/Counter";

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected)
    return (
      <>
        <Account />
        <Counter />
      </>
    );
  return <WalletOptions />;
}

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Foundry</h1>
      <div className="card">
        <h2>Connect Your Wallet</h2>
        <ConnectWallet />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
