import {
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { COUNTER_ADDRESS } from "@/src/contract_addresses";
import COUNTER_ABI from "@/forge/abi/Counter.json";
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
    <div className="space-y-8 w-full max-w-md">
      <div className="space-y-4">
        <div className="text-gray-500 text-sm font-medium tracking-wider">
          02
        </div>
        <h2 className="text-3xl font-normal text-white">Counter Contract</h2>
      </div>

      <div className="space-y-6">
        <div className="text-6xl font-light text-white tabular-nums">
          {isLoading ? (
            <span className="text-gray-600">...</span>
          ) : (
            count?.toString() ?? "N/A"
          )}
        </div>

        {readError && (
          <div className="text-red-400 text-sm">Error: {readError.message}</div>
        )}

        <button
          onClick={handleIncrement}
          className="px-8 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
        >
          Increment
        </button>

        {isPending && (
          <div className="text-yellow-400 text-sm flex items-center gap-2">
            <span>...</span>
            <span>Transaction pending</span>
          </div>
        )}

        {isSuccess && (
          <div className="text-green-400 text-sm flex items-center gap-2">
            <span>✓</span>
            <span>Transaction confirmed</span>
          </div>
        )}
      </div>
    </div>
  );
}
