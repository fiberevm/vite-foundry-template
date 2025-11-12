import type { ExtractAbiEvent } from "abitype";
import type {
  Abi,
  Address,
  BlockNumber,
  Chain,
  Client,
  ContractEventName,
  Log,
  LogTopic,
  Transport,
} from "viem";
import {
  type WatchContractEventParameters as viem_WatchContractEventParameters,
  watchContractEvent as viem_watchContractEvent,
} from "viem/actions";
import {
  decodeEventLog,
  type EncodeEventTopicsParameters,
  encodeEventTopics,
  formatLog,
} from "viem/utils";

// Removed observe() - we don't need it since each hook instance gets its own subscription

// Error classes - copied since they're not exported
class DecodeLogDataMismatch extends Error {
  abiItem: any;
  constructor({ abiItem }: { abiItem: any }) {
    super("Data size does not match given ABI.");
    this.name = "DecodeLogDataMismatch";
    this.abiItem = abiItem;
  }
}

class DecodeLogTopicsMismatch extends Error {
  abiItem: any;
  constructor({ abiItem }: { abiItem: any }) {
    super("Topics length does not match given ABI.");
    this.name = "DecodeLogTopicsMismatch";
    this.abiItem = abiItem;
  }
}

export type WatchContractEventOnLogsParameter<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> = ContractEventName<abi>,
  strict extends boolean | undefined = undefined
> = abi extends Abi
  ? Abi extends abi
    ? Log[]
    : Log<bigint, number, false, ExtractAbiEvent<abi, eventName>, strict>[]
  : Log[];

export type WatchContractEventOnLogsFn<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> = ContractEventName<abi>,
  strict extends boolean | undefined = undefined
> = (logs: WatchContractEventOnLogsParameter<abi, eventName, strict>) => void;

export type WatchContractEventParameters<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> | undefined = ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  transport extends Transport = Transport
> = {
  /** The address of the contract. */
  address?: Address | Address[] | undefined;
  /** Contract ABI. */
  abi: abi;
  args?:
    | viem_WatchContractEventParameters<abi, eventName, strict>["args"]
    | undefined;
  /** Contract event. */
  eventName?: eventName | ContractEventName<abi> | undefined;
  /** Block to start listening from. */
  fromBlock?: BlockNumber<bigint> | "pending" | undefined;
  /** The callback to call when an error occurred when trying to get for a new block. */
  onError?: ((error: Error) => void) | undefined;
  /** The callback to call when new event logs are received. */
  onLogs: WatchContractEventOnLogsFn<
    abi,
    eventName extends ContractEventName<abi>
      ? eventName
      : ContractEventName<abi>,
    strict
  >;
  /**
   * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
   * @default false
   */
  strict?: strict | boolean | undefined;
  /** Polling interval (only used when polling, not websocket) */
  pollingInterval?: number | undefined;
  /** Whether to use polling instead of websocket */
  poll?: boolean | undefined;
  /** Whether to batch logs */
  batch?: boolean | undefined;
};

export type WatchContractEventReturnType = () => void;

/**
 * Custom watchContractEvent that extends viem's implementation to support
 * passing fromBlock to websocket subscriptions.
 */
export function watchContractEvent<
  chain extends Chain | undefined,
  const abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi> | undefined = undefined,
  strict extends boolean | undefined = undefined,
  transport extends Transport = Transport
>(
  client: Client<transport, chain>,
  parameters: WatchContractEventParameters<abi, eventName, strict, transport>
): WatchContractEventReturnType {
  const {
    abi,
    address,
    args,
    batch = true,
    eventName,
    fromBlock,
    onError,
    onLogs,
    poll: poll_,
    pollingInterval,
    strict: strict_,
  } = parameters;

  const enablePolling = (() => {
    if (typeof poll_ !== "undefined") return poll_;
    if (typeof fromBlock === "bigint") return true;
    if (
      client.transport.type === "webSocket" ||
      client.transport.type === "ipc"
    )
      return false;
    if (
      client.transport.type === "fallback" &&
      (client.transport.transports[0].config.type === "webSocket" ||
        client.transport.transports[0].config.type === "ipc")
    )
      return false;
    return true;
  })();

  // If polling is enabled or fromBlock is a bigint, use viem's default implementation
  if (enablePolling) {
    return viem_watchContractEvent(client, {
      abi,
      address,
      args,
      batch,
      eventName,
      fromBlock,
      onError,
      onLogs,
      poll: poll_,
      pollingInterval,
      strict: strict_,
    } as any);
  }

  // Custom websocket subscription that includes fromBlock
  // Don't use observe() here - each hook instance should have its own subscription
  // to avoid duplicate events when callbacks change
  const strict = strict_ ?? false;
  let active = true;
  let unsubscribe: (() => void) | null = null;

  (async () => {
    try {
      const transport = (() => {
        if (client.transport.type === "fallback") {
          const transport = client.transport.transports.find(
            (transport: ReturnType<Transport>) =>
              transport.config.type === "webSocket" ||
              transport.config.type === "ipc"
          );
          if (!transport) return client.transport;
          return transport.value;
        }
        return client.transport;
      })();

      const topics: LogTopic[] = eventName
        ? encodeEventTopics({
            abi: abi,
            eventName: eventName,
            args,
          } as EncodeEventTopicsParameters)
        : [];

      // Build subscribe params - include fromBlock if provided
      const subscribeParams: any = {
        address,
        topics,
      };

      // Add fromBlock if it's "pending" or a bigint
      if (fromBlock !== undefined) {
        subscribeParams.fromBlock = fromBlock;
      }

      const { unsubscribe: unsubscribe_ } = await transport.subscribe({
        params: ["logs", subscribeParams],
        onData(data: any) {
          if (!active) return;
          const log = data.result;
          try {
            const { eventName, args } = decodeEventLog({
              abi: abi,
              data: log.data,
              topics: log.topics as any,
              strict: strict_,
            });
            const formatted = formatLog(log, {
              args,
              eventName: eventName as string,
            });
            if (batch) {
              // Collect logs and emit in batch
              const logs: any[] = [formatted];
              onLogs(logs as any);
            } else {
              onLogs([formatted] as any);
            }
          } catch (err) {
            let eventName: string | undefined;
            let isUnnamed: boolean | undefined;
            if (
              err instanceof DecodeLogDataMismatch ||
              err instanceof DecodeLogTopicsMismatch
            ) {
              // If strict mode is on, and log data/topics do not match event definition, skip.
              if (strict_) return;
              eventName = err.abiItem.name;
              isUnnamed = err.abiItem.inputs?.some(
                (x: { name?: string }) => !("name" in x && x.name)
              );
            }

            // Set args to empty if there is an error decoding (e.g. indexed/non-indexed params mismatch).
            const formatted = formatLog(log, {
              args: isUnnamed ? [] : {},
              eventName,
            });
            onLogs([formatted] as any);
          }
        },
        onError(error: Error) {
          onError?.(error);
        },
      });
      unsubscribe = unsubscribe_;
      if (!active && unsubscribe) {
        unsubscribe();
      }
    } catch (err) {
      onError?.(err as Error);
    }
  })();

  return () => {
    active = false;
    if (unsubscribe) {
      unsubscribe();
    }
  };
}
