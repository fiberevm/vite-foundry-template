import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
      }}
    >
      {ensAvatar && (
        <img
          alt="ENS Avatar"
          src={ensAvatar}
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      )}
      {address && (
        <div style={{ fontSize: "14px", fontFamily: "monospace" }}>
          {ensName
            ? `${ensName} (${address.slice(0, 6)}...${address.slice(-4)})`
            : `${address.slice(0, 6)}...${address.slice(-4)}`}
        </div>
      )}
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}
