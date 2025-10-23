// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

contract CounterScript is Script {
    Counter public counter;

    function setUp() public {}

    function run() public {
        // Compute the expected address for the next deployment
        address deployer = msg.sender;
        uint64 nonce = vm.getNonce(deployer);
        address expectedAddress = vm.computeCreateAddress(deployer, nonce);

        vm.startBroadcast();

        // Check if a contract already exists at the expected address
        if (expectedAddress.code.length > 0) {
            console.log("Counter already deployed at:", expectedAddress);
            counter = Counter(expectedAddress);
        } else {
            console.log("Deploying new Counter...");
            counter = new Counter();
            console.log("Counter deployed at:", address(counter));
        }

        vm.stopBroadcast();

        string memory addressStr = vm.toString(address(counter));
        vm.writeJson(addressStr, "./addresses.json", ".Counter");
    }
}
