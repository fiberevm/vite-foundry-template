import {
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { COUNTER_ADDRESS } from "@/contract_addresses";
import COUNTER_ABI from "@/forge/abis/Counter.json";
import { useQueryClient } from "@tanstack/react-query";
import { defaultSigner } from "@/src/utils/signers";

export function Counter() {
  const queryClient = useQueryClient();
  const {
    data: count,
    isLoading,
    error: readError,
    queryKey: countQueryKey,
  } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    functionName: "number",
  });

  useWatchContractEvent({
    address: COUNTER_ADDRESS,
    abi: COUNTER_ABI,
    eventName: "NumberSet",
    // @ts-expect-error -  "pending" is not typed
    fromBlock: "pending",
    onLogs: (logs) => {
      console.log("logs", logs);
      // @ts-expect-error - logs is not typed
      const count = logs[0].args.newNumber;
      queryClient.setQueryData(countQueryKey, count);
    },
  });

  const { writeContractAsync, isPending, isSuccess } = useWriteContract();

  const handleIncrement = async () => {
    try {
      const tx = await writeContractAsync({
        account: defaultSigner,
        address: COUNTER_ADDRESS,
        abi: COUNTER_ABI,
        functionName: "increment",
        // Always set gasPrice to 0n for gasless transactions
        gasPrice: 0n,
      });

      console.log("tx", tx);
    } catch (error) {
      console.error("Failed to increment:", error);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Counter Contract</h2>
      <div style={{ fontSize: "2rem", margin: "1rem 0" }}>
        Count: {isLoading ? "Loading..." : count?.toString() ?? "N/A"}
      </div>
      {readError && (
        <div style={{ marginTop: "0.5rem", color: "#f87171" }}>
          Error: {readError.message}
        </div>
      )}
      <button
        onClick={handleIncrement}
        disabled={isPending}
        style={{
          padding: "0.6em 1.2em",
          fontSize: "1em",
          fontWeight: 500,
          fontFamily: "inherit",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? "Processing..." : "Increment"}
      </button>
      {/* {txResult?.hash && (
        <div style={{ marginTop: "1rem", fontSize: "0.9em" }}>
          Transaction Hash: {txResult.hash.slice(0, 10)}...
          {txResult.hash.slice(-8)}
        </div>
      )} */}
      {isSuccess && (
        <div style={{ marginTop: "0.5rem", color: "#4ade80" }}>
          Transaction confirmed! ✓
        </div>
      )}
    </div>
  );
}
