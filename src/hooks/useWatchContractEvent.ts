"use client";

import type { Config, ResolvedRegister } from "@wagmi/core";
import type { UnionCompute, UnionExactPartial } from "@wagmi/core/internal";
import { useEffect, useRef } from "react";
import type { Abi, ContractEventName } from "viem";
import { useChainId, useConfig } from "wagmi";
import {
  type WatchContractEventParameters,
  watchContractEvent,
} from "../utils/watchContractEvent";

export type UseWatchContractEventParameters<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> = ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = UnionCompute<
  UnionExactPartial<
    WatchContractEventParameters<abi, eventName, strict> &
      ConfigParameter<config> &
      EnabledParameter &
      ChainIdParameter<config, chainId>
  >
>;

type ConfigParameter<config extends Config = Config> = {
  config?: config | Config | undefined;
};

type EnabledParameter = {
  enabled?: boolean | undefined;
};

type ChainIdParameter<
  config extends Config = Config,
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"]
> = {
  chainId?: chainId | config["chains"][number]["id"] | undefined;
};

export type UseWatchContractEventReturnType = void;

/**
 * Custom hook to watch contract events that supports passing fromBlock to websocket subscriptions.
 * This is identical to wagmi's useWatchContractEvent but uses our custom implementation
 * that properly passes fromBlock to websocket subscriptions.
 */
export function useWatchContractEvent<
  const abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] = config["chains"][number]["id"]
>(
  parameters: UseWatchContractEventParameters<
    abi,
    eventName,
    strict,
    config,
    chainId
  > = {} as UseWatchContractEventParameters<
    abi,
    eventName,
    strict,
    config,
    chainId
  >
): UseWatchContractEventReturnType {
  const {
    enabled = true,
    onLogs,
    config: _,
    chainId: chainIdParam,
    ...rest
  } = parameters;

  const config = useConfig(parameters);
  const configChainId = useChainId({ config });
  const chainId = chainIdParam ?? configChainId;
  const unwatchRef = useRef<(() => void) | null>(null);

  // TODO(react@19): cleanup
  // biome-ignore lint/correctness/useExhaustiveDependencies: `rest` changes every render so only including properties in dependency array
  useEffect(() => {
    if (!enabled) return;
    if (!onLogs) return;

    // Clean up previous subscription before creating a new one
    if (unwatchRef.current) {
      unwatchRef.current();
      unwatchRef.current = null;
    }

    const client = config.getClient({ chainId });
    const unwatch = watchContractEvent(client, {
      ...rest,
      onLogs,
    } as WatchContractEventParameters<abi, eventName, strict>);

    unwatchRef.current = unwatch;

    return () => {
      if (unwatchRef.current) {
        unwatchRef.current();
        unwatchRef.current = null;
      }
    };
  }, [
    chainId,
    config,
    enabled,
    onLogs,
    ///
    rest.abi,
    rest.address,
    rest.args,
    rest.batch,
    rest.eventName,
    rest.fromBlock,
    rest.onError,
    rest.poll,
    rest.pollingInterval,
    rest.strict,
  ]);
}
